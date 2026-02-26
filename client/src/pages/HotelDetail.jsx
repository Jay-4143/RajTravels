import { useState, useEffect, useMemo, useRef } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { getHotelById, getRoomAvailability } from "../api/hotels";
import HotelMapView from "../components/HotelMapView";
import { useGlobal } from "../context/GlobalContext";
import HotelGuestReviews from "../components/HotelGuestReviews";
import {
  FaWifi,
  FaUtensils,
  FaGlassMartiniAlt,
  FaConciergeBell,
  FaDumbbell,
  FaSwimmingPool,
  FaCar,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaMapMarkerAlt,
  FaShareAlt,
  FaHeart,
  FaChevronDown,
  FaSearch,
  FaCheck,
  FaPlane,
  FaPlusCircle,
  FaMinus,
  FaPlus,
  FaCalendarAlt,
  FaBed,
  FaUser,
} from "react-icons/fa";
import {
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlinePhotograph,
} from "react-icons/hi";
import {
  MdOutlineBedroomParent,
  MdOutlineKingBed,
  MdOutlineRoomService,
} from "react-icons/md";
import Footer from "../components/Footer";
import CalendarComponent from "../components/CalendarComponent";
import HotelShortlistModal from "../components/HotelShortlistModal";
import HotelImageGallery from "../components/HotelImageGallery";
import HotelSearch from "../components/HotelSearch";
import { toast } from "react-hot-toast";

const TABS = [
  { id: "photos", label: "PHOTOS" },
  { id: "rooms", label: "ROOM & RATES" },
  { id: "amenities", label: "HOTEL AMENITIES" },
  { id: "nearby", label: "NEARBY ATTRACTIONS" },
  { id: "map", label: "MAP" },
];

