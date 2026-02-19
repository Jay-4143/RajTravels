/**
 * Package Inquiry Model
 * User inquiries for tour packages
 */

const mongoose = require('mongoose');

const packageInquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
    index: true,
  },
  name: {
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
  message: String,
  travelDate: Date,
  numberOfPeople: Number,
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
}, {
  timestamps: true,
});

const PackageInquiry = mongoose.model('PackageInquiry', packageInquirySchema);
module.exports = PackageInquiry;
