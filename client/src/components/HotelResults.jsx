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

const HotelCard = ({ hotel, searchParams, onViewDetails }) => {
  const { formatPrice } = useGlobal();
  const imageUrl = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  const amenitiesPreview = hotel.amenities?.slice(0, 4) || [];
  const pricePerNight = hotel.pricePerNight || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
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
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatPrice(pricePerNight)}</p>
              <p className="text-xs text-gray-500">per night</p>
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
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"

  const handleViewDetails = (hotel) => {
    navigate(`/hotels/${hotel._id}`, { state: { searchParams } });
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
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} searchParams={searchParams} onViewDetails={handleViewDetails} />
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
