/**
 * Tour Package Model
 * Domestic & International packages
 */

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['domestic', 'international'],
    required: true,
    index: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  country: String,
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  pricePerPerson: {
    type: Number,
    default: 0,
  },
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
  }],
  inclusions: [String],
  exclusions: [String],
  images: [String],
  highlights: [String],
  category: [{ type: String }],   // Beach, City, Nature, Adventure, Heritage, Luxury, Romantic, Honeymoon, Family
  theme: [{ type: String }],      // International, Domestic
  featured: { type: Boolean, default: false },
  hotDeal: { type: Boolean, default: false },
  validFrom: Date,
  validTo: Date,
  maxPeople: {
    type: Number,
    default: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

packageSchema.index({ type: 1, destination: 1, price: 1 });

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
