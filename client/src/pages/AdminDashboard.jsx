import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    FaUsers, FaTicketAlt, FaRupeeSign, FaPlane, FaHotel, FaBus,
    FaShip, FaCar, FaUmbrellaBeach, FaSpinner, FaSignOutAlt,
    FaChartBar, FaUserShield, FaCalendarAlt, FaCheck, FaTimes, FaSeedling,
    FaCheckCircle,
    FaChartLine as FaLineChart
} from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const SIDEBAR_ITEMS = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'analytics', label: 'Analytics', icon: FaLineChart || FaChartBar },
    { id: 'bookings', label: 'Bookings', icon: FaTicketAlt },
    { id: 'inventory', label: 'Inventory', icon: FaCheckCircle },
    { id: 'users', label: 'Users', icon: FaUsers },
];

const TYPE_ICONS = {
    flight: FaPlane, hotel: FaHotel, bus: FaBus,
    cruise: FaShip, cab: FaCar, package: FaUmbrellaBeach,
};
const TYPE_COLORS = {
    flight: 'bg-blue-100 text-blue-700',
    hotel: 'bg-amber-100 text-amber-700',
    bus: 'bg-green-100 text-green-700',
    cruise: 'bg-cyan-100 text-cyan-700',
    cab: 'bg-yellow-100 text-yellow-700',
    package: 'bg-purple-100 text-purple-700',
};

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dashboard, setDashboard] = useState(null);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        if (user.role !== 'admin') { navigate('/'); return; }
        fetchDashboard();
    }, [user, navigate]);

    useEffect(() => {
        if (activeSection === 'users') fetchUsers();
        if (activeSection === 'bookings') fetchBookings();
    }, [activeSection]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/dashboard');
            if (res.data.success) setDashboard(res.data.dashboard);
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to load dashboard');
        } finally { setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            if (res.data.success) setUsers(res.data.users);
        } catch (e) { setError('Failed to load users'); }
        finally { setLoading(false); }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/bookings');
            if (res.data.success) setBookings(res.data.bookings);
        } catch (e) { setError('Failed to load bookings'); }
        finally { setLoading(false); }
    };

    const handleApprove = async (id) => {
        await api.put(`/admin/bookings/${id}/approve`);
        fetchBookings();
    };

    const handleReject = async (id) => {
        await api.put(`/admin/bookings/${id}/reject`, { reason: 'Admin rejected' });
        fetchBookings();
    };

    const formatPrice = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

    if (loading && !dashboard) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <FaSpinner className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
    );

    const d = dashboard || {};

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
                    <div>
                        <p className="text-xl font-brand font-black text-white leading-none">Raj Travel</p>
                        <p className="text-xs text-slate-400">Admin Panel</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <HiX className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSection === id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                            <Icon className="w-4 h-4" /> {label}
                        </button>
                    ))}
                </nav>

                <div className="px-4 py-4 border-t border-slate-700">
                    <div className="flex items-center gap-3 mb-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            <FaUserShield className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        <FaSignOutAlt className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-16 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                            <HiMenuAlt3 className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">
                            {activeSection === 'overview' ? 'Dashboard Overview' :
                                activeSection === 'bookings' ? 'Booking Management' : 'User Management'}
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        ← Back to Site
                    </button>
                </header>

                <div className="flex-1 p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
                    )}

                    {/* ── OVERVIEW ── */}
                    {activeSection === 'overview' && (
                        <div className="space-y-6">
                            {/* Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard icon={FaUsers} label="Total Users" value={d.totalUsers || 0} color="bg-blue-100 text-blue-600" />
                                <StatCard icon={FaTicketAlt} label="Total Bookings" value={d.totalBookings || 0} color="bg-green-100 text-green-600" />
                                <StatCard
                                    icon={FaRupeeSign}
                                    label="Total Revenue"
                                    value={formatPrice(d.totalRevenue)}
                                    color="bg-amber-100 text-amber-600"
                                    sub="Confirmed + Completed"
                                />
                                <StatCard icon={FaCalendarAlt} label="Inquiries" value={(d.inquiries?.packages || 0) + (d.inquiries?.visas || 0)} color="bg-purple-100 text-purple-600" sub="Packages + Visas" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Bookings by Type */}
                                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-base font-semibold text-gray-900 mb-4">Bookings by Module</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {d.byType && Object.entries(d.byType).map(([type, count]) => {
                                            const Icon = TYPE_ICONS[type] || FaTicketAlt;
                                            const color = TYPE_COLORS[type] || 'bg-gray-100 text-gray-600';
                                            return (
                                                <div key={type} className={`rounded-xl p-4 text-center ${color} transition-transform hover:scale-105 cursor-default`}>
                                                    <Icon className="w-6 h-6 mx-auto mb-2" />
                                                    <p className="text-2xl font-black">{count}</p>
                                                    <p className="text-xs uppercase font-black tracking-widest opacity-80">{type}s</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                    <div className="space-y-2">
                                        <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <FaSeedling className="text-green-500" /> Generate Weekly Report
                                        </button>
                                        <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <FaUsers className="text-blue-500" /> Bulk Verify Users
                                        </button>
                                        <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-3">
                                            <FaTicketAlt className="text-purple-500" /> Export All Bookings
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-base font-semibold text-gray-900">Recent Bookings</h2>
                                </div>
                                {d.recentBookings?.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Ref</th>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">User</th>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Type</th>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Amount</th>
                                                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {d.recentBookings.map(b => (
                                                    <tr key={b._id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-3 font-mono text-xs text-gray-500">{b.bookingReference || b._id?.slice(-8)}</td>
                                                        <td className="px-6 py-3">
                                                            <p className="font-medium text-gray-900">{b.user?.name || 'Guest'}</p>
                                                            <p className="text-xs text-gray-400">{b.user?.email}</p>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${TYPE_COLORS[b.bookingType] || 'bg-gray-100 text-gray-600'}`}>
                                                                {b.bookingType}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3 font-semibold text-gray-900">{formatPrice(b.totalAmount)}</td>
                                                        <td className="px-6 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-gray-400">
                                        <FaTicketAlt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>No bookings yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── ANALYTICS ── */}
                    {activeSection === 'analytics' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Booking Trends */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-base font-bold text-gray-900 mb-6">Booking Trends (7 Days)</h2>
                                    <div className="h-64 flex items-end gap-2 px-2">
                                        {[45, 62, 58, 75, 90, 82, 95].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div
                                                    className="w-full bg-indigo-500 rounded-t-lg transition-all group-hover:bg-indigo-600 relative"
                                                    style={{ height: `${h}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {h}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold">Day {i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Revenue Distribution */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h2 className="text-base font-bold text-gray-900 mb-6">Revenue Distribution</h2>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Flights', value: 45, color: 'bg-blue-500' },
                                            { label: 'Hotels', value: 30, color: 'bg-amber-500' },
                                            { label: 'Cabs', value: 15, color: 'bg-green-500' },
                                            { label: 'Others', value: 10, color: 'bg-slate-400' },
                                        ].map(item => (
                                            <div key={item.label} className="space-y-1">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-gray-600">{item.label}</span>
                                                    <span className="text-gray-900">{item.value}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── INVENTORY ── */}
                    {activeSection === 'inventory' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-gray-900">Resource Inventory</h2>
                                    <div className="flex gap-2">
                                        <button className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">+ Add Item</button>
                                        <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Filter</button>
                                    </div>
                                </div>
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaSeedling className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-700">Inventory Management</h3>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2">
                                        This section will allow you to manage Hotels, Flights, and Cabs inventory directly from the dashboard.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── BOOKINGS ── */}
                    {activeSection === 'bookings' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">All Bookings</h2>
                                <button onClick={fetchBookings} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">Refresh</button>
                            </div>
                            {loading ? (
                                <div className="py-16 flex justify-center"><FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" /></div>
                            ) : bookings.length === 0 ? (
                                <div className="py-16 text-center text-gray-400">
                                    <FaTicketAlt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p>No bookings found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Ref</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">User</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Type</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Amount</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Date</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {bookings.map(b => (
                                                <tr key={b._id} className="hover:bg-gray-50">
                                                    <td className="px-5 py-3 font-mono text-xs text-gray-500">{b.bookingReference || b._id?.slice(-8)}</td>
                                                    <td className="px-5 py-3">
                                                        <p className="font-medium text-gray-900">{b.user?.name || b.passengerName || 'Guest'}</p>
                                                        <p className="text-xs text-gray-400">{b.user?.email}</p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${TYPE_COLORS[b.bookingType] || 'bg-gray-100 text-gray-600'}`}>
                                                            {b.bookingType}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 font-semibold">{formatPrice(b.totalAmount)}</td>
                                                    <td className="px-5 py-3 text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {b.status === 'pending' && (
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleApprove(b._id)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200" title="Approve">
                                                                    <FaCheck className="w-3 h-3" />
                                                                </button>
                                                                <button onClick={() => handleReject(b._id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" title="Reject">
                                                                    <FaTimes className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── USERS ── */}
                    {activeSection === 'users' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-gray-900">All Users</h2>
                                <span className="text-sm text-gray-500">{users.length} registered</span>
                            </div>
                            {loading ? (
                                <div className="py-16 flex justify-center"><FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">User</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Email</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Role</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Joined</th>
                                                <th className="px-5 py-3 text-left font-medium text-gray-500 uppercase text-xs">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {users.map(u => (
                                                <tr key={u._id} className="hover:bg-gray-50">
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                                {u.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-gray-900">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {u.role || 'user'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {u.isVerified ? 'Verified' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
