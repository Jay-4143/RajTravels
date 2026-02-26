import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchBuses, getCities } from '../api/busApi';
import {
    FaBus, FaMapMarkerAlt, FaCalendarAlt, FaSearch, FaArrowRight,
    FaWifi, FaPlug, FaStar, FaFilter, FaSnowflake, FaCheck,
    FaShieldAlt, FaRoute, FaClock, FaHeadset, FaMobileAlt,
    FaUserShield, FaRegSmile, FaChevronDown, FaChevronUp, FaQuoteLeft
} from 'react-icons/fa';
import { MdEventSeat, MdLocalOffer, MdVerified } from 'react-icons/md';
import { useGlobal } from '../context/GlobalContext';

// ─── DATA ──────────────────────────────────────────────────────────────────

const POPULAR_ROUTES = [
    {
        from: 'Mumbai', to: 'Pune', duration: '3h 30m', starting: 350,
        image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80',
        buses: 42, highlights: ['Expressway Route', 'Multiple Operators', 'Hourly Departures'],
        stops: ['Khopoli', 'Lonavala'], amenities: ['AC', 'WiFi', 'USB Charging'],
    },
    {
        from: 'Delhi', to: 'Jaipur', duration: '5h 00m', starting: 450,
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80',
        buses: 35, highlights: ['NH-48 / NH-21', 'Heritage Route', 'Luxury Options'],
        stops: ['Gurugram', 'Shahjahanpur'], amenities: ['AC', 'Reclining Seats', 'Blanket'],
    },
    {
        from: 'Bangalore', to: 'Chennai', duration: '5h 30m', starting: 600,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80',
        buses: 28, highlights: ['NH-48', 'KSRTC & Private', 'Sleeper Available'],
        stops: ['Krishnagiri', 'Vellore'], amenities: ['AC', 'Sleeper Berth', 'Pillow & Blanket'],
    },
    {
        from: 'Hyderabad', to: 'Goa', duration: '15h 00m', starting: 1200,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
        buses: 18, highlights: ['Overnight Journey', 'Beach Destination', 'Volvo AC Available'],
        stops: ['Bijapur', 'Kolhapur'], amenities: ['Sleeper', 'AC', 'Charging Port'],
    },
    {
        from: 'Chennai', to: 'Bangalore', duration: '5h 30m', starting: 550,
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80',
        buses: 30, highlights: ['NH-44', 'Frequent Departures', 'Tech Hub Route'],
        stops: ['Vellore', 'Ambur'], amenities: ['AC', 'WiFi', 'USB Port'],
    },
    {
        from: 'Ahmedabad', to: 'Mumbai', duration: '10h 00m', starting: 750,
        image: 'https://images.unsplash.com/photo-1596436338085-b3b8f2dce617?w=600&q=80',
        buses: 22, highlights: ['Overnight Option', 'NH-48', 'Business + Leisure'],
        stops: ['Surat', 'Vadodara'], amenities: ['AC', 'Semi-Sleeper', 'Blanket'],
    },
];


const BUS_TYPES = [
    {
        type: 'Volvo AC',
        tagline: 'Premium Comfort',
        desc: 'Luxury Volvo coaches with wide reclining seats, push-back, and extra legroom for the most comfortable journey.',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
        color: 'from-blue-600 to-blue-800',
        badge: '⭐ Best Seller',
        amenities: ['AC', 'WiFi', 'USB Charging', 'Extra Legroom'],
    },
    {
        type: 'AC Sleeper',
        tagline: 'Sleep & Arrive Fresh',
        desc: 'Fully flat sleeper berths with curtains for privacy. Perfect for overnight long-distance journeys.',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        color: 'from-purple-600 to-purple-900',
        badge: '🌙 Overnight Pick',
        amenities: ['Sleeper Berth', 'Blanket', 'Pillow', 'Curtain'],
    },
    {
        type: 'Semi-Sleeper',
        tagline: 'Comfort at Value',
        desc: 'Push-back semi-sleeper seats offering an excellent balance of comfort and affordability.',
        image: 'https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=800&q=80',
        color: 'from-teal-500 to-teal-700',
        badge: '💰 Value Pick',
        amenities: ['AC', 'Push-back Seat', 'Reading Light'],
    },
];

