/**
 * Booking Routes
 * /api/bookings/*
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/flight', bookingController.createFlightBooking);
router.post('/hotel', bookingController.createHotelBooking);
router.post('/package', bookingController.createPackageBooking);
router.get('/', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
