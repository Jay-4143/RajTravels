require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Cruise = require('../models/cruise');
const CruiseCabin = require('../models/cruiseCabin');

// ─── Images ──────────────────────────────────────────────────────────────────
const IMGS = {
    ocean1: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800",
    ocean2: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800",
    ocean3: "https://images.unsplash.com/photo-1500021881444-5b4860ff7e79?w=800",
    ocean4: "https://images.unsplash.com/photo-1540759786422-560bb5ce46ef?w=800",
    river1: "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800",
    river2: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    luxury: "https://images.unsplash.com/photo-1504609770332-e29fb2d2d517?w=800",
};

// ─── Helper: future date from today ──────────────────────────────────────────
const future = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
};

// ─── Cruise Data ─────────────────────────────────────────────────────────────
const cruises = [
    // ── DOMESTIC CRUISES ──
    {
        name: "Empress of the Seas",
        operator: "Cordelia Cruises",
        type: "domestic",
        description: "Experience luxury at sea with Cordelia Cruises. From fine dining to Broadway-style shows, the Empress offers an unforgettable journey along the stunning Indian coastline. Sail from the city of dreams, Mumbai, to Goa.",
        duration: 3,
        departurePort: "Mumbai",
        arrivalPort: "Goa",
        departureDate: future(30),
        images: [IMGS.ocean1, IMGS.ocean2],
        amenities: ["Fine Dining", "Casino", "Pool", "Spa", "Theater", "Live Bar", "Water Slides"],
        rating: 4.6,
        reviewCount: 218,
        itinerary: [
            { day: 1, port: "Mumbai", arrival: "—", departure: "17:00", activity: "Boarding, Welcome Dinner & Live Show" },
            { day: 2, port: "At Sea", arrival: "—", departure: "—", activity: "Onboard Relaxation, Games & Deck Party" },
            { day: 3, port: "Goa", arrival: "09:00", departure: "21:00", activity: "Free Day in Goa – Beach & Forts" },
            { day: 4, port: "Mumbai", arrival: "10:00", departure: "—", activity: "Disembarkation & Fond Farewell" }
        ]
    },
    {
        name: "Celebrity Eclipse",
        operator: "Celebrity Cruises",
        type: "domestic",
        description: "Celebrity Eclipse offers a premium cruising experience with world-class dining, exclusive excursions and the Adults-only Solarium. Ideal for couples and solo travellers along the stunning Lakshadweep coast.",
        duration: 4,
        departurePort: "Kochi",
        arrivalPort: "Kochi",
        departureDate: future(45),
        images: [IMGS.luxury, IMGS.ocean4],
        amenities: ["Solarium (Adults Only)", "Lawn Club", "Celebrity iLounge", "Sushi Bar", "Martini Bar"],
        rating: 4.5,
        reviewCount: 201,
        itinerary: [
            { day: 1, port: "Kochi", arrival: "—", departure: "16:00", activity: "Embarkation & Sunset Cocktails" },
            { day: 2, port: "Lakshadweep", arrival: "07:00", departure: "18:00", activity: "Snorkelling & Island Tour" },
            { day: 3, port: "At Sea", arrival: "—", departure: "—", activity: "Spa, Yoga & Cooking Classes" },
            { day: 4, port: "Kochi", arrival: "08:00", departure: "—", activity: "Disembarkation" }
        ]
    },
    {
        name: "Ganges Queen",
        operator: "Antara River Cruises",
        type: "domestic",
        description: "A serene river cruise experience along the holy Ganges River. Discover the hidden gems of West Bengal, terracotta temples of Kalna, and the timeless ghats of Varanasi.",
        duration: 7,
        departurePort: "Kolkata",
        arrivalPort: "Varanasi",
        departureDate: future(60),
        images: [IMGS.river1, IMGS.river2],
        amenities: ["Heritage Lectures", "Viewing Deck", "Eco-friendly", "Traditional Cuisine", "Yoga Sessions"],
        rating: 4.5,
        reviewCount: 134,
        itinerary: [
            { day: 1, port: "Kolkata", arrival: "—", departure: "10:00", activity: "Spiritual Journey Begins" },
            { day: 2, port: "Kalna", arrival: "09:00", departure: "17:00", activity: "Terracotta Temples Visit" },
            { day: 3, port: "Matiari", arrival: "08:00", departure: "16:00", activity: "Brass-working Village Tour" },
            { day: 7, port: "Varanasi", arrival: "11:00", departure: "—", activity: "Ganga Aarti & Disembarkation" }
        ]
    },
    {
        name: "Andaman Serenity",
        operator: "Makruzz Cruises",
        type: "domestic",
        description: "A luxurious high-speed catamaran cruise through the pristine Andaman islands. Experience crystal clear waters, vibrant coral reefs, and untouched beaches.",
        duration: 5,
        departurePort: "Port Blair",
        arrivalPort: "Port Blair",
        departureDate: future(35),
        images: [IMGS.ocean3, IMGS.ocean1],
        amenities: ["Speed Ferry", "Snorkelling", "Beach Access", "Nature Trails", "Onboard Meals"],
        rating: 4.4,
        reviewCount: 178,
        itinerary: [
            { day: 1, port: "Port Blair", arrival: "—", departure: "09:00", activity: "Island Hopping Begins" },
            { day: 2, port: "Havelock Island", arrival: "11:00", departure: "—", activity: "Radhanagar Beach & Snorkelling" },
            { day: 3, port: "Neil Island", arrival: "10:00", departure: "17:00", activity: "Coral Reef Exploration" },
            { day: 5, port: "Port Blair", arrival: "09:00", departure: "—", activity: "Farewell & Disembarkation" }
        ]
    },
    // ── INTERNATIONAL CRUISES ──
    {
        name: "Spectrum of the Seas",
        operator: "Royal Caribbean",
        type: "international",
        description: "One of the most innovative cruise ships in the world. Features iFly skydiving simulation, the North Star observation pod, and globally inspired dining — perfect for families and adventurers.",
        duration: 5,
        departurePort: "Singapore",
        arrivalPort: "Singapore",
        departureDate: future(50),
        images: [IMGS.ocean2, IMGS.ocean3],
        amenities: ["iFly Skydiving", "North Star", "Bionic Bar", "FlowRider", "Multiplex", "Sky Pad"],
        rating: 4.8,
        reviewCount: 512,
        itinerary: [
            { day: 1, port: "Singapore", arrival: "—", departure: "16:30", activity: "Sail from Marina Bay" },
            { day: 2, port: "Port Klang (Malaysia)", arrival: "07:00", departure: "18:00", activity: "Kuala Lumpur City Tour" },
            { day: 3, port: "Penang (Malaysia)", arrival: "08:00", departure: "20:00", activity: "Street Food & Heritage Walk" },
            { day: 5, port: "Singapore", arrival: "07:00", departure: "—", activity: "Disembarkation" }
        ]
    },
    {
        name: "MSC Bellissima",
        operator: "MSC Cruises",
        type: "international",
        description: "MSC Bellissima features a stunning 96-metre promenade, a Galaxy Aqua Park, seven restaurants and the AI butler Zoe. An epic voyage from Mumbai to Dubai.",
        duration: 10,
        departurePort: "Mumbai",
        arrivalPort: "Dubai",
        departureDate: future(75),
        images: [IMGS.ocean4, IMGS.luxury],
        amenities: ["Aqua Park", "AI Butler Zoe", "Promenade", "7 Restaurants", "Kids Club", "Rooftop Cinema"],
        rating: 4.7,
        reviewCount: 389,
        itinerary: [
            { day: 1, port: "Mumbai", arrival: "—", departure: "18:00", activity: "Embarkation & Welcome Gala" },
            { day: 3, port: "Muscat (Oman)", arrival: "08:00", departure: "20:00", activity: "Sultan Qaboos Grand Mosque" },
            { day: 5, port: "Abu Dhabi", arrival: "07:00", departure: "23:00", activity: "Sheikh Zayed Mosque & Yas Island" },
            { day: 6, port: "Dubai", arrival: "07:00", departure: "—", activity: "City Tour & Disembarkation" }
        ]
    },
    {
        name: "Pearl of the Orient",
        operator: "Star Cruises",
        type: "international",
        description: "An iconic oriental cruise experience. The Pearl of the Orient takes travellers on a magnificent voyage through iconic Asian cities — rich culture, vibrant street food and ancient heritage.",
        duration: 6,
        departurePort: "Chennai",
        arrivalPort: "Singapore",
        departureDate: future(90),
        images: [IMGS.ocean2, IMGS.river1],
        amenities: ["Asian Fusion Dining", "Temple Trail Tours", "Karaoke Lounge", "Infinity Pool", "Night Market"],
        rating: 4.3,
        reviewCount: 167,
        itinerary: [
            { day: 1, port: "Chennai", arrival: "—", departure: "17:00", activity: "Embarkation & Cultural Show" },
            { day: 3, port: "Colombo (Sri Lanka)", arrival: "08:00", departure: "20:00", activity: "Temple of the Tooth & City Tour" },
            { day: 4, port: "Phuket (Thailand)", arrival: "07:00", departure: "21:00", activity: "James Bond Island & Phi Phi" },
            { day: 6, port: "Singapore", arrival: "07:00", departure: "—", activity: "Disembarkation" }
        ]
    },
    {
        name: "Costa Smeralda",
        operator: "Costa Cruises",
        type: "international",
        description: "The Costa Smeralda is one of the world's most eco-friendly cruise ships. A Mediterranean-inspired floating resort with Italian cuisine, elegant design, and sustainable luxury.",
        duration: 7,
        departurePort: "Dubai",
        arrivalPort: "Muscat",
        departureDate: future(65),
        images: [IMGS.luxury, IMGS.ocean3],
        amenities: ["Italian Cuisine", "LNG Powered", "Lido Pool", "Thermal Spa", "Nightclub", "Art Gallery"],
        rating: 4.6,
        reviewCount: 290,
        itinerary: [
            { day: 1, port: "Dubai", arrival: "—", departure: "18:00", activity: "Sail from Dubai Marina" },
            { day: 2, port: "Fujairah", arrival: "08:00", departure: "17:00", activity: "Heritage Village & Al Hayl Fort" },
            { day: 4, port: "Khasab", arrival: "07:00", departure: "19:00", activity: "Dhow Cruise & Dolphin Watching" },
            { day: 7, port: "Muscat", arrival: "07:00", departure: "—", activity: "Grand Mosque & Disembarkation" }
        ]
    }
];

