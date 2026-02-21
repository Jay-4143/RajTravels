/**
 * Bus Controller – Full Bus Module
 */

const Bus = require('../models/bus');
const BusBooking = require('../models/busBooking');

/**
 * @desc  Search buses by source, destination, date
 * @route GET /api/buses/search
 */
exports.searchBuses = async (req, res) => {
    try {
        const { from, to, date, busType, minPrice, maxPrice, sort = 'price', order = 'asc' } = req.query;

        if (!from || !to) {
            return res.status(400).json({ success: false, message: 'from and to are required' });
        }

        const query = {
            from: new RegExp(from, 'i'),
            to: new RegExp(to, 'i'),
            isActive: true,
            availableSeats: { $gt: 0 },
        };

        // Date is optional — if provided, filter to that day
        if (date) {
            const travelDate = new Date(date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            query.travelDate = { $gte: travelDate, $lt: nextDay };
        }

        if (busType) query.busType = busType;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        const sortObj = {};
        sortObj[sort] = order === 'desc' ? -1 : 1;

        const buses = await Bus.find(query).sort(sortObj).lean();

        res.json({ success: true, count: buses.length, buses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc  Get bus by ID with seat map
 * @route GET /api/buses/:id
 */
exports.getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });
        res.json({ success: true, bus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc  Get available cities (distinct from/to values)
 * @route GET /api/buses/cities
 */
exports.getCities = async (req, res) => {
    try {
        const fromCities = await Bus.distinct('from');
        const toCities = await Bus.distinct('to');
        const cities = [...new Set([...fromCities, ...toCities])].sort();
        res.json({ success: true, cities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc  Book a bus
 * @route POST /api/buses/book
 */
exports.bookBus = async (req, res) => {
    try {
        const { busId, passengerName, passengerEmail, passengerPhone, passengers } = req.body;

        if (!busId || !passengerName || !passengerEmail || !passengerPhone || !passengers?.length) {
            return res.status(400).json({ success: false, message: 'All fields and at least one passenger are required' });
        }

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });

        const selectedSeats = passengers.map(p => p.seatNumber);

        // Check seat availability
        for (const seatNum of selectedSeats) {
            const seat = bus.seats.find(s => s.seatNumber === seatNum);
            if (!seat || seat.isBooked) {
                return res.status(400).json({ success: false, message: `Seat ${seatNum} is not available` });
            }
        }

        // Mark seats as booked
        for (const seatNum of selectedSeats) {
            const seat = bus.seats.find(s => s.seatNumber === seatNum);
            seat.isBooked = true;
        }
        bus.availableSeats -= selectedSeats.length;
        await bus.save();

        const totalFare = bus.price * passengers.length;

        const userId = req.user?.id || req.user?._id || req.user?.user?._id;

        const booking = await BusBooking.create({
            bus: bus._id,
            user: userId,
            passengerName,
            passengerEmail,
            passengerPhone,
            passengers,
            from: bus.from,
            to: bus.to,
            travelDate: bus.travelDate,
            departureTime: bus.departureTime,
            arrivalTime: bus.arrivalTime,
            totalFare,
            cancellationPolicy: bus.cancellationPolicy,
        });

        res.status(201).json({
            success: true,
            message: 'Bus booked successfully',
            booking: {
                id: booking._id,
                pnr: booking.pnr,
                bus: bus.busName,
                from: bus.from,
                to: bus.to,
                travelDate: bus.travelDate,
                departureTime: bus.departureTime,
                arrivalTime: bus.arrivalTime,
                seats: selectedSeats,
                totalFare,
                passengerName,
                passengerEmail,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc  Get bookings for logged-in user
 * @route GET /api/buses/my-bookings
 */
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.user?._id;
        const bookings = await BusBooking.find({ user: userId }).populate('bus', 'busName operatorName busType').sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc  Cancel a booking
 * @route PUT /api/buses/bookings/:bookingId/cancel
 */
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await BusBooking.findById(req.params.bookingId).populate('bus');
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        const userId = req.user?.id || req.user?._id || req.user?.user?._id;
        if (booking.user?.toString() !== userId?.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
        if (booking.status === 'cancelled') return res.status(400).json({ success: false, message: 'Booking already cancelled' });

        booking.status = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        // Re-open seats
        if (booking.bus) {
            const bus = booking.bus;
            for (const passenger of booking.passengers) {
                const seat = bus.seats.find(s => s.seatNumber === passenger.seatNumber);
                if (seat) seat.isBooked = false;
            }
            bus.availableSeats += booking.passengers.length;
            await bus.save();
        }

        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
