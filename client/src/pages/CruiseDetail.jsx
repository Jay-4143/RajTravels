import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaShip, FaMapMarkerAlt, FaClock, FaAnchor, FaCheckCircle,
    FaStar, FaArrowRight, FaCalendarAlt, FaChevronLeft,
    FaSwimmingPool, FaCocktail, FaUtensils, FaDumbbell, FaSpa
} from 'react-icons/fa';
import { getCruiseDetails } from '../api/cruises';
import { useGlobal } from '../context/GlobalContext';

const CruiseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = useGlobal();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('itinerary');

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await getCruiseDetails(id);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!data) return <div className="text-center py-20 px-4">Cruise details not found.</div>;

    const { cruise, cabins } = data;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Bar / Navigation */}
            <div className="bg-white border-b sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/cruise')}
                        className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <FaChevronLeft /> Back to Results
                    </button>
                </div>
            </div>

            {/* Hero Image & Basic Info */}
            <div className="relative h-[450px] overflow-hidden">
                <img
                    src={cruise.images?.[0] || FALLBACK_IMG}
                    alt={cruise.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1600'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-12 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="bg-blue-600 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest">
                                {cruise.operator}
                            </span>
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                <FaStar className="text-yellow-400 text-xs" />
                                <span className="text-xs font-bold text-white">{cruise.rating}</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">
                            {cruise.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-blue-400" />
                                <span className="text-lg font-bold">{cruise.departurePort}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-blue-400" />
                                <span className="text-lg font-bold">{cruise.duration} Nights / {cruise.duration + 1} Days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-blue-400" />
                                <span className="text-lg font-bold">{new Date(cruise.departureDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Details & Tabs */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Description */}
                        <section className="bg-white rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{cruise.description}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <FaSwimmingPool className="text-xl text-blue-600" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-700 uppercase">Pools</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <FaUtensils className="text-xl text-blue-600" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-700 uppercase">Dining</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <FaCocktail className="text-xl text-blue-600" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-700 uppercase">Bars</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <FaSpa className="text-xl text-blue-600" />
                                    </div>
                                    <p className="text-xs font-bold text-gray-700 uppercase">Spa</p>
                                </div>
                            </div>
                        </section>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-200">
                            {['itinerary', 'amenities'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            {activeTab === 'itinerary' && (
                                <div className="space-y-8">
                                    {cruise.itinerary.map((item, i) => (
                                        <div key={i} className="flex gap-6 relative">
                                            {i !== cruise.itinerary.length - 1 && (
                                                <div className="absolute left-[31px] top-10 bottom-[-32px] w-0.5 bg-gray-100"></div>
                                            )}
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center border border-blue-100 z-10 shadow-sm shadow-blue-50">
                                                <span className="text-[10px] font-black text-blue-400 uppercase leading-none">Day</span>
                                                <span className="text-2xl font-black text-blue-600 leading-none mt-1">{item.day}</span>
                                            </div>
                                            <div className="flex-1 pb-2">
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                                    <FaAnchor className="text-blue-500 text-sm" /> {item.port}
                                                </h3>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                                                    {item.arrival !== '—' && <span>Arr: {item.arrival}</span>}
                                                    {item.departure !== '—' && <span>Dep: {item.departure}</span>}
                                                </div>
                                                <p className="mt-4 text-gray-600 leading-relaxed">{item.activity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'amenities' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {cruise.amenities.map(a => (
                                        <div key={a} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                            <span className="text-sm font-bold text-gray-700">{a}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Cabin Selection */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Select Cabin</h2>
                            {cabins.map((cabin) => (
                                <div
                                    key={cabin._id}
                                    className="bg-white border-2 border-transparent hover:border-blue-600 rounded-3xl p-6 shadow-sm shadow-gray-200 transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-gray-900 uppercase text-lg group-hover:text-blue-600 transition-colors">
                                                {cabin.name}
                                            </h3>
                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">{cabin.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900">{formatPrice(cabin.price)}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">per guest</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <p className="text-sm text-gray-600 line-clamp-2">{cabin.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {cabin.amenities.slice(0, 3).map(a => (
                                                <span key={a} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/cruise/booking', { state: { cruise, cabin } })}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                    >
                                        Select Cabin <FaArrowRight />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CruiseDetail;
