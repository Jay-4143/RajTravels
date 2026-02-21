const express = require('express');
const router = express.Router();
const cruiseController = require('../controllers/cruiseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', cruiseController.searchCruises);
router.get('/:id', cruiseController.getCruiseDetails);
router.post('/book', protect, cruiseController.createCruiseBooking);
router.get('/my/bookings', protect, cruiseController.getMyCruiseBookings);

module.exports = router;
