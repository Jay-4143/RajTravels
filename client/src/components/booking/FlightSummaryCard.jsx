import React from 'react';
import { FaPlane, FaSuitcaseRolling, FaChevronRight } from 'react-icons/fa';

const FlightSummaryCard = ({ flight, searchParams }) => {
    const formatTime = (date) => {
        if (!date) return "--:--";
        const d = new Date(date);
        return d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
    };

    const baggage = flight.baggage
        ? { cabin: flight.baggage.cabin || "7kg", checkIn: flight.baggage.checkIn || "15kg" }
        : { cabin: "7kg", checkIn: "15kg" };

    const checkInBaggageStr = [
        (searchParams?.adults > 0 || !searchParams?.adults) ? `Adult - 15Kg` : null,
        searchParams?.children > 0 ? `Child - 15Kg` : null,
        searchParams?.infants > 0 ? `Infant - 0Kg` : null,
    ].filter(Boolean).join(" ");

    const cabinBaggageStr = [
        (searchParams?.adults > 0 || !searchParams?.adults) ? `Adult - 7Kg` : null,
        searchParams?.children > 0 ? `Child - 7Kg` : null,
        searchParams?.infants > 0 ? `Infant - 7Kg` : null,
    ].filter(Boolean).join(" ");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">{flight.fromCity || flight.from}</h2>
                        <FaChevronRight className="text-gray-300 w-3" />
                        <h2 className="text-xl font-bold text-gray-900">{flight.toCity || flight.to}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-blue-600 text-xs font-bold uppercase hover:underline flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full border border-blue-600 inline-flex items-center justify-center text-[10px]">i</span> Fare Rules
                        </button>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">Partially Refundable</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-xs text-gray-500 font-medium">
                    <span>• {formatDate(flight.departureDate || searchParams?.departureDate)}</span>
                    <span>• Duration {flight.duration || "02h 20m"}</span>
                    <span>• {flight.stops === 0 ? "Non Stop" : `${flight.stops} stop(s)`}</span>
                    {flight.stops > 0 && flight.viaCities?.length > 0 && (
                        <span className="text-blue-600 font-bold">• VIA {flight.viaCities.join(', ').toUpperCase()}</span>
                    )}
                </div>

                <div className="space-y-8">
                    {/* Onward Journey Header */}
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-2 border-b border-slate-100">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Onward Journey: {flight.from} → {flight.to}
                        </span>
                        <span>{formatDate(flight.departureDate || searchParams?.departureDate)}</span>
                    </div>

                    {(flight.segments && flight.segments.length > 0 ? flight.segments : [flight]).map((seg, idx) => (
                        <div key={`out-${idx}`} className="space-y-6">
                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="p-5">
                                    {/* Segment Header: Airline & Aircraft Info */}
                                    <div className="flex flex-wrap items-center gap-6 mb-8">
                                        {/* Airline Info - Matching Image 2 */}
                                        <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
                                            <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold text-[10px] uppercase overflow-hidden shadow-sm">
                                                {seg.airlineCode || '✈'}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[15px] font-bold text-slate-800 tracking-tight">{seg.airline}</span>
                                                <span className="text-slate-300 text-lg font-light">|</span>
                                                <span className="text-[12px] font-medium text-slate-400">{seg.flightNumber}</span>
                                            </div>
                                        </div>

                                        {/* Premium Baggage & Aircraft Bar (Single Row) - Precisely matching Image 2 */}
                                        <div className="flex items-center bg-[#F8FAFC] rounded-lg border border-slate-100 px-1 py-1.5 gap-0 divide-x-2 divide-blue-400">
                                            <div className="px-6 py-0.5">
                                                <p className="text-[11px] font-bold text-slate-800 leading-tight">Aircraft</p>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{seg.aircraft || 'BOEING'}</p>
                                            </div>
                                            <div className="px-6 py-0.5">
                                                <p className="text-[11px] font-bold text-slate-800 leading-tight">Travel Class</p>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{searchParams?.travelClass || 'Economy'}</p>
                                            </div>
                                            <div className="px-6 py-0.5">
                                                <p className="text-[11px] font-bold text-slate-800 leading-tight">Check-In Baggage</p>
                                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{checkInBaggageStr}</p>
                                            </div>
                                            <div className="px-6 py-0.5">
                                                <p className="text-[11px] font-bold text-slate-800 leading-tight">Cabin Baggage</p>
                                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{cabinBaggageStr}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Segment Timeline */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                                        <div className="flex-1 w-full md:w-auto">
                                            <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatTime(seg.departureTime)}</p>
                                            <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{formatDate(seg.departureTime)}</p>
                                            <div className="mt-3">
                                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{seg.fromCity || seg.from} [{seg.from}]</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-tight">{seg.fromAirport}</p>
                                                <p className="text-[10px] text-slate-400 font-black mt-0.5 uppercase tracking-widest">Terminal {seg.terminal || '1'}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center min-w-[140px]">
                                            <span className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">{seg.duration}</span>
                                            <div className="w-full relative flex items-center justify-center">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t-2 border-dashed border-slate-200"></div>
                                                </div>
                                                <div className="relative z-10 bg-white px-2">
                                                    <FaPlane className="text-blue-500 w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full md:w-auto md:text-right">
                                            <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatTime(seg.arrivalTime)}</p>
                                            <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{formatDate(seg.arrivalTime)}</p>
                                            <div className="mt-3">
                                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{seg.toCity || seg.to} [{seg.to}]</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-tight">{seg.toAirport}</p>
                                                <p className="text-[10px] text-slate-400 font-black mt-0.5 uppercase tracking-widest">Terminal {seg.arrivalTerminal || '1D'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Layover Indicator */}
                            {seg.layoverDuration && (
                                <div className="bg-gradient-to-r from-blue-50/50 via-blue-50 to-blue-50/50 border-y border-blue-100 py-3 px-8 flex items-center gap-4 relative">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-400 rounded-r-full"></div>
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                                        <FaPlane className="w-3.5 h-3.5" />
                                    </div>
                                    <p className="text-[11px] font-black text-blue-800 uppercase tracking-widest leading-relaxed">
                                        Change planes at <span className="text-blue-600 underline decoration-2 underline-offset-4">{seg.toCity} | {seg.toAirport} | {seg.to}</span>, Connecting Time: <span className="text-red-500">{seg.layoverDuration}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Return Journey Integration */}
                    {flight.returnFlight && (
                        <>
                            {/* Return Journey Header */}
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pb-2 border-b border-slate-100 pt-8 mt-4 border-t">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Return Journey: {flight.returnFlight.from} → {flight.returnFlight.to}
                                </span>
                                <span>{formatDate(flight.returnFlight.departureTime)}</span>
                            </div>

                            {(flight.returnFlight.segments && flight.returnFlight.segments.length > 0 ? flight.returnFlight.segments : [flight.returnFlight]).map((seg, idx) => (
                                <div key={`ret-${idx}`} className="space-y-6">
                                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="p-5">
                                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                                {/* Airline Info - Matching Image 2 */}
                                                <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
                                                    <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold text-[10px] uppercase overflow-hidden shadow-sm">
                                                        {seg.airlineCode || '✈'}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[15px] font-bold text-slate-800 tracking-tight">{seg.airline}</span>
                                                        <span className="text-slate-300 text-lg font-light">|</span>
                                                        <span className="text-[12px] font-medium text-slate-400">{seg.flightNumber}</span>
                                                    </div>
                                                </div>

                                                {/* Premium Baggage & Aircraft Bar (Single Row) - Precisely matching Image 2 */}
                                                <div className="flex items-center bg-[#F8FAFC] rounded-lg border border-slate-100 px-1 py-1.5 gap-0 divide-x-2 divide-blue-400">
                                                    <div className="px-6 py-0.5">
                                                        <p className="text-[11px] font-bold text-slate-800 leading-tight">Aircraft</p>
                                                        <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{seg.aircraft || 'BOEING'}</p>
                                                    </div>
                                                    <div className="px-6 py-0.5">
                                                        <p className="text-[11px] font-bold text-slate-800 leading-tight">Travel Class</p>
                                                        <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{searchParams?.travelClass || 'Economy'}</p>
                                                    </div>
                                                    <div className="px-6 py-0.5">
                                                        <p className="text-[11px] font-bold text-slate-800 leading-tight">Check-In Baggage</p>
                                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{checkInBaggageStr}</p>
                                                    </div>
                                                    <div className="px-6 py-0.5">
                                                        <p className="text-[11px] font-bold text-slate-800 leading-tight">Cabin Baggage</p>
                                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{cabinBaggageStr}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Segment Timeline */}
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-2">
                                                <div className="flex-1 w-full md:w-auto">
                                                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatTime(seg.departureTime)}</p>
                                                    <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{formatDate(seg.departureTime)}</p>
                                                    <div className="mt-3">
                                                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{seg.fromCity || seg.from} [{seg.from}]</p>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-tight">{seg.fromAirport}</p>
                                                        <p className="text-[10px] text-slate-400 font-black mt-0.5 uppercase tracking-widest">Terminal {seg.terminal || '1'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex-1 flex flex-col items-center min-w-[140px]">
                                                    <span className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">{seg.duration}</span>
                                                    <div className="w-full relative flex items-center justify-center">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t-2 border-dashed border-slate-200"></div>
                                                        </div>
                                                        <div className="relative z-10 bg-white px-2">
                                                            <FaPlane className="text-blue-500 w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 w-full md:w-auto md:text-right">
                                                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatTime(seg.arrivalTime)}</p>
                                                    <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{formatDate(seg.arrivalTime)}</p>
                                                    <div className="mt-3">
                                                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{seg.toCity || seg.to} [{seg.to}]</p>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-tight">{seg.toAirport}</p>
                                                        <p className="text-[10px] text-slate-400 font-black mt-0.5 uppercase tracking-widest">Terminal {seg.arrivalTerminal || '1D'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Layover Indicator */}
                                    {seg.layoverDuration && (
                                        <div className="bg-gradient-to-r from-blue-50/50 via-blue-50 to-blue-50/50 border-y border-blue-100 py-3 px-8 flex items-center gap-4 relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-400 rounded-r-full"></div>
                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                                                <FaPlane className="w-3.5 h-3.5" />
                                            </div>
                                            <p className="text-[11px] font-black text-blue-800 uppercase tracking-widest leading-relaxed">
                                                Change planes at <span className="text-blue-600 underline decoration-2 underline-offset-4">{seg.toCity} | {seg.toAirport} | {seg.to}</span>, Connecting Time: <span className="text-red-500">{seg.layoverDuration}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="mt-12 pt-4 border-t border-slate-50 flex items-center gap-2">
                    <div className="p-1 px-3 bg-blue-50 rounded-lg flex items-center gap-2 border border-blue-100">
                        <span className="w-4 h-4 rounded-full border border-blue-400 inline-flex items-center justify-center text-[10px] text-blue-500 animate-pulse">i</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Meal, Seat are chargeable.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightSummaryCard;
