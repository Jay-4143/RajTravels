require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Package = require('../models/package');
const connectDB = require('../config/db');

const packages = [
    // ── International ─────────────────────────────────────────
    {
        title: "Magical Thailand – Bangkok & Pattaya",
        type: "international",
        destination: "Thailand",
        country: "Thailand",
        category: ["Beach", "City"],
        theme: ["International"],
        featured: true,
        hotDeal: true,
        duration: { days: 6, nights: 5 },
        price: 26115,
        pricePerPerson: 26115,
        itinerary: [
            { day: 1, title: "Arrival Bangkok", description: "Arrive Bangkok, hotel check-in. Evening Chao Phraya cruise.", activities: ["Airport Transfer", "Chao Phraya Cruise"] },
            { day: 2, title: "Bangkok City Tour", description: "Visit Grand Palace, Wat Pho, and floating market.", activities: ["Grand Palace", "Wat Pho", "Floating Market"] },
            { day: 3, title: "Bangkok – Pattaya", description: "Drive to Pattaya. Coral Island boat trip.", activities: ["Coral Island Trip", "Pattaya Beach"] },
            { day: 4, title: "Pattaya Leisure", description: "Visit Nong Nooch Garden and Tiger Zoo.", activities: ["Nong Nooch", "Tiger Zoo"] },
            { day: 5, title: "Pattaya – Bangkok", description: "Return to Bangkok. Shopping at MBK.", activities: ["MBK Shopping"] },
            { day: 6, title: "Departure", description: "Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["4-Star Hotel Accommodation", "Daily Breakfast", "Airport Transfers", "Coral Island Tour", "Chao Phraya Cruise"],
        exclusions: ["Airfare", "Visa Fees", "Lunch & Dinner", "Personal Expenses"],
        images: ["https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800", "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800"],
        highlights: ["Grand Palace", "Coral Island", "Floating Market", "Night Bazaar"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Singapore City Escape",
        type: "international",
        destination: "Singapore",
        country: "Singapore",
        category: ["City", "Family"],
        theme: ["International"],
        featured: true,
        hotDeal: false,
        duration: { days: 5, nights: 4 },
        price: 27972,
        pricePerPerson: 27972,
        itinerary: [
            { day: 1, title: "Arrival Singapore", description: "Arrive Singapore. Evening at Clarke Quay.", activities: ["Clarke Quay"] },
            { day: 2, title: "City & Sentosa", description: "Morning city tour, afternoon Sentosa Island.", activities: ["City Tour", "Sentosa Island", "Universal Studios"] },
            { day: 3, title: "Gardens by the Bay", description: "Visit Marina Bay Sands and Gardens by the Bay.", activities: ["Marina Bay", "Gardens by the Bay"] },
            { day: 4, title: "Jurong Bird Park", description: "Visit Jurong Bird Park and Night Safari.", activities: ["Bird Park", "Night Safari"] },
            { day: 5, title: "Departure", description: "Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["4-Star Hotel", "Breakfast", "Transfers", "Sentosa Tour", "Night Safari"],
        exclusions: ["Airfare", "Visa", "Lunch & Dinner"],
        images: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800"],
        highlights: ["Marina Bay", "Universal Studios", "Night Safari", "Gardens by Bay"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Dazzling Dubai – Land of Gold",
        type: "international",
        destination: "Dubai",
        country: "UAE",
        category: ["City", "Luxury"],
        theme: ["International"],
        featured: true,
        hotDeal: true,
        duration: { days: 6, nights: 5 },
        price: 45000,
        pricePerPerson: 45000,
        itinerary: [
            { day: 1, title: "Arrival Dubai", description: "Arrive in Dubai. Dhow Cruise dinner.", activities: ["Airport Transfer", "Dhow Cruise"] },
            { day: 2, title: "Dubai City Tour", description: "Half day city tour + Burj Khalifa.", activities: ["Burj Khalifa", "Dubai Mall"] },
            { day: 3, title: "Desert Safari", description: "Afternoon Desert Safari with BBQ dinner.", activities: ["Dune Bashing", "BBQ Dinner", "Camel Ride"] },
            { day: 4, title: "Abu Dhabi Day Trip", description: "Day trip to Abu Dhabi and Ferrari World.", activities: ["Sheikh Zayed Mosque", "Ferrari World"] },
            { day: 5, title: "Shopping Leisure", description: "Free day. Visit Gold Souk and Spice Souk.", activities: ["Gold Souk", "Spice Souk", "Dubai Mall"] },
            { day: 6, title: "Departure", description: "Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["Visa Assistance", "5-Star Hotel", "Breakfast", "All Tours", "Airport Transfers"],
        exclusions: ["Flights", "Lunch", "Personal Expenses"],
        images: ["https://images.unsplash.com/photo-1512453979798-5ea90b798d5c?w=800", "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800"],
        highlights: ["Burj Khalifa", "Desert Safari", "Ferrari World", "Gold Souk"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Bali – Island of Gods",
        type: "international",
        destination: "Bali",
        country: "Indonesia",
        category: ["Beach", "Romantic", "Honeymoon"],
        theme: ["International"],
        featured: true,
        hotDeal: false,
        duration: { days: 7, nights: 6 },
        price: 16670,
        pricePerPerson: 16670,
        itinerary: [
            { day: 1, title: "Arrival Bali", description: "Arrive Denpasar. Transfer to Kuta.", activities: ["Hotel Check-in"] },
            { day: 2, title: "Ubud Day Trip", description: "Visit Ubud Monkey Forest, Tegalalang Rice Terrace.", activities: ["Monkey Forest", "Rice Terrace"] },
            { day: 3, title: "Temple Tour", description: "Uluwatu Temple and Kecak Dance.", activities: ["Uluwatu Temple", "Kecak Dance"] },
            { day: 4, title: "Water Sports", description: "Beach leisure and water sports at Tanjung Benoa.", activities: ["Snorkeling", "Parasailing"] },
            { day: 5, title: "Seminyak", description: "Explore Seminyak and sunset at Kuta Beach.", activities: ["Shopping", "Beach Sunset"] },
            { day: 6, title: "Cooking Class", description: "Balinese cooking class and spa.", activities: ["Cooking Class", "Spa"] },
            { day: 7, title: "Departure", description: "Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["Villa/Hotel Stay", "Daily Breakfast", "Uluwatu Tour", "Airport Transfers"],
        exclusions: ["Flights", "Lunch & Dinner", "Visa"],
        images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800"],
        highlights: ["Uluwatu Sunset", "Rice Terraces", "Monkey Forest", "Spa"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Maldives Bliss – Luxury Overwater",
        type: "international",
        destination: "Maldives",
        country: "Maldives",
        category: ["Beach", "Honeymoon", "Luxury"],
        theme: ["International"],
        featured: true,
        hotDeal: false,
        duration: { days: 5, nights: 4 },
        price: 74880,
        pricePerPerson: 74880,
        itinerary: [
            { day: 1, title: "Arrival", description: "Arrive Malé. Speedboat to resort.", activities: ["Speedboat Transfer"] },
            { day: 2, title: "Beach Leisure", description: "Relaxation on private beach and snorkeling.", activities: ["Snorkeling", "Beach"] },
            { day: 3, title: "Diving & Water Sports", description: "Scuba diving and dolphin watching.", activities: ["Scuba Diving", "Dolphin Cruise"] },
            { day: 4, title: "Spa Day", description: "Overwater bungalow relaxation and sunset cruise.", activities: ["Spa", "Sunset Cruise"] },
            { day: 5, title: "Departure", description: "Speedboat to Malé airport.", activities: ["Airport Transfer"] }
        ],
        inclusions: ["Overwater Bungalow", "All Meals", "Speedboat", "Snorkeling Gear"],
        exclusions: ["International Flights", "Alcohol", "Scuba Diving (Extra)"],
        images: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", "https://images.unsplash.com/photo-1573939898754-a25e0eb83649?w=800"],
        highlights: ["Overwater Villa", "Coral Reef", "Dolphin Watching", "Private Beach"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Vietnam Heritage Trail",
        type: "international",
        destination: "Vietnam",
        country: "Vietnam",
        category: ["City", "Heritage"],
        theme: ["International"],
        featured: false,
        hotDeal: true,
        duration: { days: 8, nights: 7 },
        price: 18824,
        pricePerPerson: 18824,
        itinerary: [
            { day: 1, title: "Arrival Hanoi", description: "Arrive Hanoi. Old Quarter walk.", activities: ["Old Quarter"] },
            { day: 2, title: "Hanoi City Tour", description: "Hoan Kiem Lake, Ho Chi Minh Mausoleum.", activities: ["Hoan Kiem", "Ho Chi Minh Mausoleum"] },
            { day: 3, title: "Ha Long Bay", description: "Cruise Halong Bay overnight.", activities: ["Ha Long Bay Cruise"] },
            { day: 4, title: "Ha Long – Hoi An", description: "Island kayaking, fly to Hoi An.", activities: ["Kayaking", "Ancient Town"] },
            { day: 5, title: "Hoi An", description: "Ancient Town lantern festival and cooking.", activities: ["Lantern Festival", "Cooking Class"] },
            { day: 6, title: "Ho Chi Minh City", description: "Fly to HCMC. War Remnants Museum.", activities: ["War Museum", "Reunification Palace"] },
            { day: 7, title: "Cu Chi Tunnels", description: "Cu Chi Tunnels tour.", activities: ["Cu Chi Tunnels"] },
            { day: 8, title: "Departure", description: "Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["Hotels", "Ha Long Bay Cruise", "Breakfast", "Transfers", "Tours"],
        exclusions: ["International Flights", "Lunch & Dinner", "Visa"],
        images: ["https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=800"],
        highlights: ["Ha Long Bay", "Hoi An Lanterns", "Cu Chi Tunnels", "Street Food"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    // ── Domestic ─────────────────────────────────────────────
    {
        title: "Kerala God's Own Country",
        type: "domestic",
        destination: "Kerala",
        country: "India",
        category: ["Beach", "Nature"],
        theme: ["Domestic"],
        featured: true,
        hotDeal: false,
        duration: { days: 6, nights: 5 },
        price: 25000,
        pricePerPerson: 25000,
        itinerary: [
            { day: 1, title: "Arrival Cochin", description: "Arrive at Cochin airport. Transfer to Munnar.", activities: ["Airport Transfer"] },
            { day: 2, title: "Munnar Sightseeing", description: "Tea gardens and Mattupetty Dam.", activities: ["Tea Museum", "Mattupetty Dam"] },
            { day: 3, title: "Thekkady", description: "Boat ride in Periyar Lake.", activities: ["Periyar Lake", "Spice Plantation"] },
            { day: 4, title: "Alleppey Houseboat", description: "Traditional houseboat stay.", activities: ["Houseboat Cruise"] },
            { day: 5, title: "Kovalam Beach", description: "Relax at Kovalam Beach.", activities: ["Beach Leisure"] },
            { day: 6, title: "Departure", description: "Transfer to Cochin airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["Accommodation", "Breakfast", "Houseboat Stay", "Transfers", "Sightseeing"],
        exclusions: ["Airfare", "Lunch & Dinner", "Personal Expenses"],
        images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800", "https://images.unsplash.com/photo-1593693396885-5b589cd5bec4?w=800"],
        highlights: ["Houseboat Stay", "Tea Gardens", "Periyar Wildlife", "Backwaters"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Himachal Mountain Magic – Shimla & Manali",
        type: "domestic",
        destination: "Manali",
        country: "India",
        category: ["Nature", "Adventure"],
        theme: ["Domestic"],
        featured: true,
        hotDeal: true,
        duration: { days: 7, nights: 6 },
        price: 18000,
        pricePerPerson: 18000,
        itinerary: [
            { day: 1, title: "Delhi to Shimla", description: "Drive from Delhi to Shimla.", activities: ["Scenic Drive"] },
            { day: 2, title: "Shimla Sightseeing", description: "Kufri, Mall Road and Christ Church.", activities: ["Kufri", "Mall Road", "Christ Church"] },
            { day: 3, title: "Shimla to Manali", description: "Drive to Manali via Kullu.", activities: ["Kullu Rafting"] },
            { day: 4, title: "Manali Sightseeing", description: "Solang Valley and Hadimba Temple.", activities: ["Solang Valley", "Hadimba Temple", "Rohtang Pass"] },
            { day: 5, title: "Manali Adventure", description: "Paragliding and River rafting.", activities: ["Paragliding", "River Rafting"] },
            { day: 6, title: "Manali to Chandigarh", description: "Drive to Chandigarh.", activities: ["Rock Garden"] },
            { day: 7, title: "Departure Delhi", description: "Drive back or fly from Chandigarh.", activities: ["Drop at Delhi"] }
        ],
        inclusions: ["AC Transport", "Hotels", "Breakfast & Dinner", "Sightseeing"],
        exclusions: ["Airfare", "Lunch", "Entry Fees"],
        images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800", "https://images.unsplash.com/photo-1588873280036-7cbdf569229b?w=800"],
        highlights: ["Snow Points", "Rohtang Pass", "Paragliding", "Mall Road"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Rajasthan Royal Heritage Tour",
        type: "domestic",
        destination: "Rajasthan",
        country: "India",
        category: ["Heritage", "Cultural"],
        theme: ["Domestic"],
        featured: false,
        hotDeal: true,
        duration: { days: 8, nights: 7 },
        price: 22000,
        pricePerPerson: 22000,
        itinerary: [
            { day: 1, title: "Arrival Jaipur", description: "Arrive in the Pink City.", activities: ["Hotel Check-in"] },
            { day: 2, title: "Jaipur Forts", description: "Amber Fort, Hawa Mahal and City Palace.", activities: ["Amber Fort", "Hawa Mahal"] },
            { day: 3, title: "Jaipur – Jodhpur", description: "Drive to Jodhpur via Ajmer.", activities: ["Dargah Ajmer Sharif"] },
            { day: 4, title: "Jodhpur – Blue City", description: "Mehrangarh Fort and Jaswant Thada.", activities: ["Mehrangarh Fort", "Clock Tower Market"] },
            { day: 5, title: "Jodhpur – Jaisalmer", description: "Drive to the Golden City.", activities: ["Desert Drive"] },
            { day: 6, title: "Jaisalmer", description: "Jaisalmer Fort, Havelis, Desert Safari.", activities: ["Jaisalmer Fort", "Sam Dunes", "Camel Ride"] },
            { day: 7, title: "Jaisalmer – Bikaner", description: "Drive to Bikaner. Junagarh Fort.", activities: ["Junagarh Fort"] },
            { day: 8, title: "Departure", description: "Transfer to airport/railway.", activities: ["Drop"] }
        ],
        inclusions: ["Heritage Hotel", "Breakfast", "AC Coach", "Sightseeing", "Desert Safari"],
        exclusions: ["Airfare", "Lunch & Dinner", "Tips"],
        images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800", "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800"],
        highlights: ["Amber Fort", "Desert Safari", "Sam Dunes", "Hawa Mahal"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Goa – Sun, Sand & Party",
        type: "domestic",
        destination: "Goa",
        country: "India",
        category: ["Beach", "Leisure"],
        theme: ["Domestic"],
        featured: true,
        hotDeal: false,
        duration: { days: 5, nights: 4 },
        price: 14000,
        pricePerPerson: 14000,
        itinerary: [
            { day: 1, title: "Arrival Goa", description: "Arrive Goa airport. Transfer to resort.", activities: ["Resort Check-in"] },
            { day: 2, title: "North Goa Tour", description: "Calangute, Baga, Fort Aguada, Cruise.", activities: ["Baga Beach", "Fort Aguada", "Mandovi Cruise"] },
            { day: 3, title: "South Goa", description: "Colva Beach, Palolem, Old Goa Churches.", activities: ["Basilica of Bom Jesus", "Palolem Beach"] },
            { day: 4, title: "Leisure & Water Sports", description: "Water sports, beach shacks, sunset.", activities: ["Jet Ski", "Parasailing", "Beach Shack"] },
            { day: 5, title: "Departure", description: "Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["Beach Resort", "Breakfast", "North & South Goa Tour", "Transfers"],
        exclusions: ["Flights", "Lunch & Dinner", "Water Sports"],
        images: ["https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800", "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800"],
        highlights: ["Baga Beach", "Fort Aguada", "Old Goa Churches", "Nightlife"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    },
    {
        title: "Andaman Nicobar – Pearl of the Ocean",
        type: "domestic",
        destination: "Andaman",
        country: "India",
        category: ["Beach", "Adventure"],
        theme: ["Domestic"],
        featured: false,
        hotDeal: false,
        duration: { days: 6, nights: 5 },
        price: 32000,
        pricePerPerson: 32000,
        itinerary: [
            { day: 1, title: "Arrival Port Blair", description: "Arrive Port Blair.", activities: ["Cellular Jail Light & Sound Show"] },
            { day: 2, title: "Port Blair Tour", description: "Cellular Jail and Corbyn's Cove Beach.", activities: ["Cellular Jail", "Corbyn's Cove"] },
            { day: 3, title: "Havelock Island", description: "Ferry to Havelock. Radhanagar Beach.", activities: ["Radhanagar Beach"] },
            { day: 4, title: "Scuba Diving", description: "Scuba diving and Elephant Beach snorkeling.", activities: ["Scuba Diving", "Elephant Beach"] },
            { day: 5, title: "Neil Island", description: "Ferry to Neil Island. Natural Bridge.", activities: ["Natural Bridge", "Bharatpur Beach"] },
            { day: 6, title: "Departure", description: "Ferry back. Transfer to airport.", activities: ["Airport Drop"] }
        ],
        inclusions: ["Hotels", "Breakfast", "Ferry Tickets", "Cellular Jail Entry", "Sightseeing"],
        exclusions: ["Airfare to Port Blair", "Scuba Diving", "Lunch & Dinner"],
        images: ["https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800"],
        highlights: ["Radhanagar Beach", "Scuba Diving", "Cellular Jail", "Neil Island"],
        validFrom: new Date(), validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        isActive: true
    }
];

const seedPackages = async () => {
    try {
        await connectDB();
        await Package.deleteMany({});
        const result = await Package.insertMany(packages);
        console.log(`✅ ${result.length} Packages seeded successfully!`);
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding packages:', error.message);
        process.exit(1);
    }
};

seedPackages();
