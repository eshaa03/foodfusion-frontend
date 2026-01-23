import { useState, useEffect } from "react";
import { Star, X, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ReviewsModal({ item, onClose, isDietMode, onUpdate }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Colors based on mode
    const primaryColor = isDietMode ? "var(--food-green)" : "var(--food-red)";

    useEffect(() => {
        fetchReviews();
    }, [item.id]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/foods/${item.id}/reviews`);
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to add a review");
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/foods/${item.id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, comment }),
            });

            const data = await res.json();

            if (res.ok) {
                setReviews([
                    {
                        _id: Date.now(),
                        user: { name: "You" },
                        rating,
                        comment,
                        createdAt: new Date().toISOString(),
                    },
                    ...reviews,
                ]);
                setComment("");
                // Refresh parent
                onUpdate?.(data.rating, data.reviews);
            } else {
                alert(data.message || "Failed to add review");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                        <div>
                            <h3 className="font-bold text-lg">{item.name} Reviews</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">
                                    {reviews.length > 0
                                        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                                        : "New"}
                                </span>
                                <span>• {reviews.length} reviews</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Loading reviews...</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No reviews yet. Be the first!</div>
                        ) : (
                            reviews.map((fav) => (
                                <div key={fav._id} className="border-b pb-3 last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                <UserIcon className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <span className="font-semibold text-sm">{fav.user?.name || "User"}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(fav.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                className={`w-3 h-3 ${s <= fav.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700">{fav.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                        <h4 className="font-bold text-sm mb-3">Rate & Review</h4>

                        {/* Star Rating Select */}
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Your Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        type="button"
                                        key={s}
                                        onClick={() => setRating(s)}
                                        className="focus:outline-none transition-transform active:scale-95"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Your Review (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                                rows={2}
                                style={{ focusRingColor: primaryColor }}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-sm active:scale-95 transition-all"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {submitting ? "Submitting..." : "Post Review"}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
