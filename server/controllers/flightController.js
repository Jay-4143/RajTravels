/**
 * Flight Controller
 * Search, filter, sort, details, booking
 * Now powered by Amadeus API for live flight data
 */

const mongoose = require('mongoose');
const Flight = require('../models/flight');
const amadeusService = require('../services/amadeusService');
const { transformFlightOffers } = require('../utils/amadeusTransformers');

/**
 * @desc    Search flights via Amadeus API
 * @route   GET /api/flights/search
 * @access  Public
 */
exports.searchFlights = async (req, res, next) => {
  try {
    const {
      from,
      to,
      departureDate,
      returnDate,
      segments: segmentsJson,
      passengers = 1,
      class: flightClass,
      sort = 'price',
      order = 'asc',
      airline,
      minPrice,
      maxPrice,
      maxStops,
      refundable,
      page = 1,
      limit = 20,
    } = req.query;

    // Map travelClass from frontend format to Amadeus format
    const classMap = {
      economy: 'ECONOMY',
      premium_economy: 'PREMIUM_ECONOMY',
      business: 'BUSINESS',
      first: 'FIRST',
    };

    // ── Handle Multi-City ──
    if (segmentsJson) {
      try {
        const segments = JSON.parse(segmentsJson);
        const amResponse = await amadeusService.searchMultiCityFlightOffers({
          segments,
          adults: parseInt(passengers) || 1,
          travelClass: classMap[flightClass]
        });
        const flights = transformFlightOffers(amResponse.data, amResponse.result?.dictionaries || {});
        return res.json({
          success: true,
          flights,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: flights.length,
            pages: 1
          }
        });
      } catch (err) {
        console.error('Multi-city Search Error:', err.message);
        throw err; // Let catch block handle it
      }
    }

    if (!from || !to || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'from, to, and departureDate are required',
      });
    }

    const amadeusParams = {
      origin: from.toUpperCase(),
      destination: to.toUpperCase(),
      departureDate,
      adults: parseInt(passengers) || 1,
      max: 50,
    };
    if (returnDate) amadeusParams.returnDate = returnDate;
    if (flightClass && classMap[flightClass]) amadeusParams.travelClass = classMap[flightClass];
    if (maxStops !== undefined) amadeusParams.maxStops = parseInt(maxStops);

    const response = await amadeusService.searchFlightOffers(amadeusParams);
    let flights = transformFlightOffers(response.data, response.result?.dictionaries || {});

    // ── Client-side filters (post-Amadeus) ──
    if (airline) {
      const re = new RegExp(airline, 'i');
      flights = flights.filter(f => re.test(f.airline) || re.test(f.airlineCode));
    }
    if (minPrice) flights = flights.filter(f => f.price >= parseInt(minPrice));
    if (maxPrice) flights = flights.filter(f => f.price <= parseInt(maxPrice));
    if (refundable === 'true') flights = flights.filter(f => f.refundable);

    // ── Sorting ──
    if (sort === 'price') {
      flights.sort((a, b) => order === 'desc' ? b.price - a.price : a.price - b.price);
    } else if (sort === 'duration') {
      flights.sort((a, b) => {
        const dA = parseInt(a.duration?.match(/\d+/)?.[0] || 0) * 60 + parseInt(a.duration?.match(/(\d+)m/)?.[1] || 0);
        const dB = parseInt(b.duration?.match(/\d+/)?.[0] || 0) * 60 + parseInt(b.duration?.match(/(\d+)m/)?.[1] || 0);
        return dA - dB;
      });
    } else if (sort === 'departure') {
      flights.sort((a, b) => {
        const tA = new Date(a.departureTime).getTime();
        const tB = new Date(b.departureTime).getTime();
        return order === 'desc' ? tB - tA : tA - tB;
      });
    }

    // ── Pagination ──
    const total = flights.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paged = flights.slice(skip, skip + parseInt(limit));

    // Separate return flights for round-trip display
    const outboundFlights = paged.map(f => {
      const { returnFlight, ...outbound } = f;
      return outbound;
    });

    const returnFlights = returnDate
      ? paged.filter(f => f.returnFlight).map(f => f.returnFlight)
      : [];

    res.json({
      success: true,
      flights: outboundFlights,
      returnFlights,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Amadeus Flight Search Error:', error.description || error.message);

    // Fallback to MongoDB if Amadeus fails
    try {
      console.log('Falling back to local MongoDB flight search...');
      return exports._localSearchFlights(req, res, next);
    } catch (fallbackErr) {
      next(fallbackErr);
    }
  }
};

