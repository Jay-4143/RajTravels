import React from 'react';
import { FaCompass, FaUmbrellaBeach, FaPaw, FaGem, FaShoppingBag, FaHeart, FaPlane, FaUtensils, FaChild } from 'react-icons/fa';

const THEMES = [
    { name: 'Adventure', icon: <FaCompass className="text-2xl text-orange-500" /> },
    { name: 'All Inclusive', icon: <FaPlane className="text-2xl text-blue-500" /> },
    { name: 'Beach', icon: <FaUmbrellaBeach className="text-2xl text-yellow-500" /> },
    { name: 'Family', icon: <FaChild className="text-2xl text-purple-500" /> },
    { name: 'Food', icon: <FaUtensils className="text-2xl text-red-500" /> },
    { name: 'Honeymoon', icon: <FaHeart className="text-2xl text-pink-500" /> },
    { name: 'Luxury', icon: <FaGem className="text-2xl text-teal-500" /> },
    { name: 'Wildlife', icon: <FaPaw className="text-2xl text-green-500" /> },
    { name: 'Shopping', icon: <FaShoppingBag className="text-2xl text-indigo-500" /> },
];

const PickYourTheme = ({ onThemeSelect }) => {
    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Pick Your Theme</h2>

            <div className="flex overflow-x-auto pb-6 gap-6 md:gap-12 justify-start md:justify-center hide-scrollbar">
                {THEMES.map((theme) => (
                    <button
                        key={theme.name}
                        onClick={() => onThemeSelect(theme.name)}
                        className="flex flex-col items-center gap-3 flex-shrink-0 group w-24"
                    >
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-blue-200 group-hover:-translate-y-1 transition-all">
                            {theme.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">{theme.name}</span>
                    </button>
                ))}
            </div>
            {/* World map background graphic overlay could optionally go here in CSS via parent element */}
        </section>
    );
};

export default PickYourTheme;