const HOW_IT_WORKS = [
    {
        step: '01',
        icon: <FaSearch className="text-3xl text-blue-600" />,
        title: 'Search Your Route',
        desc: 'Enter your source, destination, and travel date. Choose from hundreds of buses across India.',
        color: 'bg-blue-50 border-blue-200',
    },
    {
        step: '02',
        icon: <MdEventSeat className="text-3xl text-purple-600" />,
        title: 'Pick Your Seat',
        desc: 'View an interactive seat map. Select your preferred window or aisle seat for maximum comfort.',
        color: 'bg-purple-50 border-purple-200',
    },
    {
        step: '03',
        icon: <FaUserShield className="text-3xl text-teal-600" />,
        title: 'Fill Passenger Info',
        desc: 'Enter passenger names, ages, and contact info. Add multiple passengers for group travel.',
        color: 'bg-teal-50 border-teal-200',
    },
    {
        step: '04',
        icon: <MdVerified className="text-3xl text-green-600" />,
        title: 'Get Instant PNR',
        desc: 'Confirm your booking and get an instant PNR number. Your digital ticket is ready to print or show.',
        color: 'bg-green-50 border-green-200',
    },
];

const TOP_OPERATORS = [
    { name: 'MSRTC', routes: 120, rating: 4.2, logo: '🚌', color: 'bg-red-50 border-red-200' },
    { name: 'VRL Travels', routes: 85, rating: 4.5, logo: '🚎', color: 'bg-blue-50 border-blue-200' },
    { name: 'KSRTC', routes: 95, rating: 4.3, logo: '🚍', color: 'bg-green-50 border-green-200' },
    { name: 'SRS Travels', routes: 60, rating: 4.6, logo: '🚐', color: 'bg-purple-50 border-purple-200' },
    { name: 'RSRTC', routes: 72, rating: 4.1, logo: '🚌', color: 'bg-orange-50 border-orange-200' },
    { name: 'Parveen Travels', routes: 55, rating: 4.4, logo: '🚎', color: 'bg-teal-50 border-teal-200' },
];

const TESTIMONIALS = [
    {
        name: 'Priya Sharma',
        city: 'Mumbai',
        route: 'Mumbai → Pune',
        rating: 5,
        text: 'Booked a Volvo AC seat last minute and the whole experience was seamless! The seat selection UI is super intuitive and I got my PNR instantly.',
        avatar: 'PS',
        color: 'bg-pink-500',
    },
    {
        name: 'Arjun Mehta',
        city: 'Delhi',
        route: 'Delhi → Jaipur',
        rating: 5,
        text: 'Impressed with the live tracking feature. I could see exactly where my bus was at all times. The AC was great and the bus was on time!',
        avatar: 'AM',
        color: 'bg-blue-500',
    },
    {
        name: 'Kavitha Rao',
        city: 'Bangalore',
        route: 'Bangalore → Chennai',
        rating: 4,
        text: 'Great value for money. Booked sleeper seats for an overnight trip. The blanket and pillow were complimentary. Will definitely use again.',
        avatar: 'KR',
        color: 'bg-green-500',
    },
];

const FAQS = [
    { q: 'Can I cancel my bus ticket?', a: 'Yes! Buses marked with "Free Cancellation" can be cancelled for a full refund. Partial Refund buses return 50-75% based on time of cancellation. Check the policy badge on each bus card.' },
    { q: 'How do I receive my ticket?', a: 'After booking you receive an instant PNR number on screen. You can print the ticket or save it on your phone. No physical ticket required — just show your PNR at boarding.' },
    { q: 'Can I book multiple seats?', a: 'Yes, you can book up to 6 seats in a single booking. Each seat will need passenger details (name, age, gender).' },
    { q: 'What is the boarding process?', a: 'Reach the boarding point 15 minutes before departure. Show your PNR or printed ticket to the conductor. For live-tracking buses you can monitor the bus location in real time.' },
    { q: 'Are there luggage restrictions?', a: 'Most operators allow 15–20 kg per passenger under the bus. Cabin luggage limited to small bags. Oversized items may require advance notice to the operator.' },
];

const AMENITY_ICONS = {
    'WiFi': <FaWifi />,
    'AC': <FaSnowflake />,
    'USB Charging': <FaPlug />,
    'Live Tracking': <FaRoute />,
};

