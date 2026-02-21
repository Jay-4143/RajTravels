import React from 'react';
import { FaSuitcase, FaPlane, FaHotel, FaCar } from 'react-icons/fa';

const UpcomingTrips = () => {
    const trips = [
        {
            id: 'TRIP123',
            type: 'Flight',
            title: 'Mumbai to Delhi',
            date: '25 Feb 2026',
            status: 'Confirmed',
            icon: FaPlane,
            color: 'bg-blue-500'
        },
        {
            id: 'TRIP456',
            type: 'Hotel',
            title: 'The Taj Palace, Delhi',
            date: '25 Feb - 28 Feb 2026',
            status: 'Pending Payment',
            icon: FaHotel,
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <FaSuitcase className="text-orange-500" /> Upcoming Trips
                </h1>

                <div className="space-y-4">
                    {trips.map(trip => (
                        <div key={trip.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                            <div className={`w-16 h-16 ${trip.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                                <trip.icon />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trip.type} • {trip.id}</p>
                                <h3 className="text-lg font-black text-slate-800 mt-1">{trip.title}</h3>
                                <p className="text-slate-500 text-sm font-medium">{trip.date}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${trip.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {trip.status}
                                </span>
                                <button className="block mt-3 text-blue-600 font-bold text-xs hover:underline uppercase tracking-widest">
                                    Manage Booking
                                </button>
                            </div>
                        </div>
                    ))}

                    {trips.length === 0 && (
                        <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-200">
                            <FaSuitcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-400">No Upcoming Trips Found</h3>
                            <button className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                Book Your First Trip
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingTrips;
