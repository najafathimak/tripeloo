"use client";
import ListCarousel from "@/components/ListDetails/ListCarousel";
import LocationSection from "@/components/ListDetails/LocationSection";
import PriceSection from "@/components/ListDetails/PriceSection";
import ReviewsSection from "@/components/ListDetails/ReviewsSection";
import PackagesSection from "@/components/ListDetails/PackagesSection";
import BookingSidebar from "@/components/ListDetails/ListingDetailsClient";
import { Star, Car, Hotel, Utensils, Mountain, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Package } from "@/components/ListDetails/PackagesSection";

// Expandable Additional Detail Component
const AdditionalDetailItem = ({ detail }: { detail: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only render if heading exists and has content
  const hasContent = 
    (detail.type === 'description' && detail.description?.trim()) ||
    (detail.type === 'points' && detail.points?.length > 0);

  if (!detail.heading?.trim() || !hasContent) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-left">
          {detail.heading}
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
          {detail.type === 'description' && detail.description && (
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {detail.description}
            </p>
          )}
          {detail.type === 'points' && detail.points && detail.points.length > 0 && (
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
              {detail.points.map((point: string, pointIndex: number) => (
                <li key={pointIndex}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

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
      if (!tripId) {
        setLoading(false);
        return;
      }

      try {
        const encodedTripId = encodeURIComponent(tripId);
        const res = await fetch(`/api/trips/${encodedTripId}`);
        
        if (res.ok) {
          const data = await res.json();
          setTripData(data.data);
        } else {
          const errorData = await res.json();
          console.error('[trips] Error response:', errorData);
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const handleScrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: tripData?.currency || 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate total price from selected packages
  const totalPrice = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
  const displayPrice = selectedPackages.length > 0 ? totalPrice : (tripData?.startingPrice || 0);
  
  const savings = tripData?.originalPrice 
    ? tripData.originalPrice - tripData.startingPrice 
    : 0;

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

  if (!tripData) {
    return (
      <div className="mx-0 pt-11 sm:mx-[10%] relative flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Trip Not Found
            </h1>
            <p className="text-gray-600 mb-2">
              We couldn't find the trip you're looking for.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              The trip may have been removed or the link might be incorrect.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-0 pt-11 sm:mx-[10%] relative">
      {/* Carousel with trip cover image */}
      <ListCarousel 
        carouselImages={tripData.carouselImages || []} 
        coverImage={tripData.coverImage} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {tripData.name}
            </h1>

            {/* Rating + Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-600">
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Star className="w-4 h-4 fill-emerald-500" />
                  <span>5.0</span>
                </div>
                <span className="text-sm">(Reviews)</span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatPrice(displayPrice)}/-
                </p>
                {tripData.originalPrice && selectedPackages.length === 0 && (
                  <span className="line-through text-gray-500 text-sm sm:text-base">
                    {formatPrice(tripData.originalPrice)}/-
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            {tripData.summary && (
              <div className="mt-8 bg-red-50 px-3 py-3 border rounded-lg">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                  About
                </h2>
                <p>{tripData.summary}</p>
              </div>
            )}

            {/* Inclusions */}
            {tripData.includes && tripData.includes.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
                {tripData.includes.map((inc: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trip Properties */}
            {tripData.properties && tripData.properties.length > 0 && (
              <div className="mt-8 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                  Trip Features
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                  {tripData.properties.map((prop: string, index: number) => (
                    <div key={index}>{prop}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages Section */}
            {tripData.packages && tripData.packages.length > 0 && (
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

                <PackagesSection 
                  packages={tripData.packages.map((pkg: any, index: number) => ({
                    id: pkg.id || `pkg-${index}`,
                    name: pkg.name,
                    duration: pkg.duration,
                    price: pkg.price,
                    thumb: pkg.thumb,
                    images: pkg.images || [],
                    highlights: pkg.highlights || [],
                  }))}
                  onPackageSelect={(packages) => setSelectedPackages(packages)} 
                />
              </div>
            )}

            {/* Price Section */}
            <div className="mb-5">
              <PriceSection 
                includes={tripData.includes || []} 
                excludes={tripData.excludes || []} 
              />
            </div>

            {/* Additional Details - Expandable */}
            {tripData.additionalDetails && tripData.additionalDetails.length > 0 && (() => {
              const validDetails = tripData.additionalDetails.filter((detail: any) => {
                const hasHeading = detail.heading?.trim();
                const hasContent = 
                  (detail.type === 'description' && detail.description?.trim()) ||
                  (detail.type === 'points' && detail.points?.length > 0);
                return hasHeading && hasContent;
              });
              
              return validDetails.length > 0 ? (
                <div className="px-4 sm:px-6 mb-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
                  <div className="space-y-4">
                    {validDetails.map((detail: any, index: number) => (
                      <AdditionalDetailItem key={index} detail={detail} />
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Mobile Booking Sidebar */}
            <div ref={bookingRef} className="md:hidden">
              <BookingSidebar
                selectedRooms={selectedPackages}
                title={tripData.name}
                price={`${formatPrice(displayPrice)}/-`}
                oldPrice={tripData.originalPrice && selectedPackages.length === 0 ? `${formatPrice(tripData.originalPrice)}/-` : ""}
                savings={savings > 0 && selectedPackages.length === 0 ? `${formatPrice(savings)}/-` : ""}
                isPackage={true}
              />
            </div>

            {/* Location + Reviews */}
            <div className="px-4 sm:px-6 mb-5">
              <LocationSection 
                location={tripData.location} 
                destinationName={tripData.destinationName} 
              />
            </div>
            <div className="px-4 sm:px-6 mb-5">
              {tripData && (
                <ReviewsSection
                  itemId={tripData._id?.toString() || tripData.id || tripId || ""}
                  itemType="trip"
                />
              )}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div ref={bookingRef} className="hidden md:block sticky top-20">
            <BookingSidebar
              selectedRooms={selectedPackages}
              title={tripData.name}
              price={formatPrice(displayPrice)}
              oldPrice={tripData.originalPrice && selectedPackages.length === 0 ? formatPrice(tripData.originalPrice) : ""}
              savings={savings > 0 && selectedPackages.length === 0 ? formatPrice(savings) : ""}
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