const AmenityTag = ({ amenity }) => (
    <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
        {AMENITY_ICONS[amenity] && <span className="text-blue-500">{AMENITY_ICONS[amenity]}</span>}
        {amenity}
    </span>
);

// ─── BUS CARD ─────────────────────────────────────────────────────────────
const BusCard = ({ bus, onSelect }) => {
    const { formatPrice } = useGlobal();
    const cancelColor = {
        'Free Cancellation': 'text-green-600',
        'Partial Refund': 'text-yellow-600',
        'Non-Refundable': 'text-red-500',
    }[bus.cancellationPolicy] || 'text-gray-500';

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
            <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="md:w-52 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                                <FaBus className="text-lg" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm leading-tight">{bus.busName}</p>
                                <p className="text-xs text-gray-500">{bus.operatorName}</p>
                            </div>
                        </div>
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mt-1">{bus.busType}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-gray-800">{bus.departureTime}</p>
                            <p className="text-sm text-gray-500">{bus.from}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <p className="text-xs text-gray-400 mb-1">{bus.duration}</p>
                            <div className="w-full flex items-center">
                                <div className="flex-1 h-0.5 bg-gray-200"></div>
                                <FaBus className="text-blue-500 mx-2 text-sm" />
                                <div className="flex-1 h-0.5 bg-gray-200"></div>
                            </div>
                            {bus.liveTracking && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><FaRoute className="text-xs" /> Live Tracking</p>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-gray-800">{bus.arrivalTime}</p>
                            <p className="text-sm text-gray-500">{bus.to}</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col gap-1 md:w-44 flex-shrink-0">
                        <div className="flex flex-wrap gap-1">
                            {bus.amenities.slice(0, 4).map(a => <AmenityTag key={a} amenity={a} />)}
                        </div>
                    </div>
                    <div className="md:w-40 flex-shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                            <FaStar className="text-yellow-400 text-sm" />
                            <span className="font-semibold text-gray-700 text-sm">{bus.rating}</span>
                            <span className="text-gray-400 text-xs">({bus.totalRatings})</span>
                        </div>
                        <p className="text-3xl font-extrabold text-blue-600">{formatPrice(bus.price)}</p>
                        <p className="text-xs text-gray-400 mb-2">per seat</p>
                        <p className={`text-xs font-medium ${cancelColor} mb-3`}>✓ {bus.cancellationPolicy}</p>
                        <p className="text-xs text-gray-500 mb-3 flex items-center justify-end gap-1">
                            <MdEventSeat className="text-green-500" /> {bus.availableSeats} seats left
                        </p>
                        <button
                            onClick={() => onSelect(bus)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md"
                        >
                            Select Seats
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3 md:hidden">
                    {bus.amenities.slice(0, 5).map(a => <AmenityTag key={a} amenity={a} />)}
                </div>
            </div>
        </div>
    );
};

// ─── FAQ ITEM ─────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(o => !o)}
            >
                <span className="font-semibold text-gray-800 text-sm md:text-base">{q}</span>
                {open ? <FaChevronUp className="text-blue-500 text-sm flex-shrink-0 ml-2" /> : <FaChevronDown className="text-gray-400 text-sm flex-shrink-0 ml-2" />}
            </button>
            {open && (
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed bg-blue-50 border-t border-blue-100">
                    {a}
                </div>
            )}
        </div>
    );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
