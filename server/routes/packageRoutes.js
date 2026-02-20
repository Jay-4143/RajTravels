/**
 * Package Routes
 * /api/packages/*
 */

const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', packageController.getPackages);
router.get('/featured', packageController.getFeaturedPackages);
router.get('/hot-deals', packageController.getHotDeals);
router.get('/:id', packageController.getPackageById);
router.post('/:id/inquiry', optionalAuth, packageController.submitInquiry);

module.exports = router;
