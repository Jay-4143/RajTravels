import React from "react";
import { HiFilter } from "react-icons/hi";

const AMENITIES = [
    "WiFi",
    "Pool",
    "Spa",
    "Gym",
    "Parking",
    "Restaurant",
    "Bar",
    "AC",
];

const HotelFilters = ({ filterParams, onFilterChange, showFilters, setShowFilters }) => {
    return (
        <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <HiFilter className="w-5 h-5" /> Filters
                    </h3>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        {showFilters ? "Hide" : "Show"}
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (₹)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filterParams.minPrice ?? ""}
                                onChange={(e) =>
                                    onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={filterParams.maxPrice ?? ""}
                                onChange={(e) =>
                                    onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Star Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Star Category</label>
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <label key={star} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterParams.stars?.includes(star) || false}
                                        onChange={(e) => {
                                            const current = filterParams.stars || [];
                                            let next;
                                            if (e.target.checked) {
                                                next = [...current, star];
                                            } else {
                                                next = current.filter((s) => s !== star);
                                            }
                                            onFilterChange({ stars: next.length ? next : undefined });
                                        }}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                    <div className="flex text-yellow-400 text-sm">
                                        {Array.from({ length: star }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                        <div className="space-y-1">
                            {AMENITIES.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filterParams.amenities?.includes(amenity) || false}
                                        onChange={(e) => {
                                            const current = filterParams.amenities || [];
                                            let next;
                                            if (e.target.checked) {
                                                next = [...current, amenity];
                                            } else {
                                                next = current.filter((a) => a !== amenity);
                                            }
                                            onFilterChange({ amenities: next.length ? next : undefined });
                                        }}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default HotelFilters;
