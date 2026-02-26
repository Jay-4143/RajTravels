import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVisaById } from "../api/visaApi";
import { getDummyVisaData } from "../data/dummyVisaData";
import { FaShieldAlt, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

const VisaApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data State
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [visaType, setVisaType] = useState("");
  const [onwardDate, setOnwardDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState(1);

  // Traveller Details State
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [passportNo, setPassportNo] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  // Consents
  const [needGst, setNeedGst] = useState(false);
  const [acceptRules, setAcceptRules] = useState(true);

  // Payment & Document State
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [uploadedDocs, setUploadedDocs] = useState({
    passportFront: null,
    passportBack: null,
    photo: null,
    returnTicket: null,
  });

  useEffect(() => {
    let genericData = getDummyVisaData(id || "dubai");
    getVisaById(id)
      .then((res) => {
        if (res.success && res.data) {
          genericData = {
            ...genericData,
            ...res.data,
            country: res.data.country || genericData.country,
          };
        }
      })
      .catch(() => {})
      .finally(() => {
        setVisa(genericData);
        if (genericData.visaTypes && genericData.visaTypes.length > 0) {
          setVisaType(genericData.visaTypes[0].name);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );

  // Calculate Fares Based on Selection
  const baseFarePerPerson =
    parseFloat(
      (
        visa?.visaTypes?.find((v) => v.name === visaType)?.fees || "3499"
      ).replace(/[^0-9.]/g, ""),
    ) || 3499;
  const baseFareTotal = baseFarePerPerson * travellers;
  const taxAndSurcharges = Math.round(baseFareTotal * 0.18); // Dummy 18% tax
  const totalFare = baseFareTotal + taxAndSurcharges;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="min-h-screen bg-white font-sans pt-16">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-200">
        <h1 className="text-3xl font-medium text-gray-900">
          {visa?.country || "United Arab Emirates"} Visa Online
        </h1>

        <div className="flex flex-col items-end mt-4 md:mt-0">
          <div className="bg-[#00A99D] text-white text-sm font-bold px-4 py-2 relative">
            {/* Decorative triangle point on left */}
            <div className="absolute top-0 -left-3 w-0 h-0 border-t-[18px] border-t-transparent border-b-[18px] border-b-transparent border-r-[12px] border-r-[#00A99D]"></div>
            99.8% Visa Approval Rate
          </div>
          {/* Trust Badges Mock */}
          <div className="flex items-center gap-4 mt-2 opacity-70">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <FaShieldAlt /> IATA
            </span>
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <FaShieldAlt /> TAFI
            </span>
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <FaShieldAlt /> SecureTrust
            </span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-[#EEF2F6] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 md:gap-4 text-sm font-medium text-gray-600 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2 text-[#4C6498]">
            <span className="w-6 h-6 rounded-full bg-[#4C6498] text-white flex items-center justify-center text-xs">
              1
            </span>{" "}
            Itinerary
          </div>
          <span className="text-gray-400">&rarr;</span>
          <div className="flex items-center gap-2 text-[#4C6498]">
            <span className="w-6 h-6 rounded-full bg-[#4C6498] text-white flex items-center justify-center text-xs">
              2
            </span>{" "}
            Traveller Details
          </div>
          <span className="text-gray-400">&rarr;</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border border-gray-400 text-gray-500 flex items-center justify-center text-xs">
              3
            </span>{" "}
            Make Payment
          </div>
          <span className="text-gray-400">&rarr;</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full border border-gray-400 text-gray-500 flex items-center justify-center text-xs">
              4
            </span>{" "}
            Upload Documents
          </div>
        </div>
      </div>

      {/* Main Content split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column (Forms) */}
        <div className="lg:w-2/3 space-y-6">
          {/* Step 1: Itinerary */}
          <div className="bg-white border-t-4 border-[#4C6498] shadow-sm rounded-b-lg p-0 mb-8 border border-gray-200">
            <div className="bg-[#EEF2F6] px-6 py-4 flex items-center gap-4 border-b border-gray-200">
              <span className="w-8 h-8 rounded bg-[#4C6498] text-white flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-[#4C6498] font-medium text-lg">Itinerary</h2>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                  Visa Type
                </label>
                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                >
                  {visa?.visaTypes?.map((vt, i) => (
                    <option key={i} value={vt.name}>
                      {vt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                  Onward Date
                </label>
                <input
                  type="date"
                  value={onwardDate}
                  onChange={(e) => setOnwardDate(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                />
              </div>
              <div className="w-24">
                <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                  Travellers
                </label>
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Traveller Details */}
          <div className="bg-white border-t-4 border-[#4C6498] shadow-sm rounded-b-lg border border-gray-200">
            <div className="bg-[#EEF2F6] px-6 py-4 flex items-center gap-4 border-b border-gray-200">
              <span className="w-8 h-8 rounded bg-[#4C6498] text-white flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-[#4C6498] font-medium text-lg">
                Travellers Details
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left indicator */}
                <div className="md:w-32 flex flex-col items-start gap-2 pt-2 text-[#4C6498]">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <svg
                      xmlns="http://www.w3.org/-2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Primary Applicant</span>
                  </div>
                </div>

                {/* Right Inputs Form */}
                <div className="flex-1 space-y-6 overflow-hidden">
                  {/* Row 1: Name & DOB */}
                  <div className="flex flex-wrap lg:flex-nowrap gap-4 md:gap-6">
                    <div className="w-full sm:w-24 shrink-0">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Title
                      </label>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                      >
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Ms</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                      />
                    </div>
                    <div className="flex-[1.5] min-w-[180px]">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Date of Birth
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value)}
                          className="w-16 flex-1 border-b border-gray-300 py-2 outline-none text-gray-800 text-sm"
                        >
                          <option value="">Day</option>
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <select
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value)}
                          className="flex-2 border-b border-gray-300 py-2 outline-none text-gray-800 text-sm"
                        >
                          <option value="">Month</option>
                          {months.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <select
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value)}
                          className="w-20 flex-1 border-b border-gray-300 py-2 outline-none text-gray-800 text-sm"
                        >
                          <option value="">Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Nationality & Passport */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Indian"
                        className="w-full border-b border-dashed border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-solid focus:border-[#4C6498]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Passport No
                      </label>
                      <input
                        type="text"
                        value={passportNo}
                        onChange={(e) => setPassportNo(e.target.value)}
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm focus:border-[#4C6498]"
                      />
                    </div>
                    <div className="flex-1 hidden md:block"></div>{" "}
                    {/* Spacer to align visually */}
                  </div>

                  {/* Row 3: Contact details */}
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="9874563210"
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm font-bold focus:border-[#4C6498]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-[#4C6498] mb-1">
                        Email ID
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="asd@gmail.com"
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-800 text-sm font-bold focus:border-[#4C6498]"
                      />
                    </div>
                    <div className="flex-1 hidden md:block"></div>
                  </div>
                </div>
              </div>

              {/* Consents & Submit */}
              <div className="mt-12 space-y-6">
                <label className="flex items-center gap-2 cursor-pointer w-max">
                  <input
                    type="checkbox"
                    checked={needGst}
                    onChange={() => setNeedGst(!needGst)}
                    className="text-[#4C6498] focus:ring-[#4C6498] rounded w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    I need a business GST invoice
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-4 border-t border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptRules}
                      onChange={() => setAcceptRules(!acceptRules)}
                      className="text-[#4C6498] focus:ring-[#4C6498] rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-600">
                      I accept the rules of this trip
                    </span>
                  </label>

                  <button
                    className="bg-[#4271C2] hover:bg-[#345BA0] text-white font-bold tracking-wider rounded-full px-8 py-3 transition-colors shadow-sm disabled:opacity-50"
                    disabled={!acceptRules}
                    onClick={() => {
                      alert(
                        "This is a UI demonstration. Backend integration connects here.",
                      );
                    }}
                  >
                    CONTINUE
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Make Payment */}
          <div className="bg-white border-t-4 border-[#4C6498] shadow-sm rounded-b-lg border border-gray-200 mt-8">
            <div className="bg-[#EEF2F6] px-6 py-4 flex items-center gap-4 border-b border-gray-200">
              <span className="w-8 h-8 rounded bg-[#4C6498] text-white flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="text-[#4C6498] font-medium text-lg">
                Make Payment
              </h2>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              {/* Payment Methods Sidebar */}
              <div className="w-full md:w-1/3 border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className={`px-4 py-4 cursor-pointer font-semibold text-sm border-b border-gray-200 transition-colors ${
                    paymentMethod === "card"
                      ? "bg-[#EEF2F6] text-[#4C6498] border-l-4 border-l-[#4C6498]"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  Credit / Debit Card
                </div>
                <div
                  className={`px-4 py-4 cursor-pointer font-semibold text-sm border-b border-gray-200 transition-colors ${
                    paymentMethod === "upi"
                      ? "bg-[#EEF2F6] text-[#4C6498] border-l-4 border-l-[#4C6498]"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  UPI
                </div>
                <div
                  className={`px-4 py-4 cursor-pointer font-semibold text-sm transition-colors ${
                    paymentMethod === "netbanking"
                      ? "bg-[#EEF2F6] text-[#4C6498] border-l-4 border-l-[#4C6498]"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-l-4 border-l-transparent"
                  }`}
                  onClick={() => setPaymentMethod("netbanking")}
                >
                  Net Banking
                </div>
              </div>

              {/* Payment Details Area */}
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-6">
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 mb-4">
                      Enter Card Details
                    </h3>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#4C6498]"
                    />
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#4C6498]"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#4C6498]"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      className="w-full border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#4C6498]"
                    />
                  </div>
                )}
                {paymentMethod === "upi" && (
                  <div className="space-y-4 text-center py-6">
                    <p className="text-gray-600 mb-4 text-sm font-medium">
                      Enter your UPI ID to receive a payment request
                    </p>
                    <input
                      type="text"
                      placeholder="username@bank"
                      className="w-3/4 mx-auto border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#4C6498]"
                    />
                  </div>
                )}
                {paymentMethod === "netbanking" && (
                  <div className="space-y-4 text-center py-6">
                    <p className="text-gray-600 mb-4 text-sm font-medium">
                      Select your Bank
                    </p>
                    <select className="w-3/4 mx-auto border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#4C6498]">
                      <option>SBI</option>
                      <option>HDFC</option>
                      <option>ICICI</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button className="bg-[#4271C2] hover:bg-[#345BA0] text-white font-bold rounded px-8 py-2.5 transition-colors shadow-sm text-sm">
                    PAY ₹{totalFare.toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Upload Documents */}
          <div className="bg-white border-t-4 border-[#4C6498] shadow-sm rounded-b-lg border border-gray-200 mt-8 mb-8">
            <div className="bg-[#EEF2F6] px-6 py-4 flex items-center gap-4 border-b border-gray-200">
              <span className="w-8 h-8 rounded bg-[#4C6498] text-white flex items-center justify-center font-bold">
                4
              </span>
              <h2 className="text-[#4C6498] font-medium text-lg">
                Upload Documents
              </h2>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-sm font-medium text-gray-600 mb-6">
                Please upload clear, scanned copies of the required documents
                for Primary Applicant.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: "passportFront",
                    label: "Passport Front Page",
                    desc: "Max size 2MB (JPG, PNG, PDF)",
                  },
                  {
                    id: "passportBack",
                    label: "Passport Back Page",
                    desc: "Max size 2MB (JPG, PNG, PDF)",
                  },
                  {
                    id: "photo",
                    label: "Passport Size Photograph",
                    desc: "White background, max size 2MB",
                  },
                  {
                    id: "returnTicket",
                    label: "Confirmed Return Ticket",
                    desc: "Max size 5MB (PDF)",
                  },
                ].map((doc) => (
                  <div
                    key={doc.id}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#4C6498] transition-colors bg-gray-50 hover:bg-[#f8faff] cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8 text-[#4C6498] mb-3 opacity-70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">
                      {doc.label}
                    </h4>
                    <span className="text-xs text-gray-500 mb-3">
                      {doc.desc}
                    </span>
                    <button className="text-[#4C6498] font-semibold text-xs border border-[#4C6498] rounded px-4 py-1.5 hover:bg-[#4C6498] hover:text-white transition-colors">
                      Select File
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button className="bg-[#00A99D] hover:bg-[#009287] text-white font-bold tracking-wider rounded-full px-8 py-3 transition-colors shadow-sm">
                  SUBMIT APPLICATION
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Fare Details) */}
        </div>
        <div className="lg:w-1/3">
          <div className="bg-[#EEF2F6] p-6 sticky top-24 rounded-sm border border-gray-200">
            <h3 className="text-[#4C6498] text-lg font-medium mb-6">
              Fare Details
            </h3>

            <div className="space-y-4 text-sm text-[#4C6498] font-medium">
              <div className="flex justify-between">
                <span>Base Fare</span>
                <span>₹{baseFareTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Surcharges & Taxes</span>
                <span>₹{taxAndSurcharges.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300">
              <span className="text-gray-900 font-bold">Total</span>
              <span className="text-xl font-black text-gray-900">
                ₹{totalFare.toFixed(2)}
              </span>
            </div>

            <div className="text-right mt-2">
              <a
                href="#"
                className="text-[#2F80ED] text-xs font-bold hover:underline"
              >
                Fare BreakUp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaApplication;
