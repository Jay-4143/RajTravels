import { useState } from "react";
import { FaTimes, FaStar, FaMapMarkerAlt, FaCheckCircle, FaCoffee } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HotelMapView from "./HotelMapView";
import { useGlobal } from "../context/GlobalContext";

const HotelShortlistModal = ({ hotels = [], searchParams, onClose, onShortlistToggle }) => {
    const { formatPrice } = useGlobal();
    const navigate = useNavigate();
    const [compareIds, setCompareIds] = useState([]);
    const [showError, setShowError] = useState(false);
    const [viewMode, setViewMode] = useState("map"); // "map" | "compare"

    // Calculate nights for one representative stay logic
    const nights = (() => {
        if (!searchParams?.checkIn || !searchParams?.checkOut) return 1;
        const start = new Date(searchParams.checkIn);
        const end = new Date(searchParams.checkOut);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    })();

    const guestsCount = searchParams?.roomsData?.reduce((acc, r) => acc + r.adults + r.children, 0) || 2;
    const roomsCount = searchParams?.roomsData?.length || 1;

    const toggleCompare = (id) => {
        setCompareIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCompareClick = () => {
        if (compareIds.length < 2) {
            setShowError(true);
        } else {
            setViewMode("compare");
        }
    };

    const selectedHotels = hotels.filter(h => compareIds.includes(h._id));

    return (
        <div
            className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-7xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 relative"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Error Modal Overlay (Matching Screenshot) */}
                {showError && (
                    <div className="absolute inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
                            <div className="p-8 text-center border-b border-gray-100">
                                <p className="text-gray-700 font-bold text-base">Please select at least two hotels !</p>
                            </div>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full py-4 bg-[#ff4d42] hover:bg-[#e63e33] text-white font-black uppercase tracking-widest text-sm transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-7 pb-4 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Shortlisted Hotels</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Sub-header (Search Context) */}
                <div className="bg-gray-50 border-b border-gray-100 flex flex-wrap divide-x divide-gray-200">
                    <div className="px-6 py-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Check-In</p>
                        <p className="text-sm font-bold text-gray-900 leading-none">{searchParams?.checkIn || '25 Feb\'26 , Wednesday'}</p>
                    </div>
                    <div className="px-6 py-3 bg-white flex flex-col justify-center items-center">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">{nights} Night</p>
                    </div>
                    <div className="px-6 py-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Check-Out</p>
                        <p className="text-sm font-bold text-gray-900 leading-none">{searchParams?.checkOut || '26 Feb\'26 , Thursday'}</p>
                    </div>
                    <div className="px-6 py-3 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Rooms & Guests</p>
                        <p className="text-sm font-bold text-gray-900 leading-none">{roomsCount} Rooms {guestsCount} Guests</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">

                    {/* Left: Hotel List Sidebar */}
                    <div className="w-full md:w-[350px] p-4 overflow-y-auto bg-gray-50 border-r border-gray-200 flex flex-col">
                        {hotels.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FaMapMarkerAlt className="text-gray-300 text-2xl" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">No shortlisted hotels</h3>
                                <p className="text-sm text-gray-500">Go back to search and click the heart icon to save hotels for later.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 flex-1 custom-scrollbar overflow-y-auto pr-1">
                                    {hotels.map((hotel) => {
                                        const basePrice = hotel.pricePerNight || 0;
                                        const totalPrice = basePrice * roomsCount * nights;
                                        const originalPrice = Math.round(totalPrice * 1.25);
                                        const isSelected = compareIds.includes(hotel._id);

                                        return (
                                            <div
                                                key={hotel._id}
                                                className={`bg-white rounded-lg border p-3 shadow-sm transition-all group relative pr-8 
                                                    ${isSelected ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200'}
                                                `}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                                                        <img src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} alt={hotel.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight leading-tight">{hotel.name}</h4>
                                                        <div className="flex gap-0.5 mb-1">
                                                            {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                                                                <FaStar key={i} className="text-yellow-400 text-[8px]" />
                                                            ))}
                                                        </div>
                                                        <div className="flex items-start gap-1 text-gray-500 mb-2">
                                                            <FaMapMarkerAlt className="mt-0.5 text-[8px] flex-shrink-0" />
                                                            <p className="text-[8px] leading-tight line-clamp-1">{hotel.address || hotel.city}</p>
                                                        </div>
                                                        <div className="flex items-baseline justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] text-red-500 line-through font-medium leading-none mb-0.5">₹{originalPrice.toLocaleString()}</span>
                                                                <span className="text-sm font-black text-gray-900 leading-none">₹{totalPrice.toLocaleString()}</span>
                                                                <span className="text-[7px] text-[#108e33] font-bold flex items-center gap-0.5 mt-0.5 leading-none">
                                                                    You Saved ₹{(originalPrice - totalPrice).toLocaleString()} <FaCheckCircle className="text-[6px]" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center">
                                                    <label className="flex items-center gap-1.5 cursor-pointer group/check">
                                                        <div className={`w-3.5 h-3.5 rounded border transition-colors flex items-center justify-center
                                                            ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover/check:border-blue-400'}
                                                        `}>
                                                            {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={isSelected}
                                                            onChange={() => toggleCompare(hotel._id)}
                                                        />
                                                        <span className="text-[9px] font-bold text-gray-700 uppercase tracking-tight">Compare</span>
                                                    </label>
                                                </div>

                                                <button
                                                    onClick={() => onShortlistToggle(hotel)}
                                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    {viewMode === "compare" ? (
                                        <button
                                            onClick={() => setViewMode("map")}
                                            className="w-full py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-white transition-all text-[11px] uppercase tracking-widest shadow-sm bg-gray-50"
                                        >
                                            MAP VIEW
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCompareClick}
                                            className="w-full py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50 transition-all text-[11px] uppercase tracking-widest shadow-sm"
                                        >
                                            COMPARE
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Content: Map or Comparison View */}
                    <div className="flex-1 relative bg-white overflow-hidden">
                        {viewMode === "map" ? (
                            <HotelMapView
                                hotels={hotels}
                                className="w-full h-full rounded-none border-none shadow-none z-10"
                                onViewDetails={(h) => {
                                    window.open(`/hotels/${h._id}`, '_blank');
                                    // We keep the modal open now because user said they don't want to search again.
                                }}
                            />
                        ) : (
                            /* ── Comparison View (Matching Reference) ── */
                            <div className="w-full h-full p-6 overflow-x-auto overflow-y-auto bg-white custom-scrollbar">
                                <div className="flex gap-6 min-w-max">
                                    {selectedHotels.map((hotel) => {
                                        const basePrice = hotel.pricePerNight || 0;
                                        const totalPrice = basePrice * roomsCount * nights;
                                        return (
                                            <div key={hotel._id} className="w-[340px] border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col bg-white hover:shadow-md transition-shadow">
                                                <div className="p-5 bg-gray-50/50 border-b border-gray-50">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-base font-black text-gray-900 uppercase tracking-tight leading-tight">{hotel.name}</h4>
                                                    </div>
                                                    <div className="flex gap-0.5 mb-3">
                                                        {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                                                            <FaStar key={i} className="text-yellow-400 text-[10px]" />
                                                        ))}
                                                    </div>
                                                    <div className="flex items-start gap-1.5 text-blue-600 mb-4">
                                                        <FaMapMarkerAlt className="mt-0.5 text-xs flex-shrink-0" />
                                                        <p className="text-[10px] font-bold leading-relaxed line-clamp-2">
                                                            {hotel.address || hotel.city}
                                                            <span className="block text-gray-500 font-normal mt-0.5">3.88 km From (Centre)</span>
                                                        </p>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-black text-gray-900">₹{totalPrice.toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-500 mt-1 mb-2">+₹{(totalPrice * 0.12).toLocaleString()} Taxes</p>
                                                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 border border-blue-100 rounded text-blue-700">
                                                            <FaCoffee className="text-[10px]" />
                                                            <span className="text-[10px] font-black uppercase tracking-wider italic">Free breakfast</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => { window.open(`/hotels/${hotel._id}`, '_blank'); }}
                                                        className="w-2/5 py-2 bg-[#ff4d42] hover:bg-[#e63e33] text-white font-black rounded text-[11px] transition-all uppercase tracking-widest"
                                                    >
                                                        Select Room
                                                    </button>
                                                </div>

                                                <div className="p-5 flex-1">
                                                    <h5 className="text-[13px] font-black text-gray-900 uppercase tracking-widest mb-4">Amenities & Info</h5>
                                                    <div className="space-y-3">
                                                        {["Conveniences", "Internet", "Laundry Services", "Non Smoking", "Safe Deposit Box"].map((item, idx) => (
                                                            <div key={item} className="flex items-center gap-2 text-gray-700">
                                                                <svg className={`w-3.5 h-3.5 ${idx < 3 ? 'text-[#108e33]' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <span className={`text-xs ${idx < 3 ? 'font-bold' : 'font-medium'}`}>{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action (Optional) */}
                <div className="md:hidden p-4 bg-white border-t border-gray-100">
                    <button onClick={onClose} className="w-full py-2 bg-blue-600 text-white font-bold rounded">Back</button>
                </div>
            </div>
        </div>
    );
};

export default HotelShortlistModal;
