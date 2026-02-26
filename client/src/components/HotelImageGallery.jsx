import { useState, useEffect, useMemo, useRef } from "react";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const CATEGORIES = [
    "Primary image", "Lobby", "Reception", "Lobby sitting area", "Room",
    "Bathroom", "Hallway", "Staircase", "Property entrance", "Porch"
];

const HotelImageGallery = ({ isOpen, onClose, images = [], hotelName, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [activeCategory, setActiveCategory] = useState("Primary image");
    const thumbnailRef = useRef(null);

    // Group images by category (Mocking logic since real data might not have categories)
    const categorizedImages = useMemo(() => {
        const result = {};
        CATEGORIES.forEach((cat, idx) => {
            // Distribute images across categories
            // In a real app, images would have a 'category' property
            if (idx === 0) {
                result[cat] = [images[0]];
            } else if (cat === "Room") {
                result[cat] = images.slice(1, 4);
            } else {
                // Just some random distribution for demo
                const start = (idx * 2) % images.length;
                result[cat] = [images[start] || images[0]];
            }
        });
        return result;
    }, [images]);

    // Flattened list of images based on current category or all
    const displayImages = useMemo(() => {
        // If we want to show all images but highlight categories, we can do that
        // For now, let's show all images but allow filtering by category if the user clicks a tab
        return images;
    }, [images]);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 z-[20000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between text-white p-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="w-full flex items-center justify-between px-4 py-4 md:px-10">
                <div className="flex flex-col">
                    <h2 className="text-xl font-black uppercase tracking-tight">{hotelName}</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Image {currentIndex + 1} of {displayImages.length}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg active:scale-95"
                >
                    <HiX className="w-6 h-6" />
                </button>
            </div>

            {/* Main Image */}
            <div className="relative flex-1 w-full flex items-center justify-center group overflow-hidden px-4 md:px-20">
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-10 z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all active:scale-90"
                >
                    <HiChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>

                <div className="w-full h-full flex items-center justify-center">
                    <img
                        src={displayImages[currentIndex]}
                        alt={`Gallery ${currentIndex}`}
                        className="max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500"
                    />
                </div>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-10 z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all active:scale-90"
                >
                    <HiChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>
            </div>

            {/* Content Bottom */}
            <div className="w-full flex flex-col items-center bg-black/40 backdrop-blur-sm pt-6 pb-8 border-t border-white/10">
                {/* Categories */}
                <div className="w-full max-w-7xl px-4 overflow-x-auto no-scrollbar flex items-center gap-1 mb-6">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                // For demo: find first image in this category and set it
                                const catImgs = categorizedImages[cat];
                                if (catImgs && catImgs.length > 0) {
                                    const idx = images.indexOf(catImgs[0]);
                                    if (idx !== -1) setCurrentIndex(idx);
                                }
                            }}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all rounded ${activeCategory === cat
                                    ? 'bg-white text-black'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Thumbnails */}
                <div className="w-full max-w-7xl px-4 overflow-x-auto no-scrollbar flex items-center gap-2" ref={thumbnailRef}>
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded shadow-md overflow-hidden border-2 transition-all ${currentIndex === idx
                                    ? 'border-red-500 scale-110 opacity-100 z-10'
                                    : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-80'
                                }`}
                        >
                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default HotelImageGallery;
