import React from "react";
import { Link } from "react-router-dom";

const destinations = [
  {
    country: "Dubai",
    region: "Asia",
    processingTime: "48 Hours",
    price: "3,499",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    country: "Malaysia",
    region: "Asia",
    processingTime: "24 Hours",
    price: "499",
    image:
      "https://images.unsplash.com/photo-1596422846543-74c6eb2339d2?q=80&w=2071&auto=format&fit=crop",
  },
  {
    country: "Singapore",
    region: "Asia",
    processingTime: "3 Days",
    price: "2,100",
    image:
      "https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=2071&auto=format&fit=crop",
  },
  {
    country: "Srilanka",
    region: "Asia",
    processingTime: "24 Hours",
    price: "999",
    image:
      "https://images.unsplash.com/photo-1549487779-7c3093952ba7?q=80&w=2072&auto=format&fit=crop",
  },
  {
    country: "Thailand",
    region: "Asia",
    processingTime: "24 Hours",
    price: "499",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop",
  },
  {
    country: "Australia",
    region: "Australia",
    processingTime: "15 Days",
    price: "12,999",
    image:
      "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?q=80&w=2071&auto=format&fit=crop",
  },
];

const VisaPopularDestinations = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl font-black text-slate-900 mb-8 font-sans">
          Popular Destinations
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest, idx) => (
            <Link
              to={`/visa/${dest.country.toLowerCase()}`}
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 block"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.country}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Floating Price Circle */}
              <div className="relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#07365A] rounded-full flex flex-col items-center justify-center text-white border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-105">
                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-90">
                    Starting
                  </span>
                  <span className="text-xs font-black">₹ {dest.price}/-</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-90">
                    Only
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="pt-14 pb-6 px-4 text-center relative z-0">
                <h3 className="text-[17px] font-black text-[#1A1A40] leading-tight mb-1">
                  {dest.country}
                </h3>
                <p className="text-xs font-bold text-gray-500 mb-3">
                  {dest.region}
                </p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                  Processing Time : {dest.processingTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisaPopularDestinations;
