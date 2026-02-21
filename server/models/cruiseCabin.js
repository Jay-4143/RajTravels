const mongoose = require('mongoose');

const cruiseCabinSchema = new mongoose.Schema({
    cruise: { type: mongoose.Schema.Types.ObjectId, ref: 'Cruise', required: true },
    type: {
        type: String,
        enum: ['Interior', 'Ocean View', 'Balcony', 'Suite'],
        required: true
    },
    name: { type: String, required: true }, // e.g. "Grand Suite with Balcony"
    price: { type: Number, required: true },
    capacity: { type: Number, required: true, default: 2 },
    description: { type: String },
    amenities: [String],
    availableCabins: { type: Number, required: true },
    totalCabins: { type: Number, required: true },
    images: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CruiseCabin', cruiseCabinSchema);
