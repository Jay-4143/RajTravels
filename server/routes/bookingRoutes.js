/**
 * Booking Routes
 * /api/bookings/*
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const sanitize = require('../middleware/sanitizeMiddleware');
const common = require('../validations/commonValidation');
const { body, validationResult } = require('express-validator');

// Validation Result Middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
    }
    next();
};

const flightBookingValidation = [
    body('flightId').notEmpty().withMessage('Flight ID is required'),
    common.email('contact.email'),
    common.mobile('contact.mobile'),
    body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
];

router.use(sanitize);

router.post('/flight', protect, flightBookingValidation, validate, bookingController.createFlightBooking);
router.post('/hotel', bookingController.createHotelBooking);
router.post('/package', bookingController.createPackageBooking);
router.get('/', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
