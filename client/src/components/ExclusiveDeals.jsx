import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const DEAL_TABS = ["Hot Deals", "Flight", "Hotel", "Holidays", "Visa"];

const dealCards = [
  {
    title: "Fly Business Class for Less!",
    discount: "Get up to ₹10,000 OFF",
    code: "ATFLY",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600",
    cta: "Book Now!",
    link: "/flights",
    state: { from: "Mumbai", to: "London" },
    category: ["Hot Deals", "Flight"],
  },
  {
    title: "Weekend Getaways",
    discount: "Up to 25% OFF",
    code: "WEEKEND25",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    cta: "Book Now!",
    link: "/hotels",
    state: { presetCity: "Goa" },
    category: ["Hot Deals", "Hotel"],
  },
  {
    title: "International Flights",
    discount: "Save up to ₹15,000",
    code: "INTL20",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600",
    cta: "Book Now!",
    link: "/flights",
    state: { from: "Delhi", to: "Dubai" },
    category: ["Hot Deals", "Flight"],
  },
  {
    title: "Holiday Packages",
    discount: "Best Price Guarantee",
    code: "HOLIDAY",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    cta: "Book Now!",
    link: "/holidays",
    category: ["Hot Deals", "Holidays"],
  },
  {
    title: "Luxury Hotel Deals",
    discount: "Flat 30% OFF",
    code: "LUXURY30",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
    cta: "Book Now!",
    link: "/hotels",
    state: { presetCity: "Mumbai" },
    category: ["Hotel"],
  },
  {
    title: "Dubai Visa Express",
    discount: "From ₹3,999",
    code: "VISA50",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
    cta: "Apply Now!",
    link: "/visa",
    category: ["Hot Deals", "Visa"],
  },
  {
    title: "Thailand Holiday",
    discount: "Starting ₹24,999",
    code: "THAI25",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600",
    cta: "Book Now!",
    link: "/holidays",
    category: ["Holidays"],
  },
  {
    title: "Singapore Visa",
    discount: "Quick Processing",
    code: "SGVISA",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600",
    cta: "Apply Now!",
    link: "/visa",
    category: ["Visa"],
  },
];

const ExclusiveDeals = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Hot Deals");
  const [scrollPos, setScrollPos] = useState(0);

  const filteredCards = activeTab === "Hot Deals"
    ? dealCards.filter(c => c.category.includes("Hot Deals"))
    : dealCards.filter(c => c.category.includes(activeTab));

  const scroll = (dir) => {
    const container = document.getElementById("deals-slider");
    if (!container) return;
    const step = 320;
    const newPos = dir === "left" ? Math.max(0, scrollPos - step) : scrollPos + step;
    container.scrollTo({ left: newPos, behavior: "smooth" });
    setScrollPos(newPos);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Exclusive Deals</h2>
          <div className="flex items-center gap-1 overflow-x-auto">
            {DEAL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded transition-colors ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>

          <div
            id="deals-slider"
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-2"
            style={{ scrollBehavior: "smooth" }}
            onScroll={(e) => setScrollPos(e.target.scrollLeft)}
          >
            {filteredCards.map((card) => (
              <div
                key={card.title}
                className="flex-shrink-0 w-[280px] sm:w-[300px] rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow group"
              >
                <div
                  className="relative h-40 overflow-hidden cursor-pointer"
                  onClick={() => navigate(card.link, { state: card.state })}
                >
                  <img
                    src={card.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="text-lg font-bold text-red-400 mt-0.5">{card.discount}</p>
                    <div className="mt-2 inline-block px-2 py-1 bg-white/20 rounded text-xs font-medium">Use Code: {card.code}</div>
                  </div>
                </div>
                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => navigate(card.link, { state: card.state })}
                    className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center hover:bg-blue-700"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={() => navigate("/holidays")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveDeals;
