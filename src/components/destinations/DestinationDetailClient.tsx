"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, MapPin, ChevronRight, Home, MessageCircle } from "lucide-react";
import { LeadFormPopup } from "@/components/LeadFormPopup";
import { getPrimaryWhatsAppNumber, formatWhatsAppNumber } from "@/utils/whatsapp";

interface DestinationDetailClientProps {
  slug: string;
  category?: string;
}

interface Destination {
  id: string;
  name: string;
  slug: string;
  location: string;
  coverImage: string;
  startingPrice: number;
  currency: string;
  summary: string;
  tags: string[];
  customImages?: string[];
  overviewHeading?: string;
  overviewDescription?: string;
}

interface Stay {
  id: string;
  name: string;
  coverImage: string;
  startingPrice: number;
  highlights: string[];
  category?: string;
}

interface Activity {
  id: string;
  name: string;
  coverImage: string;
  duration: string;
  price: number;
  category?: string;
}

interface Trip {
  id: string;
  name: string;
  coverImage: string;
  price: number;
  duration: string;
  category?: string;
}

export default function DestinationDetailClient({ slug, category }: DestinationDetailClientProps) {
  const router = useRouter();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [stays, setStays] = useState<Stay[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  
  // Create stable slug value for dependency array
  const stableSlug = useMemo(() => slug || 'destination', [slug]);

  // Determine which category to show first
  const getDefaultCategory = () => {
    if (category === "things-to-do") return "activities";
    if (category === "restaurants-cafes" || category === "getaways") return "trips";
    return "stays"; // default
  };

  const [activeSection, setActiveSection] = useState<string>(getDefaultCategory());
  const [activeTab, setActiveTab] = useState<string>('');

  // Carousel setup for destination images
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const encodedSlug = encodeURIComponent(slug);
        const res = await fetch(`/api/destinations/${encodedSlug}`);
        
        if (res.ok) {
          const data = await res.json();
          setDestination(data.data.destination);
          setStays(data.data.stays || []);
          setActivities(data.data.activities || []);
          setTrips(data.data.trips || []);
        }
      } catch (error) {
        console.error("Error fetching destination data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Popup scroll detection for destination overview page (both mobile and desktop)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!stableSlug) return;

    const formFilled = localStorage.getItem('leadFormFilled') === 'true';
    const popupKey = `leadPopup_destination_${stableSlug}`;

    // Check cooldown based on form filled status
    const lastShownTimestamp = localStorage.getItem(popupKey);
    if (lastShownTimestamp) {
      const lastShown = parseInt(lastShownTimestamp, 10);
      const now = Date.now();
      const cooldownMs = formFilled 
        ? 24 * 60 * 60 * 1000  // 24 hours if filled
        : 30 * 60 * 1000;      // 30 minutes if not filled
      
      if (now - lastShown < cooldownMs) {
        setHasShownPopup(true);
        return; // Still in cooldown period
      }
    }

    let timeoutId: NodeJS.Timeout;
    let scrollTimeoutId: NodeJS.Timeout;
    let popupTriggered = false;

    // Wait for page to load before checking
    const checkScroll = () => {
      if (hasShownPopup || popupTriggered) return;

      // Look for overview section
      const overviewSection = document.getElementById('destination-overview-section');
      
      if (!overviewSection) {
        // Retry after a short delay if element not found
        timeoutId = setTimeout(checkScroll, 500);
        return;
      }

      const rect = overviewSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger when overview section is scrolled into view (middle of viewport)
      if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3 && !popupTriggered) {
        popupTriggered = true;
        // Add a small delay before showing popup for better UX
        scrollTimeoutId = setTimeout(() => {
          setShowLeadPopup(true);
          setHasShownPopup(true);
          localStorage.setItem(popupKey, Date.now().toString());
        }, 300);
      }
    };

    // Scroll detection
    const handleScroll = () => {
      // Debounce scroll events
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(checkScroll, 150);
    };

    // Initial check after component mounts and page loads
    timeoutId = setTimeout(checkScroll, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasShownPopup, stableSlug]);

  const handleItemClick = (itemId: string, type: "stay" | "activity" | "trip") => {
    const destinationName = encodeURIComponent(destination?.name || slug);
    let queryParam = "";
    let targetPage = "";

    if (type === "stay") {
      queryParam = `stay=${itemId}`;
      targetPage = "/item-details";
    } else if (type === "activity") {
      queryParam = `things-to-do=${itemId}`;
      targetPage = "/things-to-do";
    } else if (type === "trip") {
      queryParam = `trips=${itemId}`;
      targetPage = "/trips";
    }

    router.push(`${targetPage}?destination=${destinationName}&${queryParam}`);
  };

  const handleViewAll = (type: "stays" | "activities" | "trips") => {
    const destinationName = encodeURIComponent(destination?.name || slug);
    let categoryParam = "";

    if (type === "activities") {
      categoryParam = "things-to-do";
    } else if (type === "trips") {
      categoryParam = "restaurants-cafes";
    }

    const queryParams = new URLSearchParams({
      destination: destinationName,
    });

    if (categoryParam) {
      queryParams.set("category", categoryParam);
    }

    router.push(`/stay-listings?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E51A4B] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination...</p>
        </motion.div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-6">The destination you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/destinations")}
            className="bg-[#E51A4B] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
          >
            Browse Destinations
          </button>
        </motion.div>
      </div>
    );
  }

  // Prepare images for carousel
  const carouselImages = destination.customImages && destination.customImages.length > 0
    ? destination.customImages
    : [destination.coverImage];

  // Order sections based on category selection
  const sections = [
    { key: "stays", title: "Stays", items: stays, type: "stay" as const },
    { key: "activities", title: "Things to Do", items: activities, type: "activity" as const },
    { key: "trips", title: "Food spots", items: trips, type: "trip" as const },
  ];

  // Reorder sections based on activeSection
  const orderedSections = [
    ...sections.filter(s => s.key === activeSection),
    ...sections.filter(s => s.key !== activeSection),
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#E51A4B]/5 to-pink-300/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-blue-300/5 to-cyan-300/5 rounded-full blur-3xl"
        />
      </div>

      {/* Breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 border-b border-gray-200 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="text-gray-600 hover:text-[#E51A4B] transition-colors flex items-center gap-1">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Home className="w-4 h-4" />
                </motion.div>
                <span>Home</span>
              </Link>
            </motion.div>
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/destinations" className="text-gray-600 hover:text-[#E51A4B] transition-colors">
                Destinations
              </Link>
            </motion.div>
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-900 font-medium font-display"
            >
              {destination.name}
            </motion.span>
          </nav>
        </div>
      </motion.div>

      {/* Destination Images Carousel */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        {/* Fixed Navigation Tabs Overlay */}
        {(stays.length > 0 || activities.length > 0 || trips.length > 0) && (
          <div className="absolute top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 md:gap-4 rounded-lg md:rounded-full px-2 sm:px-4 md:px-6 py-1.5 sm:py-3"
            >
              <motion.button
                onClick={() => {
                  setActiveTab('overview');
                  document.getElementById('destination-overview-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-2.5 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 text-white font-semibold text-xs sm:text-base md:text-lg border-2 rounded-full transition-all duration-300 ${
                  activeTab === 'overview' 
                    ? 'border-[#E51A4B] shadow-[0_0_15px_rgba(229,26,75,0.5)]' 
                    : 'border-white/40 hover:border-white/60'
                }`}
              >
                Overview
              </motion.button>
              {stays.length > 0 && (
                <motion.button
                  onClick={() => {
                    setActiveTab('stays');
                    document.getElementById('section-stays')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 text-white font-semibold text-xs sm:text-base md:text-lg border-2 rounded-full transition-all duration-300 ${
                    activeTab === 'stays' 
                      ? 'border-[#E51A4B] shadow-[0_0_15px_rgba(229,26,75,0.5)]' 
                      : 'border-white/40 hover:border-white/60'
                  }`}
                >
                  Stays
                </motion.button>
              )}
              {activities.length > 0 && (
                <motion.button
                  onClick={() => {
                    setActiveTab('activities');
                    document.getElementById('section-activities')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 text-white font-semibold text-xs sm:text-base md:text-lg border-2 rounded-full transition-all duration-300 ${
                    activeTab === 'activities' 
                      ? 'border-[#E51A4B] shadow-[0_0_15px_rgba(229,26,75,0.5)]' 
                      : 'border-white/40 hover:border-white/60'
                  }`}
                >
                  Things to Do
                </motion.button>
              )}
              {trips.length > 0 && (
                <motion.button
                  onClick={() => {
                    setActiveTab('trips');
                    document.getElementById('section-trips')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-2.5 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 text-white font-semibold text-xs sm:text-base md:text-lg border-2 rounded-full transition-all duration-300 ${
                    activeTab === 'trips' 
                      ? 'border-[#E51A4B] shadow-[0_0_15px_rgba(229,26,75,0.5)]' 
                      : 'border-white/40 hover:border-white/60'
                  }`}
                >
                  Food spots
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
        
        {/* Decorative Border Glow */}
        <motion.div
          animate={{
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-2 bg-gradient-to-r from-[#E51A4B] via-blue-500 to-purple-500 rounded-3xl blur-2xl -z-10"
        />
        
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 h-full">
          <div className="overflow-hidden h-full rounded-2xl" ref={emblaRef}>
            <div className="flex h-full">
              {carouselImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="relative w-full h-full"
                    >
                      <img
                        src={optimizeCloudinaryUrl(image)}
                        alt={`${destination.name} - Image ${index + 1}`}
                        width={1920}
                        height={1080}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </motion.div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                    
                    {/* Animated Shine Effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation - Enhanced Arrows */}
          {carouselImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <motion.button
                onClick={scrollPrev}
                whileHover={{ scale: 1.15, x: -8 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 group/arrow"
                aria-label="Previous image"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(229, 26, 75, 0.3)",
                        "0 0 40px rgba(229, 26, 75, 0.5)",
                        "0 0 20px rgba(229, 26, 75, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-[#E51A4B] to-pink-500 rounded-full blur-lg opacity-50"
                  />
                  
                  {/* Button */}
                  <div className="relative bg-gradient-to-r from-[#E51A4B] to-pink-600 text-white p-4 sm:p-5 md:p-6 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-md group-hover/arrow:from-[#E51A4B] group-hover/arrow:to-red-700 transition-all duration-300">
                    <motion.div
                      animate={{ x: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Pulse Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-[#E51A4B] rounded-full"
                  />
                </div>
              </motion.button>

              {/* Right Arrow */}
              <motion.button
                onClick={scrollNext}
                whileHover={{ scale: 1.15, x: 8 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 group/arrow"
                aria-label="Next image"
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(229, 26, 75, 0.3)",
                        "0 0 40px rgba(229, 26, 75, 0.5)",
                        "0 0 20px rgba(229, 26, 75, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-l from-[#E51A4B] to-pink-500 rounded-full blur-lg opacity-50"
                  />
                  
                  {/* Button */}
                  <div className="relative bg-gradient-to-l from-[#E51A4B] to-pink-600 text-white p-4 sm:p-5 md:p-6 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-md group-hover/arrow:from-[#E51A4B] group-hover/arrow:to-red-700 transition-all duration-300">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                  
                  {/* Pulse Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-2 border-[#E51A4B] rounded-full"
                  />
                </div>
              </motion.button>
            </>
          )}

          {/* Progress Bar */}
          {carouselImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E51A4B] via-pink-500 to-[#E51A4B]"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((selectedIndex + 1) / carouselImages.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {/* Carousel Indicators */}
          {carouselImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full shadow-xl">
              {carouselImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                  aria-label={`Go to image ${index + 1}`}
                >
                  <motion.div
                    className={`h-2 sm:h-2.5 rounded-full ${
                      selectedIndex === index
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    animate={{
                      width: selectedIndex === index ? '32px' : '8px',
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              ))}
            </div>
          )}

          {/* Destination Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Background Glow for Text */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent blur-2xl -z-10"
              />
              
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 drop-shadow-2xl relative font-display"
              >
                <span className="relative z-10">{destination.name}</span>
                {/* Text Glow Effect */}
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                      "0 0 40px rgba(255, 255, 255, 0.8)",
                      "0 0 20px rgba(255, 255, 255, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white blur-sm opacity-50"
                >
                  {destination.name}
                </motion.span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-2 text-white/90"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
                <span className="text-lg sm:text-xl font-medium">{destination.location}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>


      {/* Overview Section with Animated Background */}
      <section id="destination-overview-section" className="relative py-12 sm:py-16 md:py-20 z-10 overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating orbs */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#E51A4B]/20 via-pink-300/15 to-rose-200/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/20 via-cyan-300/15 to-sky-200/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -40, 0],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-300/15 via-pink-300/10 to-rose-200/10 rounded-full blur-3xl"
          />
          
          {/* Additional smaller animated particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                scale: [0.5, 1, 0.5],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              className="absolute w-32 h-32 bg-gradient-to-br from-[#E51A4B]/10 to-pink-300/5 rounded-full blur-2xl"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`
              }}
            />
          ))}
          
          {/* Animated gradient mesh */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(229, 26, 75, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              backgroundSize: '200% 200%'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16 border border-white/50 overflow-hidden"
          >
            {/* Card inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/50 rounded-3xl opacity-90" />
            
            {/* Animated border glow */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#E51A4B]/10 via-pink-300/10 to-[#E51A4B]/10 blur-xl -z-10"
            />
            
            {/* Shine effect */}
            <motion.div
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"
              style={{ transform: 'skewX(-12deg)' }}
            />
            
            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
              {/* Breadcrumb Style Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <nav className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-6">
                  <motion.div
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/destinations" className="hover:text-[#E51A4B] transition-colors font-medium">
                      Destinations
                    </Link>
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-900 font-semibold font-display"
                  >
                    {destination.name}
                  </motion.span>
                </nav>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-display relative"
              >
                <span className="relative z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {destination.overviewHeading || `About ${destination.name}`}
                </span>
                {/* Decorative underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-1 bg-gradient-to-r from-[#E51A4B] via-pink-500 to-[#E51A4B] mt-3 rounded-full"
                />
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="prose prose-lg sm:prose-xl max-w-none"
              >
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed sm:leading-loose font-light">
                  {destination.overviewDescription || destination.summary}
                </p>
              </motion.div>

              {/* Need Support Section - Elegant Ad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-8 sm:mt-10"
              >
                <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                  {/* Subtle gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E51A4B]/5 via-transparent to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E51A4B] animate-pulse" />
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          Need Guidance?
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 ml-3.5">
                        Let's create wonderful memories together
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setShowLeadPopup(true)}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-shrink-0 inline-flex items-center gap-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-medium px-5 sm:px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-300 text-sm whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Connect</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        {orderedSections.map((section, sectionIndex) => {
          if (section.items.length === 0) return null;

          return (
            <motion.section
              key={section.key}
              id={`section-${section.key}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: sectionIndex * 0.15 }}
              className="mb-16 sm:mb-20 scroll-mt-24"
            >
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.15 + 0.2 }}
                className="flex items-center justify-between mb-8 sm:mb-10"
              >
                <div className="relative">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 relative z-10 font-display">
                    {section.title}
                  </h2>
                  {/* Underline Animation */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: sectionIndex * 0.15 + 0.4 }}
                    className="h-1 bg-gradient-to-r from-[#E51A4B] to-pink-500 mt-2 rounded-full"
                  />
                </div>
                {section.items.length > 6 && (
                  <motion.button
                    onClick={() => handleViewAll(section.key as "stays" | "activities" | "trips")}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-[#E51A4B] font-semibold hover:text-red-700 transition-colors group"
                  >
                    <span>View All</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                )}
              </motion.div>

              {/* Cards Grid */}
              <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
                {section.items.slice(0, 8).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: sectionIndex * 0.1 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => handleItemClick(item.id, section.type)}
                    className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative flex-shrink-0 w-[280px] sm:w-auto sm:flex-shrink"
                  >
                    {/* Card Glow on Hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute -inset-0.5 bg-gradient-to-r from-[#E51A4B] via-pink-500 to-[#E51A4B] rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"
                    />
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full"
                      >
                        <img
                          src={optimizeCloudinaryUrl(item.coverImage)}
                          alt={item.name}
                          width={400}
                          height={300}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                      
                      {/* Price Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: sectionIndex * 0.1 + index * 0.1 + 0.2 }}
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/50"
                      >
                        <p className="text-[#E51A4B] font-bold text-sm sm:text-base">
                          ₹{section.type === "stay" ? (item as Stay).startingPrice : (item as Activity | Trip).price}
                          {section.type === "stay" && <span className="text-xs text-gray-600"> / night</span>}
                        </p>
                      </motion.div>
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col h-full">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#E51A4B] transition line-clamp-2 font-display">
                        {item.name}
                      </h3>
                      {section.type === "stay" && (item as Stay).highlights && (item as Stay).highlights.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {(item as Stay).highlights.slice(0, 2).map((highlight, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 bg-[#E51A4B] rounded-full" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.type !== "stay" && (
                        <p className="text-sm text-gray-600 mb-4">
                          Duration: {(item as Activity | Trip).duration}
                        </p>
                      )}
                      
                      {/* CTA Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item.id, section.type);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-auto bg-gradient-to-r from-[#E51A4B] to-pink-600 text-white font-semibold py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        <span>View Details</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
      <LeadFormPopup
        isOpen={showLeadPopup}
        onClose={() => setShowLeadPopup(false)}
        onSkip={() => setShowLeadPopup(false)}
        itemName={destination?.name}
        itemDestination={destination?.name}
      />
    </div>
  );
}