/**
 * @desc    Fallback: Search flights from local MongoDB
 */
exports._localSearchFlights = async (req, res, next) => {
  try {
    const {
      from, to, departureDate, returnDate,
      passengers = 1, class: flightClass,
      sort = 'price', order = 'asc',
      airline, minPrice, maxPrice, maxStops,
      page = 1, limit = 20,
    } = req.query;

    const query = {
      from: new RegExp(from, 'i'),
      to: new RegExp(to, 'i'),
      isActive: true,
      seatsAvailable: { $gte: parseInt(passengers) || 1 },
    };
    const depDate = new Date(departureDate);
    depDate.setHours(0, 0, 0, 0);
    const depDateEnd = new Date(depDate);
    depDateEnd.setDate(depDateEnd.getDate() + 1);
    query.departureDate = { $gte: depDate, $lt: depDateEnd };
    if (airline) query.airline = new RegExp(airline, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (maxStops !== undefined) query.stops = { $lte: parseInt(maxStops) };
    if (flightClass) query.class = flightClass;

    const sortObj = {};
    if (sort === 'price') sortObj.price = order === 'desc' ? -1 : 1;
    else if (sort === 'duration') sortObj.duration = 1;
    else if (sort === 'departure') sortObj.departureTime = order === 'desc' ? -1 : 1;
    else sortObj.price = 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const flights = await Flight.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean();
    const total = await Flight.countDocuments(query);

    const response = { success: true, flights, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } };

    if (returnDate) {
      const returnQuery = { from: new RegExp(to, 'i'), to: new RegExp(from, 'i'), isActive: true, seatsAvailable: { $gte: parseInt(passengers) || 1 } };
      const retDate = new Date(returnDate);
      retDate.setHours(0, 0, 0, 0);
      const retDateEnd = new Date(retDate);
      retDateEnd.setDate(retDateEnd.getDate() + 1);
      returnQuery.departureDate = { $gte: retDate, $lt: retDateEnd };
      const returnFlights = await Flight.find(returnQuery).sort(sortObj).skip(skip).limit(parseInt(limit)).lean();
      response.returnFlights = returnFlights;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all flights (with pagination)
 * @route   GET /api/flights
 * @access  Public
 */
exports.getAllFlights = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const flights = await Flight.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    const total = await Flight.countDocuments({ isActive: true });
    res.json({
      success: true,
      flights,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get flight by ID
 * @route   GET /api/flights/:id
 * @access  Public
 */
exports.getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.json({ success: true, flight });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get available seats for a flight
 * @route   GET /api/flights/:id/seats
 * @access  Public
 */
exports.getAvailableSeats = async (req, res, next) => {
  try {
    const flightId = req.params.id;
    let seatsAvailable = 150; // Default fallback for external flights

    if (mongoose.Types.ObjectId.isValid(flightId)) {
      const flight = await Flight.findById(flightId);
      if (flight) {
        seatsAvailable = flight.seatsAvailable;
      }
    }

    const rows = Math.ceil(seatsAvailable / 6);
    const availableSeats = [];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    // Generate simple seat map based on available count
    for (let r = 1; r <= rows; r++) {
      for (const l of letters) {
        const seat = `${r}${l}`;
        // In a real app, we'd check against a 'BookedSeats' collection
        availableSeats.push(seat);
      }
    }

    res.json({
      success: true,
      availableSeats: availableSeats.slice(0, seatsAvailable),
      totalAvailable: seatsAvailable
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate flight price with taxes and convenience fee
 * @route   POST /api/flights/:id/calculate-price
 * @access  Public
 */
exports.calculatePrice = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    const { passengers = 1 } = req.body;
    const baseFare = flight.price * parseInt(passengers);
    const taxPercent = 0.18;
    const taxAmount = Math.round(baseFare * taxPercent);
    const convenienceFee = 199 * parseInt(passengers);
    const total = baseFare + taxAmount + convenienceFee;

    res.json({
      success: true,
      breakdown: {
        baseFare,
        taxAmount,
        convenienceFee,
        total,
        perPassenger: Math.round(total / passengers),
      },
      passengers: parseInt(passengers),
    });
  } catch (error) {
    next(error);
  }
};
