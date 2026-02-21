import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaGlobe, FaMoon, FaIdCard, FaPlane, FaBox, FaTrain, FaSuitcase, FaBriefcase, FaMoneyBillWave } from "react-icons/fa";

const services = [
  { label: "Academy", Icon: FaGraduationCap, slug: "academy" },
  { label: "Study Abroad", Icon: FaGlobe, slug: "study-abroad" },
  { label: "Umrah", Icon: FaMoon, slug: "umrah" },
  { label: "Passport", Icon: FaIdCard, slug: "passport" },
  { label: "Charters", Icon: FaPlane, slug: "charters" },
  { label: "Cargo", Icon: FaBox, slug: "cargo" },
  { label: "IRCTC Agent", Icon: FaTrain, slug: "irctc-agent" },
  { label: "MICE", Icon: FaSuitcase, slug: "mice" },
  { label: "Corporate", Icon: FaBriefcase, slug: "corporate" },
  { label: "Forex", Icon: FaMoneyBillWave, badge: "New", slug: "forex" },
];

const ServicesStrip = () => {
  const navigate = useNavigate();

  return (
    <section className="relative -mt-8 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-center overflow-x-auto scrollbar-hide">
            {services.map(({ label, Icon, badge, slug }, index) => (
              <div key={label} className="flex-shrink-0 flex items-stretch">
                <button
                  type="button"
                  onClick={() => navigate(`/services/${slug}`)}
                  className="flex flex-col items-center justify-center px-6 py-4 min-w-[110px] hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="relative mb-2">
                    <Icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                    {badge && (
                      <div className="absolute -top-2 -right-3 flex items-center gap-0.5 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        <span className="text-[8px]">✈</span>
                        <span>New</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 text-center leading-tight transition-colors">
                    {label}
                  </span>
                </button>
                {index < services.length - 1 && (
                  <div className="w-px bg-gray-200 self-stretch my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesStrip;
