"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Bed, Camera, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';

interface Destination {
  _id?: string;
  slug?: string;
  name: string;
}

interface Activity {
  _id?: string;
  id: string;
  name: string;
  destinationSlug?: string;
  destination?: string;
}

interface Trip {
  _id?: string;
  id: string;
  name: string;
  destinationSlug?: string;
  destination?: string;
}

interface Stay {
  _id?: string;
  id: string;
  name: string;
  destinationSlug?: string;
  destination?: string;
}

interface SearchResult {
  type: 'destination' | 'activity' | 'trip' | 'stay';
  id: string;
  name: string;
  slug?: string;
  destination?: string;
}

interface HeroBanner {
  id: string;
  image: string;
  title?: string;
  link?: string;
}

interface HeroProps {
  banners?: HeroBanner[];
}

// Default carousel banners
const defaultBanners: HeroBanner[] = [
  {
    id: 'default-1',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=1920',
    title: 'Discover Amazing Destinations',
    link: '',
  },
  {
    id: 'default-2',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=1920',
    title: 'Your Perfect Stay Awaits',
    link: '',
  },
  {
    id: 'default-3',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=1920',
    title: 'Explore Hidden Gems',
    link: '',
  },
];

// Helper component to safely animate SVG paths without framer-motion d attribute animation
function AnimatedPath({ paths, stroke, strokeWidth, duration }: { 
  paths: string[]; 
  stroke: string; 
  strokeWidth: string | number;
  duration: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [currentPath, setCurrentPath] = useState<string>(paths[0] || "");

  useEffect(() => {
    if (!paths || paths.length < 2) return;
    
    let index = 0;
    const stepDuration = (duration * 1000) / paths.length;
    
    const interval = setInterval(() => {
      index = (index + 1) % paths.length;
      const nextPath = paths[index];
      if (nextPath && typeof nextPath === 'string') {
        setCurrentPath(nextPath);
        if (pathRef.current) {
          pathRef.current.setAttribute('d', nextPath);
        }
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [paths, duration]);

  // Ensure we always have a valid path string
  const safePath = currentPath || paths[0] || "";

  if (!safePath) return null;

  return (
    <path
      ref={pathRef}
      d={safePath}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
}

export function Hero({ banners = [] }: HeroProps) {
  // Use provided banners or default banners
  const displayBanners = banners.length > 0 ? banners : defaultBanners;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stays' | 'things-to-do' | 'restaurants-cafes' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDestinationPopup, setShowDestinationPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'stays' | 'things-to-do' | 'restaurants-cafes' | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  // Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
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

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobileRef.current) {
        isMobileRef.current = mobile;
        setIsMobile(mobile);
      }
    };
    
    checkMobile();
    
    const handleResize = () => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => {
        if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = setTimeout(checkMobile, 150);
      });
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch destinations, activities, trips, and stays
  useEffect(() => {
    // Fetch destinations
      fetch('/api/destinations')
        .then(res => res.json())
        .then(data => {
          // Sort destinations alphabetically by name
          const sortedDestinations = (data.data || []).sort((a: Destination, b: Destination) => 
            (a.name || '').localeCompare(b.name || '')
          );
          setDestinations(sortedDestinations);
        })
        .catch(() => {});

    // Fetch activities (things to do) - using admin endpoint to get all
    fetch('/api/admin/activities?includeHidden=false')
      .then(res => res.json())
      .then(data => {
        setActivities(data.data || []);
      })
      .catch(() => {});

    // Fetch trips (restaurants & cafes) - using admin endpoint to get all
    fetch('/api/admin/trips?includeHidden=false')
      .then(res => res.json())
      .then(data => {
        setTrips(data.data || []);
      })
      .catch(() => {});

    // Fetch stays - using admin endpoint to get all
    fetch('/api/admin/stays?includeHidden=false')
      .then(res => res.json())
      .then(data => {
        setStays(data.data || []);
      })
      .catch(() => {});
  }, []);

  // Filter search results - Only destinations
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results: SearchResult[] = [];
      const maxResults = isMobile ? 6 : 50; // Limit to 6 results on mobile

      // Only show destinations
      destinations
        .filter(dest => dest.name.toLowerCase().includes(query))
        .slice(0, maxResults)
        .forEach(dest => {
          results.push({
            type: 'destination',
            id: dest._id || dest.slug || '',
            name: dest.name,
            slug: dest.slug,
          });
        });

      setSearchResults(results);
      setShowSearchDropdown(results.length > 0);
    } else {
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  }, [searchQuery, destinations, isMobile]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    
    // Only search for destinations
    const selectedDest = destinations.find(
      d => d.name.toLowerCase() === query
    );
    
    if (selectedDest && selectedDest.slug) {
      // Navigate to destination detail page
      router.push(`/destinations/${selectedDest.slug}`);
      return;
    }

    // If no exact match, show dropdown with matching destinations
    // (handled by useEffect that filters destinations)
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    setSearchQuery(result.name);
    setShowSearchDropdown(false);
    
    // Only handle destinations
    if (result.type === 'destination' && result.slug) {
      router.push(`/destinations/${result.slug}`);
    }
  };

  const handleTabClick = (tab: 'stays' | 'things-to-do' | 'restaurants-cafes' | null) => {
    // Show destination selection popup
    if (tab) {
      setSelectedCategory(tab);
      setShowDestinationPopup(true);
      setSelectedDestination('');
    }
  };

  const handleDestinationSelect = () => {
    if (selectedCategory && selectedDestination) {
      const categoryMap: Record<string, string> = {
        'stays': 'stays',
        'things-to-do': 'things-to-do',
        'restaurants-cafes': 'restaurants-cafes'
      };
      const category = categoryMap[selectedCategory];
      const destination = encodeURIComponent(selectedDestination);
      router.push(`/stay-listings?destination=${destination}&category=${category}`);
      setShowDestinationPopup(false);
      setSelectedCategory(null);
      setSelectedDestination('');
    }
  };

  const handleClosePopup = () => {
    setShowDestinationPopup(false);
    setSelectedCategory(null);
    setSelectedDestination('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle mobile keyboard visibility
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocus = () => {
      setIsInputFocused(true);
      // On mobile, scroll search container to top when keyboard opens
      if (isMobile && searchContainerRef.current) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          setTimeout(() => {
            // Scroll the search container to the top of the viewport
            const containerTop = searchContainerRef.current?.getBoundingClientRect().top || 0;
            const currentScroll = window.scrollY;
            // Use instant scroll instead of smooth to prevent flickering
            window.scrollTo({ 
              top: currentScroll + containerTop - 20, // 20px padding from top
              behavior: 'auto' 
            });
          }, 150);
        });
      }
    };

    const handleBlur = () => {
      // Delay blur to allow click events on dropdown items
      setTimeout(() => {
        setIsInputFocused(false);
      }, 200);
    };

    const input = searchInputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [isMobile]);

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-pink-50/30 min-h-screen" style={{ willChange: 'auto', transform: 'translateZ(0)' }}>
      {/* Simplified Static Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto' }}>
        {/* Static gradient orbs - no animation for better performance */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#E51A4B]/8 to-white/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-gradient-to-tr from-white/8 to-[#E51A4B]/6 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-28 sm:pt-32 md:pt-36 pb-2 sm:pb-8 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 relative">
          {/* Static background glow - no animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-80 h-80 bg-[#E51A4B]/15 rounded-full blur-3xl opacity-50" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 font-display relative inline-block z-10">
            <span className="relative z-10 text-gray-900 tracking-tight">
              Where next
            </span>
            <span className="inline-block ml-2 text-[#E51A4B]">
              ?
            </span>
          </h1>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-nowrap justify-center items-center gap-1 sm:gap-4 mb-8 w-full max-w-full overflow-x-auto px-2"
        >
          <button
            onClick={() => handleTabClick('stays')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition-all flex-shrink-0 whitespace-nowrap ${
              activeTab === 'stays'
                ? 'bg-[#E51A4B] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bed className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Stays</span>
          </button>
          <button 
            onClick={() => handleTabClick('things-to-do')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition-all flex-shrink-0 whitespace-nowrap ${
              activeTab === 'things-to-do'
                ? 'bg-[#E51A4B] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Things to Do</span>
          </button>
          <button 
            onClick={() => handleTabClick('restaurants-cafes')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition-all flex-shrink-0 whitespace-nowrap ${
              activeTab === 'restaurants-cafes'
                ? 'bg-[#E51A4B] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Food spots</span>
          </button>
        </motion.div>

        {/* Big Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
          ref={searchContainerRef}
        >
          <div className="relative z-50">
            {/* Mobile backdrop overlay */}
            {isMobile && isInputFocused && showSearchDropdown && (
              <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[98]"
                onClick={() => {
                  setIsInputFocused(false);
                  setShowSearchDropdown(false);
                  searchInputRef.current?.blur();
                }}
              />
            )}
            
            <div className="flex items-center bg-gray-50 rounded-full border-2 border-gray-200 focus-within:border-[#E51A4B] transition-all shadow-lg relative z-[99]">
              <div className="pl-4 sm:pl-6">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  // Delay blur to allow click events on dropdown items
                  setTimeout(() => {
                    if (!dropdownRef.current?.matches(':hover')) {
                      setIsInputFocused(false);
                    }
                  }, 200);
                }}
                placeholder="Search destination..."
                className="flex-1 px-4 sm:px-6 py-4 sm:py-5 bg-transparent border-none outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div 
                ref={dropdownRef}
                className={`absolute top-full left-0 right-0 mt-2 z-[100] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden ${
                  isMobile && isInputFocused 
                    ? 'max-h-[calc(100vh-220px)]' 
                    : 'max-h-80'
                }`}
                onMouseEnter={() => {
                  if (!isMobile) {
                    setIsInputFocused(true);
                  }
                }}
                onMouseLeave={() => {
                  if (!isMobile) {
                    setIsInputFocused(false);
                  }
                }}
              >
                {/* Scrollable container */}
                <div className="overflow-y-auto max-h-full custom-scrollbar-thin">
                  {searchResults.map((result, index) => {
                    // Only destinations are shown, so simplify the labels
                    const getTypeLabel = () => 'Destination';
                    const getTypeColor = () => 'bg-blue-100 text-blue-700';

                    return (
                      <button
                        key={`${result.type}-${result.id}-${index}`}
                        onClick={() => handleSearchResultSelect(result)}
                        onMouseDown={(e) => {
                          // Prevent input blur on mobile
                          e.preventDefault();
                        }}
                        className="w-full text-left px-4 py-3 sm:py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2 sm:gap-3 group"
                      >
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold flex-shrink-0 ${getTypeColor()}`}>
                          {getTypeLabel()}
                        </span>
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <span className="text-gray-900 font-medium text-sm sm:text-base truncate group-hover:text-[#E51A4B] transition-colors">
                            {result.name}
                          </span>
                          {result.destination && (
                            <span className="text-xs text-gray-500 flex-shrink-0 sm:ml-auto">
                              {result.destination}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* Show more indicator on mobile */}
                  {isMobile && searchQuery.trim() && (
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-center sticky bottom-0">
                      <span className="text-xs text-gray-600">
                        Showing top {searchResults.length} results
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dynamic Banner Carousel */}
        {displayBanners && displayBanners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-7xl lg:max-w-[90vw] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6"
          >
            <div className="relative group">
              {/* Decorative Border Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E51A4B] via-blue-500 to-purple-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
                  <div className="flex">
                    {displayBanners.map((banner, index) => (
                      <div key={banner.id} className="flex-[0_0_100%] min-w-0 relative">
                        <motion.div
                          initial={{ scale: 1.05, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[750px] 2xl:h-[800px] overflow-hidden"
                        >
                          {banner.link ? (
                            <a href={banner.link} className="block w-full h-full group/banner">
                              <div className="relative w-full h-full transition-transform duration-300 group-hover/banner:scale-[1.02]">
                                <img
                                  src={optimizeCloudinaryUrl(banner.image)}
                                  alt={banner.title || 'Banner'}
                                  width={1920}
                                  height={1080}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/banner:scale-105"
                                  loading={index === 0 ? "eager" : "lazy"}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                                
                                {banner.title && (
                                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12">
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.5, delay: 0.2 }}
                                      className="text-center max-w-4xl"
                                    >
                                      <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl font-display"
                                      >
                                        {banner.title}
                                      </motion.h3>
                                      {/* Decorative Underline */}
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="h-1 bg-gradient-to-r from-transparent via-[#E51A4B] to-transparent mx-auto max-w-xs"
                                      />
                                    </motion.div>
                                  </div>
                                )}
                              </div>
                            </a>
                          ) : (
                            <div className="relative w-full h-full group/banner">
                              <div className="relative w-full h-full">
                                <img
                                  src={optimizeCloudinaryUrl(banner.image)}
                                  alt={banner.title || 'Banner'}
                                  width={1920}
                                  height={1080}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/banner:scale-105"
                                  loading={index === 0 ? "eager" : "lazy"}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                                
                                {banner.title && (
                                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12">
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.5, delay: 0.2 }}
                                      className="text-center max-w-4xl"
                                    >
                                      <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl font-display"
                                      >
                                        {banner.title}
                                      </motion.h3>
                                      {/* Decorative Underline */}
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="h-1 bg-gradient-to-r from-transparent via-[#E51A4B] to-transparent mx-auto max-w-xs"
                                      />
                                    </motion.div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Navigation */}
                {displayBanners.length > 1 && (
                  <>
                    <button
                      onClick={scrollPrev}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all z-20 backdrop-blur-sm border border-gray-200/50 group/btn"
                      aria-label="Previous banner"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={scrollNext}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all z-20 backdrop-blur-sm border border-gray-200/50 group/btn"
                      aria-label="Next banner"
                    >
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Progress Bar */}
                {displayBanners.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-20">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#E51A4B] via-pink-500 to-[#E51A4B]"
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${((selectedIndex + 1) / displayBanners.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                )}

                {/* Carousel Indicators */}
                {displayBanners.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full shadow-xl">
                    {displayBanners.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative"
                        aria-label={`Go to slide ${index + 1}`}
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
                        {selectedIndex === index && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Destination Selection Popup */}
      {showDestinationPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClosePopup}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative"
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Popup Content */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Select Destination
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Choose a destination to explore {selectedCategory === 'stays' ? 'stays' : selectedCategory === 'things-to-do' ? 'things to do' : 'food spots'}
              </p>
            </div>

            {/* Destination Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent text-gray-900 bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="">Select a destination</option>
                {destinations.map((dest) => (
                  <option key={dest._id || dest.slug || dest.name} value={dest.slug || dest.name}>
                    {dest.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClosePopup}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDestinationSelect}
                disabled={!selectedDestination}
                className="flex-1 px-4 py-3 bg-[#E51A4B] text-white font-semibold rounded-lg hover:bg-[#c91742] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
