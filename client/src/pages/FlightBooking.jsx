import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createFlightBooking } from "../api/bookings";
import SeatMap from "../components/SeatMap";
import PaymentModal from "../components/PaymentModal";
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";
import toast from "react-hot-toast";

const FlightBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, returnFlight, searchParams, tripType } = location.state || {};

  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isAutoSelect, setIsAutoSelect] = useState(false);
  const [isReturnAutoSelect, setIsReturnAutoSelect] = useState(false);
  const [returnSelectedSeats, setReturnSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState(null);
  const { formatPrice } = useGlobal();

  const AVAILABLE_ADDONS = [
    { id: 'meal', name: 'Premium Meal', price: 599, icon: '🍱' },
    { id: 'water', name: 'Mineral Water', price: 50, icon: '💧' },
    { id: 'tea', name: 'Masala Tea', price: 99, icon: '☕' },
    { id: 'coffee', name: 'Starbucks Coffee', price: 299, icon: '☕' },
  ];

  useEffect(() => {
    if (!flight || !searchParams) {
      navigate("/flights");
      return;
    }
    const totalPax = (searchParams.adults || 0) + (searchParams.children || 0) + (searchParams.infants || 0);
    const paxList = Array(totalPax || 1)
      .fill(null)
      .map((_, i) => ({ name: "", age: i < (searchParams.adults || 0) ? 18 : i < (searchParams.adults || 0) + (searchParams.children || 0) ? 10 : 1 }));
    setPassengers(paxList);
  }, [flight, searchParams, navigate]);

  const formatTime = (date) => {
    if (!date) return "--";
    const d = new Date(date);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const calculateTotal = () => {
    if (!flight) return 0;
    const paxCount = passengers.length || 1;
    let baseFare = flight.price * paxCount;
    if (tripType === "round-trip" && returnFlight) {
      baseFare += returnFlight.price * paxCount;
    }

    // Add-ons
    const addOnTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0) * paxCount;

    // Seat Premiums
    let seatPremiumOrigin = 0;
    if (!isAutoSelect) {
      selectedSeats.forEach(s => {
        if (s.includes('A') || s.includes('F')) seatPremiumOrigin += 499;
        else if (s.includes('C') || s.includes('D')) seatPremiumOrigin += 299;
        else seatPremiumOrigin += 99; // Middle/Normal seats
      });
    }

    let seatPremiumReturn = 0;
    if (tripType === "round-trip" && returnFlight && !isReturnAutoSelect) {
      returnSelectedSeats.forEach(s => {
        if (s.includes('A') || s.includes('F')) seatPremiumReturn += 499;
        else if (s.includes('C') || s.includes('D')) seatPremiumReturn += 299;
        else seatPremiumReturn += 99;
      });
    }

    const subtotal = baseFare + seatPremiumOrigin + seatPremiumReturn + addOnTotal;
    const tax = Math.round(subtotal * 0.18);
    const convenienceFee = 199 * paxCount;

    return subtotal + tax + convenienceFee;
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: field === "age" ? Number(value) : value };
    setPassengers(updated);
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleDetailsSubmit = () => {
    if (passengers.some((p) => !p.name || !p.age)) {
      toast.error('Please fill all passenger details.');
      return;
    }
    setStep(2);
  };

  const handleSeatSelectionComplete = () => {
    if (!isAutoSelect && selectedSeats.length !== passengers.length) {
      toast.error(`Please select ${passengers.length} seats or choose Auto-select for the outbound flight.`);
      return;
    }
    if (tripType === "round-trip" && returnFlight && !isReturnAutoSelect && returnSelectedSeats.length !== passengers.length) {
      toast.error(`Please select ${passengers.length} seats or choose Auto-select for the return flight.`);
      return;
    }
    setStep(3);
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createFlightBooking({
        flightId: flight._id,
        returnFlightId: returnFlight?._id,
        passengers: passengers.map((p, i) => ({
          name: p.name,
          age: p.age,
          seat: isAutoSelect ? "Auto-selected" : selectedSeats[i]
        })),
        seats: isAutoSelect ? passengers.map(() => "Auto") : selectedSeats,
        tripType: tripType || "one-way",
        flightDetails: flight,
        addons: selectedAddons.map(a => ({ name: a.name, price: a.price, category: 'addon' }))
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

  if (!flight || !searchParams) return null;

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Flight Booking</h1>
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
              <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 relative group">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Passenger {i + 1}</h3>
                      {passengers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = passengers.filter((_, idx) => idx !== i);
                            setPassengers(updated);
                            // Also clear seats for that index if needed, but selectedSeats is usually managed by index too
                            const updatedSeats = [...selectedSeats];
                            updatedSeats.splice(i, 1);
                            setSelectedSeats(updatedSeats);
                            if (tripType === "round-trip") {
                              const updatedReturnSeats = [...returnSelectedSeats];
                              updatedReturnSeats.splice(i, 1);
                              setReturnSelectedSeats(updatedReturnSeats);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Age</label>
                        <input
                          type="number"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(i, "age", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPassengers([...passengers, { name: "", age: 25 }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span> Add Passenger
                </button>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleDetailsSubmit}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Continue to Seats
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">{flight.from} → {flight.to} Seat Selection</h2>
              <SeatMap
                flightId={flight._id}
                passengers={passengers}
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
                isAutoSelect={isAutoSelect}
                setIsAutoSelect={setIsAutoSelect}
              />

              {tripType === "round-trip" && returnFlight && (
                <div className="mt-8 border-t pt-8">
                  <h2 className="text-xl font-semibold mb-4">{returnFlight.from} → {returnFlight.to} Seat Selection</h2>
                  <SeatMap
                    flightId={returnFlight._id}
                    passengers={passengers}
                    selectedSeats={returnSelectedSeats}
                    onSeatSelect={setReturnSelectedSeats}
                    isAutoSelect={isReturnAutoSelect}
                    setIsAutoSelect={setIsReturnAutoSelect}
                  />
                </div>
              )}

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
                  onClick={handleSeatSelectionComplete}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review & Add-ons</h2>

              {/* In-flight Services */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span>🍽️</span> In-flight Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {AVAILABLE_ADDONS.map(addon => (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition-all ${selectedAddons.find(a => a.id === addon.id)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-100 hover:border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{addon.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{addon.name}</p>
                          <p className="text-xs text-gray-500">Per passenger</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">{formatPrice(addon.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Flight Details</h3>
                  <p className="text-sm text-gray-600">
                    {flight.airline} • {flight.flightNumber || ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {flight.from} → {flight.to}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)} ({flight.duration})
                  </p>
                  {tripType === "round-trip" && returnFlight && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm text-gray-600">
                        Return: {returnFlight.airline} • {returnFlight.from} → {returnFlight.to}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatTime(returnFlight.departureTime)} - {formatTime(returnFlight.arrivalTime)} ({returnFlight.duration})
                      </p>
                    </div>
                  )}
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Passengers & Seats</h3>
                  {passengers.map((p, i) => (
                    <div key={i} className="text-sm text-gray-600 flex justify-between">
                      <span>{p.name} (Age: {p.age})</span>
                      <span>
                        Seat: <strong>{isAutoSelect ? "Auto" : (selectedSeats[i] || "None")}</strong>
                        {tripType === "round-trip" && ` | Return: ${isReturnAutoSelect ? "Auto" : (returnSelectedSeats[i] || "None")}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Price Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Fare ({passengers.length} pax)</span>
                      <span>{formatPrice(flight.price * passengers.length)}</span>
                    </div>
                    {tripType === "round-trip" && returnFlight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare (Return)</span>
                        <span>{formatPrice(returnFlight.price * passengers.length)}</span>
                      </div>
                    )}

                    {/* Seat Premiums */}
                    {((!isAutoSelect && selectedSeats.length > 0) || (tripType === "round-trip" && !isReturnAutoSelect && returnSelectedSeats.length > 0)) && (
                      <div className="flex justify-between text-blue-600">
                        <span className="text-gray-600 italic">Seat Selection Premium</span>
                        <span>{formatPrice(
                          (!isAutoSelect ? selectedSeats.reduce((sum, s) => sum + (s.includes('A') || s.includes('F') ? 499 : (s.includes('C') || s.includes('D') ? 299 : 99)), 0) : 0) +
                          (tripType === "round-trip" && !isReturnAutoSelect ? returnSelectedSeats.reduce((sum, s) => sum + (s.includes('A') || s.includes('F') ? 499 : (s.includes('C') || s.includes('D') ? 299 : 99)), 0) : 0)
                        )}</span>
                      </div>
                    )}

                    {/* Add-ons */}
                    {selectedAddons.length > 0 && selectedAddons.map(addon => (
                      <div key={addon.id} className="flex justify-between text-green-600">
                        <span className="text-gray-600 italic">{addon.name} x {passengers.length}</span>
                        <span>{formatPrice(addon.price * passengers.length)}</span>
                      </div>
                    ))}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes ({passengers.length} pax)</span>
                      <span>{formatPrice(Math.round((total - (199 * passengers.length)) * 0.15))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Convenience Fee</span>
                      <span>{formatPrice(199 * passengers.length)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t text-gray-900">
                      <span>Total</span>
                      <span className="text-red-600">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-600 mt-4">{error}</p>}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
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
              <p className="text-gray-600 mb-4">Your flight booking has been confirmed.</p>
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Booking Reference: <span className="text-red-500">{bookingRef}</span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => generateTicket({
                    ...createdBooking,
                    flightDetails: flight,
                    passengers: passengers.map((p, i) => ({
                      name: p.name,
                      age: p.age,
                      seatNumber: isAutoSelect ? "Auto-selected" : selectedSeats[i]
                    })),
                    addons: selectedAddons,
                    tripType: tripType
                  }, 'flight')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Ticket
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/flights")}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Book Another Flight
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
          bookingType="flight"
          amount={total}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default FlightBooking;
