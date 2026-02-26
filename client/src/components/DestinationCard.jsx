import { Link } from "react-router-dom";

const DestinationCard = ({ title, image, startingPrice, slug = "#" }) => {
  return (
    <Link
      to={slug}
      className="group block relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] min-h-[280px]"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        <h3 className="text-xl font-bold mb-1 group-hover:translate-y-0 translate-y-0">
          {title}
        </h3>
        <p className="text-sm text-white/90 font-medium">
          From <span className="font-bold text-lg">₹{startingPrice?.toLocaleString()}</span>
          <span className="text-white/80 text-xs font-normal"> onwards</span>
        </p>
      </div>
    </Link>
  );
};

export default DestinationCard;
