require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Bus = require('../models/bus');

const operators = ['RedBus Express', 'VRL Travels', 'SRS Travels', 'Neeta Travels', 'Orange Travels', 'Paulo Travels', 'KSRTC Premium', 'MSRTC Shivneri', 'Parveen Travels', 'Kaveri Travels', 'IntrCity SmartBus', 'Greenline Travels', 'Yatra Express', 'Hans Travels', 'Rajdhani Travels'];
const types = ['Volvo AC', 'AC Sleeper', 'AC Seater', 'Semi-Sleeper', 'Non-AC Sleeper', 'Seater'];
const amenityPool = ['WiFi', 'USB Charging', 'Blanket', 'Water Bottle', 'Reading Light', 'Snacks', 'Live Tracking', 'Emergency Exit', 'CCTV', 'Entertainment Screen'];

const routes = [
    { from: 'Mumbai', to: 'Pune', dur: '3h 30m', price: 350 }, { from: 'Mumbai', to: 'Goa', dur: '10h 00m', price: 850 },
    { from: 'Mumbai', to: 'Bangalore', dur: '16h 00m', price: 1200 }, { from: 'Mumbai', to: 'Ahmedabad', dur: '8h 00m', price: 650 },
    { from: 'Mumbai', to: 'Nashik', dur: '4h 00m', price: 400 }, { from: 'Mumbai', to: 'Shirdi', dur: '5h 30m', price: 500 },
    { from: 'Delhi', to: 'Jaipur', dur: '5h 30m', price: 550 }, { from: 'Delhi', to: 'Chandigarh', dur: '5h 00m', price: 500 },
    { from: 'Delhi', to: 'Agra', dur: '4h 00m', price: 400 }, { from: 'Delhi', to: 'Lucknow', dur: '8h 00m', price: 750 },
    { from: 'Delhi', to: 'Dehradun', dur: '6h 00m', price: 600 }, { from: 'Delhi', to: 'Shimla', dur: '10h 00m', price: 900 },
    { from: 'Delhi', to: 'Manali', dur: '14h 00m', price: 1100 }, { from: 'Delhi', to: 'Haridwar', dur: '5h 00m', price: 480 },
    { from: 'Bangalore', to: 'Chennai', dur: '6h 00m', price: 550 }, { from: 'Bangalore', to: 'Hyderabad', dur: '10h 00m', price: 900 },
    { from: 'Bangalore', to: 'Mysore', dur: '3h 00m', price: 300 }, { from: 'Bangalore', to: 'Goa', dur: '10h 00m', price: 950 },
    { from: 'Bangalore', to: 'Ooty', dur: '7h 30m', price: 650 }, { from: 'Chennai', to: 'Pondicherry', dur: '3h 30m', price: 350 },
    { from: 'Chennai', to: 'Madurai', dur: '8h 00m', price: 700 }, { from: 'Chennai', to: 'Coimbatore', dur: '9h 00m', price: 750 },
    { from: 'Hyderabad', to: 'Vijayawada', dur: '5h 00m', price: 500 }, { from: 'Hyderabad', to: 'Tirupati', dur: '12h 00m', price: 950 },
    { from: 'Kolkata', to: 'Siliguri', dur: '10h 00m', price: 850 }, { from: 'Pune', to: 'Goa', dur: '8h 00m', price: 700 },
    { from: 'Pune', to: 'Shirdi', dur: '5h 00m', price: 450 }, { from: 'Jaipur', to: 'Udaipur', dur: '6h 00m', price: 550 },
    { from: 'Jaipur', to: 'Jodhpur', dur: '5h 30m', price: 500 }, { from: 'Ahmedabad', to: 'Rajkot', dur: '4h 00m', price: 380 },
    { from: 'Lucknow', to: 'Varanasi', dur: '5h 00m', price: 480 }, { from: 'Kochi', to: 'Munnar', dur: '4h 30m', price: 400 },
];

function generateSeats(total) {
    const seats = [];
    const rows = Math.ceil(total / 4);
    const cols = ['A', 'B', 'C', 'D'];
    const typeMap = { A: 'window', B: 'aisle', C: 'aisle', D: 'window' };
    for (let r = 1; r <= rows; r++)for (let c = 0; c < 4 && seats.length < total; c++) {
        seats.push({ seatNumber: `${cols[c]}${r}`, type: typeMap[cols[c]], deck: r <= rows / 2 ? 'lower' : 'upper', isBooked: Math.random() < 0.3 });
    }
    return seats;
}

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelweb');
        console.log('Connected to MongoDB');
        await Bus.deleteMany({});
        const buses = [];
        let busNum = 1001;
        // Generate buses for next 30 days
        for (let d = 0; d < 30; d++) {
            const date = new Date(Date.now() + d * 86400000);
            date.setHours(0, 0, 0, 0);
            for (const route of routes) {
                // 2-4 buses per route per day
                const count = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < count; i++) {
                    const op = operators[Math.floor(Math.random() * operators.length)];
                    const type = types[Math.floor(Math.random() * types.length)];
                    const depH = 5 + Math.floor(Math.random() * 19); // 5am to 11pm
                    const depM = Math.floor(Math.random() * 4) * 15;
                    const durH = parseInt(route.dur);
                    const durM = parseInt(route.dur.split('h ')[1]) || 0;
                    const arrH = (depH + durH + Math.floor((depM + durM) / 60)) % 24;
                    const arrM = (depM + durM) % 60;
                    const priceVar = route.price + Math.floor(Math.random() * 400) - 100;
                    const isAC = type.includes('AC') || type.includes('Volvo');
                    const totalSeats = type.includes('Sleeper') ? 30 : 40;
                    const amCount = 3 + Math.floor(Math.random() * 5);
                    const amenities = [...amenityPool].sort(() => Math.random() - 0.5).slice(0, amCount);
                    buses.push({
                        busName: `${op} ${type}`, busNumber: `${op.slice(0, 2).toUpperCase()}${busNum++}`,
                        operatorName: op, busType: type, from: route.from, to: route.to,
                        departureTime: `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`,
                        arrivalTime: `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`,
                        duration: route.dur, travelDate: date,
                        price: isAC ? priceVar + 200 : priceVar, totalSeats, availableSeats: Math.floor(totalSeats * 0.6 + Math.random() * totalSeats * 0.4),
                        amenities, rating: 3.5 + Math.random() * 1.5, totalRatings: 50 + Math.floor(Math.random() * 500),
                        cancellationPolicy: ['Free Cancellation', 'Partial Refund', 'Non-Refundable'][Math.floor(Math.random() * 3)],
                        liveTracking: Math.random() > 0.4, seats: generateSeats(totalSeats), isActive: true,
                    });
                }
            }
        }
        // Insert in batches
        const batch = 500;
        for (let i = 0; i < buses.length; i += batch) {
            await Bus.insertMany(buses.slice(i, i + batch));
        }
        console.log(`Seeded ${buses.length} buses across 30 days.`);
    } catch (e) { console.error(e); process.exit(1); }
    finally { await mongoose.disconnect(); process.exit(0); }
};
run();