// ─── Cabin Templates ──────────────────────────────────────────────────────────
const cabinTemplates = [
    { type: 'Interior', name: 'Interior Stateroom', price: 22000, capacity: 2, description: 'Comfortable & affordable cabin with modern amenities.', amenities: ['Twin Beds', 'LCD TV', 'Ensuite Bathroom', 'AC'], totalCabins: 60 },
    { type: 'Ocean View', name: 'Ocean View Stateroom', price: 34000, capacity: 2, description: 'Wake up to stunning sea views every morning.', amenities: ['Picture Window', 'Queen Bed', 'Sitting Area', 'Mini Fridge'], totalCabins: 45 },
    { type: 'Balcony', name: 'Balcony Stateroom', price: 52000, capacity: 3, description: 'Private balcony to enjoy the ocean breeze & sunsets.', amenities: ['Private Balcony', 'Mini Bar', 'Premium Bedding', 'Rain Shower'], totalCabins: 30 },
    { type: 'Suite', name: 'Grand Suite', price: 115000, capacity: 4, description: 'Indulge in the ultimate luxury suite experience.', amenities: ['Personal Butler', 'Priority Boarding', 'Jacuzzi', 'Expansive Balcony', 'Premium Spirits'], totalCabins: 12 }
];

// ─── Run ──────────────────────────────────────────────────────────────────────
const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelweb');
        console.log('✅ Connected to MongoDB');

        await Cruise.deleteMany();
        await CruiseCabin.deleteMany();
        console.log('🗑️  Cleared existing cruise data');

        for (const cData of cruises) {
            const cruise = await Cruise.create(cData);
            const cabins = cabinTemplates.map(t => ({
                ...t,
                cruise: cruise._id,
                availableCabins: t.totalCabins,
                price: Math.round(t.price * (1 + (Math.random() * 0.2 - 0.1)))
            }));
            await CruiseCabin.create(cabins);
            console.log(`🚢 Seeded: ${cruise.name} (${cruise.operator}) — departs in ${Math.round((cruise.departureDate - new Date()) / 86400000)} days`);
        }

        console.log(`\n✅ Done! Seeded ${cruises.length} cruises with 4 cabin types each.`);
    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
