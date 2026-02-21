/**
 * Admin Routes
 * /api/admin/*
 * All routes require admin role
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.use(protect, requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Flights
router.post('/flights', adminController.addFlight);
router.put('/flights/:id', adminController.updateFlight);
router.delete('/flights/:id', adminController.deleteFlight);

// Hotels
router.post('/hotels', adminController.addHotel);
router.put('/hotels/:id', adminController.updateHotel);
router.delete('/hotels/:id', adminController.deleteHotel);

// Rooms
router.post('/rooms', adminController.addRoom);
router.put('/rooms/:id', adminController.updateRoom);

// Packages
router.post('/packages', adminController.addPackage);
router.put('/packages/:id', adminController.updatePackage);
router.delete('/packages/:id', adminController.deletePackage);

// Visa
router.post('/visa', adminController.addVisa);
router.put('/visa/:id', adminController.updateVisa);
router.put('/visa-applications/:id', adminController.approveVisaApplication);

// Buses
router.get('/buses', adminController.getAllBookings); // Filtered by type=bus
router.post('/buses', (req, res) => res.status(501).json({ message: 'Not implemented' }));

// Cabs
router.get('/cabs', adminController.getAllBookings); // Filtered by type=cab

// Cruises
router.get('/cruises', adminController.getAllBookings); // Filtered by type=cruise

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/approve', adminController.approveBooking);
router.put('/bookings/:id/reject', adminController.rejectBooking);

// Users
router.get('/users', adminController.getAllUsers);

module.exports = router;
