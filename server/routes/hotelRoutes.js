/**
 * Hotel Routes
 * /api/hotels/*
 */

const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

router.get('/search', hotelController.searchHotels);
router.get('/', hotelController.getAllHotels);
router.get('/:hotelId/rooms/availability', hotelController.getRoomAvailability);
router.get('/:id', hotelController.getHotelById);

module.exports = router;
