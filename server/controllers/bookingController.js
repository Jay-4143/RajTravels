/**
 * Booking Controller
 * Unified booking for flights, hotels, packages
 */

const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Flight = require('../models/flight');
const Room = require('../models/room');
const Package = require('../models/package');

/**
 * Generate unique booking reference
 */
const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'BK';
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
};

/**
 * @desc    Create flight booking
 * @route   POST /api/bookings/flight
 * @access  Private
 */
exports.createFlightBooking = async (req, res, next) => {
  try {
    const { flightId, returnFlightId, passengers, seats, tripType } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
    if (flight.seatsAvailable < (passengers?.length || 1)) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    let totalAmount = 0;
    const passengerList = passengers || [{ name: req.user.name }];
    const taxPercent = 0.18;
    const baseFare = flight.price * passengerList.length;
    totalAmount = baseFare + Math.round(baseFare * taxPercent) + 199 * passengerList.length;

    let returnFlight = null;
    if (tripType === 'round-trip' && returnFlightId) {
      returnFlight = await Flight.findById(returnFlightId);
      if (returnFlight) {
        const returnBase = returnFlight.price * passengerList.length;
        totalAmount += returnBase + Math.round(returnBase * taxPercent) + 199 * passengerList.length;
      }
    }

    let ref = generateBookingRef();
    while (await Booking.findOne({ bookingReference: ref })) ref = generateBookingRef();

    const booking = await Booking.create({
      user: req.user.id,
      bookingType: 'flight',
      bookingReference: ref,
      flight: flightId,
      returnFlight: returnFlight?._id,
      passengers: passengerList.map((p, i) => ({
        name: p.name || `Passenger ${i + 1}`,
        age: p.age,
        seatNumber: seats?.[i] || null,
      })),
      seats: seats || [],
      tripType: tripType || 'one-way',
      totalAmount,
      taxAmount: Math.round(baseFare * taxPercent),
      convenienceFee: 199 * passengerList.length,
      status: 'pending',
    });

    // Reduce seats
    await Flight.findByIdAndUpdate(flightId, { $inc: { seatsAvailable: -passengerList.length } });
    if (returnFlight) {
      await Flight.findByIdAndUpdate(returnFlightId, { $inc: { seatsAvailable: -passengerList.length } });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created',
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create hotel booking
 * @route   POST /api/bookings/hotel
 * @access  Private
 */
exports.createHotelBooking = async (req, res, next) => {
  try {
    const { hotelId, roomId, checkIn, checkOut, rooms = 1, guests, guestNames } = req.body;

    const room = await Room.findOne({ _id: roomId, hotel: hotelId });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (room.availableRooms < rooms) {
      return res.status(400).json({ success: false, message: 'Not enough rooms available' });
    }

    const cIn = new Date(checkIn);
    const cOut = new Date(checkOut);
    const nights = Math.ceil((cOut - cIn) / (1000 * 60 * 60 * 24));
    const totalAmount = room.pricePerNight * nights * parseInt(rooms);

    let ref = generateBookingRef();
    while (await Booking.findOne({ bookingReference: ref })) ref = generateBookingRef();

    const booking = await Booking.create({
      user: req.user.id,
      bookingType: 'hotel',
      bookingReference: ref,
      hotel: hotelId,
      room: roomId,
      checkIn: cIn,
      checkOut: cOut,
      rooms: parseInt(rooms),
      guests: guests || rooms * 2,
      guestNames: guestNames || [],
      totalAmount,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Booking created',
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create package booking
 * @route   POST /api/bookings/package
 * @access  Private
 */
exports.createPackageBooking = async (req, res, next) => {
  try {
    const { packageId, participants = 1, travelDate } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    const totalAmount = (pkg.pricePerPerson || pkg.price) * parseInt(participants);

    let ref = generateBookingRef();
    while (await Booking.findOne({ bookingReference: ref })) ref = generateBookingRef();

    const booking = await Booking.create({
      user: req.user.id,
      bookingType: 'package',
      bookingReference: ref,
      package: packageId,
      packageParticipants: parseInt(participants),
      travelDate: travelDate ? new Date(travelDate) : undefined,
      totalAmount,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Booking created',
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's booking history
 * @route   GET /api/bookings
 * @access  Private
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };
    if (type) query.bookingType = type;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const bookings = await Booking.find(query)
      .populate('flight', 'airline from to departureTime price')
      .populate('hotel', 'name city')
      .populate('room', 'name pricePerNight')
      .populate('package', 'title destination price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Booking.countDocuments(query);
    res.json({
      success: true,
      bookings,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get booking by ID or reference
 * @route   GET /api/bookings/:id
 * @access  Private
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const isRef = /^[A-Z0-9]+$/.test(req.params.id) && req.params.id.length === 10;
    const query = isRef ? { bookingReference: req.params.id } : { _id: req.params.id };
    query.user = req.user.id;

    const booking = await Booking.findOne(query)
      .populate('flight', 'airline flightNumber from to departureTime arrivalTime price class')
      .populate('returnFlight', 'airline from to departureTime arrivalTime price')
      .populate('hotel', 'name city address')
      .populate('room', 'name roomType pricePerNight')
      .populate('package', 'title destination duration price itinerary')
      .lean();

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel booking
 * @route   POST /api/bookings/:id/cancel
 * @access  Private
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
    }

    const { reason } = req.body;

    // Restore flight seats if flight booking
    if (booking.bookingType === 'flight' && booking.flight) {
      const paxCount = booking.passengers?.length || 1;
      await Flight.findByIdAndUpdate(booking.flight, { $inc: { seatsAvailable: paxCount } });
      if (booking.returnFlight) {
        await Flight.findByIdAndUpdate(booking.returnFlight, { $inc: { seatsAvailable: paxCount } });
      }
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled', booking: { id: booking._id, status: booking.status } });
  } catch (error) {
    next(error);
  }
};
