import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { HiSearch } from "react-icons/hi";
import { FaExchangeAlt, FaCalendarAlt, FaUser, FaChevronDown } from "react-icons/fa";
import CityDropdown from "./CityDropdown";
import CalendarComponent from "./CalendarComponent";
import TravellerDropdown from "./TravellerDropdown";

const TRIP_TYPES = [
  { id: "oneway", label: "One Way" },
  { id: "round", label: "Round Trip" },
  { id: "multi", label: "Multi City" },
];

const travelClassToApi = (label) => {
  const map = { Economy: "economy", "Premium Economy": "premium_economy", Business: "business", "First Class": "first" };
  return map[label] || "economy";
};

const Hero = ({ onSearch }) => {
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("Mumbai");
  const [fromCode, setFromCode] = useState("BOM");
  const [fromAirport, setFromAirport] = useState("BOM, Chhatrapati Shivaji Inter...");
  const [to, setTo] = useState("New Delhi");
  const [toCode, setToCode] = useState("DEL");
  const [toAirport, setToAirport] = useState("DEL, Indira Gandhi Internatio...");
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState(today);
  const [returnDate, setReturnDate] = useState("");

  // Multi-city segments
  const [segments, setSegments] = useState([
    { id: 1, from: "Mumbai", fromCode: "BOM", to: "New Delhi", toCode: "DEL", date: today },
    { id: 2, from: "New Delhi", fromCode: "DEL", to: "Bangalore", toCode: "BLR", date: tomorrow }
  ]);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [defenceFare, setDefenceFare] = useState(false);
  const [studentFare, setStudentFare] = useState(false);
  const [seniorFare, setSeniorFare] = useState(false);

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState("departure");
  const [travellerDropdownOpen, setTravellerDropdownOpen] = useState(false);

  // For multi-city dropdowns
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [activeSegmentField, setActiveSegmentField] = useState(""); // "from", "to", "date"

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const searchCardRef = useRef(null);

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentFlightSearches");
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 3));
  }, []);

  const saveSearch = (data) => {
    const searchObj = {
      from: data.fromCity || data.from,
      to: data.toCity || data.to,
      fromCode: data.fromCode || data.from,
      toCode: data.toCode || data.to,
      date: data.departureDate,
      timestamp: Date.now()
    };
    const updated = [searchObj, ...recentSearches.filter(s => s.fromCode !== searchObj.fromCode || s.toCode !== searchObj.toCode)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem("recentFlightSearches", JSON.stringify(updated));
  };

  const totalTravellers = adults + children + infants;
  const travellerSummary = totalTravellers === 1 ? "1 Traveller" : `${totalTravellers} Travellers`;

  const handleSwap = () => {
    const tempCity = from;
    const tempCode = fromCode;
    const tempAirport = fromAirport;
    setFrom(to);
    setFromCode(toCode);
    setFromAirport(toAirport);
    setTo(tempCity);
    setToCode(toCode);
    setToAirport(tempAirport);
  };

  const handleFromSelect = (value) => {
    const match = value.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
    const city = match ? match[1].trim() : value;
    const code = match ? match[2] : value.toUpperCase().slice(0, 3);

    if (city === to && tripType !== 'multi') {
      toast.error("Source and destination cities cannot be the same");
      return;
    }

    if (tripType === 'multi') {
      const newSegments = [...segments];
      newSegments[activeSegmentIndex].from = city;
      newSegments[activeSegmentIndex].fromCode = code;
      setSegments(newSegments);
    } else {
      setFrom(city);
      setFromCode(code);
      setFromAirport(`${code}, ${city} International`);
      // Auto-flow: Open To dropdown after selecting From
      setFromDropdownOpen(false);
      setTimeout(() => setToDropdownOpen(true), 100);
    }
    setFromDropdownOpen(false);
  };

  const handleToSelect = (value) => {
    const match = value.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
    const city = match ? match[1].trim() : value;
    const code = match ? match[2] : value.toUpperCase().slice(0, 3);

    if (city === from && tripType !== 'multi') {
      toast.error("Destination and source cities cannot be the same");
      return;
    }

    if (tripType === 'multi') {
      const newSegments = [...segments];
      newSegments[activeSegmentIndex].to = city;
      newSegments[activeSegmentIndex].toCode = code;
      setSegments(newSegments);
    } else {
      setTo(city);
      setToCode(code);
      setToAirport(`${code}, ${city} International`);
      // Auto-flow: Open Calendar after selecting To
      setToDropdownOpen(false);
      setTimeout(() => {
        setActiveField("departure");
        setCalendarOpen(true);
      }, 100);
    }
    setToDropdownOpen(false);
  };

  const addSegment = () => {
    if (segments.length >= 5) return;
    const last = segments[segments.length - 1];
    setSegments([...segments, {
      id: Date.now(),
      from: last.to,
      fromCode: last.toCode,
      to: "",
      toCode: "",
      date: ""
    }]);
  };

  const removeSegment = (id) => {
    if (segments.length <= 2) return;
    setSegments(segments.filter(s => s.id !== id));
  };

  const updateSegmentDate = (date) => {
    const newSegments = [...segments];
    newSegments[activeSegmentIndex].date = date;
    setSegments(newSegments);
    setCalendarOpen(false);
  };

  const setTripTypeWithClear = (id) => {
    setTripType(id);
    if (id === "oneway") setReturnDate("");
  };

  const openDepartureCalendar = () => {
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
    setTravellerDropdownOpen(false);
    setActiveField("departure");
    setCalendarOpen(true);
  };

  const openReturnCalendar = () => {
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
    setTravellerDropdownOpen(false);
    setTripType("round");
    setActiveField("return");
    setCalendarOpen(true);
  };

  const getDropdownPosition = (ref) => {
    if (!ref.current) return {};
    return { top: "100%", left: "0px" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T12:00:00");
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}'${year}`;
  };

  const getDayName = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleString("en-US", { weekday: "long" });
  };

  const handleSearchClick = () => {
    if (tripType === 'multi') {
      const invalid = segments.some(s => !s.fromCode || !s.toCode || !s.date);
      if (invalid) {
        toast.error("Please fill all cities and dates for multi-city search.");
        return;
      }
      onSearch?.({
        tripType: 'multi-city',
        segments: segments.map(s => ({
          from: s.fromCode,
          to: s.toCode,
          date: s.date
        })),
        adults,
        children,
        infants,
        travelClass: travelClassToApi(travelClass),
        directOnly
      });
    } else {
      if (!from || !to || !departureDate) {
        toast.error("Please select From, To, and Departure date.");
        return;
      }
      if (tripType === "round" && !returnDate) {
        toast.error("Please select Return date for round trip.");
        return;
      }
      const searchData = {
        from: fromCode,
        to: toCode,
        fromCity: from,
        toCity: to,
        departureDate,
        returnDate: tripType === "round" ? returnDate : undefined,
        tripType: tripType === "round" ? "round-trip" : "one-way",
        adults,
        children,
        infants,
        travelClass: travelClassToApi(travelClass),
        directOnly,
      };
      saveSearch(searchData);
      onSearch?.(searchData);
    }
  };

  return (
    <section
      className="relative min-h-[600px] flex items-start justify-center pt-8 pb-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center gap-2 text-white text-xl font-bold drop-shadow-lg">
            <span className="text-2xl">✈</span>
            Book Flight Tickets
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {TRIP_TYPES.map(({ id, label }) => (
            <label
              key={id}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${tripType === id
                ? "bg-white text-red-500 shadow-lg"
                : "bg-white/90 text-gray-600 hover:bg-white hover:shadow-md"
                }`}
            >
              <input
                type="radio"
                name="tripType"
                value={id}
                checked={tripType === id}
                onChange={() => setTripTypeWithClear(id)}
                className="sr-only"
              />
              <span
                className={`w-3 h-3 rounded-full border-2 ${tripType === id ? "border-red-500 bg-red-500" : "border-gray-400"
                  }`}
              />
              {label}
            </label>
          ))}
        </div>

        <div ref={searchCardRef} className="relative bg-white rounded-2xl shadow-2xl p-6">
          {tripType === "multi" ? (
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <div key={segment.id} className="flex items-end gap-0 relative group">
                  <div className="flex-1 border-r border-gray-200 pr-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSegmentIndex(index);
                        setActiveSegmentField("from");
                        setFromDropdownOpen(true);
                        setToDropdownOpen(false);
                      }}
                      className="w-full text-left font-bold text-gray-900 border-b border-transparent hover:border-blue-300 pb-1"
                    >
                      {segment.from || "Select Source"}
                    </button>
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSegmentIndex(index);
                        setActiveSegmentField("to");
                        setToDropdownOpen(true);
                        setFromDropdownOpen(false);
                      }}
                      className="w-full text-left font-bold text-gray-900 border-b border-transparent hover:border-blue-300 pb-1"
                    >
                      {segment.to || "Select Destination"}
                    </button>
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Departure</label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSegmentIndex(index);
                        setActiveField("multi");
                        setCalendarOpen(true);
                      }}
                      className="w-full text-left font-bold text-gray-900 border-b border-transparent hover:border-blue-300 pb-1"
                    >
                      {segment.date ? formatDate(segment.date) : "Select Date"}
                    </button>
                  </div>
                  {index > 1 && (
                    <button
                      onClick={() => removeSegment(segment.id)}
                      className="p-2 text-gray-400 hover:text-red-500 absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={addSegment}
                  disabled={segments.length >= 5}
                  className="text-blue-600 text-sm font-bold hover:underline disabled:text-gray-400"
                >
                  + Add Another City
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button onClick={() => setTravellerDropdownOpen(!travellerDropdownOpen)} className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      <FaUser className="w-3 h-3" /> {travellerSummary}, {travelClass}
                    </button>
                  </div>
                  <button
                    onClick={handleSearchClick}
                    className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    Search Multi-City
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-0">
              {/* From */}
              <div className="flex-1 relative border-r border-gray-200 pr-4" ref={fromRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                <button
                  type="button"
                  onClick={() => {
                    setFromDropdownOpen(!fromDropdownOpen);
                    setToDropdownOpen(false);
                    setCalendarOpen(false);
                    setTravellerDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="text-lg font-bold text-gray-900 mb-0.5">{from} ({fromCode})</div>
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span className="truncate">{fromAirport}</span>
                    <FaChevronDown className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </button>
              </div>

              <div className="flex items-center px-0 pb-2 -mx-4 z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg border-2 border-white transform hover:scale-110 active:scale-95"
                  aria-label="Swap"
                >
                  <FaExchangeAlt className="w-4 h-4" />
                </button>
              </div>

              {/* To */}
              <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4" ref={toRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                <button
                  type="button"
                  onClick={() => {
                    setToDropdownOpen(!toDropdownOpen);
                    setFromDropdownOpen(false);
                    setCalendarOpen(false);
                    setTravellerDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="text-lg font-bold text-gray-900 mb-0.5">{to} ({toCode})</div>
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span className="truncate">{toAirport}</span>
                    <FaChevronDown className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </button>
              </div>

              {/* Departure */}
              <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4">
                <button
                  type="button"
                  onClick={openDepartureCalendar}
                  className="w-full text-left focus:outline-none"
                >
                  <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "departure" ? "text-blue-600" : "text-gray-500"}`}>
                    Departure
                  </label>
                  <div className="flex items-center justify-between">
                    {departureDate ? (
                      <>
                        <div>
                          <div className="text-base font-bold text-gray-900">{formatDate(departureDate)}</div>
                          <div className="text-xs text-gray-500">{getDayName(departureDate)}</div>
                        </div>
                        <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-gray-400">Select date</div>
                        <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Return */}
              <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4">
                <button
                  type="button"
                  onClick={tripType === "oneway" ? undefined : openReturnCalendar}
                  disabled={tripType === "oneway"}
                  className={`w-full text-left focus:outline-none ${tripType === "oneway" ? "cursor-default opacity-50" : ""}`}
                >
                  <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "return" ? "text-red-600" : "text-gray-500"}`}>
                    Return
                  </label>
                  {tripType === "oneway" ? (
                    <div className="text-xs text-gray-400 leading-tight">
                      Book a round trip
                      <br />
                      to save more
                    </div>
                  ) : returnDate ? (
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <div className="text-base font-bold text-gray-900">{formatDate(returnDate)}</div>
                        <div className="text-xs text-gray-500">{getDayName(returnDate)}</div>
                      </div>
                      <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">Select date</div>
                      <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </div>
                  )}
                </button>
              </div>

              {/* Travellers & Class */}
              <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Travellers & Class</label>
                <button
                  type="button"
                  onClick={() => {
                    setTravellerDropdownOpen(!travellerDropdownOpen);
                    setFromDropdownOpen(false);
                    setToDropdownOpen(false);
                    setCalendarOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-base font-bold text-gray-900">{travellerSummary}</div>
                      <div className="text-xs text-gray-500">{travelClass}</div>
                    </div>
                    <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              </div>

              <div className="flex-shrink-0 pl-4">
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-base uppercase tracking-wide"
                >
                  <HiSearch className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Conditional Dropdowns */}
          <CityDropdown
            isOpen={fromDropdownOpen}
            onClose={() => setFromDropdownOpen(false)}
            onSelect={handleFromSelect}
          />
          <CityDropdown
            isOpen={toDropdownOpen}
            onClose={() => setToDropdownOpen(false)}
            onSelect={handleToSelect}
          />

          {/* Checkbox row & Recently Searched */}
          {tripType !== "multi" && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                  <span className="text-sm text-gray-600 font-medium group-hover:text-red-500 transition-colors">Direct Flights</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={defenceFare} onChange={(e) => setDefenceFare(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                  <span className="text-sm text-gray-600 font-medium group-hover:text-red-500 transition-colors">Defence Fare</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={studentFare} onChange={(e) => setStudentFare(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                  <span className="text-sm text-gray-600 font-medium group-hover:text-red-500 transition-colors">Student Fare</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={seniorFare} onChange={(e) => setSeniorFare(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
                  <span className="text-sm text-gray-600 font-medium group-hover:text-red-500 transition-colors">Senior Citizen Fare</span>
                </label>
              </div>

              {recentSearches.length > 0 && (
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recently Searched:</span>
                  <div className="flex gap-2">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setFrom(s.from);
                          setFromCode(s.fromCode);
                          setTo(s.to);
                          setToCode(s.toCode);
                          setDepartureDate(s.date);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1">
                          {s.fromCode}<FaExchangeAlt className="w-2 h-2" />{s.toCode}
                        </span>
                        <span className="text-gray-400 font-normal">| {s.date.split('-').reverse().slice(0, 2).join(' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Shared Panel positioning */}
          <div className="absolute left-0 right-0 top-full pt-2">
            <CalendarComponent
              isOpen={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              departureDate={activeField === 'multi' ? segments[activeSegmentIndex].date : departureDate}
              returnDate={returnDate}
              activeField={activeField}
              onSelectDeparture={(d) => {
                if (activeField === 'multi') updateSegmentDate(d);
                else {
                  setDepartureDate(d);
                  // Auto-flow: open travellers after selecting departure (if one-way)
                  if (tripType === 'oneway') {
                    setCalendarOpen(false);
                    setTimeout(() => setTravellerDropdownOpen(true), 150);
                  }
                }
              }}
              onSelectReturn={(d) => {
                setReturnDate(d);
                // Auto-flow: open travellers after selecting return date
                setCalendarOpen(false);
                setTimeout(() => setTravellerDropdownOpen(true), 150);
              }}
              isRoundTrip={tripType === "round"}
            />
          </div>

          <div className="absolute left-0 right-0 top-full pt-2">
            <TravellerDropdown
              isOpen={travellerDropdownOpen}
              onClose={() => setTravellerDropdownOpen(false)}
              adults={adults}
              children={children}
              infants={infants}
              travelClass={travelClass}
              onApply={({ adults: a, children: c, infants: i, travelClass: tc }) => {
                setAdults(a);
                setChildren(c);
                setInfants(i);
                setTravelClass(tc);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
