import { useState, useMemo } from "react";
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

/* ──────────── FLIGHT CARD ──────────── */
const FlightCard = ({ flight, tripType, returnFlight, onBook }) => {
  const { formatPrice } = useGlobal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const baggage = flight.baggage
    ? `${flight.baggage.cabin || "7 kg"} cabin, ${flight.baggage.checkIn || "15 kg"} check-in`
    : "7 kg cabin, 15 kg check-in";

  const isMulti = flight.itineraries?.length > 1;

  const TABS = [
    { id: 'info', label: 'Flight Information', icon: FaInfoCircle },
    { id: 'fare', label: 'Fare Summary & Rules', icon: FaFileAlt },
    { id: 'baggage', label: 'Baggage Information', icon: FaSuitcaseRolling },
  ];

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
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatTime(flight.departureTime)}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{flight.from}</p>
            </div>

            {/* Duration & stops */}
            <div className="flex-1 px-8">
              <div className="relative flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 mb-2">{formatDuration(flight.duration)}</span>
                <div className="w-full flex items-center gap-2">
                  <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
                  <FaPlane className="w-3.5 h-3.5 text-slate-300 transform -rotate-45" />
                  <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase mt-2 tracking-widest">
                  {flight.stops === 0 ? "Non Stop" : `${flight.stops} stop(s)`}
                </span>
                {flight.stops > 0 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-400 rounded-full border-2 border-white shadow-sm mt-1" />}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatTime(flight.arrivalTime)}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{flight.to}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-5 pt-5 border-t border-slate-50">
            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Meal, Seat are chargeable (More)
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
              <FaSuitcaseRolling className="w-3 h-3 text-slate-300" />
              {baggage}
            </span>
            <span className="text-[10px] font-bold text-red-500 uppercase ml-auto">{flight.seatsAvailable || 9} Left</span>
          </div>
        </div>

        {/* Price & Book section */}
        <div className="flex flex-col items-center justify-center p-6 border-l border-slate-50 min-w-[180px] bg-slate-50/30">
          <div className="text-right w-full mb-3">
            <p className="text-[10px] font-bold text-gray-400 line-through">₹{(flight.price * 1.1).toFixed(0)}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{formatPrice(flight.price)}</p>
            <p className="text-[10px] font-bold text-green-500">Extra ₹{((flight.price * 0.05).toFixed(0))} Off</p>
          </div>
          <button
            type="button"
            onClick={() => onBook(flight, tripType === "round-trip" ? returnFlight : null)}
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-red-200 active:scale-95"
          >
            View Fare
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[10px] font-black text-blue-600 hover:text-red-500 uppercase tracking-widest border-b-2 border-transparent hover:border-red-500 transition-all"
          >
            {isExpanded ? "- Hide Details" : "+ Details"}
          </button>
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
                className={`px-8 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-red-500 bg-white border-x border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-500" />}
              </button>
            ))}
          </div>

          <div className="p-8 bg-white">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm font-black text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100">
                  {flight.from} <span className="text-slate-300">→</span> {flight.to}, 18 Mar
                </div>
                <div className="flex gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-red-500 font-bold">
                        {flight.airlineCode || "AI"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 uppercase leading-none">{flight.airline} {flight.flightNumber || "IX-1232"}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Aircraft: Boeing 737Max | Economy</p>
                      </div>
                    </div>
                    <div className="flex gap-8 items-start relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 before:rounded-full">
                      <div className="w-9 space-y-20 z-10 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-white border-4 border-red-500 shadow-sm" />
                        <div className="w-8 h-8 rounded-full bg-white border-4 border-blue-500 shadow-sm" />
                      </div>
                      <div className="flex-1 space-y-16 py-1">
                        <div>
                          <p className="text-xl font-black text-slate-800 tracking-tighter">{formatTime(flight.departureTime)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Wed, 18 Mar 26 • Mumbai [BOM]</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">Chhatrapati Shivaji International airport | Terminal 2</p>
                        </div>
                        <div className="relative before:absolute before:-top-8 before:-left-[54px] before:w-12 before:h-[2px] before:bg-slate-100">
                          <p className="text-xl font-black text-slate-800 tracking-tighter">{formatTime(flight.arrivalTime)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Wed, 18 Mar 26 • Ghaziabad [HDO]</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">Hindon Airport, Delhi | Terminal 1</p>
                        </div>
                      </div>
                      <div className="w-48 text-center pt-8">
                        <div className="w-full h-[1px] bg-slate-100 mb-2" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDuration(flight.duration)}</p>
                        <div className="w-full h-[1px] bg-slate-100 mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'fare' && (
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Fare Breakdown</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">Base Fare</span>
                      <span className="text-slate-800 font-black">₹{(flight.price * 0.85).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">Taxes & Fees</span>
                      <span className="text-slate-800 font-black">₹{(flight.price * 0.15).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-base pt-3 border-t border-slate-100">
                      <span className="text-slate-800 font-black">Total Fare</span>
                      <span className="text-red-500 font-black">₹{flight.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Cancellation Rules</h5>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase">Cancellation fee of ₹3,000 applies if cancelled more than 48 hours before departure. No refund if cancelled less than 24 hours before departure.</p>
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
const DateStrip = ({ activeDate, onDateSelect, basePrice = 10301 }) => {
  const dates = useMemo(() => {
    const list = [];
    const base = new Date(activeDate + "T12:00:00");
    for (let i = -3; i <= 6; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push({
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }),
        price: basePrice + Math.floor(Math.random() * 2000) - 1000
      });
    }
    return list;
  }, [activeDate, basePrice]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-6 overflow-hidden flex items-stretch shadow-sm">
      <button className="px-3 border-r border-slate-100 hover:bg-slate-50 transition-colors text-slate-400">
        <FaChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        {dates.map((item) => (
          <button
            key={item.date}
            onClick={() => onDateSelect(item.date)}
            className={`flex-1 min-w-[120px] py-3 flex flex-col items-center justify-center border-r border-slate-50 transition-all ${activeDate === item.date ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeDate === item.date ? 'text-slate-400' : 'text-slate-400'}`}>{item.label}</span>
            <span className={`text-sm font-black tracking-tighter ${activeDate === item.date ? 'text-white' : 'text-slate-800'}`}>₹{item.price.toLocaleString('en-IN')}</span>
          </button>
        ))}
      </div>
      <button className="px-3 border-l border-slate-100 hover:bg-slate-50 transition-colors text-slate-400">
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

  const handleSortTab = (key) => {
    setActiveSort(key);
    if (key === "cheapest") onSortChange("price", "asc");
    else if (key === "fastest") onSortChange("duration", "asc");
    else onSortChange("price", "asc");
  };

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
          Showing <span className="font-semibold text-gray-800">{flights.length}</span> of{" "}
          <span className="font-semibold text-gray-800">{flights.length}</span> flights found
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
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="duration-asc">Duration</option>
            <option value="departure-asc">Departure ↑</option>
            <option value="departure-desc">Departure ↓</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ──────────── LEFT SIDEBAR: FILTERS ──────────── */}
        <aside className="w-72 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24 overflow-hidden">
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
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Stops</h4>
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
                      className={`flex-1 text-center py-3 px-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${filterParams.maxStops === opt.val
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
                <h4 className="text-sm font-bold text-gray-900 mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterParams.minPrice ?? ""}
                    onChange={(e) =>
                      onFilterChange({
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterParams.maxPrice ?? ""}
                    onChange={(e) =>
                      onFilterChange({
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Fare Type */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Fare Type</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterParams.refundable === true}
                    onChange={(e) => onFilterChange({ refundable: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Refundable</span>
                </label>
              </div>

              {/* Departure Times */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Departure Times
                </h4>
                <p className="text-xs text-gray-400 mb-2">From {searchParams?.fromCity || searchParams?.from}</p>
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
                      className={`flex flex-col items-center py-2.5 px-2 rounded-lg border text-xs transition-all ${filterParams.departureTimeFrom === block.from
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <block.icon className="w-4 h-4 mb-1" />
                      <span className="font-medium">{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrival Times */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  Arrival Times
                </h4>
                <p className="text-xs text-gray-400 mb-2">At {searchParams?.toCity || searchParams?.to}</p>
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
                      className={`flex flex-col items-center py-2.5 px-2 rounded-lg border text-xs transition-all ${filterParams.arrivalTimeFrom === block.from
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <block.icon className="w-4 h-4 mb-1" />
                      <span className="font-medium">{block.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Airlines */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Airlines</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                  {airlines.map((air) => (
                    <label key={air} className="flex items-center justify-between group cursor-pointer border border-slate-50 p-2.5 rounded-xl hover:bg-red-50 hover:border-red-100 transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filterParams.airline === air}
                          onChange={(e) =>
                            onFilterChange({ airline: e.target.checked ? air : undefined })
                          }
                          className="w-4 h-4 rounded border-slate-200 text-red-500 focus:ring-red-500"
                        />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-red-600 transition-colors">{air}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">₹10,301</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ──────────── MAIN RESULTS ──────────── */}
        <div className="flex-1 min-w-0">
          {/* Date Strip */}
          <DateStrip activeDate={searchParams?.departureDate} onDateSelect={(d) => onFilterChange({ departureDate: d })} />

          <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg">
                <FaPlane className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">The search result includes more airports near Navi Mumbai International Airport | Navi Mumbai | IN | India [NMI]</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">| Hindon Airport, Delhi | Ghaziabad | IN | India [HDO]</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">×</button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <HiOutlineRefresh className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Searching for the best flights...</p>
            </div>
          ) : flights.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FaPlane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No flights found. Try different dates or filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tripType === "round-trip" && returnFlights?.length > 0
                ? flights.map((f, i) => (
                  <FlightCard
                    key={f._id + (returnFlights[i]?._id || i)}
                    flight={f}
                    returnFlight={returnFlights[i]}
                    tripType={tripType}
                    onBook={onBook}
                  />
                ))
                : flights.map((flight) => (
                  <FlightCard
                    key={flight._id}
                    flight={flight}
                    tripType={tripType}
                    onBook={onBook}
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
