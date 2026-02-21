import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaCar, FaUserFriends, FaSuitcase, FaStar, FaChevronRight, FaFilter,
    FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExchangeAlt, FaShieldAlt,
    FaCheckCircle, FaRupeeSign, FaGasPump, FaCogs, FaSearch, FaTimes
} from 'react-icons/fa';
import { searchCabs } from '../api/cabs';
import { useGlobal } from '../context/GlobalContext';
import Footer from '../components/Footer';
import SearchableDropdown from '../components/SearchableDropdown';

const CITIES = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Goa", "Hyderabad", "Kochi", "Kolkata", "Mumbai", "Pune", "Udaipur", "Jaipur", "Amritsar", "Varanasi"];

const POPULAR_ROUTES = [
    { from: "Mumbai", to: "Pune", price: 2500, image: "https://images.unsplash.com/photo-1570160897042-da3984796cae?w=800" },
    { from: "Delhi", to: "Agra", price: 3500, image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=800" },
    { from: "Bangalore", to: "Mysore", price: 2800, image: "https://images.unsplash.com/photo-1524396309943-e03f5ee0563b?w=800" },
    { from: "Chennai", to: "Pondicherry", price: 3200, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800" },
];

const Cabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formatPrice } = useGlobal();
    const resultsRef = useRef(null);
    const params = new URLSearchParams(location.search);

    const [cabs, setCabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [activeTab, setActiveTab] = useState(params.get('type') || 'outstation'); // outstation, local, airport
    const [tripType, setTripType] = useState('one-way'); // one-way, round-trip

    // Search State
    const today = new Date().toISOString().split('T')[0];

    const [searchState, setSearchState] = useState({
        from: params.get('from') || '',
        to: params.get('to') || '',
        date: params.get('date') || today,
        time: params.get('time') || '10:00',
        city: params.get('city') || params.get('from') || ''
    });

    const [filters, setFilters] = useState({
        vehicleType: params.get('vehicleType') || '',
        fuelType: params.get('fuelType') || '',
        transmission: params.get('transmission') || '',
        sort: params.get('sort') || 'priceLow'
    });

    useEffect(() => {
        if (params.get('city') || params.get('from')) {
            fetchCabs();
        }
    }, [location.search]);

    const fetchCabs = async () => {
        setLoading(true);
        try {
            const queryParams = Object.fromEntries(params);
            console.log('Fetching cabs with params:', queryParams);
            const res = await searchCabs(queryParams);
            console.log('Cabs API Response:', res.data);
            setCabs(res.data?.cabs || []);
            if (searching) {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
                setSearching(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        const searchParams = new URLSearchParams();
        searchParams.set('type', activeTab);
        searchParams.set('tripType', tripType);
        searchParams.set('from', searchState.from);
        searchParams.set('to', searchState.to);
        searchParams.set('date', searchState.date);
        searchParams.set('time', searchState.time);
        searchParams.set('city', searchState.from);

        // Persist existing filters if any
        Object.entries(filters).forEach(([k, v]) => {
            if (v) searchParams.set(k, v);
        });

        navigate(`/cabs?${searchParams.toString()}`);
    };

    const handleFilterChange = (newFilters) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        const searchParams = new URLSearchParams(location.search);
        Object.entries(updated).forEach(([k, v]) => {
            if (v) searchParams.set(k, v);
            else searchParams.delete(k);
        });
        navigate(`/cabs?${searchParams.toString()}`);
    };

    const CategoryTab = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-t-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === id
                ? 'bg-white text-blue-600 shadow-[-10px_-10px_20px_rgba(255,255,255,0.05)]'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
        >
            <Icon className={activeTab === id ? 'text-blue-500' : 'text-slate-500'} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[650px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600"
                        className="w-full h-full object-cover"
                        alt="Cab Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-white"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic leading-[0.9]">
                            Premium <span className="text-transparent border-t-2 border-b-2 border-white px-4">Rides</span> <br />
                            <span className="text-blue-500">Everywhere.</span>
                        </h1>
                        <p className="text-slate-200 text-lg font-bold tracking-widest uppercase opacity-80">
                            Professional drivers • 24/7 Support • Best Fares
                        </p>
                    </div>

                    {/* Search Widget Container */}
                    <div className="max-w-5xl mx-auto">
                        <div className="flex">
                            <CategoryTab id="outstation" label="Outstation" icon={FaExchangeAlt} />
                            <CategoryTab id="local" label="Local" icon={FaClock} />
                            <CategoryTab id="airport" label="Airport" icon={FaCar} />
                        </div>

                        <div className="bg-white rounded-b-[40px] rounded-tr-[40px] shadow-2xl p-10 backdrop-blur-xl border border-white/20 relative z-20">
                            <form onSubmit={handleSearch}>
                                {activeTab === 'outstation' && (
                                    <div className="flex gap-6 mb-8 border-b border-slate-100 pb-6">
                                        {['one-way', 'round-trip'].map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="tripType"
                                                    checked={tripType === type}
                                                    onChange={() => setTripType(type)}
                                                    className="hidden"
                                                />
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${tripType === type ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                                                    {tripType === type && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                                <span className={`text-xs font-black uppercase tracking-widest ${tripType === type ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    {type.replace('-', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <div className="relative">
                                        <SearchableDropdown
                                            label="From City"
                                            options={CITIES}
                                            value={searchState.from}
                                            onChange={(val) => setSearchState({ ...searchState, from: val })}
                                            placeholder="Select City"
                                            icon={FaMapMarkerAlt}
                                            iconColor="text-green-500"
                                            required
                                        />
                                    </div>

                                    <div className="relative">
                                        <SearchableDropdown
                                            label="Destination"
                                            options={CITIES}
                                            value={searchState.to}
                                            onChange={(val) => setSearchState({ ...searchState, to: val })}
                                            placeholder="Where to?"
                                            icon={FaMapMarkerAlt}
                                            iconColor="text-red-500"
                                            required={activeTab === 'outstation'}
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pickup Date & Time</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                                <input
                                                    type="date"
                                                    value={searchState.date}
                                                    min={today}
                                                    onChange={(e) => setSearchState({ ...searchState, date: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 min-h-[58px]"
                                                    required
                                                />
                                            </div>
                                            <div className="relative w-32">
                                                <input
                                                    type="time"
                                                    value={searchState.time}
                                                    onChange={(e) => setSearchState({ ...searchState, time: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 min-h-[58px]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-end underline-offset-4">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-slate-900 text-white font-black h-[58px] rounded-2xl shadow-xl shadow-blue-100 uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3"
                                        >
                                            <FaSearch /> Find Cabs
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {(params.get('city') || params.get('from')) && (
                <div ref={resultsRef} className="max-w-7xl mx-auto px-4 py-20">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar Filters */}
                        <div className="w-full lg:w-80 space-y-10">
                            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-10 border border-slate-50 sticky top-24">
                                <h3 className="text-xs font-black text-slate-900 mb-10 flex items-center justify-between uppercase tracking-[0.3em]">
                                    Filters <FaFilter className="text-blue-600" />
                                </h3>

                                <div className="space-y-10">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Car Type</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {['Hatchback', 'Sedan', 'SUV', 'Luxury'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => handleFilterChange({ vehicleType: filters.vehicleType === type ? '' : type })}
                                                    className={`text-left px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${filters.vehicleType === type
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                                        : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Fuel Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Petrol', 'Diesel', 'CNG', 'Electric'].map(fuel => (
                                                <button
                                                    key={fuel}
                                                    onClick={() => handleFilterChange({ fuelType: filters.fuelType === fuel ? '' : fuel })}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${filters.fuelType === fuel
                                                        ? 'bg-slate-900 border-slate-900 text-white'
                                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'
                                                        }`}
                                                >
                                                    {fuel}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Transmission</label>
                                        <div className="flex gap-2">
                                            {['Manual', 'Automatic'].map(trans => (
                                                <button
                                                    key={trans}
                                                    onClick={() => handleFilterChange({ transmission: filters.transmission === trans ? '' : trans })}
                                                    className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${filters.transmission === trans
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                                                        }`}
                                                >
                                                    {trans}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Results */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                                        Available <span className="text-blue-600">Vehicles</span>
                                    </h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Showing {cabs.length} results for {searchState.from}
                                    </p>
                                </div>
                                <select
                                    className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange({ sort: e.target.value })}
                                >
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="space-y-6">
                                    {[1, 2, 3, 4].map(n => (
                                        <div key={n} className="h-48 bg-slate-50 rounded-[40px] animate-pulse"></div>
                                    ))}
                                </div>
                            ) : cabs.length > 0 ? (
                                <div className="space-y-8">
                                    {cabs.map((cab) => (
                                        <div
                                            key={cab._id}
                                            className="group bg-white rounded-[40px] border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col lg:flex-row min-h-[380px]"
                                        >
                                            {/* Car Image Area */}
                                            <div className="w-full lg:w-[480px] bg-slate-50 relative p-12 flex items-center justify-center overflow-hidden border-r border-slate-50">
                                                {/* Background Decorative Text */}
                                                <div className="absolute inset-x-0 top-0 text-[120px] font-black text-slate-100 pointer-events-none select-none uppercase tracking-tighter leading-none -mt-10 opacity-50 italic">
                                                    {cab.vehicleType}
                                                </div>

                                                <img
                                                    src={cab.images?.[0]}
                                                    alt={cab.vehicleName}
                                                    className="w-full h-auto max-h-[220px] object-contain group-hover:scale-110 transition-transform duration-700 relative z-10"
                                                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"; }}
                                                />
                                                <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                                                    {cab.tags?.map(tag => (
                                                        <span key={tag} className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-100">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Summary Stats Overlay (Bottom) */}
                                                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center z-20">
                                                    <div className="flex items-center gap-2">
                                                        <FaStar className="text-yellow-400 text-xs" />
                                                        <span className="text-xs font-black text-slate-900">{cab.rating}</span>
                                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Excellent</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cab.operator}</span>
                                                </div>
                                            </div>

                                            {/* Details Area */}
                                            <div className="flex-1 p-10 flex flex-col">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <h3 className="text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter leading-none mb-4">
                                                            {cab.vehicleName}
                                                        </h3>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Vehicle Category</p>
                                                        <p className="font-bold text-slate-600 text-xs uppercase tracking-widest">{cab.vehicleType} · {cab.transmission} · {cab.fuelType}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Starting From</p>
                                                        <p className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">{formatPrice(cab.basePrice)}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">All Inclusive Fare</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-50 flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm text-xl">
                                                            <FaUserFriends />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Capacity</p>
                                                            <p className="font-black text-slate-900 text-sm uppercase">{cab.capacity} Passengers</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-blue-50/20 p-6 rounded-[32px] border border-blue-100/20 flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 text-xl">
                                                            <FaShieldAlt />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Experience</p>
                                                            <p className="font-black text-blue-600 text-sm uppercase">Secure Pro+</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-10 text-slate-500">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-4">Included in Package</p>
                                                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                                                        {cab.amenities?.map(a => (
                                                            <span key={a} className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                                <FaCheckCircle className="text-green-500" /> {a}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Confirmation</span>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate('/cabs/booking', { state: { cab, searchParams: searchState } })}
                                                        className="bg-slate-900 hover:bg-blue-600 text-white font-black px-12 py-5 rounded-[24px] uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-4 group/btn shadow-2xl hover:shadow-blue-100"
                                                    >
                                                        Select vehicle <FaChevronRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 bg-slate-50 rounded-[60px] border border-dashed border-slate-200">
                                    <FaCar className="text-6xl text-slate-200 mx-auto mb-8" />
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">No Cabs Available</h3>
                                    <p className="text-slate-400 text-sm font-medium mb-10">We couldn't find any cabs matching your current filters in {searchState.from}.</p>
                                    <button
                                        onClick={() => handleFilterChange({ vehicleType: '', fuelType: '', transmission: '' })}
                                        className="bg-white border-2 border-slate-900 text-slate-900 font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Static Content Sections */}
            {!params.get('city') && (
                <div className="space-y-40 py-40">
                    {/* Benefits Section */}
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { title: "Secure Rides", desc: "Background verified professional drivers with 24/7 emergency support.", icon: FaShieldAlt, color: "blue" },
                                { title: "Transparent Pricing", desc: "No hidden charges. What you see is what you pay, including tolls and taxes.", icon: FaRupeeSign, color: "green" },
                                { title: "Quality Fleet", desc: "Regularly sanitized cars with all modern safety and comfort features.", icon: FaCheckCircle, color: "purple" }
                            ].map((item, i) => (
                                <div key={i} className="group p-10 rounded-[40px] hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100">
                                    <div className={`w-16 h-16 rounded-[24px] bg-${item.color}-50 flex items-center justify-center text-3xl text-${item.color}-500 mb-8 group-hover:scale-110 transition-transform`}>
                                        <item.icon />
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">{item.title}</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Routes */}
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-end justify-between mb-16 px-4">
                            <div>
                                <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter italic leading-[0.9]">
                                    Popular <br /> <span className="text-blue-600">Intercity</span> Routes
                                </h2>
                            </div>
                            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] hidden md:block">Top rated corridors</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {POPULAR_ROUTES.map((route, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="relative h-96 rounded-[40px] overflow-hidden mb-6 shadow-xl">
                                        <img src={route.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={route.from} />
                                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white text-2xl font-black uppercase italic tracking-tighter mb-1">
                                                {route.from} <span className="text-blue-400">→</span> {route.to}
                                            </p>
                                            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Starting ₹{route.price}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSearchState({ ...searchState, from: route.from, to: route.to });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="w-full py-4 rounded-2xl border-2 border-slate-100 hover:border-slate-900 font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Explore Cabs
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fleet Carousel Alternative - Grid */}
                    <div className="bg-slate-900 py-32 overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-24">
                                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">Choose Your <span className="text-blue-500">Fleet</span></h2>
                                <p className="text-slate-500 uppercase tracking-[0.4em] text-xs font-black mt-4">A ride for every occasion</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                {[
                                    { type: "Luxury", title: "Business Elite", desc: "Mercedes, BMW & Audi for executive travel.", price: "8000" },
                                    { type: "SUV", title: "Family Travel", desc: "Innova, XUV for comfort & luggage space.", price: "1200" },
                                    { type: "Sedan", title: "Daily Comfort", desc: "Dzire, Honda City for city errands.", price: "450" },
                                    { type: "Hatchback", title: "Pocket Friendly", desc: "Swift, WagonR for budget trips.", price: "350" }
                                ].map((c, i) => (
                                    <div key={i} className="relative group p-10 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500">
                                        <div className="mb-8">
                                            <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">{c.type}</span>
                                            <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter mt-1">{c.title}</h5>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-12">{c.desc}</p>
                                        <p className="text-white font-black text-lg">₹{c.price} <span className="text-slate-600 text-[10px] font-bold">Base Fare</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Cabs;
