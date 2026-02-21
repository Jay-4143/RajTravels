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

  useEffect(() => {
    const preset = location.state?.presetCity;
    if (preset && !searchExecuted.current) {
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
  }, [location.state?.presetCity]);

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
        ...filters,
      };
      searchHotels(req)
        .then((res) => {
          setHotels(res.data.hotels || []);
          setPagination(res.data.pagination || null);
          setSearchParams(params);
        })
        .catch((err) => {
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

  return (
    <>
      <div ref={searchBarRef}>
        <HotelSearch onSearch={handleSearch} />
      </div>
      {searchParams && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <HotelFilters
              filterParams={filterParams}
              onFilterChange={handleFilterChange}
              showFilters={true} // Simplification: Manage toggle state inside Hotels or pass it dwon
              setShowFilters={() => { }}
            />
            <div className="flex-1 min-w-0">
              {error && (
                <div className="mb-4">
                  <p className="text-red-600 bg-red-50 rounded-lg p-3 text-sm">{error}</p>
                </div>
              )}
              <HotelResults
                hotels={hotels}
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
              />
            </div>
          </div>
        </section>
      )}
      <HotelPopularDestinations onCityClick={(city) => {
        const today = new Date().toISOString().slice(0, 10);
        const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        handleSearch({ city, checkIn: today, checkOut: tomorrow, guests: 2, rooms: 1 });
      }} />
      <HotelFeaturedHotels onSearch={handleSearch} />
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
