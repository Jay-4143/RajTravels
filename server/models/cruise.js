const mongoose = require('mongoose');

const cruiseSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    operator: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    itinerary: [{
        day: { type: Number, required: true },
        port: { type: String, required: true },
        arrival: { type: String, default: '—' },
        departure: { type: String, default: '—' },
        activity: { type: String }
    }],
    duration: { type: Number, required: true }, // in nights
    departurePort: { type: String, required: true, index: true },
    arrivalPort: { type: String, required: true },
    departureDate: { type: Date, required: true, index: true },
    images: [String],
    amenities: [String],
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

cruiseSchema.index({ departurePort: 1, departureDate: 1 });

module.exports = mongoose.model('Cruise', cruiseSchema);
