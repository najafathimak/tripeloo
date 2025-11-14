"use client";

import { useState } from "react";
import { Search, Gift, Minus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface UserPoints {
  email: string;
  name: string;
  image?: string;
  loyaltyPoints: number;
}

export default function LoyaltyPointsAdminPage() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<UserPoints | null>(null);
  const [pointsToClaim, setPointsToClaim] = useState("");
  const [claimNote, setClaimNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSearch = async () => {
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setUser(null);

    try {
      const response = await fetch(`/api/admin/loyalty-points?email=${encodeURIComponent(email.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to fetch user");
        return;
      }

      setUser(data.user);
    } catch (err) {
      setError("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user) return;

    const points = parseInt(pointsToClaim);
    if (!pointsToClaim.trim() || isNaN(points) || points <= 0) {
      setError("Please enter a valid number of points to claim");
      return;
    }

    if (points > user.loyaltyPoints) {
      setError(`User only has ${user.loyaltyPoints} points. Cannot claim ${points} points.`);
      return;
    }

    if (!claimNote.trim()) {
      setError("Please enter a note/reason for claiming points");
      return;
    }

    setClaiming(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/loyalty-points/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          points: parseInt(pointsToClaim, 10),
          note: claimNote.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to claim points: ${data.error || 'Unknown error'}`);
        return;
      }

      setSuccess(`Successfully claimed ${points} points. Remaining balance: ${data.newBalance} points.`);
      setPointsToClaim("");
      setClaimNote("");
      
      // Refresh user data
      const refreshResponse = await fetch(`/api/admin/loyalty-points?email=${encodeURIComponent(user.email)}`);
      const refreshData = await refreshResponse.json();
      if (refreshResponse.ok) {
        setUser(refreshData.user);
      }
    } catch (err) {
      setError("An error occurred while claiming points");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Loyalty Points Management</h1>
          </div>
          <p className="text-white/80">Verify and claim loyalty points for users</p>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Search User</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter user email address"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E51A4B] border border-white/20"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-300" size={20} />
            <span className="text-red-100">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-300" size={20} />
            <span className="text-green-100">{success}</span>
          </div>
        )}

        {/* User Info Section */}
        {user && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
            <div className="flex items-start gap-4 mb-6">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-[#E51A4B]">{user.loyaltyPoints}</p>
                <p className="text-white/60 text-xs">Loyalty Points</p>
              </div>
            </div>

            {/* Claim Points Section */}
            <div className="border-t border-white/20 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Minus size={20} />
                Claim Points
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Points to Claim <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={pointsToClaim}
                    onChange={(e) => setPointsToClaim(e.target.value)}
                    placeholder="Enter points to claim"
                    min="1"
                    max={user.loyaltyPoints}
                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E51A4B] border border-white/20"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    Maximum claimable: {user.loyaltyPoints} points
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Note/Reason <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={claimNote}
                    onChange={(e) => setClaimNote(e.target.value)}
                    placeholder="Enter reason for claiming points (e.g., 'Redeemed for discount', 'Admin adjustment', etc.)"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E51A4B] border border-white/20 resize-none"
                  />
                </div>
                <button
                  onClick={handleClaim}
                  disabled={claiming || !pointsToClaim || !claimNote.trim()}
                  className="w-full px-6 py-3 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {claiming ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Claiming Points...
                    </>
                  ) : (
                    <>
                      <Minus size={20} />
                      Claim Points
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!user && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
              <li>Enter the user's email address in the search field</li>
              <li>Click "Search" to find the user and view their current loyalty points</li>
              <li>Enter the number of points to claim and provide a reason/note</li>
              <li>Click "Claim Points" to reduce the points from the user's account</li>
              <li>The transaction will be recorded in the user's history</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

