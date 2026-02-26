/**
 * Flight Controller
 * Search, filter, sort, details, booking
 * Now powered by Amadeus API for live flight data
 */

const mongoose = require('mongoose');
const Flight = require('../models/flight');
const amadeusService = require('../services/amadeusService');
const { transformFlightOffers } = require('../utils/amadeusTransformers');
const fs = require('fs');

const debugLog = (msg) => {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${msg}\n`;
  fs.appendFileSync('debug.log', logMsg);
};

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
      departureTimeFrom,
      departureTimeTo,
      arrivalTimeFrom,
      arrivalTimeTo,
      page = 1,
      limit = 20,
    } = req.query;

    debugLog(`FULL URL: ${req.originalUrl}`);
    debugLog(`RAW QUERY: ${JSON.stringify(req.query)}`);

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
    const paxCount = parseInt(passengers) || 1;
    debugLog(`Filtering flights: paxCount=${paxCount}, minPrice=${minPrice}, maxPrice=${maxPrice}`);

    if (minPrice) {
      const min = parseInt(minPrice);
      flights = flights.filter(f => (f.price / paxCount) >= min);
    }
    if (maxPrice) {
      const max = parseInt(maxPrice);
      const beforeCount = flights.length;
      flights = flights.filter(f => (f.price / paxCount) <= max);
      debugLog(`MaxPrice ${max} filter: Before=${beforeCount}, After=${flights.length}`);
    }

    if (refundable === 'true') flights = flights.filter(f => f.refundable);

    // ── Exact stops filter ──
    if (maxStops !== undefined && maxStops !== '') {
      const s = parseInt(maxStops);
      debugLog(`Parsed maxStops: ${s}`);
      const beforeFilter = flights.length;
      if (s === 0) flights = flights.filter(f => f.stops === 0);
      else if (s === 1) flights = flights.filter(f => f.stops === 1);
      else if (s === 2) flights = flights.filter(f => f.stops >= 2);
      debugLog(`Stop filter applied. Before: ${beforeFilter}, After: ${flights.length}`);
    }

    if (departureTimeFrom && departureTimeTo) {
      flights = flights.filter(f => {
        const time = (f.departureTime || "").split('T')[1]?.substring(0, 5);
        if (!time) return false;
        if (departureTimeFrom <= departureTimeTo) {
          return time >= departureTimeFrom && time <= departureTimeTo;
        } else {
          return time >= departureTimeFrom || time <= departureTimeTo;
        }
      });
    }

    if (arrivalTimeFrom && arrivalTimeTo) {
      flights = flights.filter(f => {
        const time = (f.arrivalTime || "").split('T')[1]?.substring(0, 5);
        if (!time) return false;
        if (arrivalTimeFrom <= arrivalTimeTo) {
          return time >= arrivalTimeFrom && time <= arrivalTimeTo;
        } else {
          return time >= arrivalTimeFrom || time <= arrivalTimeTo;
        }
      });
    }

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
    } else if (sort === 'arrival') {
      flights.sort((a, b) => {
        const tA = new Date(a.arrivalTime).getTime();
        const tB = new Date(b.arrivalTime).getTime();
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
      departureTimeFrom, departureTimeTo,
      arrivalTimeFrom, arrivalTimeTo,
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
    // We filter by per-person price after the query for accuracy
    const paxCount = parseInt(passengers) || 1;
    if (maxStops !== undefined) {
      const s = parseInt(maxStops);
      if (s === 0) query.stops = 0;
      else if (s === 1) query.stops = 1;
      else if (s === 2) query.stops = { $gte: 2 };
    }
    if (flightClass) query.class = flightClass;

    const sortObj = {};
    if (sort === 'price') sortObj.price = order === 'desc' ? -1 : 1;
    else if (sort === 'duration') sortObj.duration = 1;
    else if (sort === 'departure') sortObj.departureTime = order === 'desc' ? -1 : 1;
    else if (sort === 'arrival') sortObj.arrivalTime = order === 'desc' ? -1 : 1;
    else sortObj.price = 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalBeforeFilter = await Flight.countDocuments(query);
    let flights = await Flight.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean();

    // Post-query filtering for per-person price
    if (minPrice || maxPrice) {
      flights = flights.filter(f => {
        const perPerson = f.price / paxCount;
        if (minPrice && perPerson < parseInt(minPrice)) return false;
        if (maxPrice && perPerson > parseInt(maxPrice)) return false;
        return true;
      });
    }
    const total = flights.length; // Approximate total after filtering

    if (departureTimeFrom && departureTimeTo) {
      flights = flights.filter(f => {
        const time = (f.departureTime || "").split('T')[1]?.substring(0, 5);
        if (!time) return false;
        if (departureTimeFrom <= departureTimeTo) {
          return time >= departureTimeFrom && time <= departureTimeTo;
        } else {
          return time >= departureTimeFrom || time <= departureTimeTo;
        }
      });
    }

    if (arrivalTimeFrom && arrivalTimeTo) {
      flights = flights.filter(f => {
        const time = (f.arrivalTime || "").split('T')[1]?.substring(0, 5);
        if (!time) return false;
        if (arrivalTimeFrom <= arrivalTimeTo) {
          return time >= arrivalTimeFrom && time <= arrivalTimeTo;
        } else {
          return time >= arrivalTimeFrom || time <= arrivalTimeTo;
        }
      });
    }

    // Map local results to include segments if stops > 0
    const flightsWithSegments = flights.map(f => {
      const segments = [];
      if (f.stops > 0) {
        // Fallback to if stopCities is missing
        const cityList = (f.stopCities && f.stopCities.length > 0) ? f.stopCities : ["BDQ"];

        // Segment 1: Origin to first stop
        segments.push({
          flightNumber: f.flightNumber,
          airline: f.airline,
          from: f.from,
          to: cityList[0],
          fromCity: f.fromCity || f.from,
          toCity: cityList[0] === "BDQ" ? "Vadodara" : cityList[0],
          fromAirport: f.fromAirport || `${f.from} International Airport`,
          toAirport: cityList[0] === "BDQ" ? "Vadodara Airport" : `${cityList[0]} International Airport`,
          departureTime: f.departureTime,
          arrivalTime: new Date(new Date(f.departureTime).getTime() + 2 * 3600000).toISOString(),
          duration: "2h 0m",
          aircraft: "Airbus Jet",
          layoverDuration: "1h 30m"
        });
        // Segment 2: Last stop to destination
        segments.push({
          flightNumber: f.flightNumber,
          airline: f.airline,
          from: cityList[cityList.length - 1],
          to: f.to,
          fromCity: cityList[cityList.length - 1] === "BDQ" ? "Vadodara" : cityList[cityList.length - 1],
          toCity: f.toCity || f.to,
          fromAirport: cityList[cityList.length - 1] === "BDQ" ? "Vadodara Airport" : `${cityList[cityList.length - 1]} International Airport`,
          toAirport: f.toAirport || `${f.to} International Airport`,
          departureTime: new Date(new Date(f.arrivalTime).getTime() - 2 * 3600000).toISOString(),
          arrivalTime: f.arrivalTime,
          duration: "2h 0m",
          aircraft: "Airbus Jet"
        });
      }
      return { ...f, segments };
    });

    const response = {
      success: true,
      flights: flightsWithSegments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    };

    if (returnDate) {
      const returnQuery = { from: new RegExp(to, 'i'), to: new RegExp(from, 'i'), isActive: true, seatsAvailable: { $gte: parseInt(passengers) || 1 } };
      const retDate = new Date(returnDate);
      retDate.setHours(0, 0, 0, 0);
      const retDateEnd = new Date(retDate);
      retDateEnd.setDate(retDateEnd.getDate() + 1);
      returnQuery.departureDate = { $gte: retDate, $lt: retDateEnd };
      const returnFlights = await Flight.find(returnQuery).sort(sortObj).skip(skip).limit(parseInt(limit)).lean();
      const returnFlightsWithSegments = returnFlights.map(f => {
        const segments = [];
        if (f.stops > 0) {
          const cityList = (f.stopCities && f.stopCities.length > 0) ? f.stopCities : ["BDQ"];
          segments.push({
            flightNumber: f.flightNumber,
            airline: f.airline,
            from: f.from,
            to: cityList[0],
            fromCity: f.fromCity || f.from,
            toCity: cityList[0] === "BDQ" ? "Vadodara" : cityList[0],
            fromAirport: f.fromAirport || `${f.from} International Airport`,
            toAirport: cityList[0] === "BDQ" ? "Vadodara Airport" : `${cityList[0]} International Airport`,
            departureTime: f.departureTime,
            arrivalTime: new Date(new Date(f.departureTime).getTime() + 2 * 3600000).toISOString(),
            duration: "2h 0m",
            aircraft: "Airbus Jet",
            layoverDuration: "1h 30m"
          });
          segments.push({
            flightNumber: f.flightNumber,
            airline: f.airline,
            from: cityList[cityList.length - 1],
            to: f.to,
            fromCity: cityList[cityList.length - 1] === "BDQ" ? "Vadodara" : cityList[cityList.length - 1],
            toCity: f.toCity || f.to,
            fromAirport: cityList[cityList.length - 1] === "BDQ" ? "Vadodara Airport" : `${cityList[cityList.length - 1]} International Airport`,
            toAirport: f.toAirport || `${f.to} International Airport`,
            departureTime: new Date(new Date(f.arrivalTime).getTime() - 2 * 3600000).toISOString(),
            arrivalTime: f.arrivalTime,
            duration: "2h 0m",
            aircraft: "Airbus Jet"
          });
        }
        return { ...f, segments };
      });
      response.returnFlights = returnFlightsWithSegments;
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
    const flightsWithSegments = flights.map(f => {
      const segments = [];
      if (f.stops > 0) {
        const cityList = (f.stopCities && f.stopCities.length > 0) ? f.stopCities : ["BDQ"];
        segments.push({
          flightNumber: f.flightNumber,
          airline: f.airline,
          from: f.from,
          to: cityList[0],
          fromCity: f.fromCity || f.from,
          toCity: cityList[0] === "BDQ" ? "Vadodara" : cityList[0],
          fromAirport: f.fromAirport || `${f.from} International Airport`,
          toAirport: cityList[0] === "BDQ" ? "Vadodara Airport" : `${cityList[0]} International Airport`,
          departureTime: f.departureTime,
          arrivalTime: new Date(new Date(f.departureTime).getTime() + 2 * 3600000).toISOString(),
          duration: "2h 0m",
          aircraft: "Airbus Jet",
          layoverDuration: "1h 30m"
        });
        segments.push({
          flightNumber: f.flightNumber,
          airline: f.airline,
          from: cityList[cityList.length - 1],
          to: f.to,
          fromCity: cityList[cityList.length - 1] === "BDQ" ? "Vadodara" : cityList[cityList.length - 1],
          toCity: f.toCity || f.to,
          fromAirport: cityList[cityList.length - 1] === "BDQ" ? "Vadodara Airport" : `${cityList[cityList.length - 1]} International Airport`,
          toAirport: f.toAirport || `${f.to} International Airport`,
          departureTime: new Date(new Date(f.arrivalTime).getTime() - 2 * 3600000).toISOString(),
          arrivalTime: f.arrivalTime,
          duration: "2h 0m",
          aircraft: "Airbus Jet"
        });
      }
      return { ...f, segments };
    });

    res.json({
      success: true,
      flights: flightsWithSegments,
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
    const flight = await Flight.findById(req.params.id).lean();
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    // Add segments to detail view
    const segments = [];
    if (flight.stops > 0) {
      const cityList = (flight.stopCities && flight.stopCities.length > 0) ? flight.stopCities : ["BDQ"];
      segments.push({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.from,
        to: cityList[0],
        fromCity: flight.fromCity || flight.from,
        toCity: cityList[0] === "BDQ" ? "Vadodara" : cityList[0],
        fromAirport: flight.fromAirport || `${flight.from} International Airport`,
        toAirport: cityList[0] === "BDQ" ? "Vadodara Airport" : `${cityList[0]} International Airport`,
        departureTime: flight.departureTime,
        arrivalTime: new Date(new Date(flight.departureTime).getTime() + 2 * 3600000).toISOString(),
        duration: "2h 0m",
        aircraft: "Airbus Jet",
        layoverDuration: "1h 30m"
      });
      segments.push({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: cityList[cityList.length - 1],
        to: flight.to,
        fromCity: cityList[cityList.length - 1] === "BDQ" ? "Vadodara" : cityList[cityList.length - 1],
        toCity: flight.toCity || flight.to,
        fromAirport: cityList[cityList.length - 1] === "BDQ" ? "Vadodara Airport" : `${cityList[cityList.length - 1]} International Airport`,
        toAirport: flight.toAirport || `${flight.to} International Airport`,
        departureTime: new Date(new Date(flight.arrivalTime).getTime() - 2 * 3600000).toISOString(),
        arrivalTime: flight.arrivalTime,
        duration: "2h 0m",
        aircraft: "Airbus Jet"
      });
    }

    res.json({ success: true, flight: { ...flight, segments } });
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
