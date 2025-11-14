"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Gift, Star, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoyaltyPointsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/loyalty-points");
      return;
    }

    if (session?.user) {
      // Get loyalty points from session
      const points = (session.user as any).loyaltyPoints;
      setLoyaltyPoints(points !== undefined ? points : 0);
      setLoading(false);
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E51A4B]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center">
          <LogIn className="w-16 h-16 text-[#E51A4B] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your loyalty points.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Login with Google
          </Link>
        </div>
      </div>
    );
  }

  const points = loyaltyPoints ?? (session.user as any).loyaltyPoints ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/logo_new.png"
              alt="Tripeloo Logo"
              width={200}
              height={67}
              className="h-16 sm:h-20 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Points</h1>
          <p className="text-gray-600">Track your rewards and points</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{session.user.name}</h2>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div className="bg-gradient-to-br from-[#E51A4B] to-[#c91742] rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8" />
              <h3 className="text-xl font-semibold">Your Points</h3>
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">{points}</div>
          <p className="text-white/90 text-sm">Loyalty Points Available</p>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            How to Earn Points
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">First Login</h4>
                <p className="text-sm text-gray-600">Get 20 loyalty points when you sign in with Google for the first time</p>
                <p className="text-sm font-semibold text-[#E51A4B] mt-1">+20 points</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Write Reviews</h4>
                <p className="text-sm text-gray-600">Earn points every time you write a review for stays, trips, or things to do</p>
                <p className="text-sm font-semibold text-[#E51A4B] mt-1">+10 points per review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Points Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Your loyalty points are automatically updated when you complete actions. 
            Points can be redeemed for future bookings and special offers.
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#E51A4B] hover:text-[#c91742] font-semibold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

