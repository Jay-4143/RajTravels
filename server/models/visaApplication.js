/**
 * Visa Application Model
 * User visa applications with admin approval flow
 */

const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  visa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visa',
    required: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  passportNumber: String,
  nationality: String,
  travelDate: Date,
  purpose: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'document_requested'],
    default: 'pending',
  },
  adminNotes: String,
  documents: [{
    type: { type: String },
    url: String,
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

visaApplicationSchema.index({ user: 1, status: 1 });

const VisaApplication = mongoose.model('VisaApplication', visaApplicationSchema);
module.exports = VisaApplication;
