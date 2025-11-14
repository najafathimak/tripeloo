"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ReviewFormProps {
  itemId: string;
  itemType: "stay" | "activity" | "trip";
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ itemId, itemType, onReviewSubmitted }: ReviewFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "");
      setUserEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!session?.user) {
      const shouldLogin = confirm("Please login to submit a review and earn 10 loyalty points! Would you like to login now?");
      if (shouldLogin) {
        await signIn("google", {
          callbackUrl: window.location.href,
        });
      }
      return;
    }

    setErrors({});
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!userName.trim()) {
      newErrors.userName = "Name is required";
    }
    
    if (!userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        newErrors.userEmail = "Invalid email format";
      }
    }
    
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!review.trim()) {
      newErrors.review = "Review text is required";
    } else if (review.trim().length < 10) {
      newErrors.review = "Review must be at least 10 characters long";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          itemType,
          userName: userName.trim(),
          userEmail: userEmail.trim(),
          rating,
          review: review.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || "Failed to submit review" });
        }
        setIsSubmitting(false);
        return;
      }
      
      // Success
      setSubmitted(true);
      setUserName("");
      setUserEmail("");
      setRating(0);
      setReview("");
      setErrors({});
      
      // Call callback to refresh reviews
      if (onReviewSubmitted) {
        setTimeout(() => {
          onReviewSubmitted();
          setSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you for your review!</h3>
        <p className="text-green-700">Your review has been submitted successfully.</p>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!session && status !== "loading") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-[#E51A4B] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-600 mb-4">
            Please login to submit a review and earn <span className="font-semibold text-[#E51A4B]">10 loyalty points</span>!
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: window.location.href })}
            className="inline-flex items-center gap-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-6 shadow-sm">
      <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">Write a Review</h3>
      
      {session?.user && (
        <div className="mb-2 sm:mb-4 p-1.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-[10px] sm:text-sm">
          💎 You'll earn <span className="font-semibold">10 loyalty points</span> for this review!
        </div>
      )}
      
      {errors.general && (
        <div className="mb-2 sm:mb-4 p-1.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-[10px] sm:text-sm">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-4">
        {/* Name */}
        <div>
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            disabled={!!session?.user}
            className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent ${
              errors.userName ? "border-red-500" : "border-gray-300"
            } ${session?.user ? "bg-gray-50 cursor-not-allowed" : ""}`}
          />
          {errors.userName && (
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-red-600">{errors.userName}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-2">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={!!session?.user}
            className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent ${
              errors.userEmail ? "border-red-500" : "border-gray-300"
            } ${session?.user ? "bg-gray-50 cursor-not-allowed" : ""}`}
          />
          {errors.userEmail && (
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-red-600">{errors.userEmail}</p>
          )}
        </div>
        
        {/* Rating */}
        <div>
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-0.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 sm:w-8 sm:h-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-0.5 sm:ml-2 text-[10px] sm:text-sm text-gray-600">
                {rating} out of 5
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-red-600">{errors.rating}</p>
          )}
        </div>
        
        {/* Review Text */}
        <div>
          <label className="block text-[11px] sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent resize-none ${
              errors.review ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-500">
            Minimum 10 characters ({review.length} characters)
          </p>
          {errors.review && (
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-red-600">{errors.review}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#E51A4B] hover:bg-[#c91742] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span className="text-[11px] sm:text-base">Submitting...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span className="text-[11px] sm:text-base">Submit Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

