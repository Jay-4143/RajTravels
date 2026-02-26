import { useState, useRef, useEffect } from "react";
import { FaShareAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const HotelModifySearchHeader = ({ searchParams, onModify, selectedHotels = [], onClearSelection }) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const shareRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setIsShareOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!searchParams) return null;

    const { city, checkIn, checkOut, roomsData } = searchParams;

    const formatDateShort = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        }) + " '" + date.getFullYear().toString().slice(-2);
    };

    const getDayNameShort = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });
    };

    const totalGuests = roomsData?.reduce((acc, r) => acc + r.adults + r.children, 0) || searchParams.guests || 2;
    const totalRooms = roomsData?.length || searchParams.rooms || 1;

    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

    const handleWhatsAppShare = () => {
        let message = '';
        if (selectedHotels.length > 0) {
            const hotelNames = selectedHotels.map(h => h.name).join(', ');
            message = `Check out these hotels I found on Travel Web: ${hotelNames}. City: ${city}, Dates: ${formatDateShort(checkIn)} to ${formatDateShort(checkOut)}`;
        } else {
            message = `Check out these hotels in ${city} from ${formatDateShort(checkIn)} to ${formatDateShort(checkOut)} on Travel Web! ${window.location.href}`;
        }
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleEmailShare = () => {
        let body = '';
        if (selectedHotels.length > 0) {
            const hotelNames = selectedHotels.map(h => h.name).join('\n- ');
            body = `Check out these hotels I found on Travel Web:%0D%0A%0D%0A- ${hotelNames}%0D%0A%0D%0ACity: ${city}%0D%0ADates: ${formatDateShort(checkIn)} to ${formatDateShort(checkOut)}`;
        } else {
            body = `Check out these hotels in ${city} from ${formatDateShort(checkIn)} to ${formatDateShort(checkOut)} on Travel Web!%0D%0A%0D%0A${window.location.href}`;
        }
        window.open(`mailto:?subject=Hotels in ${city}&body=${body}`, '_blank');
    };

    return (
        <div className="bg-[#f2f4f7] sticky top-16 z-[90] animate-in slide-in-from-top duration-300 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 md:gap-10 overflow-x-auto no-scrollbar py-1">
                        <div className="flex items-center gap-4 pr-6 border-r border-gray-100 shrink-0">
                            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-2xl">🏨</div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Destination</span>
                                <span className="text-base font-black text-slate-800 truncate max-w-[150px] md:max-w-none leading-none">{city}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-left shrink-0">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Check-In</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-slate-800 leading-none">{formatDateShort(checkIn)}</span>
                                    <span className="text-[11px] text-gray-400 font-bold hidden md:inline">{getDayNameShort(checkIn)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center px-4 border-l border-r border-gray-100 min-w-[80px]">
                                <span className="text-[12px] font-black text-slate-800 whitespace-nowrap leading-none">{nights} Night{nights > 1 ? 's' : ''}</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Check-Out</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-slate-800 leading-none">{formatDateShort(checkOut)}</span>
                                    <span className="text-[11px] text-gray-400 font-bold hidden md:inline">{getDayNameShort(checkOut)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pl-6 border-l border-gray-100 shrink-0">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Rooms & Guests</span>
                                <span className="text-sm font-black text-slate-800 leading-none">
                                    {totalRooms} Room{totalRooms > 1 ? 's' : ''} {totalGuests} Guest{totalGuests > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative" ref={shareRef}>
                            <button
                                onClick={() => setIsShareOpen(!isShareOpen)}
                                className={`w-10 h-10 border rounded flex items-center justify-center transition-all active:scale-95 ${isShareOpen || selectedHotels.length > 0 ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-slate-300 text-slate-600 hover:bg-gray-50'}`}
                            >
                                <FaShareAlt className="w-4 h-4" />
                                {selectedHotels.length > 0 && !isShareOpen && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
                                        {selectedHotels.length}
                                    </span>
                                )}
                            </button>

                            {isShareOpen && (
                                <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl w-64 p-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${selectedHotels.length > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {selectedHotels.length}
                                            </span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {selectedHotels.length} Item{selectedHotels.length !== 1 ? 's' : ''} Selected
                                            </span>
                                        </div>
                                        {selectedHotels.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    onClearSelection();
                                                    setIsShareOpen(false);
                                                }}
                                                className="text-[10px] uppercase font-bold text-red-500 hover:text-red-600 tracking-wider"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                handleWhatsAppShare();
                                                setIsShareOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-green-50 rounded-md transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FaWhatsapp className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">Share via WhatsApp</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleEmailShare();
                                                setIsShareOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-md transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FaEnvelope className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">Share via Email</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onModify}
                            className="h-10 px-6 bg-white border border-slate-800 text-slate-800 text-[12px] font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all active:scale-95 whitespace-nowrap rounded"
                        >
                            Modify Search
                        </button>
                    </div>
                </div>
            </div>
            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};

export default HotelModifySearchHeader;
