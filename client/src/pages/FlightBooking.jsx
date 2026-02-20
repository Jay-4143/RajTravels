import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createFlightBooking } from "../api/bookings";
import SeatMap from "../components/SeatMap";

const FlightBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, returnFlight, searchParams, tripType } = location.state || {};

  const [step, setStep] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [returnSelectedSeats, setReturnSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState(null);

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
    const baseFare = flight.price * paxCount;
    const tax = Math.round(baseFare * 0.18);
    const convenienceFee = 199 * paxCount;
    let total = baseFare + tax + convenienceFee;
    if (tripType === "round-trip" && returnFlight) {
      const returnBase = returnFlight.price * paxCount;
      total += returnBase + Math.round(returnBase * 0.18) + 199 * paxCount;
    }
    return total;
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: field === "age" ? Number(value) : value };
    setPassengers(updated);
  };

  const handleDetailsSubmit = () => {
    if (passengers.some((p) => !p.name || !p.age)) {
      alert("Please fill all passenger details.");
      return;
    }
    setStep(2);
  };

  const handleSeatSelectionComplete = () => {
    if (selectedSeats.length !== passengers.length) {
      alert(`Please select ${passengers.length} seats for the outbound flight.`);
      return;
    }
    if (tripType === "round-trip" && returnFlight && returnSelectedSeats.length !== passengers.length) {
      alert(`Please select ${passengers.length} seats for the return flight.`);
      return;
    }
    setStep(3);
  };

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
          // Map seats to passengers based on order for simplicity
          seat: selectedSeats[i]
        })),
        seats: selectedSeats,
        // Note: Backend might need update to handle return seats structure if strictly validated
        // For now sending outbound seats as primary
        tripType: tripType || "one-way",
      });
      setBookingRef(res.data.booking.bookingReference);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
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
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Passenger {i + 1}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Age</label>
                        <input
                          type="number"
                          value={p.age}
                          onChange={(e) => handlePassengerChange(i, "age", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
              />

              {tripType === "round-trip" && returnFlight && (
                <div className="mt-8 border-t pt-8">
                  <h2 className="text-xl font-semibold mb-4">{returnFlight.from} → {returnFlight.to} Seat Selection</h2>
                  <SeatMap
                    flightId={returnFlight._id}
                    passengers={passengers}
                    selectedSeats={returnSelectedSeats}
                    onSeatSelect={setReturnSelectedSeats}
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
              <h2 className="text-xl font-semibold mb-4">Review Booking</h2>
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
                        Seat: <strong>{selectedSeats[i] || "None"}</strong>
                        {tripType === "round-trip" && returnSelectedSeats[i] && ` | Return: ${returnSelectedSeats[i]}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Price Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Fare ({passengers.length} pax)</span>
                      <span>₹{flight.price * passengers.length}</span>
                    </div>
                    {tripType === "round-trip" && returnFlight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return Base Fare</span>
                        <span>₹{returnFlight.price * passengers.length}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span>₹{Math.round(flight.price * passengers.length * 0.18) + 199 * passengers.length}</span>
                    </div>
                    {tripType === "round-trip" && returnFlight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return Taxes & Fees</span>
                        <span>₹{Math.round(returnFlight.price * passengers.length * 0.18) + 199 * passengers.length}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
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
                  onClick={() => navigate("/flights")}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Book Another Flight
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
