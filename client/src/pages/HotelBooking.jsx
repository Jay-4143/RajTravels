import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createHotelBooking } from "../api/bookings";
import PaymentModal from "../components/PaymentModal";
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";
import toast from "react-hot-toast";

const HotelBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, room, searchParams } = location.state || {};

  const [step, setStep] = useState(1); // 1: guests, 2: review, 3: processing/confirmation
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [guestNames, setGuestNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState(null);
  const { formatPrice } = useGlobal();

  useEffect(() => {
    if (!hotel || !room || !searchParams) {
      navigate("/hotels");
      return;
    }
    const guests = searchParams.guests || 2;
    const names = Array(guests).fill("").map((_, i) => ({ name: "", email: "", phone: "" }));
    setGuestNames(names);
  }, [hotel, room, searchParams, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const calculateTotal = () => {
    if (!room || !searchParams?.checkIn || !searchParams?.checkOut) return 0;
    const cIn = new Date(searchParams.checkIn + "T12:00:00");
    const cOut = new Date(searchParams.checkOut + "T12:00:00");
    const nights = Math.ceil((cOut - cIn) / (1000 * 60 * 60 * 24));
    return room.pricePerNight * nights * (searchParams.rooms || 1);
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...guestNames];
    updated[index] = { ...updated[index], [field]: value };
    setGuestNames(updated);
  };

  const handleReview = () => {
    if (guestNames.some((g) => !g.name)) {
      toast.error('Please fill all guest names.');
      return;
    }
    setStep(2);
  };

  const handleToPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createHotelBooking({
        hotelId: hotel._id,
        roomId: room._id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        rooms: searchParams.rooms || 1,
        guests: searchParams.guests || 2,
        guestNames: guestNames.map((g) => g.name),
      });
      setCreatedBooking(res.data.booking);
      setIsPaymentModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Booking creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = (payment) => {
    setIsPaymentModalOpen(false);
    setBookingRef(createdBooking.bookingReference);
    setStep(4);
  };

  if (!hotel || !room || !searchParams) return null;

  const total = calculateTotal();
  const nights = searchParams.checkIn && searchParams.checkOut
    ? Math.ceil(
      (new Date(searchParams.checkOut + "T12:00:00") - new Date(searchParams.checkIn + "T12:00:00")) /
      (1000 * 60 * 60 * 24)
    )
    : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hotel Booking</h1>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= s ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
              <div className="space-y-4">
                {guestNames.map((g, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 relative group">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Guest {i + 1}</h3>
                      {guestNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = guestNames.filter((_, idx) => idx !== i);
                            setGuestNames(updated);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={g.name}
                          onChange={(e) => handleGuestChange(i, "name", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={g.email}
                          onChange={(e) => handleGuestChange(i, "email", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={g.phone}
                          onChange={(e) => handleGuestChange(i, "phone", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setGuestNames([...guestNames, { name: "", email: "", phone: "" }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span> Add Guest
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleReview}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review Booking</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Hotel Details</h3>
                  <p className="text-sm text-gray-600 font-medium">{hotel.name}</p>
                  <p className="text-sm text-gray-600">{hotel.address || hotel.city}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Room Details</h3>
                  <p className="text-sm text-gray-600">{room.name || room.roomType}</p>
                  <p className="text-sm text-gray-600">Rooms: {searchParams.rooms || 1}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <p className="text-sm text-gray-600">
                    Check-in: {formatDate(searchParams.checkIn)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Check-out: {formatDate(searchParams.checkOut)}
                  </p>
                  <p className="text-sm text-gray-600">Nights: {nights}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Guests</h3>
                  {guestNames.map((g, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      {g.name} {g.email && `(${g.email})`}
                    </p>
                  ))}
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Price Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {formatPrice(room.pricePerNight)} × {nights} night{nights !== 1 ? "s" : ""} × {searchParams.rooms || 1} room{searchParams.rooms !== 1 ? "s" : ""}
                      </span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleToPayment}
                  disabled={loading}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-4">Your hotel booking has been confirmed.</p>
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Booking Reference: <span className="text-red-500">{bookingRef}</span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => generateTicket({
                    ...createdBooking,
                    hotel: hotel,
                    room: room,
                    checkIn: searchParams.checkIn,
                    checkOut: searchParams.checkOut,
                    guests: searchParams.guests || searchParams.adults + (searchParams.children || 0),
                    guestNames: guestNames.map(g => g.name)
                  }, 'hotel')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Ticket
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/hotels")}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Book Another Hotel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {createdBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingId={createdBooking.id}
          bookingType="hotel"
          amount={total}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default HotelBooking;
