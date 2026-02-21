import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaStar, FaSearch, FaTimes } from "react-icons/fa";

// ─── Filter Data Constants ──────────────────────────────────────────────────

const POPULAR_FILTERS = [
    { label: "Top Rated Choice", key: "topRated" },
    { label: "Free Cancellation", key: "freeCancellation" },
    { label: "Breakfast Available", key: "breakfastIncluded" },
    { label: "Free WiFi", key: "freeWifi" },
    { label: "Couple Friendly", key: "coupleFriendly" },
    { label: "Pet Friendly", key: "petFriendly" },
];

const CUSTOMER_RATINGS = [
    { label: "Excellent", subLabel: "4.5 & Above", min: 4.5 },
    { label: "Very Good", subLabel: "4 & Above", min: 4 },
    { label: "Good", subLabel: "3.5 & Above", min: 3.5 },
    { label: "Satisfactory", subLabel: "3 & Above", min: 3 },
];

const PRICE_RANGES = [
    { label: "Upto ₹1,500", min: 0, max: 1500 },
    { label: "₹1,500 – ₹3,000", min: 1500, max: 3000 },
    { label: "₹3,000 – ₹6,000", min: 3000, max: 6000 },
    { label: "₹6,000 & Above", min: 6000, max: null },
];

const STAR_OPTIONS = [
    { stars: 5, count: null },
    { stars: 4, count: null },
    { stars: 3, count: null },
    { stars: 2, count: null },
    { stars: 1, count: null },
];

const AMENITIES = [
    "WiFi", "Pool", "Spa", "Gym", "Parking", "Restaurant", "Bar", "AC",
    "Airport Shuttle", "Room Service", "Laundry", "Pet Friendly",
    "Elevator", "Sauna", "Safe Deposit Box", "Lounge", "Kids Club", "EV Charging",
];

const CHAIN_PROPERTIES = [
    "Independent", "Oravel Travel (OYO)", "Ramee Guestline",
    "Ramee Hotels Group", "Hilton Worldwide", "Marriott International",
    "IHG Hotels", "Hyatt", "Taj Hotels", "Oberoi Group",
    "Accor Hotels", "Radisson Hotels",
];

const PROPERTY_TYPES = [
    "Hotel", "Aparthotel", "Apartment", "Resort",
    "Villa", "Hostel", "Guesthouse", "Boutique Hotel",
    "Heritage Hotel", "Service Apartment",
];

// ─── Reusable Components ────────────────────────────────────────────────────

const VIEW_LIMIT = 5;

/** A collapsible section with a bold header and chevron toggle */
const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                    {title}
                </span>
                {open
                    ? <FaChevronUp className="text-gray-400 text-xs group-hover:text-blue-500 transition-colors" />
                    : <FaChevronDown className="text-gray-400 text-xs group-hover:text-blue-500 transition-colors" />
                }
            </button>
            {open && children}
        </div>
    );
};

/** A standard checkbox row */
const CheckRow = ({ label, subLabel, checked, onChange, bold = false }) => (
    <label className="flex items-center gap-2.5 cursor-pointer py-0.5 group">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer shrink-0"
        />
        <span className={`text-sm group-hover:text-blue-600 transition-colors ${bold ? "font-semibold text-gray-800" : "text-gray-700"}`}>
            {label}
            {subLabel && (
                <span className="text-xs text-gray-400 font-normal block leading-tight">
                    {subLabel}
                </span>
            )}
        </span>
    </label>
);

