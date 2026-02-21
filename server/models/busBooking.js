const mongoose = require('mongoose');

const busBookingSchema = new mongoose.Schema(
    {
        bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        passengerName: { type: String, required: true },
        passengerEmail: { type: String, required: true },
        passengerPhone: { type: String, required: true },
        passengers: [
            {
                name: { type: String, required: true },
                age: { type: Number, required: true },
                gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
                seatNumber: { type: String, required: true },
            },
        ],
        from: { type: String, required: true },
        to: { type: String, required: true },
        travelDate: { type: Date, required: true },
        departureTime: { type: String },
        arrivalTime: { type: String },
        totalFare: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
        pnr: { type: String, unique: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending',
        },
        cancellationPolicy: { type: String },
    },
    { timestamps: true }
);

// Auto-generate PNR
busBookingSchema.pre('save', async function () {
    if (!this.pnr) {
        this.pnr = 'BUS' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    }
});

module.exports = mongoose.model('BusBooking', busBookingSchema);
