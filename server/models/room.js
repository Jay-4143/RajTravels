/**
 * Room Model
 * Hotel rooms linked to Hotel
 */

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  roomType: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'superior', 'suite', 'family'],
  },
  maxOccupancy: {
    type: Number,
    default: 2,
    min: 1,
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0,
  },
  totalRooms: {
    type: Number,
    default: 10,
    min: 0,
  },
  availableRooms: {
    type: Number,
    default: 10,
    min: 0,
  },
  amenities: [String],
  images: [String],
  size: String, // e.g. "25 sq m"
  bedType: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

roomSchema.index({ hotel: 1, pricePerNight: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
