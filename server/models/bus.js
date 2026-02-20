const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true }, // e.g. A1, B2
    type: { type: String, enum: ['window', 'aisle', 'middle'], default: 'aisle' },
    deck: { type: String, enum: ['lower', 'upper'], default: 'lower' },
    isBooked: { type: Boolean, default: false },
});

const busSchema = new mongoose.Schema(
    {
        busName: { type: String, required: true, trim: true },
        busNumber: { type: String, required: true, unique: true, trim: true },
        operatorName: { type: String, required: true, trim: true },
        busType: {
            type: String,
            enum: ['Seater', 'Sleeper', 'Semi-Sleeper', 'AC Seater', 'AC Sleeper', 'Volvo AC', 'Non-AC Sleeper'],
            required: true,
        },
        from: { type: String, required: true, trim: true, index: true },
        to: { type: String, required: true, trim: true, index: true },
        departureTime: { type: String, required: true },   // "06:00"
        arrivalTime: { type: String, required: true },     // "14:30"
        duration: { type: String, required: true },         // "8h 30m"
        travelDate: { type: Date, required: true },
        price: { type: Number, required: true, min: 0 },
        totalSeats: { type: Number, required: true, default: 40 },
        availableSeats: { type: Number, required: true },
        amenities: [{ type: String }], // WiFi, USB Charging, Blanket, Water Bottle, etc.
        rating: { type: Number, default: 4.0, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0 },
        cancellationPolicy: {
            type: String,
            enum: ['Free Cancellation', 'Partial Refund', 'Non-Refundable'],
            default: 'Partial Refund',
        },
        liveTracking: { type: Boolean, default: false },
        seats: [seatSchema],
        isActive: { type: Boolean, default: true },
        images: [String],
    },
    { timestamps: true }
);

busSchema.index({ from: 1, to: 1, travelDate: 1 });

module.exports = mongoose.model('Bus', busSchema);
