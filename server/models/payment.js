/**
 * Payment Model
 * Razorpay/Stripe ready structure
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'card', 'upi', 'netbanking', 'cod'],
    default: 'razorpay',
  },
  // Razorpay
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  // Stripe
  stripePaymentIntentId: String,
  stripeSessionId: String,
  // Common
  transactionId: String,
  failureReason: String,
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
