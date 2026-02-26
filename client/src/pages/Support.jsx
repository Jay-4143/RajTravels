import React from 'react';
import { FaHeadset, FaSearch, FaRegQuestionCircle, FaComments, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Support = () => {
    const categories = [
        { title: 'Bookings', desc: 'Manage, cancel or change your travel plans.', count: 45 },
        { title: 'Refunds', desc: 'Check status and policies for your bookings.', count: 12 },
        { title: 'Payments', desc: 'Secure payments, wallets and point queries.', count: 28 },
        { title: 'Account', desc: 'Login, password and profile settings help.', count: 15 }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-blue-600 py-20 px-4 text-center text-white">
                <h1 className="text-3xl font-black mb-4">How can we help you?</h1>
                <div className="max-w-2xl mx-auto relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-300 group-focus-within:text-blue-600" />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        className="w-full bg-blue-500/30 border border-blue-400/30 rounded-full py-5 pl-14 pr-8 text-lg font-bold placeholder:text-blue-200 outline-none focus:bg-white focus:text-slate-800 focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-10 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map(cat => (
                        <div key={cat.title} className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FaRegQuestionCircle className="text-xl" />
                            </div>
                            <h3 className="text-base font-black text-slate-800">{cat.title}</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{cat.desc}</p>
                            <span className="inline-block mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">{cat.count} Articles</span>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-xl font-black text-slate-800 mb-6">Popular FAQs</h2>
                        {[
                            "How do I cancel my booking?",
                            "When will I receive my refund?",
                            "How to use Raj Travel Wallet points?",
                            "Can I change my passenger details after booking?"
                        ].map((q, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-200">
                                <span className="text-sm font-bold text-slate-700">{q}</span>
                                <FaSearch className="text-slate-200 w-3" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600 rounded-full opacity-20"></div>
                        <h3 className="text-lg font-black mb-6 relative z-10">Direct Contact</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><FaPhoneAlt /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Care</p>
                                    <p className="text-sm font-black">+91 1800 123 4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><FaEnvelope /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Support</p>
                                    <p className="text-sm font-black">support@rajtravel.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><FaComments /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Chat</p>
                                    <p className="text-sm font-black">Available 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
