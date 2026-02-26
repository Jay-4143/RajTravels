import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const QUICK_FILTERS_DATA = [
    { id: 'City Breaks', label: 'City Breaks', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400' },
    { id: 'Family with Kids', label: 'Family with Kids', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400' },
    { id: 'Honeymoon', label: 'Honeymoon', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400' },
    { id: 'Visa Free', label: 'Visa Free', image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=400' },
    { id: 'Wellness and Spa', label: 'Wellness and Spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400' },
    { id: 'Visa on Arrival', label: 'Visa on Arrival', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400' },
];

const QuickFiltersCarousel = ({ activeFilters = [], onToggleFilter, onClearAll }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
        }
    };

    // The design shows all items in a single row
    // We iterate over the original data and style the active ones
    const displayFilters = QUICK_FILTERS_DATA;

    return (
        <div className="relative flex items-center mb-6 px-1 max-w-7xl mx-auto">
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 z-10 bg-white border border-gray-200 hover:border-blue-400 rounded-md p-2 shadow-sm hover:shadow-md text-gray-500 transition-all ml-1"
                title="Scroll Left"
            >
                <FaChevronLeft size={14} />
            </button>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 mx-10 py-2 w-full snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                <button
                    onClick={onClearAll}
                    className="relative flex-shrink-0 w-48 h-12 rounded-full overflow-hidden group snap-start border border-gray-200 shadow-sm"
                >
                    <img
                        src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400"
                        alt="All Packages"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm tracking-wide">
                        All Packages
                    </span>
                </button>

                {displayFilters.map((filter) => {
                    const isActive = activeFilters.includes(filter.id);

                    return (
                        <button
                            key={filter.id}
                            onClick={() => onToggleFilter(filter.id)}
                            className={`relative flex-shrink-0 w-48 h-12 rounded-full overflow-hidden group snap-start shadow-sm transition-all duration-300 ${isActive ? 'ring-2 ring-[#FFB703] ring-offset-2' : ''}`}
                        >
                            <img
                                src={filter.image}
                                alt={filter.label}
                                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                            />
                            <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-black/40' : 'bg-black/60 group-hover:bg-black/40'}`}></div>
                            <span className={`absolute inset-0 flex items-center justify-center font-bold text-sm tracking-wide drop-shadow-md z-10 ${isActive ? 'text-[#FFB703]' : 'text-white group-hover:text-[#FFB703] transition-colors duration-300'}`}>
                                {filter.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => scroll('right')}
                className="absolute right-0 z-10 bg-white border border-gray-200 hover:border-blue-400 rounded-md p-2 shadow-sm hover:shadow-md text-gray-500 transition-all mr-1"
                title="Scroll Right"
            >
                <FaChevronRight size={14} />
            </button>
        </div>
    );
};

export default QuickFiltersCarousel;
