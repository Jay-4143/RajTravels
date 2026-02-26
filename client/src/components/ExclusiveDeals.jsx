import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Fallback static data if backend doesn't provide enough items
const STATIC_DEALS_DATA = [
  {
    id: 's1',
    subtitle: 'European Marvels',
    title: 'BIG, BEAUTIFUL MEMORIES',
    offerIntro: 'packages at :',
    discount: '10% OFF!',
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 's2',
    subtitle: 'Glistening beaches.',
    title: 'CORE MEMORIES, AND YOU',
    offerIntro: 'enjoy Vietnam at :',
    discount: '10% OFF!',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 's3',
    subtitle: 'Savour Sticky Rice',
    title: 'THAI STYLE, FOR LESS',
    offerIntro: 'Thailand packages at :',
    discount: '10% OFF!',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 's4',
    subtitle: 'Dive into the',
    title: 'PEARL OF THE INDIAN OCEAN',
    offerIntro: 'Sri Lanka this season at :',
    discount: '10% OFF!',
    image: 'https://images.unsplash.com/photo-1539222626568-146618400030?auto=format&fit=crop&q=80&w=800',
  }
];

const TABS = [
  'HOT DEALS',
  'FIXED DEPARTURES',
  'DOMESTIC',
  'INTERNATIONAL',
  'COACH TOUR',
  'PROMOTIONS'
];

const ExclusiveDeals = ({
  hotDeals = [],
  featured = [],
  domestic = [],
  international = [],
  onViewAll,
  onDealClick
}) => {
  const [activeTab, setActiveTab] = useState('HOT DEALS');
  const scrollRef = useRef(null);

  // Map the active tab to the correct data array
  const getActiveData = () => {
    switch (activeTab) {
      case 'HOT DEALS': return hotDeals;
      case 'DOMESTIC': return domestic;
      case 'INTERNATIONAL': return international;
      case 'FIXED DEPARTURES': return featured;
      case 'COACH TOUR': return featured; // fallback
      case 'PROMOTIONS': return hotDeals; // fallback
      default: return [];
    }
  };

  const rawData = getActiveData();

  // Transform backend data into the UI format for the cards
  const displayData = rawData.length > 0 ? rawData.map(pkg => ({
    id: pkg._id,
    subtitle: `${pkg.duration?.days || 3} Days in ${pkg.destination || pkg.country || 'Paradise'}`,
    title: pkg.title,
    offerIntro: 'packages starting at:',
    discount: `₹${pkg.price?.toLocaleString('en-IN')}`,
    image: pkg.images?.[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800',
    originalPkg: pkg
  })) : STATIC_DEALS_DATA;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // approximate width of one card + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
            <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Exclusive Deals</h2>
            <div className="flex gap-6 text-sm font-semibold tracking-wide text-gray-500">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2 whitespace-nowrap transition-colors ${activeTab === tab
                      ? 'text-teal-600'
                      : 'hover:text-teal-600'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-teal-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3 self-end md:self-auto hidden md:flex">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
            <button
              onClick={() => onViewAll && onViewAll(activeTab)}
              className="text-teal-600 font-semibold text-sm uppercase tracking-wider ml-2 hover:underline"
            >
              VIEW ALL
            </button>
          </div>
        </div>

        {/* Cards Area - Horizontally Scrollable */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
        >
          {displayData.map((deal, idx) => (
            <div
              key={deal.id || idx}
              onClick={() => onDealClick && deal.originalPkg ? onDealClick(deal.originalPkg) : null}
              className="relative h-48 min-w-[280px] md:min-w-[300px] lg:min-w-[320px] max-w-[320px] rounded-2xl flex-shrink-0 snap-start overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Blueish gradient overlay for readability (simulating the design) */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/60 to-transparent mix-blend-multiply"></div>

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <div>
                  <p className="font-[cursive] text-yellow-400 text-lg mb-1" style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}>
                    {deal.subtitle}
                  </p>
                  <h3 className="text-white font-extrabold text-[15px] leading-tight w-4/5 uppercase drop-shadow-md">
                    {deal.title}
                  </h3>
                </div>
                <div>
                  <p className="text-white/90 text-[10px] uppercase tracking-wider mb-0.5">
                    {deal.offerIntro}
                  </p>
                  <p className="text-yellow-400 font-black text-3xl drop-shadow-md whitespace-nowrap">
                    {deal.discount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExclusiveDeals;
