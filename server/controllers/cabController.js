const Cab = require('../models/cab');
const CabBooking = require('../models/cabBooking');
const crypto = require('crypto');

// Search Cabs
exports.searchCabs = async (req, res) => {
    try {
        const { city, vehicleType, fuelType, transmission, tripType, sort } = req.query;
        let query = { isActive: true };

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        if (vehicleType) {
            query.vehicleType = vehicleType;
        }

        if (fuelType) {
            query.fuelType = fuelType;
        }

        if (transmission) {
            query.transmission = transmission;
        }

        let sortQuery = { basePrice: 1 };
        if (sort === 'priceLow') sortQuery = { basePrice: 1 };
        if (sort === 'priceHigh') sortQuery = { basePrice: -1 };
        if (sort === 'rating') sortQuery = { rating: -1 };

        const cabs = await Cab.find(query).sort(sortQuery);
        res.status(200).json({ success: true, count: cabs.length, cabs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Cab Booking
exports.createCabBooking = async (req, res) => {
    try {
        const { cabId, pickupAddress, dropAddress, pickupDate, pickupTime, contactDetails, totalAmount } = req.body;

        const cab = await Cab.findById(cabId);
        if (!cab) {
            return res.status(404).json({ success: false, message: 'Cab not found' });
        }

        const bookingReference = 'CB' + crypto.randomBytes(3).toString('hex').toUpperCase();
        const userId = req.user?.id || req.user?._id || req.user?.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication failed. Please login again.' });
        }

        const booking = new CabBooking({
            bookingReference,
            user: userId,
            cab: cabId,
            pickupAddress,
            dropAddress,
            pickupDate,
            pickupTime,
            totalAmount,
            contactDetails
        });

        await booking.save();

        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Cab Bookings
exports.getMyCabBookings = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const bookings = await CabBooking.find({ user: userId })
            .populate('cab')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
