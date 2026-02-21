const mongoose = require('mongoose');

const cabBookingSchema = new mongoose.Schema({
    bookingReference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cab: { type: mongoose.Schema.Types.ObjectId, ref: 'Cab', required: true },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true }, // "HH:MM"
    totalDistance: { type: Number }, // Expected km
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    bookingStatus: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    paymentId: { type: String },
    contactDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('CabBooking', cabBookingSchema);
