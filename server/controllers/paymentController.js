/**
 * Payment Controller
 * Razorpay/Stripe ready structure, webhook placeholder
 */

const Payment = require('../models/payment');
const Booking = require('../models/booking');
const BusBooking = require('../models/busBooking');
const CabBooking = require('../models/cabBooking');
const CruiseBooking = require('../models/cruiseBooking');

/**
 * @desc    Create payment order (Razorpay/Stripe placeholder with simulation support)
 * @route   POST /api/payments/create-order
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId, bookingType, amount } = req.body;

    let targetBooking;
    if (bookingType === 'bus') {
      targetBooking = await BusBooking.findOne({ _id: bookingId, user: req.user.id });
    } else if (bookingType === 'cab') {
      targetBooking = await CabBooking.findOne({ _id: bookingId, user: req.user.id });
    } else if (bookingType === 'cruise') {
      targetBooking = await CruiseBooking.findOne({ _id: bookingId, user: req.user.id });
    } else {
      targetBooking = await Booking.findOne({ _id: bookingId, user: req.user.id });
    }

    if (!targetBooking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Check if already paid
    if (targetBooking.status === 'confirmed' || targetBooking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking already paid' });
    }

    const finalAmount = amount || (bookingType === 'bus' ? targetBooking.totalFare : targetBooking.totalAmount);

    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingType === 'bus' ? undefined : bookingId,
      // We can store the bus booking ID in metadata or a new field if we want to be strict, 
      // but let's use metadata for flexibility
      metadata: { bookingId, bookingType },
      amount: finalAmount,
      status: 'pending',
      paymentMethod: 'razorpay',
    });

    // SIMULATION logic
    const isSimulation = req.headers['x-simulate-payment'] === 'true';

    res.json({
      success: true,
      paymentId: payment._id,
      amount: payment.amount,
      isSimulation,
      message: isSimulation ? 'Simulation mode enabled' : 'Payment order created',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify payment (Simulated or real)
 * @route   POST /api/payments/verify
 * @access  Private
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, razorpayPaymentId, razorpayOrderId, razorpaySignature, status = 'success' } = req.body;

    const payment = await Payment.findOne({ _id: paymentId, user: req.user.id });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (status === 'success') {
      payment.status = 'success';
      payment.razorpayPaymentId = razorpayPaymentId || 'pay_simulated_' + Date.now();
      payment.razorpayOrderId = razorpayOrderId;
      payment.razorpaySignature = razorpaySignature;
      await payment.save();

      const { bookingId, bookingType } = payment.metadata || {};

      if (bookingType === 'bus') {
        await BusBooking.findByIdAndUpdate(bookingId, {
          status: 'confirmed',
          paymentStatus: 'paid'
        });
      } else if (bookingType === 'cab') {
        await CabBooking.findByIdAndUpdate(bookingId, {
          bookingStatus: 'Confirmed',
          paymentStatus: 'Paid'
        });
      } else if (bookingType === 'cruise') {
        await CruiseBooking.findByIdAndUpdate(bookingId, {
          status: 'confirmed',
          paymentStatus: 'paid'
        });
      } else if (payment.booking || (bookingId && bookingType !== 'bus')) {
        const id = payment.booking || bookingId;
        await Booking.findByIdAndUpdate(id, { status: 'confirmed' });
      }

      return res.json({ success: true, message: 'Payment verified', payment: { id: payment._id, status: payment.status } });
    } else {
      payment.status = 'failed';
      await payment.save();
      return res.json({ success: false, message: 'Payment failed', payment: { id: payment._id, status: payment.status } });
    }
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
