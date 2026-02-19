/**
 * Payment Routes
 * /api/payments/*
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Webhooks - no auth (verify signature in production)
router.post('/webhook/razorpay', paymentController.razorpayWebhook);
router.post('/webhook/stripe', paymentController.stripeWebhook);

// Protected
router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);

module.exports = router;
