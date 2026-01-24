"use client";
import ListCarousel from "@/components/ListDetails/ListCarousel";
import LocationSection from "@/components/ListDetails/LocationSection";
import ReviewsSection from "@/components/ListDetails/ReviewsSection";
import PackagesSection from "@/components/ListDetails/PackagesSection";
import BookingSidebar from "@/components/ListDetails/ListingDetailsClient";
import NearbyItems from "@/components/NearbyItems";
import { BottomBookingTab } from "@/components/ListDetails/BottomBookingTab";
import { Star, Car, Hotel, Utensils, Mountain, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Package } from "@/components/ListDetails/PackagesSection";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
  const [reviewSummary, setReviewSummary] = useState({ average: 0, totalReviews: 0 });
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const menuScrollRefMobile = useRef<HTMLDivElement | null>(null);
  const menuScrollRefDesktop = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

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

  // Fetch review summary
  useEffect(() => {
    const fetchReviewSummary = async () => {
      if (!tripId) return;

      try {
        const res = await fetch(`/api/reviews?itemId=${encodeURIComponent(tripId)}&itemType=trip`);
        if (res.ok) {
          const data = await res.json();
          setReviewSummary({
            average: data.summary?.average || 0,
            totalReviews: data.summary?.totalReviews || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching review summary:", error);
      }
    };

    if (tripId) {
      fetchReviewSummary();
    }
  }, [tripId]);

  const handleScrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Check scroll position for menu board
  const checkMenuScroll = () => {
    // Check both mobile and desktop refs, use the one that's visible
    const mobileRef = menuScrollRefMobile.current;
    const desktopRef = menuScrollRefDesktop.current;
    const activeRef = mobileRef?.offsetParent ? mobileRef : desktopRef;
    
    if (activeRef) {
      const { scrollTop, scrollHeight, clientHeight } = activeRef;
      setShowScrollTop(scrollTop > 10);
      setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  const scrollMenuUp = () => {
    const mobileRef = menuScrollRefMobile.current;
    const desktopRef = menuScrollRefDesktop.current;
    const activeRef = mobileRef?.offsetParent ? mobileRef : desktopRef;
    
    if (activeRef) {
      activeRef.scrollBy({ top: -200, behavior: 'smooth' });
    }
  };

  const scrollMenuDown = () => {
    const mobileRef = menuScrollRefMobile.current;
    const desktopRef = menuScrollRefDesktop.current;
    const activeRef = mobileRef?.offsetParent ? mobileRef : desktopRef;
    
    if (activeRef) {
      activeRef.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  // Set up scroll listener for menu board
  useEffect(() => {
    if (tripData?.menu) {
      // Check scroll state after a brief delay to ensure DOM is ready
      const timer = setTimeout(() => {
        checkMenuScroll();
      }, 100);
      
      const handleScroll = () => checkMenuScroll();
      
      // Add listeners to both refs
      menuScrollRefMobile.current?.addEventListener('scroll', handleScroll);
      menuScrollRefDesktop.current?.addEventListener('scroll', handleScroll);
      
      return () => {
        clearTimeout(timer);
        menuScrollRefMobile.current?.removeEventListener('scroll', handleScroll);
        menuScrollRefDesktop.current?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [tripData?.menu]);

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
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E51A4B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant/cafe details...</p>
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
              Restaurant/Cafe Not Found
            </h1>
            <p className="text-gray-600 mb-2">
              We couldn't find the restaurant/cafe you're looking for.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              The restaurant/cafe may have been removed or the link might be incorrect.
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
    <div className="mx-0 pt-0 sm:pt-11 sm:mx-[10%] relative">
      {/* Carousel with restaurant/cafe cover image */}
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
                  <span>{reviewSummary.average > 0 ? reviewSummary.average.toFixed(1) : "0.0"}</span>
                </div>
                <span className="text-sm">
                  ({reviewSummary.totalReviews} {reviewSummary.totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>

            </div>


            {/* Summary */}
            {tripData.summary && (
              <div className="mt-8 bg-red-50 px-3 py-3 border rounded-lg">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                  About
                </h2>
                <p className="text-gray-700">{tripData.summary}</p>
              </div>
            )}

            {/* Features */}
            {tripData.properties && tripData.properties.length > 0 && (
              <div className="mt-8 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                  Features
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                  {tripData.properties.map((prop: string, index: number) => (
                    <div key={index}>{prop}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Food Items Images - Mobile Carousel */}
            {tripData.foodItems && Array.isArray(tripData.foodItems) && tripData.foodItems.length > 0 && (
              <>
                {/* Mobile Carousel */}
                <div className="mt-8 md:hidden">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                    Food Items
                  </h2>
                  <div className="relative w-full overflow-hidden">
                    <Swiper
                      spaceBetween={15}
                      slidesPerView={1}
                      modules={[Navigation, Autoplay]}
                      navigation
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      loop={tripData.foodItems.length > 1}
                      className="!pb-12 w-full"
                    >
                      {tripData.foodItems.map((img: string, index: number) => (
                        <SwiperSlide key={index}>
                          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
                            <Image
                              src={optimizeCloudinaryUrl(img)}
                              alt={`Food item ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              loading={index < 3 ? "eager" : "lazy"}
                              sizes="100vw"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>

                {/* Desktop Grid Layout */}
                <div className="mt-8 hidden md:block">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                    Food Items
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {tripData.foodItems.map((img: string, index: number) => (
                      <div
                        key={index}
                        className="relative w-full h-64 lg:h-72 rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white"
                      >
                        <Image
                          src={optimizeCloudinaryUrl(img)}
                          alt={`Food item ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading={index < 6 ? "eager" : "lazy"}
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Menu Board Section - Mobile Only */}
            {tripData.menu && tripData.menu.trim() && (
              <div className="mt-8 md:hidden">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                  Menu
                </h2>
                <div className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 rounded-2xl p-4 sm:p-6 shadow-xl border-4 border-amber-300/50">
                  {/* Wood grain texture effect */}
                  <div className="absolute inset-0 rounded-xl opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wood' x='0' y='0' width='100' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 10 Q25 5, 50 10 T100 10' stroke='%238B4513' stroke-width='0.5' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23wood)'/%3E%3C/svg%3E")`,
                    backgroundSize: '100% 20px',
                  }}></div>
                  
                  {/* Scrollable menu content */}
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border-2 border-amber-200/50 shadow-inner overflow-hidden">
                    {/* Scroll top button */}
                    {showScrollTop && (
                      <button
                        onClick={scrollMenuUp}
                        className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 flex items-center justify-center"
                        aria-label="Scroll up"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                    )}
                    
                    {/* Scrollable content */}
                    <div
                      ref={menuScrollRefMobile}
                      className="max-h-96 overflow-y-auto px-6 py-6 menu-board-scrollbar"
                    >
                      <div className="text-gray-800 font-serif">
                        <pre className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed font-medium">
                          {tripData.menu}
                        </pre>
                      </div>
                    </div>
                    
                    {/* Scroll bottom button */}
                    {showScrollBottom && (
                      <button
                        onClick={scrollMenuDown}
                        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 flex items-center justify-center"
                        aria-label="Scroll down"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Decorative corners - wood style */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-600/60 rounded-tl-lg"></div>
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-600/60 rounded-tr-lg"></div>
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-600/60 rounded-bl-lg"></div>
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-600/60 rounded-br-lg"></div>
                </div>
              </div>
            )}

            {/* Packages Section */}
            {tripData.packages && tripData.packages.length > 0 && (
              <div className="px-4 sm:px-6 mb-5 mt-8 relative">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Choose Your Dish/Menu Item
                  </h2>
                </div>

                {/* Info Badge */}
                <div className="inline-block bg-[#7E22CE]/10 text-[#7E22CE] text-xs font-medium px-3 py-1 rounded-full mb-4">
                  💡 Select your preferred dish/menu item to continue booking
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

            {/* Mobile Booking Button - Fixed at bottom */}
            <div className="md:hidden">
              <BookingSidebar
                selectedRooms={selectedPackages}
                title={tripData.name}
                price={`${formatPrice(displayPrice)}/-`}
                oldPrice=""
                savings=""
                isMobile={true}
                isPackage={true}
                destination={destination || tripData.destinationName}
                itemType="trip"
                itemLocation={tripData.location || tripData.destinationName}
                itemImportantInfo={tripData.importantInfo}
              />
            </div>

            {/* Location + Reviews */}
            <div className="px-4 sm:px-6 mb-5">
              <LocationSection 
                location={tripData.location} 
                destinationName={tripData.destinationName} 
              />
            </div>

            {/* Nearby Stays */}
            {tripData.nearbyStays && tripData.nearbyStays.length > 0 && (
              <NearbyItems
                title="Nearby Stays"
                itemIds={tripData.nearbyStays}
                itemType="stay"
              />
            )}

            {/* Nearby Things To Do */}
            {tripData.nearbyActivities && tripData.nearbyActivities.length > 0 && (
              <NearbyItems
                title="Nearby Things To Do"
                itemIds={tripData.nearbyActivities}
                itemType="activity"
              />
            )}

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
            <div className="space-y-6">
              <BookingSidebar
                selectedRooms={selectedPackages}
                title={tripData.name}
                price={formatPrice(displayPrice)}
                oldPrice=""
                savings=""
                className="w-full lg:w-[350px]"
                isPackage={true}
                destination={destination || tripData.destinationName}
                itemType="trip"
                itemLocation={tripData.location || tripData.destinationName}
                itemImportantInfo={tripData.importantInfo}
              />
              
              {/* Menu Board Section - Desktop Only */}
              {tripData.menu && tripData.menu.trim() && (
                <div className="w-full lg:w-[350px]">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">
                    Menu
                  </h2>
                  <div className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 rounded-2xl p-4 shadow-xl border-4 border-amber-300/50">
                    {/* Wood grain texture effect */}
                    <div className="absolute inset-0 rounded-xl opacity-5" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='wood' x='0' y='0' width='100' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 10 Q25 5, 50 10 T100 10' stroke='%238B4513' stroke-width='0.5' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23wood)'/%3E%3C/svg%3E")`,
                      backgroundSize: '100% 20px',
                    }}></div>
                    
                    {/* Scrollable menu content */}
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-xl border-2 border-amber-200/50 shadow-inner overflow-hidden">
                      {/* Scroll top button */}
                      {showScrollTop && (
                        <button
                          onClick={scrollMenuUp}
                          className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 flex items-center justify-center"
                          aria-label="Scroll up"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                      )}
                      
                      {/* Scrollable content */}
                      <div
                        ref={menuScrollRefDesktop}
                        className="max-h-[600px] lg:max-h-[700px] overflow-y-auto px-4 py-4 menu-board-scrollbar"
                      >
                        <div className="text-gray-800 font-serif">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                            {tripData.menu}
                          </pre>
                        </div>
                      </div>
                      
                      {/* Scroll bottom button */}
                      {showScrollBottom && (
                        <button
                          onClick={scrollMenuDown}
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 flex items-center justify-center"
                          aria-label="Scroll down"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Decorative corners - wood style */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-600/60 rounded-tl-lg"></div>
                    <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-600/60 rounded-tr-lg"></div>
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-600/60 rounded-bl-lg"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-600/60 rounded-br-lg"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Booking Tab - Always show */}
      {tripData && (
        <BottomBookingTab
          selectedPackages={selectedPackages}
          title={tripData.name}
          price={formatPrice(displayPrice)}
          itemType="trip"
          destination={destination || tripData.destinationName}
        />
      )}

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
            <p className="mt-4 text-gray-600">Loading restaurant/cafe details...</p>
          </div>
        </div>
      }
    >
      <TripDetailsContent />
    </Suspense>
  );
};

export default TripDetails;

