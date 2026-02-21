/**
 * Hotel Model
 * Hotels with amenities, ratings, location
 */

const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  amenities: [{
    type: String,
    trim: true,
  }],
  images: [String],
  starCategory: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  checkInTime: {
    type: String,
    default: '14:00',
  },
  checkOutTime: {
    type: String,
    default: '11:00',
  },
  policies: {
    cancellation: String,
    checkIn: String,
    pets: String,
  },
  freeCancellation: {
    type: Boolean,
    default: false,
  },
  propertyType: {
    type: String,
    trim: true,
    default: 'Hotel',
  },
  chainName: {
    type: String,
    trim: true,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

hotelSchema.index({ city: 1, rating: -1, starCategory: 1 });

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
