require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Cab = require('../models/cab');

const IMAGES = {
    Sedan: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
    SUV: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    Luxury: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    Hatchback: "https://images.unsplash.com/photo-1441148347098-2ca61d403422?w=800"
};

const cities = ["Mumbai", "Delhi", "Bangalore", "Goa", "Pune", "Udaipur", "Ahmedabad", "Chennai", "Kolkata", "Hyderabad"];

const cabTemplates = [
    { vehicleName: "Maruti Suzuki Dzire", vehicleType: "Sedan", operator: "Uber Partner", basePrice: 450, pricePerKm: 12, capacity: 4, amenities: ["AC", "Music", "GPS", "Water Bottle"], fuelType: 'CNG', transmission: 'Manual', tags: ["Best Value"] },
    { vehicleName: "Honda Amaze", vehicleType: "Sedan", operator: "Ola Partner", basePrice: 480, pricePerKm: 13, capacity: 4, amenities: ["AC", "Music", "Carrier"], fuelType: 'Petrol', transmission: 'Automatic', tags: ["Top Rated"] },
    { vehicleName: "Toyota Innova Crysta", vehicleType: "SUV", operator: "Raj Travel Premium", basePrice: 1200, pricePerKm: 18, capacity: 6, amenities: ["AC", "Carrier", "Professional Driver", "Magazine"], fuelType: 'Diesel', transmission: 'Manual', tags: ["High Comfort"] },
    { vehicleName: "Mahindra XUV700", vehicleType: "SUV", operator: "City Cabs", basePrice: 1500, pricePerKm: 22, capacity: 6, amenities: ["Panoramic Sunroof", "AC", "Luxury Seating"], fuelType: 'Diesel', transmission: 'Automatic', tags: ["Luxury choice"] },
    { vehicleName: "Mercedes-Benz S-Class", vehicleType: "Luxury", operator: "Elite Chauffeurs", basePrice: 8000, pricePerKm: 65, capacity: 4, amenities: ["AC", "WiFi", "Newspaper", "Magazines", "ButlerService"], fuelType: 'Petrol', transmission: 'Automatic', tags: ["Presidential"] },
    { vehicleName: "Audi A6", vehicleType: "Luxury", operator: "Vantage Rides", basePrice: 6000, pricePerKm: 55, capacity: 4, amenities: ["AC", "Refreshments", "Leather Seats"], fuelType: 'Petrol', transmission: 'Automatic', tags: ["Corporate Choice"] },
    { vehicleName: "Swift", vehicleType: "Hatchback", operator: "Local Cabs", basePrice: 350, pricePerKm: 10, capacity: 4, amenities: ["AC", "Compact"], fuelType: 'Petrol', transmission: 'Manual', tags: ["Budget Friendly"] },
    { vehicleName: "Tata Tiago EV", vehicleType: "Hatchback", operator: "Eco Rides", basePrice: 400, pricePerKm: 9, capacity: 4, amenities: ["AC", "Zero Emission", "Silent Drive"], fuelType: 'Electric', transmission: 'Automatic', tags: ["Eco Friendly"] }
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelweb');
        console.log('✅ Connected to MongoDB');

        await Cab.deleteMany();
        console.log('🗑️  Cleared existing cab data');

        const cabsToInsert = [];
        cities.forEach(city => {
            cabTemplates.forEach(template => {
                cabsToInsert.push({
                    ...template,
                    city,
                    images: [IMAGES[template.vehicleType] || IMAGES.Sedan],
                    rating: (4.2 + Math.random() * 0.7).toFixed(1),
                    reviewCount: Math.floor(Math.random() * 800) + 100
                });
            });
        });

        await Cab.insertMany(cabsToInsert);
        console.log(`✅ Successfully seeded ${cabsToInsert.length} Cabs across ${cities.length} cities.`);
    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
