import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { FaPlane, FaHotel, FaBus, FaUmbrellaBeach, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaSpinner, FaShip, FaCar, FaDownload } from "react-icons/fa";
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const TABS = [
    { id: "all", label: "All Bookings", icon: FaTicketAlt },
    { id: "flight", label: "Flights", icon: FaPlane },
    { id: "hotel", label: "Hotels", icon: FaHotel },
    { id: "bus", label: "Buses", icon: FaBus },
    { id: "cruise", label: "Cruises", icon: FaShip },
    { id: "cab", label: "Cabs", icon: FaCar },
    { id: "package", label: "Holidays", icon: FaUmbrellaBeach },
];

const statusColors = {
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-purple-100 text-purple-700",
};

const typeIcons = {
    flight: FaPlane,
    hotel: FaHotel,
    bus: FaBus,
    package: FaUmbrellaBeach,
    cruise: FaShip,
    cab: FaCar
};

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { formatPrice } = useGlobal();
    const [activeTab, setActiveTab] = useState("all");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchBookings();
    }, [user, activeTab, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const url = activeTab === "all" ? "/bookings" : `/bookings?type=${activeTab}`;
            const res = await api.get(url);
            if (res.data.success) {
                setBookings(res.data.bookings);
            } else {
                setError("Failed to fetch bookings");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while fetching bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId, type) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            const url = type === 'bus' ? `/buses/bookings/${bookingId}/cancel` : `/bookings/${bookingId}/cancel`;
            const res = await api.post(url, { reason: 'User cancelled' });
            if (res.data.success) {
                toast.success('Booking cancelled successfully');
                fetchBookings();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    return (
        <>
            <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                    <p className="text-gray-300">Track and manage all your travel bookings in one place.</p>
                </div>
            </section>

            <section className="bg-white border-b sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === id ? "text-blue-600 border-blue-600" : "text-gray-600 border-transparent hover:text-blue-600"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[400px]">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <FaSpinner className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-500">Loading your bookings...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-red-100 p-8 max-w-md mx-auto">
                            <h3 className="text-xl font-bold text-red-600 mb-2">Error!</h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button onClick={fetchBookings} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20">
                            <FaTicketAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-600 mb-6">You haven't made any {activeTab !== "all" ? activeTab : ""} bookings yet.</p>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Start Exploring
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => {
                                const bType = booking.bookingType;
                                const TypeIcon = typeIcons[bType] || FaTicketAlt;
                                return (
                                    <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <TypeIcon className="w-6 h-6 text-blue-600" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-gray-900">{booking.title}</h3>
                                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${statusColors[booking.status]}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">{booking.subtitle}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt className="w-3 h-3" />
                                                        {new Date(booking.date || booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                    </span>
                                                    {bType === 'bus' ? (
                                                        <span className="text-gray-400">PNR: {booking.pnr}</span>
                                                    ) : (
                                                        <span className="text-gray-400">Ref: {booking.bookingReference}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                                                <p className="text-lg font-bold text-gray-900">{formatPrice(booking.totalAmount || booking.totalFare || 0)}</p>
                                                <div className="flex gap-2">
                                                    {(booking.status === "confirmed" || booking.status === "pending" || booking.status === "paid") && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCancel(booking.id, bType)}
                                                            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                    {(booking.status === "confirmed" || booking.status === "paid") && (
                                                        <button
                                                            type="button"
                                                            onClick={() => generateTicket(booking, bType)}
                                                            className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                                                        >
                                                            <FaDownload className="w-3 h-3" /> Download
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (bType === 'bus') navigate(`/buses/${booking.bus?._id || booking.id}`);
                                                            else if (bType === 'cruise') navigate(`/cruise/${booking.cruise?._id || booking.id}`);
                                                            else if (bType === 'cab') navigate(`/cabs`);
                                                            else navigate(`/${bType}s/${booking.id}`);
                                                        }}
                                                        className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default MyBookings;
