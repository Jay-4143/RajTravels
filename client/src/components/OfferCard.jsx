import { Link } from "react-router-dom";

const OfferCard = ({ title, subtitle, discount, image, ctaText = "Book Now", link = "#", state = null }) => {
  return (
    <Link
      to={link}
      state={state}
      className="group block relative rounded-2xl overflow-hidden shadow-lg min-h-[220px] bg-gray-900"
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
      <div className="relative flex flex-col justify-between h-full p-6 text-white">
        {discount && (
          <span className="inline-flex self-start px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">
            {discount}
          </span>
        )}
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-white/90 text-sm">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-200 group-hover:text-white transition-colors">
          {ctaText}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </Link>
  );
};

export default OfferCard;
