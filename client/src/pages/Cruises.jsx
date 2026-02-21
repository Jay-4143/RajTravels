import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaShip, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaAnchor,
    FaSearch, FaUmbrellaBeach, FaGlassMartini, FaSwimmingPool,
    FaConciergeBell, FaShieldAlt, FaArrowRight, FaQuoteLeft,
    FaChevronLeft, FaChevronRight, FaTag, FaCheck, FaClock, FaTimes
} from 'react-icons/fa';
import { searchCruises } from '../api/cruises';
import { useGlobal } from '../context/GlobalContext';
import Footer from '../components/Footer';

// ─── STATIC SHOWCASE DATA (displayed in rich sections, not DB-dependent) ─────

const STATIC_INTL = {
    'Asia & Asia Pacific': [
        { id: 's-ap1', name: 'Spectrum of the Seas', operator: 'Royal Caribbean', route: 'Singapore → Penang → Kuala Lumpur', duration: '5 Nights / 6 Days', nights: 5, departure: 'Singapore', departureDate: 'May 01, 2026', price: 45000, originalPrice: 62000, rating: 4.8, reviews: 512, image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80', amenities: ['iFly Skydiving', 'North Star Pod', 'FlowRider', 'Bionic Bar'] },
        { id: 's-ap2', name: 'Pearl of the Orient', operator: 'Star Cruises', route: 'Chennai → Colombo → Phuket → Singapore', duration: '6 Nights / 7 Days', nights: 6, departure: 'Chennai', departureDate: 'May 20, 2026', price: 55000, originalPrice: 72000, rating: 4.3, reviews: 167, image: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=900&q=80', amenities: ['Asian Fusion Dining', 'Night Market', 'Infinity Pool', 'Karaoke'] },
        { id: 's-ap3', name: 'Quantum of the Seas', operator: 'Royal Caribbean', route: 'Singapore → Bali → Singapore', duration: '7 Nights / 8 Days', nights: 7, departure: 'Singapore', departureDate: 'Jun 05, 2026', price: 68000, originalPrice: 88000, rating: 4.9, reviews: 621, image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=900&q=80', amenities: ['Robot Bar', 'RipCord iFly', 'Sea Plex', 'Bumper Cars'] },
        { id: 's-ap4', name: 'Genting Dream', operator: 'Dream Cruises', route: 'Hong Kong → Japan → Taiwan', duration: '8 Nights / 9 Days', nights: 8, departure: 'Hong Kong', departureDate: 'Jun 18, 2026', price: 82000, originalPrice: 110000, rating: 4.7, reviews: 298, image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=900&q=80', amenities: ['Palace Villas', 'Pavilion Dining', 'Dream Spa', 'Cloud 9 Bar'] },
    ],
    'Middle East': [
        { id: 's-me1', name: 'MSC Bellissima', operator: 'MSC Cruises', route: 'Mumbai → Abu Dhabi → Dubai', duration: '10 Nights / 11 Days', nights: 10, departure: 'Mumbai', departureDate: 'Apr 25, 2026', price: 72000, originalPrice: 95000, rating: 4.7, reviews: 389, image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80', amenities: ['AI Butler Zoe', 'Aqua Park', '7 Restaurants', 'Rooftop Cinema'] },
        { id: 's-me2', name: 'Costa Smeralda', operator: 'Costa Cruises', route: 'Dubai → Fujairah → Khasab → Muscat', duration: '7 Nights / 8 Days', nights: 7, departure: 'Dubai', departureDate: 'May 12, 2026', price: 60000, originalPrice: 79000, rating: 4.6, reviews: 290, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80', amenities: ['Italian Cuisine', 'Thermal Spa', 'LNG Powered', 'Art Gallery'] },
        { id: 's-me3', name: 'Silver Moon', operator: 'Silversea Cruises', route: 'Dubai → Muscat → Sir Bani Yas', duration: '5 Nights / 6 Days', nights: 5, departure: 'Dubai', departureDate: 'Mar 30, 2026', price: 95000, originalPrice: 128000, rating: 4.9, reviews: 183, image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&q=80', amenities: ['Butler Service', 'All-Inclusive', 'Zodiac Excursions', 'Expedition Team'] },
        { id: 's-me4', name: 'Azamara Quest', operator: 'Azamara Cruises', route: 'Abu Dhabi → Bahrain → Qatar → Dubai', duration: '8 Nights / 9 Days', nights: 8, departure: 'Abu Dhabi', departureDate: 'Jun 01, 2026', price: 85000, originalPrice: 112000, rating: 4.8, reviews: 241, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&q=80', amenities: ['AzAmazing Evenings', 'Open Bar', 'Included Excursions', 'Country Club Casual'] },
    ],
    'Europe': [
        { id: 's-eu1', name: 'MSC Virtuosa', operator: 'MSC Cruises', route: 'Barcelona → Marseille → Rome → Naples', duration: '7 Nights / 8 Days', nights: 7, departure: 'Barcelona', departureDate: 'Jul 05, 2026', price: 95000, originalPrice: 130000, rating: 4.8, reviews: 744, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80', amenities: ['Panoramic Restaurant', 'Himalayan Bridge', 'MSC Yacht Club', 'VR Experience'] },
        { id: 's-eu2', name: 'Norwegian Escape', operator: 'Norwegian Cruise Line', route: 'Southampton → Iceland → Edinburgh → Dublin', duration: '10 Nights / 11 Days', nights: 10, departure: 'Southampton', departureDate: 'Aug 10, 2026', price: 115000, originalPrice: 155000, rating: 4.7, reviews: 523, image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&q=80', amenities: ['Waterfront Dining', 'Aqua Park', 'Laser Tag', 'Escape Room'] },
        { id: 's-eu3', name: 'Celebrity Beyond', operator: 'Celebrity Cruises', route: 'Athens → Mykonos → Santorini → Venice', duration: '11 Nights / 12 Days', nights: 11, departure: 'Athens', departureDate: 'Sep 01, 2026', price: 138000, originalPrice: 185000, rating: 4.9, reviews: 892, image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=900&q=80', amenities: ['Magic Carpet', 'The Retreat Suite', 'Eden Restaurant', 'Raw on 5'] },
        { id: 's-eu4', name: 'Anthem of the Seas', operator: 'Royal Caribbean', route: 'Rome → Barcelona → Lisbon → Southampton', duration: '12 Nights / 13 Days', nights: 12, departure: 'Rome', departureDate: 'Sep 15, 2026', price: 145000, originalPrice: 195000, rating: 4.8, reviews: 967, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80', amenities: ['O70 Observation Pod', 'iFly', 'SeaPlex', 'Two70 Venue'] },
    ],
    'North America': [
        { id: 's-na1', name: 'Wonder of the Seas', operator: 'Royal Caribbean', route: 'Miami → Cozumel → Roatan → Belize City', duration: '7 Nights / 8 Days', nights: 7, departure: 'Miami', departureDate: 'Jul 20, 2026', price: 105000, originalPrice: 145000, rating: 4.9, reviews: 1842, image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80', amenities: ['8 Neighborhoods', 'The Bash Club', 'Wonder Playscape', 'Mason Jar'] },
        { id: 's-na2', name: 'Carnival Celebration', operator: 'Carnival Cruise Line', route: 'Port Canaveral → Nassau → Half Moon Cay', duration: '5 Nights / 6 Days', nights: 5, departure: 'Port Canaveral', departureDate: 'Aug 01, 2026', price: 78000, originalPrice: 105000, rating: 4.5, reviews: 1231, image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=900&q=80', amenities: ['Carnival Kitchen', 'Family Feud Live', 'WaterWorks', 'Playlist Productions'] },
        { id: 's-na3', name: 'Norwegian Bliss', operator: 'Norwegian Cruise Line', route: 'Seattle → Juneau → Skagway → Glacier Bay', duration: '7 Nights / 8 Days', nights: 7, departure: 'Seattle', departureDate: 'Aug 20, 2026', price: 120000, originalPrice: 160000, rating: 4.8, reviews: 1056, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', amenities: ['Race Track', 'Laser Tag', 'Aqua Park', 'Q Texas Smokehouse'] },
        { id: 's-na4', name: 'Ovation of the Seas', operator: 'Royal Caribbean', route: 'Vancouver → Ketchikan → Juneau → Glacier Bay', duration: '7 Nights / 8 Days', nights: 7, departure: 'Vancouver', departureDate: 'Sep 05, 2026', price: 128000, originalPrice: 170000, rating: 4.7, reviews: 789, image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=80', amenities: ['iFly', 'NorthStar', 'SeaPlex', 'Two70'] },
    ],
};

const EXCLUSIVE_DEALS = [
    { tag: '⚡ EARLY BIRD · 30% OFF', name: 'Mediterranean Splendour', operator: 'MSC Cruises', route: 'Barcelona → Marseille → Genoa → Naples → Rome', duration: '7 Nights', price: 95000, originalPrice: 135000, image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&q=80', validTill: 'Mar 31, 2026' },
    { tag: '💑 COUPLES SPECIAL', name: 'Greek Islands Honeymoon', operator: 'Celebrity Cruises', route: 'Athens → Santorini → Mykonos → Kotor → Venice', duration: '10 Nights', price: 125000, originalPrice: 175000, image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=900&q=80', validTill: 'Apr 15, 2026' },
    { tag: '👨‍👩‍👧 FAMILY DEAL', name: 'Caribbean Family Adventure', operator: 'Royal Caribbean', route: 'Miami → Cozumel → Belize → Roatan → Costa Maya', duration: '7 Nights', price: 105000, originalPrice: 148000, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80', validTill: 'May 30, 2026' },
];

const TRENDING_ROUTES = [
    { route: 'Mumbai → Goa', nights: 3, price: 22999, img: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=500&q=80', port: 'Mumbai' },
    { route: 'Singapore → Penang', nights: 5, price: 45000, img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=500&q=80', port: 'Singapore' },
    { route: 'Kolkata → Varanasi', nights: 7, price: 38000, img: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=500&q=80', port: 'Kolkata' },
    { route: 'Mumbai → Dubai', nights: 10, price: 72000, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80', port: 'Mumbai' },
    { route: 'Kochi → Lakshadweep', nights: 4, price: 34500, img: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=500&q=80', port: 'Kochi' },
    { route: 'Athens → Santorini', nights: 11, price: 138000, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=80', port: 'Athens' },
];

const CRUISE_LINES = [
    { name: 'Cordelia Cruises', emoji: '🚢', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', routes: '12 Routes', port: 'Mumbai' },
    { name: 'Royal Caribbean', emoji: '👑', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', routes: '25 Routes', port: 'Singapore' },
    { name: 'MSC Cruises', emoji: '⚓', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', routes: '18 Routes', port: 'Mumbai' },
    { name: 'Celebrity Cruises', emoji: '⭐', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', routes: '15 Routes', port: 'Athens' },
    { name: 'Norwegian Cruise', emoji: '🌊', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', routes: '20 Routes', port: 'Southampton' },
    { name: 'Costa Cruises', emoji: '🏖️', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', routes: '10 Routes', port: 'Dubai' },
    { name: 'Carnival Cruises', emoji: '🎉', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', routes: '22 Routes', port: 'Miami' },
    { name: 'Antara River', emoji: '💎', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', routes: '8 Routes', port: 'Kolkata' },
];

const OFFERS = [
    { tag: '🎟️ EARLY BIRD', title: 'Book 90 Days Early', desc: 'Save up to 30% on all cabin types', color: 'from-blue-600 to-blue-900', points: ['Extra cabin upgrade', 'Free shore excursion', 'Onboard credit ₹5,000'] },
    { tag: '💑 COUPLES', title: 'Honeymoon Package', desc: 'Romantic escapes crafted for two', color: 'from-pink-500 to-rose-700', points: ['Balcony cabin upgrade', 'Private dinner on deck', 'Couples spa session'] },
    { tag: '👨‍👩‍👧 FAMILY', title: 'Kids Sail Free', desc: 'Under 12 sail free with 2 adults', color: 'from-orange-500 to-amber-700', points: ['Kids club access', 'Dedicated family butler', 'Priority boarding'] },
    { tag: '💼 CORPORATE', title: 'Group Booking Deal', desc: 'Groups of 10+ get exclusive rates', color: 'from-indigo-600 to-purple-800', points: ['Dedicated event coordinator', 'Custom branding', 'Group excursion planning'] },
];

const TRAVEL_STORIES = [
    { name: 'Priya Sharma', city: 'Mumbai', rating: 5, cruise: 'Empress of the Seas', avatar: 'P', color: 'bg-purple-500', story: 'Sailing on the Empress of the Seas was the most magical experience of my life. The food, the shows, the sunset over the Arabian Sea — absolutely unforgettable! Cordelia Cruises is world class.' },
    { name: 'Arjun Mehta', city: 'New Delhi', rating: 5, cruise: 'MSC Bellissima', avatar: 'A', color: 'bg-blue-500', story: 'MSC Bellissima exceeded all expectations. The AI butler Zoe was incredibly helpful, the aqua park was a blast, and our stop in Muscat was breathtaking. 10/10 experience!' },
    { name: 'Sneha Nair', city: 'Kochi', rating: 5, cruise: 'Ganges Queen', avatar: 'S', color: 'bg-green-500', story: 'The Ganges Queen river cruise was a spiritual journey unlike anything else. Watching the evening Ganga Aarti from the boat deck as we drifted into Varanasi was simply surreal.' },
    { name: 'Rahul Gupta', city: 'Bangalore', rating: 5, cruise: 'Spectrum of the Seas', avatar: 'R', color: 'bg-red-500', story: 'Royal Caribbean Spectrum of the Seas is a floating theme park! The iFly skydiving simulator and the NorthStar observation pod blew our minds. My kids had the holiday of their lives!' },
];

const WHY_CRUISE = [
    { icon: <FaUmbrellaBeach />, label: 'All-Inclusive Value', desc: 'One price covers stay, meals & entertainment' },
    { icon: <FaAnchor />, label: 'Multi-Destination', desc: 'Wake up in a new city every single day' },
    { icon: <FaGlassMartini />, label: 'World-Class Dining', desc: 'Cuisines by award-winning chefs onboard' },
    { icon: <FaSwimmingPool />, label: '100+ Activities', desc: 'Pools, spas, casinos, theaters & more' },
    { icon: <FaConciergeBell />, label: 'Butler Service', desc: 'Personalised attention round the clock' },
    { icon: <FaShieldAlt />, label: 'Safety First', desc: 'Advanced fleet safety and health protocols' },
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=900&q=80';
const PORTS_LIST = ['Mumbai', 'Kochi', 'Kolkata', 'Chennai', 'Port Blair', 'Singapore', 'Dubai', 'Goa', 'Athens', 'Barcelona', 'Miami'];
const INTL_TABS = ['Asia & Asia Pacific', 'Middle East', 'Europe', 'North America'];

// ─── Price formatter ──────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// ─── DB cruise → display shape ────────────────────────────────────────────────
const toCard = (c) => ({
    id: c._id,
    isDB: true,
    name: c.name,
    operator: c.operator,
    route: `${c.departurePort} → ${c.arrivalPort}`,
    duration: `${c.duration} Nights / ${c.duration + 1} Days`,
    nights: c.duration,
    departure: c.departurePort,
    departureDate: new Date(c.departureDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    price: 22000,
    originalPrice: 31000,
    rating: c.rating,
    reviews: c.reviewCount,
    image: c.images?.[0] || FALLBACK_IMG,
    amenities: c.amenities || [],
    badge: null,
    badgeColor: 'bg-blue-600',
});

// ─── Cruise Card (works for both DB + static) ─────────────────────────────────
const CruiseCard = ({ cruise, navigate }) => {
    const discount = Math.round(((cruise.originalPrice - cruise.price) / cruise.originalPrice) * 100);

    const handleClick = () => {
        if (cruise.isDB) {
            navigate(`/cruise/${cruise.id}`);
        } else {
            // Static cards: scroll to search or show alert
            navigate('/cruise');
        }
    };

    return (
        <div onClick={handleClick}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-200 flex flex-col"
        >
            <div className="relative overflow-hidden h-52">
                <img src={cruise.image} alt={cruise.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                    <span className={`text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow ${cruise.badgeColor || 'bg-blue-600'}`}>
                        {cruise.badge || `${cruise.nights} Nights`}
                    </span>
                </div>
                {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                        {discount}% OFF
                    </div>
                )}
                <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-black text-base drop-shadow-lg leading-tight">{cruise.name}</p>
                    <p className="text-white/80 text-xs font-semibold">{cruise.operator}</p>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <FaMapMarkerAlt className="text-blue-500 shrink-0" />
                    <span className="font-semibold text-gray-700 truncate">{cruise.route}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><FaClock className="text-blue-400" />{cruise.duration}</span>
                    <span className="flex items-center gap-1"><FaCalendarAlt className="text-blue-400" />{cruise.departureDate}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                    {(cruise.amenities || []).slice(0, 3).map(a => (
                        <span key={a} className="bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold rounded-full">{a}</span>
                    ))}
                    {(cruise.amenities || []).length > 3 && (
                        <span className="text-[10px] text-gray-400 self-center font-semibold">+{cruise.amenities.length - 3} more</span>
                    )}
                </div>
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Starting from</p>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-xl font-black text-blue-600">{fmt(cruise.price)}</p>
                            {cruise.originalPrice > cruise.price && (
                                <p className="text-xs text-gray-400 line-through">{fmt(cruise.originalPrice)}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-xs" />
                        <span className="text-xs font-bold text-gray-700">{cruise.rating?.toFixed ? cruise.rating.toFixed(1) : cruise.rating}</span>
                        <span className="text-[10px] text-gray-400">({cruise.reviews})</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Search Results Overlay ───────────────────────────────────────────────────
const SearchResults = ({ results, loading, onClose, navigate }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mb-10">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">
                    {loading ? 'Searching...' : `${results.length} Cruise${results.length !== 1 ? 's' : ''} Found`}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl"><FaTimes /></button>
            </div>
            <div className="p-5">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-16">
                        <FaShip className="text-6xl text-gray-200 mx-auto mb-4" />
                        <p className="text-xl font-black text-gray-400">No cruises found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {results.map(c => <CruiseCard key={c.id} cruise={c} navigate={(path) => { onClose(); navigate(path); }} />)}
                    </div>
                )}
            </div>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Cruises = () => {
    const navigate = useNavigate();

    // DB data
    const [dbCruises, setDbCruises] = useState([]);
    const [dbLoading, setDbLoading] = useState(true);

    // Search overlay
    const [searchPort, setSearchPort] = useState('');
    const [searchDuration, setSearchDuration] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const [intlTab, setIntlTab] = useState('Asia & Asia Pacific');

    // Load all cruises from DB on mount
    useEffect(() => {
        searchCruises({})
            .then(res => {
                const cruises = (res.data.cruises || []).map(toCard);
                setDbCruises(cruises);
            })
            .catch(() => setDbCruises([]))
            .finally(() => setDbLoading(false));
    }, []);

    // Domestic = port-based split
    const domestic = dbCruises.filter(c =>
        ['Mumbai', 'Kochi', 'Kolkata', 'Chennai', 'Port Blair', 'Goa'].includes(c.departure)
    );
    const international = dbCruises.filter(c =>
        !['Mumbai', 'Kochi', 'Kolkata', 'Chennai', 'Port Blair', 'Goa'].includes(c.departure)
    );
    const exclusiveDB = dbCruises.slice(0, 2); // Use first 2 DB cruises in exclusive-deals section

    // Search handler
    const handleSearch = async () => {
        setSearchLoading(true);
        setShowResults(true);
        try {
            const params = {};
            if (searchPort) params.departurePort = searchPort;
            if (searchDuration) params.duration = searchDuration;
            const res = await searchCruises(params);
            setSearchResults((res.data.cruises || []).map(toCard));
        } catch {
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const Skeleton = () => (
        <div className="bg-gray-200 rounded-2xl animate-pulse h-80" />
    );

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Search Results Overlay */}
            {showResults && (
                <SearchResults
                    results={searchResults}
                    loading={searchLoading}
                    onClose={() => setShowResults(false)}
                    navigate={navigate}
                />
            )}

            {/* ── HERO ── */}
            <section
                className="relative min-h-[600px] flex flex-col justify-center items-center text-center overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(160deg, rgba(5,10,40,0.82) 0%, rgba(0,30,80,0.55) 50%, rgba(5,10,40,0.88) 100%), url('https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1800&q=90')`,
                    backgroundSize: 'cover', backgroundPosition: 'center 40%',
                }}
            >
                <div className="relative z-10 max-w-5xl mx-auto px-4 py-24">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-[10px] font-black px-4 py-1.5 rounded-full mb-5 uppercase tracking-[0.2em]">
                        <FaAnchor /> 2026 Cruise Season Now Open
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 leading-none">
                        Sail Into Your<br /><span className="text-blue-300">Dream Voyage</span>
                    </h1>
                    <p className="text-white/65 text-lg sm:text-xl mb-12 max-w-2xl mx-auto font-light">
                        Discover world-class cruise holidays — from the Indian coastline to the Mediterranean. 20+ cruise lines. 100+ itineraries.
                    </p>
                    {/* Search Widget */}
                    <div className="bg-white/12 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto shadow-2xl">
                        <select value={searchPort} onChange={e => setSearchPort(e.target.value)}
                            className="flex-1 bg-white text-gray-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none cursor-pointer">
                            <option value="">All Departure Ports</option>
                            {PORTS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select value={searchDuration} onChange={e => setSearchDuration(e.target.value)}
                            className="flex-1 bg-white text-gray-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none cursor-pointer">
                            <option value="">Any Duration</option>
                            <option value="1-3">Short (1–3 Nights)</option>
                            <option value="4-6">Medium (4–6 Nights)</option>
                            <option value="7-9">Long (7–9 Nights)</option>
                            <option value="10+">Extended (10+ Nights)</option>
                        </select>
                        <button onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0">
                            <FaSearch /> Search
                        </button>
                    </div>
                </div>
                {/* Stats */}
                <div className="absolute bottom-0 inset-x-0 bg-black/35 backdrop-blur-sm border-t border-white/10 py-4">
                    <div className="max-w-5xl mx-auto px-4 grid grid-cols-4 gap-4 text-center">
                        {[['100+', 'Itineraries'], ['20+', 'Cruise Lines'], ['50+', 'Destinations'], ['2L+', 'Happy Guests']].map(([v, l]) => (
                            <div key={l}><p className="text-2xl font-black text-white">{v}</p><p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">{l}</p></div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── EXCLUSIVE DEALS ── */}
                <section className="py-14">
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">⚡ Flash Sale</p>
                        <h2 className="text-3xl font-black text-gray-900">Exclusive Deals</h2>
                        <p className="text-gray-500 text-sm mt-1">Limited-time offers — book before they're gone</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {EXCLUSIVE_DEALS.map((deal) => (
                            <div key={deal.name}
                                className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[300px] flex flex-col justify-end"
                                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, transparent 100%), url('${deal.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                onClick={handleSearch}
                            >
                                <div className="p-6 z-10">
                                    <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest">{deal.tag}</span>
                                    <h3 className="text-white font-black text-xl mb-1">{deal.name}</h3>
                                    <p className="text-white/70 text-xs mb-1">{deal.operator} · {deal.route}</p>
                                    <p className="text-white/50 text-xs mb-4">⏰ Valid till {deal.validTill}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/50 text-[10px] uppercase tracking-widest">Starting</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-2xl font-black text-white">{fmt(deal.price)}</p>
                                                <p className="text-white/40 text-sm line-through">{fmt(deal.originalPrice)}</p>
                                            </div>
                                        </div>
                                        <button className="bg-white text-gray-900 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-1.5">
                                            Book Now <FaArrowRight className="text-[10px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── TRENDING ITINERARIES ── */}
                <section className="py-10 border-t border-gray-100">
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">📍 Most Searched</p>
                        <h2 className="text-3xl font-black text-gray-900">Trending Cruise Itineraries</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {TRENDING_ROUTES.map(it => (
                            <div key={it.route}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 aspect-[3/4]"
                                onClick={() => { setSearchPort(it.port); handleSearch(); }}
                            >
                                <img src={it.img} alt={it.route}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMG; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="text-white font-black text-xs leading-snug">{it.route}</p>
                                    <p className="text-white/60 text-[10px] mt-0.5">{it.nights} Nights</p>
                                    <p className="text-blue-300 font-black text-xs mt-1">from {fmt(it.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── INTERNATIONAL CRUISE (static showcase + link to search) ── */}
                <section className="py-14 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🌍 Globe-Trotting</p>
                            <h2 className="text-3xl font-black text-gray-900">International Cruise</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {INTL_TABS.map(tab => (
                                <button key={tab} onClick={() => setIntlTab(tab)}
                                    className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${intlTab === tab ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(STATIC_INTL[intlTab] || []).map(c => (
                            <CruiseCard key={c.id} cruise={c} navigate={navigate} />
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <button onClick={handleSearch} className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-black px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-sm">
                            View All International Cruises <FaArrowRight className="text-xs" />
                        </button>
                    </div>
                </section>

                {/* ── DOMESTIC CRUISE (real DB data) ── */}
                <section className="py-10 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🇮🇳 Explore India</p>
                            <h2 className="text-3xl font-black text-gray-900">Domestic Cruise</h2>
                            <p className="text-gray-500 text-sm mt-1">India's stunning coastlines and sacred river routes</p>
                        </div>
                        <button onClick={handleSearch} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 shrink-0 mb-1">
                            View all <FaArrowRight className="text-xs" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dbLoading
                            ? Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
                            : domestic.length > 0
                                ? domestic.map(c => <CruiseCard key={c.id} cruise={c} navigate={navigate} />)
                                : (
                                    <div className="col-span-4 text-center py-12 bg-white rounded-2xl border border-gray-100">
                                        <FaShip className="text-5xl text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-500 font-semibold mb-3">No domestic cruises loaded yet.</p>
                                        <p className="text-gray-400 text-sm">Make sure your server is running and cruises are seeded.</p>
                                        <button onClick={handleSearch} className="mt-4 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-700">Browse All Cruises</button>
                                    </div>
                                )
                        }
                    </div>
                </section>

                {/* ── CRUISE LINES ── */}
                <section className="py-14 border-t border-gray-100">
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">⚓ Our Partners</p>
                        <h2 className="text-3xl font-black text-gray-900">Cruise Line</h2>
                        <p className="text-gray-500 text-sm mt-1">World-class operators — all in one place</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        {CRUISE_LINES.map(line => (
                            <button key={line.name}
                                onClick={() => { setSearchPort(line.port); handleSearch(); }}
                                className={`group ${line.bg} ${line.border} border-2 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className="text-3xl mb-2">{line.emoji}</div>
                                <p className={`text-xs font-black ${line.text} leading-tight mb-1`}>{line.name}</p>
                                <p className="text-[10px] text-gray-400">{line.routes}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── AVAILABLE OFFERS ── */}
                <section className="py-10 border-t border-gray-100">
                    <div className="mb-8">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🎁 Save More</p>
                        <h2 className="text-3xl font-black text-gray-900">Available Offers</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {OFFERS.map((offer, i) => (
                            <div key={i} className={`rounded-2xl bg-gradient-to-br ${offer.color} p-6 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                                onClick={handleSearch}>
                                <span className="inline-block bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full mb-3 uppercase tracking-widest">{offer.tag}</span>
                                <h3 className="font-black text-xl mb-1 leading-tight">{offer.title}</h3>
                                <p className="text-white/70 text-sm mb-4">{offer.desc}</p>
                                <ul className="space-y-1.5 mb-5">
                                    {offer.points.map(p => (
                                        <li key={p} className="flex items-start gap-2 text-xs text-white/85"><FaCheck className="text-white/60 mt-0.5 shrink-0" /> {p}</li>
                                    ))}
                                </ul>
                                <button className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2">
                                    Claim Offer <FaArrowRight className="text-[10px]" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ── WHY CRUISE ── */}
            <section className="bg-white py-16 mt-4 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">🌊 Why Cruise</p>
                        <h2 className="text-3xl font-black text-gray-900">The Ocean is Calling</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                        {WHY_CRUISE.map(w => (
                            <div key={w.label} className="group text-center p-5 rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">{w.icon}</div>
                                <p className="font-black text-gray-900 text-xs mb-1">{w.label}</p>
                                <p className="text-[11px] text-gray-500 leading-snug">{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRAVEL STORIES ── */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">✍️ Real Experiences</p>
                        <h2 className="text-3xl font-black text-gray-900">Travel Stories</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRAVEL_STORIES.map((s, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100">
                                <FaQuoteLeft className="text-blue-100 text-3xl mb-3" />
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{s.story}"</p>
                                <div className="flex gap-0.5 mb-1">{Array(s.rating).fill(0).map((_, si) => <FaStar key={si} className="text-yellow-400 text-xs" />)}</div>
                                <p className="text-xs text-gray-400 italic mb-3">— {s.cruise}</p>
                                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                    <div className={`w-9 h-9 ${s.color} rounded-full flex items-center justify-center text-white text-sm font-black`}>{s.avatar}</div>
                                    <div>
                                        <p className="font-black text-gray-900 text-xs">{s.name}</p>
                                        <p className="text-gray-400 text-[10px]">{s.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20"
                style={{ backgroundImage: `linear-gradient(135deg,rgba(5,10,60,.92) 0%,rgba(0,50,120,.88) 100%),url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">Ready to Set Sail? ⚓</h2>
                    <p className="text-white/65 text-lg mb-10">Browse all cruise packages with flexible booking and instant confirmation.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-400 text-white font-black px-10 py-4 rounded-xl transition-all shadow-2xl text-sm">
                            Browse All Cruises
                        </button>
                        <a href="tel:+918001234567" className="border-2 border-white/30 hover:border-white/60 text-white font-bold px-10 py-4 rounded-xl transition-all text-sm flex items-center justify-center">
                            📞 Speak to an Expert
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Cruises;
