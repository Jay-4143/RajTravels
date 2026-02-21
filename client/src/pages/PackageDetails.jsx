import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageById, submitPackageInquiry } from "../api/packageApi";
import { FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaPhoneAlt, FaEnvelope, FaCalendarCheck, FaDownload } from 'react-icons/fa';
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";

const PackageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('itinerary');
    const { formatPrice } = useGlobal();

    // Inquiry Form State
    const [inquiryData, setInquiryData] = useState({
        name: '',
        email: '',
        phone: '',
        travelDate: '',
        numberOfPeople: 2,
        message: ''
    });
    const [inquiryStatus, setInquiryStatus] = useState('idle'); // idle, submitting, success, error

    useEffect(() => {
        getPackageById(id)
            .then((res) => {
                if (res.success) setPkg(res.package);
                else setError("Package not found");
            })
            .catch((err) => setError("Failed to load package details"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleInquiryChange = (e) => {
        setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
    };

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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !pkg) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || "Package not found"}</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero Header */}
            <div className="relative h-[55vh] min-h-[360px] bg-gray-900">
                <img
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'}
                    alt={pkg.title}
                    className="w-full h-full object-cover object-center"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80'; }}
                />
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-16">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block shadow-lg">
                        {pkg.type} Package
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-xl leading-tight max-w-3xl">
                        {pkg.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-white text-sm">
                        <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <FaMapMarkerAlt className="text-red-400" /> {pkg.destination}, {pkg.country}
                        </span>
                        <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <FaClock className="text-yellow-400" /> {pkg.duration.days} Days / {pkg.duration.nights} Nights
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Content - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex border-b mb-6">
                            <button
                                onClick={() => setActiveTab('itinerary')}
                                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'itinerary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Itinerary
                            </button>
                            <button
                                onClick={() => setActiveTab('inclusions')}
                                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'inclusions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Inclusions
                            </button>
                        </div>

                        {activeTab === 'itinerary' && (
                            <div className="space-y-6">
                                {pkg.itinerary.map((day) => (
                                    <div key={day.day} className="border-l-4 border-blue-200 pl-6 relative">
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Day {day.day}: {day.title}</h3>
                                        <p className="text-gray-600 mb-3">{day.description}</p>
                                        {day.activities && day.activities.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {day.activities.map((act, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        {act}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'inclusions' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                        <FaCheck className="bg-green-100 p-1 rounded-full w-6 h-6" /> What's Included
                                    </h3>
                                    <ul className="space-y-2">
                                        {pkg.inclusions.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                                <span className="text-green-500 mt-1">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                                        <FaTimes className="bg-red-100 p-1 rounded-full w-6 h-6" /> What's Excluded
                                    </h3>
                                    <ul className="space-y-2">
                                        {pkg.exclusions.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                                <span className="text-red-500 mt-1">✕</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Booking Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm">Starting from</p>
                            <div className="text-4xl font-bold text-blue-600">{formatPrice(pkg.price)}</div>
                            <p className="text-gray-400 text-xs">per person</p>
                        </div>

                        {inquiryStatus === 'success' ? (
                            <div className="bg-green-50 text-green-800 p-6 rounded-lg text-center">
                                <div className="w-16 h-16 bg-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCheck className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Inquiry Sent!</h3>
                                <p className="text-sm">Our travel expert will contact you shortly.</p>
                                <button
                                    onClick={() => generateTicket({
                                        ...pkg,
                                        ...inquiryData,
                                        bookingReference: `PKG-INQ-${Math.floor(1000 + Math.random() * 9000)}`
                                    }, 'package')}
                                    className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FaDownload /> Download Itinerary
                                </button>
                                <button
                                    onClick={() => setInquiryStatus('idle')}
                                    className="mt-4 text-green-700 underline text-sm block mx-auto"
                                >
                                    Send another inquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <h3 className="font-bold text-lg border-b pb-2 mb-4">Book this Package</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={inquiryData.name}
                                            onChange={handleInquiryChange}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="John Doe"
                                        />
                                        <div className="absolute left-3 top-2.5 text-gray-400">
                                            <span className="block w-4 h-4 bg-gray-400 rounded-full opacity-0"></span> {/* Placeholder icon space */}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={inquiryData.email}
                                            onChange={handleInquiryChange}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <div className="relative">
                                        <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={inquiryData.phone}
                                            onChange={handleInquiryChange}
                                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                                        <input
                                            type="date"
                                            name="travelDate"
                                            value={inquiryData.travelDate}
                                            onChange={handleInquiryChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Travelers</label>
                                        <input
                                            type="number"
                                            name="numberOfPeople"
                                            min="1"
                                            value={inquiryData.numberOfPeople}
                                            onChange={handleInquiryChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        rows="3"
                                        value={inquiryData.message}
                                        onChange={handleInquiryChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Any specific requests?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={inquiryStatus === 'submitting'}
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-70"
                                >
                                    {inquiryStatus === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 pt-6 border-t text-center">
                            <p className="text-sm text-gray-500 mb-2">Need help? Call our experts</p>
                            <a href="tel:+9118001234567" className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                                <FaPhoneAlt className="text-blue-600" /> 1800-123-4567
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
