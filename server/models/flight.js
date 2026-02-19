/**
 * Flight Model
 * Airlines, routes, pricing, baggage, seat selection
 */

const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: [true, 'Airline name is required'],
    trim: true,
  },
  flightNumber: {
    type: String,
    required: true,
    trim: true,
  },
  from: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true,
    index: true,
  },
  to: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    index: true,
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required'],
    index: true,
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required'],
  },
  duration: {
    type: String,
    required: true,
    default: '0h 0m',
  },
  departureDate: {
    type: Date,
    required: true,
    index: true,
  },
  // One-way vs round-trip return leg
  returnDepartureTime: Date,
  returnArrivalTime: Date,
  returnDepartureDate: Date,
  returnDuration: String,
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  baseFare: Number,
  taxes: Number,
  convenienceFee: {
    type: Number,
    default: 0,
  },
  class: {
    type: String,
    enum: ['economy', 'premium_economy', 'business', 'first'],
    default: 'economy',
  },
  seatsAvailable: {
    type: Number,
    default: 100,
    min: 0,
  },
  totalSeats: {
    type: Number,
    default: 100,
  },
  baggage: {
    cabin: { type: String, default: '7 kg' },
    checkIn: { type: String, default: '15 kg' },
  },
  stops: {
    type: Number,
    default: 0,
    min: 0,
  },
  stopCities: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for search
flightSchema.index({ from: 1, to: 1, departureDate: 1 });
flightSchema.index({ airline: 1, price: 1 });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
