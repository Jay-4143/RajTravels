const mongoose = require('mongoose');

const cruiseBookingSchema = new mongoose.Schema({
    bookingReference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cruise: { type: mongoose.Schema.Types.ObjectId, ref: 'Cruise', required: true },
    cabin: { type: mongoose.Schema.Types.ObjectId, ref: 'CruiseCabin', required: true },
    guests: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] }
    }],
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
    travelDate: { type: Date, required: true },
    contactDetails: {
        email: { type: String, required: true },
        phone: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('CruiseBooking', cruiseBookingSchema);
