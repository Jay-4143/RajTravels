import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getBusById, bookBus } from '../api/busApi';
import {
    FaBus, FaMapMarkerAlt, FaClock, FaArrowRight, FaCheck,
    FaShieldAlt, FaUser, FaPhone, FaEnvelope, FaChevronLeft,
    FaPrint, FaDownload, FaStar, FaWifi, FaPlug, FaSnowflake
} from 'react-icons/fa';
import { MdEventSeat } from 'react-icons/md';
import PaymentModal from '../components/PaymentModal';
import { useGlobal } from '../context/GlobalContext';
import { generateTicket } from '../utils/TicketGenerator';
import { validateField, validateDates } from '../utils/validationRules';
import ValidationError from '../components/common/ValidationError';

// ─── Seat Map Component ────────────────────────────────────────────────────
const SeatMap = ({ seats, selectedSeats, onToggleSeat, deck = 'lower' }) => {
    const deckSeats = seats.filter(s => s.deck === deck);

    // Group by row number
    const rows = {};
    deckSeats.forEach(seat => {
        const rowNum = seat.seatNumber.replace(/[A-Za-z]/g, '');
        if (!rows[rowNum]) rows[rowNum] = [];
        rows[rowNum].push(seat);
    });

    const getSeatColor = (seat) => {
        if (seat.isBooked) return 'bg-gray-300 text-gray-400 cursor-not-allowed border-gray-300';
        if (selectedSeats.includes(seat.seatNumber)) return 'bg-blue-600 text-white border-blue-600 shadow-md scale-105';
        if (seat.type === 'window') return 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100';
        return 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300';
    };

    return (
        <div>
            {deck === 'upper' && (
                <div className="text-xs text-gray-500 text-center mb-2 font-medium">Upper Deck</div>
            )}
            {deck === 'lower' && (
                <div className="text-xs text-gray-500 text-center mb-2 font-medium">Lower Deck</div>
            )}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-3">
                {/* Driver */}
                <div className="flex justify-end mb-3 pr-1">
                    <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">🚌 Driver</div>
                </div>
                {/* Seats */}
                <div className="space-y-2">
                    {Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b)).map(rowNum => {
                        const rowSeats = rows[rowNum].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
                        // Group: first 2 on left window/aisle, then aisle gap, then 2 on right
                        const leftSeats = rowSeats.slice(0, 2);
                        const rightSeats = rowSeats.slice(2);
                        return (
                            <div key={rowNum} className="flex items-center gap-1">
                                <span className="text-xs text-gray-400 w-5 text-center">{rowNum}</span>
                                <div className="flex gap-1">
                                    {leftSeats.map(seat => (
                                        <button
                                            key={seat.seatNumber}
                                            disabled={seat.isBooked}
                                            onClick={() => onToggleSeat(seat.seatNumber)}
                                            className={`w-9 h-9 border-2 rounded-lg text-xs font-bold transition-all duration-150 ${getSeatColor(seat)}`}
                                            title={`Seat ${seat.seatNumber} (${seat.type})`}
                                        >
                                            {seat.isBooked ? '✗' : seat.seatNumber.replace(/[0-9]/g, '')}
                                        </button>
                                    ))}
                                </div>
                                {/* Aisle gap */}
                                <div className="w-4"></div>
                                <div className="flex gap-1">
                                    {rightSeats.map(seat => (
                                        <button
                                            key={seat.seatNumber}
                                            disabled={seat.isBooked}
                                            onClick={() => onToggleSeat(seat.seatNumber)}
                                            className={`w-9 h-9 border-2 rounded-lg text-xs font-bold transition-all duration-150 ${getSeatColor(seat)}`}
                                            title={`Seat ${seat.seatNumber} (${seat.type})`}
                                        >
                                            {seat.isBooked ? '✗' : seat.seatNumber.replace(/[0-9]/g, '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Booking Confirmation ──────────────────────────────────────────────────
const BookingConfirmation = ({ booking, bus, onNewBooking, formatPrice }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
            {/* Success Header */}
            <div className="bg-green-500 rounded-t-3xl p-8 text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-4xl" />
                </div>
                <h1 className="text-3xl font-extrabold mb-2">Booking Confirmed!</h1>
                <p className="text-green-100">Your bus ticket has been booked successfully.</p>
            </div>

            {/* Ticket */}
            <div className="bg-white shadow-xl px-6 py-4">
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-500 text-sm">PNR Number</span>
                    <span className="font-mono font-extrabold text-blue-700 text-lg">{booking.pnr}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-500 text-sm">Bus</span>
                    <span className="font-bold text-gray-800">{booking.bus}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                    <div>
                        <p className="text-gray-500 text-sm">From</p>
                        <p className="font-bold text-gray-800">{booking.from}</p>
                        <p className="text-blue-600 font-mono font-bold">{booking.departureTime}</p>
                    </div>
                    <FaArrowRight className="text-gray-300 text-xl" />
                    <div className="text-right">
                        <p className="text-gray-500 text-sm">To</p>
                        <p className="font-bold text-gray-800">{booking.to}</p>
                        <p className="text-blue-600 font-mono font-bold">{booking.arrivalTime}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-500 text-sm">Travel Date</span>
                    <span className="font-semibold text-gray-800">{new Date(booking.travelDate).toDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-500 text-sm">Seat{booking.seats?.length > 1 ? 's' : ''}</span>
                    <span className="font-bold text-gray-800">{booking.seats?.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-500 text-sm">Passenger</span>
                    <span className="font-bold text-gray-800">{booking.passengerName}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                    <span className="text-gray-500 text-sm">Total Fare</span>
                    <span className="text-2xl font-extrabold text-blue-600">{formatPrice(booking.totalFare || 0)}</span>
                </div>
            </div>

            {/* Dashed Separator */}
            <div className="bg-white px-6">
                <div className="border-t-2 border-dashed border-gray-200 my-0"></div>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-b-3xl shadow-xl px-6 py-5">
                <p className="text-xs text-gray-400 text-center mb-4">Confirmation sent to <strong>{booking.passengerEmail}</strong></p>
                <div className="flex gap-3">
                    <button
                        onClick={() => generateTicket(booking, 'bus')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-md"
                    >
                        <FaDownload /> Download Ticket
                    </button>
                    <button
                        onClick={onNewBooking}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Book Another
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const BusBooking = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [bus, setBus] = useState(location.state?.bus || null);
    const [loading, setLoading] = useState(!bus);
    const [step, setStep] = useState(1); // 1: Seat Select, 2: Passenger Form, 3: Summary, 4: Confirmation
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [activeDeck, setActiveDeck] = useState('lower');
    const [booking, setBooking] = useState(null);
    const [createdBooking, setCreatedBooking] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [bookingError, setBookingError] = useState('');
    const { formatPrice } = useGlobal();

    const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
    const [passengers, setPassengers] = useState([]);

    useEffect(() => {
        if (!bus) {
            getBusById(id)
                .then(res => setBus(res.bus))
                .catch(() => navigate('/buses'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // Update passengers array based on selected seats
    useEffect(() => {
        setPassengers(selectedSeats.map((seat, i) => ({
            seatNumber: seat,
            name: '',
            age: '',
            gender: 'Male',
        })));
    }, [selectedSeats]);

    const hasDeck = bus?.seats?.some(s => s.deck === 'upper');

    const toggleSeat = (seatNumber) => {
        setSelectedSeats(prev =>
            prev.includes(seatNumber)
                ? prev.filter(s => s !== seatNumber)
                : prev.length < 6 ? [...prev, seatNumber] : prev
        );
    };

    const updatePassenger = (index, field, value) => {
        setPassengers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
        if (fieldErrors[`p${index}_${field}`]) {
            setFieldErrors(prev => {
                const updated = { ...prev };
                delete updated[`p${index}_${field}`];
                return updated;
            });
        }
    };

    const handleStep2Submit = () => {
        const errors = {};

        // Validate Contact Info
        const nameErr = validateField('name', contactInfo.name);
        if (nameErr) errors.contactName = nameErr;

        const emailErr = validateField('email', contactInfo.email);
        if (emailErr) errors.contactEmail = emailErr;

        const phoneErr = validateField('mobile', contactInfo.phone);
        if (phoneErr) errors.contactPhone = phoneErr;

        // Validate Passengers
        passengers.forEach((p, i) => {
            const pNameErr = validateField('name', p.name);
            if (pNameErr) errors[`p${i}_name`] = pNameErr;

            if (!p.age) errors[`p${i}_age`] = "Age is required";
            else if (p.age < 1 || p.age > 120) errors[`p${i}_age`] = "Invalid age";
        });

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setStep(3);
    };

    const handleSubmitBooking = async () => {
        setSubmitting(true);
        setBookingError('');
        try {
            const res = await bookBus({
                busId: bus._id,
                passengerName: contactInfo.name,
                passengerEmail: contactInfo.email,
                passengerPhone: contactInfo.phone,
                passengers: passengers.map(p => ({ ...p, age: parseInt(p.age) })),
            });
            if (res.success) {
                setCreatedBooking(res.booking);
                setIsPaymentModalOpen(true);
            }
        } catch (err) {
            setBookingError(err?.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const onPaymentSuccess = (payment) => {
        setIsPaymentModalOpen(false);
        setBooking({
            ...createdBooking,
            busName: bus.busName,
            operatorName: bus.operatorName,
            from: bus.from,
            to: bus.to,
            departureTime: bus.departureTime,
            arrivalTime: bus.arrivalTime,
            travelDate: bus.travelDate,
            passengerName: contactInfo.name,
            passengerEmail: contactInfo.email,
            passengerPhone: contactInfo.phone,
            seats: selectedSeats,
            passengers: passengers
        });
        setStep(4);
    };

    const isStep1Valid = selectedSeats.length > 0;
    const isStep2Valid = passengers.every(p => p.name && p.age && p.gender) && contactInfo.name && contactInfo.email && contactInfo.phone;

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading bus details...</div>;
    if (!bus) return null;

    if (step === 4 && booking) {
        return <BookingConfirmation booking={booking} bus={bus} onNewBooking={() => navigate('/buses')} formatPrice={formatPrice} />;
    }

    const totalFare = bus.price * selectedSeats.length;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => step === 1 ? navigate('/buses') : setStep(s => s - 1)} className="text-gray-600 hover:text-blue-600 transition-colors">
                        <FaChevronLeft className="text-lg" />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-800">{bus.busName} · {bus.operatorName}</h1>
                        <p className="text-sm text-gray-500">{bus.from} → {bus.to} · {new Date(bus.travelDate).toDateString()}</p>
                    </div>
                    {/* Step Progress */}
                    <div className="ml-auto hidden md:flex gap-2 items-center">
                        {['Select Seats', 'Passengers', 'Summary'].map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className={`w-8 h-0.5 ${step > i ? 'bg-blue-500' : 'bg-gray-200'}`}></div>}
                                <div className={`flex items-center gap-1.5 text-sm font-medium ${step === i + 1 ? 'text-blue-600' : step > i + 1 ? 'text-green-600' : 'text-gray-400'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === i + 1 ? 'border-blue-600 bg-blue-50' : step > i + 1 ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                                        {step > i + 1 ? <FaCheck /> : i + 1}
                                    </div>
                                    {s}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Main Content ─────────────────────────────────── */}
                <div className="lg:col-span-2">

                    {/* STEP 1: Seat Selection */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Select Your Seats</h2>
                            <p className="text-gray-500 text-sm mb-5">Choose up to 6 seats. Green = Window seat.</p>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-3 mb-5 text-xs">
                                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded border-2 border-gray-300 bg-white"></div> Available</div>
                                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded border-2 border-green-300 bg-green-50"></div> Window</div>
                                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded border-2 border-blue-600 bg-blue-600"></div> Selected</div>
                                <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded border-2 border-gray-300 bg-gray-300"></div> Booked</div>
                            </div>

                            {/* Deck Tabs */}
                            {hasDeck && (
                                <div className="flex gap-2 mb-4">
                                    {['lower', 'upper'].map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setActiveDeck(d)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeDeck === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {d.charAt(0).toUpperCase() + d.slice(1)} Deck
                                        </button>
                                    ))}
                                </div>
                            )}

                            <SeatMap
                                seats={bus.seats}
                                selectedSeats={selectedSeats}
                                onToggleSeat={toggleSeat}
                                deck={hasDeck ? activeDeck : 'lower'}
                            />

                            {selectedSeats.length > 0 && (
                                <div className="mt-5 p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                                    <p className="text-blue-700 text-sm font-medium">Selected: <strong>{selectedSeats.join(', ')}</strong></p>
                                    <p className="text-blue-800 font-bold">{formatPrice(totalFare)}</p>
                                </div>
                            )}

                            <button
                                onClick={() => setStep(2)}
                                disabled={!isStep1Valid}
                                className="mt-5 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue with {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} →
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Passenger Details */}
                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Contact Info */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text" placeholder="Full Name"
                                            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${fieldErrors.contactName ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                                            value={contactInfo.name}
                                            onChange={e => {
                                                setContactInfo({ ...contactInfo, name: e.target.value });
                                                if (fieldErrors.contactName) setFieldErrors(prev => ({ ...prev, contactName: null }));
                                            }}
                                        />
                                        <ValidationError message={fieldErrors.contactName} />
                                    </div>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="email" placeholder="Email Address"
                                            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${fieldErrors.contactEmail ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                                            value={contactInfo.email}
                                            onChange={e => {
                                                setContactInfo({ ...contactInfo, email: e.target.value });
                                                if (fieldErrors.contactEmail) setFieldErrors(prev => ({ ...prev, contactEmail: null }));
                                            }}
                                        />
                                        <ValidationError message={fieldErrors.contactEmail} />
                                    </div>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="tel" placeholder="Phone Number"
                                            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${fieldErrors.contactPhone ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                                            value={contactInfo.phone}
                                            onChange={e => {
                                                setContactInfo({ ...contactInfo, phone: e.target.value });
                                                if (fieldErrors.contactPhone) setFieldErrors(prev => ({ ...prev, contactPhone: null }));
                                            }}
                                        />
                                        <ValidationError message={fieldErrors.contactPhone} />
                                    </div>
                                </div>
                            </div>

                            {/* Passenger Info per Seat */}
                            {passengers.map((p, i) => (
                                <div key={p.seatNumber} className="bg-white rounded-2xl shadow-md p-6">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <MdEventSeat className="text-blue-500" /> Passenger {i + 1} · Seat <span className="text-blue-600">{p.seatNumber}</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text" placeholder="Passenger Name"
                                                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${fieldErrors[`p${i}_name`] ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                                                value={p.name}
                                                onChange={e => updatePassenger(i, 'name', e.target.value)}
                                            />
                                            <ValidationError message={fieldErrors[`p${i}_name`]} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                            <input
                                                type="number" placeholder="Age" min="1" max="120"
                                                className={`w-full px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${fieldErrors[`p${i}_age`] ? 'border-red-500 bg-red-50/30' : 'border-gray-200'}`}
                                                value={p.age}
                                                onChange={e => updatePassenger(i, 'age', e.target.value)}
                                            />
                                            <ValidationError message={fieldErrors[`p${i}_age`]} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                value={p.gender}
                                                onChange={e => updatePassenger(i, 'gender', e.target.value)}
                                            >
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                            <ValidationError message={fieldErrors[`p${i}_gender`]} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleStep2Submit}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition active:scale-[0.98]"
                            >
                                Review Booking →
                            </button>
                        </div>
                    )}

                    {/* STEP 3: Review & Confirm */}
                    {step === 3 && (
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-5">Review Your Booking</h2>

                            {/* Journey */}
                            <div className="bg-blue-50 rounded-xl p-4 mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{bus.departureTime}</p>
                                    <p className="text-gray-600">{bus.from}</p>
                                </div>
                                <div className="text-center flex flex-col items-center">
                                    <p className="text-xs text-gray-400">{bus.duration}</p>
                                    <FaArrowRight className="text-blue-500 my-1" />
                                    <p className="text-xs text-blue-600 font-medium">{bus.busType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-800">{bus.arrivalTime}</p>
                                    <p className="text-gray-600">{bus.to}</p>
                                </div>
                            </div>

                            {/* Passenger Summary */}
                            <h3 className="font-bold text-gray-700 mb-3">Passengers</h3>
                            <div className="space-y-2 mb-5">
                                {passengers.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <MdEventSeat className="text-blue-400" />
                                            <span className="font-medium text-gray-800">{p.name}</span>
                                            <span className="text-gray-400 text-sm">· {p.age} yrs · {p.gender}</span>
                                        </div>
                                        <span className="text-blue-600 font-bold">Seat {p.seatNumber}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact */}
                            <h3 className="font-bold text-gray-700 mb-3">Contact Info</h3>
                            <div className="text-sm text-gray-600 mb-5 space-y-1">
                                <p><span className="text-gray-400">Name:</span> {contactInfo.name}</p>
                                <p><span className="text-gray-400">Email:</span> {contactInfo.email}</p>
                                <p><span className="text-gray-400">Phone:</span> {contactInfo.phone}</p>
                            </div>

                            {bookingError && (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm mb-4 border border-red-200">
                                    {bookingError}
                                </div>
                            )}

                            <button
                                onClick={handleSubmitBooking}
                                disabled={submitting}
                                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition shadow-lg disabled:opacity-70 text-lg"
                            >
                                {submitting ? 'Processing...' : `✓ Confirm & Pay ${formatPrice(totalFare)}`}
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-2 flex items-center justify-center gap-1"><FaShieldAlt /> 100% Secure payment</p>
                        </div>
                    )}
                </div>

                {/* ── Sidebar: Trip Summary ──────────────────────────── */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-md p-5 sticky top-24">
                        <h3 className="font-bold text-gray-800 text-base border-b pb-3 mb-4">Booking Summary</h3>

                        {/* Bus Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaBus className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-800">{bus.busName}</p>
                                <p className="text-xs text-gray-500">{bus.operatorName} · {bus.busType}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <div>
                                <p className="font-bold text-gray-800 text-base">{bus.departureTime}</p>
                                <p>{bus.from}</p>
                            </div>
                            <div className="flex flex-col items-center text-gray-300">
                                <span className="text-xs text-gray-400">{bus.duration}</span>
                                <FaArrowRight />
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800 text-base">{bus.arrivalTime}</p>
                                <p>{bus.to}</p>
                            </div>
                        </div>

                        <div className="border-t pt-3 mt-3 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Date</span>
                                <span className="font-medium">{new Date(bus.travelDate).toDateString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Seats</span>
                                <span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Fare / seat</span>
                                <span className="font-medium">{formatPrice(bus.price)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                                <FaShieldAlt /> {bus.cancellationPolicy}
                            </div>
                        </div>

                        {/* Amenities */}
                        {bus.amenities?.length > 0 && (
                            <div className="mt-4 border-t pt-3">
                                <p className="text-xs text-gray-500 mb-2 font-medium">Amenities</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {bus.amenities.map(a => (
                                        <span key={a} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{a}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        <div className="mt-4 pt-3 border-t">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Total Fare</span>
                                <span className="text-2xl font-extrabold text-blue-600">{formatPrice(totalFare || 0)}</span>
                            </div>
                            {selectedSeats.length === 0 && <p className="text-xs text-gray-400 mt-1">Select seats to see total</p>}
                        </div>

                        {/* Rating */}
                        <div className="mt-4 flex items-center gap-2">
                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(Math.floor(bus.rating))].map((_, i) => <FaStar key={i} />)}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{bus.rating}</span>
                            <span className="text-xs text-gray-400">({bus.totalRatings} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>

            {createdBooking && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    bookingId={createdBooking.id}
                    bookingType="bus"
                    amount={totalFare}
                    onPaymentSuccess={onPaymentSuccess}
                />
            )}
        </div>
    );
};

export default BusBooking;
