/**
 * Payment Controller
 * Razorpay/Stripe ready structure, webhook placeholder
 */

const Payment = require('../models/payment');
const Booking = require('../models/booking');

/**
 * @desc    Create payment order (Razorpay/Stripe placeholder)
 * @route   POST /api/payments/create-order
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'Booking already paid' });
    }

    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId,
      amount: amount || booking.totalAmount,
      status: 'pending',
      paymentMethod: 'razorpay',
    });

    // TODO: Integrate Razorpay - const order = await razorpay.orders.create({ amount: payment.amount * 100, currency: 'INR' });
    // payment.razorpayOrderId = order.id; await payment.save();

    res.json({
      success: true,
      paymentId: payment._id,
      amount: payment.amount,
      // razorpayOrderId: order.id, // When integrated
      message: 'Payment order created - integrate Razorpay for production',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify payment (Razorpay signature verification placeholder)
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const payment = await Payment.findOne({ _id: paymentId, user: req.user.id });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    // TODO: Verify Razorpay signature
    // const crypto = require('crypto');
    // const body = razorpayOrderId + '|' + razorpayPaymentId;
    // const expected = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body).digest('hex');
    // if (expected !== razorpaySignature) return res.status(400).json({ success: false, message: 'Invalid signature' });

    payment.status = 'success';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpayOrderId = razorpayOrderId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    await Booking.findByIdAndUpdate(payment.booking, { status: 'confirmed' });

    res.json({ success: true, message: 'Payment verified', payment: { id: payment._id, status: payment.status } });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Razorpay webhook - placeholder
 * @route   POST /api/payments/webhook/razorpay
 * @access  Public (verify webhook signature in production)
 */
exports.razorpayWebhook = async (req, res, next) => {
  try {
    // TODO: Verify webhook signature using RAZORPAY_WEBHOOK_SECRET
    // const signature = req.headers['x-razorpay-signature'];
    // const body = JSON.stringify(req.body);

    const event = req.body?.event;
    if (event === 'payment.captured') {
      const { payload } = req.body;
      const paymentId = payload?.payment?.entity?.id;
      // Update payment and booking status
      // await Payment.findOneAndUpdate({ razorpayPaymentId: paymentId }, { status: 'success' });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stripe webhook - placeholder
 * @route   POST /api/payments/webhook/stripe
 * @access  Public
 */
exports.stripeWebhook = async (req, res, next) => {
  try {
    // TODO: Verify Stripe webhook signature
    // const sig = req.headers['stripe-signature'];
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
