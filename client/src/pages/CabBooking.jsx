import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createCabBooking } from '../api/cabs';
import PaymentModal from '../components/PaymentModal';
import { useGlobal } from '../context/GlobalContext';
import { useAuth } from '../context/AuthContext';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaPhone, FaArrowRight, FaCheck, FaLock, FaDownload } from 'react-icons/fa';
import { generateTicket } from '../utils/TicketGenerator';

const CabBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cab, searchParams } = location.state || {};
    const { formatPrice } = useGlobal();
    const { user, token } = useAuth();

    const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Confirmation
    const [bookingData, setBookingData] = useState({
        pickupAddress: searchParams?.from || '',
        dropAddress: searchParams?.to || '',
        pickupDate: searchParams?.date || '',
        pickupTime: searchParams?.time || '10:00',
        name: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [createdBooking, setCreatedBooking] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cab) {
            navigate('/cabs');
        }
    }, [cab, navigate]);

    const handleInputChange = (field, value) => {
        setBookingData({ ...bookingData, [field]: value });
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleBooking = async () => {
        if (!token) {
            setError('Please login to book a ride.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await createCabBooking({
                cabId: cab._id,
                pickupAddress: bookingData.pickupAddress,
                dropAddress: bookingData.dropAddress,
                pickupDate: bookingData.pickupDate,
                pickupTime: bookingData.pickupTime,
                contactDetails: {
                    name: bookingData.name,
                    phone: bookingData.phone
                },
                totalAmount: cab.basePrice
            });
            setCreatedBooking(res.data.booking);
            setIsPaymentModalOpen(true);
        } catch (err) {
            console.error('Cab Booking Error:', err);
            setError(err.response?.data?.message || 'Booking creation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onPaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        setStep(3);
    };

    if (!cab) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                    {/* Header */}
                    <div className="bg-slate-900 p-10 text-white relative">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter italic">Ride Checkout</h1>
                                <p className="text-blue-400 font-bold text-sm tracking-widest uppercase mt-2 flex items-center gap-2">
                                    <FaCar /> {cab.vehicleName} · {cab.vehicleType}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Step {step} of 3</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(s => (
                                        <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Background design */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -translate-y-24 translate-x-12"></div>
                    </div>

                    <div className="p-10">
                        {step === 1 && (
                            <form onSubmit={handleDetailsSubmit} className="space-y-12">
                                <section>
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] text-white">01</div> Ride Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-4 top-[38px] text-green-500" />
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Pickup Location</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter street, area or landmark"
                                                    value={bookingData.pickupAddress}
                                                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-4 top-[38px] text-red-500" />
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Drop Location</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter destination address"
                                                    value={bookingData.dropAddress}
                                                    onChange={(e) => handleInputChange('dropAddress', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <FaCalendarAlt className="absolute left-4 top-[38px] text-blue-500" />
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={bookingData.pickupDate}
                                                    onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <FaClock className="absolute left-4 top-[38px] text-blue-500" />
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Time</label>
                                                <input
                                                    type="time"
                                                    value={bookingData.pickupTime}
                                                    onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] text-white">02</div> Contact Info
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-[38px] text-slate-300" />
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                value={bookingData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-[38px] text-slate-300" />
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="For trip updates"
                                                value={bookingData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-slate-900 text-white font-black px-12 py-5 rounded-[20px] transition-all shadow-2xl shadow-blue-200 uppercase tracking-[0.2em] text-xs flex items-center gap-4"
                                    >
                                        Confirm & Review <FaArrowRight className="text-[10px]" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="space-y-12">
                                <section className="bg-slate-50 rounded-[32px] p-10 border border-slate-100">
                                    <h2 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Your Trip Summary</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-white"></div>
                                                    <div className="w-0.5 h-16 bg-slate-200"></div>
                                                    <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-white"></div>
                                                </div>
                                                <div className="flex flex-col justify-between py-0.5">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pickup</p>
                                                        <p className="font-bold text-slate-900 text-sm">{bookingData.pickupAddress}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Drop</p>
                                                        <p className="font-bold text-slate-900 text-sm">{bookingData.dropAddress}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                                    <p className="font-bold text-slate-900 text-sm italic">{new Date(bookingData.pickupDate).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Time</p>
                                                    <p className="font-bold text-slate-900 text-sm italic">{bookingData.pickupTime}</p>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-slate-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Fare</span>
                                                    <span className="font-bold text-slate-900 text-sm">{formatPrice(cab.basePrice)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-2 text-green-600">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Driver Allowance</span>
                                                    <span className="font-bold text-sm">Included</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200">
                                                    <span className="text-xs font-black text-slate-900 uppercase">Total Estimate</span>
                                                    <span className="text-2xl font-black text-blue-600">{formatPrice(cab.basePrice)}</span>
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-slate-200">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking for</p>
                                                <p className="font-bold text-slate-900 text-sm">{bookingData.name} ({bookingData.phone})</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {error && <p className="text-red-600 text-sm font-bold bg-red-50 p-6 rounded-2xl border border-red-100">{error}</p>}

                                <div className="flex justify-between items-center bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-8 py-4 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest"
                                    >
                                        Go Back
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={loading}
                                        className="bg-slate-900 text-white font-black px-12 py-5 rounded-[22px] transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                                    >
                                        {loading ? 'Finalizing...' : `Secure Checkout · ${formatPrice(cab.basePrice)}`}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center py-20">
                                <div className="w-28 h-28 bg-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-200">
                                    <FaCheck className="text-5xl text-white" />
                                </div>
                                <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Ride Confirmed!</h2>
                                <p className="text-slate-400 mb-12 max-w-sm mx-auto font-medium">Your captain is being assigned. You'll receive driver details on <span className="text-slate-900 font-bold">{bookingData.phone}</span> shortly before the trip.</p>

                                <div className="bg-slate-900 text-white inline-block px-12 py-8 rounded-[32px] mb-12 shadow-2xl shadow-slate-200">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">Trip ID</p>
                                    <p className="text-4xl font-black italic tracking-tighter text-blue-400 leading-none">{createdBooking?.bookingReference}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <button
                                        onClick={() => generateTicket({
                                            ...createdBooking,
                                            cab: cab,
                                            pickupLocation: bookingData.pickupAddress,
                                            dropLocation: bookingData.dropAddress,
                                            pickupDate: bookingData.pickupDate,
                                            pickupTime: bookingData.pickupTime,
                                            userName: bookingData.name,
                                            userPhone: bookingData.phone
                                        }, 'cab')}
                                        className="bg-slate-900 text-white font-black px-10 py-5 rounded-[20px] shadow-xl shadow-slate-200 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                                    >
                                        <FaDownload /> Download Ticket
                                    </button>
                                    <button
                                        onClick={() => navigate('/cabs')}
                                        className="bg-white border-2 border-slate-100 hover:border-slate-900 hover:text-slate-900 text-slate-400 font-black px-10 py-5 rounded-[20px] transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        Book Another Cab
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-blue-600 text-white font-black px-10 py-5 rounded-[20px] shadow-xl shadow-blue-100 uppercase tracking-widest text-[10px]"
                                    >
                                        Back to Home
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
                    bookingType="cab"
                    amount={cab.basePrice}
                    onPaymentSuccess={onPaymentSuccess}
                />
            )}
        </div>
    );
};

export default CabBooking;
