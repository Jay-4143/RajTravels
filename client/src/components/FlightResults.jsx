import { useState, useMemo, useRef, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";
import {
  HiFilter,
  HiOutlineRefresh,
  HiOutlineStar,
  HiLightningBolt,
} from "react-icons/hi";
import {
  FaPlane,
  FaSun,
  FaMoon,
  FaCloudSun,
  FaCloudMoon,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaSuitcaseRolling,
  FaFileAlt
} from "react-icons/fa";

/* ──────────── helpers ──────────── */
const formatTime = (date) => {
  if (!date) return "--:--";
  const d = new Date(date);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDuration = (dur) => {
  if (!dur || dur === "—") return dur;
  // "2h 30m" → "2 Hr 30 Min"
  return dur.replace(/(\d+)h/i, "$1 Hr").replace(/(\d+)m/i, "$1 Min");
};

/* ──────────── FARE DISCOUNT CONFIG ──────────── */
const FARE_DISCOUNTS = {
  student: { label: "Student Fare", discount: 0.05, icon: "🎓" },
  defence: { label: "Defence Fare", discount: 0.04, icon: "🎖️" },
  senior: { label: "Senior Citizen Fare", discount: 0.06, icon: "👴" },
};

const getFareDiscount = (price, specialFare) => {
  if (!specialFare || !FARE_DISCOUNTS[specialFare]) return 0;
  return Math.round(price * FARE_DISCOUNTS[specialFare].discount);
};

/* ──────────── FLIGHT CARD ──────────── */
const FlightCard = ({ flight, tripType, returnFlight, onBook, specialFare, searchParams }) => {
  const { formatPrice } = useGlobal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const baggage = flight.baggage
    ? `${flight.baggage.cabin || "7 kg"} cabin, ${flight.baggage.checkIn || "15 kg"} check-in`
    : "7 kg cabin, 15 kg check-in";

  const isMulti = flight.itineraries?.length > 1;

  const totalTravellers = (searchParams?.adults || 1) + (searchParams?.children || 0) + (searchParams?.infants || 0);

  const TABS = [
    { id: 'info', label: 'Flight Information', icon: FaInfoCircle },
    { id: 'fare', label: 'Fare Summary & Rules', icon: FaFileAlt },
    { id: 'baggage', label: 'Baggage Information', icon: FaSuitcaseRolling },
  ];

  const [fareSubTab, setFareSubTab] = useState('change');
  const [showBaseFareBreakdown, setShowBaseFareBreakdown] = useState(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [showInsuranceBreakdown, setShowInsuranceBreakdown] = useState(false);

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
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="flex items-stretch relative">
        {/* Main flight info */}
        <div className="flex-1 p-6">
          <div className="flex items-center gap-8">
            {/* Airline icon + name */}
            <div className="flex items-center gap-4 min-w-[180px]">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-lg font-bold text-red-500 border border-slate-100 group-hover:bg-red-50 transition-colors">
                {flight.airlineCode || flight.airline?.charAt(0) || "✈"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate uppercase tracking-tight">{flight.airline}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">{flight.flightNumber || "AI-1232"}</p>
              </div>
            </div>

            {/* Departure */}
            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold text-slate-900 tracking-tighter">{formatTime(flight.departureTime)}</p>
              <p className="text-[10px] font-bold text-slate-900 uppercase mt-0.5">{flight.fromCity || flight.from}</p>
              <p className="text-[9px] font-semibold text-slate-400 uppercase leading-none mt-0.5">[{flight.from}]</p>
            </div>

            {/* Duration & stops */}
            <div className="flex-1 px-8">
              <div className="relative flex flex-col items-center">
                <span className="text-[10px] font-semibold text-slate-400 mb-2">{formatDuration(flight.duration)}</span>
                <div className="w-full flex items-center gap-2">
                  <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
                  <FaPlane className="w-3.5 h-3.5 text-slate-300" />
                  <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-tight">
                  {flight.stops === 0 ? "Non Stop" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}${flight.viaCities?.length > 0 ? `, Via ${flight.viaCities.join(', ')}` : ''}`}
                </span>
                {flight.stops > 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[1px] w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-white shadow-sm mt-2" />}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center min-w-[80px]">
              <p className="text-2xl font-bold text-slate-900 tracking-tighter">{formatTime(flight.arrivalTime)}</p>
              <p className="text-[10px] font-bold text-slate-900 uppercase mt-0.5">{flight.toCity || flight.to}</p>
              <p className="text-[9px] font-semibold text-slate-400 uppercase leading-none mt-0.5">[{flight.to}]</p>
            </div>
          </div>

          {/* Restore Compact Inclusions Row */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
            <span className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Meal, Seat are chargeable (More)
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase">
              <FaSuitcaseRolling className="w-3 h-3 text-slate-300" />
              {flight.baggage?.checkIn || '15kg'} (Check-in) | {flight.baggage?.cabin || '7kg'} (Cabin)
            </span>
            <span className="text-[10px] font-bold text-red-500 uppercase ml-auto">{flight.seatsAvailable || 9} Left</span>
          </div>
        </div>

        {/* Price & Book section */}
        <div className="flex flex-col items-center justify-center p-6 border-l border-slate-50 min-w-[180px] bg-slate-50/30">
          {(() => {
            const promoDiscount = getFareDiscount(flight.price, specialFare);
            const finalPrice = flight.price - promoDiscount;
            const totalAmount = finalPrice * totalTravellers;
            const originalStrike = Math.round(flight.price * 1.1 * totalTravellers);
            return (
              <div className="text-right w-full mb-3">
                <p className="text-[10px] font-semibold text-gray-400 line-through">₹{originalStrike.toLocaleString('en-IN')}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tighter">{formatPrice(totalAmount)}</p>
                {totalTravellers > 1 && (
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total for {totalTravellers} Pax</p>
                )}
                {promoDiscount > 0 ? (
                  <p className="text-[10px] font-semibold text-green-500">Extra ₹{(promoDiscount * totalTravellers).toLocaleString('en-IN')} Off</p>
                ) : (
                  <p className="text-[10px] font-semibold text-green-500">Extra ₹{Math.round(flight.price * 0.05 * totalTravellers).toLocaleString('en-IN')} Off</p>
                )}
              </div>
            );
          })()}
          <button
            type="button"
            onClick={() => onBook(flight, tripType === "round-trip" ? returnFlight : null)}
            className="w-full py-2.5 bg-[#FF4D42] hover:bg-[#E63930] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-red-200 active:scale-95"
          >
            View Fare
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[10px] font-bold text-blue-600 hover:text-red-500 uppercase tracking-widest border-b-2 border-transparent hover:border-red-500 transition-all"
          >
            {isExpanded ? "- Hide Details" : "+ Details"}
          </button>
          {specialFare && FARE_DISCOUNTS[specialFare] && (
            <div className="mt-2 text-right w-full">
              <span
                className="text-lg inline-block p-1 bg-white rounded shadow-sm border border-slate-100"
                title={FARE_DISCOUNTS[specialFare].label}
              >
                {FARE_DISCOUNTS[specialFare].icon}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details with Tabs */}
      {isExpanded && (
        <div className="bg-slate-50/50 border-t border-slate-100 p-0 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex border-b border-slate-200">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-red-500 bg-white border-x border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-500" />}
              </button>
            ))}
          </div>

          <div className="p-8 bg-white">
            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* Outbound Journey */}
                <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                    <span>Onward Journey: {flight.fromCity} [{flight.from}] <span className="text-slate-300 mx-2">→</span> {flight.toCity} [{flight.to}]</span>
                  </div>
                  <span className="text-slate-400">{new Date(flight.departureDate || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                {(flight.segments && flight.segments.length > 0 ? flight.segments : [flight]).map((seg, idx) => (
                  <div key={`out-${idx}`} className="space-y-4">
                    {/* Segment Block */}
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                      <div className="p-6">
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

                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                          <div className="flex-1 w-full text-center md:text-left">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatTime(seg.departureTime)}</p>
                            <p className="text-[11px] font-bold text-slate-500 mt-1.5 uppercase tracking-tight">{new Date(seg.departureTime).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <div className="mt-4">
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{seg.fromCity} [{seg.from}]</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">{seg.fromAirport}</p>
                              <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Terminal {seg.terminal || '1'}</p>
                            </div>
                          </div>

                          <div className="flex-[0.5] flex flex-col items-center min-w-[120px]">
                            <span className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-[0.25em]">{seg.duration}</span>
                            <div className="w-full relative flex items-center justify-center">
                              <div className="absolute inset-x-0 h-px bg-slate-100 border-t border-dashed border-slate-300" />
                              <div className="relative z-10 bg-white px-3">
                                <FaPlane className="text-blue-500 w-5 h-5" />
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 w-full text-center md:text-right">
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatTime(seg.arrivalTime)}</p>
                            <p className="text-[11px] font-bold text-slate-500 mt-1.5 uppercase tracking-tight">{new Date(seg.arrivalTime).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <div className="mt-4">
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{seg.toCity} [{seg.to}]</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">{seg.toAirport}</p>
                              <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Terminal {seg.arrivalTerminal || '1D'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layover connecting bar */}
                    {seg.layoverDuration && (
                      <div className="bg-gradient-to-r from-blue-50/30 via-blue-50 to-blue-50/30 border-y border-blue-100/50 py-3.5 px-8 flex items-center gap-4 relative mx-4 rounded-xl">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full shadow-sm" />
                        <div className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-500 shadow-sm">
                          <FaPlane className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black text-blue-800 uppercase tracking-[0.1em]">
                          Change planes at <span className="text-blue-600 underline decoration-2 underline-offset-4">{seg.toCity} | {seg.toAirport} ({seg.to})</span>, Connecting Time: <span className="text-red-500">{seg.layoverDuration}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Return Journey */}
                {tripType === "round-trip" && returnFlight && (
                  <>
                    <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100 pt-8 mt-8 border-t">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                        <span>Return Journey: {returnFlight.fromCity || returnFlight.from} <span className="text-slate-300 mx-2">→</span> {returnFlight.toCity || returnFlight.to}</span>
                      </div>
                      <span className="text-slate-400">{new Date(returnFlight.departureTime || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {(returnFlight.segments && returnFlight.segments.length > 0 ? returnFlight.segments : [returnFlight]).map((seg, idx) => (
                      <div key={`ret-${idx}`} className="space-y-4">
                        {/* Segment Block */}
                        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                          <div className="p-6">
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

                            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                              <div className="flex-1 w-full text-center md:text-left">
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatTime(seg.departureTime)}</p>
                                <p className="text-[11px] font-bold text-slate-500 mt-1.5 uppercase tracking-tight">{new Date(seg.departureTime).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                <div className="mt-4">
                                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{seg.fromCity || seg.from} [{seg.from}]</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">{seg.fromAirport}</p>
                                  <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Terminal {seg.terminal || '1'}</p>
                                </div>
                              </div>

                              <div className="flex-[0.5] flex flex-col items-center min-w-[120px]">
                                <span className="text-[10px] font-black text-slate-300 mb-2 uppercase tracking-[0.25em]">{seg.duration}</span>
                                <div className="w-full relative flex items-center justify-center">
                                  <div className="absolute inset-x-0 h-px bg-slate-100 border-t border-dashed border-slate-300" />
                                  <div className="relative z-10 bg-white px-3">
                                    <FaPlane className="text-blue-500 w-5 h-5" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 w-full text-center md:text-right">
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatTime(seg.arrivalTime)}</p>
                                <p className="text-[11px] font-bold text-slate-500 mt-1.5 uppercase tracking-tight">{new Date(seg.arrivalTime).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                <div className="mt-4">
                                  <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">{seg.toCity || seg.to} [{seg.to}]</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">{seg.toAirport}</p>
                                  <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.2em]">Terminal {seg.arrivalTerminal || '1D'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Layover connecting bar */}
                        {seg.layoverDuration && (
                          <div className="bg-gradient-to-r from-blue-50/30 via-blue-50 to-blue-50/30 border-y border-blue-100/50 py-3.5 px-8 flex items-center gap-4 relative mx-4 rounded-xl">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full shadow-sm" />
                            <div className="w-8 h-8 rounded-full bg-white border border-blue-200 flex items-center justify-center text-blue-500 shadow-sm">
                              <FaPlane className="w-4 h-4" />
                            </div>
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-[0.1em]">
                              Change planes at <span className="text-blue-600 underline decoration-2 underline-offset-4">{seg.toCity} | {seg.toAirport} ({seg.to})</span>, Connecting Time: <span className="text-red-500">{seg.layoverDuration}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            {activeTab === 'fare' && (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Fee Tabs */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
                    {[
                      { id: 'change', label: 'CHANGE FEE' },
                      { id: 'cancel', label: 'CANCELLATION FEE' },
                      { id: 'ato', label: 'ATO SERVICE FEE' }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setFareSubTab(sub.id)}
                        className={`px-6 py-2 text-[10px] font-black rounded-md transition-all ${fareSubTab === sub.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-700">{flight.from} - {flight.to}</span>
                    </div>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Time to Departure</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Adult</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Child</th>
                          <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Infant</th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] font-bold text-slate-600">
                        {fareSubTab === 'ato' ? (
                          <>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 border-b border-slate-100 uppercase">Re Schedule</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">₹300</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">₹300</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">₹300</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 uppercase">Cancellation</td>
                              <td className="px-6 py-4 text-center font-black">₹300</td>
                              <td className="px-6 py-4 text-center font-black">₹300</td>
                              <td className="px-6 py-4 text-center font-black">₹300</td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 border-b border-slate-100">0 HRS - 4 HRS To Departure</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">
                                {fareSubTab === 'cancel' ? 'Non refundable' : 'Non changeable'}
                              </td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">
                                {fareSubTab === 'cancel' ? 'Non refundable' : 'Non changeable'}
                              </td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">
                                {fareSubTab === 'cancel' ? 'Non refundable' : 'Non changeable'}
                              </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 border-b border-slate-100">4 HRS - 4 Days To Departure</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">₹{fareSubTab === 'cancel' ? '4899' : '3899'}</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">₹{fareSubTab === 'cancel' ? '4399' : '3399'}</td>
                              <td className="px-6 py-4 border-b border-slate-100 text-center font-black">₹{fareSubTab === 'cancel' ? '1299' : '999'}</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">4 Days - 365 Days To Departure</td>
                              <td className="px-6 py-4 text-center font-black">₹{fareSubTab === 'cancel' ? '3899' : '3299'}</td>
                              <td className="px-6 py-4 text-center font-black">₹3399</td>
                              <td className="px-6 py-4 text-center font-black">₹999</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-relaxed font-semibold flex items-start gap-1.5 mt-4">
                    <span className="mt-0.5">•</span>
                    The above data is indicatory, fare rules are subject to changes by the Airline from time to time depending upon Fare class and change/cancellation fee amount may also vary based on availability.
                  </p>
                </div>

                {/* Right: Fare Details */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between bg-slate-50 px-6 py-4 border-b border-slate-100">
                      <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-heading">Fare Details</h5>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{totalTravellers} Traveller{totalTravellers > 1 ? 's' : ''}</span>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Base Fare */}
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Toggling Base Fare Breakdown:", !showBaseFareBreakdown);
                            setShowBaseFareBreakdown(!showBaseFareBreakdown);
                          }}
                          className="w-full flex justify-between items-center text-xs group cursor-pointer"
                        >
                          <span className="text-slate-500 font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            <span className={`w-4 h-4 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px] leading-none ${showBaseFareBreakdown ? 'bg-slate-800 border-slate-800 text-white' : ''}`}>
                              {showBaseFareBreakdown ? '-' : '+'}
                            </span>
                            Base Fare
                          </span>
                          <span className="text-slate-800 font-black tracking-tight">₹{Math.round(flight.price * 0.85 * totalTravellers).toLocaleString('en-IN')}</span>
                        </button>

                        {showBaseFareBreakdown && (
                          <div className="mt-2 ml-6 space-y-2 animate-fadeIn border-l-2 border-slate-100 pl-4">
                            {searchParams?.adults > 0 && (
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                <span>Adult ({searchParams.adults} X ₹{Math.round(flight.price * 0.85).toLocaleString('en-IN')})</span>
                                <span>₹{Math.round(flight.price * 0.85 * searchParams.adults).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            {searchParams?.children > 0 && (
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                <span>Child ({searchParams.children} X ₹{Math.round(flight.price * 0.85).toLocaleString('en-IN')})</span>
                                <span>₹{Math.round(flight.price * 0.85 * searchParams.children).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            {searchParams?.infants > 0 && (
                              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                <span>Infant ({searchParams.infants} X ₹{Math.round(flight.price * 0.4).toLocaleString('en-IN')})</span>
                                <span>₹{Math.round(flight.price * 0.4 * searchParams.infants).toLocaleString('en-IN')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Tax & Charges */}
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Toggling Tax Breakdown:", !showTaxBreakdown);
                            setShowTaxBreakdown(!showTaxBreakdown);
                          }}
                          className="w-full flex justify-between items-center text-xs group cursor-pointer"
                        >
                          <span className="text-slate-500 font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            <span className={`w-4 h-4 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px] leading-none ${showTaxBreakdown ? 'bg-slate-800 border-slate-800 text-white' : ''}`}>
                              {showTaxBreakdown ? '-' : '+'}
                            </span>
                            Tax & Charges
                          </span>
                          <span className="text-slate-800 font-black tracking-tight">₹{Math.round(flight.price * 0.15 * totalTravellers).toLocaleString('en-IN')}</span>
                        </button>

                        {showTaxBreakdown && (
                          <div className="mt-2 ml-6 space-y-2 animate-fadeIn border-l-2 border-slate-100 pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <div className="flex justify-between">
                              <span>User Dev. Fee</span>
                              <span>₹{(828 * totalTravellers).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>K3 Tax</span>
                              <span>₹{(1180 * totalTravellers).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Airline Misc</span>
                              <span>₹{(1928 * totalTravellers).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Insurance */}
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowInsuranceBreakdown(!showInsuranceBreakdown);
                          }}
                          className="w-full flex justify-between items-center text-xs group cursor-pointer"
                        >
                          <span className="text-slate-500 font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            <span className={`w-4 h-4 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px] leading-none ${showInsuranceBreakdown ? 'bg-slate-800 border-slate-800 text-white' : ''}`}>
                              {showInsuranceBreakdown ? '-' : '+'}
                            </span>
                            Insurance
                          </span>
                          <span className="text-slate-800 font-black tracking-tight">₹{(1990 * totalTravellers).toLocaleString('en-IN')}</span>
                        </button>

                        {showInsuranceBreakdown && (
                          <div className="mt-2 ml-6 space-y-2 animate-fadeIn border-l-2 border-slate-100 pl-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            <div className="flex justify-between">
                              <span>Base Premium</span>
                              <span>₹{(1690 * totalTravellers).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>SGST</span>
                              <span>₹{(150 * totalTravellers).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CGST</span>
                              <span>₹{(150 * totalTravellers).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Promo Discount */}
                      {specialFare && FARE_DISCOUNTS[specialFare] && (
                        <div className="flex justify-between items-center bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                          <span className="text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full inline-flex items-center justify-center text-[8px] leading-none">✓</span>
                            Promo Discount Applied
                          </span>
                          <span className="text-green-600 font-black text-xs">- ₹{(getFareDiscount(flight.price, specialFare) * totalTravellers).toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-800 font-black uppercase tracking-widest text-[13px]">Total Amount:</span>
                          <span className="text-slate-900 font-black text-2xl tracking-tighter">₹{((flight.price - getFareDiscount(flight.price, specialFare)) * totalTravellers).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'baggage' && (
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Cabin Baggage', val: '7 KG', desc: '1 piece per person' },
                  { label: 'Check-in Baggage', val: '15 KG', desc: '1 piece per person' },
                  { label: 'Extra Baggage', val: 'From ₹450', desc: 'Pre-book at best rates' }
                ].map(item => (
                  <div key={item.label} className="p-6 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                    <FaSuitcaseRolling className="w-8 h-8 text-slate-300 mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-black text-slate-800 tracking-tighter mb-1">{item.val}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Return flight row */}
      {tripType === "round-trip" && returnFlight && (
        <div className="bg-blue-50/50 px-6 py-4 border-t border-slate-100 flex items-center gap-6">
          <span className="text-[10px] font-black text-white bg-blue-500 px-3 py-1 rounded-full uppercase tracking-widest">RETURN</span>
          <span className="font-black text-xs text-slate-700 uppercase tracking-tight">{returnFlight.airline}</span>
          <span className="text-sm font-black text-slate-900 tracking-tighter">
            {formatTime(returnFlight.departureTime)} → {formatTime(returnFlight.arrivalTime)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto">{formatDuration(returnFlight.duration)}</span>
        </div>
      )}
    </div>
  );
};

/* ──────────── SORT TABS ──────────── */
const SORT_TABS = [
  { key: "best", label: "Best Value", icon: HiOutlineStar },
  { key: "cheapest", label: "Cheapest", icon: null, color: "bg-green-500" },
  { key: "fastest", label: "Fastest", icon: HiLightningBolt, color: "bg-blue-500" },
];

/* ──────────── DATE STRIP ──────────── */
const DateStrip = ({ activeDate, onDateSelect, flightsCount, cheapestPrice, basePrice = 10301, loading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const [priceCache, setPriceCache] = useState({});

  useEffect(() => {
    if (activeDate && flightsCount > 0 && cheapestPrice < Infinity) {
      setPriceCache(prev => ({
        ...prev,
        [activeDate]: cheapestPrice
      }));
    }
  }, [activeDate, flightsCount, cheapestPrice]);

  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getStablePrice = (dateStr, base) => {
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0;
      }
      return base + (Math.abs(hash) % 2000) - 1000;
    };

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const localDateStr = `${y}-${m}-${day}`;

      let price = priceCache[localDateStr] || getStablePrice(localDateStr, basePrice);

      list.push({
        date: localDateStr,
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }),
        price: price
      });
    }
    return list;
  }, [basePrice, priceCache]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-6 overflow-hidden flex items-stretch shadow-sm">
      <button
        onClick={() => scroll('left')}
        className="px-3 border-r border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 active:text-blue-500"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>
      <div ref={scrollRef} className="flex-1 flex overflow-x-auto no-scrollbar scroll-smooth">
        {dates.map((item) => (
          <button
            key={item.date}
            onClick={() => !loading && onDateSelect({ departureDate: item.date })}
            disabled={loading}
            className={`flex-1 min-w-[100px] py-3 flex flex-col items-center justify-center border-r border-slate-100 transition-all ${activeDate === item.date ? 'bg-slate-900 text-white shadow-xl scale-105 z-10' : 'hover:bg-slate-50'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${activeDate === item.date ? 'text-slate-400' : 'text-slate-400'}`}>{item.label}</span>
            <span className={`text-[13px] font-black tracking-tighter ${activeDate === item.date ? 'text-white' : 'text-slate-800'}`}>₹{Math.round(item.price).toLocaleString('en-IN')}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="px-3 border-l border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 active:text-blue-500"
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ──────────── TIME FILTER BLOCKS ──────────── */
const TIME_BLOCKS = [
  { label: "05am - 12pm", from: "05:00", to: "11:59", icon: FaSun },
  { label: "12pm - 6pm", from: "12:00", to: "17:59", icon: FaCloudSun },
  { label: "6pm - 11pm", from: "18:00", to: "22:59", icon: FaCloudMoon },
  { label: "11pm - 05am", from: "23:00", to: "04:59", icon: FaMoon },
];

/* ──────────── MAIN FLIGHT RESULTS ──────────── */
const FlightResults = ({
  flights = [],
  totalFlights = 0,
  returnFlights = [],
  searchParams,
  filterParams,
  onFilterChange,
  onSortChange,
  sort,
  order,
  loading,
  onBook,
}) => {
  const { formatPrice } = useGlobal();
  const [activeSort, setActiveSort] = useState("cheapest");
  const [showMoreAirports, setShowMoreAirports] = useState(false);

  const airlines = useMemo(() => {
    const set = new Set(flights.map((f) => f.airline).filter(Boolean));
    return Array.from(set).sort();
  }, [flights]);

  // Compute stop counts for filter badges
  const stopCounts = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0 };
    flights.forEach((f) => {
      const s = f.stops || 0;
      if (s === 0) counts[0]++;
      else if (s === 1) counts[1]++;
      else counts[2]++;
    });
    return counts;
  }, [flights]);

  // Compute min prices for stop options
  const stopPrices = useMemo(() => {
    const prices = { 0: Infinity, 1: Infinity, 2: Infinity };
    flights.forEach((f) => {
      const s = Math.min(f.stops || 0, 2);
      prices[s] = Math.min(prices[s], f.price || Infinity);
    });
    return prices;
  }, [flights]);

  const tripType = searchParams?.tripType || "one-way";

  // Wrap main results in useMemo for performance
  const sortedFlights = useMemo(() => {
    let result = [...flights];
    if (activeSort === "cheapest") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "fastest") {
      result.sort((a, b) => {
        const getMin = (d) => {
          const m = d.match(/(\d+)h/i);
          const min = d.match(/(\d+)m/i);
          return (m ? parseInt(m[1]) * 60 : 0) + (min ? parseInt(min[1]) : 0);
        };
        return getMin(a.duration) - getMin(b.duration);
      });
    }
    return result;
  }, [flights, activeSort]);
  const handleSortTab = (key) => {
    setActiveSort(key);
    if (key === "cheapest") onSortChange("price", "asc");
    else if (key === "fastest") onSortChange("duration", "asc");
    else if (key === "best") onSortChange("best", "asc");
    else onSortChange("price", "asc");
  };

  const { minPriceResults, maxPriceResults } = useMemo(() => {
    if (!flights.length) return { minPriceResults: 5150, maxPriceResults: 30000 };
    const prices = flights.map(f => f.price);
    return {
      minPriceResults: Math.min(...prices),
      maxPriceResults: Math.max(...prices)
    };
  }, [flights]);

  const cheapestPrice = minPriceResults;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Sort Tabs */}
      <div className="flex items-center gap-3 mb-5">
        {SORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleSortTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${activeSort === tab.key
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-800">{sortedFlights.length}</span> of{" "}
          <span className="font-semibold text-gray-800">{totalFlights}</span> flights found
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort By</span>
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split("-");
              onSortChange(s, o);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="price-asc">Price (Cheapest)</option>
            <option value="departure-asc">Departure (Earliest)</option>
            <option value="duration-asc">Duration (Fastest)</option>
            <option value="arrival-asc">Arrival (Earliest)</option>
            <option value="best-asc">Best Value</option>
          </select>
        </div>
      </div>

      <div className="flex items-start gap-6">
        {/* ──────────── LEFT SIDEBAR: FILTERS ──────────── */}
        <aside className="w-72 flex-shrink-0 hidden lg:block sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar scroll-smooth">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <HiFilter className="w-5 h-5 text-gray-600" /> Filters
              </h3>
              <button
                onClick={() =>
                  onFilterChange({
                    minPrice: undefined,
                    maxPrice: undefined,
                    airline: undefined,
                    maxStops: undefined,
                    departureTimeFrom: undefined,
                    departureTimeTo: undefined,
                    refundable: false,
                  })
                }
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset All
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Stops */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Stops</h4>
                <div className="flex gap-2">
                  {[
                    { label: "Non Stop", val: 0 },
                    { label: "1 Stop", val: 1 },
                    { label: "2+", val: 2 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() =>
                        onFilterChange({
                          maxStops:
                            filterParams.maxStops === opt.val ? undefined : opt.val,
                        })
                      }
                      className={`flex-1 text-center py-3 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${filterParams.maxStops === opt.val
                        ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                        : "border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                        }`}
                    >
                      <div>{opt.label}</div>
                      {stopPrices[opt.val] < Infinity && (
                        <div className={`text-[9px] mt-1 ${filterParams.maxStops === opt.val ? 'text-white/80' : 'text-slate-400'}`}>
                          ₹{stopPrices[opt.val]}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Range</h4>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">₹{(filterParams.maxPrice || maxPriceResults).toLocaleString('en-IN')}</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min={minPriceResults}
                    max={maxPriceResults}
                    step="100"
                    value={filterParams.maxPrice || maxPriceResults}
                    onChange={(e) =>
                      onFilterChange({
                        maxPrice: Number(e.target.value),
                      })
                    }
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>₹{minPriceResults.toLocaleString('en-IN')}</span>
                    <span>₹{maxPriceResults.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Fare Type */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Fare Type</h4>
                {searchParams?.specialFare && FARE_DISCOUNTS[searchParams.specialFare] && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                    <span className="text-sm">{FARE_DISCOUNTS[searchParams.specialFare].icon}</span>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{FARE_DISCOUNTS[searchParams.specialFare].label}</span>
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer border border-slate-50 p-3 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all">
                  <input
                    type="checkbox"
                    checked={filterParams.refundable === true}
                    onChange={(e) => onFilterChange({ refundable: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-200 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Refundable</span>
                </label>
              </div>

              {/* Departure Times */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Departure Times
                </h4>
                <p className="text-[10px] font-semibold text-slate-400 mb-3 uppercase tracking-wider">From {searchParams?.fromCity || searchParams?.from}</p>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_BLOCKS.map((block) => (
                    <button
                      key={block.from}
                      onClick={() =>
                        onFilterChange({
                          departureTimeFrom:
                            filterParams.departureTimeFrom === block.from
                              ? undefined
                              : block.from,
                          departureTimeTo:
                            filterParams.departureTimeFrom === block.from
                              ? undefined
                              : block.to,
                        })
                      }
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-all ${filterParams.departureTimeFrom === block.from
                        ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                        : "border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                        }`}
                    >
                      <block.icon className="w-4 h-4 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrival Times */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Arrival Times
                </h4>
                <p className="text-[10px] font-semibold text-slate-400 mb-3 uppercase tracking-wider">At {searchParams?.toCity || searchParams?.to}</p>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_BLOCKS.map((block) => (
                    <button
                      key={"arr-" + block.from}
                      onClick={() =>
                        onFilterChange({
                          arrivalTimeFrom:
                            filterParams.arrivalTimeFrom === block.from
                              ? undefined
                              : block.from,
                          arrivalTimeTo:
                            filterParams.arrivalTimeFrom === block.from
                              ? undefined
                              : block.to,
                        })
                      }
                      className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-all ${filterParams.arrivalTimeFrom === block.from
                        ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                        : "border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                        }`}
                    >
                      <block.icon className="w-4 h-4 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Airlines */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Airlines</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 thick-scrollbar">
                  {airlines.map((air) => (
                    <label key={air} className="flex items-center justify-between group cursor-pointer border border-slate-50 p-3 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filterParams.airline === air}
                          onChange={(e) =>
                            onFilterChange({ airline: e.target.checked ? air : undefined })
                          }
                          className="w-4 h-4 rounded border-slate-200 text-red-500 focus:ring-red-500"
                        />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-red-600 transition-colors">{air} ({Math.floor(Math.random() * 50) + 10})</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter group-hover:text-red-500 transition-colors font-semibold">₹{(Math.floor(Math.random() * 5000) + 5000).toLocaleString('en-IN')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Connecting Airports */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Connecting Airports</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 thick-scrollbar font-medium">
                  {["Mumbai", "Delhi", "Bangalore", "Goa", "Kolkata", "Hyderabad", "Chennai", "Kochi", "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Guwahati", "Chandigarh", "Srinagar", "Patna", "Indore", "Bhopal", "Bhubaneswar"].map((city, idx) => {
                    const isVisible = showMoreAirports || idx < 4;
                    if (!isVisible) return null;
                    return (
                      <label key={city} className="flex items-center justify-between group cursor-pointer border border-slate-50 p-3 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={filterParams.connectingAirport === city}
                            onChange={(e) =>
                              onFilterChange({ connectingAirport: e.target.checked ? city : undefined })
                            }
                            className="w-4 h-4 rounded border-slate-200 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest group-hover:text-red-600 transition-colors">{city}</span>
                        </div>
                      </label>
                    );
                  })}
                  <button
                    onClick={() => setShowMoreAirports(!showMoreAirports)}
                    className="text-[10px] font-bold text-blue-600 hover:text-red-500 uppercase tracking-widest mt-2"
                  >
                    {showMoreAirports ? "- Show Less" : "+ 12 Airports"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ──────────── MAIN RESULTS ──────────── */}
        <div className="flex-1 min-w-0">
          {/* Date Strip */}
          <DateStrip
            activeDate={searchParams?.departureDate}
            onDateSelect={(d) => onFilterChange(d)}
            flightsCount={sortedFlights.length}
            cheapestPrice={cheapestPrice}
            loading={loading}
          />

          <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-5 flex items-center justify-between mb-6 group">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-100 group-hover:scale-110 transition-transform">
                <FaPlane className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Search result includes airports near {searchParams?.fromCity || "Your Origin"} [{searchParams?.fromCode || "ORIGIN"}]</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase mt-1 tracking-wider">| {searchParams?.toCity || "Your Destination"} [{searchParams?.toCode || "DEST"}]</p>
              </div>
            </div>
            <button className="text-slate-300 hover:text-red-500 transition-colors text-lg">×</button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <HiOutlineRefresh className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Searching for the best flights...</p>
            </div>
          ) : sortedFlights.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FaPlane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No flights found. Try different dates or filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tripType === "round-trip" && returnFlights?.length > 0
                ? sortedFlights.map((f, i) => (
                  <FlightCard
                    key={f._id + (returnFlights[i]?._id || i)}
                    flight={f}
                    returnFlight={returnFlights[i]}
                    tripType={tripType}
                    onBook={onBook}
                    specialFare={searchParams?.specialFare}
                    searchParams={searchParams}
                  />
                ))
                : sortedFlights.map((flight) => (
                  <FlightCard
                    key={flight._id}
                    flight={flight}
                    tripType={tripType}
                    onBook={onBook}
                    specialFare={searchParams?.specialFare}
                    searchParams={searchParams}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlightResults;
