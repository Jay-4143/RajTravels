import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageById, submitPackageInquiry, getPackages } from "../api/packageApi";
import {
    FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaPhoneAlt,
    FaEnvelope, FaCalendarCheck, FaDownload, FaPlane, FaHotel,
    FaCcVisa, FaBinoculars, FaCar, FaUtensils, FaUserFriends,
    FaStar, FaChevronRight, FaMoon, FaSun
} from 'react-icons/fa';
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";
import ModifyHolidaySearchModal from "../components/ModifyHolidaySearchModal";
import HolidayPackageListItem from "../components/HolidayPackageListItem";

const ItineraryTimeline = ({ itinerary }) => {
    return (
        <div className="space-y-4">
            {itinerary.map((day, idx) => (
                <div key={idx} className="flex gap-4 p-4 border rounded-xl bg-white hover:shadow-md transition-shadow">
                    {/* Left: Day Label */}
                    <div className="w-24 flex-shrink-0">
                        <div className="bg-orange-100 text-orange-800 font-bold py-1.5 px-3 rounded-xl text-center text-sm shadow-sm inline-block">
                            Day {day.day}
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="col-span-1 text-gray-500 text-sm flex items-center gap-2 font-medium">
                                <FaSun className="text-yellow-500" /> Morning To Noon
                            </div>
                            <div className="col-span-3 text-gray-800 text-sm font-medium">
                                {day.title || 'Arrival & Explore'}
                            </div>

                            <div className="col-span-1 text-gray-500 text-sm flex items-center gap-2 font-medium">
                                <FaMoon className="text-gray-400" /> Evening
                            </div>
                            <div className="col-span-3 text-gray-700 text-sm">
                                {day.description || 'Overnight stay at the hotel.'}
                                {day.activities && day.activities.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {day.activities.map((act, i) => (
                                            <span key={i} className="text-xs bg-gray-100 border text-gray-600 px-2 py-1 rounded">
                                                {act}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const PackageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [activeTab, setActiveTab] = useState('overview');
    const [promoCode, setPromoCode] = useState('EARLYBIRDOFFER');
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [showModifySearch, setShowModifySearch] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [searchQuery, setSearchQuery] = useState({ destination: '', date: '' });
    const { formatPrice } = useGlobal();

    // Derived Financials for the summary widget
    const basePrice = pkg ? pkg.price : 0;
    const discountAmount = promoCode ? 14000 : 0; // Simulated flat discount
    const priceAfterDiscount = basePrice - discountAmount;
    const gstAmount = Math.round(priceAfterDiscount * 0.05);
    const totalAmount = priceAfterDiscount + gstAmount;
    const tcsAmount = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + tcsAmount;

    // Inquiry Form State
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [inquiryData, setInquiryData] = useState({
        name: '', email: '', phone: '', travelDate: '', numberOfPeople: 2, message: ''
    });
    const [inquiryStatus, setInquiryStatus] = useState('idle'); // idle, submitting, success, error

    const handleInquiryChange = (e) => setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setInquiryStatus('submitting');
        try {
            const res = await submitPackageInquiry(id, inquiryData);
            if (res.success) {
                setInquiryStatus('success');
            } else {
                setInquiryStatus('error');
            }
        } catch (error) {
            setInquiryStatus('error');
        }
    };

    const handleModifySearch = async ({ destination, date }) => {
        setSearchQuery({ destination, date });
        setSearchResults(null);
        try {
            const res = await getPackages({ destination });
            if (res.success) {
                setSearchResults(res.packages || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getPackageById(id)
            .then((res) => {
                if (res.success) setPkg(res.package);
                else setError("Package not found");
            })
            .catch((err) => setError("Failed to load package details"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    if (error || !pkg) return <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">{error || "Package not found"}</div>;

    return (
        <div className="min-h-screen bg-[#f3f6f9] pb-12 font-sans text-gray-800">

            {/* Breadcrumb Area */}
            <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
                <span>Home</span> <FaChevronRight className="text-xs" />
                <span>{pkg.type === 'international' ? 'International' : 'Domestic'} Tour Packages</span> <FaChevronRight className="text-xs" />
                <span>{pkg.country || pkg.destination} Tour Packages</span> <FaChevronRight className="text-xs" />
                <span className="font-semibold text-gray-800">{pkg.title}</span>
            </div>

            <div className="max-w-7xl mx-auto px-4">

                {/* ── HEADER CARD ──────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 flex flex-col lg:flex-row justify-between relative overflow-hidden">
                    {/* Left details */}
                    <div className="flex-1 pr-6 border-r border-gray-100 border-dashed hidden lg:block">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['Group Fixed Departures', 'Raj Travels Choice', 'Family with Kids', 'All Inclusive'].map(tag => (
                                <span key={tag} className="bg-gray-50 border border-gray-200 text-gray-600 text-[11px] px-3 py-1.5 rounded-md font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title & Duration */}
                        <div className="flex items-center gap-4 mb-5">
                            <h1 className="text-2xl font-bold text-gray-900">{pkg.title}</h1>
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                <span>1 Country</span>
                                <span>{pkg.itinerary?.length || 5} Cities</span>
                                <span className="flex items-center gap-1.5"><FaMoon className="text-blue-500" /> {pkg.duration.nights} Nights</span>
                                <span className="flex items-center gap-1.5"><FaSun className="text-orange-500" /> {pkg.duration.days} Days</span>
                            </div>
                        </div>

                        {/* Amenities Icons */}
                        <div className="flex gap-6 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                            <div className="flex items-center gap-2"><FaPlane className="text-lg text-gray-400" /> Flight</div>
                            <div className="flex items-center gap-2"><FaHotel className="text-lg text-gray-400" /> Hotel</div>
                            <div className="flex items-center gap-2"><FaCcVisa className="text-lg text-gray-400" /> Visa</div>
                            <div className="flex items-center gap-2"><FaBinoculars className="text-lg text-gray-400" /> Sightseeing</div>
                            <div className="flex items-center gap-2"><FaCar className="text-lg text-gray-400" /> Transfer</div>
                            <div className="flex items-center gap-2"><FaUtensils className="text-lg text-gray-400" /> Meals</div>
                        </div>
                    </div>

                    {/* Right Price (Desktop) & Mobile Unified Header */}
                    <div className="lg:w-80 lg:pl-8 flex flex-col justify-center">
                        <div className="lg:hidden mb-4">
                            <h1 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                                <span className="flex items-center gap-1.5"><FaMoon className="text-blue-500" /> {pkg.duration.nights} N</span>
                                <span className="flex items-center gap-1.5"><FaSun className="text-orange-500" /> {pkg.duration.days} D</span>
                            </div>
                        </div>

                        <div className="inline-block bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-lg text-sm font-bold w-max mb-4">
                            💰 Upto ₹10000 OFF
                        </div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Starting Price</p>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-3xl font-extrabold text-gray-900">{formatPrice(basePrice)}</span>
                            <span className="text-sm text-gray-400 line-through">{formatPrice(basePrice + 10000)}</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowInquiryModal(true)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg shadow-md transition-colors"
                            >
                                Book Now
                            </button>
                            <button
                                onClick={() => setShowInquiryModal(true)}
                                className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-lg hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaEnvelope className="text-blue-600" /> Enquire Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── SELECTION BAR ────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full md:w-auto flex-1">
                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> From City</p>
                            <p className="font-bold text-gray-900 text-[15px]">{searchQuery.destination || pkg.destination || 'Mumbai'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Price Category</p>
                            <p className="font-bold text-gray-900 text-[15px]">Standard</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Rooms & Guests</p>
                            <p className="font-bold text-gray-900 text-[15px]">01 <span className="text-xs text-gray-500 font-normal">Room</span> , 2 <span className="text-xs text-gray-500 font-normal">Guests</span></p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tour Date</p>
                            <p className="font-bold text-gray-900 text-[15px]">{searchQuery.date || '13 Mar 26'} <span className="text-xs text-gray-400 font-normal"></span></p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModifySearch(true)}
                        className="w-full md:w-auto px-8 py-2.5 border border-red-200 text-red-500 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Modify Search
                    </button>
                </div>

                {searchResults ? (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {searchResults.length} Packages found for {searchQuery.destination}
                            </h2>
                            <button
                                onClick={() => setSearchResults(null)}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Back to {pkg.title}
                            </button>
                        </div>
                        <div className="space-y-4">
                            {searchResults.length > 0 ? (
                                searchResults.map(p => (
                                    <HolidayPackageListItem
                                        key={p._id}
                                        pkg={p}
                                        onClick={() => {
                                            setSearchResults(null);
                                            navigate(`/packages/${p._id}`);
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-600 mb-2">No Packages Found</h3>
                                    <p className="text-gray-500">Try modifying your search criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* LEFT COLUMN: Hero & Details */}
                        <div className="flex-1">

                            {/* Hero Image Slider */}
                            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-sm group">
                                <img
                                    src={pkg.images?.[currentImageIdx] || pkg.images?.[0] || 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200'}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />

                                {/* Navigation Arrows */}
                                {pkg.images && pkg.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIdx(prev => (prev === 0 ? pkg.images.length - 1 : prev - 1))}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaChevronRight className="rotate-180" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIdx(prev => (prev === pkg.images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaChevronRight />
                                        </button>

                                        {/* Indicators */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {pkg.images.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setCurrentImageIdx(idx)}
                                                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentImageIdx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold px-4 py-2 rounded-lg shadow pointer-events-none">
                                    {currentImageIdx + 1} / {pkg.images?.length || 1} Photos
                                </div>
                            </div>

                            {/* Scroll-Spy Tabs */}
                            <div className="bg-white rounded-t-xl border-b border-gray-200 flex overflow-x-auto no-scrollbar sticky top-0 z-10 shadow-sm">
                                {['Overview', 'Itinerary', 'Accommodation', 'Inclusion and Exclusion'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-blue-500'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Details Content Area */}
                            <div className="bg-white p-6 rounded-b-xl shadow-sm mb-6 min-h-[400px]">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-gray-800">Experience the Magic</h3>
                                        <p className="text-gray-600 leading-relaxed text-[15px]">
                                            Embark on a journey to {pkg.destination}, a mesmerizing blend of culture, history, and stunning landscapes.
                                            This completely curated {pkg.duration.days}-day tour is designed to give you the ultimate balance of guided sightseeing and free time to explore the vibrant wonders of {pkg.country} on your own terms.
                                        </p>
                                        <h4 className="font-bold text-gray-800 mt-6 mb-3">Highlights Include:</h4>
                                        <ul className="list-inside grid grid-cols-1 md:grid-cols-2 gap-3 text-[15px] text-gray-600">
                                            {(pkg.highlights || ['City Tours', 'Guided Monuments Visit', 'Local Cuisine Tasting', 'Airport Transfers']).map((h, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'itinerary' && (
                                    <div className="space-y-6">
                                        <ItineraryTimeline itinerary={pkg.itinerary || []} />
                                    </div>
                                )}

                                {activeTab === 'accommodation' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Hotels Envisaged</h3>
                                        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300" className="w-full h-full object-cover" alt="Hotel" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">Premium Hotel {pkg.destination} <span className="text-yellow-400 text-sm">★★★★</span></h4>
                                                <p className="text-sm text-gray-500 mb-2">Standard Room • Bed & Breakfast</p>
                                                <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-1 rounded">Stay for {pkg.duration.nights} Nights</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'inclusion and exclusion' && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                                            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                                <FaCheck className="bg-green-100 p-1 rounded-full w-6 h-6" /> Inclusions
                                            </h3>
                                            <ul className="space-y-3">
                                                {(pkg.inclusions || ['Accommodation', 'Meals as indicated', 'Transfers']).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[15px] text-gray-700">
                                                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
                                            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                                                <FaTimes className="bg-red-100 p-1 rounded-full w-6 h-6" /> Exclusions
                                            </h3>
                                            <ul className="space-y-3">
                                                {(pkg.exclusions || ['Personal Expenses', 'Flight Tickets (unless specified)', 'Travel Insurance']).map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[15px] text-gray-700">
                                                        <span className="text-red-500 mt-1 flex-shrink-0">✕</span> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Side Widgets */}
                        <div className="lg:w-[350px] space-y-6">

                            {/* Package Highlights Widget */}
                            <div className="bg-[#fff8f0] border border-orange-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                                <div className="bg-orange-500 text-white font-bold text-sm px-4 py-1.5 rounded-full inline-block mb-5 shadow-sm relative z-10">
                                    Package Highlights
                                </div>
                                <ul className="space-y-3 relative z-10 mb-6">
                                    {(pkg.highlights || ['Paris', 'Eiffel Tower', 'vendôme', 'Place de Opera Garnier']).map((h, i) => (
                                        <li key={i} className="flex items-center gap-2 text-[15px] text-gray-800 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {h}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg text-sm hover:bg-gray-50 relative z-10">
                                    View All
                                </button>
                                {/* Decorative palm trees vector */}
                                <div className="absolute -bottom-6 -right-6 opacity-40 mix-blend-multiply w-48 h-48 pointer-events-none"
                                    style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/palm-trees-silhouettes_02_1150-1845.jpg?size=338&ext=jpg)', backgroundSize: 'contain' }} />
                            </div>

                            {/* Fare Summary Widget */}
                            <div className="bg-white border text-sm font-sans rounded-2xl p-6 shadow-sm border-gray-100">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                    <h3 className="font-bold text-lg text-gray-800">Fare Summary</h3>
                                    <span className="text-blue-500 font-medium cursor-pointer hover:underline text-xs">2 Guests</span>
                                </div>

                                <div className="space-y-4 text-gray-600 mb-6 border-b border-gray-100 pb-6">
                                    <div className="flex justify-between items-center group">
                                        <div className="flex items-center gap-1.5 font-medium cursor-pointer text-gray-800">
                                            <span className="text-gray-400 border border-gray-300 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">+</span>
                                            Package Cost
                                        </div>
                                        <span className="font-bold text-gray-800">{formatPrice(basePrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-5">
                                        <span>Discount (EARLYBIRDOFFER)</span>
                                        <span>{formatPrice(discountAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-5 font-medium text-gray-800">
                                        <span>Package Cost After Discount</span>
                                        <span>{formatPrice(priceAfterDiscount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-5">
                                        <span>GST (5 %)</span>
                                        <span>{formatPrice(gstAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-5 font-medium text-gray-800">
                                        <span>Total Amount</span>
                                        <span>{formatPrice(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pl-5">
                                        <span className="flex items-center gap-1">TCS (5 %) <span className="bg-blue-600 text-white text-[9px] px-1 rounded">Claimable</span></span>
                                        <span>{formatPrice(tcsAmount)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-green-600 font-bold mb-6">
                                    <span className="flex items-center gap-1">✅ Discount Applied</span>
                                    <span>{formatPrice(discountAmount)}</span>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center mb-4 border border-gray-100">
                                    <span className="text-gray-600 font-semibold">Grand Total</span>
                                    <span className="text-2xl font-extrabold text-gray-900">{formatPrice(grandTotal)}</span>
                                </div>
                            </div>

                            {/* Promo Code Widget */}
                            <div className="bg-white border rounded-2xl p-6 shadow-sm border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-br from-green-300 to-green-100 opacity-50 z-0"></div>

                                <h3 className="font-bold text-gray-800 mb-4 relative z-10">Promo Code</h3>

                                <div className="border border-green-400 bg-green-50 rounded-lg p-3 flex justify-between items-center mb-4 relative z-10">
                                    <span className="text-green-700 font-bold text-sm tracking-wide flex items-center gap-2">
                                        ✅ EARLYBIRDOFFER
                                    </span>
                                    <button className="text-gray-500 font-medium text-xs border border-gray-300 rounded px-3 py-1 bg-white hover:bg-gray-50">Clear</button>
                                </div>

                                <p className="text-gray-600 text-xs leading-relaxed mb-6 font-medium relative z-10">
                                    Congratulations! Promo code <br />
                                    EARLYBIRDOFFER has been applied, saving <br />
                                    you {formatPrice(14000)}
                                </p>

                                <h4 className="font-bold text-gray-800 mb-3 text-sm relative z-10">Choose from the offers below</h4>

                                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 relative z-10 cursor-pointer hover:border-blue-300 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border-4 border-blue-600 bg-white"></div>
                                            <span className="font-bold text-gray-800 text-sm tracking-wide">EARLYBIRDOFFER</span>
                                        </div>
                                        <span className="text-green-600 font-bold text-sm">Save {formatPrice(14000)}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs ml-6 leading-relaxed">Book now & save! Limited seats only - T&C Apply</p>
                                </div>

                            </div>

                        </div>
                    </div>
                )}

            </div>

            {/* Mobile Sticky Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center md:hidden z-40 shadow-2xl">
                <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="font-extrabold text-xl font-sans">{formatPrice(basePrice)}</p>
                </div>
                <button
                    onClick={() => setShowInquiryModal(true)}
                    className="bg-red-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow"
                >
                    Book Now
                </button>
            </div>

            {/* INQUIRY MODAL */}
            {showInquiryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
                        <button
                            onClick={() => { setShowInquiryModal(false); setInquiryStatus('idle'); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="bg-blue-600 p-6 text-white text-center">
                            <h2 className="text-2xl font-bold mb-1">Send Inquiry</h2>
                            <p className="text-blue-100 text-sm">{pkg.title}</p>
                        </div>

                        <div className="p-6">
                            {inquiryStatus === 'success' ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Request Sent!</h3>
                                    <p className="text-gray-600 mb-6 text-sm">Our travel expert will contact you shortly to confirm your booking.</p>
                                    <button
                                        onClick={() => generateTicket({
                                            ...pkg, ...inquiryData, bookingReference: `PKG-INQ-${Math.floor(1000 + Math.random() * 9000)}`
                                        }, 'package')}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        <FaDownload /> Download Quote
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input type="text" name="name" required value={inquiryData.name} onChange={handleInquiryChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Details</label>
                                        <input type="email" name="email" required value={inquiryData.email} onChange={handleInquiryChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" name="phone" required value={inquiryData.phone} onChange={handleInquiryChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                                            <input type="date" name="travelDate" required value={inquiryData.travelDate} onChange={handleInquiryChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                                            <input type="number" name="numberOfPeople" min="1" required value={inquiryData.numberOfPeople} onChange={handleInquiryChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                        <textarea name="message" rows="2" value={inquiryData.message} onChange={handleInquiryChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Any specific requests?"></textarea>
                                    </div>
                                    <button type="submit" disabled={inquiryStatus === 'submitting'} className="w-full bg-red-500 text-white font-bold py-3 mt-2 rounded-lg hover:bg-red-600 transition shadow disabled:opacity-70">
                                        {inquiryStatus === 'submitting' ? 'Sending Request...' : 'Submit Request'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODIFY SEARCH MODAL */}
            <ModifyHolidaySearchModal
                isOpen={showModifySearch}
                onClose={() => setShowModifySearch(false)}
                onSearch={handleModifySearch}
                currentDestination={pkg.destination || pkg.country}
            />

        </div>
    );
};

export default PackageDetails;
