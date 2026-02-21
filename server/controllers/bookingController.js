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
    const {
      flightId,
      returnFlightId,
      passengers,
      seats,
      tripType,
      flightDetails: externalDetails,
      addons = []
    } = req.body;

    let flight = null;
    let isExternal = !mongoose.Types.ObjectId.isValid(flightId);

    if (isExternal) {
      flight = externalDetails;
    } else {
      flight = await Flight.findById(flightId);
    }

    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });

    // Check seats only for local flights
    if (!isExternal && flight.seatsAvailable < (passengers?.length || 1)) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    let totalAmount = 0;
    const passengerList = passengers || [{ name: req.user.name }];
    const taxPercent = 0.18;
    const baseFare = flight.price * passengerList.length;

    // Add-on calculation
    const addOnTotal = addons.reduce((sum, item) => sum + (item.price || 0), 0);

    // Seat premium (simple logic: window/aisle might cost more)
    let seatPremium = 0;
    if (seats && Array.isArray(seats)) {
      seats.forEach(s => {
        if (s.includes('A') || s.includes('F')) seatPremium += 499; // Window
        else if (s.includes('C') || s.includes('D')) seatPremium += 299; // Aisle
      });
    }

    totalAmount = baseFare + seatPremium + addOnTotal;
    const taxAmount = Math.round(totalAmount * taxPercent);
    const convenienceFee = 199 * passengerList.length;
    totalAmount += taxAmount + convenienceFee;

    let ref = generateBookingRef();
    while (await Booking.findOne({ bookingReference: ref })) ref = generateBookingRef();

    const bookingData = {
      user: req.user.id || req.user._id || req.user.user?._id,
      bookingType: 'flight',
      bookingReference: ref,
      passengers: passengerList.map((p, i) => ({
        name: p.name || `Passenger ${i + 1}`,
        age: p.age,
        seatNumber: seats?.[i] || null,
      })),
      seats: seats || [],
      tripType: tripType || 'one-way',
      totalAmount,
      taxAmount,
      convenienceFee,
      status: 'pending',
      flightDetails: isExternal ? flight : undefined,
      addons: addons
    };

    if (isExternal) {
      bookingData.externalFlightId = flightId;
      if (returnFlightId) bookingData.externalReturnFlightId = returnFlightId;
    } else {
      bookingData.flight = flightId;
      if (returnFlightId) bookingData.returnFlight = returnFlightId;
    }

    const booking = await Booking.create(bookingData);

    // Reduce seats for local flights
    if (!isExternal) {
      await Flight.findByIdAndUpdate(flightId, { $inc: { seatsAvailable: -passengerList.length } });
      if (returnFlightId && mongoose.Types.ObjectId.isValid(returnFlightId)) {
        await Flight.findByIdAndUpdate(returnFlightId, { $inc: { seatsAvailable: -passengerList.length } });
      }
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
      user: req.user.id || req.user._id || req.user.user?._id,
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

    await Room.findByIdAndUpdate(roomId, { $inc: { availableRooms: -parseInt(rooms) } });

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
      user: req.user.id || req.user._id || req.user.user?._id,
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

const BusBooking = require('../models/busBooking');
const CruiseBooking = require('../models/cruiseBooking');
const CabBooking = require('../models/cabBooking');

/**
 * @desc    Get user's booking history
 * @route   GET /api/bookings
 * @access  Private
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const userId = req.user.id || req.user._id || req.user.user?._id;
    const query = { user: userId };
    if (status) query.status = status;

    let bookings = [];
    let total = 0;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const fetchLimit = parseInt(limit);

    if (!type || type === 'all' || ['flight', 'hotel', 'package'].includes(type)) {
      const bQuery = { ...query };
      if (type && type !== 'all') bQuery.bookingType = type;

      const mainBookings = await Booking.find(bQuery)
        .populate('flight', 'airline from to departureTime price')
        .populate('hotel', 'name city')
        .populate('room', 'name pricePerNight')
        .populate('package', 'title destination price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(fetchLimit)
        .lean();

      bookings = mainBookings.map(b => {
        let title = '';
        let subtitle = '';
        if (b.bookingType === 'flight' && b.flight) {
          title = `${b.flight.from} → ${b.flight.to}`;
          subtitle = `${b.flight.airline} • ${b.tripType === 'round-trip' ? 'Round Trip' : 'One Way'}`;
        } else if (b.bookingType === 'hotel' && b.hotel) {
          title = b.hotel.name;
          subtitle = `${b.hotel.city} • ${b.room?.name || 'Room'}`;
        } else if (b.bookingType === 'package' && b.package) {
          title = b.package.title;
          subtitle = `${b.package.destination} • ${b.packageParticipants} Guests`;
        }
        return {
          ...b,
          id: b._id,
          title: title || 'Booking',
          subtitle: subtitle || 'Details'
        };
      });
      total = await Booking.countDocuments(bQuery);
    }

    if (!type || type === 'all' || type === 'bus') {
      const busBookings = await BusBooking.find(query)
        .populate('bus', 'busName operatorName busType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(fetchLimit)
        .lean();

      const busMapped = busBookings.map(b => ({
        ...b,
        id: b._id,
        bookingType: 'bus',
        title: `${b.from} → ${b.to}`,
        subtitle: `${b.bus?.busName || 'Bus'} • Seat ${b.passengers?.[0]?.seatNumber || ''}`,
        totalAmount: b.totalFare,
        date: b.travelDate,
      }));

      if (type === 'bus') {
        bookings = busMapped;
        total = await BusBooking.countDocuments(query);
      } else {
        bookings = [...bookings, ...busMapped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, fetchLimit);
        total += await BusBooking.countDocuments(query);
      }
    }

    if (!type || type === 'all' || type === 'cruise') {
      const cruiseBookings = await CruiseBooking.find(query)
        .populate('cruise', 'name operator departurePort arrivalPort')
        .populate('cabin', 'name type')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(fetchLimit)
        .lean();

      const cruiseMapped = cruiseBookings.map(b => ({
        ...b,
        id: b._id,
        bookingType: 'cruise',
        title: b.cruise ? `${b.cruise.departurePort} → ${b.cruise.arrivalPort}` : 'Cruise Booking',
        subtitle: b.cruise ? `${b.cruise.name} • ${b.cabin?.name || 'Cabin'}` : 'Cruise details',
        totalAmount: b.totalAmount,
        date: b.travelDate,
      }));

      if (type === 'cruise') {
        bookings = cruiseMapped;
        total = await CruiseBooking.countDocuments(query);
      } else {
        bookings = [...bookings, ...cruiseMapped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, fetchLimit);
        total += await CruiseBooking.countDocuments(query);
      }
    }

    if (!type || type === 'all' || type === 'cab') {
      const cabBookings = await CabBooking.find(query)
        .populate('cab', 'vehicleName vehicleType operator')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(fetchLimit)
        .lean();

      const cabMapped = cabBookings.map(b => ({
        ...b,
        id: b._id,
        bookingType: 'cab',
        title: `${b.pickupAddress} → ${b.dropAddress}`,
        subtitle: b.cab ? `${b.cab.vehicleName} (${b.cab.vehicleType})` : 'Cab booking',
        totalAmount: b.totalAmount,
        date: b.pickupDate,
      }));

      if (type === 'cab') {
        bookings = cabMapped;
        total = await CabBooking.countDocuments(query);
      } else {
        bookings = [...bookings, ...cabMapped].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, fetchLimit);
        total += await CabBooking.countDocuments(query);
      }
    }

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
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
    // Restore hotel room count if hotel booking
    if (booking.bookingType === 'hotel' && booking.room && booking.rooms) {
      await Room.findByIdAndUpdate(booking.room, { $inc: { availableRooms: booking.rooms } });
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
