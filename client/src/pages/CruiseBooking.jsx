import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCruiseBooking } from '../api/cruises';
import PaymentModal from '../components/PaymentModal';
import { useGlobal } from '../context/GlobalContext';
import { generateTicket } from '../utils/TicketGenerator';
import { FaUser, FaEnvelope, FaPhone, FaCheck, FaShip, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CruiseBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cruise, cabin } = location.state || {};
    const { formatPrice } = useGlobal();

    const [step, setStep] = useState(1); // 1: Guests, 2: Review, 3: Confirmation
    const [guests, setGuests] = useState([{ name: '', age: '', gender: 'Male' }]);
    const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [createdBooking, setCreatedBooking] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cruise || !cabin) {
            navigate('/cruise');
        }
    }, [cruise, cabin, navigate]);

    const handleGuestChange = (index, field, value) => {
        const updated = [...guests];
        updated[index] = { ...updated[index], [field]: field === 'age' ? parseInt(value) || '' : value };
        setGuests(updated);
    };

    const addGuest = () => {
        if (guests.length < cabin.capacity) {
            setGuests([...guests, { name: '', age: '', gender: 'Male' }]);
        } else {
            toast.error(`This cabin only accommodates up to ${cabin.capacity} guests.`);
        }
    };

    const removeGuest = (index) => {
        if (guests.length > 1) {
            setGuests(guests.filter((_, i) => i !== index));
        }
    };

    const handleGuestsSubmit = (e) => {
        e.preventDefault();
        if (guests.some(g => !g.name || !g.age)) {
            toast.error('Please fill all guest details.');
            return;
        }
        if (!contactInfo.email || !contactInfo.phone) {
            toast.error('Please fill contact details.');
            return;
        }
        setStep(2);
    };

    const handleBooking = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await createCruiseBooking({
                cruiseId: cruise._id,
                cabinId: cabin._id,
                guests,
                contactDetails: contactInfo
            });
            setCreatedBooking(res.data.booking);
            setIsPaymentModalOpen(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking creation failed.');
        } finally {
            setLoading(false);
        }
    };

    const onPaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        setStep(3);
    };

    if (!cruise || !cabin) return null;

    const totalAmount = cabin.price * guests.length;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-8 text-white relative">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight">Cruise Booking</h1>
                                <p className="text-blue-100 font-bold text-sm flex items-center gap-2 mt-1">
                                    <FaShip /> {cruise.name} · {cabin.name}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((s) => (
                                    <div
                                        key={s}
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? "bg-white text-blue-600 scale-110 shadow-lg" : "bg-blue-500 text-blue-200"
                                            }`}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Abstract Background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    </div>

                    <div className="p-8">
                        {step === 1 && (
                            <form onSubmit={handleGuestsSubmit}>
                                <div className="space-y-8">
                                    <section>
                                        <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                                            <FaUser className="text-blue-600 text-sm" /> Guest Details
                                        </h2>
                                        <div className="space-y-4">
                                            {guests.map((g, i) => (
                                                <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 relative group">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-wider">Guest {i + 1}</h3>
                                                        {guests.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGuest(i)}
                                                                className="text-red-500 hover:text-red-700 text-xs font-bold uppercase"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                                            <input
                                                                type="text"
                                                                value={g.name}
                                                                onChange={(e) => handleGuestChange(i, 'name', e.target.value)}
                                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Age</label>
                                                            <input
                                                                type="number"
                                                                value={g.age}
                                                                onChange={(e) => handleGuestChange(i, 'age', e.target.value)}
                                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Gender</label>
                                                            <select
                                                                value={g.gender}
                                                                onChange={(e) => handleGuestChange(i, 'gender', e.target.value)}
                                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                            >
                                                                <option>Male</option>
                                                                <option>Female</option>
                                                                <option>Other</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {guests.length < cabin.capacity && (
                                                <button
                                                    type="button"
                                                    onClick={addGuest}
                                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all font-black uppercase text-xs tracking-widest"
                                                >
                                                    + Add Guest
                                                </button>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                                            <FaEnvelope className="text-blue-600 text-sm" /> Contact Information
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-4 top-[38px] text-gray-400 text-sm" />
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={contactInfo.email}
                                                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <FaPhone className="absolute left-4 top-[38px] text-gray-400 text-sm" />
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={contactInfo.phone}
                                                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-sm flex items-center gap-2"
                                    >
                                        Continue to Review <FaArrowRight />
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                                    <h2 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tight">Review Your Booking</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Ship & Operator</p>
                                                <p className="font-bold text-blue-900">{cruise.name} · {cruise.operator}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Ports</p>
                                                <p className="font-bold text-blue-900">{cruise.departurePort} → {cruise.arrivalPort}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Departure</p>
                                                <p className="font-bold text-blue-900">{new Date(cruise.departureDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Cabin Type</p>
                                                <p className="font-bold text-blue-900">{cabin.name} ({cabin.type})</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Guests</p>
                                                <p className="font-bold text-blue-900">{guests.length} person(s)</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Fare</p>
                                                <p className="text-2xl font-black text-blue-600">{formatPrice(totalAmount)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="space-y-4">
                                    <h3 className="font-black text-gray-900 uppercase text-sm tracking-wider ml-1">Travelers</h3>
                                    <div className="space-y-2">
                                        {guests.map((g, i) => (
                                            <div key={i} className="flex justify-between items-center bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
                                                <span className="font-bold text-gray-700">{g.name}</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase">{g.age} yrs · {g.gender}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

                                <div className="mt-8 flex justify-between">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-gray-400 hover:text-gray-600 font-black uppercase text-sm tracking-widest"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={loading}
                                        className="bg-green-600 hover:bg-green-700 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-green-100 uppercase tracking-widest text-sm disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : `Confirm & Pay ${formatPrice(totalAmount)}`}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-50">
                                    <FaCheck className="text-4xl text-green-600" />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Booking Confirmed!</h2>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Your cruise adventure is locked in. We've sent the confirmation to <span className="text-blue-600 font-bold">{contactInfo.email}</span>.</p>
                                <div className="bg-gray-50 inline-block px-10 py-6 rounded-3xl border border-gray-100 mb-10">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
                                    <p className="text-3xl font-black text-blue-600 uppercase italic tracking-tighter">{createdBooking?.bookingReference}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => generateTicket({
                                            ...createdBooking,
                                            cruise: cruise,
                                            cabin: cabin,
                                            guests: guests,
                                            travelDate: cruise.departureDate
                                        }, 'cruise')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                    >
                                        Download Ticket
                                    </button>
                                    <button
                                        onClick={() => navigate('/cruise')}
                                        className="border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 text-gray-500 font-black px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                                    >
                                        Plan Another Trip
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {createdBooking && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    bookingId={createdBooking._id}
                    bookingType="cruise"
                    amount={totalAmount}
                    onPaymentSuccess={onPaymentSuccess}
                />
            )}
        </div>
    );
};

export default CruiseBooking;
