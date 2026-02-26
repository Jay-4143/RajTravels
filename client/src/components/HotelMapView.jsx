import { useEffect, useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    FaPlane, FaGlassMartiniAlt, FaCoffee, FaMoon,
    FaUtensils, FaShoppingBag, FaTrain, FaMapMarkerAlt
} from "react-icons/fa";

/* ── Fix default marker icons (Leaflet + bundlers issue) ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Highlighted marker for current hotel */
const activeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const poiIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [1, -26],
    shadowSize: [32, 32],
});

const CATEGORIES = [
    { id: "airport", label: "Airport", icon: FaPlane },
    { id: "bar", label: "Bar", icon: FaGlassMartiniAlt },
    { id: "cafe", label: "Cafe", icon: FaCoffee },
    { id: "nightlife", label: "Night Life", icon: FaMoon },
    { id: "restaurant", label: "Restaurant", icon: FaUtensils },
    { id: "shopping", label: "Shopping", icon: FaShoppingBag },
    { id: "train", label: "Train", icon: FaTrain },
];

/* ── Auto-fit map bounds to markers ── */
const FitBounds = ({ hotels, pois, activeCategory }) => {
    const map = useMap();
    const fitted = useRef(false);

    useEffect(() => {
        // Fix for Leaflet tiles not filling container correctly on initial render
        setTimeout(() => {
            map.invalidateSize();
        }, 300);

        if (fitted.current && !activeCategory) return;

        const validHotels = hotels.filter((h) => h.location?.lat && h.location?.lng);
        const validPois = pois.filter((p) => p.lat && p.lng);
        const allMarkers = [
            ...validHotels.map(h => [h.location.lat, h.location.lng]),
            ...validPois.map(p => [p.lat, p.lng])
        ];

        if (allMarkers.length === 0) return;

        const bounds = L.latLngBounds(allMarkers);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });

        if (!activeCategory) fitted.current = true;
    }, [hotels, pois, activeCategory, map]);

    return null;
};

/**
 * HotelMapView
 */
const HotelMapView = ({ hotels = [], hotel = null, onViewDetails, className = "" }) => {
    const [activeCategory, setActiveCategory] = useState(null);
    const isSingle = !!hotel;

    const hotelMarkers = useMemo(() => {
        return isSingle
            ? hotel.location?.lat ? [hotel] : []
            : hotels.filter((h) => h.location?.lat && h.location?.lng);
    }, [isSingle, hotel, hotels]);

    // Generate mock POIs near the hotel
    const poiMarkers = useMemo(() => {
        if (!activeCategory || !hotelMarkers.length) return [];
        const base = hotelMarkers[0].location;
        const count = 5 + Math.floor(Math.random() * 5);
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push({
                id: `${activeCategory}-${i}`,
                name: `${CATEGORIES.find(c => c.id === activeCategory).label} ${i + 1}`,
                lat: base.lat + (Math.random() - 0.5) * 0.02,
                lng: base.lng + (Math.random() - 0.5) * 0.02,
                type: activeCategory
            });
        }
        return result;
    }, [activeCategory, hotelMarkers]);

    if (hotelMarkers.length === 0) {
        return (
            <div className={`bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm ${className}`}
                style={{ minHeight: 250 }}
            >
                <div className="text-center">
                    <FaMapMarkerAlt className="mx-auto mb-2 w-8 h-8 text-gray-400" />
                    Map not available – location data missing
                </div>
            </div>
        );
    }

    const center = isSingle
        ? [hotel.location.lat, hotel.location.lng]
        : [hotelMarkers[0].location.lat, hotelMarkers[0].location.lng];

    return (
        <div className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm relative flex bg-white ${className}`}
            style={{ minHeight: isSingle ? 400 : 450 }}
        >
            {/* Sidebar (Only in Single Hotel Mode) */}
            {isSingle && (
                <div className="w-20 md:w-32 bg-[#4a1a1a] flex flex-col shrink-0 z-[1000] border-r border-black/10">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(isActive ? null : cat.id)}
                                className={`flex flex-col items-center justify-center py-4 border-b border-white/5 transition-all hover:bg-black/20
                                    ${isActive ? "bg-black/40 text-white" : "text-white/60 hover:text-white"}`}
                            >
                                <Icon className={`w-5 h-5 mb-1.5 transition-transform ${isActive ? "scale-110" : "scale-100"}`} />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight text-center px-1">
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer
                    center={center}
                    zoom={isSingle ? 15 : 5}
                    className="w-full h-full"
                    style={{ minHeight: "inherit" }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBounds hotels={hotelMarkers} pois={poiMarkers} activeCategory={activeCategory} />

                    {/* Hotel Markers */}
                    {hotelMarkers.map((h) => (
                        <Marker
                            key={h._id || h.name}
                            position={[h.location.lat, h.location.lng]}
                            icon={isSingle ? activeIcon : defaultIcon}
                        >
                            <Popup minWidth={220} maxWidth={280}>
                                <div className="p-1">
                                    <h3 className="font-bold text-gray-900 text-base mb-1">{h.name}</h3>
                                    <p className="text-xs text-gray-500 mb-1">{h.address || h.city}</p>
                                    <div className="flex items-center gap-1 mb-1">
                                        {Array.from({ length: h.starCategory || 3 }).map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-xs">★</span>
                                        ))}
                                        <span className="text-xs text-gray-600 ml-1">{h.rating?.toFixed(1)}</span>
                                    </div>
                                    {!isSingle && onViewDetails && (
                                        <button
                                            type="button"
                                            onClick={() => onViewDetails(h)}
                                            className="mt-2 w-full text-center text-[11px] px-3 py-2 bg-[#ff4d42] hover:bg-[#e63e33] text-white rounded font-black transition-colors uppercase tracking-wider shadow-sm"
                                        >
                                            Select Room
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* POI Markers */}
                    {poiMarkers.map((poi) => (
                        <Marker
                            key={poi.id}
                            position={[poi.lat, poi.lng]}
                            icon={poiIcon}
                        >
                            <Popup>
                                <div className="text-center">
                                    <p className="font-black text-[10px] uppercase tracking-widest text-[#4a1a1a] mb-1">
                                        {activeCategory}
                                    </p>
                                    <h4 className="font-bold text-sm text-gray-900">{poi.name}</h4>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Single Hotel Info Card (Reference Match) */}
                {isSingle && !activeCategory && (
                    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-2xl p-5 border border-gray-100 max-w-[280px] hidden md:block animate-in slide-in-from-right-4 duration-500">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                                <h4 className="text-sm font-black text-slate-800 leading-tight uppercase tracking-tight">{hotel.name}</h4>
                                <p className="text-[11px] font-bold text-slate-500 mt-2 leading-relaxed">
                                    {hotel.address || "Location detail not available"}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Rating</span>
                                    <span className="text-xs font-black text-green-600">{hotel.rating?.toFixed(1)} Excellent</span>
                                </div>
                                <div className="w-px h-6 bg-gray-100" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Status</span>
                                    <span className="text-xs font-black text-blue-600 uppercase">Open</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelMapView;
