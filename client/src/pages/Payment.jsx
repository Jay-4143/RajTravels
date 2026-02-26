import React, { useState } from 'react';
import {
    FaShieldAlt, FaLock, FaCheckCircle, FaQrcode,
    FaCreditCard, FaUniversity, FaWallet, FaMobileAlt,
    FaExclamationCircle
} from 'react-icons/fa';
import { SiGooglepay, SiPhonepe } from 'react-icons/si';

const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI', icon: FaMobileAlt },
    { id: 'credit', label: 'Credit Card', icon: FaCreditCard },
    { id: 'amex', label: 'AMEX', icon: FaCreditCard },
    { id: 'debit', label: 'Debit Card', icon: FaCreditCard },
    { id: 'netbanking', label: 'Net Banking', icon: FaUniversity },
    { id: 'emi', label: 'Credit Card EMI', icon: FaCreditCard },
    { id: 'wallet', label: 'Wallet', icon: FaWallet },
    { id: 'phonepe', label: 'Phonepe', icon: SiPhonepe },
    { id: 'googlepay', label: 'Google Pay', icon: SiGooglepay },
];

const Payment = () => {
    const [activeMethod, setActiveMethod] = useState('upi');
    const [formData, setFormData] = useState({
        service: 'Flight',
        refNo: '',
        fare: '',
        email: 'hardikshah.3452@gmail.com',
        phone: '9428061875',
        vpa: ''
    });

    const SectionHeader = ({ title }) => (
        <div className="bg-slate-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-4 bg-red-500 rounded-full"></div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</h3>
        </div>
    );

    const TrustBadge = ({ icon: Icon, title, desc }) => (
        <div className="flex gap-4 p-4 items-start group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-red-500" />
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-800">{title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Form & Payment */}
                <div className="lg:col-span-9 space-y-6">

                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <SectionHeader title="Payment Details" />
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service</label>
                                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Service</option>
                                    <option>Flight</option>
                                    <option>Hotel</option>
                                    <option>Cab</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TG - Reference No</label>
                                <input type="text" placeholder="TG - Reference No" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Fare</label>
                                <input type="text" placeholder="Net Fare" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <SectionHeader title="Contact Details" />
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                                <input type="email" value={formData.email} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <div className="flex gap-2">
                                    <div className="w-20 px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                                        <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-5 h-3.5 object-cover rounded-sm" />
                                        <span className="text-sm font-bold text-slate-700">+91</span>
                                    </div>
                                    <input type="text" value={formData.phone} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Make Payment Detailed Section */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">Make Payment</h2>
                        </div>

                        <div className="flex flex-col md:flex-row">
                            {/* Left Sidebar: Methods */}
                            <div className="w-full md:w-56 bg-slate-50 border-r border-slate-100 flex flex-col">
                                {PAYMENT_METHODS.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setActiveMethod(m.id)}
                                        className={`flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all border-l-4 ${activeMethod === m.id
                                            ? 'bg-white border-blue-500 text-blue-600 shadow-sm'
                                            : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        <m.icon className="w-4 h-4" />
                                        {m.label}
                                    </button>
                                ))}
                            </div>

                            {/* Right Content */}
                            <div className="flex-1 p-10 min-h-[400px]">
                                {activeMethod === 'upi' ? (
                                    <div className="max-w-md mx-auto space-y-8">
                                        <div className="flex flex-col md:flex-row items-center gap-10">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-slate-800 mb-2">Scan & Pay with UPI App</h4>
                                                <ol className="text-xs text-slate-500 space-y-2 list-none marker:text-slate-300">
                                                    <li className="flex gap-2 font-medium"><span className="text-blue-500 font-bold">1.</span> Open any UPI or banking app on your phone</li>
                                                    <li className="flex gap-2 font-medium"><span className="text-blue-500 font-bold">2.</span> Scan the QR code to pay</li>
                                                </ol>
                                                <div className="flex gap-3 mt-6">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4 grayscale" />
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-4 opacity-30" />
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <div className="w-32 h-32 bg-slate-50 border-2 border-slate-100 rounded-xl flex items-center justify-center p-2 group-hover:border-blue-200 transition-colors">
                                                    <FaQrcode className="w-full h-full text-slate-300" />
                                                </div>
                                                <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-gray-200 text-[10px] font-black text-slate-800 shadow-sm hover:shadow-md transition-all">
                                                    View
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-6 border-t border-slate-50">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Virtual payment address</label>
                                            <input type="text" placeholder="Virtual payment address" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                        <FaExclamationCircle className="w-16 h-16 mb-4 opacity-10" />
                                        <p className="text-sm font-bold">{PAYMENT_METHODS.find(m => m.id === activeMethod)?.label} is coming soon!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Summary */}
                        <div className="p-6 bg-slate-50 flex items-center justify-end gap-10">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total payable amount</p>
                                <p className="text-2xl font-black text-slate-900 mt-1">₹0.00</p>
                            </div>
                            <button className="bg-red-500 text-white px-10 py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-red-600 transition-colors shadow-xl shadow-red-100">
                                Make Payment
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center px-10 leading-relaxed">
                        By click on Make Payment, I agree with the <span className="text-blue-500 underline cursor-pointer">Booking Policies</span>, <span className="text-blue-500 underline cursor-pointer">Privacy policy & Terms</span>, the Visa Rules and the T&Cs of RajTravel.com. <span className="text-slate-900 font-bold">Read More</span>
                    </p>

                </div>

                {/* Right Column: Trust Badges */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 divide-y divide-gray-50 overflow-hidden">
                        <TrustBadge
                            icon={FaLock}
                            title="Secure Payment"
                            desc="We use Secure Server Technology to provide a 100% safe online payment experience."
                        />
                        <TrustBadge
                            icon={FaCheckCircle}
                            title="10 Million+ Transactions"
                            desc="All our transactions are fast, secure and reliable."
                        />
                        <TrustBadge
                            icon={FaShieldAlt}
                            title="256 Bit Encryption"
                            desc="Top leading Encryption hardware & software to protect your information."
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Payment;
