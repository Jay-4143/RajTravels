import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createFlightBooking } from "../api/bookings";
import SeatMap from "../components/SeatMap";
import PaymentModal from "../components/PaymentModal";
import { useGlobal } from "../context/GlobalContext";
import { validateField } from "../utils/validationRules";
import { generateTicket } from "../utils/TicketGenerator";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";

// Redesign Components
import FlightSummaryCard from "../components/booking/FlightSummaryCard";
import RefundTimeline from "../components/booking/RefundTimeline";
import { RefundableUpsell, InsuranceUpsell, BaggageProtectionUpsell } from "../components/booking/UpsellSections";
import TravellerDetailsForm from "../components/booking/TravellerDetailsForm";
import ContactInfoForm from "../components/booking/ContactInfoForm";
import FareSidebar from "../components/booking/FareSidebar";
import AddonServices from "../components/booking/AddonServices";
import PromoSidebar from "../components/booking/PromoSidebar";

/* Fare Discount Config */
const FARE_DISCOUNTS = {
  student: { label: "Student Fare", discount: 0.05, icon: "🎓" },
  defence: { label: "Defence Fare", discount: 0.04, icon: "🎖️" },
  senior: { label: "Senior Citizen Fare", discount: 0.06, icon: "👴" },
};

const getFareDiscount = (price, specialFare) => {
  if (!specialFare || !FARE_DISCOUNTS[specialFare]) return 0;
  return Math.round(price * FARE_DISCOUNTS[specialFare].discount);
};

const FlightBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, returnFlight, searchParams, tripType } = location.state || {};

  const [step, setStep] = useState(1); // 1: Review & Info, 2: Addon Services, 3: Success
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedBaggage, setSelectedBaggage] = useState([]);
  const [activeAddonTab, setActiveAddonTab] = useState('meals');

  // New States for Redesign
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [insuranceSelected, setInsuranceSelected] = useState(null); // null means not selected yet
  const [baggageSelected, setBaggageSelected] = useState(false);
  const [refundableSelected, setRefundableSelected] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [useGstin, setUseGstin] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstHolderName, setGstHolderName] = useState("");
  const [gstAddress, setGstAddress] = useState("");
  const [gstPincode, setGstPincode] = useState("");
  const [saveGst, setSaveGst] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

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
      // If data is missing, the error UI below will handle it
      console.warn("[FlightBooking] Missing flight or searchParams in location.state");
      return;
    }

    // Initialize passengers list if not already done
    if (passengers.length === 0) {
      const adults = parseInt(searchParams.adults) || 1;
      const children = parseInt(searchParams.children) || 0;
      const infants = parseInt(searchParams.infants) || 0;

      const initialPassengers = [];
      for (let i = 0; i < adults; i++) initialPassengers.push({ type: 'Adult', title: '', firstName: '', lastName: '', age: 25 });
      for (let i = 0; i < children; i++) initialPassengers.push({ type: 'Child', title: '', firstName: '', lastName: '', age: 10 });
      for (let i = 0; i < infants; i++) initialPassengers.push({ type: 'Infant', title: '', firstName: '', lastName: '', age: 1 });

      setPassengers(initialPassengers);
    }
  }, [flight, searchParams, passengers.length]);

  const formatTime = (date) => {
    if (!date) return "--";
    const d = new Date(date);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  /* Total Calculation */
  const calculateTotal = () => {
    if (!flight) return 0;
    const passengersCount = passengers.length || 1;
    let total = flight.price * passengersCount;

    if (tripType === "round-trip" && returnFlight) {
      total += returnFlight.price * passengersCount;
    }

    // Fare Discount
    if (searchParams?.specialFare) {
      total -= getFareDiscount(flight.price, searchParams.specialFare) * passengersCount;
      if (tripType === "round-trip" && returnFlight) {
        total -= getFareDiscount(returnFlight.price, searchParams.specialFare) * passengersCount;
      }
    }

    // Seat Premium
    if (!isAutoSelect) {
      total += selectedSeats.reduce((sum, s) => sum + (s.includes('A') || s.includes('F') ? 499 : (s.includes('C') || s.includes('D') ? 299 : 99)), 0);
    }
    if (tripType === "round-trip" && returnFlight && !isReturnAutoSelect) {
      total += returnSelectedSeats.reduce((sum, s) => sum + (s.includes('A') || s.includes('F') ? 499 : (s.includes('C') || s.includes('D') ? 299 : 99)), 0);
    }

    // Upsells
    if (insuranceSelected) total += (199 * passengersCount);
    if (baggageSelected) total += (95 * passengersCount);
    if (refundableSelected) total += Math.round(flight.price * 0.1) * passengersCount;

    // Meals & Baggage Addons
    total += selectedMeals.reduce((sum, m) => sum + m.price, 0);
    total += selectedBaggage.reduce((sum, b) => sum + b.price, 0);

    // Taxes & Fees
    const taxes = Math.round((flight.price * passengersCount) * 0.15);
    const fees = 199 * passengersCount;

    // Promo Discount
    const promoDiscount = selectedPromo ? selectedPromo.discount : 0;

    return Math.round(total + taxes + fees - promoDiscount);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: field === "age" ? Number(value) : value };
    setPassengers(updated);
  };


  const handleMealSelect = (meal) => {
    setSelectedMeals(prev =>
      prev.find(m => m.id === meal.id)
        ? prev.filter(m => m.id !== meal.id)
        : [...prev, meal]
    );
  };

  const handleBaggageSelect = (item) => {
    setSelectedBaggage(prev =>
      prev.find(b => b.id === item.id)
        ? prev.filter(b => b.id !== item.id)
        : [...prev, item]
    );
  };

  const handleDetailsSubmit = () => {
    // Comprehensive Frontend Validation
    const errors = {};

    // 1. Validate Passengers
    passengers.forEach((p, i) => {
      const fNameErr = validateField('firstName', p.firstName);
      if (fNameErr) errors[`p${i}_firstName`] = fNameErr;

      const lNameErr = validateField('lastName', p.lastName);
      if (lNameErr) errors[`p${i}_lastName`] = lNameErr;

      if (!p.title) errors[`p${i}_title`] = "Title is required";
      if (p.type !== 'Adult' && !p.dob) errors[`p${i}_dob`] = "DOB is required";
    });

    // 2. Lead Passenger ID Validation (if Adult)
    const leadPassenger = passengers.find(p => p.type === 'Adult');
    if (leadPassenger && leadPassenger.idType) {
      const idErr = validateField('idNumber', leadPassenger.idNumber, leadPassenger.idType);
      if (idErr) errors.idNumber = idErr;
    } else if (leadPassenger && !leadPassenger.idType) {
      // ID type not selected, but maybe not strictly required unless user interacts
    }

    // 3. Contact Info Validation
    const mobileErr = validateField('mobile', mobile);
    if (mobileErr) errors.mobile = mobileErr;

    const emailErr = validateField('email', email);
    if (emailErr) errors.email = emailErr;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please correct the highlighted errors in the form.');
      return;
    }

    if (insuranceSelected === null) {
      toast.error('Please select an insurance option (Yes or No).');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleAddonsComplete = () => {
    if (!isAutoSelect && selectedSeats.length !== passengers.length && passengers.length > 0) {
      toast.error(`Please select ${passengers.length} seats or choose Auto-select.`);
      setActiveAddonTab('seats');
      return;
    }
    handlePayment();
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
          name: `${p.title} ${p.firstName} ${p.lastName}`,
          age: p.age || 25,
          dob: p.dob || null,
          type: p.type,
          seat: isAutoSelect ? "Auto-selected" : selectedSeats[i]
        })),
        seats: isAutoSelect ? passengers.map(() => "Auto") : selectedSeats,
        tripType: tripType || "one-way",
        flightDetails: flight,
        addons: [
          ...selectedMeals.map(m => ({ name: m.name, price: m.price, category: 'meal' })),
          ...selectedBaggage.map(b => ({ name: b.name, price: b.price, category: 'baggage' })),
          ...selectedSeats.map(s => ({ name: `Seat ${s}`, price: (s.includes('A') || s.includes('F') ? 499 : 299), category: 'seat' }))
        ],
        contact: { mobile, email }
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
    setStep(3);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    console.log("[FlightBooking] Component Mount. State:", location.state);
    if (!flight || !searchParams) {
      console.warn("[FlightBooking] Missing flight or searchParams. Redirecting...");
      // navigate("/flights"); // Commented out to see the error UI instead during debugging
    }
  }, [flight, searchParams, location.state]);

  if (!flight || !searchParams) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">We couldn't retrieve your flight selection details. Please try searching again.</p>
          <button
            onClick={() => navigate("/flights")}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
          <pre className="mt-4 p-2 bg-gray-50 text-[10px] text-left overflow-auto max-h-40">
            {JSON.stringify({ hasFlight: !!flight, hasParams: !!searchParams, stateKeys: location.state ? Object.keys(location.state) : 'no-state' }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {(step === 1 || step === 2) && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {step === 1 ? "Review your flight details" : "Addon Services"}
                </h1>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => step === 1 ? navigate("/flights", { state: searchParams }) : setStep(1)}
                    className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase hover:text-blue-600 transition-colors"
                  >
                    <FaChevronLeft className="w-2.5 h-2.5" /> Back to {step === 1 ? "Search" : "Details"}
                  </button>
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <FlightSummaryCard flight={flight} searchParams={searchParams} />

                  {tripType === "round-trip" && returnFlight && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-tight">Return Flight</h3>
                      <FlightSummaryCard flight={returnFlight} searchParams={searchParams} />
                    </div>
                  )}

                  <RefundTimeline price={flight.price} />

                  <RefundableUpsell
                    price={flight.price}
                    isSelected={refundableSelected}
                    onSelect={() => setRefundableSelected(!refundableSelected)}
                  />

                  <InsuranceUpsell
                    isSelected={insuranceSelected}
                    onSelect={setInsuranceSelected}
                  />

                  <BaggageProtectionUpsell
                    isSelected={baggageSelected}
                    onSelect={setBaggageSelected}
                  />

                  <TravellerDetailsForm
                    passengers={passengers}
                    onPassengerChange={handlePassengerChange}
                    errors={fieldErrors}
                  />

                  <ContactInfoForm
                    mobile={mobile}
                    email={email}
                    onMobileChange={setMobile}
                    onEmailChange={setEmail}
                    useGstin={useGstin}
                    onUseGstinToggle={setUseGstin}
                    gstin={gstin}
                    onGstinChange={setGstin}
                    gstHolderName={gstHolderName}
                    onGstHolderNameChange={setGstHolderName}
                    gstAddress={gstAddress}
                    onGstAddressChange={setGstAddress}
                    gstPincode={gstPincode}
                    onGstPincodeChange={setGstPincode}
                    saveGst={saveGst}
                    onSaveGstToggle={setSaveGst}
                    errors={fieldErrors}
                  />

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-end">
                    <button
                      onClick={handleDetailsSubmit}
                      className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <AddonServices
                    activeTab={activeAddonTab}
                    setActiveTab={setActiveAddonTab}
                    selectedMeals={selectedMeals.map(m => m.id)}
                    onMealSelect={handleMealSelect}
                    selectedBaggage={selectedBaggage.map(b => b.id)}
                    onBaggageSelect={handleBaggageSelect}
                    flight={flight}
                    passengers={passengers}
                    selectedSeats={selectedSeats}
                    onSeatSelect={setSelectedSeats}
                    isAutoSelect={isAutoSelect}
                    setIsAutoSelect={setIsAutoSelect}
                  />

                  {/* Redesigned Footer matching image */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex items-center justify-between -mx-4 px-8 mt-12 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-[60]">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">
                        ₹{calculateTotal().toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-8">
                      <button
                        onClick={() => setActiveAddonTab('seats')}
                        className="text-xs font-black text-slate-800 uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-blue-600 transition-colors"
                      >
                        Skip Addons
                      </button>
                      <button
                        onClick={handleAddonsComplete}
                        className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with original order and improved vertical separation */}
            <aside className="w-80 flex-shrink-0 sticky top-24 self-start flex flex-col gap-8">
              <FareSidebar
                flight={flight}
                searchParams={searchParams}
                passengersCount={passengers.length}
                selectedPromo={selectedPromo}
                onPromoSelect={setSelectedPromo}
                insuranceSelected={insuranceSelected}
                baggageSelected={baggageSelected}
                refundableSelected={refundableSelected}
                addonsTotal={selectedMeals.reduce((sum, m) => sum + m.price, 0) + selectedBaggage.reduce((sum, b) => sum + b.price, 0)}
              />
              <PromoSidebar
                selectedPromo={selectedPromo}
                onPromoSelect={setSelectedPromo}
              />
            </aside>
          </div>
        )}


        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Booking Confirmed!</h2>
            <p className="text-gray-500 font-medium mb-8">Your flight ticket has been successfully booked and sent to your email.</p>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Booking Reference</p>
              <p className="text-2xl font-black text-red-500 tracking-tighter">{bookingRef}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => generateTicket({
                  ...createdBooking,
                  flightDetails: flight,
                  passengers: passengers.map((p, i) => ({
                    name: `${p.title} ${p.firstName} ${p.lastName}`,
                    age: p.age || 25,
                    seatNumber: isAutoSelect ? "Auto-selected" : selectedSeats[i]
                  })),
                  addons: [
                    ...selectedMeals,
                    ...selectedBaggage,
                    ...selectedSeats.map(s => ({ name: `Seat ${s}`, price: 499 }))
                  ],
                  tripType: tripType
                }, 'flight')}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Ticket
              </button>
              <button
                type="button"
                onClick={() => navigate("/flights")}
                className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all active:scale-95"
              >
                Book Another Flight
              </button>
            </div>
          </div>
        )}
      </div>

      {createdBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingId={createdBooking.id}
          bookingType="flight"
          amount={calculateTotal()}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default FlightBooking;
