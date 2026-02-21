import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getHotelById, getRoomAvailability } from "../api/hotels";
import HotelMapView from "../components/HotelMapView";
import { useGlobal } from "../context/GlobalContext";
import HotelGuestReviews from "../components/HotelGuestReviews";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { searchParams } = location.state || {};
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPrice } = useGlobal();
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    getHotelById(id)
      .then((res) => {
        setHotel(res.data.hotel);
        if (searchParams?.checkIn && searchParams?.checkOut) {
          return getRoomAvailability(id, searchParams.checkIn, searchParams.checkOut);
        }
        return Promise.resolve({ data: { rooms: res.data.hotel.rooms || [] } });
      })
      .then((res) => {
        setRooms(res.data.rooms || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load hotel details.");
      })
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  const handleBook = (room) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "hotel-booking" } });
      return;
    }
    navigate("/hotels/booking", {
      state: {
        hotel,
        room,
        searchParams: searchParams || { checkIn: "", checkOut: "", guests: 2, rooms: 1 },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Hotel not found"}</p>
          <button
            type="button"
            onClick={() => navigate("/hotels")}
            className="px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  const images = hotel.images?.length
    ? hotel.images
    : [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/hotels")}
          className="mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Back to Hotels
        </button>

        {/* ── Image Gallery ── */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-64 md:h-96 bg-gray-200">
            <img src={images[galleryIndex]} alt={hotel.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setGalleryIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-700"
                >
                  ›
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGalleryIndex(i)}
                      className={`w-2 h-2 rounded-full ${i === galleryIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                <p className="text-gray-600 mb-2">{hotel.address || hotel.city}</p>
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  <span className="text-gray-600">({hotel.rating?.toFixed(1) || "0.0"})</span>
                </div>
                {hotel.description && <p className="text-gray-700 mb-4">{hotel.description}</p>}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((a, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Location Map ── */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Location</h2>
          <p className="text-gray-500 text-sm mb-4">{hotel.address || hotel.city}</p>
          <HotelMapView hotel={hotel} />
        </div>

        {/* ── Available Rooms ── */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Rooms</h2>
          {rooms.length === 0 ? (
            <p className="text-gray-600">No rooms available for selected dates.</p>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="border rounded-lg p-4 border-gray-200 hover:border-red-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name || room.roomType}</h3>
                      {room.description && <p className="text-sm text-gray-600 mb-2">{room.description}</p>}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {room.amenities.slice(0, 4).map((a, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-600">
                        Available: {room.available || 0} room{room.available !== 1 ? "s" : ""} • Max Occupancy: {room.maxOccupancy || 2}
                      </p>
                      {searchParams?.checkIn && searchParams?.checkOut && (
                        <p className="text-sm text-gray-600">
                          {room.nights || 1} night{room.nights !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(room.pricePerNight)}</p>
                      <p className="text-sm text-gray-500">per night</p>
                      {searchParams?.checkIn && searchParams?.checkOut && room.totalPrice && (
                        <p className="text-sm text-gray-600 mt-1">
                          Total: {formatPrice(room.totalPrice)}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleBook(room)}
                        disabled={!room.available || room.available < 1}
                        className={`mt-3 px-6 py-2.5 rounded-lg font-semibold transition-colors ${room.available && room.available >= 1
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        {room.available && room.available >= 1 ? "Book Now" : "Not Available"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Guest Reviews ── */}
        <HotelGuestReviews hotelId={id} hotelRating={hotel.rating} reviewCount={hotel.reviewCount} />
      </div>
    </div>
  );
};

export default HotelDetail;



