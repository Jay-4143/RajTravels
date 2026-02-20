require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Bus = require('../models/bus');
const connectDB = require('../config/db');

// Helper to build a seat map
function generateSeats(rows, cols, seatTypes, hasDeck = false) {
    const seats = [];
    const colLabels = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, cols);
    const decks = hasDeck ? ['lower', 'upper'] : ['lower'];

    for (const deck of decks) {
        for (let r = 1; r <= rows; r++) {
            for (let c = 0; c < cols; c++) {
                seats.push({
                    seatNumber: `${deck === 'upper' ? 'U' : ''}${colLabels[c]}${r}`,
                    type: seatTypes[c] || 'aisle',
                    deck,
                    isBooked: Math.random() < 0.25, // ~25% pre-booked
                });
            }
        }
    }
    return seats;
}

const today = new Date();

const buses = [
    // ── Mumbai → Pune ──────────────────────────────────────
    {
        busName: 'Shivneri Express',
        busNumber: 'MH12AB1234',
        operatorName: 'MSRTC',
        busType: 'AC Seater',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '06:00',
        arrivalTime: '09:30',
        duration: '3h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 350,
        totalSeats: 40,
        amenities: ['WiFi', 'AC', 'USB Charging', 'Water Bottle', 'Live Tracking'],
        rating: 4.5,
        totalRatings: 245,
        cancellationPolicy: 'Free Cancellation',
        liveTracking: true,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    },
    {
        busName: 'Pune Rocket',
        busNumber: 'MH12CD5678',
        operatorName: 'RedBus Travels',
        busType: 'Volvo AC',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '07:30',
        arrivalTime: '11:00',
        duration: '3h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 420,
        totalSeats: 40,
        amenities: ['WiFi', 'AC', 'Extra Legroom', 'Reading Light', 'Blanket'],
        rating: 4.3,
        totalRatings: 189,
        cancellationPolicy: 'Partial Refund',
        liveTracking: true,
        images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800'],
    },
    {
        busName: 'NightStar Sleeper',
        busNumber: 'MH12EF9012',
        operatorName: 'Orange Travel',
        busType: 'AC Sleeper',
        from: 'Mumbai',
        to: 'Pune',
        departureTime: '23:00',
        arrivalTime: '02:30',
        duration: '3h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 599,
        totalSeats: 30,
        amenities: ['AC', 'Sleeper Berth', 'Blanket', 'Pillow', 'Curtain'],
        rating: 4.1,
        totalRatings: 120,
        cancellationPolicy: 'Partial Refund',
        liveTracking: false,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    },
    // ── Delhi → Jaipur ──────────────────────────────────────
    {
        busName: 'Pink City Cruiser',
        busNumber: 'DL01GH3456',
        operatorName: 'RSRTC',
        busType: 'Volvo AC',
        from: 'Delhi',
        to: 'Jaipur',
        departureTime: '05:30',
        arrivalTime: '10:30',
        duration: '5h 00m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 550,
        totalSeats: 45,
        amenities: ['WiFi', 'AC', 'USB Charging', 'Water Bottle', 'Snacks'],
        rating: 4.6,
        totalRatings: 312,
        cancellationPolicy: 'Free Cancellation',
        liveTracking: true,
        images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800'],
    },
    {
        busName: 'Desert Express',
        busNumber: 'DL01IJ7890',
        operatorName: 'Raj Travels',
        busType: 'Semi-Sleeper',
        from: 'Delhi',
        to: 'Jaipur',
        departureTime: '10:00',
        arrivalTime: '15:30',
        duration: '5h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 450,
        totalSeats: 35,
        amenities: ['AC', 'Semi-Sleeper Seats', 'Movie Screen'],
        rating: 4.0,
        totalRatings: 156,
        cancellationPolicy: 'Non-Refundable',
        liveTracking: false,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    },
    // ── Bangalore → Chennai ──────────────────────────────────────
    {
        busName: 'Metro Connect',
        busNumber: 'KA01KL2345',
        operatorName: 'KSRTC',
        busType: 'AC Seater',
        from: 'Bangalore',
        to: 'Chennai',
        departureTime: '07:00',
        arrivalTime: '12:30',
        duration: '5h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 650,
        totalSeats: 40,
        amenities: ['WiFi', 'AC', 'USB Charging', 'Snacks', 'Live Tracking'],
        rating: 4.4,
        totalRatings: 278,
        cancellationPolicy: 'Free Cancellation',
        liveTracking: true,
        images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800'],
    },
    {
        busName: 'South Silk Road',
        busNumber: 'KA01MN5678',
        operatorName: 'SRS Travels',
        busType: 'AC Sleeper',
        from: 'Bangalore',
        to: 'Chennai',
        departureTime: '22:00',
        arrivalTime: '03:30',
        duration: '5h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 850,
        totalSeats: 30,
        amenities: ['AC', 'Sleeper Berth', 'Blanket', 'Pillow', 'Curtain', 'Charging Port'],
        rating: 4.7,
        totalRatings: 198,
        cancellationPolicy: 'Partial Refund',
        liveTracking: true,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    },
    // ── Hyderabad → Goa ──────────────────────────────────────
    {
        busName: 'Coastal Wanderer',
        busNumber: 'TS01OP9012',
        operatorName: 'VRL Travels',
        busType: 'Volvo AC',
        from: 'Hyderabad',
        to: 'Goa',
        departureTime: '16:00',
        arrivalTime: '07:00',
        duration: '15h 00m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 1200,
        totalSeats: 40,
        amenities: ['WiFi', 'AC', 'Extra Legroom', 'Blanket', 'Pillow', 'Reading Light'],
        rating: 4.3,
        totalRatings: 134,
        cancellationPolicy: 'Partial Refund',
        liveTracking: true,
        images: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800'],
    },
    // ── Chennai → Bangalore ──────────────────────────────────────
    {
        busName: 'Techno Bullet',
        busNumber: 'TN01QR3456',
        operatorName: 'Parveen Travels',
        busType: 'AC Seater',
        from: 'Chennai',
        to: 'Bangalore',
        departureTime: '06:30',
        arrivalTime: '12:00',
        duration: '5h 30m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 600,
        totalSeats: 40,
        amenities: ['WiFi', 'AC', 'USB Charging', 'Water Bottle'],
        rating: 4.2,
        totalRatings: 167,
        cancellationPolicy: 'Free Cancellation',
        liveTracking: false,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    },
    // ── Ahmedabad → Mumbai ──────────────────────────────────────
    {
        busName: 'Gujrat Express',
        busNumber: 'GJ01ST7890',
        operatorName: 'GSRTC',
        busType: 'Non-AC Sleeper',
        from: 'Ahmedabad',
        to: 'Mumbai',
        departureTime: '20:00',
        arrivalTime: '06:00',
        duration: '10h 00m',
        travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        price: 750,
        totalSeats: 36,
        amenities: ['Sleeper Berth', 'Fan', 'Curtain'],
        rating: 3.8,
        totalRatings: 89,
        cancellationPolicy: 'Non-Refundable',
        liveTracking: false,
        images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'],
    },
];

// Generate seats for each bus
const busesWithSeats = buses.map(b => ({
    ...b,
    seats: generateSeats(
        b.busType.includes('Sleeper') ? 8 : 10,
        b.busType.includes('Sleeper') ? 4 : 4,
        ['window', 'aisle', 'aisle', 'window'],
        b.busType.includes('Sleeper')
    ),
    availableSeats: b.totalSeats, // will be adjusted below
}));

// Fix availableSeats after generating seats
busesWithSeats.forEach(b => {
    const booked = b.seats.filter(s => s.isBooked).length;
    b.availableSeats = b.totalSeats - booked;
});

const seed = async () => {
    try {
        await connectDB();
        await Bus.deleteMany({});
        const result = await Bus.insertMany(busesWithSeats);
        console.log(`✅ ${result.length} buses seeded successfully!`);
        process.exit();
    } catch (e) {
        console.error('❌ Error seeding buses:', e.message);
        process.exit(1);
    }
};

seed();