const Buses = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { formatPrice } = useGlobal();
    const defaultDate = new Date().toISOString().split('T')[0];

    const [searchForm, setSearchForm] = useState({ from: '', to: '', date: defaultDate });
    const [cities, setCities] = useState([]);
    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [email, setEmail] = useState('');
    const [newsletterSent, setNewsletterSent] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const resultsRef = React.useRef(null);

    const [filters, setFilters] = useState({ busType: [], minPrice: '', maxPrice: '', cancellation: '', amenities: [], timeOfDay: '' });
    const [sortBy, setSortBy] = useState('price-asc');

    useEffect(() => {
        getCities().then(res => setCities(res.cities || [])).catch(console.error);
    }, []);

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!searchForm.from || !searchForm.to || !searchForm.date) { setError('Please fill in all fields'); return; }
        if (searchForm.from.toLowerCase() === searchForm.to.toLowerCase()) { setError('Source and destination cannot be the same'); return; }
        setError(''); setLoading(true); setSearched(true);
        try {
            const res = await searchBuses({ from: searchForm.from, to: searchForm.to, date: searchForm.date });
            setBuses(res.buses || []); setFilteredBuses(res.buses || []);
        } catch { setError('Search failed. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleRouteClick = async (route) => {
        const form = { from: route.from, to: route.to, date: defaultDate };
        setSearchForm(form);
        setSelectedRoute(route);
        setError(''); setLoading(true); setSearched(true);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        try {
            // Search without date so all buses on this route are returned
            const res = await searchBuses({ from: route.from, to: route.to });
            setBuses(res.buses || []); setFilteredBuses(res.buses || []);
        } catch { setError('Search failed. Please try again.'); }
        finally { setLoading(false); }
    };


    useEffect(() => {
        let result = [...buses];
        if (filters.busType.length > 0) result = result.filter(b => filters.busType.includes(b.busType));
        if (filters.minPrice) result = result.filter(b => b.price >= parseInt(filters.minPrice));
        if (filters.maxPrice) result = result.filter(b => b.price <= parseInt(filters.maxPrice));
        if (filters.cancellation) result = result.filter(b => b.cancellationPolicy === filters.cancellation);
        if (filters.amenities.length > 0) result = result.filter(b => filters.amenities.every(a => b.amenities.includes(a)));
        if (filters.timeOfDay === 'morning') result = result.filter(b => parseInt(b.departureTime) < 12);
        if (filters.timeOfDay === 'afternoon') result = result.filter(b => parseInt(b.departureTime) >= 12 && parseInt(b.departureTime) < 17);
        if (filters.timeOfDay === 'evening') result = result.filter(b => parseInt(b.departureTime) >= 17);
        result.sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
            if (sortBy === 'seats') return b.availableSeats - a.availableSeats;
            return 0;
        });
        setFilteredBuses(result);
    }, [buses, filters, sortBy]);

    const toggleBusType = (type) => setFilters(f => ({ ...f, busType: f.busType.includes(type) ? f.busType.filter(t => t !== type) : [...f.busType, type] }));
    const toggleAmenity = (a) => setFilters(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));
    const resetFilters = () => setFilters({ busType: [], minPrice: '', maxPrice: '', cancellation: '', amenities: [], timeOfDay: '' });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ══════════════════════════════════════════════════════════
          HERO SEARCH
      ══════════════════════════════════════════════════════════ */}
            <div
                className="relative bg-cover bg-center py-24 px-4 overflow-hidden"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80)' }}
            >
                {/* Fallback for background image if it fails (using an absolute positioned img behind content) */}
                <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80"
                    className="absolute inset-0 w-full h-full object-cover opacity-0"
                    onError={e => {
                        e.target.parentElement.style.backgroundImage = 'url(https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=1920&q=80)';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-blue-950/70 to-slate-900/85"></div>
                {/* Floating badges */}
                <div className="absolute top-24 left-8 hidden lg:flex gap-2 flex-col">
                    <div className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">✅ 10,000+ Happy Passengers</div>
                    <div className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">🛡️ 100% Secure Booking</div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center pt-6">
                    <div className="inline-flex items-center gap-2 bg-blue-600/80 backdrop-blur text-white text-sm px-5 py-2 rounded-full mb-5 border border-blue-400/40">
                        <FaBus /> Online Bus Booking — India's Trusted Platform
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                        Book <span className="text-yellow-400">Bus Tickets</span> Instantly
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
                        Safe · Affordable · Comfortable — 500+ routes across India
                    </p>

                    {/* ── Search Form ── */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                                <input
                                    list="from-cities"
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="From (e.g. Mumbai)"
                                    value={searchForm.from}
                                    onChange={e => setSearchForm({ ...searchForm, from: e.target.value })}
                                    required
                                />
                                <datalist id="from-cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
                            </div>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                                <input
                                    list="to-cities"
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="To (e.g. Pune)"
                                    value={searchForm.to}
                                    onChange={e => setSearchForm({ ...searchForm, to: e.target.value })}
                                    required
                                />
                                <datalist id="to-cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
                            </div>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    value={searchForm.date}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setSearchForm({ ...searchForm, date: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-base">
                                <FaSearch /> Search Buses
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    </form>

                    {/* Trust strip */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/70 text-xs">
                        {['Instant PNR', 'Free Cancellation on Select Buses', 'Verified Operators', '24/7 Support'].map(t => (
                            <span key={t} className="flex items-center gap-1"><FaCheck className="text-green-400 text-xs" /> {t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
          SEARCH RESULTS
      ══════════════════════════════════════════════════════════ */}
            {searched && (
                <div ref={resultsRef} className="max-w-7xl mx-auto px-4 py-8">

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{searchForm.from} → {searchForm.to}</h2>
                            <p className="text-gray-500 text-sm">{new Date(searchForm.date).toDateString()} · {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''} found</p>
                            {selectedRoute && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedRoute.highlights.map(h => (
                                        <span key={h} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-200">{h}</span>
                                    ))}
                                    <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">⏱ {selectedRoute.duration}</span>
                                    <span className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-200">from {formatPrice(selectedRoute.starting)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Best Rated</option>
                                <option value="departure">Earliest Departure</option>
                                <option value="seats">Most Seats</option>
                            </select>
                            <button onClick={() => setShowFilters(f => !f)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white hover:bg-gray-50 transition-colors">
                                <FaFilter /> Filters
                                {(filters.busType.length + filters.amenities.length) > 0 && (
                                    <span className="bg-blue-600 text-white text-xs rounded-full px-2">{filters.busType.length + filters.amenities.length}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Filters Sidebar */}
                        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
                            <div className="bg-white rounded-2xl shadow-md p-5 sticky top-20">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800">Filters</h3>
                                    <button onClick={resetFilters} className="text-blue-600 text-xs hover:underline">Reset All</button>
                                </div>
                                <div className="mb-5">
                                    <p className="font-semibold text-gray-700 text-sm mb-2">Bus Type</p>
                                    {['AC Seater', 'AC Sleeper', 'Semi-Sleeper', 'Volvo AC', 'Non-AC Sleeper', 'Sleeper'].map(type => (
                                        <label key={type} className="flex items-center gap-2 py-1.5 cursor-pointer">
                                            <input type="checkbox" checked={filters.busType.includes(type)} onChange={() => toggleBusType(type)} className="accent-blue-600 w-4 h-4" />
                                            <span className="text-sm text-gray-600">{type}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mb-5">
                                    <p className="font-semibold text-gray-700 text-sm mb-2">Departure Time</p>
                                    {[{ id: 'morning', label: '🌅 Morning (Before 12PM)' }, { id: 'afternoon', label: '☀️ Afternoon (12–5PM)' }, { id: 'evening', label: '🌆 Evening (After 5PM)' }].map(t => (
                                        <label key={t.id} className="flex items-center gap-2 py-1.5 cursor-pointer">
                                            <input type="radio" name="timeOfDay" checked={filters.timeOfDay === t.id} onChange={() => setFilters(f => ({ ...f, timeOfDay: f.timeOfDay === t.id ? '' : t.id }))} className="accent-blue-600 w-4 h-4" />
                                            <span className="text-sm text-gray-600">{t.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="mb-5">
                                    <p className="font-semibold text-gray-700 text-sm mb-2">Price Range</p>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Min ₹" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
                                        <input type="number" placeholder="Max ₹" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <p className="font-semibold text-gray-700 text-sm mb-2">Cancellation Policy</p>
                                    {['Free Cancellation', 'Partial Refund', 'Non-Refundable'].map(p => (
                                        <label key={p} className="flex items-center gap-2 py-1.5 cursor-pointer">
                                            <input type="radio" name="cancellation" checked={filters.cancellation === p} onChange={() => setFilters(f => ({ ...f, cancellation: f.cancellation === p ? '' : p }))} className="accent-blue-600 w-4 h-4" />
                                            <span className={`text-sm ${p === 'Free Cancellation' ? 'text-green-600' : p === 'Non-Refundable' ? 'text-red-500' : 'text-yellow-600'}`}>{p}</span>
                                        </label>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 text-sm mb-2">Amenities</p>
                                    {['WiFi', 'AC', 'USB Charging', 'Blanket', 'Live Tracking', 'Snacks'].map(a => (
                                        <label key={a} className="flex items-center gap-2 py-1.5 cursor-pointer">
                                            <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-blue-600 w-4 h-4" />
                                            <span className="text-sm text-gray-600 flex items-center gap-1">{AMENITY_ICONS[a] && <span className="text-blue-500 text-xs">{AMENITY_ICONS[a]}</span>} {a}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white rounded-2xl shadow p-5 animate-pulse">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                                <div className="w-28 space-y-2">
                                                    <div className="h-6 bg-gray-200 rounded"></div>
                                                    <div className="h-8 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredBuses.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-md">
                                    <FaBus className="text-7xl text-gray-200 mx-auto mb-4" />
                                    <p className="text-xl font-bold text-gray-500 mb-2">No buses found</p>
                                    <p className="text-gray-400 text-sm">Try a different date or fewer filters.</p>
                                    {(filters.busType.length > 0 || filters.amenities.length > 0) && (
                                        <button onClick={resetFilters} className="mt-4 text-blue-600 hover:underline text-sm">Clear all filters</button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBuses.map(bus => (
                                        <BusCard key={bus._id} bus={bus} onSelect={(b) => {
                                            const token = localStorage.getItem("token");
                                            if (!token) {
                                                navigate("/login", { state: { returnTo: location.pathname } });
                                                return;
                                            }
                                            navigate(`/buses/${b._id}/book`, { state: { bus: b, searchDate: searchForm.date } });
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
          LANDING PAGE CONTENT (shown before search)
      ══════════════════════════════════════════════════════════ */}
            {!searched && (
                <>
                    {/* ── STATS BANNER ── */}
                    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 py-10">
                        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-center text-white">
                            {[
                                { stat: '500+', label: 'Bus Routes', icon: <FaRoute className="text-2xl mb-1 mx-auto text-blue-200" /> },
                                { stat: '200+', label: 'Verified Operators', icon: <MdVerified className="text-2xl mb-1 mx-auto text-blue-200" /> },
                                { stat: '10L+', label: 'Happy Passengers', icon: <FaRegSmile className="text-2xl mb-1 mx-auto text-blue-200" /> },
                                { stat: '24/7', label: 'Customer Support', icon: <FaHeadset className="text-2xl mb-1 mx-auto text-blue-200" /> },
                            ].map((s, i) => (
                                <div key={i}>
                                    {s.icon}
                                    <p className="text-3xl font-extrabold">{s.stat}</p>
                                    <p className="text-blue-200 text-sm font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── POPULAR ROUTES ── */}
                    <div className="max-w-6xl mx-auto px-4 py-14">
                        <div className="text-center mb-10">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Quick Book</p>
                            <h2 className="text-3xl font-extrabold text-gray-800">Popular Bus Routes</h2>
                            <p className="text-gray-500 mt-2">Click any route to pre-fill and search instantly</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {POPULAR_ROUTES.map(route => (
                                <div
                                    key={`${route.from}-${route.to}`}
                                    onClick={() => handleRouteClick(route)}
                                    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer h-52"
                                >
                                    <img
                                        src={route.image}
                                        alt={`${route.from} to ${route.to}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                        {/* Top: amenity pills */}
                                        <div className="flex flex-wrap gap-1">
                                            {route.amenities.map(a => (
                                                <span key={a} className="bg-white/15 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full border border-white/20">{a}</span>
                                            ))}
                                        </div>
                                        {/* Bottom: route info */}
                                        <div>
                                            <div className="flex items-center gap-2 text-white font-bold text-xl mb-1">
                                                <span>{route.from}</span>
                                                <FaArrowRight className="text-yellow-400 text-sm" />
                                                <span>{route.to}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-white/80 text-xs">
                                                    <span className="flex items-center gap-1"><FaClock className="text-xs" /> {route.duration}</span>
                                                    <span className="flex items-center gap-1"><FaBus className="text-xs" /> {route.buses} buses</span>
                                                </div>
                                                <span className="bg-yellow-400 text-gray-900 font-bold px-2.5 py-1 rounded-lg text-xs">from {formatPrice(route.starting)}</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1 text-yellow-300 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                                                View Buses <FaArrowRight className="text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── BUS TYPES SHOWCASE ── */}
                    <div className="bg-gray-900 py-16 px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-10">
                                <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-1">Choose What Suits You</p>
                                <h2 className="text-3xl font-extrabold text-white">Explore Bus Types</h2>
                                <p className="text-gray-400 mt-2">From budget-friendly seaters to premium sleepers — we have it all</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {BUS_TYPES.map((bt, i) => (
                                    <div key={i} className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
                                        <img
                                            src={bt.image}
                                            alt={bt.type}
                                            className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80'; }}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${bt.color} opacity-80`}></div>
                                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                                            {bt.badge}
                                        </div>
                                        <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                                            <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-0.5">{bt.tagline}</p>
                                            <h3 className="text-xl font-extrabold mb-2">{bt.type}</h3>
                                            <p className="text-white/80 text-sm mb-3 leading-relaxed">{bt.desc}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {bt.amenities.map(a => (
                                                    <span key={a} className="bg-white/20 backdrop-blur text-white text-xs px-2 py-0.5 rounded-full border border-white/20">{a}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── HOW IT WORKS ── */}
                    <div className="max-w-5xl mx-auto px-4 py-16">
                        <div className="text-center mb-10">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Simple Process</p>
                            <h2 className="text-3xl font-extrabold text-gray-800">How To Book in 4 Steps</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {HOW_IT_WORKS.map((step, i) => (
                                <div key={i} className={`${step.color} border-2 rounded-2xl p-6 relative`}>
                                    <div className="absolute -top-4 left-5 bg-white border-2 border-gray-200 text-gray-400 text-xs font-bold px-2 py-1 rounded-full">{step.step}</div>
                                    <div className="mb-4 mt-2">{step.icon}</div>
                                    <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                                    {i < HOW_IT_WORKS.length - 1 && (
                                        <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gray-300 text-xl">→</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── WHY CHOOSE US ── */}
                    <div className="bg-blue-50 py-16 px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-10">
                                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Our Promise</p>
                                <h2 className="text-3xl font-extrabold text-gray-800">Why Book With Raj Travel?</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[
                                    { icon: <MdEventSeat className="text-3xl text-blue-600" />, title: 'Choose Your Seat', desc: 'Pick exactly where you want to sit on an interactive visual seat map before confirming.', bg: 'bg-blue-100' },
                                    { icon: <FaShieldAlt className="text-3xl text-green-600" />, title: 'Verified Operators', desc: 'Every bus operator on our platform is verified and rated by real passengers.', bg: 'bg-green-100' },
                                    { icon: <FaCheck className="text-3xl text-purple-600" />, title: 'Instant Confirmation', desc: 'No waiting. Your PNR is generated immediately and valid for boarding.', bg: 'bg-purple-100' },
                                    { icon: <FaRoute className="text-3xl text-teal-600" />, title: 'Live Bus Tracking', desc: 'Track your bus in real time so you never miss a departure or wonder about the delay.', bg: 'bg-teal-100' },
                                    { icon: <MdLocalOffer className="text-3xl text-orange-600" />, title: 'Best Fare Guarantee', desc: 'We compare prices from multiple operators to always show you the best deal first.', bg: 'bg-orange-100' },
                                    { icon: <FaHeadset className="text-3xl text-red-600" />, title: '24/7 Support', desc: 'Dedicated customer care available round the clock via chat, email, or phone.', bg: 'bg-red-100' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow flex gap-4">
                                        <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── TOP OPERATORS ── */}
                    <div className="max-w-6xl mx-auto px-4 py-14">
                        <div className="text-center mb-10">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Trusted Partners</p>
                            <h2 className="text-3xl font-extrabold text-gray-800">Top Bus Operators</h2>
                            <p className="text-gray-500 mt-2">Partnered with India's most trusted and highest-rated operators</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {TOP_OPERATORS.map((op, i) => (
                                <div key={i} className={`${op.color} border-2 rounded-2xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer`}>
                                    <div className="text-4xl mb-2">{op.logo}</div>
                                    <p className="font-bold text-gray-800 text-sm">{op.name}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{op.routes} routes</p>
                                    <div className="flex items-center justify-center gap-1 mt-1.5">
                                        <FaStar className="text-yellow-400 text-xs" />
                                        <span className="text-xs font-semibold text-gray-700">{op.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── SAFETY GUARANTEE ── */}
                    <div
                        className="relative bg-cover bg-center py-16 px-4"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1920&q=80)' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-blue-700/80"></div>
                        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="text-white">
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs px-4 py-1.5 rounded-full mb-5">
                                    <FaShieldAlt className="text-green-400" /> Our Safety Commitment
                                </div>
                                <h2 className="text-3xl font-extrabold mb-4">Your Safety Is Our<br /><span className="text-yellow-400">Top Priority</span></h2>
                                <p className="text-white/80 text-base leading-relaxed mb-6">
                                    Every bus operator on Raj Travel undergoes a rigorous verification process. Our team checks licences, safety records, and user ratings before any operator is listed.
                                </p>
                                <div className="space-y-3">
                                    {['All operators are RTO licensed & verified', 'GPS-enabled live tracking on select buses', 'Dedicated grievance redressal team', 'Emergency support helpline 24/7'].map(item => (
                                        <div key={item} className="flex items-start gap-2 text-white/90 text-sm">
                                            <FaCheck className="text-green-400 mt-0.5 flex-shrink-0" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: '200+', label: 'Verified Operators' },
                                    { value: '0%', label: 'Complaint Rate' },
                                    { value: '99.2%', label: 'On-time Departures' },
                                    { value: '4.4★', label: 'Average Rating' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center text-white">
                                        <p className="text-3xl font-extrabold text-yellow-400 mb-1">{s.value}</p>
                                        <p className="text-white/70 text-xs">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── TESTIMONIALS ── */}
                    <div className="max-w-5xl mx-auto px-4 py-16">
                        <div className="text-center mb-10">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Real Reviews</p>
                            <h2 className="text-3xl font-extrabold text-gray-800">What Travellers Say</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative">
                                    <FaQuoteLeft className="text-blue-100 text-4xl absolute top-4 right-4" />
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-yellow-400 text-sm" />)}
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                                    <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                        <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                                            <p className="text-gray-400 text-xs">{t.city} · {t.route}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── APP DOWNLOAD BANNER ── */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-14 px-4">
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1 text-white">
                                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs px-3 py-1.5 rounded-full mb-4 border border-white/20">
                                    <FaMobileAlt /> Raj Travel App
                                </div>
                                <h2 className="text-3xl font-extrabold mb-3">Book Tickets On The Go</h2>
                                <p className="text-white/70 text-base mb-6">Download the Raj Travel app for exclusive mobile-only deals, live tracking, and instant digital tickets on your phone.</p>
                                <div className="flex gap-3 flex-wrap">
                                    <button className="flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm shadow-lg">
                                        🍎 App Store
                                    </button>
                                    <button className="flex items-center gap-2 bg-green-500 text-white font-bold px-5 py-3 rounded-xl hover:bg-green-600 transition-colors text-sm shadow-lg">
                                        🤖 Google Play
                                    </button>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="w-56 h-56 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <FaMobileAlt className="text-6xl mb-3 mx-auto text-blue-400" />
                                        <p className="text-sm text-white/60">Scan to download</p>
                                        <div className="grid grid-cols-5 gap-0.5 mt-3 mx-auto w-28">
                                            {[...Array(25)].map((_, i) => (
                                                <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── FAQ ── */}
                    <div className="max-w-3xl mx-auto px-4 py-16">
                        <div className="text-center mb-10">
                            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-1">Got Questions?</p>
                            <h2 className="text-3xl font-extrabold text-gray-800">Frequently Asked Questions</h2>
                        </div>
                        <div className="space-y-3">
                            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
                        </div>
                    </div>

                    {/* ── NEWSLETTER ── */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-14 px-4">
                        <div className="max-w-2xl mx-auto text-center text-white">
                            <MdLocalOffer className="text-5xl mx-auto mb-4 text-yellow-300" />
                            <h2 className="text-2xl font-extrabold mb-2">Get Exclusive Bus Deals</h2>
                            <p className="text-blue-100 mb-7">Subscribe to our newsletter and be the first to receive flash sales and route discounts.</p>
                            {newsletterSent ? (
                                <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-4 inline-flex items-center gap-2 text-white font-semibold">
                                    <FaCheck className="text-green-300" /> You're subscribed! Deals coming soon.
                                </div>
                            ) : (
                                <form onSubmit={e => { e.preventDefault(); setNewsletterSent(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email" required placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 rounded-xl text-gray-800 outline-none shadow-md"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg whitespace-nowrap">
                                        Subscribe Free
                                    </button>
                                </form>
                            )}
                            <p className="text-blue-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Buses;
