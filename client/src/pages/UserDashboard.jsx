import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    FaSuitcase, FaTicketAlt, FaTimesCircle, FaRupeeSign,
    FaUser, FaWallet, FaUsers, FaHeadset, FaSearch,
    FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';

const FEATURE_CARDS = [
    { title: "Upcoming Trips", icon: FaSuitcase, color: "bg-orange-500", path: "/dashboard/upcoming" },
    { title: "My Bookings", icon: FaTicketAlt, color: "bg-purple-500", path: "/my-bookings" },
    { title: "View Cancellations", icon: FaTimesCircle, color: "bg-blue-500", path: "/dashboard/cancellations" },
    { title: "Make Payment", icon: FaRupeeSign, color: "bg-teal-500", path: "/payment" },
    { title: "My Profile", icon: FaUser, color: "bg-amber-500", path: "/profile" },
    { title: "My Wallet Balance", icon: FaWallet, color: "bg-green-500", path: "/dashboard/wallet" },
    { title: "Travellers", icon: FaUsers, color: "bg-orange-400", path: "/dashboard/travellers" },
    { title: "Support", icon: FaHeadset, color: "bg-pink-500", path: "/support" },
];

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [refNumber, setRefNumber] = useState("");

    const FeatureCard = ({ title, icon: Icon, color, path }) => (
        <Link
            to={path}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all group"
        >
            <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-700 text-center">{title}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Banner & Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
                    <img src="https://illustrations.popsy.co/amber/man-on-vacation.svg" alt="skyline" className="h-40" />
                </div>
                <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">View Your recent orders and manage your bookings.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Profile & Upcoming Trips */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-8 text-center flex flex-col items-center">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-4xl font-black mb-4 border-4 border-white shadow-inner">
                                {user?.name?.charAt(0) || 'H'}
                            </div>
                            <h2 className="text-xl font-black text-slate-800 leading-tight">. {user?.name || 'Hardik Shah'}</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">{user?.email || 'hardikshah.3452@gmail.com'}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{user?.phone || '9428061875'}</p>
                        </div>

                        {/* No Upcoming Trips Placeholder */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <FaSuitcase className="w-8 h-8 text-slate-200" />
                            </div>
                            <h3 className="text-lg font-black text-slate-700 mb-2">No Upcoming Trips</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                When you book a trip, you will see your itinerary here.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Features Grid & Quick Search */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* 8 Feature Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {FEATURE_CARDS.map(card => (
                                <FeatureCard key={card.title} {...card} />
                            ))}
                        </div>

                        {/* Quick Search & Wallet Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Quick Search */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Quick Search</h3>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="AT - Enter reference number"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                                            value={refNumber}
                                            onChange={(e) => setRefNumber(e.target.value)}
                                        />
                                    </div>
                                    <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-100">
                                        Get Itinerary
                                    </button>
                                </div>
                            </div>

                            {/* Wallet Info */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center overflow-hidden">
                                <div className="w-24 h-full bg-slate-50 flex items-center justify-center border-r border-slate-100">
                                    <span className="text-blue-600 font-black text-xs tracking-tighter">ATWALLET</span>
                                </div>
                                <div className="p-6 flex-1">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Available Balance Points: <span className="text-slate-900 font-black">0</span></p>
                                    <p className="text-[10px] text-red-500 font-medium mt-1">*Terms & Conditions</p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info Banner */}
                        <div className="bg-blue-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-xl shadow-blue-100">
                            <div>
                                <h4 className="font-black text-lg">Download Raj Travel App</h4>
                                <p className="text-blue-100 text-sm">Book flights, hotels & more on the go!</p>
                            </div>
                            <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                                Get App
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
