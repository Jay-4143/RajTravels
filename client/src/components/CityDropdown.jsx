import { useState, useRef, useEffect, useCallback } from "react";
import { HiSearch } from "react-icons/hi";
import { FaPlane, FaCity } from "react-icons/fa";
import { searchLocations } from "../api/autocomplete";

/* Hardcoded fallback for when API is unavailable */
const FALLBACK_AIRPORTS = [
  { city: "New Delhi", code: "DEL", name: "Indira Gandhi International", country: "India", flag: "🇮🇳" },
  { city: "Mumbai", code: "BOM", name: "Chhatrapati Shivaji International", country: "India", flag: "🇮🇳" },
  { city: "Bangalore", code: "BLR", name: "Bengaluru International Airport", country: "India", flag: "🇮🇳" },
  { city: "Chennai", code: "MAA", name: "Chennai International Airport", country: "India", flag: "🇮🇳" },
  { city: "Kolkata", code: "CCU", name: "Netaji Subhash Chandra Bose International", country: "India", flag: "🇮🇳" },
  { city: "Hyderabad", code: "HYD", name: "Rajiv Gandhi International Airport", country: "India", flag: "🇮🇳" },
  { city: "Pune", code: "PNQ", name: "Pune Airport", country: "India", flag: "🇮🇳" },
  { city: "Ahmedabad", code: "AMD", name: "Sardar Vallabhbhai Patel International", country: "India", flag: "🇮🇳" },
  { city: "Goa", code: "GOI", name: "Goa International Airport", country: "India", flag: "🇮🇳" },
  { city: "Jaipur", code: "JAI", name: "Jaipur International Airport", country: "India", flag: "🇮🇳" },
  { city: "Kochi", code: "COK", name: "Cochin International Airport", country: "India", flag: "🇮🇳" },
  { city: "Lucknow", code: "LKO", name: "Chaudhary Charan Singh International", country: "India", flag: "🇮🇳" },
  { city: "Dubai", code: "DXB", name: "Dubai International Airport", country: "UAE", flag: "🇦🇪" },
  { city: "Singapore", code: "SIN", name: "Changi Airport", country: "Singapore", flag: "🇸🇬" },
  { city: "London", code: "LHR", name: "Heathrow Airport", country: "UK", flag: "🇬🇧" },
  { city: "New York", code: "JFK", name: "John F Kennedy International", country: "USA", flag: "🇺🇸" },
  { city: "Bangkok", code: "BKK", name: "Suvarnabhumi Airport", country: "Thailand", flag: "🇹🇭" },
  { city: "Paris", code: "CDG", name: "Charles de Gaulle Airport", country: "France", flag: "🇫🇷" },
];

