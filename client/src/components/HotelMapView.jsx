import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

/* ── Auto-fit map bounds to markers ── */
const FitBounds = ({ hotels }) => {
    const map = useMap();
    const fitted = useRef(false);

    useEffect(() => {
        if (fitted.current) return;
        const valid = hotels.filter((h) => h.location?.lat && h.location?.lng);
        if (valid.length === 0) return;
        const bounds = L.latLngBounds(valid.map((h) => [h.location.lat, h.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        fitted.current = true;
    }, [hotels, map]);

    return null;
};

/**
 * HotelMapView
 * @param {Object} props
 * @param {Array}  props.hotels      – array of hotel objects (multi-hotel mode)
 * @param {Object} props.hotel       – single hotel object  (single-hotel mode)
 * @param {Function} props.onViewDetails – callback when clicking "View Details" in popup
 * @param {string} props.className   – optional CSS class
 */
const HotelMapView = ({ hotels = [], hotel = null, onViewDetails, className = "" }) => {
    const isSingle = !!hotel;
    const markers = isSingle
        ? hotel.location?.lat ? [hotel] : []
        : hotels.filter((h) => h.location?.lat && h.location?.lng);

    if (markers.length === 0) {
        return (
            <div className={`bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-sm ${className}`}
                style={{ minHeight: 250 }}
            >
                <div className="text-center">
                    <svg className="mx-auto mb-2 w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Map not available – location data missing
                </div>
            </div>
        );
    }

    const center = isSingle
        ? [hotel.location.lat, hotel.location.lng]
        : [markers[0].location.lat, markers[0].location.lng];

    return (
        <div className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm ${className}`}
            style={{ minHeight: isSingle ? 300 : 450 }}
        >
            <MapContainer center={center} zoom={isSingle ? 15 : 5} className="w-full h-full" style={{ minHeight: "inherit" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {!isSingle && <FitBounds hotels={markers} />}
                {markers.map((h) => (
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
                                {h.pricePerNight != null && (
                                    <p className="text-sm font-semibold text-gray-900">₹{h.pricePerNight?.toLocaleString()}/night</p>
                                )}
                                {!isSingle && onViewDetails && (
                                    <button
                                        type="button"
                                        onClick={() => onViewDetails(h)}
                                        className="mt-2 w-full text-center text-sm px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        View Details
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default HotelMapView;
