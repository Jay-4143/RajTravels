require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Hotel = require('../models/hotel');
const Room = require('../models/room');

const CITIES = [
    "Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Goa", "Jaipur", "Kochi", "Lucknow", "Udaipur",
    "Shimla", "Manali", "Darjeeling", "Ooty", "Mysore", "Agra", "Varanasi",
    "Dubai", "Bangkok", "Singapore", "London", "Port Blair", "Kodaikanal",
    "Mahabaleshwar", "Lonavala", "Rishikesh", "Haridwar", "Gangtok", "Leh"
];

const CHAINS = ["Marriott", "Hilton", "Hyatt", "Taj", "Oberoi", "Radisson", "Accor", "ITC Hotels", "Lemon Tree", "Ginger"];
const PROPERTY_TYPES = ["Hotel", "Resort", "Apartment", "Villa", "Hostel", "Guesthouse", "Heritage Hotel", "Boutique Hotel"];
const AMENITIES_POOL = ["WiFi", "Pool", "Spa", "Gym", "Parking", "Restaurant", "Bar", "AC", "Airport Shuttle", "Room Service", "Laundry", "Pet Friendly", "Beach Access", "Private Pool", "Kitchen", "Garden", "Yoga", "Trekking", "Golf", "Concierge", "Business Center", "Cultural Shows", "Boat Ride"];

const IMAGES = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
];

const prefixes = ["Grand", "Royal", "The", "Blue", "Crystal", "Golden", "Heritage", "Luxury", "Budget", "Comfort", "Elite", "Prime"];
const suffixes = ["Inn", "Residency", "Suites", "Palace", "Plaza", "Resort", "Havana", "Retreat", "Lodge", "Boutique", "Hotel"];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateHotel(city) {
    const chain = Math.random() > 0.4 ? getRandom(CHAINS) : null;
    const type = getRandom(PROPERTY_TYPES);
    const name = chain ? `${chain} ${city} ${getRandom(suffixes)}` : `${getRandom(prefixes)} ${city} ${getRandom(suffixes)}`;
    const star = Math.floor(Math.random() * 3) + 3; // 3-5 stars
    const amCount = 5 + Math.floor(Math.random() * 10);
    const ams = [...AMENITIES_POOL].sort(() => Math.random() - 0.5).slice(0, amCount);
    const imgs = [...IMAGES].sort(() => Math.random() - 0.5).slice(0, 3);

    return {
        name,
        description: `Experience the best of ${city} at our ${star}-star ${type.toLowerCase()}. Enjoy world-class amenities and exceptional service.`,
        city,
        address: `${Math.floor(Math.random() * 999) + 1} Main St, ${city}`,
        location: { lat: 0, lng: 0 }, // Placeholder
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 2000) + 100,
        amenities: ams,
        images: imgs,
        starCategory: star,
        freeCancellation: Math.random() > 0.3,
        propertyType: type,
        chainName: chain,
        isActive: true
    };
}

const roomTypes = [
    { name: 'Standard Room', roomType: 'standard', base: 1999, total: 12, amenities: ['WiFi', 'AC', 'TV', 'Attached Bathroom'] },
    { name: 'Deluxe Room', roomType: 'deluxe', base: 3499, total: 8, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'City View'] },
    { name: 'Suite', roomType: 'suite', base: 6499, total: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Living Area', 'Premium View', 'Bathtub'] },
    { name: 'Premium Suite', roomType: 'superior', base: 9999, total: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Living Area', 'Panoramic View', 'Jacuzzi', 'Butler Service'] },
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelweb');
        console.log('Connected to MongoDB');

        // Clear existing
        await Hotel.deleteMany({});
        await Room.deleteMany({});

        const hotelsToSeed = [];
        for (const city of CITIES) {
            // 3-5 hotels per city
            const count = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < count; i++) {
                hotelsToSeed.push(generateHotel(city));
            }
        }

        console.log(`Generating rooms for ${hotelsToSeed.length} hotels...`);

        for (const hData of hotelsToSeed) {
            const hotel = await Hotel.create(hData);
            const star = hotel.starCategory;
            const rooms = roomTypes.slice(0, star >= 5 ? 4 : star >= 4 ? 3 : 2).map(r => ({
                hotel: hotel._id,
                name: r.name,
                roomType: r.roomType,
                pricePerNight: r.base + Math.floor(Math.random() * 1500) + (star * 300),
                totalRooms: r.total,
                availableRooms: r.total,
                amenities: r.amenities,
                isActive: true,
            }));
            await Room.create(rooms);
        }

        console.log(`Successfully seeded ${hotelsToSeed.length} hotels and their rooms.`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
