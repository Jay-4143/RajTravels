import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { HiSearch } from "react-icons/hi";
import { FaCalendarAlt, FaUser, FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";
import CalendarComponent from "./CalendarComponent";
import CityDropdown from "./CityDropdown";

const CITIES = [
  "Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Goa", "Jaipur", "Kochi", "Lucknow", "Udaipur",
  "Shimla", "Manali", "Darjeeling", "Ooty", "Mysore", "Agra", "Varanasi",
  "Dubai", "Bangkok", "Singapore", "London", "Dubai", "Port Blair", "Kodaikanal",
  "Mahabaleshwar", "Lonavala", "Rishikesh", "Haridwar", "Gangtok", "Leh",
];

const HotelSearch = ({ onSearch, compact = false, initialData = null }) => {
  const [city, setCity] = useState(initialData?.city || "");
  const [checkIn, setCheckIn] = useState(initialData?.checkIn || null);
  const [checkOut, setCheckOut] = useState(initialData?.checkOut || null);
  const [roomsData, setRoomsData] = useState(
    initialData?.roomsData || [{ adults: 2, children: 0, childAges: [] }]
  );
  const [editingRoomIndex, setEditingRoomIndex] = useState(0);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState("checkIn");
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const cityRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target) &&
        guestsRef.current && !guestsRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
        setGuestsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("hotel_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

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

  const saveSearch = (params) => {
    const newSearch = {
      ...params,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };

    const isDuplicate = recentSearches.some(s =>
      s.city === params.city &&
      s.checkIn === params.checkIn &&
      s.checkOut === params.checkOut &&
      JSON.stringify(s.roomsData) === JSON.stringify(params.roomsData)
    );

    if (isDuplicate) return;

    const updated = [newSearch, ...recentSearches].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem("hotel_recent_searches", JSON.stringify(updated));
  };

  const handleRecentClick = (search) => {
    setCity(search.city);
    setCheckIn(search.checkIn);
    setCheckOut(search.checkOut);
    setRoomsData(search.roomsData);

    onSearch?.({
      city: search.city,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      roomsData: search.roomsData,
    });
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("hotel_recent_searches");
  };

  if (compact) {
    const totalGuests = roomsData.reduce((acc, r) => acc + r.adults + r.children, 0);
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

    return (
      <div className="relative">
        <div className="bg-white p-0 relative rounded-3xl">
          <div className="flex items-end gap-0 flex-nowrap p-4 sticky top-0 bg-white z-[20] rounded-3xl overflow-visible shadow-sm">
            {/* Destination */}
            <div className="flex-[1.5] min-w-[180px] relative border-r border-gray-100 pr-4" ref={cityRef}>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Destination</label>
              <button
                type="button"
                onClick={() => {
                  setCityDropdownOpen(!cityDropdownOpen);
                  setCalendarOpen(false);
                  setGuestsDropdownOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <div className="text-lg font-black text-slate-800 truncate leading-none mb-1">{city || "Select City"}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Enter Destination</div>
              </button>

              <CityDropdown
                isOpen={cityDropdownOpen}
                onClose={() => setCityDropdownOpen(false)}
                onSelect={(val) => {
                  const cityName = val.split(' (')[0];
                  setCity(cityName);
                  setCityDropdownOpen(false);
                  setTimeout(() => {
                    setActiveField("checkIn");
                    setCalendarOpen(true);
                  }, 150);
                }}
                position={{ top: '100%', left: 0 }}
                className="w-full"
                type="hotels"
                label="Destination"
              />
            </div>

            {/* Check-In */}
            <div className="flex-1 min-w-[120px] relative border-r border-gray-100 pl-4 pr-4">
              <button
                type="button"
                onClick={() => {
                  setActiveField("checkIn");
                  setCalendarOpen(true);
                  setCityDropdownOpen(false);
                  setGuestsDropdownOpen(false);
                }}
                className="w-full text-left focus:outline-none group"
              >
                <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider transition-colors ${calendarOpen && activeField === "checkIn" ? "text-blue-600" : "text-gray-400"}`}>
                  Check-in
                </label>
                {checkIn ? (
                  <div>
                    <div className="text-lg font-black text-slate-800 leading-none mb-1">{formatDate(checkIn)}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{getDayName(checkIn)}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-black text-gray-200 leading-none mb-1">Select Date</div>
                    <div className="text-[9px] text-gray-200 font-bold uppercase tracking-tight">Day</div>
                  </div>
                )}
              </button>
            </div>

            {/* Nights */}
            <div className="flex flex-col items-center justify-center px-2 shrink-0">
              <div className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-[9px] font-black text-slate-400 bg-gray-50/50">
                {!isNaN(nights) ? nights : 1}
              </div>
              <span className="text-[7px] font-black text-gray-300 uppercase mt-1 tracking-tighter">NIGHT</span>
            </div>

            {/* Check-Out */}
            <div className="flex-1 min-w-[120px] relative border-r border-gray-100 pl-4 pr-4">
              <button
                type="button"
                onClick={() => {
                  setActiveField("checkOut");
                  setCalendarOpen(true);
                  setCityDropdownOpen(false);
                  setGuestsDropdownOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <label className={`block text-[10px] font-bold mb-1 uppercase tracking-wider transition-colors ${calendarOpen && activeField === "checkOut" ? "text-red-600" : "text-gray-400"}`}>
                  Check-out
                </label>
                {checkOut ? (
                  <div>
                    <div className="text-lg font-black text-slate-800 leading-none mb-1">{formatDate(checkOut)}</div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{getDayName(checkOut)}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-black text-gray-200 leading-none mb-1">Select Date</div>
                    <div className="text-[9px] text-gray-200 font-bold uppercase tracking-tight">Day</div>
                  </div>
                )}
              </button>
            </div>

            {/* Guests */}
            <div className="flex-[1.5] min-w-[180px] relative border-r border-gray-100 pl-6 pr-4" ref={guestsRef}>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Rooms & Guests</label>
              <button
                type="button"
                onClick={() => {
                  setGuestsDropdownOpen(!guestsDropdownOpen);
                  setCityDropdownOpen(false);
                  setCalendarOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-800 leading-none">{roomsData.length}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight mr-2">Room{roomsData.length > 1 ? 's' : ''}</span>
                  <span className="text-lg font-black text-slate-800 leading-none">{totalGuests}</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">Guest{totalGuests > 1 ? 's' : ''}</span>
                </div>
              </button>

              {guestsDropdownOpen && (
                <div className="absolute z-[1000] bg-white rounded-xl shadow-2xl border border-slate-200 p-0 min-w-[360px] right-0 top-[calc(100%+12px)] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden font-sans pointer-events-auto">
                  <div className="max-h-[500px] overflow-y-auto p-0 space-y-0 custom-scrollbar">
                    {roomsData.map((room, idx) => (
                      <div key={idx} className={`relative transition-all ${editingRoomIndex === idx ? 'bg-white p-6 border-b border-slate-100' : 'bg-[#f5f8ff] p-4 border-b border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-black">Room {idx + 1}</h4>
                          <div className="flex items-center gap-3">
                            {editingRoomIndex !== idx && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingRoomIndex(idx); }}
                                className="text-slate-400 hover:text-blue-500 transition-all"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                            )}
                            {(roomsData.length > 1 || editingRoomIndex === idx) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (roomsData.length > 1) {
                                    const updated = roomsData.filter((_, i) => i !== idx);
                                    setRoomsData(updated);
                                    if (editingRoomIndex === idx) setEditingRoomIndex(0);
                                    else if (editingRoomIndex > idx) setEditingRoomIndex(editingRoomIndex - 1);
                                  } else {
                                    setGuestsDropdownOpen(false);
                                  }
                                }}
                                className="text-slate-400 hover:text-red-500 transition-all"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            )}
                          </div>
                        </div>
                        {editingRoomIndex === idx ? (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <span className="text-base text-gray-800">Adults</span>
                              <div className="flex items-center gap-2">
                                <span className="mr-8 font-bold text-gray-800">{room.adults}</span>
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                  <button
                                    type="button"
                                    disabled={room.adults <= 1}
                                    onClick={() => {
                                      const updated = [...roomsData];
                                      updated[idx].adults = Math.max(1, room.adults - 1);
                                      setRoomsData(updated);
                                    }}
                                    className="px-3 py-1 bg-white hover:bg-gray-100 transition-all text-xl font-medium border-r border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                                  >-</button>
                                  <button
                                    type="button"
                                    disabled={room.adults >= 8}
                                    onClick={() => {
                                      const updated = [...roomsData];
                                      updated[idx].adults = Math.min(8, room.adults + 1);
                                      setRoomsData(updated);
                                    }}
                                    className={`px-3 py-1 transition-all text-xl font-medium ${room.adults >= 8 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
                                  >+</button>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="block text-base text-gray-800">Children</span>
                                <span className="text-xs text-slate-500">0- 12 Years</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="mr-8 font-bold text-gray-800">{room.children}</span>
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                  <button
                                    type="button"
                                    disabled={room.children <= 0}
                                    onClick={() => {
                                      const updated = [...roomsData];
                                      updated[idx].children = Math.max(0, room.children - 1);
                                      updated[idx].childAges.pop();
                                      setRoomsData(updated);
                                    }}
                                    className="px-3 py-1 bg-white hover:bg-gray-100 transition-all text-xl font-medium border-r border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                                  >-</button>
                                  <button
                                    type="button"
                                    disabled={room.children >= 2}
                                    onClick={() => {
                                      const updated = [...roomsData];
                                      updated[idx].children = Math.min(2, room.children + 1);
                                      updated[idx].childAges.push(0);
                                      setRoomsData(updated);
                                    }}
                                    className={`px-3 py-1 transition-all text-xl font-medium ${room.children >= 2 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
                                  >+</button>
                                </div>
                              </div>
                            </div>
                            {room.children > 0 && (
                              <div className="pt-4 mt-2">
                                <h5 className="text-[11px] font-black text-black mb-4 uppercase tracking-tighter">CHILDREN'S AGE</h5>
                                <div className="flex gap-4">
                                  {room.childAges.map((age, ageIdx) => (
                                    <div key={ageIdx} className="relative flex-1 group">
                                      <div className="absolute -top-2 left-2 bg-white px-1 z-10">
                                        <span className="text-[9px] text-gray-500">Child {ageIdx + 1}</span>
                                      </div>
                                      <select
                                        value={age}
                                        onChange={(e) => {
                                          const updated = [...roomsData];
                                          updated[idx].childAges[ageIdx] = parseInt(e.target.value);
                                          setRoomsData(updated);
                                        }}
                                        className="w-full bg-white border border-gray-400 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_10px_center] bg-no-repeat"
                                      >
                                        {[...Array(13)].map((_, i) => (
                                          <option key={i} value={i}>{i === 0 ? "Under 1" : `${i} Years`}</option>
                                        ))}
                                      </select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-sm">
                            <span className="font-bold text-black">{room.adults}</span>
                            <span className="text-slate-500">Adults</span>
                            <span className="font-bold text-black ml-1">{room.children}</span>
                            <span className="text-slate-500">Children</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                    {roomsData.length < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...roomsData, { adults: 1, children: 0, childAges: [] }];
                          setRoomsData(updated);
                          setEditingRoomIndex(updated.length - 1);
                        }}
                        className="flex items-center gap-3 text-red-500 font-bold text-base hover:text-red-600 transition-all uppercase tracking-tight"
                      >
                        <svg className="w-5 h-5 border-2 border-red-500 rounded flex items-center justify-center p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        Add Another Room
                      </button>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setGuestsDropdownOpen(false)}
                        className="px-8 py-2.5 bg-[#FF4D42] hover:bg-[#E63E33] text-white font-bold rounded-md transition-all uppercase tracking-widest text-sm font-sans"
                      >
                        DONE
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex-shrink-0 pl-4">
              <button
                type="button"
                onClick={() => {
                  if (!city || !checkIn || !checkOut) {
                    toast.error("Please select city, check-in, and check-out dates.");
                    return;
                  }
                  const searchData = {
                    city,
                    checkIn,
                    checkOut,
                    roomsData,
                    rooms: roomsData.length,
                    guests: roomsData.reduce((acc, r) => acc + r.adults + r.children, 0)
                  };
                  saveSearch(searchData);
                  onSearch?.(searchData);
                }}
                className="bg-[#FF4D42] hover:bg-[#E63E33] text-white px-8 py-3 rounded-lg text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-red-100 transition-all active:scale-95 flex items-center gap-2"
              >
                SEARCH <HiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none z-[1100]">
            <div className="relative w-full h-full">
              <CalendarComponent
                isOpen={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                departureDate={checkIn}
                returnDate={checkOut}
                departureLabel="CHECK-IN"
                returnLabel="CHECK-OUT"
                activeField={activeField === 'checkIn' ? 'departure' : 'return'}
                onSelectDeparture={(d) => {
                  setCheckIn(d);
                  const sel = new Date(d + "T12:00:00");
                  const currentOut = checkOut ? new Date(checkOut + "T12:00:00") : null;
                  if (currentOut && sel >= currentOut) {
                    const next = new Date(sel);
                    next.setDate(next.getDate() + 1);
                    setCheckOut(next.toISOString().split('T')[0]);
                  }

                  setCalendarOpen(false);
                  setTimeout(() => {
                    setActiveField("checkOut");
                    setCalendarOpen(true);
                  }, 100);
                }}
                onSelectReturn={(d) => {
                  setCheckOut(d);
                  if (d) {
                    const sel = new Date(d + "T12:00:00");
                    const currentIn = checkIn ? new Date(checkIn + "T12:00:00") : null;
                    if (currentIn && sel <= currentIn) {
                      const prev = new Date(sel);
                      prev.setDate(prev.getDate() - 1);
                      setCheckIn(prev.toISOString().split('T')[0]);
                    }

                    setCalendarOpen(false);
                    setTimeout(() => {
                      setGuestsDropdownOpen(true);
                    }, 200);
                  }
                }}
                isRoundTrip={true}
                className="pointer-events-auto mt-0 shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Recent Searches (Compact) */}
        {recentSearches.length > 0 && (
          <div className="mt-4 px-6 relative z-0">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Recently Searched:</span>
              <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {recentSearches.slice(0, 3).map((search) => {
                  const guestCount = search.roomsData.reduce((acc, r) => acc + r.adults + r.children, 0);
                  const roomCount = search.roomsData.length;
                  const cIn = new Date(search.checkIn);
                  const dateLabel = `${cIn.getDate()} ${cIn.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;

                  return (
                    <button
                      key={search.id}
                      onClick={() => handleRecentClick(search)}
                      className="flex-shrink-0 bg-white/95 rounded-full px-5 py-2 text-left hover:bg-white transition-all group border border-transparent hover:border-blue-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-tight">{search.city}</span>
                        <div className="w-[1px] h-3 bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{dateLabel}</span>
                      </div>
                    </button>
                  );
                })}
                <button onClick={clearRecent} className="text-[10px] font-black text-slate-900 hover:text-red-600 ml-2 uppercase tracking-widest border-b border-slate-300 transition-colors">Clear All</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="relative min-h-[400px] flex items-start justify-center pt-8 pb-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center gap-2 text-white text-xl font-bold drop-shadow-lg">
            <span className="text-2xl">🏨</span>
            Book Hotels
          </div>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-end gap-0 flex-wrap">
              <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pr-4" ref={cityRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                <button
                  type="button"
                  onClick={() => {
                    setCityDropdownOpen(!cityDropdownOpen);
                    setCalendarOpen(false);
                    setGuestsDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="text-lg font-bold text-gray-900 truncate">{city || "Select City"}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Destination</div>
                </button>

                <CityDropdown
                  isOpen={cityDropdownOpen}
                  onClose={() => setCityDropdownOpen(false)}
                  onSelect={(val) => {
                    const cityName = val.split(' (')[0];
                    setCity(cityName);
                    setCityDropdownOpen(false);
                    setTimeout(() => {
                      setActiveField("checkIn");
                      setCalendarOpen(true);
                    }, 150);
                  }}
                  position={{ top: 0, left: 0 }}
                  className="w-full"
                  type="hotels"
                />
              </div>

              <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pl-4 pr-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveField("checkIn");
                    setCalendarOpen(true);
                    setCityDropdownOpen(false);
                    setGuestsDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "checkIn" ? "text-blue-600" : "text-gray-500"}`}>
                    Check-in
                  </label>
                  {checkIn ? (
                    <div>
                      <div className="text-base font-bold text-gray-900">{formatDate(checkIn)}</div>
                      <div className="text-xs text-gray-500">{getDayName(checkIn)}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-base font-bold text-gray-400">Select Date</div>
                      <div className="text-xs text-gray-300">Choose Check-in</div>
                    </div>
                  )}
                </button>
              </div>

              <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pl-4 pr-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveField("checkOut");
                    setCalendarOpen(true);
                    setCityDropdownOpen(false);
                    setGuestsDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "checkOut" ? "text-red-600" : "text-gray-500"}`}>
                    Check-out
                  </label>
                  {checkOut ? (
                    <div>
                      <div className="text-base font-bold text-gray-900">{formatDate(checkOut)}</div>
                      <div className="text-xs text-gray-500">{getDayName(checkOut)}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-base font-bold text-gray-400">Select Date</div>
                      <div className="text-xs text-gray-300">Choose Check-out</div>
                    </div>
                  )}
                </button>
              </div>

              <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pl-6 pr-4" ref={guestsRef}>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Rooms & Guests</label>
                <button
                  type="button"
                  onClick={() => {
                    setGuestsDropdownOpen(!guestsDropdownOpen);
                    setCityDropdownOpen(false);
                    setCalendarOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-black leading-none">{roomsData.length}</span>
                    <span className="text-lg font-medium text-gray-800 mr-3">Rooms</span>
                    <span className="text-2xl font-black text-black leading-none">
                      {roomsData.reduce((acc, r) => acc + r.adults + r.children, 0)}
                    </span>
                    <span className="text-lg font-medium text-gray-800">Guests</span>
                  </div>
                </button>
                {guestsDropdownOpen && (
                  <div className="absolute z-[1000] bg-white rounded shadow-2xl border border-slate-200 p-0 min-w-[380px] right-0 top-0 animate-in fade-in zoom-in duration-200 overflow-hidden font-sans">
                    <div className="max-h-[550px] overflow-y-auto p-0 space-y-0 custom-scrollbar">
                      {roomsData.map((room, idx) => (
                        <div key={idx} className={`relative transition-all ${editingRoomIndex === idx ? 'bg-white p-6 border-b border-slate-100' : 'bg-[#f5f8ff] p-4 border-b border-slate-100'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-black">Room {idx + 1}</h4>
                            <div className="flex items-center gap-3">
                              {editingRoomIndex !== idx && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingRoomIndex(idx); }}
                                  className="text-slate-400 hover:text-blue-500 transition-all"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                              )}
                              {(roomsData.length > 1 || editingRoomIndex === idx) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (roomsData.length > 1) {
                                      const updated = roomsData.filter((_, i) => i !== idx);
                                      setRoomsData(updated);
                                      if (editingRoomIndex === idx) setEditingRoomIndex(0);
                                      else if (editingRoomIndex > idx) setEditingRoomIndex(editingRoomIndex - 1);
                                    } else {
                                      setGuestsDropdownOpen(false);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-500 transition-all"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              )}
                            </div>
                          </div>

                          {editingRoomIndex === idx ? (
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <span className="text-base text-gray-800">Adults</span>
                                <div className="flex items-center gap-2">
                                  <span className="mr-8 font-bold text-gray-800">{room.adults}</span>
                                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button
                                      type="button"
                                      disabled={room.adults <= 1}
                                      onClick={() => {
                                        const updated = [...roomsData];
                                        updated[idx].adults = Math.max(1, room.adults - 1);
                                        setRoomsData(updated);
                                      }}
                                      className="px-3 py-1 bg-white hover:bg-gray-100 transition-all text-xl font-medium border-r border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                                    >-</button>
                                    <button
                                      type="button"
                                      disabled={room.adults >= 8}
                                      onClick={() => {
                                        const updated = [...roomsData];
                                        updated[idx].adults = Math.min(8, room.adults + 1);
                                        setRoomsData(updated);
                                      }}
                                      className={`px-3 py-1 transition-all text-xl font-medium ${room.adults >= 8 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
                                    >+</button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="block text-base text-gray-800">Children</span>
                                  <span className="text-xs text-slate-500">0- 12 Years</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="mr-8 font-bold text-gray-800">{room.children}</span>
                                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                    <button
                                      type="button"
                                      disabled={room.children <= 0}
                                      onClick={() => {
                                        const updated = [...roomsData];
                                        updated[idx].children = Math.max(0, room.children - 1);
                                        updated[idx].childAges.pop();
                                        setRoomsData(updated);
                                      }}
                                      className="px-3 py-1 bg-white hover:bg-gray-100 transition-all text-xl font-medium border-r border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                                    >-</button>
                                    <button
                                      type="button"
                                      disabled={room.children >= 2}
                                      onClick={() => {
                                        const updated = [...roomsData];
                                        updated[idx].children = Math.min(2, room.children + 1);
                                        updated[idx].childAges.push(0);
                                        setRoomsData(updated);
                                      }}
                                      className={`px-3 py-1 transition-all text-xl font-medium ${room.children >= 2 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
                                    >+</button>
                                  </div>
                                </div>
                              </div>

                              {room.children > 0 && (
                                <div className="pt-4 mt-2">
                                  <h5 className="text-[11px] font-black text-black mb-4 uppercase tracking-tighter">CHILDREN'S AGE</h5>
                                  <div className="flex gap-4">
                                    {room.childAges.map((age, ageIdx) => (
                                      <div key={ageIdx} className="relative flex-1 group">
                                        <div className="absolute -top-2 left-2 bg-white px-1 z-10">
                                          <span className="text-[9px] text-gray-500">Child {ageIdx + 1}</span>
                                        </div>
                                        <select
                                          value={age}
                                          onChange={(e) => {
                                            const updated = [...roomsData];
                                            updated[idx].childAges[ageIdx] = parseInt(e.target.value);
                                            setRoomsData(updated);
                                          }}
                                          className="w-full bg-white border border-gray-400 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_10px_center] bg-no-repeat"
                                        >
                                          {[...Array(13)].map((_, i) => (
                                            <option key={i} value={i}>{i === 0 ? "Under 1" : `${i} Years`}</option>
                                          ))}
                                        </select>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-sm">
                              <span className="font-bold text-black">{room.adults}</span>
                              <span className="text-slate-500">Adults</span>
                              <span className="font-bold text-black ml-1">{room.children}</span>
                              <span className="text-slate-500">Children</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-6 bg-white border-t border-slate-100 space-y-4">
                      {roomsData.length < 6 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...roomsData, { adults: 1, children: 0, childAges: [] }];
                            setRoomsData(updated);
                            setEditingRoomIndex(updated.length - 1);
                          }}
                          className="flex items-center gap-3 text-red-500 font-bold text-base hover:text-red-600 transition-all uppercase tracking-tight"
                        >
                          <svg className="w-5 h-5 border-2 border-red-500 rounded flex items-center justify-center p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                          Add Another Room
                        </button>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setGuestsDropdownOpen(false)}
                          className="px-8 py-2.5 bg-[#ff4d42] hover:bg-[#e63e33] text-white font-bold rounded-md transition-all uppercase tracking-widest text-sm"
                        >
                          DONE
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 pl-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!city || !checkIn || !checkOut) {
                      toast.error("Please select city, check-in, and check-out dates.");
                      return;
                    }
                    const cIn = new Date(checkIn + "T12:00:00");
                    const cOut = new Date(checkOut + "T12:00:00");
                    if (cOut <= cIn) {
                      toast.error("Check-out must be after check-in.");
                      return;
                    }
                    const searchData = {
                      city,
                      checkIn,
                      checkOut,
                      roomsData,
                      rooms: roomsData.length,
                      guests: roomsData.reduce((acc, r) => acc + r.adults + r.children, 0)
                    };
                    saveSearch(searchData);
                    onSearch?.(searchData);
                  }}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-base uppercase tracking-wide"
                >
                  <HiSearch className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>

            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none z-[100]">
              <div className="relative w-full h-full">
                <CalendarComponent
                  isOpen={calendarOpen}
                  onClose={() => setCalendarOpen(false)}
                  departureDate={checkIn}
                  returnDate={checkOut}
                  departureLabel="CHECK-IN"
                  returnLabel="CHECK-OUT"
                  activeField={activeField === 'checkIn' ? 'departure' : 'return'}
                  onSelectDeparture={(d) => {
                    setCheckIn(d);
                    const sel = new Date(d + "T12:00:00");
                    const currentOut = checkOut ? new Date(checkOut + "T12:00:00") : null;
                    if (currentOut && sel >= currentOut) {
                      const next = new Date(sel);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next.toISOString().split('T')[0]);
                    }

                    setCalendarOpen(false);
                    setTimeout(() => {
                      setActiveField("checkOut");
                      setCalendarOpen(true);
                    }, 150);
                  }}
                  onSelectReturn={(d) => {
                    setCheckOut(d);
                    if (d) {
                      const sel = new Date(d + "T12:00:00");
                      const currentIn = checkIn ? new Date(checkIn + "T12:00:00") : null;
                      if (currentIn && sel <= currentIn) {
                        const prev = new Date(sel);
                        prev.setDate(prev.getDate() - 1);
                        setCheckIn(prev.toISOString().split('T')[0]);
                      }

                      setCalendarOpen(false);
                      setTimeout(() => {
                        setGuestsDropdownOpen(true);
                      }, 200);
                    }
                  }}
                  isRoundTrip={true}
                  className="pointer-events-auto mt-0"
                />
              </div>
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div className="mt-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-white text-sm font-bold drop-shadow-md whitespace-nowrap">You've Searched</span>
              <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {recentSearches.slice(0, 3).map((search) => {
                  const guestCount = search.roomsData.reduce((acc, r) => acc + r.adults + r.children, 0);
                  const roomCount = search.roomsData.length;
                  const cIn = new Date(search.checkIn);
                  const cOut = new Date(search.checkOut);
                  const checkInDate = `${cIn.getDate()} ${cIn.toLocaleString('en-US', { month: 'short' })}'${cIn.getFullYear().toString().slice(-2)}`;
                  const checkOutDate = `${cOut.getDate()} ${cOut.toLocaleString('en-US', { month: 'short' })}'${cOut.getFullYear().toString().slice(-2)}`;

                  return (
                    <button
                      key={search.id}
                      onClick={() => handleRecentClick(search)}
                      className="flex-shrink-0 bg-white/95 backdrop-blur-sm hover:bg-white rounded-lg px-4 py-2 text-left shadow-sm hover:shadow-md transition-all border border-white/20 group max-w-[280px]"
                    >
                      <div className="flex flex-col">
                        <div className="text-[11px] font-bold text-gray-800 truncate mb-0.5 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                          {search.city}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                          {checkInDate} - {checkOutDate} | {guestCount} Guest{guestCount > 1 ? 's' : ''}, {roomCount} Room{roomCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </button>
                  );
                })}
                <button
                  onClick={clearRecent}
                  className="text-white/80 hover:text-white text-[11px] font-bold underline underline-offset-4 ml-2 transition-colors whitespace-nowrap"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default HotelSearch;
