/**
 * Review Model
 * Reviews for hotels, packages
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  reviewType: {
    type: String,
    enum: ['hotel', 'package'],
    required: true,
    index: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    index: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: String,
  content: String,
  pros: [String],
  cons: [String],
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
}, {
  timestamps: true,
});

reviewSchema.index({ hotel: 1, status: 1 });
reviewSchema.index({ package: 1, status: 1 });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
