import React, { useState, useEffect } from 'react';
import { getPackages } from '../../api/packageApi';
import { FaArrowRight, FaClock } from 'react-icons/fa';

const INTL_TABS = ['Asia', 'Europe', 'Middle East', 'Island', 'Africa', 'Australia'];
const DOM_TABS = ['North India', 'South India', 'East India', 'West India', 'Central India'];

const DestinationTabs = ({ type, onNavigate }) => {
    const isIntl = type === 'international';
    const tabs = isIntl ? INTL_TABS : DOM_TABS;
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Fetch max 4 packages for the selected region
        getPackages({ type, region: activeTab, limit: 4 })
            .then(res => setPackages(res.packages || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [type, activeTab]);

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 pb-2">
                    {isIntl ? 'International Destination' : 'Domestic Destination'}
                </h2>
                <button
                    onClick={() => onNavigate(type, activeTab)}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                        <FaArrowRight />
                    </span>
                    VIEW ALL
                </button>
            </div>

            {/* Desktop Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-8 mb-6 border-b border-gray-100">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 font-bold text-sm uppercase tracking-wide whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-teal-700' : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-md" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                ) : packages.length > 0 ? (
                    packages.map(pkg => (
                        <div
                            key={pkg._id}
                            onClick={() => window.open(`/packages/${pkg._id}`, '_blank')}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100 flex flex-col h-full"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={pkg.images[0] || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800'}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg leading-tight line-clamp-2">
                                    {pkg.title}
                                </h3>
                            </div>

                            <div className="p-4 flex flex-col flex-1 bg-gray-50/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {pkg.duration.days}D & {pkg.duration.nights}N
                                    </span>
                                    <span className="text-xs font-semibold text-gray-500 truncate">
                                        {pkg.destination}
                                    </span>
                                </div>

                                <div className="mt-auto flex items-end justify-between pt-2">
                                    <div>
                                        {pkg.price > pkg.pricePerPerson && (
                                            <p className="text-xs text-gray-400 line-through mb-0.5">₹{pkg.price.toLocaleString()}/-</p>
                                        )}
                                        <p className="text-lg font-black text-gray-900">₹{pkg.pricePerPerson.toLocaleString()}/-</p>
                                    </div>
                                    <button className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-400 font-medium">
                        No packages currently listed for {activeTab}. Please select another region.
                    </div>
                )}
            </div>

            <button
                onClick={() => onNavigate(type, activeTab)}
                className="w-full mt-6 py-3 md:hidden text-sm font-bold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
            >
                View All {activeTab} Packages
            </button>
        </section>
    );
};

export default DestinationTabs;
