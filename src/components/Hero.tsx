"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
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

interface SearchResult {
  type: 'destination' | 'activity' | 'trip';
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

export function Hero({ banners = [] }: HeroProps) {
  // Use provided banners or default banners
  const displayBanners = banners.length > 0 ? banners : defaultBanners;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stays' | 'things-to-do' | 'restaurants-cafes'>('stays');
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  // Fetch destinations, activities, and trips
  useEffect(() => {
    // Fetch destinations
      fetch('/api/destinations')
        .then(res => res.json())
        .then(data => {
          setDestinations(data.data || []);
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
  }, []);

  // Filter search results based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results: SearchResult[] = [];

      // Add matching destinations
      destinations
        .filter(dest => dest.name.toLowerCase().includes(query))
        .forEach(dest => {
          results.push({
            type: 'destination',
            id: dest._id || dest.slug || '',
            name: dest.name,
            slug: dest.slug,
          });
        });

      // Add matching activities (things to do)
      activities
        .filter(activity => activity.name.toLowerCase().includes(query))
        .forEach(activity => {
          results.push({
            type: 'activity',
            id: activity._id || activity.id,
            name: activity.name,
            destination: activity.destination || activity.destinationSlug,
          });
        });

      // Add matching trips (restaurants & cafes)
      trips
        .filter(trip => trip.name.toLowerCase().includes(query))
        .forEach(trip => {
          results.push({
            type: 'trip',
            id: trip._id || trip.id,
            name: trip.name,
            destination: trip.destination || trip.destinationSlug,
          });
        });

      setSearchResults(results);
      setShowSearchDropdown(results.length > 0);
    } else {
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  }, [searchQuery, destinations, activities, trips]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    
    // Check if it's a destination
    const selectedDest = destinations.find(
      d => d.name.toLowerCase() === query
    );
    
    if (selectedDest && selectedDest.slug) {
      // Navigate to destination detail page with category
      let categoryParam = '';
      if (activeTab === 'things-to-do') {
        categoryParam = 'things-to-do';
      } else if (activeTab === 'restaurants-cafes') {
        categoryParam = 'restaurants-cafes';
      }
      
      const queryParams = new URLSearchParams();
      if (categoryParam) {
        queryParams.set('category', categoryParam);
      }
      
      const url = categoryParam 
        ? `/destinations/${selectedDest.slug}?${queryParams.toString()}`
        : `/destinations/${selectedDest.slug}`;
      
      router.push(url);
      return;
    }

    // Check if it's an activity (thing to do)
    const selectedActivity = activities.find(
      a => a.name.toLowerCase() === query
    );
    
    if (selectedActivity) {
      const destinationName = selectedActivity.destination || '';
      const queryParams = new URLSearchParams({
        'things-to-do': selectedActivity._id || selectedActivity.id,
      });
      if (destinationName) {
        queryParams.set('destination', destinationName);
      }
      router.push(`/things-to-do?${queryParams.toString()}`);
      return;
    }

    // Check if it's a trip (restaurant/cafe)
    const selectedTrip = trips.find(
      t => t.name.toLowerCase() === query
    );
    
    if (selectedTrip) {
      const destinationName = selectedTrip.destination || '';
      const queryParams = new URLSearchParams({
        trips: selectedTrip._id || selectedTrip.id,
      });
      if (destinationName) {
        queryParams.set('destination', destinationName);
      }
      router.push(`/trips?${queryParams.toString()}`);
      return;
    }

    // Fallback to stay-listings if nothing found
    const encodedDestination = encodeURIComponent(searchQuery.trim());
    let categoryParam = '';
    
    if (activeTab === 'things-to-do') {
      categoryParam = 'things-to-do';
    } else if (activeTab === 'restaurants-cafes') {
      categoryParam = 'restaurants-cafes';
    }

    const queryParams = new URLSearchParams({
      destination: encodedDestination,
    });
    
    if (categoryParam) {
      queryParams.set('category', categoryParam);
    }

    router.push(`/stay-listings?${queryParams.toString()}`);
  };

  const handleSearchResultSelect = (result: SearchResult) => {
    setSearchQuery(result.name);
    setShowSearchDropdown(false);
    
    if (result.type === 'destination' && result.slug) {
      // Navigate to destination detail page with category filter
      let categoryParam = '';
      if (activeTab === 'things-to-do') {
        categoryParam = 'things-to-do';
      } else if (activeTab === 'restaurants-cafes') {
        categoryParam = 'restaurants-cafes';
      }
      
      const queryParams = new URLSearchParams();
      if (categoryParam) {
        queryParams.set('category', categoryParam);
      }
      
      const url = categoryParam 
        ? `/destinations/${result.slug}?${queryParams.toString()}`
        : `/destinations/${result.slug}`;
      
      router.push(url);
    } else if (result.type === 'activity') {
      // Navigate to things to do details page
      const destinationName = result.destination || '';
      const queryParams = new URLSearchParams({
        'things-to-do': result.id,
      });
      if (destinationName) {
        queryParams.set('destination', destinationName);
      }
      router.push(`/things-to-do?${queryParams.toString()}`);
    } else if (result.type === 'trip') {
      // Navigate to trips/restaurants & cafes details page
      const destinationName = result.destination || '';
      const queryParams = new URLSearchParams({
        trips: result.id,
      });
      if (destinationName) {
        queryParams.set('destination', destinationName);
      }
      router.push(`/trips?${queryParams.toString()}`);
    }
  };

  const handleTabClick = (tab: 'stays' | 'things-to-do' | 'restaurants-cafes') => {
    setActiveTab(tab);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-pink-50/30 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E51A4B]/10 to-pink-300/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-300/10 to-pink-300/10 rounded-full blur-3xl"
        />

        {/* Floating Geometric Shapes */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-20 h-20 border-2 border-[#E51A4B]/20 rounded-lg"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-20 w-16 h-16 border-2 border-blue-400/20 rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: [0, -360],
            x: [0, 40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-20 w-12 h-12 border-2 border-green-400/20 transform rotate-45"
        />

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-[#E51A4B]/30 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}

        {/* Floating elements based on active tab */}
        {activeTab === 'stays' && (
          <>
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-10 opacity-10"
            >
              <Bed className="w-32 h-32 text-[#E51A4B]" />
            </motion.div>
            <motion.div
              animate={{ x: [0, 50, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-10 opacity-10"
            >
              <Bed className="w-24 h-24 text-green-600" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -40, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 left-1/4 opacity-10"
            >
              <Bed className="w-20 h-20 text-blue-500" />
            </motion.div>
            <motion.div
              animate={{ 
                x: [0, -30, 0],
                y: [0, 20, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/3 right-1/4 opacity-10"
            >
              <Bed className="w-16 h-16 text-purple-500" />
            </motion.div>
          </>
        )}

        {activeTab === 'things-to-do' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 right-10 opacity-10"
            >
              <Camera className="w-32 h-32 text-[#E51A4B]" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-10 opacity-10"
            >
              <Camera className="w-24 h-24 text-blue-600" />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 right-1/3 opacity-10"
            >
              <Camera className="w-20 h-20 text-green-500" />
            </motion.div>
            <motion.div
              animate={{ 
                y: [0, -25, 0],
                x: [0, 15, 0],
                rotate: [0, -15, 15, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 left-1/3 opacity-10"
            >
              <Camera className="w-16 h-16 text-orange-500" />
            </motion.div>
          </>
        )}

        {activeTab === 'restaurants-cafes' && (
          <>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-10 opacity-10"
            >
              <UtensilsCrossed className="w-32 h-32 text-[#E51A4B]" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -25, 0], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-10 opacity-10"
            >
              <UtensilsCrossed className="w-24 h-24 text-orange-600" />
            </motion.div>
            <motion.div
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0],
                rotate: [0, 20, -20, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/3 right-1/4 opacity-10"
            >
              <UtensilsCrossed className="w-20 h-20 text-red-500" />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.25, 1],
                rotate: [0, -20, 20, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/3 left-1/4 opacity-10"
            >
              <UtensilsCrossed className="w-16 h-16 text-yellow-500" />
            </motion.div>
          </>
        )}

        {/* Animated Lines/Waves */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-5"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <motion.path
            d="M0,540 Q480,270 960,540 T1920,540"
            stroke="#E51A4B"
            strokeWidth="2"
            fill="none"
            animate={{
              d: [
                "M0,540 Q480,270 960,540 T1920,540",
                "M0,540 Q480,810 960,540 T1920,540",
                "M0,540 Q480,270 960,540 T1920,540",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,270 Q640,135 1280,270 T2560,270"
            stroke="#3B82F6"
            strokeWidth="2"
            fill="none"
            animate={{
              d: [
                "M0,270 Q640,135 1280,270 T2560,270",
                "M0,270 Q640,405 1280,270 T2560,270",
                "M0,270 Q640,135 1280,270 T2560,270",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-28 sm:pt-32 md:pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 font-display relative inline-block"
          >
            <span className="relative z-10 text-gray-900 tracking-tight">
              Where next
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
              className="inline-block ml-2 text-[#E51A4B]"
            >
              ?
            </motion.span>
            {/* Subtle shadow effect */}
            <motion.div
              animate={{
                textShadow: [
                  "0 0 0px rgba(229, 26, 75, 0)",
                  "0 0 20px rgba(229, 26, 75, 0.3)",
                  "0 0 0px rgba(229, 26, 75, 0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#E51A4B] blur-sm opacity-30 -z-10"
            >
              Where next?
            </motion.div>
          </motion.h1>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-center gap-1.5 sm:gap-4 mb-8 w-full max-w-full overflow-hidden"
        >
          <button
            onClick={() => handleTabClick('stays')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition-all flex-shrink-0 ${
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
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition-all flex-shrink-0 ${
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
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-base transition-all flex-shrink ${
              activeTab === 'restaurants-cafes'
                ? 'bg-[#E51A4B] text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-center leading-tight">Restaurants & Cafes</span>
          </button>
        </motion.div>

        {/* Big Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative">
            <div className="flex items-center bg-gray-50 rounded-full border-2 border-gray-200 focus-within:border-[#E51A4B] transition-all shadow-lg">
              <div className="pl-4 sm:pl-6">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Destinations, stays, things to do, restaurants & cafes"
                className="flex-1 px-4 sm:px-6 py-4 sm:py-5 bg-transparent border-none outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                {searchResults.map((result, index) => {
                  const getTypeLabel = () => {
                    switch (result.type) {
                      case 'destination':
                        return 'Destination';
                      case 'activity':
                        return 'Thing to Do';
                      case 'trip':
                        return 'Restaurant/Cafe';
                      default:
                        return '';
                    }
                  };

                  const getTypeColor = () => {
                    switch (result.type) {
                      case 'destination':
                        return 'bg-blue-100 text-blue-700';
                      case 'activity':
                        return 'bg-green-100 text-green-700';
                      case 'trip':
                        return 'bg-purple-100 text-purple-700';
                      default:
                        return 'bg-gray-100 text-gray-700';
                    }
                  };

                  return (
                    <button
                      key={`${result.type}-${result.id}-${index}`}
                      onClick={() => handleSearchResultSelect(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${getTypeColor()}`}>
                          {getTypeLabel()}
                        </span>
                        <span className="text-gray-900 font-medium truncate group-hover:text-[#E51A4B] transition-colors">
                          {result.name}
                        </span>
                      </div>
                      {result.destination && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {result.destination}
                        </span>
                      )}
                    </button>
                  );
                })}
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
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] xl:h-[750px] 2xl:h-[800px] overflow-hidden"
                        >
                          {banner.link ? (
                            <a href={banner.link} className="block w-full h-full group/banner">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative w-full h-full"
                              >
                                <img
                                  src={optimizeCloudinaryUrl(banner.image)}
                                  alt={banner.title || 'Banner'}
                                  width={1920}
                                  height={1080}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110"
                                  loading={index === 0 ? "eager" : "lazy"}
                                />
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
                                
                                {banner.title && (
                                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12">
                                    <motion.div
                                      initial={{ opacity: 0, y: 30 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.8, delay: 0.3 }}
                                      className="text-center max-w-4xl"
                                    >
                                      <motion.h3
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl font-display"
                                      >
                                        {banner.title}
                                      </motion.h3>
                                      {/* Decorative Underline */}
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.8, delay: 0.7 }}
                                        className="h-1 bg-gradient-to-r from-transparent via-[#E51A4B] to-transparent mx-auto max-w-xs"
                                      />
                                    </motion.div>
          </div>
                                )}
                              </motion.div>
                            </a>
                          ) : (
                            <div className="relative w-full h-full group/banner">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative w-full h-full"
                              >
                                <img
                                  src={optimizeCloudinaryUrl(banner.image)}
                                  alt={banner.title || 'Banner'}
                                  width={1920}
                                  height={1080}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-110"
                                  loading={index === 0 ? "eager" : "lazy"}
                                />
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
                                
                                {banner.title && (
                                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12">
                                    <motion.div
                                      initial={{ opacity: 0, y: 30 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.8, delay: 0.3 }}
                                      className="text-center max-w-4xl"
                                    >
                                      <motion.h3
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl font-display"
                                      >
                                        {banner.title}
                                      </motion.h3>
                                      {/* Decorative Underline */}
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 0.8, delay: 0.7 }}
                                        className="h-1 bg-gradient-to-r from-transparent via-[#E51A4B] to-transparent mx-auto max-w-xs"
                                      />
                                    </motion.div>
                                  </div>
                                )}
                              </motion.div>
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
                    <motion.button
                      onClick={scrollPrev}
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all z-20 backdrop-blur-sm border border-gray-200/50 group/btn"
                      aria-label="Previous banner"
                    >
                      <motion.svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, -3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </motion.svg>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E51A4B]/0 to-[#E51A4B]/0 group-hover/btn:from-[#E51A4B]/10 group-hover/btn:to-transparent transition-all duration-300" />
                    </motion.button>
                    <motion.button
                      onClick={scrollNext}
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 sm:p-4 rounded-full shadow-2xl transition-all z-20 backdrop-blur-sm border border-gray-200/50 group/btn"
                      aria-label="Next banner"
                    >
                      <motion.svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </motion.svg>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-l from-[#E51A4B]/0 to-[#E51A4B]/0 group-hover/btn:from-[#E51A4B]/10 group-hover/btn:to-transparent transition-all duration-300" />
                    </motion.button>
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
                      transition={{ duration: 0.3 }}
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
    </section>
  );
}
