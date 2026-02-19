/**
 * Review Routes
 * /api/reviews/*
 */

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/hotel/:hotelId', reviewController.getHotelReviews);
router.get('/package/:packageId', reviewController.getPackageReviews);
router.post('/hotel/:hotelId', protect, reviewController.addHotelReview);
router.post('/package/:packageId', protect, reviewController.addPackageReview);

module.exports = router;
