import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVisaById } from "../api/visaApi";
import { getDummyVisaData } from "../data/dummyVisaData";
import VisaTeam from "../components/visa/VisaTeam";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaPhoneAlt,
  FaWhatsapp,
  FaClock,
  FaCheck,
  FaInfoCircle,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";

const VisaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // We try to fetch from API, but if it fails or returns generic data, we merge with our dummy rich data
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Types Of Visas");

  // Form States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedVisaType, setSelectedVisaType] = useState("");
  const [travellers, setTravellers] = useState(1);
  const [expandedVisitUs, setExpandedVisitUs] = useState("Mumbai");

  useEffect(() => {
    // Load the dummy rich layout data based on the ID. If it's a valid ID it might fall to the generic dummy data
    // which is still visually rich.
    // In a real scenario we merge API response with our rich layout requirements.

    let genericData = getDummyVisaData(id);

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
      .catch(() => {
        // Ignore API failure, stick to dummy data
      })
      .finally(() => {
        setVisa(genericData);
        if (genericData.visaTypes && genericData.visaTypes.length > 0) {
          setSelectedVisaType(genericData.visaTypes[0].name);
        }
        setLoading(false);
      });
  }, [id]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId.replace(/ /g, ""));
    if (element) {
      const yOffset = -120; // header height offset
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  if (!visa)
    return <div className="text-center py-12 pt-32">Visa not found</div>;

  const tabs = [
    "Types Of Visas",
    "Documents",
    "Process",
    "Why Choose Us",
    "FAQs",
    "Reviews",
    "Embassy",
    "Visit Us",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {/* HER0 SECTION */}
      <div className="relative h-[480px] w-full pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={visa.heroImage}
            alt={visa.country}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-sm font-medium text-blue-600 mb-4 flex gap-2">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Home
            </span>{" "}
            &rsaquo;
            <span
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/visa")}
            >
              Visa
            </span>{" "}
            &rsaquo;
            <span className="text-gray-500">{visa.country} Visa</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 drop-shadow-sm">
            {visa.title}
          </h1>

          <div className="bg-[#00A99D] text-white text-sm font-bold px-4 py-2 rounded-r-full inline-flex items-center gap-2 mb-8 w-max shadow-md relative -left-4 pl-8">
            <FaCheckCircle className="text-yellow-300" />
            {visa.approvalRate}
          </div>

          <div className="flex flex-wrap gap-12 mb-8">
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-1">
                Processing time
              </p>
              <p className="text-2xl font-black text-gray-900">
                {visa.processingTime}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-1">
                Starting from
              </p>
              <p className="text-2xl font-black text-gray-900">
                {visa.startingPrice}
              </p>
            </div>
          </div>

          <div className="bg-[#6B1B54] text-white text-sm font-bold px-6 py-3 rounded-full inline-flex items-center gap-3 w-max shadow-lg">
            <div className="bg-white/20 p-1.5 rounded-full">
              <FaCheckCircle className="text-white" />
            </div>
            {visa.agentBadge}
          </div>
        </div>
      </div>

      {/* STICKY NAV */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => scrollToSection(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === tab
                  ? "border-[#003B95] text-[#003B95]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* LEFT SIDE: DETAILS */}
        <div className="lg:w-2/3 space-y-12">
          {/* Refund Banner */}
          <div className="bg-gradient-to-r from-[#8B9FF7] to-[#6A85F1] text-white rounded-xl p-4 flex items-center justify-center gap-3 shadow-md">
            <div className="bg-white rounded-full p-1.5 shadow-inner">
              <FaCheckCircle className="text-[#FBBF24] w-6 h-6 border-2 border-[#F59E0B] rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-wide">
              Guaranteed 100% fee refund if Visa Rejected ✨
            </span>
          </div>

          {/* Visa Types */}
          <div id="TypesOfVisas" className="scroll-mt-32">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Types of {visa.country} Visas for Indians
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visa.visaTypes?.map((vt, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1 duration-300 relative group cursor-pointer"
                  onClick={() => setSelectedVisaType(vt.name)}
                >
                  <div className="bg-[#E6F0FA] p-4 group-hover:bg-[#D5E6FA] transition-colors relative h-20">
                    <h3 className="font-bold text-gray-900 pr-16">{vt.name}</h3>
                    {vt.subtext && (
                      <p className="text-xs text-gray-600 mt-1 font-semibold">
                        {vt.subtext}
                      </p>
                    )}
                    {vt.popular && (
                      <div className="absolute left-0 bottom-0 bg-[#A62626] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-tr-lg">
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Processing time:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {vt.processing}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Stay period:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {vt.stay}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Validity:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {vt.validity}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Entry:</span>
                      <span className="text-gray-900 font-semibold">
                        {vt.entry}
                      </span>
                    </div>
                    <div className="flex justify-between text-[15px] pt-3 border-t border-gray-100">
                      <span className="text-gray-500 font-medium">Fees:</span>
                      <span className="text-[#003B95] font-black">
                        {vt.fees}
                      </span>
                    </div>
                  </div>
                  {selectedVisaType === vt.name && (
                    <div className="absolute top-4 right-4 text-[#003B95]">
                      <FaCheckCircle className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div id="Documents" className="scroll-mt-32">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Documents Required for {visa.country} Visa for Indians
            </h2>
            <div className="bg-[#FDE6A4] rounded-xl p-6 shadow-sm border border-[#FCD34D]">
              <div className="flex justify-between items-center mb-4 cursor-pointer">
                <h3 className="text-[#92400E] font-bold text-lg">
                  Must have Documents for {visa.country} Entry Visa:
                </h3>
                <FaChevronUp className="text-[#92400E]" />
              </div>
              <ul className="space-y-4">
                {visa.documents?.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0"></div>
                    <span className="text-[#92400E] font-medium leading-relaxed">
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Process */}
          <div
            id="Process"
            className="scroll-mt-32 bg-[#D19A6A] p-10 rounded-2xl relative overflow-hidden text-center text-white"
          >
            {/* A very rough process UI matching the screenshot */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-12">
                Applying for {visa.country} Tourist Visa through us is easy
              </h2>
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                {/* Line connecting them */}
                <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-1 bg-white/30 z-0 rounded-full"></div>

                {[
                  {
                    step: 1,
                    icon: "💳",
                    title: "Make a secure online payment",
                  },
                  { step: 2, icon: "📁", title: "Upload your documents" },
                  {
                    step: 3,
                    icon: "✅",
                    title: "We verify and submit your application",
                  },
                  {
                    step: 4,
                    icon: "📧",
                    title: `Receive your ${visa.country} Tourist Visa by Email`,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center relative z-10 w-full md:w-1/4"
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl flex flex-col items-center justify-center mb-4 text-3xl">
                      {item.icon}
                    </div>
                    <div className="w-4 h-4 rounded-full bg-white shadow-md mb-4 border-[3px] border-[#D19A6A]"></div>
                    <p className="font-semibold text-sm px-2 text-white/90 drop-shadow-sm">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div id="WhyChooseUs" className="scroll-mt-32">
            <h2 className="text-2xl font-black text-gray-900 mb-8">
              Why choose us? Because we are Awesome!
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              {visa.whyChooseUs?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                    {item.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div id="FAQs" className="scroll-mt-32">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              {visa.country} Visa FAQs
            </h2>
            <div className="space-y-3">
              {visa.faqs?.map((faq, idx) => (
                <details key={idx} className="group bg-[#EAF5F8] rounded-lg">
                  <summary className="flex justify-between items-center font-bold text-gray-800 cursor-pointer list-none p-5">
                    <span className="flex gap-4 items-center">
                      <span className="text-2xl font-light text-gray-400 group-open:hidden">
                        +
                      </span>
                      <span className="text-2xl font-light text-gray-400 hidden group-open:block">
                        -
                      </span>
                      {faq.q}
                    </span>
                  </summary>
                  <div className="text-gray-600 px-5 pb-5 pt-0 ml-7 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div id="Reviews" className="scroll-mt-32 border-t border-gray-100 pt-12 mt-12">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="w-32 h-28 bg-[#333333] rounded-lg flex flex-col items-center justify-center p-2 relative text-center shadow-lg border-b-4 border-orange-500 shrink-0">
                <div className="flex text-yellow-400 text-sm mb-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <div className="text-white font-black leading-tight text-sm tracking-wide">BEST<br />CHOICE</div>
                <div className="absolute -bottom-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 tracking-widest uppercase shadow-sm">GUARANTEED</div>
              </div>
              <div className="pt-2">
                <h2 className="text-3xl font-black text-[#1a2b49] mb-3">Raj Travels - Reviews</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#003B95] font-black text-xl">EXCELLENT</span>
                  <div className="flex text-yellow-400 text-xl">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                  </div>
                  <span className="text-gray-600 font-bold text-lg">821 reviews on</span>
                  <span className="font-bold text-xl tracking-tight"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Review 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?img=1" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" alt="user" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">Nupur Sawant</h4>
                        <FaCheckCircle className="text-green-500 text-sm" />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">2 months ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm"><FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt /></div>
                    <span className="font-bold text-lg leading-none ml-1"><span className="text-blue-500">G</span></span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Got my Thailand visa within 5 days. It was much before than I expected. Thanks a lot for your prompt service. We appreciate your efforts and the personal attention. Wish you good luck.</p>
              </div>

              {/* Review 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?img=5" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" alt="user" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">Dr Poonam Bharti</h4>
                        <FaCheckCircle className="text-green-500 text-sm" />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">1 months ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                    <span className="font-bold text-lg leading-none ml-1"><span className="text-blue-500">G</span></span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">I have processed visas thrice through Raj Travels. Acknowledge the efficient and prompt service by the customer support team. Got the Dubai visas way before the expected time.</p>
              </div>

              {/* Review 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?img=11" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" alt="user" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">Mayur Waman</h4>
                        <FaCheckCircle className="text-green-500 text-sm" />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400 text-sm"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                    <span className="font-bold text-lg leading-none ml-1"><span className="text-blue-500">G</span></span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Thank you for the smooth and hassle free visa application for Singapore. Very happy with the service, I will definitely recommend your service to my friends and colleagues.</p>
              </div>
            </div>
          </div>

          {/* Visit Us & Embassy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-12 mt-12 pb-12">
            {/* Visit Us */}
            <div id="VisitUs" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Visit us</h2>
              <div className="flex flex-col gap-3">
                {["Mumbai", "Delhi", "Chennai"].map((city) => (
                  <div key={city} className="rounded-lg overflow-hidden border border-blue-100 shadow-sm">
                    <button
                      onClick={() => setExpandedVisitUs(expandedVisitUs === city ? "" : city)}
                      className={`w-full text-left px-5 py-4 font-bold flex items-center gap-3 transition-colors ${expandedVisitUs === city ? 'bg-[#EAF5F8] text-[#003B95]' : 'bg-[#EAF5F8] text-gray-800 hover:bg-[#dcedf2]'}`}
                    >
                      <span className="text-xl font-light w-4 flex justify-center">{expandedVisitUs === city ? '-' : '+'}</span>
                      {city}
                    </button>
                    {expandedVisitUs === city && (
                      <div className="p-5 bg-white text-sm text-gray-600 leading-relaxed border-t border-blue-100 font-medium">
                        Raj Travels of India Pvt Ltd.<br />
                        {city === "Mumbai" && "Raj Travels Bhavan, 69-71 Janjikar Street, Near Crawford Market, Mumbai 400003"}
                        {city === "Delhi" && "Raj Travels Bhavan, 1st Floor, Connaught Place, New Delhi 110001"}
                        {city === "Chennai" && "Raj Travels Bhavan, Mount Road, Chennai 600002"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Embassy */}
            <div id="Embassy" className="scroll-mt-32">
              <h2 className="text-2xl font-black text-gray-900 mb-6">{visa.country} Embassy</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm min-h-[140px]">
                <p className="text-gray-600 text-[15px] leading-8 font-medium">
                  A16/1 Vasant Vihar<br />
                  New Delhi 110057<br />
                  India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SIDEBAR FORM */}
        <div className="lg:w-1/3">
          <div className="sticky top-40 space-y-6">
            {/* Application Form */}
            <div className="bg-[#0082A8] rounded-xl overflow-hidden shadow-xl">
              <div className="bg-[#FDE6A4] text-[#92400E] p-3 text-center text-xs font-bold font-sans flex items-center justify-center gap-2 m-4 rounded-md">
                <FaClock className="text-lg" />
                It takes less than 2 minutes to Apply
              </div>

              <div className="bg-white m-4 rounded-lg p-6 space-y-5">
                <div className="flex justify-between items-center text-[#003B95] font-black pb-4 border-b border-gray-100">
                  <span className="text-lg">Apply Online</span>
                  <span>—</span>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b-2 border-gray-200 py-2 pt-4 px-1 text-sm font-semibold outline-none focus:border-[#0082A8] transition-colors placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Contact No"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-b-2 border-gray-200 py-2 px-1 text-sm font-semibold outline-none focus:border-[#0082A8] transition-colors placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <select
                    value={selectedVisaType}
                    onChange={(e) => setSelectedVisaType(e.target.value)}
                    className="w-full border-b-2 border-gray-200 py-2 px-1 text-sm font-semibold text-gray-700 outline-none focus:border-[#0082A8] transition-colors bg-transparent appearance-none"
                  >
                    <option value="" disabled>
                      Visa type
                    </option>
                    {visa.visaTypes?.map((vt, i) => (
                      <option key={i} value={vt.name}>
                        {vt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={travellers}
                    onChange={(e) => setTravellers(Number(e.target.value))}
                    className="w-full border-b-2 border-gray-200 py-2 px-1 text-sm font-semibold text-gray-700 outline-none focus:border-[#0082A8] transition-colors bg-transparent appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Traveller{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-right text-gray-900 font-bold mt-8">
                  {/* Calculating approx total, stripping non-numeric text for demo purpose */}
                  ₹{" "}
                  {(
                    parseFloat(
                      (
                        visa.visaTypes?.find((v) => v.name === selectedVisaType)
                          ?.fees || "0"
                      ).replace(/[^0-9.]/g, ""),
                    ) * travellers
                  ).toLocaleString("en-IN")}
                </div>

                <button
                  onClick={() => navigate(`/visa/${id}/apply`)}
                  className="w-full bg-[#004E69] hover:bg-[#00384D] text-white font-bold py-3.5 rounded-lg shadow-lg shadow-[#0082A8]/50 transition-all uppercase tracking-wide border-b-4 border-[#002D3D] active:border-b-0 active:translate-y-1"
                >
                  APPLY NOW
                </button>
              </div>

              <div className="bg-white m-4 rounded-lg px-6 py-4 flex justify-between items-center text-gray-700 font-bold cursor-pointer hover:bg-gray-50">
                Let us Call You
                <span className="text-xl font-light">+</span>
              </div>
            </div>

            {/* Contact Blocks */}
            <div className="bg-white rounded-xl shadow-md border border-[#0082A8]/10 p-5 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <FaWhatsapp className="text-[#25D366] text-3xl" />
              <div>
                <p className="text-[11px] text-gray-500 font-bold">
                  Visa on whatsapp
                </p>
                <p className="text-xl font-black text-gray-800">
                  +91 8879008992
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#0082A8]/10 p-5 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <FaPhoneAlt className="text-[#004E69] text-2xl ml-1" />
              <div>
                <p className="text-[11px] text-gray-500 font-bold">
                  Call us on
                </p>
                <p className="text-xl font-black text-gray-800">02240666444</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-[#0082A8]/10 p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <FaClock className="text-[#004E69] text-2xl ml-1" />
              <div>
                <p className="text-[11px] text-gray-500 font-bold">Timing</p>
                <p className="text-xl font-black text-gray-800">9am to 9pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaDetails;
