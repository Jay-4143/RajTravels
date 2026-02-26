import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import FlightResults from "../components/FlightResults";
import ServicesStrip from "../components/ServicesStrip";
import ExclusiveDeals from "../components/ExclusiveDeals";
import DestinationCard from "../components/DestinationCard";
import OfferCard from "../components/OfferCard";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import { searchFlights } from "../api/flights";
import { FaExchangeAlt, FaCalendarAlt, FaUser, FaSearch, FaEdit } from "react-icons/fa";

const destinations = [
  { title: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", startingPrice: 24999, slug: "/hotels?city=Dubai" },
  { title: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", startingPrice: 45999, slug: "/holidays" },
  { title: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", startingPrice: 18999, slug: "/hotels?city=Singapore" },
  { title: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", startingPrice: 52999, slug: "/hotels?city=London" },
  { title: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", startingPrice: 22999, slug: "/holidays" },
  { title: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800", startingPrice: 16999, slug: "/holidays" },
];

const offers = [
  { title: "Summer Sale", subtitle: "Up to 30% off on international flights", discount: "30% OFF", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800", ctaText: "Explore Deals", link: "/flights", state: { from: "Delhi", to: "Bangkok" } },
  { title: "Weekend Getaways", subtitle: "Hotels starting at ₹1,999 per night", discount: "FLAT 20%", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", ctaText: "Book Now", link: "/hotels", state: { presetCity: "Goa" } },
  { title: "Holiday Packages", subtitle: "All-inclusive packages to top destinations", discount: "BEST PRICE", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800", ctaText: "View Packages", link: "/holidays", state: { destination: "Maldives" } },
];

/* ───── Compact Search Summary Bar ───── */
const SearchSummaryBar = ({ searchParams, onModify }) => {
  if (!searchParams) return null;

  const totalTravellers =
    (searchParams.adults || 0) + (searchParams.children || 0) + (searchParams.infants || 0) || 1;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-IN", { weekday: "long" });
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-16 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0 py-3">
          {searchParams.tripType === "multi-city" ? (
            <div className="flex-1 px-4 border-r border-white/20">
              <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium">Multi-City Search</p>
              <p className="text-lg font-bold leading-tight">
                {searchParams.segments?.[0]?.from} → ... → {searchParams.segments?.[searchParams.segments.length - 1]?.to}
              </p>
              <p className="text-xs text-gray-400">
                {searchParams.segments?.length} Segments
              </p>
            </div>
          ) : (
            <>
              {/* From */}
              <div className="flex-1 border-r border-white/20 pr-4">
                <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium">From</p>
                <p className="text-lg font-bold leading-tight">{searchParams.fromCity || searchParams.from}</p>
                <p className="text-xs text-gray-400 truncate">
                  {searchParams.from}, {searchParams.fromCity || ""}
                </p>
              </div>

              <div className="px-3">
                <FaExchangeAlt className="w-4 h-4 text-gray-400" />
              </div>

              {/* To */}
              <div className="flex-1 border-r border-white/20 px-4">
                <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium">To</p>
                <p className="text-lg font-bold leading-tight">{searchParams.toCity || searchParams.to}</p>
                <p className="text-xs text-gray-400 truncate">
                  {searchParams.to}, {searchParams.toCity || ""}
                </p>
              </div>

              {/* Departure */}
              <div className="flex-1 border-r border-white/20 px-4">
                <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium">Departure</p>
                <p className="text-lg font-bold leading-tight">{formatDate(searchParams.departureDate)}</p>
                <p className="text-xs text-gray-400">{getDayName(searchParams.departureDate)}</p>
              </div>

              {/* Return (if round-trip) */}
              {searchParams.tripType === "round-trip" && searchParams.returnDate && (
                <div className="flex-1 border-r border-white/20 px-4">
                  <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium">Return</p>
                  <p className="text-lg font-bold leading-tight">{formatDate(searchParams.returnDate)}</p>
                  <p className="text-xs text-gray-400">{getDayName(searchParams.returnDate)}</p>
                </div>
              )}
            </>
          )}

          {/* Travellers */}

          {/* Travellers */}
          <div className="flex-1 px-4">
            <p className="text-[10px] uppercase tracking-wider text-green-400 font-medium">Travellers & Class</p>
            <p className="text-lg font-bold leading-tight">
              {totalTravellers < 10 ? `0${totalTravellers}` : totalTravellers}{" "}
              <span className="text-sm font-normal text-gray-300">
                Traveller{totalTravellers > 1 ? "s" : ""}
              </span>
            </p>
            <p className="text-xs text-gray-400 capitalize">{searchParams.travelClass || "Economy"}</p>
          </div>

          {/* Modify Search Button */}
          <div className="flex-shrink-0 pl-4">
            <button
              type="button"
              onClick={onModify}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm"
            >
              <FaEdit className="w-4 h-4" />
              MODIFY SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───── Main Flights Page ───── */
const Flights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchExecuted = useRef(false);
  const [searchParams, setSearchParams] = useState(() => {
    const s = location.state;
    // More lenient check for search data
    const hasAnyData = s && (s.from || s.to || s.departureDate || (s.tripType === 'multi-city' && s.segments));
    if (hasAnyData) {
      return {
        from: s.from,
        to: s.to,
        fromCity: s.fromCity || s.from,
        toCity: s.toCity || s.to,
        departureDate: s.departureDate,
        returnDate: s.returnDate,
        adults: s.adults || 1,
        children: s.children || 0,
        infants: s.infants || 0,
        travelClass: s.travelClass || "economy",
        tripType: s.tripType || "one-way",
        segments: s.segments,
        specialFare: s.specialFare
      };
    }
    return null;
  });
  const [filterParams, setFilterParams] = useState({});
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState("asc");
  const [flights, setFlights] = useState(location.state?.flights || []);
  const [totalFlights, setTotalFlights] = useState(0);
  const [returnFlights, setReturnFlights] = useState(location.state?.returnFlights || []);
  const [loading, setLoading] = useState(() => {
    if (location.state?.flights?.length > 0) return false;
    const s = location.state;
    return !!((s?.from?.length === 3 && s?.to?.length === 3 && s?.departureDate) ||
      (s?.tripType === 'multi-city' && s?.segments?.length > 0));
  });
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(() => {
    const s = location.state;
    const hasData = s && (s.from || (s.tripType === 'multi-city' && s.segments));
    return !hasData;
  });
  const [isModifying, setIsModifying] = useState(location.state?.isModifying || false);
  const resultsRef = useRef(null);

  const runSearch = useCallback(
    (params, filters = filterParams, sortVal = sort, orderVal = order) => {
      const isMulti = params?.tripType === 'multi-city';
      if (!isMulti && (!params?.from || !params?.to || !params?.departureDate)) return;
      if (isMulti && (!params?.segments || params.segments.length === 0)) return;

      setLoading(true);
      setError(null);
      const passengers = (params.adults || 0) + (params.children || 0) + (params.infants || 0);
      const req = {
        from: params.from,
        to: params.to,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        segments: params.segments,
        passengers: passengers < 1 ? 1 : passengers,
        class: params.travelClass || "economy",
        sort: sortVal,
        order: orderVal,
        page: 1,
        limit: 50,
        ...filters,
      };
      searchFlights(req)
        .then((res) => {
          if (res?.data) {
            setFlights(res.data.flights || []);
            setTotalFlights(res.data.pagination?.total || (res.data.flights?.length || 0));
            setReturnFlights(res.data.returnFlights || []);
            setSearchParams(params);
            setShowHero(false);
            setIsModifying(false);
          } else {
            throw new Error("Invalid response from server");
          }
        })
        .catch((err) => {
          console.error("Flight Search Error:", err);
          setError(err.response?.data?.message || err.message || "Search failed.");
          setFlights([]);
          setReturnFlights([]);
        })
        .finally(() => setLoading(false));
    },
    [filterParams, sort, order]
  );

  const handleSearch = useCallback(
    (params) => {
      setSearchParams(params);
      runSearch(params, filterParams, sort, order);
      setIsModifying(false);
    },
    [runSearch, filterParams, sort, order]
  );

  useEffect(() => {
    const s = location.state;
    // Only trigger search if we have state, hasn't executed yet, AND we don't already have flights in state
    if (s && !searchExecuted.current && (!s.flights || s.flights.length === 0)) {
      console.log("[Flights] Auto-triggering search from state:", s);
      const isMulti = s.tripType === "multi-city" || (s.segments && s.segments.length > 0);
      const hasAnyData = isMulti
        ? s.segments?.length > 0
        : s.from && s.to && s.departureDate;

      if (hasAnyData) {
        searchExecuted.current = true;
        const searchData = isMulti
          ? { segments: s.segments, adults: s.adults, children: s.children, infants: s.infants, class: s.travelClass, tripType: "multi-city" }
          : {
            from: s.from,
            to: s.to,
            departureDate: s.departureDate || new Date().toISOString().split('T')[0],
            returnDate: s.returnDate,
            adults: s.adults || 1,
            children: s.children || 0,
            infants: s.infants || 0,
            class: s.travelClass || "economy",
            tripType: s.tripType || "one-way",
            specialFare: s.specialFare
          };
        setSearchParams(searchData);
        runSearch(searchData, filterParams, sort, order);
      }
    } else if (s && s.flights && s.flights.length > 0) {
      // If flights are already in state (e.g. from login redirect), just mark as executed
      searchExecuted.current = true;
    }
  }, [location.state, runSearch, filterParams, sort, order]);


  const handleFilterChange = useCallback(
    (next) => {
      const newFilters = { ...filterParams, ...next };
      setFilterParams(newFilters);

      // Calculate NEW search params locally to avoid stale state issues in runSearch
      let updatedParams = searchParams;
      if (next.departureDate && searchParams) {
        updatedParams = { ...searchParams, departureDate: next.departureDate };
        setSearchParams(updatedParams);
      }

      if (updatedParams) runSearch(updatedParams, newFilters, sort, order);
    },
    [searchParams, filterParams, runSearch, sort, order]
  );

  const handleSortChange = useCallback(
    (newSort, newOrder) => {
      setSort(newSort);
      setOrder(newOrder);
      if (searchParams) runSearch(searchParams, filterParams, newSort, newOrder);
    },
    [searchParams, filterParams, runSearch]
  );

  const handleBook = useCallback(
    (flight, returnFlight) => {
      try {
        console.log("[Flights] handleBook called", { flightId: flight?._id, hasSearchParams: !!searchParams });
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("[Flights] No token, redirecting to login");
          navigate("/login", {
            state: {
              ...searchParams,
              flights,
              returnFlights,
              returnTo: location.pathname
            }
          });
          return;
        }

        const bookingState = {
          flight,
          returnFlight,
          searchParams,
          tripType: searchParams?.tripType || "one-way",
        };

        console.log("[Flights] Navigating to /flights/booking with state:", bookingState);
        navigate("/flights/booking", { state: bookingState });
      } catch (err) {
        console.error("[Flights] Error in handleBook:", err);
        setError("Failed to initiate booking. Please try again.");
      }
    },
    [navigate, searchParams, location.pathname]
  );

  const handleModifySearch = () => {
    setIsModifying(!isModifying);
  };

  return (
    <>
      {/* Show full Hero when no results OR when user clicks Modify Search */}
      {showHero && <Hero onSearch={handleSearch} initialParams={searchParams} />}

      {/* Show compact summary bar when results are visible and Hero is hidden */}
      {!showHero && searchParams && (
        <div className="sticky top-0 z-[100] bg-white shadow-md">
          <SearchSummaryBar searchParams={searchParams} onModify={handleModifySearch} />
        </div>
      )}

      {/* Modify Search Modal */}
      {isModifying && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm py-10 custom-scrollbar">
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsModifying(false)}
          ></div>
          <div className="relative w-full max-w-6xl shadow-2xl animate-in fade-in zoom-in duration-300 rounded-[2.5rem]">
            <button
              onClick={() => setIsModifying(false)}
              className="absolute top-6 right-6 z-[1010] w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-xl hover:rotate-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <Hero onSearch={handleSearch} isModal={true} initialParams={searchParams} />
            </div>
          </div>
        </div>
      )}

      {/* ServicesStrip only when full Hero is visible */}
      {showHero && <ServicesStrip />}

      {/* Flight results */}
      {searchParams && (
        <div ref={resultsRef}>
          {error && (
            <div className="max-w-7xl mx-auto px-4 py-2">
              <p className="text-red-600 bg-red-50 rounded-lg p-3 text-sm">{error}</p>
            </div>
          )}
          <FlightResults
            flights={flights}
            totalFlights={totalFlights}
            returnFlights={returnFlights}
            searchParams={searchParams}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sort={sort}
            order={order}
            loading={loading}
            onBook={handleBook}
          />
        </div>
      )}

      {/* Rest of the page (only when no results are showing) */}
      {!searchParams && (
        <>
          <ExclusiveDeals />
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Popular Destinations</h2>
              <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                Discover trending places and book your next trip at the best prices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <DestinationCard key={dest.title} title={dest.title} image={dest.image} startingPrice={dest.startingPrice} slug={dest.slug} />
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Special Offers</h2>
              <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                Limited-time deals on flights, hotels, and holiday packages.
              </p>
              <div className="flex flex-col gap-6">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.title}
                    title={offer.title}
                    subtitle={offer.subtitle}
                    discount={offer.discount}
                    image={offer.image}
                    ctaText={offer.ctaText}
                    link={offer.link}
                    state={offer.state}
                  />
                ))}
              </div>
            </div>
          </section>
          <WhyChooseUs />
          <Reviews />
        </>
      )}

      <Footer />
    </>
  );
};

export default Flights;
