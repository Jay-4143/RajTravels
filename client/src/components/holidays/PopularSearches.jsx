import React from 'react';

const POPULAR_SEARCHES = [
    { name: 'Dubai', code: 'ae' },
    { name: 'Maldives', code: 'mv' },
    { name: 'Gulmarg', code: 'in' },
    { name: 'Switzerland', code: 'ch' },
    { name: 'Agra', code: 'in' },
    { name: 'France', code: 'fr' },
    { name: 'Armenia', code: 'am' },
    { name: 'Vietnam', code: 'vn' },
    { name: 'Malaysia', code: 'my' },
    { name: 'Thailand', code: 'th' },
    { name: 'Bali', code: 'id' },
    { name: 'Saudi Arabia', code: 'sa' },
];

const PopularSearches = ({ onSearch }) => {
    return (
        <section className="mb-12 overflow-hidden relative">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-container {
                    display: flex;
                    width: max-content;
                    animation: marquee 35s linear infinite;
                }
                .marquee-container:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Searches</h2>
                <span className="text-gray-500 text-sm md:text-base hidden sm:inline-block">Recent Popular findings</span>
            </div>

            {/* Wrapper for the infinite scroll */}
            <div className="flex gap-3 marquee-container hide-scrollbar py-2">
                {[...POPULAR_SEARCHES, ...POPULAR_SEARCHES].map((item, index) => (
                    <button
                        key={`${item.name}-${index}`}
                        onClick={() => onSearch(item.name)}
                        className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                        <img
                            src={`https://flagcdn.com/w40/${item.code}.png`}
                            srcSet={`https://flagcdn.com/w80/${item.code}.png 2x`}
                            alt={item.name}
                            className="w-6 h-4 object-cover shadow-sm ring-1 ring-gray-100"
                        />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 whitespace-nowrap">{item.name}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default PopularSearches;
