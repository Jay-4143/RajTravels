import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPackages, getFeaturedPackages, getHotDeals } from '../api/packageApi';
import {
    FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign, FaArrowRight,
    FaStar, FaUsers, FaHeart, FaChevronLeft, FaChevronRight, FaClock,
    FaCheck, FaPhone, FaShieldAlt, FaHeadset, FaTags, FaGlobe, FaUmbrellaBeach,
    FaMountain, FaCity, FaHotel, FaPassport, FaPlane, FaArrowUp, FaAngleUp,
    FaSortAmountDown
} from 'react-icons/fa';
import { useGlobal } from '../context/GlobalContext';
import { toast } from 'react-hot-toast';
import CityDropdown from '../components/CityDropdown';
import HolidayFilters from '../components/HolidayFilters';
import HolidayPackageListItem from '../components/HolidayPackageListItem';
import ServicesStrip from '../components/ServicesStrip';
import ExclusiveDeals from '../components/ExclusiveDeals';

// New Components
import PopularSearches from '../components/holidays/PopularSearches';
import PickYourTheme from '../components/holidays/PickYourTheme';
import DestinationTabs from '../components/holidays/DestinationTabs';
import WhereToGo from '../components/holidays/WhereToGo';
import TestimonialsCarousel from '../components/holidays/TestimonialsCarousel';
import AppBanner from '../components/holidays/AppBanner';
import QuickFiltersCarousel from '../components/holidays/QuickFiltersCarousel';

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
    const [searchForm, setSearchForm] = useState({ destination: '', month: 'Anytime', minPrice: '', maxPrice: '' });
    const [searchError, setSearchError] = useState('');

    const [filters, setFilters] = useState({
        flightPref: null,
        holidayType: {},
        budget: 575000,
        duration: 10,
        country: {},
        city: {},
        quickFilters: []
    });
    const [sortBy, setSortBy] = useState('choice'); // 'choice', 'duration', 'price'

    const handleToggleQuickFilter = (filterId) => {
        setFilters(prev => {
            const currentArr = prev.quickFilters || [];
            if (currentArr.includes(filterId)) {
                return { ...prev, quickFilters: currentArr.filter(id => id !== filterId) };
            } else {
                return { ...prev, quickFilters: [...currentArr, filterId] };
            }
        });
    };

    const handleClearQuickFilters = () => {
        setFilters(prev => ({ ...prev, quickFilters: [] }));
    };

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

    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const monthDropdownRef = useRef(null);

    // Generate array of 24 months starting from current month
    const generateMonths = () => {
        const months = ['Anytime'];
        const date = new Date();
        for (let i = 0; i < 24; i++) {
            months.push(date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear());
            date.setMonth(date.getMonth() + 1);
        }
        return months;
    };
    const upcomingMonths = generateMonths();

    // Handle clicks outside of dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
                setMonthDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

        if (!searchForm.destination && searchForm.month === 'Anytime') {
            setSearchError("Please enter a destination or select a month to search.");
            return;
        }

        setSearchError(''); // clear any existing errors
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

    const executeQuickSearch = (params) => {
        setHasSearched(true);
        getPackages(params).then(res => setSearchResults(res.packages || []));
        tabRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getTabPackages = () => {
        if (activeMainTab === 'hot-deals') return hotDealPkgs;
        if (activeMainTab === 'domestic') return domesticPkgs;
        if (activeMainTab === 'international') return intlPkgs;
        if (activeMainTab === 'featured') return featuredPkgs;
        return [];
    };

    const basePackages = hasSearched ? searchResults : getTabPackages();

    // Derived properties for filters
    const availableCountries = [...new Set(basePackages.map(pkg => pkg.country).filter(Boolean))];
    const availableCities = [...new Set(basePackages.map(pkg => pkg.destination).filter(Boolean))];

    // Filter Logic
    const filteredPackages = basePackages.filter(pkg => {
        if (filters.budget < pkg.price) return false;
        if (filters.duration < (pkg.duration?.nights || 4)) return false;

        const selectedCountries = Object.keys(filters.country).filter(k => filters.country[k]);
        if (selectedCountries.length > 0 && !selectedCountries.includes(pkg.country)) return false;

        const selectedCities = Object.keys(filters.city).filter(k => filters.city[k]);
        if (selectedCities.length > 0 && !selectedCities.includes(pkg.destination)) return false;

        // Holiday Type check
        const selectedHolidayTypes = Object.keys(filters.holidayType || {}).filter(k => filters.holidayType[k]);
        if (selectedHolidayTypes.length > 0) {
            const hasMatch = selectedHolidayTypes.some(ht => pkg.category?.includes(ht));
            if (!hasMatch) return false;
        }

        // Quick Filters check (OR logic)
        if (filters.quickFilters && filters.quickFilters.length > 0) {
            const hasMatch = filters.quickFilters.some(qf =>
                pkg.category?.includes(qf) ||
                pkg.highlights?.some(h => typeof h === 'string' && h.toLowerCase().includes(qf.toLowerCase()))
            );
            if (!hasMatch) return false;
        }

        return true;
    });

    // Sort Logic
    const displayPackages = [...filteredPackages].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'duration') return (a.duration?.nights || 0) - (b.duration?.nights || 0);
        return a.featured ? -1 : 1; // Default choice
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── HERO ─────────────────────────────────────────────────── */}
            <div
                className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/60 to-blue-900/80"></div>
                <div className="relative z-40 w-full max-w-5xl mx-auto px-4 text-center pt-24 pb-16">
                    <p className="text-blue-200 uppercase tracking-widest text-sm font-semibold mb-3">Holidays Made Easy</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                        Find Your Perfect <span className="text-yellow-400">Holiday Package</span>
                    </h1>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                        Explore thousands of curated packages — domestic & international, for every budget.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col md:flex-row gap-3 relative z-40">
                        {searchError && (
                            <div className="absolute -top-12 left-4 md:left-5 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow-md border border-red-200 flex items-center gap-2">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.978c-6.434 0-11.722-5.072-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.989-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"></path></svg>
                                {searchError}
                            </div>
                        )}
                        <div className="flex-1 relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 z-10" />
                            <button
                                type="button"
                                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white text-left min-h-[50px]"
                            >
                                {searchForm.destination || "Search destination (e.g., Bali, Kerala)"}
                            </button>

                            {/* Anchored City Dropdown */}
                            <CityDropdown
                                type="holidays"
                                isOpen={cityDropdownOpen}
                                onClose={() => setCityDropdownOpen(false)}
                                onSelect={(val) => {
                                    const cityName = val.split(' (')[0];
                                    setSearchForm({ ...searchForm, destination: cityName });
                                    setCityDropdownOpen(false);
                                    setSearchError(''); // Clear error on edit
                                }}
                                position={{ top: 0, left: 0 }}
                                className="w-full"
                            />
                        </div>

                        {/* Month Selector Dropdown */}
                        <div className="flex-1 relative" ref={monthDropdownRef}>
                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 z-10" />
                            <div className="absolute left-[34px] top-1/2 -translate-y-1/2 w-[1px] h-6 bg-gray-200 z-10"></div>
                            <button
                                type="button"
                                onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                                className="w-full pl-11 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white text-left min-h-[50px] flex items-center justify-between"
                            >
                                <span className={searchForm.month === 'Anytime' ? 'text-gray-500' : 'text-gray-800 font-medium'}>
                                    {searchForm.month}
                                </span>
                            </button>

                            {/* Dropdown Pane */}
                            {monthDropdownOpen && (
                                <div className="absolute top-[105%] left-0 w-full md:w-[320px] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-4">
                                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                        <h3 className="font-bold text-gray-900">Select Month</h3>
                                        <FaArrowUp className="text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => setMonthDropdownOpen(false)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto px-1 pb-1 custom-scrollbar">
                                        {upcomingMonths.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => {
                                                    setSearchForm({ ...searchForm, month: m });
                                                    setMonthDropdownOpen(false);
                                                    setSearchError(''); // Clear error on edit
                                                }}
                                                className={`py-2 px-3 text-center text-sm font-medium rounded-lg border transition-colors ${searchForm.month === m ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {m === 'Anytime' ? 'Any Time' : m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-colors flex items-center gap-2 justify-center whitespace-nowrap">
                            <FaSearch /> Search Now
                        </button>
                    </form>
                </div>
            </div >

            {!hasSearched ? (
                <>
                    <ServicesStrip />
                    {/* ── EXCLUSIVE DEALS PANEL ──────────────────────────────────── */}
                    <ExclusiveDeals
                        hotDeals={hotDealPkgs}
                        featured={featuredPkgs}
                        domestic={domesticPkgs}
                        international={intlPkgs}
                        onDealClick={(pkg) => {
                            const type = (pkg.country && pkg.country.toLowerCase() === 'india') ? 'domestic' : 'international';
                            handleDestSearch(pkg.destination, type);
                        }}
                        onViewAll={(tabName) => {
                            let typeId = 'hot-deals';
                            if (tabName === 'DOMESTIC') typeId = 'domestic';
                            if (tabName === 'INTERNATIONAL') typeId = 'international';
                            if (tabName === 'FIXED DEPARTURES' || tabName === 'COACH TOUR') typeId = 'featured';

                            setActiveMainTab(typeId);
                            setSearchResults([]);
                            setHasSearched(true);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                    />

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
                                        <img src={dest.image} alt={dest.name} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
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

                    {/* ── NEW DYNAMIC SECTIONS ──────────────────────────────────────── */}
                    <section className="py-14 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <PopularSearches onSearch={(dest) => handleDestSearch(dest, 'international')} />
                            <PickYourTheme onThemeSelect={(theme) => executeQuickSearch({ category: theme })} />
                            <DestinationTabs type="international" onNavigate={handleDestSearch} />
                            <DestinationTabs type="domestic" onNavigate={handleDestSearch} />
                            <WhereToGo onSearchMonth={(month) => executeQuickSearch({ bestMonths: month })} />
                            <TestimonialsCarousel />
                            <AppBanner />
                        </div>
                    </section>

                    {/* ── INTERNATIONAL & DOMESTIC CATEGORY BROWSE ─────────────── */}
                    <section className="py-14 bg-white">
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
                                                    onClick={() => executeQuickSearch({ type: 'international', category: cat === 'All' ? undefined : cat })}
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
                                                    onClick={() => executeQuickSearch({ type: 'domestic', category: cat === 'All' ? undefined : cat })}
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
                                <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-2">Why Raj Travel?</p>
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
                </>
            ) : (
                /* ── DEDICATED SEARCH RESULTS PAGE ─────────────────────────────────────────── */
                <div className="max-w-7xl mx-auto px-4 py-8">

                    {/* Top Heading */}
                    <div className="mb-6 pb-4 border-b border-gray-200 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-red-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M472 64H176l-8-24H24v432h144v-48H72V112h80l8 24h312V64zm-144 192v-48h-48v48h-48l72 72 72-72z"></path></svg>
                                {searchForm.destination ? `${searchForm.destination} Tour Packages` : 'All Tour Packages'}
                            </h1>
                            <p className="text-sm text-gray-500 max-w-4xl mt-2 leading-relaxed">
                                Thailand is hands down one of the most popular travel destinations in the world. Thanks to its abundant beaches, islands, temples, and delicious street food, all at affordable prices with our packages. These attractions not only reflect culture at its best, but also offer a soul-stirring experience.
                            </p>
                        </div>
                    </div>

                    <div ref={tabRef} />

                    {/* QUICK FILTERS HORIZONTAL CAROUSEL */}
                    <QuickFiltersCarousel
                        activeFilters={filters.quickFilters || []}
                        onToggleFilter={handleToggleQuickFilter}
                        onClearAll={handleClearQuickFilters}
                    />

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* LEFT: FILTER SIDEBAR */}
                        <div className="w-full lg:w-72 flex-shrink-0">
                            <HolidayFilters
                                filters={filters}
                                setFilters={setFilters}
                                availableCountries={availableCountries}
                                availableCities={availableCities}
                                filteredCount={displayPackages.length}
                            />
                        </div>

                        {/* RIGHT: SORTING & PACKAGE LIST */}
                        <div className="flex-1">
                            {/* Sort Bar */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-2 flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="flex items-center gap-2 font-medium text-sm w-full overflow-x-auto">
                                    <div className="text-blue-600 px-3 py-2 bg-blue-50 rounded-lg flex items-center gap-2 flex-shrink-0">
                                        Sort by <FaSortAmountDown />
                                    </div>
                                    <button
                                        onClick={() => setSortBy('choice')}
                                        className={`px-4 py-2 flex-shrink-0 ${sortBy === 'choice' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'} transition-colors whitespace-nowrap`}
                                    >
                                        Raj Travels Choice
                                    </button>
                                    <button
                                        onClick={() => setSortBy('duration')}
                                        className={`px-4 py-2 flex-shrink-0 ${sortBy === 'duration' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'} transition-colors whitespace-nowrap`}
                                    >
                                        Duration
                                    </button>
                                    <button
                                        onClick={() => setSortBy('price')}
                                        className={`px-4 py-2 flex-shrink-0 ${sortBy === 'price' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'} transition-colors whitespace-nowrap`}
                                    >
                                        Price
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 whitespace-nowrap px-3 mt-2 sm:mt-0">
                                    Showing {displayPackages.length} Trips
                                </div>
                            </div>

                            {/* Package List */}
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse flex flex-col md:flex-row h-64 border border-gray-100">
                                            <div className="w-full md:w-72 bg-gray-200"></div>
                                            <div className="p-6 space-y-4 flex-1">
                                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2 mt-8"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : displayPackages.length > 0 ? (
                                <div className="space-y-0">
                                    {displayPackages.map(pkg => (
                                        <HolidayPackageListItem key={pkg._id} pkg={pkg} onClick={() => navigate(`/packages/${pkg._id}`)} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                                    We couldn't find any packages matching those exact filters.
                                    <br />Try adjusting your budget or clearing filters!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO Static Sections */}
                    <div className="mt-12 space-y-10 border-t border-gray-200 pt-10">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Flights To Thailand</h3>
                            <div className="text-sm text-blue-600 flex flex-wrap gap-2 leading-loose">
                                <a href="#" className="hover:underline">Mumbai Bangkok Flights</a> |
                                <a href="#" className="hover:underline">Delhi Bangkok Flights</a> |
                                <a href="#" className="hover:underline">Chennai Bangkok Flights</a> |
                                <a href="#" className="hover:underline">Bangalore Bangkok Flights</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Recommended International Holidays</h3>
                            <div className="text-sm text-blue-600 flex flex-wrap gap-2 leading-loose">
                                <a href="#" className="hover:underline">Dubai Tour Packages</a> |
                                <a href="#" className="hover:underline">Malaysia Packages</a> |
                                <a href="#" className="hover:underline">Europe Tour Packages</a> |
                                <a href="#" className="hover:underline">Mauritius Tour Packages</a> |
                                <a href="#" className="hover:underline">Bali Tour Packages</a> |
                                <a href="#" className="hover:underline">Maldives Tour Packages</a> |
                                <a href="#" className="hover:underline">Singapore Tour Packages</a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">FAQ – All About Tour Packages</h3>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h4 className="font-bold text-gray-800 text-lg mb-4">FAQs</h4>
                                <div className="bg-orange-50/50 rounded-lg p-5">
                                    <div className="flex justify-between items-center font-bold text-gray-800 mb-3">
                                        What is the best time to visit?
                                        <span>-</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Depending on your travel interests, the best time to visit will differ. However, the ideal time to visit most tropical destinations is in the cool season from October to March, when temperatures ease off and skies are clear, i.e. after the monsoon and before the sweltering heat sets in. This period is the busiest time of the year to travel. Temperatures are pleasant, humidity is low and days are sunny.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
                    loading="lazy"
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
