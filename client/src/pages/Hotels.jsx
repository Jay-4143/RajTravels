import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import HotelSearch from "../components/HotelSearch";
import HotelResults from "../components/HotelResults";
import HotelFilters from "../components/HotelFilters";
import HotelPopularDestinations from "../components/HotelPopularDestinations";
import HotelFeaturedHotels from "../components/HotelFeaturedHotels";
import HotelPromoBanner from "../components/HotelPromoBanner";
import HotelOffers from "../components/HotelOffers";
import WhyBookHotels from "../components/WhyBookHotels";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import { searchHotels } from "../api/hotels";
import ServicesStrip from "../components/ServicesStrip";
import HotelShortlistModal from "../components/HotelShortlistModal";
import HotelModifySearchHeader from "../components/HotelModifySearchHeader";
import HotelImageGallery from "../components/HotelImageGallery";

const Hotels = () => {
  const location = useLocation();
  const searchExecuted = useRef(false);
  const searchBarRef = useRef(null);
  const [searchParams, setSearchParams] = useState(null);
  const [filterParams, setFilterParams] = useState({});
  const [sort, setSort] = useState("rating");
  const [order, setOrder] = useState("desc");
  const [hotels, setHotels] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shortlistedHotels, setShortlistedHotels] = useState(() => {
    const saved = localStorage.getItem("shortlistedHotels");
    return saved ? JSON.parse(saved) : [];
  });
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryProps, setGalleryProps] = useState({ images: [], hotelName: "", initialIndex: 0 });

  useEffect(() => {
    localStorage.setItem("shortlistedHotels", JSON.stringify(shortlistedHotels));
  }, [shortlistedHotels]);

  const toggleShortlist = (hotel) => {
    setShortlistedHotels((prev) => {
      const isAlready = prev.find((h) => h._id === hotel._id);
      if (isAlready) {
        return prev.filter((h) => h._id !== hotel._id);
      } else {
        return [...prev, hotel];
      }
    });
  };

  useEffect(() => {
    if (searchExecuted.current) return;

    const qs = new URLSearchParams(location.search);
    const queryCity = qs.get("city");
    const preset = location.state?.presetCity;

    if (queryCity) {
      searchExecuted.current = true;
      const checkIn = qs.get("checkIn");
      const checkOut = qs.get("checkOut");
      const guests = parseInt(qs.get("guests")) || 2;
      const rooms = parseInt(qs.get("rooms")) || 1;
      let roomsData = [{ adults: 2, children: 0, childAges: [] }];

      try {
        const rd = qs.get("roomsData");
        if (rd) roomsData = JSON.parse(rd);
      } catch (e) { }

      const params = { city: queryCity, checkIn, checkOut, guests, rooms, roomsData };

      searchHotels({
        ...params,
        sort: "rating",
        order: "desc",
        page: 1,
        limit: 12,
      })
        .then((res) => {
          setHotels(res.data.hotels || []);
          setPagination(res.data.pagination || null);
          setSearchParams(params);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Search failed.");
          setHotels([]);
        })
        .finally(() => setLoading(false));

    } else if (preset) {
      searchExecuted.current = true;
      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      searchHotels({
        city: preset,
        checkIn: today,
        checkOut: tomorrow,
        sort: "rating",
        order: "desc",
        page: 1,
        limit: 12,
      })
        .then((res) => {
          setHotels(res.data.hotels || []);
          setPagination(res.data.pagination || null);
          setSearchParams({ city: preset, checkIn: today, checkOut: tomorrow, guests: 2, rooms: 1 });
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Search failed.");
          setHotels([]);
        })
        .finally(() => setLoading(false));
    }
  }, [location.search, location.state?.presetCity]);

  const runSearch = useCallback(
    (params, filters = filterParams, sortVal = sort, orderVal = order, pageOverride) => {
      if (!params?.city || !params?.checkIn || !params?.checkOut) return;
      setLoading(true);
      setError(null);
      const page = pageOverride ?? params?.page ?? 1;
      const req = {
        city: params.city,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        sort: sortVal,
        order: orderVal,
        page,
        limit: 12,
        guests: params.guests || (params.roomsData?.reduce((acc, r) => acc + r.adults + r.children, 0)) || 1,
        roomsData: params.roomsData,
        ...filters,
      };
      console.log("[Hotels] Running Search:", req);
      searchHotels(req)
        .then((res) => {
          console.log("[Hotels] Search Success:", res.data);
          setHotels(res.data.hotels || []);
          setPagination(res.data.pagination || null);
          setSearchParams(params);
        })
        .catch((err) => {
          console.error("[Hotels] Search Error:", err);
          setError(err.response?.data?.message || "Search failed.");
          setHotels([]);
          setPagination(null);
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

  const handleOpenGallery = useCallback((hotel, initialIndex = 0) => {
    setGalleryProps({
      images: hotel.images && hotel.images.length > 0 ? hotel.images : [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200"
      ],
      hotelName: hotel.name,
      initialIndex
    });
    setGalleryOpen(true);
  }, []);

  /* ── Simple Local Error Boundary ── */
  if (error) {
    console.log("[Hotels] Rendering with error state:", error);
  }

  return (
    <>
      <div ref={searchBarRef}>
        {!searchParams && <HotelSearch onSearch={handleSearch} />}
      </div>

      {searchParams && (
        <HotelModifySearchHeader
          searchParams={searchParams}
          onModify={() => setIsModifyModalOpen(true)}
          selectedHotels={selectedHotels}
          onClearSelection={() => setSelectedHotels([])}
        />
      )}

      {/* Modify Modal */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-start justify-center bg-black/60 p-4 animate-in fade-in duration-200 pt-24 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl relative w-full max-w-5xl animate-in zoom-in-95 duration-300 border border-white/10 mb-20 overflow-visible">
            {/* Background Image Container (Handles rounding) */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 z-0 opacity-100 bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')` }}
              />
              <div className="absolute inset-0 bg-white/40 z-0" />
            </div>

            <div className="relative z-10 p-8">
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="absolute top-0 right-0 bg-[#FF4D42] text-white p-3 hover:bg-[#E63E33] transition-all font-bold text-xl flex items-center justify-center w-12 h-12 shadow-lg z-20 rounded-bl-xl rounded-tr-2xl"
              >
                ✕
              </button>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight drop-shadow-sm">Book Domestic and International Hotels</h2>
                <div className="h-1 w-16 bg-red-500 mx-auto mt-1 rounded-full" />
              </div>
              <HotelSearch
                compact={true}
                initialData={searchParams}
                onSearch={(params) => {
                  handleSearch(params);
                  setIsModifyModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {!searchParams && <ServicesStrip />}
      {searchParams && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <HotelFilters
              filterParams={filterParams}
              onFilterChange={handleFilterChange}
            />
            <div className="flex-1 min-w-0">
              {error && (
                <div className="mb-4">
                  <p className="text-red-600 bg-red-50 rounded-lg p-3 text-sm">{error || "An unexpected error occurred."}</p>
                </div>
              )}
              <HotelResults
                hotels={hotels || []}
                searchParams={searchParams}
                filterParams={filterParams}
                pagination={pagination}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                onPageChange={(page) => {
                  if (searchParams) runSearch(searchParams, filterParams, sort, order, page);
                }}
                sort={sort}
                order={order}
                loading={loading}
                shortlistedHotels={shortlistedHotels}
                selectedHotels={selectedHotels}
                setSelectedHotels={setSelectedHotels}
                onShortlistToggle={toggleShortlist}
                onOpenShortlist={() => setShortlistModalOpen(true)}
                onOpenGallery={handleOpenGallery}
              />
            </div>
          </div>
        </section>
      )}

      {/* Shortlist Modal */}
      {shortlistModalOpen && (
        <HotelShortlistModal
          hotels={shortlistedHotels}
          searchParams={searchParams}
          onClose={() => setShortlistModalOpen(false)}
          onShortlistToggle={toggleShortlist}
        />
      )}

      {/* Advanced Image Gallery */}
      <HotelImageGallery
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        {...galleryProps}
      />

      <HotelPopularDestinations onCityClick={(city) => {
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        handleSearch({ city, checkIn: today, checkOut: tomorrow, guests: 2, rooms: 1 });
      }} />
      <HotelFeaturedHotels onSearch={handleSearch} onOpenGallery={handleOpenGallery} />
      <HotelPromoBanner />
      <HotelOffers onBookNow={(city) => {
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        handleSearch({ city, checkIn: today, checkOut: tomorrow, guests: 2, rooms: 1 });
        searchBarRef.current?.scrollIntoView({ behavior: 'smooth' });
      }} />
      <WhyBookHotels />
      <Reviews />
      <Footer />
    </>
  );
};

export default Hotels;
