"use client";

import { Star, MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReviewForm from "./ReviewForm";

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  review: string;
  createdAt: Date | string;
}

interface ReviewsSectionProps {
  itemId: string;
  itemType: "stay" | "activity" | "trip";
}

export default function ReviewsSection({ itemId, itemType }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState({
    average: 0,
    totalReviews: 0,
    distribution: [0, 0, 0, 0, 0] as number[], // [5,4,3,2,1 stars]
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [displayCount, setDisplayCount] = useState(4); // Show 4 reviews initially

  const fetchReviews = async () => {
    if (!itemId || itemId.trim() === "") {
      setLoading(false);
      setReviews([]);
      setSummary({ average: 0, totalReviews: 0, distribution: [0, 0, 0, 0, 0] });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?itemId=${encodeURIComponent(itemId)}&itemType=${itemType}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
        setSummary(data.summary || { average: 0, totalReviews: 0, distribution: [0, 0, 0, 0, 0] });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
      setSummary({ average: 0, totalReviews: 0, distribution: [0, 0, 0, 0, 0] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [itemId, itemType]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStarColor = (average: number) => {
    if (average >= 4.5) return "text-green-500 fill-green-500";
    if (average >= 3.5) return "text-yellow-500 fill-yellow-500";
    if (average >= 2.5) return "text-orange-500 fill-orange-500";
    return "text-red-500 fill-red-500";
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-12 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }
  const displayedReviews = reviews.slice(0, displayCount);
  const hasMoreReviews = reviews.length > displayCount;

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Reviews
          </h2>
          {summary.totalReviews > 0 && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-800">
                  {summary.average > 0 ? summary.average.toFixed(1) : "0.0"}
                </span>
                <span className="text-gray-500">({summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"})</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-semibold text-[#E51A4B] hover:text-[#c91742] transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <MessageSquare size={18} />
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-8">
          <ReviewForm
            itemId={itemId}
            itemType={itemType}
            onReviewSubmitted={() => {
              fetchReviews();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {summary.totalReviews === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Be the first to share your experience! Your review will help others make better decisions.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center border-r pr-8">
              <div className="flex items-center mb-2">
                {renderStars(Math.round(summary.average), "lg")}
              </div>
              <p className={`text-4xl font-bold ${getStarColor(summary.average)}`}>
                {summary.average > 0 ? summary.average.toFixed(1) : "0.0"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 w-full">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[5 - star];
                const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                return (
                  <div
                    key={star}
                    className="flex items-center gap-2 text-gray-700 text-sm mb-2"
                  >
                    <span className="w-4">{star}</span>
                    <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-gray-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3 sm:space-y-6">
            {displayedReviews.map((r) => (
              <div
                key={r.id}
                className="border rounded-xl p-2.5 sm:p-5 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-1.5 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E51A4B] to-[#FF6B6B] flex items-center justify-center text-white font-semibold text-xs sm:text-lg">
                      {getInitials(r.userName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-base">{r.userName}</h3>
                      <p className="text-[10px] sm:text-sm text-gray-500">
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <div className="flex items-center gap-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            star <= r.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-sm font-semibold text-gray-700 ml-0.5 sm:ml-1">
                      {r.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-xs sm:text-base">{r.review}</p>
              </div>
            ))}
          </div>

          {/* Pagination / Load More */}
          {hasMoreReviews && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setDisplayCount(displayCount + 4)}
                className="px-6 py-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold rounded-lg transition-colors"
              >
                Load More Reviews ({reviews.length - displayCount} remaining)
              </button>
            </div>
          )}
          {displayCount > 4 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setDisplayCount(4)}
                className="text-sm text-gray-600 hover:text-[#E51A4B] transition-colors"
              >
                Show Less
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
