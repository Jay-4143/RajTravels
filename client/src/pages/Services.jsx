import { useParams, Link } from "react-router-dom";
import { FaGraduationCap, FaGlobe, FaMoon, FaIdCard, FaPlane, FaBox, FaTrain, FaSuitcase, FaBriefcase, FaMoneyBillWave, FaPhone, FaEnvelope, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import Footer from "../components/Footer";

const serviceData = {
    academy: {
        title: "TravelGO Academy",
        tagline: "Build Your Career in Travel & Tourism",
        icon: FaGraduationCap,
        color: "from-blue-600 to-indigo-700",
        description: "TravelGO Academy offers professional training courses in travel, tourism, and hospitality management. Get industry-recognized certifications and hands-on experience.",
        features: ["IATA Certified Courses", "GDS Training (Amadeus, Sabre, Galileo)", "Diploma in Travel & Tourism", "Air Ticketing & Fare Construction", "Hotel Management Basics", "100% Placement Assistance"],
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    },
    "study-abroad": {
        title: "Study Abroad",
        tagline: "Your Gateway to International Education",
        icon: FaGlobe,
        color: "from-emerald-600 to-teal-700",
        description: "Expert guidance for students looking to study in the USA, UK, Canada, Australia, and Europe. We handle university selection, applications, visa processing, and pre-departure support.",
        features: ["University Selection & Application", "IELTS/TOEFL Preparation", "Scholarship Assistance", "Student Visa Processing", "Accommodation Arrangements", "Pre-Departure Orientation"],
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800",
    },
    umrah: {
        title: "Umrah Packages",
        tagline: "Sacred Journey to Makkah & Madinah",
        icon: FaMoon,
        color: "from-yellow-600 to-amber-700",
        description: "Complete Umrah packages with flights, 5-star hotels near Haram, guided Ziyarat, and group departures. We ensure a comfortable and spiritually fulfilling pilgrimage.",
        features: ["Economy & Premium Packages", "5-Star Hotels Near Haram", "Direct Flights from Major Cities", "Guided Ziyarat Tours", "Visa Processing Included", "Group & Family Packages"],
        image: "https://images.unsplash.com/photo-1591604129939-f1efa4b0e348?w=800",
    },
    passport: {
        title: "Passport Services",
        tagline: "Hassle-Free Passport Application & Renewal",
        icon: FaIdCard,
        color: "from-red-600 to-rose-700",
        description: "We assist with fresh passport applications, renewals, name changes, and address updates. Our team ensures error-free documentation and tracks your application status.",
        features: ["Fresh Passport Application", "Passport Renewal", "Tatkal (Urgent) Processing", "Name & Address Changes", "Document Verification", "Application Status Tracking"],
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
    },
    charters: {
        title: "Charter Flights",
        tagline: "Private & Group Charter Solutions",
        icon: FaPlane,
        color: "from-sky-600 to-blue-700",
        description: "Luxury private jets and group charter flights for corporate events, weddings, sports teams, and VIP travel. Fly on your schedule to any destination worldwide.",
        features: ["Private Jet Charters", "Group Charter Flights", "Corporate Event Travel", "Wedding & Celebration Flights", "Helicopter Services", "Air Ambulance"],
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800",
    },
    cargo: {
        title: "Cargo Services",
        tagline: "Air, Sea & Land Freight Solutions",
        icon: FaBox,
        color: "from-orange-600 to-red-700",
        description: "End-to-end cargo and logistics solutions for businesses of all sizes. We handle domestic and international shipments via air, sea, and road with real-time tracking.",
        features: ["Air Freight", "Sea Freight", "Road Transport", "Customs Clearance", "Warehouse & Storage", "Real-Time Tracking"],
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    },
    "irctc-agent": {
        title: "IRCTC Agent",
        tagline: "Authorized Railway Booking Partner",
        icon: FaTrain,
        color: "from-green-600 to-emerald-700",
        description: "Book Indian Railway tickets through our authorized IRCTC agent portal. Access Tatkal bookings, premium trains, and special quota availability with expert assistance.",
        features: ["Tatkal Ticket Booking", "Premium Train Reservations", "Tourist Quota Bookings", "Group Reservations", "Cancellation & Refund Help", "PNR Status Tracking"],
        image: "https://images.unsplash.com/photo-1554232456-8727aae0862d?w=800",
    },
    mice: {
        title: "MICE",
        tagline: "Meetings, Incentives, Conferences & Exhibitions",
        icon: FaSuitcase,
        color: "from-purple-600 to-violet-700",
        description: "Professional MICE event management for corporate clients. From venue selection to travel logistics, we handle every detail of your business events and conferences.",
        features: ["Conference & Summit Planning", "Corporate Incentive Trips", "Exhibition & Trade Show Logistics", "Team Building Retreats", "Venue Selection & Negotiation", "End-to-End Event Management"],
        image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800",
    },
    corporate: {
        title: "Corporate Travel",
        tagline: "Smart Business Travel Solutions",
        icon: FaBriefcase,
        color: "from-slate-600 to-gray-800",
        description: "Dedicated corporate travel desk with negotiated rates, policy compliance, 24/7 support, and detailed MIS reports. Streamline your company's travel management.",
        features: ["Dedicated Travel Desk", "Corporate Negotiated Rates", "Travel Policy Compliance", "GST Invoice & Billing", "24/7 Emergency Support", "Monthly MIS Reports"],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    },
    forex: {
        title: "Forex Services",
        tagline: "Best Exchange Rates for International Travel",
        icon: FaMoneyBillWave,
        color: "from-green-500 to-emerald-600",
        description: "Get the best foreign exchange rates for your international trips. We offer currency exchange, forex cards, and wire transfers with zero hidden charges.",
        features: ["Currency Exchange (30+ currencies)", "Prepaid Forex Cards", "Wire Transfers", "Buy-Back Guarantee", "Doorstep Delivery", "Zero Hidden Charges"],
        image: "https://images.unsplash.com/photo-1553729459-uj7fefee49e0?w=800",
    },
};

const allServices = Object.entries(serviceData).map(([slug, s]) => ({ slug, ...s }));

const Services = () => {
    const { slug } = useParams();
    const service = serviceData[slug];

    // If no slug or invalid slug, show all services grid
    if (!service) {
        return (
            <>
                <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                            Comprehensive travel solutions for every need — from education to cargo, pilgrimage to corporate travel.
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {allServices.map(({ slug: s, title, tagline, icon: Icon, color, image }) => (
                                <Link
                                    key={s}
                                    to={`/services/${s}`}
                                    className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[280px]"
                                >
                                    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                                        <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-r ${color} items-center justify-center mb-3 shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{title}</h3>
                                        <p className="text-sm text-white/80">{tagline}</p>
                                        <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-300 group-hover:text-white transition-colors">
                                            Learn More <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    const { title, tagline, icon: Icon, color, description, features, image } = service;

    return (
        <>
            {/* Hero */}
            <section className="relative h-[400px] overflow-hidden">
                <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-r ${color} items-center justify-center mb-4 shadow-xl`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-xl text-white/90 max-w-xl">{tagline}</p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Service</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">{description}</p>

                            <h3 className="text-xl font-bold text-gray-900 mb-4">What We Offer</h3>
                            <ul className="space-y-3">
                                {features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact CTA */}
                        <div className="lg:pl-8">
                            <div className={`rounded-2xl bg-gradient-to-br ${color} p-8 text-white shadow-xl`}>
                                <h3 className="text-2xl font-bold mb-2">Interested?</h3>
                                <p className="text-white/90 mb-6">Get in touch with our {title} team for personalized assistance and best quotes.</p>

                                <div className="space-y-4 mb-8">
                                    <a href="tel:+919876543210" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            <FaPhone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/70">Call Us</p>
                                            <p className="font-semibold">+91 98765 43210</p>
                                        </div>
                                    </a>
                                    <a href="mailto:info@travelgo.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            <FaEnvelope className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/70">Email</p>
                                            <p className="font-semibold">info@travelgo.com</p>
                                        </div>
                                    </a>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => window.open("mailto:info@travelgo.com?subject=" + encodeURIComponent(title + " Inquiry"), "_blank")}
                                    className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    Send Inquiry
                                </button>
                            </div>

                            {/* Quick links to other services */}
                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                                <h4 className="font-bold text-gray-900 mb-4">Other Services</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {allServices.filter(s => s.slug !== slug).slice(0, 6).map(s => (
                                        <Link
                                            key={s.slug}
                                            to={`/services/${s.slug}`}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <s.icon className="w-4 h-4" />
                                            {s.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Services;
