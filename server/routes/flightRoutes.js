/**
 * Flight Routes
 * /api/flights/*
 */

const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// Public routes
router.get('/search', flightController.searchFlights);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.get('/:id/seats', flightController.getAvailableSeats);
router.post('/:id/calculate-price', flightController.calculatePrice);

// Admin routes for flight CRUD are in adminRoutes.js

module.exports = router;
