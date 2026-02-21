import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaCheckCircle, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { getHotelReviews, addHotelReview } from "../api/hotels";
import { useAuth } from "../context/AuthContext";

/* ── Star Rating (clickable or static) ── */
const StarSelector = ({ rating, setRating, size = 20, interactive = false }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) =>
            interactive ? (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-amber-400 hover:scale-110 transition-transform"
                >
                    {star <= rating ? <FaStar size={size} /> : <FaRegStar size={size} />}
                </button>
            ) : (
                <span key={star} className="text-amber-400">
                    {star <= rating ? <FaStar size={size} /> : <FaRegStar size={size} />}
                </span>
            )
        )}
    </div>
);

/* ── Rating Bar ── */
const RatingBar = ({ label, count, total }) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="w-12 text-gray-600 text-right">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-gray-500 text-xs">{count}</span>
        </div>
    );
};

/* ── Review Card ── */
const ReviewCard = ({ review }) => {
    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "";
    const userName = review.user?.name || "Guest";
    const initials = userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{userName}</span>
                        {review.isVerified && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <FaCheckCircle size={10} /> Verified Stay
                            </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{date}</span>
                    </div>
                    <StarSelector rating={review.rating} size={14} />
                    {review.title && <h4 className="font-medium text-gray-900 mt-2">{review.title}</h4>}
                    {review.content && <p className="text-gray-600 text-sm mt-1 leading-relaxed">{review.content}</p>}

                    {/* Pros / Cons */}
                    {(review.pros?.length > 0 || review.cons?.length > 0) && (
                        <div className="flex flex-wrap gap-4 mt-3">
                            {review.pros?.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                    <FaThumbsUp className="text-green-500 mt-0.5" size={12} />
                                    <div className="flex flex-wrap gap-1">
                                        {review.pros.map((p, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded">{p}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {review.cons?.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                    <FaThumbsDown className="text-red-400 mt-0.5" size={12} />
                                    <div className="flex flex-wrap gap-1">
                                        {review.cons.map((c, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Submit Review Form ── */
const ReviewForm = ({ hotelId, onSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [prosText, setProsText] = useState("");
    const [consText, setConsText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { setError("Please select a rating."); return; }
        setSubmitting(true);
        setError(null);
        try {
            await addHotelReview(hotelId, {
                rating,
                title: title.trim() || undefined,
                content: content.trim() || undefined,
                pros: prosText.trim() ? prosText.split(",").map((s) => s.trim()).filter(Boolean) : [],
                cons: consText.trim() ? consText.split(",").map((s) => s.trim()).filter(Boolean) : [],
            });
            setSuccess(true);
            setRating(0); setTitle(""); setContent(""); setProsText(""); setConsText("");
            onSubmitted?.();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <FaCheckCircle className="mx-auto text-green-500 mb-2" size={28} />
                <p className="font-semibold text-green-800">Thank you for your review!</p>
                <button type="button" onClick={() => setSuccess(false)}
                    className="mt-3 text-sm text-green-700 underline hover:text-green-900">Write another</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</p>}

            {/* Star selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating *</label>
                <StarSelector rating={rating} setRating={setRating} size={28} interactive />
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                    placeholder="Summarize your experience" maxLength={100} />
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none resize-none"
                    placeholder="Tell others about your stay…" maxLength={1000} />
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaThumbsUp className="inline text-green-500 mr-1" size={12} /> Pros <span className="text-gray-400">(comma-separated)</span>
                    </label>
                    <input type="text" value={prosText} onChange={(e) => setProsText(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                        placeholder="Clean rooms, Great view" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaThumbsDown className="inline text-red-400 mr-1" size={12} /> Cons <span className="text-gray-400">(comma-separated)</span>
                    </label>
                    <input type="text" value={consText} onChange={(e) => setConsText(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                        placeholder="Noisy area, Slow WiFi" />
                </div>
            </div>

            <button type="submit" disabled={submitting}
                className="w-full sm:w-auto px-8 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors">
                {submitting ? "Submitting…" : "Submit Review"}
            </button>
        </form>
    );
};

/* ── Main Component ── */
const HotelGuestReviews = ({ hotelId, hotelRating = 0, reviewCount = 0 }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    /* Compute star distribution from loaded reviews */
    const starDist = [5, 4, 3, 2, 1].map((s) => ({
        label: `${s} ★`,
        count: reviews.filter((r) => r.rating === s).length,
    }));

    const fetchReviews = useCallback(async (p = 1) => {
        try {
            setLoading(true);
            const res = await getHotelReviews(hotelId, p, 6);
            if (p === 1) {
                setReviews(res.data.reviews || []);
            } else {
                setReviews((prev) => [...prev, ...(res.data.reviews || [])]);
            }
            setPagination(res.data.pagination || null);
            setPage(p);
        } catch {
            /* silently ignore review fetch errors */
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    useEffect(() => { fetchReviews(1); }, [fetchReviews]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Overall score */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6">
                    <span className="text-5xl font-bold text-gray-900">{hotelRating?.toFixed(1) || "0.0"}</span>
                    <StarSelector rating={Math.round(hotelRating)} size={18} />
                    <p className="text-sm text-gray-500 mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
                </div>

                {/* Star breakdown */}
                <div className="lg:col-span-2 flex flex-col justify-center gap-2">
                    {starDist.map((s) => (
                        <RatingBar key={s.label} label={s.label} count={s.count} total={reviews.length} />
                    ))}
                </div>
            </div>

            {/* Review list */}
            {loading && reviews.length === 0 ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p className="text-lg font-medium">No reviews yet</p>
                    <p className="text-sm mt-1">Be the first to share your experience!</p>
                </div>
            ) : (
                <div className="space-y-4 mb-6">
                    {reviews.map((r) => (
                        <ReviewCard key={r._id} review={r} />
                    ))}
                </div>
            )}

            {/* Load more */}
            {pagination && pagination.page < pagination.pages && (
                <div className="text-center mb-8">
                    <button type="button" onClick={() => fetchReviews(page + 1)} disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
                        {loading ? "Loading…" : "Load More Reviews"}
                    </button>
                </div>
            )}

            {/* Submit form or login CTA */}
            <div className="border-t border-gray-100 pt-6">
                {user ? (
                    <ReviewForm hotelId={hotelId} onSubmitted={() => fetchReviews(1)} />
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                        <p className="text-gray-700 font-medium mb-2">Want to share your experience?</p>
                        <button type="button" onClick={() => navigate("/login", { state: { from: "hotel-review" } })}
                            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors">
                            Login to Write a Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelGuestReviews;
