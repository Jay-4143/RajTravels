import React from 'react';
import { FaTimesCircle, FaUndo } from 'react-icons/fa';

const Cancellations = () => {
    const cancelled = [
        { id: 'CAN102', service: 'Flight', route: 'Goa to Mumbai', date: '15 Jan 2026', amount: '₹4,500', refundStatus: 'Processed' },
        { id: 'CAN105', service: 'Hotel', route: 'Holiday Inn, Goa', date: '20 Jan 2026', amount: '₹8,200', refundStatus: 'In Progress' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <FaTimesCircle className="text-red-500" /> Cancelled Bookings
                </h1>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Refund Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Refund Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {cancelled.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-600">{item.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{item.service}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800">{item.route}</p>
                                        <p className="text-[11px] text-slate-400">{item.date}</p>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-800 text-sm">{item.amount}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.refundStatus === 'Processed' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                            <span className="text-xs font-bold text-slate-600">{item.refundStatus}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center gap-4">
                    <FaUndo className="text-blue-500 text-xl" />
                    <div>
                        <h4 className="text-sm font-black text-blue-900">Need help with a refund?</h4>
                        <p className="text-blue-700 text-xs mt-1">Refunds are typically processed within 5-7 business days of cancellation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cancellations;
