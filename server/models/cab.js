const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
    vehicleName: { type: String, required: true, trim: true },
    vehicleType: {
        type: String,
        enum: ['Sedan', 'SUV', 'Luxury', 'Hatchback', 'Minivan'],
        required: true
    },
    operator: { type: String, required: true, trim: true },
    city: { type: String, required: true, index: true },
    capacity: { type: Number, required: true, default: 4 },
    basePrice: { type: Number, required: true }, // Price for first X km or minimum fare
    pricePerKm: { type: Number, required: true },
    amenities: [String], // AC, Music, GPS, Water, Carrier
    rating: { type: Number, default: 4.2 },
    reviewCount: { type: Number, default: 0 },
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'Electric'], default: 'Petrol' },
    transmission: { type: String, enum: ['Manual', 'Automatic'], default: 'Manual' },
    tags: [String], // ["Best Value", "High Rated", "Top Choice"]
    images: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

cabSchema.index({ city: 1, vehicleType: 1 });

module.exports = mongoose.model('Cab', cabSchema);
