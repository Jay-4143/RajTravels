import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useState } from "react";

const hotelOffers = [
  { title: "Weekend Stay", discount: "25% OFF", code: "WEEKEND25", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", cta: "Book Now", city: "Goa" },
  { title: "Long Stay Deal", discount: "20% OFF (5+ nights)", code: "LONGSTAY", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600", cta: "Book Now", city: "Udaipur" },
  { title: "Budget Stays", discount: "From ₹999/night", code: "BUDGET", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600", cta: "Book Now", city: "Jaipur" },
  { title: "Luxury Escapes", discount: "15% OFF", code: "LUXURY15", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600", cta: "Book Now", city: "Mumbai" },
];

const HotelOffers = ({ onBookNow }) => {
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);

  const handleCTA = (card) => {
    if (onBookNow) {
      onBookNow(card.city);
    } else {
      navigate("/hotels", { state: { presetCity: card.city } });
    }
  };

  const scroll = (dir) => {
    const container = document.getElementById("hotel-offers-slider");
    if (!container) return;
    const step = 320;
    const newPos = dir === "left" ? Math.max(0, scrollPos - step) : scrollPos + step;
    container.scrollTo({ left: newPos, behavior: "smooth" });
    setScrollPos(newPos);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary uppercase tracking-tight">Hotel Offers & Deals</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-2xl bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all hover:scale-110"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>
          <div
            id="hotel-offers-slider"
            className="flex gap-6 overflow-x-auto scroll-smooth py-4 no-scrollbar"
            onScroll={(e) => setScrollPos(e.target.scrollLeft)}
          >
            {hotelOffers.map((card) => (
              <div
                key={card.title}
                className="flex-shrink-0 w-[320px] rounded-[32px] overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <p className="text-sm font-black uppercase tracking-widest text-blue-400 mb-1">{card.title}</p>
                    <p className="text-xl font-black italic tracking-tighter">{card.discount}</p>
                    <div className="mt-3 inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                      Use Code: {card.code}
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <button
                    type="button"
                    onClick={() => handleCTA(card)}
                    className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-blue-600 border-2 border-blue-50 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-2xl transition-all duration-300 shadow-sm"
                  >
                    {card.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-2xl bg-red-500 text-white shadow-xl shadow-red-200 flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default HotelOffers;
