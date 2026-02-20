const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/cities', busController.getCities);
router.get('/search', busController.searchBuses);
router.get('/my-bookings', protect, busController.getMyBookings);
router.get('/:id', busController.getBusById);
router.post('/book', optionalAuth, busController.bookBus);
router.put('/bookings/:bookingId/cancel', protect, busController.cancelBooking);

module.exports = router;
