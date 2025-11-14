"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Eye, EyeOff, Loader2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface Review {
  id: string;
  itemId: string;
  itemType: string;
  userName: string;
  userEmail: string;
  rating: number;
  review: string;
  isHidden: boolean;
  createdAt: Date | string;
}

interface Item {
  id: string;
  name: string;
  destinationSlug?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Filters
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedItemType, setSelectedItemType] = useState<"stay" | "activity" | "trip" | "">("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  
  // Options
  const [destinations, setDestinations] = useState<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  // Pagination
  const [displayCount, setDisplayCount] = useState(10);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination && selectedItemType) {
      fetchItems();
    } else {
      setItems([]);
      setSelectedItemId("");
    }
  }, [selectedDestination, selectedItemType]);

  useEffect(() => {
    if (selectedItemId && selectedItemType) {
      fetchReviews();
    } else {
      setReviews([]);
    }
  }, [selectedItemId, selectedItemType, showHidden]);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/admin/destinations?includeHidden=true");
      if (res.ok) {
        const data = await res.json();
        setDestinations(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const fetchItems = async () => {
    if (!selectedDestination || !selectedItemType) return;

    try {
      setLoading(true);
      const collectionMap: Record<string, string> = {
        stay: "stays",
        activity: "activities",
        trip: "trips",
      };
      
      const collection = collectionMap[selectedItemType];
      if (!collection) return;

      const res = await fetch(`/api/admin/${collection}?includeHidden=true`);
      if (res.ok) {
        const data = await res.json();
        // Filter items by destination slug
        const filteredItems = (data.data || []).filter((item: any) => {
          const itemSlug = item.destinationSlug?.toLowerCase() || '';
          const selectedSlug = selectedDestination.toLowerCase();
          return itemSlug === selectedSlug || itemSlug.includes(selectedSlug) || selectedSlug.includes(itemSlug);
        });
        setItems(filteredItems);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!selectedItemId || !selectedItemType) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/reviews?itemId=${encodeURIComponent(selectedItemId)}&itemType=${selectedItemType}&includeHidden=${showHidden}`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (reviewId: string, currentHidden: boolean) => {
    try {
      setUpdating(reviewId);
      const res = await fetch(`/api/admin/reviews/${reviewId}/hide`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentHidden }),
      });

      if (res.ok) {
        await fetchReviews();
      } else {
        alert("Failed to update review");
      }
    } catch (error) {
      console.error("Error toggling hide:", error);
      alert("An error occurred");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const displayedReviews = reviews.slice(0, displayCount);
  const hasMoreReviews = reviews.length > displayCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Review Management</h1>
        <p className="text-white/80 mt-1">Monitor and manage reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-md p-6 mb-6 border border-white/20">
        <h2 className="text-lg font-semibold text-white mb-4">Filter Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Destination Filter */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Destination
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => {
                setSelectedDestination(e.target.value);
                setSelectedItemType("");
                setSelectedItemId("");
                setItems([]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={(dest as any).slug || (dest as any).destinationSlug || dest.name}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Item Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Type
            </label>
            <select
              value={selectedItemType}
              onChange={(e) => {
                setSelectedItemType(e.target.value as any);
                setSelectedItemId("");
                setItems([]);
              }}
              disabled={!selectedDestination}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] disabled:bg-gray-100"
            >
              <option value="">Select Type</option>
              <option value="stay">Stay</option>
              <option value="activity">Things to Do</option>
              <option value="trip">Trip</option>
            </select>
          </div>

          {/* Item Filter */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Item
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              disabled={!selectedItemType || items.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] disabled:bg-gray-100"
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Show Hidden Toggle */}
        {selectedItemId && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="showHidden"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              className="w-4 h-4 text-[#E51A4B] border-gray-300 rounded focus:ring-[#E51A4B]"
            />
            <label htmlFor="showHidden" className="text-sm text-white">
              Show hidden reviews
            </label>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {loading && selectedItemId ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
        </div>
      ) : !selectedItemId ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <MessageSquare className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <p className="text-white">Please select a destination, type, and item to view reviews</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <MessageSquare className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <p className="text-white">No reviews found</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-white/80">
            Showing {displayedReviews.length} of {reviews.length} reviews
          </div>
          
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white/10 backdrop-blur-sm rounded-lg border-2 p-6 shadow-sm ${
                  review.isHidden ? "border-yellow-400 opacity-70" : "border-white/20"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E51A4B] to-[#FF6B6B] flex items-center justify-center text-white font-semibold">
                        {review.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{review.userName}</h3>
                        <p className="text-sm text-white/70">{review.userEmail}</p>
                        <p className="text-xs text-white/60">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-white">
                        {review.rating.toFixed(1)}/5
                      </span>
                    </div>
                    <p className="text-white leading-relaxed">{review.review}</p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleToggleHide(review.id, review.isHidden)}
                      disabled={updating === review.id}
                      className={`p-2 rounded-lg transition-colors ${
                        review.isHidden
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      title={review.isHidden ? "Unhide Review" : "Hide Review"}
                    >
                      {updating === review.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : review.isHidden ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {review.isHidden && (
                  <div className="mt-2 text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded border border-yellow-400/30">
                    This review is hidden from users
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {hasMoreReviews && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setDisplayCount(displayCount + 10)}
                className="px-6 py-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold rounded-lg transition-colors"
              >
                Load More Reviews ({reviews.length - displayCount} remaining)
              </button>
            </div>
          )}
          {displayCount > 10 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setDisplayCount(10)}
                className="text-sm text-white/80 hover:text-white transition-colors"
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

