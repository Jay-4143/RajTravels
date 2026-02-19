/**
 * Visa Model
 * Visa types and country-based listings
 */

const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    index: true,
  },
  countryCode: {
    type: String,
    trim: true,
    uppercase: true,
  },
  visaType: {
    type: String,
    required: true,
    enum: ['tourist', 'business', 'student', 'transit', 'work', 'family'],
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  validity: String, // e.g. "90 days", "6 months"
  processingTime: String, // e.g. "5-7 business days"
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  documents: [String],
  requirements: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

visaSchema.index({ country: 1, visaType: 1 });

const Visa = mongoose.model('Visa', visaSchema);
module.exports = Visa;