/** List with "View all / View less" when items exceed VIEW_LIMIT */
const CollapsibleList = ({ items, renderItem }) => {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? items : items.slice(0, VIEW_LIMIT);
    return (
        <div className="space-y-1">
            {visible.map(renderItem)}
            {items.length > VIEW_LIMIT && (
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-semibold mt-1.5 flex items-center gap-1 transition-colors"
                >
                    {expanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                    {expanded ? "View less" : `View all (${items.length})`}
                </button>
            )}
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const HotelFilters = ({ filterParams, onFilterChange }) => {
    const [hotelNameInput, setHotelNameInput] = useState(filterParams.hotelName || "");

    // ── helpers ──
    const toggleArrayItem = (key, value) => {
        const current = filterParams[key] || [];
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onFilterChange({ [key]: next.length ? next : undefined });
    };

    const toggleBool = (key) => {
        onFilterChange({ [key]: filterParams[key] ? undefined : true });
    };

    const setMinRating = (min) => {
        onFilterChange({ minRating: filterParams.minRating === min ? undefined : min });
    };

    const setPriceRange = (range) => {
        const active =
            filterParams.minPrice === range.min && filterParams.maxPrice === range.max;
        if (active) {
            onFilterChange({ minPrice: undefined, maxPrice: undefined });
        } else {
            onFilterChange({ minPrice: range.min || undefined, maxPrice: range.max || undefined });
        }
    };

    const clearAll = () => {
        setHotelNameInput("");
        onFilterChange({
            hotelName: undefined, freeCancellation: undefined, breakfastIncluded: undefined,
            freeWifi: undefined, coupleFriendly: undefined, petFriendly: undefined,
            topRated: undefined, minRating: undefined, stars: undefined,
            minPrice: undefined, maxPrice: undefined, amenities: undefined,
            chainNames: undefined, propertyTypes: undefined, onlyAvailable: undefined,
        });
    };

    const hasAnyFilter = Object.values(filterParams).some((v) =>
        v !== undefined && v !== false && (Array.isArray(v) ? v.length > 0 : true)
    );

    // ── render ──
    return (
        <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
                    <h3 className="font-black text-gray-900 text-sm tracking-wide uppercase">Filters</h3>
                    {hasAnyFilter && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                        >
                            <FaTimes className="text-[10px]" /> Clear all
                        </button>
                    )}
                </div>

                <div className="px-4 py-4 space-y-5 max-h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar">

                    {/* 1. Hotel Name */}
                    <FilterSection title="Hotel Name">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Search by hotel name"
                                value={hotelNameInput}
                                onChange={(e) => {
                                    setHotelNameInput(e.target.value);
                                    onFilterChange({ hotelName: e.target.value || undefined });
                                }}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 focus:bg-white transition-all"
                            />
                            {hotelNameInput && (
                                <button
                                    type="button"
                                    onClick={() => { setHotelNameInput(""); onFilterChange({ hotelName: undefined }); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            )}
                        </div>
                    </FilterSection>

                    {/* 2. Popular Filters */}
                    <FilterSection title="Popular Filter">
                        <CollapsibleList
                            items={POPULAR_FILTERS}
                            renderItem={(f) => (
                                <CheckRow
                                    key={f.key}
                                    label={f.label}
                                    checked={!!filterParams[f.key]}
                                    onChange={() => toggleBool(f.key)}
                                />
                            )}
                        />
                    </FilterSection>

                    {/* 3. Customer Ratings */}
                    <FilterSection title="Customer Ratings">
                        <div className="space-y-1">
                            {CUSTOMER_RATINGS.map((r) => (
                                <CheckRow
                                    key={r.min}
                                    label={r.label}
                                    subLabel={r.subLabel}
                                    bold
                                    checked={filterParams.minRating === r.min}
                                    onChange={() => setMinRating(r.min)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* 4. Star Rating */}
                    <FilterSection title="Star Rating">
                        <div className="space-y-1">
                            {STAR_OPTIONS.map(({ stars }) => (
                                <label key={stars} className="flex items-center gap-2.5 cursor-pointer py-0.5 group">
                                    <input
                                        type="checkbox"
                                        checked={filterParams.stars?.includes(stars) || false}
                                        onChange={() => toggleArrayItem("stars", stars)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer shrink-0"
                                    />
                                    <span className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`text-xs ${i < stars ? "text-yellow-400" : "text-gray-200"}`}
                                            />
                                        ))}
                                    </span>
                                    <span className="text-xs text-gray-500">{stars} Star</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* 5. Price Range */}
                    <FilterSection title="Price Range">
                        <div className="space-y-1 mb-3">
                            {PRICE_RANGES.map((range) => {
                                const active =
                                    filterParams.minPrice === range.min &&
                                    filterParams.maxPrice === range.max;
                                return (
                                    <CheckRow
                                        key={range.label}
                                        label={range.label}
                                        checked={active}
                                        onChange={() => setPriceRange(range)}
                                    />
                                );
                            })}
                        </div>
                        {/* Custom range */}
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Custom Range (₹)</p>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filterParams.minPrice ?? ""}
                                onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            <span className="text-gray-400 text-xs font-bold shrink-0">—</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filterParams.maxPrice ?? ""}
                                onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    </FilterSection>

                    {/* 6. Amenities */}
                    <FilterSection title="Amenities">
                        <CollapsibleList
                            items={AMENITIES}
                            renderItem={(amenity) => (
                                <CheckRow
                                    key={amenity}
                                    label={amenity}
                                    checked={filterParams.amenities?.includes(amenity) || false}
                                    onChange={() => toggleArrayItem("amenities", amenity)}
                                />
                            )}
                        />
                    </FilterSection>

                    {/* 7. Chain Properties */}
                    <FilterSection title="Chain Properties">
                        <CollapsibleList
                            items={CHAIN_PROPERTIES}
                            renderItem={(chain) => (
                                <CheckRow
                                    key={chain}
                                    label={chain}
                                    checked={filterParams.chainNames?.includes(chain) || false}
                                    onChange={() => toggleArrayItem("chainNames", chain)}
                                />
                            )}
                        />
                    </FilterSection>

                    {/* 8. Property Type */}
                    <FilterSection title="Property Type">
                        <CollapsibleList
                            items={PROPERTY_TYPES}
                            renderItem={(type) => (
                                <CheckRow
                                    key={type}
                                    label={type}
                                    checked={filterParams.propertyTypes?.includes(type) || false}
                                    onChange={() => toggleArrayItem("propertyTypes", type)}
                                />
                            )}
                        />
                    </FilterSection>

                    {/* 9. Show Only Available */}
                    <div className="pt-1">
                        <CheckRow
                            label="Show only available hotels"
                            checked={!!filterParams.onlyAvailable}
                            onChange={() => toggleBool("onlyAvailable")}
                        />
                    </div>

                </div>
            </div>
        </aside>
    );
};

export default HotelFilters;