const HOLIDAY_DESTINATIONS = [
  ...[
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah", "Ranchi", "Gwalior", "Jabalpur", "Coimbatore", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh", "Mysore", "Gurugram", "Bhubaneswar", "Thiruvananthapuram", "Kochi", "Dehradun", "Rishikesh", "Shimla", "Manali", "Darjeeling", "Gangtok", "Udaipur", "Jaisalmer", "Ooty", "Munnar", "Wayanad", "Varkala", "Alleppey", "Tirupati", "Puducherry", "Agartala", "Shillong", "Port Blair", "Goa", "Pune"
  ].map(city => ({ code: city.substring(0, 3).toUpperCase(), city, name: city, subType: "CITY", countryDesc: "India", flagUrl: "https://flagcdn.com/w20/in.png" })),
  { code: "DOM", city: "Domestic", name: "Domestic", subType: "REGION", flagUrl: "https://flagcdn.com/w20/in.png" },
  { code: "NA", city: "North America", name: "North America", subType: "REGION" },
  { code: "SA", city: "South America", name: "South America", subType: "REGION" },
  { code: "AS", city: "American Samoa", name: "American Samoa", subType: "COUNTRY", countryDesc: "American Samoa", flagUrl: "https://flagcdn.com/w20/as.png" },
  { code: "AM", city: "Armenia", name: "Armenia", subType: "COUNTRY", countryDesc: "Armenia", flagUrl: "https://flagcdn.com/w20/am.png" },
  { code: "BS", city: "Bahamas", name: "Bahamas", subType: "COUNTRY", countryDesc: "Bahamas", flagUrl: "https://flagcdn.com/w20/bs.png" },
  { code: "MY", city: "Malaysia", name: "Malaysia", subType: "COUNTRY", countryDesc: "Malaysia", flagUrl: "https://flagcdn.com/w20/my.png" },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur", subType: "CITY", countryDesc: "Malaysia", flagUrl: "https://flagcdn.com/w20/my.png" },
  { code: "TH", city: "Thailand", name: "Thailand", subType: "COUNTRY", countryDesc: "Thailand", flagUrl: "https://flagcdn.com/w20/th.png" },
  { code: "BKK", city: "Bangkok", name: "Bangkok", subType: "CITY", countryDesc: "Thailand", flagUrl: "https://flagcdn.com/w20/th.png" },
  { code: "HKT", city: "Phuket", name: "Phuket", subType: "CITY", countryDesc: "Thailand", flagUrl: "https://flagcdn.com/w20/th.png" },
  { code: "SG", city: "Singapore", name: "Singapore", subType: "COUNTRY", countryDesc: "Singapore", flagUrl: "https://flagcdn.com/w20/sg.png" },
  { code: "AE", city: "United Arab Emirates", name: "United Arab Emirates", subType: "COUNTRY", countryDesc: "United Arab Emirates", flagUrl: "https://flagcdn.com/w20/ae.png" },
  { code: "DXB", city: "Dubai", name: "Dubai", subType: "CITY", countryDesc: "United Arab Emirates", flagUrl: "https://flagcdn.com/w20/ae.png" },
  { code: "AUH", city: "Abu Dhabi", name: "Abu Dhabi", subType: "CITY", countryDesc: "United Arab Emirates", flagUrl: "https://flagcdn.com/w20/ae.png" },
  { code: "VN", city: "Vietnam", name: "Vietnam", subType: "COUNTRY", countryDesc: "Vietnam", flagUrl: "https://flagcdn.com/w20/vn.png" },
  { code: "HAN", city: "Hanoi", name: "Hanoi", subType: "CITY", countryDesc: "Vietnam", flagUrl: "https://flagcdn.com/w20/vn.png" },
  { code: "ID", city: "Indonesia", name: "Indonesia", subType: "COUNTRY", countryDesc: "Indonesia", flagUrl: "https://flagcdn.com/w20/id.png" },
  { code: "DPS", city: "Bali", name: "Bali", subType: "CITY", countryDesc: "Indonesia", flagUrl: "https://flagcdn.com/w20/id.png" },
];

const COUNTRY_FLAGS = {
  IN: "🇮🇳", US: "🇺🇸", GB: "🇬🇧", AE: "🇦🇪", SG: "🇸🇬", TH: "🇹🇭",
  FR: "🇫🇷", DE: "🇩🇪", JP: "🇯🇵", AU: "🇦🇺", CA: "🇨🇦", IT: "🇮🇹",
  ES: "🇪🇸", NL: "🇳🇱", CH: "🇨🇭", MY: "🇲🇾", ID: "🇮🇩", CN: "🇨🇳",
  KR: "🇰🇷", TR: "🇹🇷", QA: "🇶🇦", OM: "🇴🇲", KE: "🇰🇪", ZA: "🇿🇦",
  NZ: "🇳🇿", BR: "🇧🇷", MX: "🇲🇽", EG: "🇪🇬", LK: "🇱🇰", BD: "🇧🇩",
  PK: "🇵🇰", NP: "🇳🇵",
};