const AMENITY_ICONS = {
  "Free Wifi": FaWifi,
  Restaurant: FaUtensils,
  Bar: FaGlassMartiniAlt,
  "Room Service": FaConciergeBell,
  Gym: FaDumbbell,
  Pool: FaSwimmingPool,
  Parking: FaCar,
};

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchParams: initialSearchParams } = location.state || {};
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPrice } = useGlobal();
  const [activeTab, setActiveTab] = useState("photos");
  const [roomFilter, setRoomFilter] = useState([]);
  const [roomSearch, setRoomSearch] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState("departure");
  const [shortlistedHotels, setShortlistedHotels] = useState(() => {
    const saved = localStorage.getItem("shortlistedHotels");
    return saved ? JSON.parse(saved) : [];
  });
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [modifySearchOpen, setModifySearchOpen] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState(0);
  const [roomsData, setRoomsData] = useState([
    { adults: 2, children: 0, childAges: [] },
  ]);
  const dropdownRef = useRef(null);
  const calendarRef = useRef(null);

  const [urlParams] = useSearchParams();

  const searchParams = useMemo(() => {
    if (initialSearchParams) return initialSearchParams;
    const checkIn = urlParams.get("checkIn");
    const checkOut = urlParams.get("checkOut");
    const guests = parseInt(urlParams.get("guests"));
    const rooms = parseInt(urlParams.get("rooms"));
    const roomsDataStr = urlParams.get("roomsData");
    if (checkIn && checkOut) {
      let roomsData = null;
      try {
        roomsData = roomsDataStr ? JSON.parse(roomsDataStr) : null;
      } catch (e) {
        console.error("Failed to parse roomsData from URL", e);
      }
      return {
        checkIn,
        checkOut,
        guests:
          guests ||
          roomsData?.reduce(
            (acc, r) => acc + r.adults + (r.children || 0),
            0,
          ) ||
          2,
        rooms: rooms || roomsData?.length || 1,
        roomsData,
      };
    }
    return {
      checkIn: new Date().toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      guests: 2,
      rooms: 1,
    };
  }, [initialSearchParams, urlParams]);

  useEffect(() => {
    if (searchParams.roomsData && searchParams.roomsData.length > 0) {
      setRoomsData(
        searchParams.roomsData.map((r) => ({
          adults: r.adults || 2,
          children: r.children || 0,
          childAges: r.childAges || [],
        })),
      );
    } else {
      setRoomsData(
        Array.from({ length: searchParams.rooms || 1 }, () => ({
          adults: 2,
          children: 0,
          childAges: [],
        })),
      );
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getHotelById(id)
      .then((res) => {
        setHotel(res.data.hotel);
        return getRoomAvailability(
          id,
          searchParams.checkIn,
          searchParams.checkOut,
        );
      })
      .then((res) => {
        setRooms(res.data.rooms || []);
        if (res.data.rooms?.length > 0) {
          const prices = res.data.rooms
            .map((r) => r.pricePerNight)
            .filter((p) => p > 0);
          if (prices.length > 0)
            setHotel((prev) => ({ ...prev, minPrice: Math.min(...prices) }));
        }
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Failed to load hotel details.",
        );
      })
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  const handleBook = (room) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { ...searchParams, returnTo: location.pathname, hotelId: id },
      });
      return;
    }
    navigate("/hotels/booking", { state: { hotel, room, searchParams } });
  };

  const handleDateChange = (type, date) => {
    const newParams = new URLSearchParams(urlParams);
    const selectedDateStr = date;
    const selectedDate = new Date(selectedDateStr + "T12:00:00");
    if (type === "departure") {
      newParams.set("checkIn", selectedDateStr);
      const checkoutDate = new Date(searchParams.checkOut + "T12:00:00");
      if (selectedDate >= checkoutDate) {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        newParams.set("checkOut", nextDay.toISOString().split("T")[0]);
      }
    } else {
      newParams.set("checkOut", selectedDateStr);
      const checkinDate = new Date(searchParams.checkIn + "T12:00:00");
      if (selectedDate <= checkinDate) {
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        newParams.set("checkIn", prevDay.toISOString().split("T")[0]);
      }
    }
    navigate(`/hotels/${id}?${newParams.toString()}`, { replace: true });
  };

  const handleGuestsChange = (newRoomsData) => {
    const totalGuests = newRoomsData.reduce(
      (acc, r) => acc + r.adults + (r.children || 0),
      0,
    );
    const totalRooms = newRoomsData.length;
    const newParams = new URLSearchParams(urlParams);
    newParams.set("guests", totalGuests);
    newParams.set("rooms", totalRooms);
    newParams.set("roomsData", JSON.stringify(newRoomsData));
    navigate(`/hotels/${id}?${newParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setGuestsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: hotel?.name,
          text: `Check out ${hotel?.name} in ${hotel?.city}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if (err.name !== "AbortError") toast.error("Failed to share.");
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "shortlistedHotels",
      JSON.stringify(shortlistedHotels),
    );
    if (hotel)
      setIsFavorited(shortlistedHotels.some((h) => h._id === hotel._id));
  }, [shortlistedHotels, hotel]);

  const toggleFavorite = () => {
    if (!hotel) return;
    const isAlready = shortlistedHotels.find((h) => h._id === hotel._id);
    if (!isAlready) {
      setShortlistedHotels((prev) => [...prev, hotel]);
      toast.success("Added to Shortlist!");
    } else {
      setShortlistedHotels((prev) => prev.filter((h) => h._id !== hotel._id));
      toast.success("Removed from Shortlist!");
    }
  };

  const toggleShortlist = (h) => {
    setShortlistedHotels((prev) =>
      prev.some((item) => item._id === h._id)
        ? prev.filter((item) => item._id !== h._id)
        : [...prev, h],
    );
  };

  const handleContact = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-sm uppercase">Concierge Support</p>
          <p className="text-xs">Email: support@travelgo.com</p>
          <p className="text-xs">Phone: +91 800 123 4567</p>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-blue-600 text-white text-[10px] py-1 rounded uppercase font-bold"
          >
            Close
          </button>
        </div>
      ),
      { duration: 5000 },
    );
  };

  const handlePhotoClick = (index) => {
    setGalleryInitialIndex(index);
    setGalleryOpen(true);
  };

  const images = useMemo(() => {
    const base = hotel?.images || [];
    if (base.length >= 7) return base;
    const fallbacks = [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200",
    ];
    return [...base, ...fallbacks].slice(0, 7);
  }, [hotel?.images]);

  const durationNights = useMemo(() => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 1;
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  }, [searchParams.checkIn, searchParams.checkOut]);

  const filteredRooms = useMemo(() => {
    let result = rooms;
    if (roomSearch) {
      const q = roomSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.roomType || "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [rooms, roomSearch]);

  const toggleFilter = (f) => {
    setRoomFilter((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  const groupedAmenities = useMemo(() => {
    const categories = {
      General: [
        "Express check-in",
        "Express check-out",
        "Terrace",
        "Wheelchair accessible",
        "Designated smoking areas",
      ],
      "Safe Deposit Box": [
        "Safe-deposit box at front desk",
        "Lockers available",
        "In-room safe",
      ],
      "Non Smoking": ["Smoke-free property", "Non-smoking rooms"],
      "Laundry Services": [
        "Dry cleaning/laundry service",
        "Laundry facilities",
        "Iron/ironing board",
      ],
      Internet: ["Free Wifi", "High-speed Internet", "Free WiFi"],
      Conveniences: [
        "Luggage storage",
        "24-hour front desk",
        "Elevator",
        "ATM on site",
      ],
      "Food & Drink": [
        "Restaurant",
        "Bar",
        "Room Service",
        "Minibar",
        "Breakfast",
      ],
      "Fitness & Spa": ["Gym", "Pool", "Spa", "Sauna", "Steam room"],
    };
    const hotelAmenities = (hotel?.amenities || []).map((a) => a.toLowerCase());
    const result = {};
    Object.entries(categories).forEach(([cat, labels]) => {
      const match = labels.filter((label) =>
        hotelAmenities.some(
          (ha) =>
            ha.includes(label.toLowerCase()) ||
            label.toLowerCase().includes(ha),
        ),
      );
      if (match.length > 0) result[cat] = match;
    });
    const matched = Object.values(result)
      .flat()
      .map((v) => v.toLowerCase());
    const others = hotelAmenities.filter(
      (ha) => !matched.some((m) => ha.includes(m) || m.includes(ha)),
    );
    if (others.length > 0)
      result["Other"] = others.map(
        (o) => o.charAt(0).toUpperCase() + o.slice(1),
      );
    return result;
  }, [hotel?.amenities]);

  const scrollToSection = (tabId) => {
    setActiveTab(tabId);
    const el = document.getElementById(tabId);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  // Scroll spy – auto-highlight the tab for whichever section is in view
  useEffect(() => {
    const sectionIds = TABS.map((t) => t.id);
    const handleScroll = () => {
      const offset = 140; // nav + tab bar height
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) current = id;
        }
      }
      setActiveTab(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nearby attractions data
  const nearbyAttractions = useMemo(() => {
    if (hotel?.nearbyAttractions?.length > 0) return hotel.nearbyAttractions;
    return [
      { name: "City Center", dist: "1.2 km" },
      { name: "Central Station", dist: "2.3 km" },
      { name: "Shopping Mall", dist: "2.5 km" },
      { name: "Public Park", dist: "3.0 km" },
      { name: "National Museum", dist: "3.5 km" },
      { name: "Hospital", dist: "1.8 km" },
      { name: "Airport", dist: "15.4 km" },
      { name: "Convention Center", dist: "4.2 km" },
      { name: "Business District", dist: "2.9 km" },
      { name: "Lake View", dist: "3.6 km" },
      { name: "Temple", dist: "4.1 km" },
      { name: "University", dist: "5.6 km" },
    ];
  }, [hotel?.nearbyAttractions]);

  const minPrice = useMemo(() => {
    if (rooms.length === 0) return hotel?.minPrice || 0;
    const prices = rooms.map((r) => r.pricePerNight).filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : hotel?.minPrice || 0;
  }, [rooms, hotel?.minPrice]);

  const totalPrice = minPrice * durationNights * (searchParams.rooms || 1);
  const taxAmount = Math.round(totalPrice * 0.18);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 mb-4"></div>
          <p className="text-gray-500 font-medium text-sm">
            Loading Hotel Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md w-full mx-4">
          <HiOutlineInformationCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Hotel not found"}</p>
          <button
            onClick={() => navigate("/hotels")}
            className="w-full py-3 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition-all"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(searchParams.checkIn + "T12:00:00");
  const checkOutDate = new Date(searchParams.checkOut + "T12:00:00");

  return (
    <div
      className="min-h-screen bg-[#f0f0f0]"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* ════════════════════════════════════════════════════════════════════
          1. DARK HEADER BAR
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Row 1: Hotel name + Price */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold">{hotel.name}</h1>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.starCategory || 3 }).map(
                    (_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-[10px]" />
                    ),
                  )}
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[13px] text-blue-300">
                <FaMapMarkerAlt className="text-blue-400 text-xs" />
                {hotel.address || "Hotel Address"}, {hotel.city || "City"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ₹ {totalPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-gray-300">
                + ₹ {taxAmount.toLocaleString("en-IN")} Tax and Fees
              </p>
            </div>
          </div>

          {/* Row 2: Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setModifySearchOpen(true)}
              className="px-4 py-1.5 border border-gray-400 text-[12px] font-medium rounded hover:bg-white/10 transition-colors"
            >
              Modify Search
            </button>
            <button
              onClick={handleShare}
              className="p-2 border border-gray-400 rounded hover:bg-white/10 transition-colors"
              title="Share"
            >
              <FaShareAlt className="text-xs" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded transition-colors border ${isFavorited ? "bg-red-500 border-red-500 text-white" : "bg-transparent border-gray-400 text-white hover:bg-white/10"}`}
              title={isFavorited ? "Remove from Shortlist" : "Add to Shortlist"}
            >
              <FaHeart
                className={`text-sm ${isFavorited ? "text-white" : "text-white"}`}
              />
            </button>
            <button
              onClick={() => scrollToSection("rooms")}
              className="bg-[#e84118] hover:bg-[#c23616] text-white px-5 py-1.5 rounded text-[12px] font-bold uppercase tracking-wide transition-colors"
            >
              Choose Room
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. TAB NAVIGATION
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 sticky top-[64px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`px-5 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? "text-red-500 border-red-500"
                    : "text-gray-500 border-transparent hover:text-gray-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* ════════════════════════════════════════════════════════════════════
            3. PHOTOS + SIDEBAR
        ════════════════════════════════════════════════════════════════════ */}
        <section
          id="photos"
          className="bg-white border border-gray-200 rounded mb-4"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Photo Grid Left */}
            <div className="flex-[3] p-3">
              <div
                className="grid grid-cols-3 grid-rows-3 gap-1.5"
                style={{ height: "420px" }}
              >
                {/* Main large image - spans 2 cols and 3 rows */}
                <div
                  onClick={() => handlePhotoClick(0)}
                  className="col-span-1 row-span-3 rounded overflow-hidden cursor-pointer relative group"
                >
                  <img
                    src={images[0]}
                    alt="Main"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* 6 smaller images - 3 rows x 2 cols */}
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePhotoClick(idx)}
                    className="rounded overflow-hidden cursor-pointer relative group"
                  >
                    <img
                      src={images[idx]}
                      alt={`Photo ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
                {/* Last image with View All overlay */}
                <div
                  onClick={() => {
                    setGalleryInitialIndex(0);
                    setGalleryOpen(true);
                  }}
                  className="rounded overflow-hidden cursor-pointer relative group col-span-2"
                >
                  <img
                    src={images[5]}
                    alt="More"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <FaPlusCircle className="text-2xl mx-auto mb-1" />
                      <span className="text-sm font-medium">
                        View All({images.length})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Right */}
            <div className="lg:w-[280px] border-l border-gray-200 p-4 flex flex-col overflow-visible">
              {/* Check In / Check Out */}
              <div
                className="flex items-stretch justify-between mb-5 relative"
                ref={calendarRef}
              >
                <div
                  className="flex-1 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors"
                  onClick={() => {
                    setActiveField("departure");
                    setCalendarOpen(true);
                    setGuestsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <FaCalendarAlt className="text-gray-400 text-[10px]" />
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">
                      Check In
                    </span>
                    <FaChevronDown className="text-gray-400 text-[8px] ml-auto" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {checkInDate.getDate()}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-700 font-medium">
                        {checkInDate.toLocaleDateString("en-GB", {
                          month: "short",
                        })}
                        '{checkInDate.getFullYear().toString().slice(-2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {checkInDate.toLocaleDateString("en-GB", {
                      weekday: "long",
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center px-2 min-w-[60px]">
                  <div className="border-t border-dashed border-gray-300 w-8 mb-1" />
                  <span className="text-[11px] text-gray-600 font-semibold whitespace-nowrap">
                    {durationNights} Night{durationNights > 1 ? "s" : ""}
                  </span>
                  <div className="border-t border-dashed border-gray-300 w-8 mt-1" />
                </div>

                <div
                  className="flex-1 cursor-pointer hover:bg-gray-50 rounded p-2 transition-colors text-right"
                  onClick={() => {
                    setActiveField("return");
                    setCalendarOpen(true);
                    setGuestsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">
                      Check Out
                    </span>
                    <FaChevronDown className="text-gray-400 text-[8px]" />
                  </div>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-3xl font-bold text-gray-900">
                      {checkOutDate.getDate()}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-700 font-medium">
                        {checkOutDate.toLocaleDateString("en-GB", {
                          month: "short",
                        })}
                        '{checkOutDate.getFullYear().toString().slice(-2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {checkOutDate.toLocaleDateString("en-GB", {
                      weekday: "long",
                    })}
                  </p>
                </div>

                {/* Calendar Dropdown */}
                <CalendarComponent
                  isOpen={calendarOpen}
                  onClose={() => setCalendarOpen(false)}
                  departureDate={searchParams.checkIn}
                  returnDate={searchParams.checkOut}
                  activeField={activeField}
                  onSelectDeparture={(date) => {
                    handleDateChange("departure", date);
                    setActiveField("return");
                  }}
                  onSelectReturn={(date) => {
                    handleDateChange("return", date);
                    setCalendarOpen(false);
                  }}
                  onSwitchField={(field) => setActiveField(field)}
                  departureLabel="CHECK-IN"
                  returnLabel="CHECK-OUT"
                  variant="hotel"
                  showFares={false}
                  className="absolute z-[1000] right-0 top-[calc(100%+8px)]"
                  style={{ minWidth: "580px" }}
                />
              </div>

              {/* Rooms & Guests */}
              <div className="mb-5 relative" ref={dropdownRef}>
                <p className="text-[11px] text-gray-500 font-semibold uppercase mb-1.5">
                  Rooms & Guests
                </p>
                <div
                  className="flex items-baseline gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -ml-1 transition-colors"
                  onClick={() => setGuestsDropdownOpen(!guestsDropdownOpen)}
                >
                  <span className="text-2xl font-bold text-gray-900">
                    {roomsData.length}
                  </span>
                  <span className="text-[12px] text-gray-500">
                    Room{roomsData.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 ml-2">
                    {roomsData.reduce((s, r) => s + r.adults + r.children, 0)}
                  </span>
                  <span className="text-[12px] text-gray-500">Guests</span>
                  <FaChevronDown className="text-gray-400 text-[8px] ml-auto" />
                </div>

                {guestsDropdownOpen && (
                  <div className="absolute z-[1000] bg-white rounded-xl shadow-2xl border border-slate-200 w-[360px] right-0 top-[calc(100%+8px)] overflow-hidden">
                    <div className="max-h-[400px] overflow-y-auto">
                      {roomsData.map((room, idx) => (
                        <div
                          key={idx}
                          className="p-5 border-b border-slate-100"
                        >
                          {editingRoomIndex === idx ? (
                            <>
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold text-black">
                                  Room {idx + 1}
                                </h4>
                                {roomsData.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = roomsData.filter(
                                        (_, i) => i !== idx,
                                      );
                                      setRoomsData(updated);
                                      if (editingRoomIndex >= updated.length)
                                        setEditingRoomIndex(updated.length - 1);
                                    }}
                                    className="text-slate-400 hover:text-red-500 transition-all"
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-base text-gray-800">
                                    Adults
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="mr-6 font-bold text-gray-800">
                                      {room.adults}
                                    </span>
                                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                      <button
                                        type="button"
                                        disabled={room.adults <= 1}
                                        onClick={() => {
                                          const u = [...roomsData];
                                          u[idx].adults = Math.max(
                                            1,
                                            room.adults - 1,
                                          );
                                          setRoomsData(u);
                                        }}
                                        className="px-3 py-1 bg-white hover:bg-gray-100 text-xl font-medium border-r border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        disabled={room.adults >= 8}
                                        onClick={() => {
                                          const u = [...roomsData];
                                          u[idx].adults = Math.min(
                                            8,
                                            room.adults + 1,
                                          );
                                          setRoomsData(u);
                                        }}
                                        className={`px-3 py-1 text-xl font-medium ${room.adults >= 8 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-white hover:bg-gray-100 text-gray-800"}`}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="block text-base text-gray-800">
                                      Children
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      0-12 Years
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="mr-6 font-bold text-gray-800">
                                      {room.children}
                                    </span>
                                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                      <button
                                        type="button"
                                        disabled={room.children <= 0}
                                        onClick={() => {
                                          const u = [...roomsData];
                                          u[idx].children = Math.max(
                                            0,
                                            room.children - 1,
                                          );
                                          u[idx].childAges.pop();
                                          setRoomsData(u);
                                        }}
                                        className="px-3 py-1 bg-white hover:bg-gray-100 text-xl font-medium border-r border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                                      >
                                        -
                                      </button>
                                      <button
                                        type="button"
                                        disabled={room.children >= 2}
                                        onClick={() => {
                                          const u = [...roomsData];
                                          u[idx].children = Math.min(
                                            2,
                                            room.children + 1,
                                          );
                                          u[idx].childAges.push(0);
                                          setRoomsData(u);
                                        }}
                                        className={`px-3 py-1 text-xl font-medium ${room.children >= 2 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-white hover:bg-gray-100 text-gray-800"}`}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                {room.children > 0 && (
                                  <div className="pt-2">
                                    <h5 className="text-[11px] font-black text-black mb-3 uppercase tracking-tight">
                                      CHILDREN'S AGE
                                    </h5>
                                    <div className="flex gap-3">
                                      {room.childAges.map((age, ageIdx) => (
                                        <div
                                          key={ageIdx}
                                          className="relative flex-1"
                                        >
                                          <div className="absolute -top-2 left-2 bg-white px-1 z-10">
                                            <span className="text-[9px] text-gray-500">
                                              Child {ageIdx + 1}
                                            </span>
                                          </div>
                                          <select
                                            value={age}
                                            onChange={(e) => {
                                              const u = [...roomsData];
                                              u[idx].childAges[ageIdx] =
                                                parseInt(e.target.value);
                                              setRoomsData(u);
                                            }}
                                            className="w-full bg-white border border-gray-400 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
                                          >
                                            {[...Array(13)].map((_, i) => (
                                              <option key={i} value={i}>
                                                {i === 0
                                                  ? "Under 1"
                                                  : `${i} Years`}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            /* Collapsed room summary */
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-bold text-black">
                                  Room {idx + 1}
                                </h4>
                                <div className="flex items-center gap-1 text-sm mt-1">
                                  <span className="font-bold text-red-500">
                                    {room.adults}
                                  </span>
                                  <span className="text-slate-500">Adults</span>
                                  <span className="font-bold text-red-500 ml-1">
                                    {room.children}
                                  </span>
                                  <span className="text-slate-500">
                                    Children
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRoomIndex(idx);
                                  }}
                                  className="text-slate-400 hover:text-blue-500 transition-all p-1"
                                  title="Edit room"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                </button>
                                {roomsData.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = roomsData.filter(
                                        (_, i) => i !== idx,
                                      );
                                      setRoomsData(updated);
                                      if (editingRoomIndex >= updated.length)
                                        setEditingRoomIndex(updated.length - 1);
                                    }}
                                    className="text-slate-400 hover:text-red-500 transition-all p-1"
                                    title="Remove room"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                      {roomsData.length < 6 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...roomsData,
                              { adults: 1, children: 0, childAges: [] },
                            ];
                            setRoomsData(updated);
                            setEditingRoomIndex(updated.length - 1);
                          }}
                          className="flex items-center gap-3 text-red-500 font-bold text-sm hover:text-red-600 transition-all uppercase tracking-tight"
                        >
                          <svg
                            className="w-4 h-4 border-2 border-red-500 rounded flex items-center justify-center p-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add Another Room
                        </button>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setGuestsDropdownOpen(false);
                            const totalGuests = roomsData.reduce(
                              (s, r) => s + r.adults + r.children,
                              0,
                            );
                            const np = new URLSearchParams(urlParams);
                            np.set("rooms", roomsData.length);
                            np.set("guests", totalGuests);
                            np.set("roomsData", JSON.stringify(roomsData));
                            navigate(`/hotels/${id}?${np.toString()}`, {
                              replace: true,
                            });
                          }}
                          className="px-6 py-2 bg-[#e84118] hover:bg-[#c23616] text-white font-bold rounded text-sm transition-all uppercase tracking-wider"
                        >
                          DONE
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenity Icons */}
              <div className="flex items-center gap-5 mb-5 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MdOutlineRoomService className="text-red-400 text-lg" />
                  <span className="text-[12px] text-gray-600">
                    Room Service
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWifi className="text-green-500 text-sm" />
                  <span className="text-[12px] text-gray-600">Free Wifi</span>
                </div>
              </div>

              {/* Rating Badge */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-11 h-11 bg-green-500 rounded-md flex items-center justify-center text-white text-lg font-bold shadow">
                  {hotel.rating?.toFixed(1) || "3.5"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {hotel.rating >= 4
                      ? "Very Good"
                      : hotel.rating >= 3
                        ? "Good"
                        : "Average"}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {hotel.reviewCount || 2} ratings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            4. ROOMS & RATES
        ════════════════════════════════════════════════════════════════════ */}
        <section
          id="rooms"
          className="bg-white border border-gray-200 rounded mb-4 overflow-hidden"
        >
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="text-[17px] font-bold text-gray-900">
              Rooms & Rates
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap items-center gap-4">
            <span className="text-[12px] text-gray-500 font-medium whitespace-nowrap">
              Filter rooms by :
            </span>
            {[
              "Breakfast",
              "Full Board",
              "Half Board",
              "Transfer",
              "Cancellation Available",
            ].map((f) => (
              <label
                key={f}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={roomFilter.includes(f)}
                  onChange={() => toggleFilter(f)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[12px] text-gray-600">{f}</span>
              </label>
            ))}
            <div className="ml-auto relative">
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]" />
              <input
                type="text"
                placeholder="Search rooms"
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="pl-7 pr-3 py-1.5 border border-gray-200 rounded text-[12px] outline-none focus:border-blue-300 w-36"
              />
            </div>
          </div>

          {/* Room Cards */}
          <div className="divide-y divide-gray-100">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, idx) => {
                const addOnPerNight = roomFilter.reduce((sum, f) => {
                  if (f === "Breakfast") return sum + 800;
                  if (f === "Full Board") return sum + 2000;
                  if (f === "Half Board") return sum + 1200;
                  return sum;
                }, 0);
                const addOnFlat = roomFilter.reduce((sum, f) => {
                  if (f === "Transfer") return sum + 1500;
                  if (f === "Cancellation Available") return sum + 500;
                  return sum;
                }, 0);
                const baseStayPrice =
                  room.pricePerNight *
                  durationNights *
                  (searchParams.rooms || 1);
                const addOnTotal =
                  addOnPerNight * durationNights * (searchParams.rooms || 1) +
                  addOnFlat;
                const stayPrice = baseStayPrice + addOnTotal;
                const oldPrice = Math.round(stayPrice * 1.27);
                const savings = oldPrice - stayPrice;
                const tax = Math.round(stayPrice * 0.18);
                const roomsLeft = Math.floor(Math.random() * 5) + 1;
                const selectedAddOns = roomFilter.filter(
                  (f) => f !== "Cancellation Available",
                );
                return (
                  <div key={idx} className="px-5 py-4">
                    {/* Room Header */}
                    <div className="mb-3">
                      <h3 className="text-[15px] font-bold text-gray-900">
                        {room.name}
                      </h3>
                      <p className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <FaUser className="text-[9px]" /> Max{" "}
                        {room.maxOccupancy || 4} Adults, {room.maxChildren || 2}{" "}
                        Children
                      </p>
                    </div>

                    {/* Room Offer Card */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {idx === 0 && (
                              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                Recommended
                              </span>
                            )}
                            <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
                              {room.refundable
                                ? "Refundable"
                                : "Non-Refundable"}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-[12px] text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <FaCheck className="text-green-500 text-[10px]" />{" "}
                              {selectedAddOns.length > 0
                                ? "Room + " + selectedAddOns.join(" + ")
                                : "Room Only"}
                            </span>
                            {roomFilter.includes("Cancellation Available") && (
                              <span className="flex items-center gap-1 text-green-600">
                                <FaCheck className="text-green-500 text-[10px]" />{" "}
                                Free Cancellation
                              </span>
                            )}
                            <span>GST input credit</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {roomsLeft <= 3 && (
                            <div className="text-right">
                              <p className="text-[11px] text-orange-500 font-semibold flex items-center gap-1">
                                <span className="text-[14px]">🔔</span>{" "}
                                {roomsLeft} Rooms Left
                              </p>
                            </div>
                          )}
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-[13px] text-gray-400 line-through">
                                ₹{oldPrice.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xl font-bold text-gray-900">
                                ₹{stayPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400">
                              + ₹ {tax.toLocaleString("en-IN")} Tax and Fees
                            </p>
                            <p className="text-[11px] text-green-600 font-medium">
                              You save ₹{savings.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <button
                            onClick={() => handleBook(room)}
                            className="bg-[#e84118] hover:bg-[#c23616] text-white px-5 py-2.5 rounded text-[13px] font-bold transition-colors whitespace-nowrap"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Deal Banner */}
                    {idx === 0 && (
                      <div className="mt-3 flex items-center gap-2 text-[12px]">
                        <span className="bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          DEAL
                        </span>
                        <span className="text-yellow-600 font-medium">▶</span>
                        <span className="text-gray-600">
                          Special Offer - Save up to INR 5000 on this property
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-gray-400 text-sm">
                No rooms matching your criteria.
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            5. AMENITIES & INFO
        ════════════════════════════════════════════════════════════════════ */}
        <section
          id="amenities"
          className="bg-white border border-gray-200 rounded mb-4 overflow-hidden"
        >
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="text-[17px] font-bold text-gray-900">
              Amenities & Info
            </h2>
          </div>

          {/* Top amenity icons */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MdOutlineRoomService className="text-red-400 text-xl" />
              <span className="text-[13px] text-gray-700 font-medium">
                Room Service
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaWifi className="text-green-500 text-base" />
              <span className="text-[13px] text-gray-700 font-medium">
                Free Wifi
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left: Categorized amenities */}
            <div className="flex-[3] p-5">
              <div className="space-y-5">
                {Object.entries(groupedAmenities).map(([cat, items]) => (
                  <div key={cat}>
                    <h4 className="text-[13px] font-bold text-gray-900 uppercase mb-3">
                      {cat}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {items.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <FaCheck className="text-green-500 text-[10px] shrink-0" />
                          <span className="text-[12px] text-gray-600">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hotel images with labels */}
            <div className="lg:w-[280px] p-4 space-y-3">
              {images.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  className="relative rounded overflow-hidden h-[130px] cursor-pointer group"
                  onClick={() => handlePhotoClick(i)}
                >
                  <img
                    src={img}
                    alt={`Hotel view ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {i === 0
                      ? "Lobby"
                      : i === 1
                        ? "Primary image"
                        : "Reception"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            6. ABOUT THE HOTEL
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-gray-200 rounded mb-4 overflow-hidden">
          <div className="bg-[#4a1a2e] px-5 py-3">
            <h2 className="text-[14px] font-bold text-white uppercase tracking-wider">
              About the Hotel
            </h2>
          </div>
          <div className="p-5">
            <p className="text-[13px] text-gray-600 leading-relaxed">
              {hotel.description ||
                "This premium hotel offers world-class amenities and exceptional service. Strategically located for both business and leisure travelers, it features modern rooms, fine dining options, and comprehensive wellness facilities. Guests can enjoy complimentary WiFi, 24-hour room service, and easy access to local attractions."}
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            7. NEARBY ATTRACTIONS
        ════════════════════════════════════════════════════════════════════ */}
        <section
          id="nearby"
          className="bg-white border border-gray-200 rounded mb-1 overflow-hidden border-l-4 border-l-[#4a1a2e]"
        >
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-[17px] font-bold text-gray-900">
              Nearby Attractions
            </h2>
          </div>
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
              {nearbyAttractions.map((att, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-[12px] text-gray-600"
                >
                  <span className="text-blue-400 mt-1.5 text-[6px]">●</span>
                  <span>
                    {att.name} ({att.dist})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="px-4 py-2 mb-4">
          <p className="text-[11px] text-red-400 italic">
            <span className="font-semibold">Disclaimer</span> : Actual Room
            Images may differ slightly in appearance to illustrations/ picture
            provided.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            8. LOCATION MAP
        ════════════════════════════════════════════════════════════════════ */}
        <section
          id="map"
          className="bg-white border border-gray-200 rounded mb-4 overflow-hidden"
        >
          <div className="px-5 pt-4 pb-3 border-b border-gray-100">
            <h2 className="text-[17px] font-bold text-gray-900">
              Location Map
            </h2>
          </div>
          <div style={{ height: "450px" }}>
            <HotelMapView hotel={hotel} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            9. GUEST REVIEWS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white border border-gray-200 rounded mb-4 overflow-hidden">
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <h2 className="text-[17px] font-bold text-gray-900">
              Guest Reviews
            </h2>
          </div>
          <div className="p-5">
            <HotelGuestReviews
              hotelId={id}
              hotelRating={hotel.rating}
              reviewCount={hotel.reviewCount}
            />
          </div>
        </section>
      </div>

      {/* Modify Search Modal */}
      {modifySearchOpen && (
        <div className="fixed inset-0 z-[1100] flex items-start justify-center bg-black/60 p-4 animate-in fade-in duration-200 pt-24 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl relative w-full max-w-5xl animate-in zoom-in-95 duration-300 border border-white/10 mb-20 overflow-visible">
            {/* Background Image Container */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 z-0 opacity-100 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')`,
                }}
              />
              <div className="absolute inset-0 bg-white/40 z-0" />
            </div>

            <div className="relative z-10 p-8">
              <button
                onClick={() => setModifySearchOpen(false)}
                className="absolute top-0 right-0 bg-[#FF4D42] text-white p-3 hover:bg-[#E63E33] transition-all font-bold text-xl flex items-center justify-center w-12 h-12 shadow-lg z-20 rounded-bl-xl rounded-tr-2xl"
              >
                ✕
              </button>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight drop-shadow-sm">
                  Book Domestic and International Hotels
                </h2>
                <div className="h-1 w-16 bg-red-500 mx-auto mt-1 rounded-full" />
              </div>
              <HotelSearch
                compact={true}
                initialData={searchParams}
                onSearch={(params) => {
                  setModifySearchOpen(false);
                  navigate(
                    `/hotels?city=${encodeURIComponent(params.city)}&checkIn=${params.checkIn}&checkOut=${params.checkOut}&rooms=${params.rooms}&guests=${params.guests}${params.roomsData ? `&roomsData=${encodeURIComponent(JSON.stringify(params.roomsData))}` : ""}`,
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Shortlist Modal */}
      {shortlistModalOpen && (
        <HotelShortlistModal
          hotels={shortlistedHotels}
          onClose={() => setShortlistModalOpen(false)}
          onShortlistToggle={toggleShortlist}
          searchParams={searchParams}
        />
      )}

      {/* Floating Shortlist Button */}
      <button
        onClick={() => setShortlistModalOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-[#0b387e] text-white rounded-l-xl shadow-2xl z-50 hover:bg-[#072554] transition-colors border border-r-0 border-white/10 hover:-translate-x-1 duration-300 flex items-center justify-center overflow-hidden group"
        style={{ width: '48px', height: '160px' }}
        title="View Shortlisted Hotels"
      >
        <div className="absolute flex items-center gap-2 -rotate-90 whitespace-nowrap origin-center">
          <FaHeart className="text-white text-[14px]" />
          <span className="text-[14px] font-bold tracking-widest uppercase">
            Shortlisted ({shortlistedHotels.length})
          </span>
        </div>
      </button>

      <Footer />

      {/* Gallery Modal */}
      <HotelImageGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={images}
        hotelName={hotel?.name}
        initialIndex={galleryInitialIndex}
      />
    </div>
  );
};

export default HotelDetail;
