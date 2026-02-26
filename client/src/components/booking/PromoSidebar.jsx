import React, { useState } from 'react';

const PROMO_CODES = [
    { code: 'FEBFLASHSALE', discount: 239, desc: '#RajTravelsSpecial - Choose this promo to enjoy a discount of ₹ 239' },
    { code: 'ATAUDD', discount: 200, desc: 'Applicable on AU Small Financial Bank Debit/Credit Card, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATDBS', discount: 200, desc: 'Applicable on DBS Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATHDFC', discount: 200, desc: 'Applicable on HDFC Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATIDBI', discount: 200, desc: 'Applicable on IDBI Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATFLY', discount: 39, desc: 'Your Promocode has been applied you\'ve saved ₹ 39', isApplied: true },
];

const PromoSidebar = ({ selectedPromo, onPromoSelect }) => {
    const [manualCode, setManualCode] = useState('');

    return (
        <div className="flex flex-col gap-6">
            {/* 1. Applied Promo (If exists) - Styled as a prominent card */}
            {selectedPromo && (
                <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                    <div className="px-5 py-3 bg-green-500 text-white flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Applied Offer</span>
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">%</div>
                    </div>
                    <div className="p-4 bg-green-50/30">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-black text-green-700 uppercase tracking-tighter">
                                {selectedPromo.code}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded-md border border-green-200">SAVED ₹ {selectedPromo.discount}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">
                            {selectedPromo.desc}
                        </p>
                    </div>
                </div>
            )}

            {/* 2. Promo Selection List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                <div className="px-5 py-4 bg-gradient-to-r from-green-300 to-green-100 border-b border-green-200 flex items-center justify-between group">
                    <h3 className="font-black text-xs text-green-800 uppercase tracking-widest">Offers & Promo Codes</h3>
                    <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center text-[10px] font-bold text-green-700 animate-pulse">%</div>
                </div>

                <div className="p-5">
                    <div className="flex items-baseline justify-between mb-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choose from the offers below</p>
                    </div>

                    <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {PROMO_CODES.map((promo) => (
                            <label key={promo.code} className="flex items-start gap-4 cursor-pointer group pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="mt-1 flex-shrink-0">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPromo?.code === promo.code
                                        ? "border-green-500 bg-green-500 shadow-sm ring-4 ring-green-100"
                                        : "border-slate-300 bg-white group-hover:border-red-400"
                                        }`}>
                                        {selectedPromo?.code === promo.code && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <input
                                        type="radio"
                                        name="promo_selection"
                                        checked={selectedPromo?.code === promo.code}
                                        onChange={() => onPromoSelect(promo)}
                                        className="sr-only"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[12px] font-black uppercase tracking-wider ${selectedPromo?.code === promo.code ? 'text-green-600' : 'text-slate-700 group-hover:text-red-500'}`}>
                                            {promo.code}
                                        </span>
                                        {promo.discount > 0 && (
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                                SAVE {promo.discount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 leading-tight">
                                        {promo.desc}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoSidebar;
