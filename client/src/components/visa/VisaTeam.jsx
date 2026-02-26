import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const teamMembers = [
  {
    name: "Shubham Mistry",
    role: "Senior Visa Officer",
    experience: "5 Years of Experience",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Vaibhav Shinde",
    role: "Senior Visa Officer",
    experience: "5 Years of Experience",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop",
  },
  {
    name: "Sakshi Jambekar",
    role: "Senior Visa Officer",
    experience: "5 Years of Experience",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Airaf Shaikh",
    role: "Senior Visa Officer",
    experience: "5 Years of Experience",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2000&auto=format&fit=crop",
  },
];

const VisaTeam = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-slate-900 font-sans">
            Meet Our Team Of Visa Experts
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-[#07365A] text-white flex items-center justify-center hover:bg-[#0a4b7c] transition-colors shadow-md"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-[#07365A] text-white flex items-center justify-center hover:bg-[#0a4b7c] transition-colors shadow-md"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="bg-[#DEDEDE] rounded-xl p-8 pt-10 pb-10">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="snap-start shrink-0 w-[300px] bg-[#F5F5F5] rounded-xl p-4 flex items-center gap-4 shadow-sm border border-white/50"
              >
                {/* Profile Image */}
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-[3px] border-white shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-[15px] font-black text-[#1A1A40] mb-0.5">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-medium text-gray-500">
                    {member.role}
                  </p>
                  <p className="text-[11px] font-medium text-gray-500">
                    {member.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaTeam;
