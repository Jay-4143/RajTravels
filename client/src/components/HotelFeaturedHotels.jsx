import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedHotels } from "../api/hotels";

const HotelFeaturedHotels = ({ onSearch, onOpenGallery }) => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedHotels(8)
      .then((res) => setHotels(res.data?.hotels || []))
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const handleView = (hotel) => {
    window.open(`/hotels/${hotel._id}`, '_blank');
  };

  const handleBook = (hotel) => {
    if (onSearch) {
      const today = new Date().toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      onSearch({ city: hotel.city, checkIn: today, checkOut: tomorrow, guests: 2, rooms: 1 });
    } else {
      window.open(`/hotels/${hotel._id}`, '_blank');
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Featured Hotels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (hotels.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Featured Hotels</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Handpicked hotels with the best ratings and value for money.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => {
            const img = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";
            return (
              <div
                key={hotel._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div
                  className="h-48 overflow-hidden cursor-pointer"
                  onClick={() => onOpenGallery && onOpenGallery(hotel)}
                >
                  <img src={img} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">{hotel.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{hotel.city}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                    <span className="text-sm text-gray-500">({hotel.rating?.toFixed(1) || "0.0"})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">₹{(hotel.pricePerNight || 0).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleView(hotel)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBook(hotel)}
                        className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HotelFeaturedHotels;
