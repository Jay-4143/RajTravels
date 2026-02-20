const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    index: true
  },
  nationality: {
    type: String,
    trim: true,
    default: 'All'
  },
  visaType: {
    type: String, // e.g., 'Tourist', 'Business'
    required: [true, 'Visa type is required'],
    trim: true
  },
  processingTime: {
    type: String,
    required: [true, 'Processing time is required']
  },
  duration: {
    type: String, // e.g., '30 Days'
    required: [true, 'Duration is required']
  },
  entryType: {
    type: String, // e.g., 'Single Entry', 'Multiple Entry'
    required: [true, 'Entry type is required']
  },
  validity: {
    type: String, // e.g., '58 Days'
    required: [true, 'Validity perod is required']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  documentsRequired: [{
    type: String
  }],
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Check if model already exists to prevent OverwriteModelError
module.exports = mongoose.models.Visa || mongoose.model('Visa', visaSchema);