const CityDropdown = ({ isOpen, onClose, onSelect, position, className = "", label = "Destination", type }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Debounced API search
  const fetchLocations = useCallback((query) => {
    if (type === "holidays") return; // API bypass for holidays

    if (query.length < 2) {
      setApiResults([]);
      return;
    }
    setLoading(true);
    searchLocations(query, type)
      .then((res) => {
        const locations = res.data?.locations || [];
        setApiResults(
          locations.filter(loc => loc && (loc.name || loc.cityName)).map((loc) => ({
            city: loc.cityName || loc.name,
            code: loc.iataCode,
            name: loc.name || loc.cityName,
            country: loc.countryCode || "",
            flag: COUNTRY_FLAGS[loc.countryCode] || "🌍",
            subType: loc.subType,
          }))
        );
        setUseApi(true);
      })
      .catch(() => {
        setUseApi(false);
        setApiResults([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchLocations(searchQuery), 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, fetchLocations]);

  // Determine which list to display
  let displayList = [];

  if (type === "holidays") {
    displayList = HOLIDAY_DESTINATIONS.filter(
      (dest) =>
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    displayList = searchQuery.length >= 2 && useApi && apiResults.length > 0
      ? apiResults
      : FALLBACK_AIRPORTS
        .map(airport => type === 'hotels' ? ({ ...airport, subType: 'CITY', name: airport.city }) : airport)
        .filter(
          (airport) =>
            (airport.city && airport.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (airport.code && airport.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (airport.name && airport.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
  }

  const handleSelect = (airport) => {
    if (type === "holidays") {
      onSelect(airport.name);
    } else {
      // Pass the IATA code as the identifier for Amadeus API
      onSelect(`${airport.city} (${airport.code})`);
    }
    setSearchQuery("");
    setApiResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 min-w-[320px] md:min-w-[450px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
      style={{
        top: position?.top ?? "100%",
        left: position?.left ?? 0,
        right: position?.right,
        bottom: position?.bottom,
        ...position
      }}
    >
      {/* Search Input Area */}
      <div className="p-4 bg-white">
        <div className="relative flex items-center">
          <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">
            {label}
          </label>
          <div className="relative w-full">
            <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={type === 'holidays' ? "Find Destination" : type === 'hotels' ? "Search city or hotel name" : "Search airport, city, or IATA code"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-bold text-slate-800 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sections and Scrollable List */}
      <div className="max-h-[450px] overflow-y-auto custom-scrollbar thick-scrollbar">
        {loading && (
          <div className="px-4 py-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-bold uppercase tracking-widest text-[10px]">Searching...</span>
          </div>
        )}

        {displayList.length === 0 && !loading ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm italic font-medium">No results found for "{searchQuery}"</div>
        ) : (
          <>
            {/* Group Header */}
            {type !== 'holidays' && (
              <div className="px-4 py-2 bg-slate-50/80 border-y border-slate-100">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {searchQuery.length >= 2 ? "Search Results" :
                    (type === 'hotels' ? "Previously Searched Cities" : "Previously Searched Sectors")}
                </h3>
              </div>
            )}

            {displayList.map((airport) => (
              <button
                key={airport.code + (airport.subType || "")}
                type="button"
                onClick={() => handleSelect(airport)}
                className="w-full px-4 py-3 hover:bg-slate-50 transition-all text-left group border-b border-slate-50 last:border-0"
              >
                {type === 'holidays' ? (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[15px] font-medium text-slate-800 transition-colors">
                        {airport.name}
                      </span>
                      {airport.countryDesc && (
                        <p className="text-[12px] text-slate-400 capitalize tracking-tight mt-0.5">
                          {airport.countryDesc}
                        </p>
                      )}
                    </div>
                    {airport.flagUrl && (
                      <div className="flex-shrink-0 flex items-center justify-center -translate-y-1">
                        <img src={airport.flagUrl} alt="" className="w-[22px] h-auto object-cover rounded-[2px]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
                        {airport.subType === "CITY" ? (
                          <FaCity className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        ) : airport.subType === "HOTEL" ? (
                          <span className="text-sm">🏨</span>
                        ) : (
                          <FaPlane className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                            {airport.name === airport.city ? airport.city : airport.name}
                          </span>
                          {airport.code && (
                            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase">
                              {airport.code}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase truncate tracking-tight">
                          {airport.name === airport.city ? airport.country : airport.city + ", " + airport.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xl shadow-sm rounded-md overflow-hidden leading-none">{airport.flag}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{airport.country}</span>
                    </div>
                  </div>
                )}
              </button>
            ))}

            {searchQuery.length < 2 && type !== 'holidays' && (
              <>
                <div className="px-4 py-2 bg-slate-50/80 border-y border-slate-100 mt-2">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {type === 'hotels' ? "Important Cities" : "Important Airports"}
                  </h3>
                </div>
                {FALLBACK_AIRPORTS.slice(0, 8).map((airport) => (
                  <button
                    key={airport.code + "_popular"}
                    type="button"
                    onClick={() => handleSelect(airport)}
                    className="w-full px-4 py-4 hover:bg-slate-50 transition-all text-left group border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
                          {type === 'hotels' ? (
                            <FaCity className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          ) : (
                            <FaPlane className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                              {airport.city}
                            </span>
                            {type !== 'hotels' && (
                              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase">
                                {airport.code}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-bold uppercase truncate tracking-tight">
                            {airport.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xl shadow-sm rounded-md overflow-hidden leading-none">{airport.flag}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{airport.country}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CityDropdown;
