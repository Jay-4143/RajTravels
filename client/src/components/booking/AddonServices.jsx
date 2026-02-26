import React, { useState } from 'react';
import { FaUtensils, FaSuitcaseRolling, FaChair, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SeatMap from '../SeatMap';

const MEALS = [
    { id: 'm1', name: 'Paneer Masala in Tortilla wrap', price: 495, icon: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&fit=crop', desc: 'Delicious paneer masala wrapped in a soft tortilla' },
    { id: 'm2', name: 'Chicken masala in tortilla wrap', price: 545, icon: 'https://images.unsplash.com/photo-1626700051175-6518a499db90?w=200&h=200&fit=crop', desc: 'Spicy chicken masala wrapped in a soft tortilla' },
    { id: 'm3', name: 'Masala Dosa with Tomato onio...', price: 595, icon: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop', desc: 'Classic South Indian masala dosa' },
    { id: 'm4', name: 'Jain Hot Meal', price: 645, icon: 'https://img.freepik.com/free-vector/cutlery-symbol-with-plate_1284-43093.jpg?w=200&h=200&fit=crop', desc: 'Pure veg Jain meal served hot' },
    { id: 'm5', name: 'Fruit Platter', price: 395, icon: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=200&h=200&fit=crop', desc: 'Selection of fresh seasonal fruits' },
];

const BAGGAGE = [
    { id: 'b1', name: 'Prepaid excess baggage up to 3KG', price: 1935, icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910015.png', desc: 'Extra 3KG check-in baggage' },
    { id: 'b2', name: 'Prepaid excess baggage up to 5KG', price: 3225, icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910015.png', desc: 'Extra 5KG check-in baggage' },
    { id: 'b3', name: 'Prepaid excess baggage up to 10KG', price: 6450, icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910015.png', desc: 'Extra 10KG check-in baggage' },
    { id: 'b4', name: 'Prepaid excess baggage up to 15KG', price: 9675, icon: 'https://cdn-icons-png.flaticon.com/512/2910/2910015.png', desc: 'Extra 15KG check-in baggage' },
];

const AddonServices = ({
    activeTab,
    setActiveTab,
    selectedMeals,
    onMealSelect,
    selectedBaggage,
    onBaggageSelect,
    flight,
    passengers,
    selectedSeats,
    onSeatSelect,
    isAutoSelect,
    setIsAutoSelect
}) => {
    const tabs = [
        { id: 'meals', name: 'Meals', icon: <FaUtensils /> },
        { id: 'baggage', name: 'Baggage', icon: <FaSuitcaseRolling /> },
        { id: 'seats', name: 'Seat Selection', icon: <FaChair /> },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6">
                <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Addon Services</h2>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all border ${activeTab === tab.id
                                    ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            <span className={activeTab === tab.id ? "text-red-500" : "text-gray-400"}>{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>

                <div className="border-t border-dashed border-gray-200 pt-6">
                    {/* Traveller Selector (Small UI like in image) */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="inline-flex items-center gap-2 p-1.5 px-3 bg-white border border-blue-400 text-blue-600 rounded-lg text-xs font-black uppercase">
                            <FaUser className="w-3 h-3" />
                            Mr SD SD
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="relative">
                        {activeTab === 'meals' && (
                            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                                {MEALS.map(meal => (
                                    <div
                                        key={meal.id}
                                        className={`min-w-[180px] p-4 rounded-2xl border transition-all cursor-pointer group ${selectedMeals.includes(meal.id)
                                                ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20"
                                                : "border-gray-100 hover:border-gray-200 bg-white"
                                            }`}
                                        onClick={() => onMealSelect(meal)}
                                    >
                                        <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50 relative">
                                            <img src={meal.icon} alt={meal.name} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMeals.includes(meal.id) ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
                                                    }`}>
                                                    {selectedMeals.includes(meal.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs font-black text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">₹{meal.price}</p>
                                        <p className="text-[10px] font-bold text-slate-500 leading-tight line-clamp-2">{meal.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'baggage' && (
                            <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar scroll-smooth">
                                {BAGGAGE.map(item => (
                                    <div
                                        key={item.id}
                                        className={`min-w-[180px] p-4 rounded-2xl border transition-all cursor-pointer group ${selectedBaggage.includes(item.id)
                                                ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-500/20"
                                                : "border-gray-100 hover:border-gray-200 bg-white"
                                            }`}
                                        onClick={() => onBaggageSelect(item)}
                                    >
                                        <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-blue-50/50 flex items-center justify-center relative">
                                            <img src={item.icon} alt={item.name} className="w-16 h-16 object-contain opacity-80" />
                                            <div className="absolute top-2 right-2">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBaggage.includes(item.id) ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
                                                    }`}>
                                                    {selectedBaggage.includes(item.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs font-black text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">₹{item.price}</p>
                                        <p className="text-[10px] font-bold text-slate-500 leading-tight line-clamp-2">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'seats' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-base font-black text-slate-800 tracking-tight">{flight.from} → {flight.to}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Friday, 27 Feb 26</p>
                                    </div>
                                </div>
                                <SeatMap
                                    flightId={flight._id}
                                    passengers={passengers}
                                    selectedSeats={selectedSeats}
                                    onSeatSelect={onSeatSelect}
                                    isAutoSelect={isAutoSelect}
                                    setIsAutoSelect={setIsAutoSelect}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddonServices;
