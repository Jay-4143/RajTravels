import React from 'react';
import { FaWallet, FaRupeeSign, FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Wallet = () => {
    const transactions = [
        { id: 'TXN789', type: 'Credit', amount: '₹5,000', date: '10 Feb 2026', source: 'Razorpay Topup' },
        { id: 'TXN456', type: 'Debit', amount: '₹1,200', date: '12 Feb 2026', source: 'Flight Booking MB123' },
        { id: 'TXN123', type: 'Credit', amount: '₹200', date: '15 Feb 2026', source: 'Cashback' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar / Stats */}
                    <div className="w-full md:w-80 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-100 border border-blue-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-10"></div>
                            <div className="relative">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Balance</p>
                                <h2 className="text-4xl font-black text-slate-800 flex items-center gap-1">
                                    <FaRupeeSign className="text-3xl" /> 4,000
                                </h2>
                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                                        Top Up
                                    </button>
                                    <button className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-slate-100 transition-colors">
                                        Transfer
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Points Summary</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-600">Points to Expire</span>
                                    <span className="text-sm font-black text-red-500">250</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-600">Lifetime Earned</span>
                                    <span className="text-sm font-black text-slate-900">12,450</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                <FaHistory className="text-blue-500" /> Activity History
                            </h3>
                            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {transactions.map(txn => (
                                <div key={txn.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'Credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {txn.type === 'Credit' ? <FaArrowDown className="text-xs" /> : <FaArrowUp className="text-xs" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800">{txn.source}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{txn.date} • {txn.id}</p>
                                    </div>
                                    <div className={`text-sm font-black ${txn.type === 'Credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                        {txn.type === 'Credit' ? '+' : '-'}{txn.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Wallet;
