import React from 'react';
import { useGlobal } from '../../context/GlobalContext';

const PROMO_CODES = [
    { code: 'ATIDFC', discount: 200, desc: 'Applicable on IDFC Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATMBK200', discount: 200, desc: 'Applicable on MobiKwik Wallet, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATRBL', discount: 200, desc: 'Applicable on RBL Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATSBIDOM', discount: 200, desc: 'Applicable on SBI Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATFLY', discount: 39, desc: 'Your Promocode has been applied you\'ve saved ₹ 39' },
    { code: 'ATWALLET', discount: 0, desc: 'Please login to check amount' },
];

const FareSidebar = ({
    flight,
    searchParams,
    passengersCount,
    selectedPromo,
    onPromoSelect,
    insuranceSelected,
    baggageSelected,
    refundableSelected,
    addonsTotal = 0
}) => {
    const { formatPrice } = useGlobal();
    const [showBaseFare, setShowBaseFare] = React.useState(false);
    const [showTax, setShowTax] = React.useState(false);
    const [showInsurance, setShowInsurance] = React.useState(false);
    const [showExtras, setShowExtras] = React.useState(false);

    const adults = searchParams?.adults || 0;
    const children = searchParams?.children || 0;
    const infants = searchParams?.infants || 0;
    const totalPax = adults + children + infants || 1;

    const baseFare = flight.price * passengersCount;
    const taxes = Math.round(baseFare * 0.15);
    const insurance = insuranceSelected ? 199 * passengersCount : 0;
    const baggage = baggageSelected ? 95 * passengersCount : 0;
    const refundable = refundableSelected ? Math.round(flight.price * 0.1) * passengersCount : 0;
    const promoDiscount = selectedPromo ? selectedPromo.discount : 0;

    const total = baseFare + taxes + insurance + baggage + refundable - promoDiscount;

    return (
        <div className="flex flex-col gap-4">
            {/* Fare Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm tracking-tight">Fare Details</h3>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{passengersCount} Traveller{passengersCount > 1 ? 's' : ''}</span>
                </div>
                <div className="p-5 space-y-4">
                    {/* Simplified Base Fare */}
                    <div>
                        <button
                            onClick={() => setShowBaseFare(!showBaseFare)}
                            className="w-full flex justify-between items-center group cursor-pointer"
                        >
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                                <div className={`w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[10px] ${showBaseFare ? 'bg-slate-800 border-slate-800 text-white' : 'text-slate-400'}`}>
                                    <span className="font-bold">{showBaseFare ? '-' : '+'}</span>
                                </div>
                                Base Fare
                            </div>
                            <span className="text-gray-900 font-bold text-sm leading-none">₹ {baseFare.toLocaleString('en-IN')}</span>
                        </button>

                        {showBaseFare && (
                            <div className="mt-3 ml-8 space-y-2 border-l-2 border-slate-100 pl-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                {adults > 0 && (
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        <span>Adult ({adults} X ₹{flight.price.toLocaleString('en-IN')})</span>
                                        <span>₹{(adults * flight.price).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {children > 0 && (
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        <span>Child ({children} X ₹{Math.round(flight.price * 0.75).toLocaleString('en-IN')})</span>
                                        <span>₹{(children * Math.round(flight.price * 0.75)).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {infants > 0 && (
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        <span>Infant ({infants} X ₹{Math.round(flight.price * 0.25).toLocaleString('en-IN')})</span>
                                        <span>₹{(infants * Math.round(flight.price * 0.25)).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tax & Charges (Including Addons/Extras) */}
                    <div>
                        <button
                            onClick={() => setShowTax(!showTax)}
                            className="w-full flex justify-between items-center group cursor-pointer"
                        >
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                                <div className={`w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[10px] ${showTax ? 'bg-slate-800 border-slate-800 text-white' : 'text-slate-400'}`}>
                                    <span className="font-bold">{showTax ? '-' : '+'}</span>
                                </div>
                                Tax & Charges
                            </div>
                            <span className="text-gray-900 font-bold text-sm leading-none">₹ {(taxes + insurance + baggage + refundable + addonsTotal).toLocaleString('en-IN')}</span>
                        </button>

                        {showTax && (
                            <div className="mt-3 ml-8 space-y-2 border-l-2 border-slate-100 pl-4 animate-in fade-in slide-in-from-top-2 duration-200 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                <div className="flex justify-between">
                                    <span>Taxes</span>
                                    <span>₹ {taxes.toLocaleString('en-IN')}</span>
                                </div>
                                {(insurance > 0 || baggage > 0 || refundable > 0 || addonsTotal > 0) && (
                                    <div className="pt-2 border-t border-slate-50 mt-2 space-y-2">
                                        {insurance > 0 && <div className="flex justify-between"><span>Travel Insurance</span><span>₹ {insurance.toLocaleString('en-IN')}</span></div>}
                                        {baggage > 0 && <div className="flex justify-between"><span>Extra Baggage</span><span>₹ {baggage.toLocaleString('en-IN')}</span></div>}
                                        {refundable > 0 && <div className="flex justify-between"><span>Refundable Booking</span><span>₹ {refundable.toLocaleString('en-IN')}</span></div>}
                                        {addonsTotal > 0 && <div className="flex justify-between"><span>Additional Services</span><span>₹ {addonsTotal.toLocaleString('en-IN')}</span></div>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Promo Discount Applied */}
                    {promoDiscount > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px]">
                                    <span className="font-bold">%</span>
                                </div>
                                Promo Discount Applied
                            </div>
                            <span className="font-bold text-sm leading-none">- ₹ {promoDiscount.toLocaleString('en-IN')}</span>
                        </div>
                    )}

                    <div className="pt-4 mt-6 border-t border-slate-200 flex justify-between items-center bg-slate-50/50 -mx-5 px-5 py-3">
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">Total Amount:</span>
                        <span className="text-xl font-black text-gray-900 tracking-tighter">₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FareSidebar;
