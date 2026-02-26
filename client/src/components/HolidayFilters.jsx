import React from 'react';

const HolidayFilters = ({ filters, setFilters, availableCountries, availableCities, filteredCount }) => {

    const handleFlightToggle = (type) => {
        setFilters(prev => ({ ...prev, flightPref: prev.flightPref === type ? null : type }));
    };

    const handleCheckboxChange = (filterCategory, value) => {
        setFilters(prev => {
            const currentObj = prev[filterCategory] || {};
            return {
                ...prev,
                [filterCategory]: {
                    ...currentObj,
                    [value]: !currentObj[value]
                }
            };
        });
    };

    const clearFilters = () => {
        setFilters({
            flightPref: null,
            holidayType: {},
            budget: 575000,
            duration: 10,
            country: {},
            city: {},
            quickFilters: []
        });
    };

    const resetFilterSection = (section) => {
        if (section === 'flights') setFilters(prev => ({ ...prev, flightPref: null }));
        else if (section === 'budget') setFilters(prev => ({ ...prev, budget: 575000 }));
        else if (section === 'duration') setFilters(prev => ({ ...prev, duration: 10 }));
        else setFilters(prev => ({ ...prev, [section]: {} }));
    };

    return (
        <div className="bg-white sticky top-20 rounded-xl overflow-y-auto max-h-[calc(100vh-100px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Filter</h2>
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">Clear</button>
            </div>

            <div className="p-4 border-b border-gray-100 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></svg>
                    Applied filters
                </div>
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">Clear</button>
            </div>

            {filters.quickFilters && filters.quickFilters.length > 0 && (
                <div className="px-4 pb-4 pt-2 border-b border-gray-100 flex flex-col gap-2">
                    {filters.quickFilters.map(qf => (
                        <div key={qf} className="flex justify-between items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                            <span>{qf}</span>
                            <button
                                onClick={() => {
                                    setFilters(prev => ({
                                        ...prev,
                                        quickFilters: prev.quickFilters.filter(id => id !== qf)
                                    }));
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Flights */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">Flights</h3>
                    <button onClick={() => resetFilterSection('flights')} className="text-blue-600 text-xs hover:underline">Reset</button>
                </div>
                <div className="flex rounded-md overflow-hidden border border-blue-600">
                    <button
                        onClick={() => handleFlightToggle('with')}
                        className={`flex-1 py-1.5 text-xs font-semibold ${filters.flightPref === 'with' ? 'bg-teal-50 text-teal-700 border-2 border-teal-600' : 'bg-white text-gray-600 border border-gray-200'} transition-colors`}
                    >
                        With Flight
                    </button>
                    <button
                        onClick={() => handleFlightToggle('without')}
                        className={`flex-1 py-1.5 text-xs font-semibold ${filters.flightPref === 'without' ? 'bg-teal-50 text-teal-700 border-2 border-teal-600' : 'bg-white text-gray-600 border border-gray-200'} transition-colors`}
                    >
                        Without Flight
                    </button>
                </div>
            </div>

            {/* Holiday Type */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">Holiday Type</h3>
                    <button onClick={() => resetFilterSection('holidayType')} className="text-blue-600 text-xs hover:underline">Reset</button>
                </div>
                <div className="space-y-2">
                    {['Customized Holidays', 'Fixed Departures'].map(type => (
                        <label key={type} className="flex flex-row items-center justify-between cursor-pointer group">
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={!!filters.holidayType?.[type]}
                                    onChange={() => handleCheckboxChange('holidayType', type)}
                                />
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Budget */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">Budget</h3>
                    <button onClick={() => resetFilterSection('budget')} className="text-blue-600 text-xs hover:underline">Reset</button>
                </div>
                <div className="mt-4 px-1">
                    <input
                        type="range"
                        min="5000"
                        max="1000000"
                        step="5000"
                        value={filters.budget}
                        onChange={(e) => setFilters(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600 font-medium">₹5,000</span>
                        <span className="text-xs text-gray-800 font-bold">₹{filters.budget.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Duration */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 text-sm">Duration</h3>
                    <button onClick={() => resetFilterSection('duration')} className="text-blue-600 text-xs hover:underline">Reset</button>
                </div>
                <div className="mt-4 px-1">
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={filters.duration}
                        onChange={(e) => setFilters(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600 font-medium">1N</span>
                        <span className="text-xs text-gray-800 font-bold">{filters.duration}N</span>
                    </div>
                </div>
            </div>

            {/* Country */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></svg>
                        <h3 className="font-bold text-gray-800 text-sm">Country</h3>
                    </div>
                    <button onClick={() => resetFilterSection('country')} className="text-blue-600 text-xs hover:underline">Reset</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {availableCountries.map(country => (
                        <label key={country} className="flex flex-row items-center justify-between cursor-pointer group">
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{country}</span>
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                checked={!!filters.country?.[country]}
                                onChange={() => handleCheckboxChange('country', country)}
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* City */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"></path></svg>
                        <h3 className="font-bold text-gray-800 text-sm">City</h3>
                    </div>
                    <button onClick={() => resetFilterSection('city')} className="text-blue-600 text-xs hover:underline">Reset</button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {availableCities.map(city => (
                        <label key={city} className="flex flex-row items-center justify-between cursor-pointer group">
                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{city}</span>
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                checked={!!filters.city?.[city]}
                                onChange={() => handleCheckboxChange('city', city)}
                            />
                        </label>
                    ))}
                </div>
                <button className="text-blue-600 text-xs mt-3 flex items-center hover:underline">View All</button>
            </div>
        </div>
    );
};

export default HolidayFilters;
