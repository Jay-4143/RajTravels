const Cruise = require('../models/cruise');
const CruiseCabin = require('../models/cruiseCabin');
const CruiseBooking = require('../models/cruiseBooking');
const crypto = require('crypto');

// Search Cruises
exports.searchCruises = async (req, res) => {
    try {
        const { departurePort, departureDate, duration } = req.query;
        let query = { isActive: true };

        if (departurePort) {
            query.departurePort = { $regex: departurePort, $options: 'i' };
        }

        if (departureDate) {
            const start = new Date(departureDate);
            const end = new Date(departureDate);
            end.setDate(end.getDate() + 30); // Show cruises within 30 days
            query.departureDate = { $gte: start, $lte: end };
        }

        if (duration) {
            if (duration === '1-3') query.duration = { $gte: 1, $lte: 3 };
            else if (duration === '4-6') query.duration = { $gte: 4, $lte: 6 };
            else if (duration === '7-9') query.duration = { $gte: 7, $lte: 9 };
            else if (duration === '10+') query.duration = { $gt: 9 };
        }

        const cruises = await Cruise.find(query).sort({ departureDate: 1 });
        res.status(200).json({ success: true, count: cruises.length, cruises });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Cruise Details with Cabins
exports.getCruiseDetails = async (req, res) => {
    try {
        const cruise = await Cruise.findById(req.params.id);
        if (!cruise) {
            return res.status(404).json({ success: false, message: 'Cruise not found' });
        }

        const cabins = await CruiseCabin.find({ cruise: cruise._id, isActive: true });
        res.status(200).json({ success: true, cruise, cabins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Cruise Booking
exports.createCruiseBooking = async (req, res) => {
    try {
        const { cruiseId, cabinId, guests, contactDetails } = req.body;

        const cruise = await Cruise.findById(cruiseId);
        const cabin = await CruiseCabin.findById(cabinId);

        if (!cruise || !cabin) {
            return res.status(404).json({ success: false, message: 'Cruise or Cabin not found' });
        }

        if (cabin.availableCabins <= 0) {
            return res.status(400).json({ success: false, message: 'No cabins available' });
        }

        const bookingReference = 'CR' + crypto.randomBytes(3).toString('hex').toUpperCase();

        const booking = new CruiseBooking({
            bookingReference,
            user: req.user.id || req.user._id || req.user.user?._id,
            cruise: cruiseId,
            cabin: cabinId,
            guests,
            totalAmount: cabin.price * guests.length,
            travelDate: cruise.departureDate,
            contactDetails
        });

        await booking.save();

        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Cruise Bookings
exports.getMyCruiseBookings = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.user?._id;
        const bookings = await CruiseBooking.find({ user: userId })
            .populate('cruise')
            .populate('cabin')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
