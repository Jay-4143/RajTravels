/**
 * Booking Model
 * Unified booking for flights, hotels, packages
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel', 'package'],
    required: true,
    index: true,
  },
  bookingReference: {
    type: String,
    unique: true,
    trim: true,
    index: true,
  },
  // Flight booking details
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
  },
  externalFlightId: String,
  flightDetails: mongoose.Schema.Types.Mixed,
  passengers: [{
    name: String,
    age: Number,
    seatNumber: String,
  }],
  seats: [String],
  returnFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
  },
  externalReturnFlightId: String,
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip'],
  },
  // Hotel booking details
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  checkIn: Date,
  checkOut: Date,
  rooms: Number,
  guests: Number,
  guestNames: [String],
  // Package booking details
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  packageParticipants: Number,
  travelDate: Date,
  // Common
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  taxAmount: Number,
  convenienceFee: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending',
    index: true,
  },
  cancellationReason: String,
  cancelledAt: Date,
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  addons: [{
    name: String,
    price: Number,
    category: String
  }],
}, {
  timestamps: true,
});

bookingSchema.index({ user: 1, status: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
