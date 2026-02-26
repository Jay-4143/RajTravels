import React from 'react';
import { FaMoon, FaSun, FaBed, FaCamera, FaIdCard, FaUtensils, FaCar, FaCheck, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useGlobal } from '../context/GlobalContext';

const HolidayPackageListItem = ({ pkg, onClick }) => {
    const { formatPrice } = useGlobal();

    // Map boolean features to icons
    const packageFeatures = [
        { key: 'hotel', label: 'Hotel', icon: <FaBed /> },
        { key: 'sightseeing', label: 'Sightseeing', icon: <FaCamera /> },
        { key: 'visaFree', label: 'Visa Free', icon: <FaIdCard /> },
        { key: 'meals', label: 'Meals', icon: <FaUtensils /> },
        { key: 'transfer', label: 'Transfer', icon: <FaCar /> }
    ].filter(feature => pkg.features && pkg.features[feature.key] !== false); // Display if explicitly true or if features obj missing (assume all)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow relative overflow-hidden">

            {/* Left Image Section */}
            <div className="relative w-full md:w-72 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={onClick}>
                <img
                    src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />

                {pkg.featured && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-br-xl shadow-md z-10 flex items-center gap-1">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M472 64H176l-8-24H24v432h144v-48H72V112h80l8 24h312V64zm-144 192v-48h-48v48h-48l72 72 72-72z"></path></svg>
                        Raj Travels Choice
                    </div>
                )}
            </div>

            {/* Middle Content Section */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {(pkg.highlights || ['Beach', 'Family with Kids', 'Visa Free']).slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{tag}</span>
                        ))}
                    </div>

                    {/* Title & Duration */}
                    <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={onClick}>
                        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{pkg.title}</h3>
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 bg-blue-50 px-2.5 py-1 rounded-md">
                            <FaMoon className="text-blue-500 text-xs" /> {pkg.duration?.nights || 4} Nights
                            <span className="text-gray-300 mx-1">|</span>
                            <FaSun className="text-yellow-500 text-xs" /> {pkg.duration?.days || 5} Days
                        </div>
                    </div>

                    {/* Routing (Pattaya -> Bangkok) */}
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                        {pkg.destination} ({pkg.duration?.nights || 4}) <span className="text-gray-400 mx-1">→</span> {pkg.country}
                    </p>

                    {/* Features Icons */}
                    <div className="flex items-center gap-6 mb-4">
                        {packageFeatures.map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 text-gray-500">
                                <div className="text-lg text-gray-600">{f.icon}</div>
                                <span className="text-[10px] font-medium">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Inclusions grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
                        {(pkg.inclusions || ['Coral Island', 'Alcazar Show', 'Golden Buddha', 'Marble Buddha', 'Bangkok City', 'Safari World and Marine Park', 'Airport Pickup & Drop']).slice(0, 7).map((incl, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-teal-600">
                                <FaCheck className="text-[10px] mt-0.5 flex-shrink-0" />
                                <span className="truncate">{incl}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Price Section (Separated by dashed border) */}
            <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between">
                <div>
                    <div className="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1 rounded mb-3">
                        <span className="opacity-70 mr-1">💰</span> Upto 10% Off
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Starting Price</p>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold text-gray-900">{formatPrice(pkg.price)}</span>
                        {pkg.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">{formatPrice(pkg.originalPrice)}</span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <button onClick={onClick} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm">
                        View Details
                    </button>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-blue-600 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 text-xs transition-colors">
                            <FaEnvelope /> Enquire Now
                        </button>
                        <button className="flex-none bg-white border border-green-500 hover:bg-green-50 text-green-500 font-semibold p-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                            <FaWhatsapp className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HolidayPackageListItem;
