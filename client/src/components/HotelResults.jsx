import { useState } from "react";
import { HiFilter } from "react-icons/hi";
import { FaList, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import HotelMapView from "./HotelMapView";

const AMENITIES_OPTIONS = [
  "WiFi", "Swimming Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking", "Airport Shuttle",
  "Room Service", "Laundry", "Business Center", "Pet Friendly", "Beach Access", "Mountain View"
];

const PROPERTY_TYPES = ["Hotel", "Resort", "Apartment", "Villa", "Hostel", "Guesthouse"];

const HotelCard = ({ hotel, searchParams, onViewDetails, isSelected, onSelectToggle }) => {
  const { formatPrice } = useGlobal();
  const imageUrl = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  const amenitiesPreview = hotel.amenities?.slice(0, 4) || [];
  const pricePerNight = hotel.pricePerNight || 0;
  const calculateTotalPrice = () => {
    if (!searchParams || !searchParams.checkIn || !searchParams.checkOut) return null;
    const { checkIn, checkOut, roomsData } = searchParams;
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const totalRooms = roomsData?.length || searchParams.rooms || 1;
    return pricePerNight * nights * totalRooms;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className={`flex gap-3 mb-4 items-stretch group/card relative`}>
      <div className="flex flex-col pt-4">
        <label className="relative flex cursor-pointer items-center rounded-full p-2" htmlFor={`checkbox-${hotel._id}`}>
          <input
            type="checkbox"
            className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
            id={`checkbox-${hotel._id}`}
            checked={isSelected}
            onChange={() => onSelectToggle(hotel)}
          />
          <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
      </div>
      <div className={`flex-1 bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isSelected ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200'}`}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto flex-shrink-0 cursor-pointer" onClick={() => onViewDetails(hotel)}>
            <img src={imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.address || hotel.city}</p>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                  <span className="text-sm text-gray-600">({hotel.rating?.toFixed(1) || "0.0"})</span>
                </div>
                {amenitiesPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {amenitiesPreview.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {a}
                      </span>
                    ))}
                    {hotel.amenities?.length > 4 && (
                      <span className="text-xs px-2 py-1 text-gray-500">+{hotel.amenities.length - 4} more</span>
                    )}
                  </div>
                )}
                {hotel.freeCancellation && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                    Free Cancellation
                  </span>
                )}
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice || pricePerNight)}</p>
                {totalPrice ? (
                  <p className="text-xs text-gray-500 font-medium">for {Math.max(1, Math.ceil((new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24)))} night{Math.max(1, Math.ceil((new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24))) > 1 ? 's' : ''}, {searchParams.roomsData?.length || searchParams.rooms || 1} room{searchParams.roomsData?.length || searchParams.rooms || 1 > 1 ? 's' : ''}</p>
                ) : (
                  <p className="text-xs text-gray-500">per night</p>
                )}
                {totalPrice && (
                  <p className="text-[10px] text-gray-400 mt-1">{formatPrice(pricePerNight)} / night</p>
                )}
                <button
                  type="button"
                  onClick={() => onViewDetails(hotel)}
                  className="mt-3 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelResults = ({
  hotels = [],
  searchParams,
  filterParams,
  pagination,
  onFilterChange,
  onSortChange,
  onPageChange,
  sort,
  order,
  loading,
  selectedHotels = [],
  setSelectedHotels,
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"

  const handleViewDetails = (hotel) => {
    const url = `/hotels/${hotel._id}?searchParams=${encodeURIComponent(JSON.stringify(searchParams))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectToggle = (hotel) => {
    if (!setSelectedHotels) return;
    setSelectedHotels((prev) => {
      const isSelected = prev.find((h) => h._id === hotel._id);
      if (isSelected) {
        return prev.filter((h) => h._id !== hotel._id);
      } else {
        return [...prev, hotel];
      }
    });
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-gray-600">
          {loading ? "Searching..." : `${pagination?.total ?? hotels.length} hotel(s) found`}
        </p>
        <div className="flex items-center gap-3">
          {/* List / Map toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "list"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              <FaList size={12} /> List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "map"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              <FaMapMarkerAlt size={12} /> Map
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <select
              value={`${sort}-${order}`}
              onChange={(e) => {
                const [s, o] = e.target.value.split("-");
                onSortChange(s, o);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="starCategory-desc">Stars: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          No hotels found. Try different dates or filters.
        </div>
      ) : viewMode === "map" ? (
        /* ── Map View ── */
        <HotelMapView
          hotels={hotels}
          onViewDetails={handleViewDetails}
          className="mb-6"
        />
      ) : (
        /* ── List View ── */
        <>
          <div className="space-y-4">
            {hotels && hotels.filter(h => h && h._id).map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                searchParams={searchParams}
                onViewDetails={handleViewDetails}
                isSelected={selectedHotels.some(sh => sh._id === hotel._id)}
                onSelectToggle={handleSelectToggle}
              />
            ))}
          </div>
          {pagination && pagination.pages > 1 && onPageChange && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelResults;
