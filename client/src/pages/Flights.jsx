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
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0 py-3">
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
  const [searchParams, setSearchParams] = useState(null);
  const [filterParams, setFilterParams] = useState({});
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState("asc");
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(true);
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
          setFlights(res.data.flights || []);
          setReturnFlights(res.data.returnFlights || []);
          setSearchParams(params);
          setShowHero(false); // Hide full Hero, show compact bar
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Search failed.");
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
    },
    [runSearch, filterParams, sort, order]
  );

  useEffect(() => {
    const { from, to } = location.state || {};
    if (from && to && !searchExecuted.current) {
      searchExecuted.current = true;
      const today = new Date().toISOString().slice(0, 10);
      handleSearch({
        from,
        to,
        departureDate: today,
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: "economy",
        tripType: "one-way"
      });
    }
  }, [location.state, handleSearch]);


  const handleFilterChange = useCallback(
    (next) => {
      const newFilters = { ...filterParams, ...next };
      setFilterParams(newFilters);
      if (searchParams) runSearch(searchParams, newFilters, sort, order);
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
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { from: "flight-booking" } });
        return;
      }
      navigate("/flights/booking", {
        state: {
          flight,
          returnFlight,
          searchParams,
          tripType: searchParams?.tripType || "one-way",
        },
      });
    },
    [navigate, searchParams]
  );

  const handleModifySearch = () => {
    setShowHero(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Show full Hero when no results OR when user clicks Modify Search */}
      {showHero && <Hero onSearch={handleSearch} />}

      {/* Show compact summary bar when results are visible and Hero is hidden */}
      {!showHero && searchParams && (
        <SearchSummaryBar searchParams={searchParams} onModify={handleModifySearch} />
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
