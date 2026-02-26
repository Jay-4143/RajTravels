import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "Smooth booking experience. Got the best deal on my Dubai trip. Will definitely use Raj Travel again!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Rahul Verma",
    location: "Delhi",
    text: "24/7 support is real. Had a last-minute change and the team helped me rebook without any hassle.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Anita Krishnan",
    location: "Bangalore",
    text: "Best price guarantee actually works. Found a lower price elsewhere and got the refund within a week.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-0.5 text-amber-400">
    {Array.from({ length: count }).map((_, i) => (
      <FaStar key={i} size={14} />
    ))}
  </div>
);

const Reviews = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Real reviews from travellers who booked with Raj Travel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map(({ name, location, text, rating, image }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={image}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-500">{location}</p>
                </div>
              </div>
              <StarRating count={rating} />
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
