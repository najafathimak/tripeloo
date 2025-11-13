"use client";
import ListCarousel from "@/components/ListDetails/ListCarousel";
import LocationSection from "@/components/ListDetails/LocationSection";
import PriceSection from "@/components/ListDetails/PriceSection";
import ReviewsSection from "@/components/ListDetails/ReviewsSection";
import PackagesSection from "@/components/ListDetails/PackagesSection";
import BookingSidebar from "@/components/ListDetails/ListingDetailsClient";
import { Star, Car, Hotel, Utensils, Mountain, Calendar, MapPin } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Package } from "@/components/ListDetails/PackagesSection";

const TripDetailsContent = () => {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("trips");
  const destination = searchParams.get("destination");
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const bookingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId || !destination) {
        setLoading(false);
        return;
      }

      try {
        const destinationSlug = decodeURIComponent(destination).toLowerCase();
        const res = await fetch(`/api/trips?destination=${encodeURIComponent(destinationSlug)}`);
        if (res.ok) {
          const data = await res.json();
          const trip = data.data.find((t: any) => t.id === tripId);
          setTripData(trip || null);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, destination]);

  const handleScrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Default trip data if not found
  const displayTrip = tripData || {
    name: "Forest Camping Experience",
    coverImage: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1600&auto=format&fit=crop",
    duration: "2 days",
    price: 5000,
    category: "Adventure",
  };

  // Calculate total price from selected packages
  const totalPrice = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
  const displayPrice = selectedPackages.length > 0 ? totalPrice : displayTrip.price;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E51A4B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-0 pt-11 sm:mx-[10%] relative">
      {/* Carousel with trip cover image */}
      <div className="relative h-[70vh] sm:h-[90vh] mt-6 overflow-hidden rounded-sm sm:rounded-3xl">
        <Image
          src={displayTrip.coverImage || displayTrip.image || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1600&auto=format&fit=crop"}
          alt={displayTrip.name}
          fill
          className="object-cover brightness-75 rounded-sm sm:rounded-3xl"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {displayTrip.name}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
            {displayTrip.duration || "Adventure awaits"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {displayTrip.name}
            </h1>

            {/* Rating + Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-600">
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Star className="w-4 h-4 fill-emerald-500" />
                  <span>5.0</span>
                </div>
                <span className="text-sm">(388 reviews)</span>
                {displayTrip.duration && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{displayTrip.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{displayPrice.toLocaleString()}
                </p>
                {selectedPackages.length === 0 && (
                  <span className="line-through text-gray-500 text-sm sm:text-base">
                    ₹{(displayTrip.price * 1.2).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Inclusions */}
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Car size={18} /> <span>Transfer Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Hotel size={18} /> <span>Stay Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils size={18} /> <span>Meals Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain size={18} /> <span>Sightseeing Included</span>
              </div>
            </div>

            {/* Trip Properties */}
            <div className="mt-8 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                Trip Features
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                <div>🗺️ Guided Tours</div>
                <div>📸 Photo Opportunities</div>
                <div>🏨 Quality Accommodation</div>
                <div>🍽️ Local Cuisine</div>
                <div>🚗 Comfortable Transport</div>
                <div>👨‍🏫 Expert Guide</div>
                <div>📱 24/7 Support</div>
                <div>🎒 Travel Insurance</div>
              </div>
            </div>

            {/* Packages Section */}
            <div className="px-4 sm:px-6 mb-5 mt-8 relative">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Choose Your Package
                </h2>
              </div>

              {/* Info Badge */}
              <div className="inline-block bg-[#7E22CE]/10 text-[#7E22CE] text-xs font-medium px-3 py-1 rounded-full mb-4">
                💡 Select your preferred package duration to continue booking
              </div>

              <PackagesSection onPackageSelect={(packages) => setSelectedPackages(packages)} />
            </div>

            {/* Price Section */}
            <div className="mb-5">
              <PriceSection />
            </div>

            {/* Mobile Booking Sidebar */}
            <div ref={bookingRef} className="md:hidden">
              <BookingSidebar
                selectedRooms={selectedPackages}
                title={displayTrip.name}
                price={`₹${displayPrice.toLocaleString()}`}
                oldPrice={selectedPackages.length === 0 ? `₹${(displayTrip.price * 1.2).toLocaleString()}` : ""}
                savings={selectedPackages.length === 0 ? `₹${Math.round(displayTrip.price * 0.2).toLocaleString()}` : ""}
                isPackage={true}
              />
            </div>

            {/* Location + Reviews */}
            <div className="px-4 sm:px-6 mb-5">
              <LocationSection />
            </div>
            <div className="px-4 sm:px-6 mb-5">
              <ReviewsSection />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div ref={bookingRef} className="hidden md:block sticky top-20">
            <BookingSidebar
              selectedRooms={selectedPackages}
              title={displayTrip.name}
              price={`₹${displayPrice.toLocaleString()}`}
              oldPrice={selectedPackages.length === 0 ? `₹${(displayTrip.price * 1.2).toLocaleString()}` : ""}
              savings={selectedPackages.length === 0 ? `₹${Math.round(displayTrip.price * 0.2).toLocaleString()}` : ""}
              className="w-full lg:w-[350px]"
              isPackage={true}
            />
          </div>
        </div>
      </div>

      {/* ✅ Floating Book Now Button */}
      <button
        onClick={handleScrollToBooking}
        className="fixed bottom-5 right-5 bg-[#7E22CE]/15 hover:bg-[#7E22CE]/25 text-[#7E22CE] font-medium px-4 py-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 flex items-center gap-2 z-40"
      >
        <span>Book Now</span>
        <span className="text-lg animate-bounce">↓</span>
      </button>
    </div>
  );
};

const TripDetails = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E51A4B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading trip details...</p>
          </div>
        </div>
      }
    >
      <TripDetailsContent />
    </Suspense>
  );
};

export default TripDetails;

