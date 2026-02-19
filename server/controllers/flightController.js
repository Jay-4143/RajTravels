/**
 * Flight Controller
 * Search, filter, sort, details, booking
 */

const Flight = require('../models/flight');

/**
 * @desc    Search flights (one-way & round-trip)
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

    if (!from || !to || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'from, to, and departureDate are required',
      });
    }

    const query = {
      from: new RegExp(from, 'i'),
      to: new RegExp(to, 'i'),
      isActive: true,
      seatsAvailable: { $gte: parseInt(passengers) || 1 },
    };

    // Departure date - match date part
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
    if (refundable === 'true' || refundable === true) query.refundable = true;

    // Time-of-day filters: departureTime/arrivalTime are full Date; use same day as departureDate
    if (departureTimeFrom || departureTimeTo) {
      const d = new Date(departureDate);
      d.setHours(0, 0, 0, 0);
      if (departureTimeFrom) {
        const fromTime = new Date(d);
        const [h, m] = departureTimeFrom.split(':').map(Number);
        fromTime.setHours(h || 0, m || 0, 0, 0);
        query.departureTime = { ...query.departureTime, $gte: fromTime };
      }
      if (departureTimeTo) {
        const toTime = new Date(d);
        const [h, m] = departureTimeTo.split(':').map(Number);
        toTime.setHours(h || 23, m || 59, 59, 999);
        query.departureTime = { ...query.departureTime, $lte: toTime };
      }
    }
    if (arrivalTimeFrom || arrivalTimeTo) {
      const d = new Date(departureDate);
      d.setHours(0, 0, 0, 0);
      if (arrivalTimeFrom) {
        const fromTime = new Date(d);
        const [h, m] = arrivalTimeFrom.split(':').map(Number);
        fromTime.setHours(h || 0, m || 0, 0, 0);
        query.arrivalTime = { ...query.arrivalTime, $gte: fromTime };
      }
      if (arrivalTimeTo) {
        const toTime = new Date(d);
        const [h, m] = arrivalTimeTo.split(':').map(Number);
        toTime.setHours(h || 23, m || 59, 59, 999);
        query.arrivalTime = { ...query.arrivalTime, $lte: toTime };
      }
    }

    const sortObj = {};
    if (sort === 'price') sortObj.price = order === 'desc' ? -1 : 1;
    else if (sort === 'duration') sortObj.duration = 1;
    else if (sort === 'departure') sortObj.departureTime = order === 'desc' ? -1 : 1;
    else sortObj.price = 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const flights = await Flight.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).lean();
    const total = await Flight.countDocuments(query);

    const response = {
      success: true,
      flights,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    };

    if (returnDate) {
      const returnQuery = {
        from: new RegExp(to, 'i'),
        to: new RegExp(from, 'i'),
        isActive: true,
        seatsAvailable: { $gte: parseInt(passengers) || 1 },
      };
      const retDate = new Date(returnDate);
      retDate.setHours(0, 0, 0, 0);
      const retDateEnd = new Date(retDate);
      retDateEnd.setDate(retDateEnd.getDate() + 1);
      returnQuery.departureDate = { $gte: retDate, $lt: retDateEnd };
      if (airline) returnQuery.airline = new RegExp(airline, 'i');

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
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    // Generate seat layout - A,B,C, aisle, D,E,F for typical aircraft
    const rows = Math.ceil(flight.seatsAvailable / 6);
    const bookedSeats = []; // Would come from bookings - placeholder
    const availableSeats = [];
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r <= rows; r++) {
      for (const l of letters) {
        const seat = `${r}${l}`;
        if (!bookedSeats.includes(seat)) availableSeats.push(seat);
      }
    }
    res.json({ success: true, availableSeats, totalAvailable: flight.seatsAvailable });
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
    const { passengers = 1, seats = [] } = req.body;
    const baseFare = flight.price * parseInt(passengers);
    const taxPercent = 0.18; // 18% GST
    const taxAmount = Math.round(baseFare * taxPercent);
    const convenienceFee = 199 * parseInt(passengers); // Per passenger
    const total = baseFare + taxAmount + convenienceFee;

    res.json({
      success: true,
      breakdown: {
        baseFare,
        taxAmount,
        convenienceFee: convenienceFee,
        total,
        perPassenger: Math.round(total / passengers),
      },
      passengers: parseInt(passengers),
    });
  } catch (error) {
    next(error);
  }
};
