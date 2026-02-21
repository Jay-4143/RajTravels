import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPackages, getFeaturedPackages, getHotDeals } from '../api/packageApi';
import {
    FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaArrowRight,
    FaStar, FaUsers, FaHeart, FaChevronLeft, FaChevronRight, FaClock,
    FaCheck, FaPhone, FaShieldAlt, FaHeadset, FaTags, FaGlobe, FaUmbrellaBeach,
    FaMountain, FaCity, FaHotel, FaPassport, FaPlane
} from 'react-icons/fa';
import { useGlobal } from '../context/GlobalContext';

// ─── Destination Data ──────────────────────────────────────────────────────
const INTERNATIONAL_DESTINATIONS = [
    { name: 'Thailand', trips: '21+', price: 26115, image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400', destination: 'Thailand' },
    { name: 'Singapore', trips: '19+', price: 27972, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400', destination: 'Singapore' },
    { name: 'Dubai', trips: '11+', price: 23701, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', destination: 'Dubai' },
    { name: 'Bali', trips: '10+', price: 16670, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', destination: 'Bali' },
    { name: 'Maldives', trips: '11+', price: 74880, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', destination: 'Maldives' },
    { name: 'Vietnam', trips: '15+', price: 18824, image: 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?w=400', destination: 'Vietnam' },
    { name: 'Malaysia', trips: '16+', price: 11567, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', destination: 'Malaysia' },
    { name: 'Oman', trips: '3+', price: 31519, image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', destination: 'Oman' },
];

const DOMESTIC_DESTINATIONS = [
    { name: 'Kerala', trips: '20+', price: 12000, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400', destination: 'Kerala' },
    { name: 'Goa', trips: '15+', price: 8000, image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=400', destination: 'Goa' },
    { name: 'Rajasthan', trips: '18+', price: 10000, image: 'https://images.unsplash.com/photo-1477587458883-47145ed31db6?w=400', destination: 'Rajasthan' },
    { name: 'Manali', trips: '12+', price: 9000, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400', destination: 'Manali' },
    { name: 'Andaman', trips: '8+', price: 15000, image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400', destination: 'Andaman' },
    { name: 'Leh Ladakh', trips: '6+', price: 20000, image: 'https://images.unsplash.com/photo-1566836610593-62a64888a251?w=400', destination: 'Ladakh' },
    { name: 'Darjeeling', trips: '10+', price: 11000, image: 'https://images.unsplash.com/photo-1544761634-dc512f2238a3?w=400', destination: 'Darjeeling' },
    { name: 'Kashmir', trips: '14+', price: 16000, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400', destination: 'Kashmir' },
];

// ─── Why Choose Us Data ────────────────────────────────────────────────────
const WHY_CHOOSE = [
    { icon: <FaTags className="text-3xl" />, title: 'Best Price Guarantee', desc: 'We offer competitive pricing with exclusive deals unavailable elsewhere.' },
    { icon: <FaShieldAlt className="text-3xl" />, title: 'Safe & Secure Booking', desc: '100% secure payment with PCI-DSS compliant gateway.' },
    { icon: <FaHeadset className="text-3xl" />, title: '24/7 Expert Support', desc: 'Our travel experts are reachable round the clock, all year.' },
    { icon: <FaPassport className="text-3xl" />, title: 'Visa Assistance', desc: 'Hassle-free visa support with 99% approval rate.' },
    { icon: <FaPlane className="text-3xl" />, title: 'All-in-One Travel', desc: 'Flights, hotels, visa, and activities — under one roof.' },
    { icon: <FaHeart className="text-3xl" />, title: '85% Repeat Clients', desc: 'Our guests love us enough to come back time and again.' },
];

// ─── Main Component ────────────────────────────────────────────────────────
const Holidays = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchExecuted = useRef(false);
    const { formatPrice } = useGlobal();
    const [activeMainTab, setActiveMainTab] = useState('hot-deals');
    const [destTab, setDestTab] = useState('international');
    const [searchForm, setSearchForm] = useState({ destination: '', type: '', minPrice: '', maxPrice: '' });

    const [featuredPkgs, setFeaturedPkgs] = useState([]);
    const [hotDealPkgs, setHotDealPkgs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [domesticPkgs, setDomesticPkgs] = useState([]);
    const [intlPkgs, setIntlPkgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const [expertForm, setExpertForm] = useState({ name: '', email: '', phone: '' });
    const [expertSent, setExpertSent] = useState(false);

    const tabRef = useRef(null);

    useEffect(() => {
        Promise.all([
            getFeaturedPackages(),
            getHotDeals(),
            getPackages({ type: 'domestic', limit: 6 }),
            getPackages({ type: 'international', limit: 6 }),
        ]).then(([feat, hot, dom, intl]) => {
            setFeaturedPkgs(feat.packages || []);
            setHotDealPkgs(hot.packages || []);
            setDomesticPkgs(dom.packages || []);
            setIntlPkgs(intl.packages || []);
        }).catch(console.error).finally(() => { setLoading(false); setDataLoaded(true); });

        // Handle navigation state search
        const { destination, type } = location.state || {};
        if (destination && !searchExecuted.current) {
            searchExecuted.current = true;
            getPackages({ destination, type }).then(res => {
                setSearchResults(res.packages || []);
                setHasSearched(true);
                tabRef.current?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [location.state]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setHasSearched(true);
        const res = await getPackages(searchForm);
        setSearchResults(res.packages || []);
        tabRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDestSearch = (destination, type) => {
        setHasSearched(true);
        navigate(`/holidays?destination=${destination}&type=${type}`);
        getPackages({ destination, type }).then(res => setSearchResults(res.packages || []));
        tabRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getTabPackages = () => {
        if (activeMainTab === 'hot-deals') return hotDealPkgs;
        if (activeMainTab === 'domestic') return domesticPkgs;
        if (activeMainTab === 'international') return intlPkgs;
        if (activeMainTab === 'featured') return featuredPkgs;
        return [];
    };

    const displayPackages = searchResults.length > 0 ? searchResults : getTabPackages();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div
                className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/60 to-blue-900/80"></div>
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
                    <p className="text-blue-200 uppercase tracking-widest text-sm font-semibold mb-3">Holidays Made Easy</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                        Find Your Perfect <span className="text-yellow-400">Holiday Package</span>
                    </h1>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                        Explore thousands of curated packages — domestic & international, for every budget.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                            <input
                                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                placeholder="Search destination (e.g., Bali, Kerala)"
                                name="destination"
                                value={searchForm.destination}
                                onChange={e => setSearchForm({ ...searchForm, destination: e.target.value })}
                            />
                        </div>
                        <select
                            className="flex-1 px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                            name="type"
                            value={searchForm.type}
                            onChange={e => setSearchForm({ ...searchForm, type: e.target.value })}
                        >
                            <option value="">All Types</option>
                            <option value="domestic">Domestic</option>
                            <option value="international">International</option>
                        </select>
                        <div className="flex gap-2 flex-1">
                            <div className="relative flex-1">
                                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    className="w-full pl-7 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="Min ₹"
                                    type="number"
                                    value={searchForm.minPrice}
                                    onChange={e => setSearchForm({ ...searchForm, minPrice: e.target.value })}
                                />
                            </div>
                            <div className="relative flex-1">
                                <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    className="w-full pl-7 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    placeholder="Max ₹"
                                    type="number"
                                    value={searchForm.maxPrice}
                                    onChange={e => setSearchForm({ ...searchForm, maxPrice: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-colors flex items-center gap-2 justify-center whitespace-nowrap">
                            <FaSearch /> Search Now
                        </button>
                    </form>
                </div>
            </div>

            {/* ── QUICK CATEGORY PILLS ──────────────────────────────────── */}
            <div className="bg-white border-b shadow-sm sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
                    <div className="flex items-center gap-1 py-3 whitespace-nowrap">
                        {[
                            { id: 'hot-deals', label: '🔥 Hot Deals' },
                            { id: 'featured', label: '⭐ Featured' },
                            { id: 'domestic', label: '🇮🇳 Domestic' },
                            { id: 'international', label: '✈️ International' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveMainTab(tab.id); setSearchResults([]); setHasSearched(true); }}
                                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${activeMainTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <button
                            onClick={() => { setSearchResults([]); setSearchForm({ destination: '', type: '', minPrice: '', maxPrice: '' }); }}
                            className="ml-auto text-sm text-blue-600 hover:underline px-2"
                        >
                            Clear Search
                        </button>
                    </div>
                </div>
            </div>

            {/* ── PACKAGES GRID ─────────────────────────────────────────── */}
            <div ref={tabRef} />
            {(loading || displayPackages.length > 0) && (
                <div className="max-w-7xl mx-auto px-4 py-10">
                    {searchResults.length > 0 && (
                        <p className="text-gray-500 mb-4 text-sm">Showing {searchResults.length} results for your search</p>
                    )}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                                    <div className="h-52 bg-gray-200"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayPackages.map(pkg => (
                                <PackageCard key={pkg._id} pkg={pkg} onClick={() => navigate(`/packages/${pkg._id}`)} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── TRENDING DESTINATIONS ─────────────────────────────────── */}
            <section className="py-14 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-1">Explore By Region</p>
                            <h2 className="text-3xl font-bold text-gray-800">Popular Destinations</h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setDestTab('international')}
                                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${destTab === 'international' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-300 hover:border-blue-400'}`}
                            >
                                International
                            </button>
                            <button
                                onClick={() => setDestTab('domestic')}
                                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${destTab === 'domestic' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border-gray-300 hover:border-blue-400'}`}
                            >
                                Domestic
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {(destTab === 'international' ? INTERNATIONAL_DESTINATIONS : DOMESTIC_DESTINATIONS).map(dest => (
                            <div
                                key={dest.name}
                                onClick={() => handleDestSearch(dest.destination, destTab === 'international' ? 'international' : 'domestic')}
                                className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                            >
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                    <p className="font-bold text-base leading-tight">{dest.name}</p>
                                    <p className="text-xs text-white/80">{dest.trips} Trips from {formatPrice(dest.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INTERNATIONAL & DOMESTIC CATEGORY BROWSE ─────────────── */}
            <section className="py-14 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* International */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="bg-blue-700 text-white p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-blue-200">Explore</p>
                                    <h3 className="text-xl font-bold">International Tours</h3>
                                </div>
                                <FaGlobe className="text-4xl text-blue-300 opacity-60" />
                            </div>
                            <div className="p-4">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['All', 'Beach', 'City', 'Luxury', 'Romantic', 'Honeymoon'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => getPackages({ type: 'international', category: cat === 'All' ? undefined : cat }).then(r => setSearchResults(r.packages || []))}
                                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {INTERNATIONAL_DESTINATIONS.slice(0, 5).map(d => (
                                        <div key={d.name} onClick={() => handleDestSearch(d.destination, 'international')} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 cursor-pointer group border-b border-gray-100 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <img src={d.image} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                                                <span className="font-medium text-gray-700 group-hover:text-blue-600">{d.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>{d.trips} Trips</span>
                                                <FaArrowRight className="text-xs group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { setActiveMainTab('international'); setSearchResults([]); tabRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-4 w-full text-center text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                    View All International Packages →
                                </button>
                            </div>
                        </div>

                        {/* Domestic */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="bg-orange-500 text-white p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-orange-200">Discover India</p>
                                    <h3 className="text-xl font-bold">Domestic Tours</h3>
                                </div>
                                <FaMountain className="text-4xl text-orange-200 opacity-60" />
                            </div>
                            <div className="p-4">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['All', 'Beach', 'Nature', 'Adventure', 'Heritage'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => getPackages({ type: 'domestic', category: cat === 'All' ? undefined : cat }).then(r => setSearchResults(r.packages || []))}
                                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-500 hover:text-white transition-colors"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {DOMESTIC_DESTINATIONS.slice(0, 5).map(d => (
                                        <div key={d.name} onClick={() => handleDestSearch(d.destination, 'domestic')} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 cursor-pointer group border-b border-gray-100 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <img src={d.image} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                                                <span className="font-medium text-gray-700 group-hover:text-orange-600">{d.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <span>{d.trips} Trips</span>
                                                <FaArrowRight className="text-xs group-hover:text-orange-500 transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => { setActiveMainTab('domestic'); setSearchResults([]); tabRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-4 w-full text-center text-orange-600 hover:text-orange-700 font-semibold text-sm py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                                    View All Domestic Packages →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
            <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-2">Why TravelGo?</p>
                        <h2 className="text-3xl md:text-4xl font-bold">Why choose Holidays with us</h2>
                        <p className="text-blue-200 mt-3 max-w-xl mx-auto">Our competitive rates and exclusive offers give us an edge. We promise unbeatable services in pricing and quality.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {WHY_CHOOSE.map((item, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-colors border border-white/10">
                                <div className="text-yellow-400 mb-4">{item.icon}</div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EXPERT CALL BACK ──────────────────────────────────────── */}
            <section className="py-14 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="p-8 md:p-12 text-white">
                                <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-3">Talk to Us</p>
                                <h2 className="text-3xl font-bold mb-4">Planning your next trip?</h2>
                                <p className="text-orange-100 mb-6 leading-relaxed">
                                    Our travel experts will share the best offers in minutes! Leave your details and we'll reach out right away.
                                </p>
                                <div className="flex items-center gap-3 text-white">
                                    <div className="bg-white/20 rounded-full p-2">
                                        <FaPhone className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-orange-200 text-xs">Call us directly</p>
                                        <p className="font-bold text-lg">1800-123-4567</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-8 md:p-10">
                                {expertSent ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                            <FaCheck className="text-green-500 text-2xl" />
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-800 mb-2">We'll Call You Back!</h3>
                                        <p className="text-gray-500">Our expert will reach out to you within 15 minutes.</p>
                                    </div>
                                ) : (
                                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); setExpertSent(true); }}>
                                        <h3 className="text-gray-800 font-bold text-lg mb-4">Get a Free Callback</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                            <input
                                                type="text" required placeholder="John Doe"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                                                value={expertForm.name} onChange={e => setExpertForm({ ...expertForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email" required placeholder="john@example.com"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                                                value={expertForm.email} onChange={e => setExpertForm({ ...expertForm, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel" required placeholder="+91 98765 43210"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                                                value={expertForm.phone} onChange={e => setExpertForm({ ...expertForm, phone: e.target.value })}
                                            />
                                        </div>
                                        <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity">
                                            Request Callback
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS BANNER ──────────────────────────────────────────── */}
            <section className="py-10 bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { value: '10,000+', label: 'Happy Travellers' },
                        { value: '500+', label: 'Tour Packages' },
                        { value: '95%', label: 'Approval Rate', sub: 'Visa' },
                        { value: '24/7', label: 'Customer Support' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-3xl font-extrabold text-yellow-400 mb-1">{stat.value}</div>
                            <div className="text-gray-300 text-sm">{stat.sub ? <><span className="text-white">{stat.sub}</span> {stat.label}</> : stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// ─── Package Card Sub-component ────────────────────────────────────────────
const PackageCard = ({ pkg, onClick }) => {
    const { formatPrice } = useGlobal();
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'}
                    alt={pkg.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Strong bottom gradient so title is always readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {pkg.hotDeal && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">HOT DEAL</span>}
                    {pkg.featured && !pkg.hotDeal && <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full shadow">FEATURED</span>}
                </div>
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-white shadow">
                    {pkg.duration.days}D/{pkg.duration.nights}N
                </div>

                {/* Package name + destination at BOTTOM of image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white/75 text-xs flex items-center gap-1 mb-1">
                        <FaMapMarkerAlt className="text-red-400 flex-shrink-0" /> {pkg.destination}, {pkg.country}
                    </p>
                    <h3 className="font-extrabold text-white text-base leading-snug drop-shadow-md line-clamp-2">
                        {pkg.title}
                    </h3>
                </div>
            </div>

            {/* Bottom card info */}
            <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {(pkg.highlights || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                        <span className="text-gray-400 text-xs block">Starting from</span>
                        <span className="text-2xl font-extrabold text-blue-600">{formatPrice(pkg.price)}</span>
                        <span className="text-xs text-gray-400"> / person</span>
                    </div>
                    <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Holidays;
