/**
 * Seed script for hotels and rooms
 * Run: node scripts/seedHotels.js (from server directory, with MongoDB running)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const Room = require('../models/room');

const hotels = [
  {
    name: 'Grand Mumbai Palace',
    description: 'Luxurious 5-star hotel in the heart of Mumbai with stunning city views.',
    city: 'Mumbai',
    address: '123 Marine Drive, Mumbai 400020',
    rating: 4.8,
    reviewCount: 1250,
    amenities: ['WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    starCategory: 5,
    freeCancellation: true,
    propertyType: 'Hotel',
    isActive: true,
  },
  {
    name: 'Taj Gateway Goa',
    description: 'Beachfront resort with direct access to pristine sands.',
    city: 'Goa',
    address: 'Candolim Beach, Goa 403515',
    rating: 4.7,
    reviewCount: 890,
    amenities: ['WiFi', 'Swimming Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
    starCategory: 5,
    freeCancellation: true,
    propertyType: 'Resort',
    isActive: true,
  },
  {
    name: 'Royal Jaipur Inn',
    description: 'Heritage property with traditional Rajasthani hospitality.',
    city: 'Jaipur',
    address: 'MI Road, Jaipur 302001',
    rating: 4.5,
    reviewCount: 654,
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Room Service', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    starCategory: 4,
    freeCancellation: false,
    propertyType: 'Hotel',
    isActive: true,
  },
  {
    name: 'Shimla Heights Resort',
    description: 'Mountain resort with panoramic Himalayan views.',
    city: 'Shimla',
    address: 'The Mall, Shimla 171001',
    rating: 4.6,
    reviewCount: 432,
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Mountain View', 'Room Service'],
    images: ['https://images.unsplash.com/photo-1548013146-72479768bada?w=800'],
    starCategory: 4,
    freeCancellation: true,
    propertyType: 'Resort',
    isActive: true,
  },
  {
    name: 'Ooty Lake View Hotel',
    description: 'Cozy hotel overlooking Ooty Lake in the Nilgiris.',
    city: 'Ooty',
    address: 'Lake Road, Ooty 643001',
    rating: 4.4,
    reviewCount: 567,
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Room Service'],
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    starCategory: 3,
    freeCancellation: true,
    propertyType: 'Hotel',
    isActive: true,
  },
  {
    name: 'New Delhi Central',
    description: 'Modern hotel near Connaught Place with easy metro access.',
    city: 'New Delhi',
    address: 'Connaught Place, New Delhi 110001',
    rating: 4.6,
    reviewCount: 2100,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Business Center'],
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800'],
    starCategory: 4,
    freeCancellation: true,
    propertyType: 'Hotel',
    isActive: true,
  },
  {
    name: 'Bangalore Tech Park Hotel',
    description: 'Business hotel near IT hubs with excellent connectivity.',
    city: 'Bangalore',
    address: 'Whitefield, Bangalore 560066',
    rating: 4.5,
    reviewCount: 780,
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Business Center', 'Parking'],
    images: ['https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800'],
    starCategory: 4,
    freeCancellation: true,
    propertyType: 'Hotel',
    isActive: true,
  },
  {
    name: 'Chennai Bay Resort',
    description: 'Seaside hotel with stunning Bay of Bengal views.',
    city: 'Chennai',
    address: 'East Coast Road, Chennai 600041',
    rating: 4.4,
    reviewCount: 445,
    amenities: ['WiFi', 'Swimming Pool', 'Restaurant', 'Beach Access', 'Parking'],
    images: ['https://images.unsplash.com/photo-1596178060812-6b8c19e28a56?w=800'],
    starCategory: 4,
    freeCancellation: false,
    propertyType: 'Resort',
    isActive: true,
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travelweb');
    console.log('Connected to MongoDB');

    const existing = await Hotel.countDocuments();
    if (existing > 0) {
      console.log(`Found ${existing} hotels. Skipping seed.`);
      process.exit(0);
    }

    for (const h of hotels) {
      const hotel = await Hotel.create(h);
      await Room.create([
        { hotel: hotel._id, name: 'Standard Room', roomType: 'standard', pricePerNight: 1999 + Math.floor(Math.random() * 1000), totalRooms: 10, availableRooms: 10 },
        { hotel: hotel._id, name: 'Deluxe Room', roomType: 'deluxe', pricePerNight: 3499 + Math.floor(Math.random() * 1000), totalRooms: 6, availableRooms: 6 },
        { hotel: hotel._id, name: 'Suite', roomType: 'suite', pricePerNight: 5999 + Math.floor(Math.random() * 2000), totalRooms: 2, availableRooms: 2 },
      ]);
    }
    console.log(`Seeded ${hotels.length} hotels with rooms.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
