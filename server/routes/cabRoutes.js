const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', cabController.searchCabs);
router.post('/book', protect, cabController.createCabBooking);
router.get('/my/bookings', protect, cabController.getMyCabBookings);

module.exports = router;
