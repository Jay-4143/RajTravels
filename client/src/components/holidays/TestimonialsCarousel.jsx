import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Shahid Abbas',
        avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&facialHairType=BeardLight&clothingType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Brown',
        review: 'Good service provider for holiday and vacations. Really good service and value for money .experience with the staff, Mrs.Neha was really good and helped us to make a Egypt holiday trip with family very vibrant and memorable.',
        rating: 5
    },
    {
        id: 2,
        name: 'Greeshma Sabu',
        avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=Blank&clothingType=BlazerShirt&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light',
        review: 'Really great service. I booked a trip to Malaysia for my parents with them. The package was very affordable including food and accommodation. They really enjoyed it with the whole group and tour manager. Jicky assisted me through out the whole proce...',
        rating: 4.5
    },
    {
        id: 3,
        name: 'Rahul Prakash',
        avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides&facialHairType=Blank&clothingType=Hoodie&eyeType=Happy&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
        review: '"The visa process for my Schengen trip went incredibly smoothly. The staff, particularly Amit, made each step easy by properly vetting my documents. Highly professionally processed!"',
        rating: 5
    },
    {
        id: 4,
        name: 'Priya Sharma',
        avatar: 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairBob&hairColor=Black&facialHairType=Blank&clothingType=ShirtVNeck&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Tanned',
        review: 'Fantastic experience booking our Bali honeymoon. The itinerary was perfectly balanced between relaxation and adventure. The villa recommended by the team was simply out of this world.',
        rating: 5
    }
];

const TestimonialsCarousel = () => {
    const [startIndex, setStartIndex] = useState(0);

    const nextSlide = () => {
        setStartIndex((prev) => (prev + 1 >= TESTIMONIALS.length ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setStartIndex((prev) => (prev - 1 < 0 ? TESTIMONIALS.length - 1 : prev - 1));
    };

    // Show 3 items at a time on desktop, 1 on mobile
    const visibleTestimonials = [
        TESTIMONIALS[startIndex],
        TESTIMONIALS[(startIndex + 1) % TESTIMONIALS.length],
        TESTIMONIALS[(startIndex + 2) % TESTIMONIALS.length]
    ];

    return (
        <section className="mb-20">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-bold text-gray-900">What customers says about us</h2>
                <div className="flex gap-2">
                    <button onClick={prevSlide} className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-teal-700 hover:text-white transition-colors">
                        <FaChevronLeft size={12} />
                    </button>
                    <button onClick={nextSlide} className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center hover:bg-teal-800 transition-colors">
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {visibleTestimonials.map((testimonial, i) => (
                    <div
                        key={`${testimonial.id}-${i}`}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative mt-8 animate-fade-in-up flex flex-col h-full"
                    >
                        {/* Avatar Bubble */}
                        <div className="absolute -top-10 left-6">
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-orange-100 overflow-hidden">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-10 flex-1">
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-5">
                                {testimonial.review}
                            </p>

                            <div className="mt-auto">
                                <div className="flex text-yellow-400 text-xs mb-1 justify-end">
                                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => <FaStar key={i} />)}
                                    {testimonial.rating % 1 !== 0 && <FaStar className="opacity-50" />}
                                </div>
                                <p className="font-bold text-gray-900 text-right">{testimonial.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsCarousel;
