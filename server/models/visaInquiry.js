const mongoose = require('mongoose');

const visaInquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest inquiries
  },
  visa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visa',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  travellers: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.VisaInquiry || mongoose.model('VisaInquiry', visaInquirySchema);
