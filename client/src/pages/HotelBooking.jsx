import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { createHotelBooking } from "../api/bookings";
import PaymentModal from "../components/PaymentModal";
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";
import toast from "react-hot-toast";

const HotelBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, room, searchParams } = location.state || {};

  const [guestDetails, setGuestDetails] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    countryCode: "+91",
  });
  const [promoCode, setPromoCode] = useState("TGHOTEL");
  const [selectedOffer, setSelectedOffer] = useState("TGHOTEL");
  const [hasInsurance, setHasInsurance] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [guestNames, setGuestNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState(null);
  const [showRooms, setShowRooms] = useState(true);
  const [showTaxes, setShowTaxes] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState([0]); // Default first room open, others closed
  const { formatPrice } = useGlobal();

  const toggleRoom = (idx) => {
    setExpandedRooms((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  useEffect(() => {
    if (!hotel || !room || !searchParams) {
      navigate("/hotels");
      return;
    }

    // Group guests by room and type based on searchParams.roomsData
    const roomsData = searchParams.roomsData || [
      { adults: searchParams.guests || 1, children: 0 },
    ];
    const initialGuests = [];

    roomsData.forEach((r, rIdx) => {
      // Add Adults
      for (let i = 0; i < r.adults; i++) {
        initialGuests.push({
          type: "Adult",
          index: i + 1,
          title: "Mr",
          firstName: "",
          lastName: "",
          roomIndex: rIdx,
        });
      }
      // Add Children
      for (let i = 0; i < (r.children || 0); i++) {
        initialGuests.push({
          type: "Child",
          index: i + 1,
          title: "Mstr",
          firstName: "",
          lastName: "",
          roomIndex: rIdx,
        });
      }
    });

    setGuestDetails(initialGuests);
  }, [hotel, room, searchParams, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
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
        guestNames: guestDetails.map(
          (g) => `${g.title} ${g.firstName} ${g.lastName}`,
        ),
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
  const nights =
    searchParams.checkIn && searchParams.checkOut
      ? Math.ceil(
          (new Date(searchParams.checkOut + "T12:00:00") -
            new Date(searchParams.checkIn + "T12:00:00")) /
            (1000 * 60 * 60 * 24),
        )
      : 1;

  const totalBase = calculateTotal();
  const taxAndCharges = Math.round(totalBase * 0.18); // 18% tax
  const discount =
    selectedOffer === "TGHOTEL" ? Math.round(totalBase * 0.15) : 0;
  const finalTotal =
    totalBase + taxAndCharges - discount + (hasInsurance ? 899 : 0);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
          {/* ── LEFT CONTENT: BOOKING FORM ── */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Review your Hotel details
            </h2>

            {/* 1. HOTEL SUMMARY CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-56 h-40 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={
                      hotel.images?.[0] ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=560"
                    }
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        {hotel.name}
                        <div className="flex shrink-0">
                          {Array.from({ length: hotel.starCategory || 4 }).map(
                            (_, i) => (
                              <FaStar
                                key={i}
                                className="text-yellow-400 w-3 h-3"
                              />
                            ),
                          )}
                        </div>
                      </h3>
                      <p className="text-[11px] font-bold text-blue-600 flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt /> {hotel.address || hotel.city}
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">
                      Non-Refundable
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6 py-4 border-y border-gray-50 bg-gray-50/50 rounded-lg px-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Check-In
                      </span>
                      <span className="text-[13px] font-black text-slate-800">
                        {new Date(searchParams.checkIn).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short" },
                        )}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                        {new Date(searchParams.checkIn).toLocaleDateString(
                          "en-IN",
                          { weekday: "short" },
                        )}
                        , 2:00 PM
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-x border-dashed border-gray-200 px-2">
                      <div className="h-px w-full bg-gray-200 relative">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[9px] font-black text-slate-500 whitespace-nowrap">
                          {nights} Night{nights > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Check-Out
                      </span>
                      <span className="text-[13px] font-black text-slate-800">
                        {new Date(searchParams.checkOut).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short" },
                        )}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                        {new Date(searchParams.checkOut).toLocaleDateString(
                          "en-IN",
                          { weekday: "short" },
                        )}
                        , 12:00 PM
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(-1)}
                      className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center justify-center gap-1"
                    >
                      Change Room
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Rooms & Guests
                      </p>
                      <p className="text-xs font-bold text-slate-800 uppercase">
                        {searchParams.rooms || 1} Room ·{" "}
                        {searchParams.guests || 1} Guest
                        {searchParams.guests > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button className="text-[10px] font-black text-blue-600 underline">
                        Essential info
                      </button>
                      <button className="text-[10px] font-black text-blue-600 underline">
                        Inclusions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. LOGIN BANNER */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-red-500">🏨</span>
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">
                    Log-in to your Raj Travel account
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Save more with our loyalty program and fast check-out
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Log In
                </button>
                <button className="bg-slate-800 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
                  Continue as Guest
                </button>
              </div>
            </div>

            {/* 3. TRAVELLER DETAILS */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Traveller Details
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#FFF8F0] border-l-4 border-[#F59E0B] p-4 flex gap-3">
                  <span className="text-[#F59E0B] text-lg font-bold shrink-0">
                    ⓘ
                  </span>
                  <p className="text-[11px] font-bold text-[#92400E] uppercase tracking-tight leading-relaxed">
                    Please make sure you enter the Name as per your Government
                    photo id.
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  {Array.from({ length: searchParams.rooms || 1 }).map(
                    (_, rIdx) => {
                      const isExpanded = expandedRooms.includes(rIdx);

                      return (
                        <div
                          key={rIdx}
                          className="space-y-4 rounded-xl border border-gray-100 overflow-hidden"
                        >
                          <div
                            className="bg-slate-50 p-4 border-b border-gray-100 flex items-center gap-2 cursor-pointer select-none transition-colors hover:bg-slate-100"
                            onClick={() => toggleRoom(rIdx)}
                          >
                            {isExpanded ? (
                              <FaChevronDown className="w-3 h-3 text-red-500 transition-transform duration-200" />
                            ) : (
                              <FaChevronRight className="w-3 h-3 text-red-500 transition-transform duration-200" />
                            )}
                            <h4 className="text-sm font-black text-red-600 tracking-wide">
                              Room {rIdx + 1}
                            </h4>
                          </div>

                          <div
                            className={`p-6 space-y-6 transition-all duration-300 ease-in-out ${isExpanded ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 py-0 overflow-hidden hidden"}`}
                          >
                            {guestDetails
                              .filter((g) => g.roomIndex === rIdx)
                              .map((guest, gIdx) => {
                                const actualIndex = guestDetails.indexOf(guest);
                                return (
                                  <div
                                    key={actualIndex}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                                  >
                                    <div className="col-span-2 hidden md:block pb-3">
                                      <span className="text-[12px] font-medium text-slate-500">
                                        {guest.type} {guest.index}
                                      </span>
                                    </div>

                                    <div className="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <div className="block md:hidden mb-2">
                                          <span className="text-[12px] font-bold text-slate-700">
                                            {guest.type} {guest.index}
                                          </span>
                                        </div>
                                        <select
                                          value={guest.title}
                                          onChange={(e) =>
                                            handleGuestChange(
                                              actualIndex,
                                              "title",
                                              e.target.value,
                                            )
                                          }
                                          className="w-full bg-white border border-gray-300 rounded-md text-sm p-2.5 outline-none focus:border-blue-500 transition-all text-gray-700"
                                        >
                                          {guest.type === "Adult" ? (
                                            <>
                                              <option value="Mr">Mr</option>
                                              <option value="Ms">Ms</option>
                                              <option value="Mrs">Mrs</option>
                                            </>
                                          ) : (
                                            <>
                                              <option value="Mstr">Mstr</option>
                                              <option value="Miss">Miss</option>
                                            </>
                                          )}
                                        </select>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          placeholder="First Name / Given Name"
                                          value={guest.firstName}
                                          onChange={(e) =>
                                            handleGuestChange(
                                              actualIndex,
                                              "firstName",
                                              e.target.value,
                                            )
                                          }
                                          className="w-full bg-white border border-gray-300 rounded-md text-sm p-2.5 outline-none focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-800"
                                        />
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          placeholder="Last Name / Surname"
                                          value={guest.lastName}
                                          onChange={(e) =>
                                            handleGuestChange(
                                              actualIndex,
                                              "lastName",
                                              e.target.value,
                                            )
                                          }
                                          className="w-full bg-white border border-gray-300 rounded-md text-sm p-2.5 outline-none focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-800"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    },
                  )}
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="saveTraveller"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="saveTraveller"
                      className="text-[11px] font-bold text-slate-600 uppercase tracking-tight"
                    >
                      Save Entire Traveller details
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. CONTACT INFORMATION */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Contact information
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">
                    Your ticket and hotels information will be sent here..
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <div className="w-24 bg-slate-50 border border-gray-200 rounded-l-lg p-3 flex items-center gap-2 cursor-pointer">
                        <img
                          src="https://flagcdn.com/in.svg"
                          alt="IN"
                          className="w-5 h-3 object-cover rounded shadow-sm"
                        />
                        <span className="text-xs font-black">
                          {contactInfo.countryCode}
                        </span>
                      </div>
                      <input
                        type="tel"
                        placeholder="81234 56789"
                        value={contactInfo.phone}
                        onChange={(e) =>
                          handleContactChange("phone", e.target.value)
                        }
                        className="flex-1 bg-white border border-l-0 border-gray-200 rounded-r-lg p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Email ID
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        handleContactChange("email", e.target.value)
                      }
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. TRAVEL SERVICES */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Travel services
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Save more by using our frequent travel service
                  </p>
                </div>
                <div className="p-6">
                  <div
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${hasInsurance ? "border-orange-400 bg-orange-50/30" : "border-gray-100"}`}
                    onClick={() => setHasInsurance(!hasInsurance)}
                  >
                    <input
                      type="checkbox"
                      checked={hasInsurance}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-gray-300 text-orange-400 focus:ring-orange-400"
                    />
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">
                        Domestic Travel Insurance
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Protect your trip starting at just ₹899
                      </p>
                    </div>
                    <span className="ml-auto text-sm font-black text-slate-800">
                      ₹899
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. ESSENTIAL INFO */}
            <div className="space-y-4 pb-20">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Essential Information
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 space-y-10">
                  <div>
                    <h4 className="text-[#FF4D42] text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                      Inclusions
                    </h4>
                    <div className="space-y-4">
                      <h5 className="text-[11px] font-black text-slate-900 uppercase">
                        ROOM 1
                      </h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                        {[
                          "Early check-in from 12 PM",
                          "Complimentary Wifi",
                          "Free Late Check-out",
                          "Room Only",
                        ].map((inc) => (
                          <li
                            key={inc}
                            className="flex items-center gap-2 text-[11px] font-medium text-slate-500 uppercase tracking-tight"
                          >
                            <span className="w-1 h-3 bg-slate-200 rounded-full" />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50">
                    <h4 className="text-blue-900 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                      Hotel Policy
                    </h4>
                    <div className="space-y-4 text-[10px] font-medium text-slate-500 uppercase tracking-tight leading-relaxed max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                      <p>
                        Guests below 18 years of age NOT allowed Children
                        allowed Unmarried couples are allowed Bachelors are
                        allowed
                      </p>
                      <p>
                        Alcohol consumption NOT allowed within the premises Food
                        from outside NOT allowed within the premises Private
                        parties or events are allowed at the property
                      </p>
                      <p>
                        Aadhar, Passport and Drivers License are acceptable ID
                        Proofs Certain hotels may have mandatory gala dinner
                        charges for Christmas and New Year's Eve, which, if
                        applicable, are payable directly at the property during
                        check-in.
                      </p>
                      <p>
                        Government aligned quarantine protocol being followed
                        Property staff understands all hygiene guidelines All
                        common areas are fully sanitized regularly All rooms are
                        fully sanitized between two stays Guests who have fever
                        are not allowed Guests required to have Arogya Setu app
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-50">
                    <h4 className="text-blue-900 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                      Checkin Special Instructions
                    </h4>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight leading-relaxed">
                      These additional charge are not included in the booking
                      amount and will be collected directly at the hotel. Extra
                      beds for additional adults are subject to availability at
                      the hotel and may be chargeable. During Christmas, New
                      Year, or festive seasons, hotels may collect Gala Meal
                      charges at check-in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* 7. PROCEED BUTTON (MOVED TO BOTTOM OF MAIN COLUMN) */}
            <div className="pt-8">
              {error && (
                <p className="text-red-600 text-center text-sm mb-4">{error}</p>
              )}
              <button
                onClick={handleToPayment}
                disabled={loading}
                className="w-full py-5 bg-[#FF4D42] hover:bg-[#E63930] text-white text-base font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR: FARE SUMMARY & PROMO ── */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            {/* 1. FARE SUMMARY */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-[#F8FAFC]">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  Fare Summary
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div
                  className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase cursor-pointer"
                  onClick={() => setShowRooms(!showRooms)}
                >
                  <div className="flex items-center gap-2">
                    {showRooms ? (
                      <FaChevronDown className="w-3 h-3 text-slate-300" />
                    ) : (
                      <FaChevronRight className="w-3 h-3 text-slate-300" />
                    )}
                    <span>Room Rates</span>
                  </div>
                  <span>₹{totalBase.toLocaleString("en-IN")}</span>
                </div>
                {showRooms &&
                  Array.from({ length: searchParams.rooms || 1 }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="pl-5 flex items-center justify-between text-[11px] text-slate-400"
                      >
                        <span>Room {idx + 1}</span>
                        <span>
                          ₹
                          {(
                            totalBase / (searchParams.rooms || 1)
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ),
                  )}

                <div
                  className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase cursor-pointer"
                  onClick={() => setShowTaxes(!showTaxes)}
                >
                  <div className="flex items-center gap-2">
                    {showTaxes ? (
                      <FaChevronDown className="w-3 h-3 text-slate-300" />
                    ) : (
                      <FaChevronRight className="w-3 h-3 text-slate-300" />
                    )}
                    <span>Tax & Charges</span>
                  </div>
                  <span>₹{taxAndCharges.toLocaleString("en-IN")}</span>
                </div>
                {showTaxes && (
                  <div className="pl-5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>GST (18%)</span>
                    <span>₹{taxAndCharges.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase text-green-600">
                  <div className="flex items-center gap-2">
                    <FaChevronRight className="w-3 h-3 opacity-0" />
                    <span>Discount</span>
                  </div>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>

                {hasInsurance && (
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase">
                    <div className="flex items-center gap-2">
                      <FaChevronRight className="w-3 h-3 text-slate-300" />
                      <span>Travel Insurance</span>
                    </div>
                    <span>₹899</span>
                  </div>
                )}

                <div className="pt-6 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-800 uppercase tracking-tighter">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. PROMO CODE */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">
                  Promo code
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Apply Promo Code
                  </label>
                  <div className="flex relative items-center">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#DEE2E6] rounded-lg p-3 pr-12 text-xs font-black uppercase text-green-700 outline-none focus:ring-2 focus:ring-green-100 transition-all"
                    />
                    <button className="absolute right-1 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-100">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="mt-2 text-[10px] font-black text-green-600 uppercase leading-tight">
                      Your Promocode has been applied you've saved ₹
                      {discount.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-black text-slate-300">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span>OR</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                    Choose from the offers below
                  </p>
                  {[
                    {
                      id: "TGHOTEL",
                      title: "TGHOTEL",
                      desc: "Get up to 75% instant discount on your booking, T&C Apply",
                    },
                    {
                      id: "TG_OFFER40",
                      title: "TG_OFFER40",
                      desc: "Get Instant Discount up to 40% on domestic hotels with selected cards, T&C Apply",
                    },
                    {
                      id: "TGAUHOTEL",
                      title: "TGAUHOTEL",
                      desc: "Flat 12% deal applicable on AU Bank Credit/Debit Cards,T&C Apply.",
                    },
                    {
                      id: "TGDBSHOTEL",
                      title: "TGDBSHOTEL",
                      desc: "Flat 5% Offer applicable on DBS bank selected cards",
                    },
                  ].map((offer) => (
                    <label
                      key={offer.id}
                      className={`block p-4 rounded-xl border-2 transition-all cursor-pointer group hover:bg-slate-50 ${selectedOffer === offer.id ? "border-blue-400 bg-blue-50/20" : "border-slate-100"}`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          checked={selectedOffer === offer.id}
                          onChange={() => setSelectedOffer(offer.id)}
                          className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div>
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-1 group-hover:text-blue-600 transition-colors">
                            {offer.title}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase leading-snug">
                            {offer.desc}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {createdBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingId={createdBooking.id}
          bookingType="hotel"
          amount={finalTotal}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}

      {bookingRef && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-4">
              Your hotel booking has been confirmed.
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-6">
              Booking Reference:{" "}
              <span className="text-red-500">{bookingRef}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() =>
                  generateTicket(
                    {
                      ...createdBooking,
                      hotel: hotel,
                      room: room,
                      checkIn: searchParams.checkIn,
                      checkOut: searchParams.checkOut,
                      guests:
                        searchParams.guests ||
                        searchParams.adults + (searchParams.children || 0),
                      guestNames: guestDetails.map(
                        (g) => `${g.title} ${g.firstName} ${g.lastName}`,
                      ),
                    },
                    "hotel",
                  )
                }
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
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
        </div>
      )}
    </div>
  );
};

export default HotelBooking;
