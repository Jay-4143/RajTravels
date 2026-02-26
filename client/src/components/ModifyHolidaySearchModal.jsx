import React, { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import SearchableDropdown from './SearchableDropdown';

const ModifyHolidaySearchModal = ({ isOpen, onClose, onSearch, currentDestination, availableCities = [] }) => {
    const [destination, setDestination] = useState(currentDestination || '');
    const [date, setDate] = useState('Anytime');

    // Dropdown states
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const monthDropdownRef = useRef(null);

    // Generate upcoming months
    const generateMonths = () => {
        const months = ['Anytime'];
        const d = new Date();
        for (let i = 0; i < 24; i++) {
            months.push(d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear());
            d.setMonth(d.getMonth() + 1);
        }
        return months;
    };
    const upcomingMonths = generateMonths();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
                setMonthDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Set fallback cities if the props don't pass any
    const fallbackCities = ['Dubai', 'Singapore', 'Bali', 'Maldives', 'Paris', 'Switzerland', 'London'];
    const citiesToUse = availableCities.length > 0 ? availableCities : fallbackCities;

    if (!isOpen) return null;

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ destination, date });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl md:rounded-3xl relative shadow-2xl animate-fade-in-up flex flex-col">

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                    ✕
                </button>

                {/* Scenic Background Banner */}
                <div className="relative h-64 md:h-80 lg:h-[400px] w-full bg-blue-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-inner">
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80"
                        alt="Scenic Landscape"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                </div>

                {/* The Floating Search Bar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 md:w-3/4 max-w-4xl z-50">
                    <form
                        onSubmit={handleSearch}
                        className="bg-white rounded-xl shadow-xl flex flex-col md:flex-row items-center p-2 gap-2"
                    >
                        {/* Destination Input using robust SearchableDropdown */}
                        <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200">
                            <SearchableDropdown
                                options={citiesToUse}
                                value={destination}
                                onChange={setDestination}
                                placeholder="Select City"
                                label=""
                                isOpen={cityDropdownOpen}
                                setIsOpen={setCityDropdownOpen}
                                iconColor="text-gray-400"
                            />
                        </div>

                        {/* Date Input */}
                        <div className="w-full md:w-56 relative" ref={monthDropdownRef}>
                            <div
                                className="w-full px-4 py-3 md:py-4 flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer group rounded-xl hover:bg-gray-50 bg-white min-h-[58px]"
                                onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                            >
                                <FaCalendarAlt className="text-blue-500 text-lg group-hover:text-blue-600 transition-colors" />
                                <span className="text-sm font-bold whitespace-nowrap select-none">{date}</span>
                            </div>

                            {/* Month Dropdown */}
                            {monthDropdownOpen && (
                                <div className="absolute z-[100] top-full left-0 mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden h-64 overflow-y-auto animate-fade-in-up">
                                    {upcomingMonths.map((m) => (
                                        <div
                                            key={m}
                                            className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors hover:bg-blue-50 hover:text-blue-600 ${date === m ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                            onClick={() => {
                                                setDate(m);
                                                setMonthDropdownOpen(false);
                                            }}
                                        >
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-auto mt-2 md:mt-0 px-2 md:px-0">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold text-base px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
                            >
                                <FaSearch size={14} /> Search
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ModifyHolidaySearchModal;
