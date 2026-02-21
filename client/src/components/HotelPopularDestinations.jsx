import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularDestinations } from "../api/hotels";

const DEST_IMAGES = {
  Mumbai: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600",
  "New Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
  Bangalore: "https://images.unsplash.com/photo-1596178060812-6b8c19e28a56?w=600",
  Chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600",
  Goa: "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=600",
  Jaipur: "https://images.unsplash.com/photo-1477587458883-47145ed31db6?w=600",
  Udaipur: "https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=600",
  Shimla: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
  Manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
  Ooty: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
  Agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
  Kochi: "https://images.unsplash.com/photo-1609340981878-cd4e265a53fc?w=600",
  "Port Blair": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
  Bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600",
  London: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600",
  Mahabaleshwar: "https://images.unsplash.com/photo-1622461589396-5ec72ddb6290?w=600",
  Kodaikanal: "https://images.unsplash.com/photo-1580323104226-68a11ba5cf99?w=600",
  Varanasi: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600",
  Darjeeling: "https://images.unsplash.com/photo-1544761634-dc512f2238a3?w=600",
  Leh: "https://images.unsplash.com/photo-1566836610593-62a64888a251?w=600",
};

const getImage = (city) => DEST_IMAGES[city] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";

const HotelPopularDestinations = ({ onCityClick }) => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularDestinations()
      .then((res) => {
        if (res.data?.destinations?.length > 0) {
          setDestinations(res.data.destinations);
        } else {
          setDestinations([
            { city: "Mumbai", count: 12, minPrice: 1999 },
            { city: "Goa", count: 8, minPrice: 2499 },
            { city: "Jaipur", count: 6, minPrice: 1899 },
            { city: "Shimla", count: 5, minPrice: 2999 },
            { city: "Ooty", count: 4, minPrice: 1599 },
            { city: "New Delhi", count: 10, minPrice: 2299 },
            { city: "Udaipur", count: 5, minPrice: 2199 },
            { city: "Bangalore", count: 7, minPrice: 2399 },
            { city: "Varanasi", count: 6, minPrice: 1799 },
            { city: "Amritsar", count: 4, minPrice: 1899 },
            { city: "Hyderabad", count: 8, minPrice: 2299 },
            { city: "Kochi", count: 5, minPrice: 1999 },
          ]);
        }
      })
      .catch(() => {
        setDestinations([
          { city: "Mumbai", count: 12, minPrice: 1999 },
          { city: "Goa", count: 8, minPrice: 2499 },
          { city: "Jaipur", count: 6, minPrice: 1899 },
          { city: "Shimla", count: 5, minPrice: 2999 },
          { city: "Ooty", count: 4, minPrice: 1599 },
          { city: "New Delhi", count: 10, minPrice: 2299 },
          { city: "Udaipur", count: 5, minPrice: 2199 },
          { city: "Bangalore", count: 7, minPrice: 2399 },
          { city: "Varanasi", count: 6, minPrice: 1799 },
          { city: "Amritsar", count: 4, minPrice: 1899 },
          { city: "Hyderabad", count: 8, minPrice: 2299 },
          { city: "Kochi", count: 5, minPrice: 1999 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (dest) => {
    if (onCityClick) onCityClick(dest.city);
    else navigate("/hotels", { state: { presetCity: dest.city } });
  };

  if (loading && destinations.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Popular Hotel Destinations</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Find the best hotels at unbeatable prices across top destinations.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(destinations.length ? destinations : []).slice(0, 12).map((dest) => (
            <button
              key={dest.city}
              type="button"
              onClick={() => handleClick(dest)}
              className="group block relative rounded-2xl overflow-hidden aspect-[4/5] min-h-[180px] text-left"
            >
              <img
                src={getImage(dest.city)}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg font-bold">{dest.city}</h3>
                <p className="text-sm text-white/90">
                  From ₹{dest.minPrice?.toLocaleString() || "1,999"}{" "}
                  <span className="text-white/70 text-xs">/ night</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelPopularDestinations;
