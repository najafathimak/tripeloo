"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X, Heart } from 'lucide-react';
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface Destination {
  _id?: string;
  slug?: string;
  name: string;
}

function TentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="inline h-[0.7em] w-[0.7em] align-baseline">
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 20l9-16 9 16M4 20h16M9 20l3-6 3 6" />
    </svg>
  );
}

interface HeroProps {
  desktopImage?: string;
  mobileImage?: string;
}

export function Hero({ desktopImage, mobileImage }: HeroProps) {
  const router = useRouter();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('stays');
  
  // Fetch destinations when search modal opens
  useEffect(() => {
    if (showSearchModal && destinations.length === 0) {
      setLoadingDestinations(true);
      fetch('/api/destinations')
        .then(res => res.json())
        .then(data => {
          setDestinations(data.data || []);
          setLoadingDestinations(false);
        })
        .catch(() => {
          setLoadingDestinations(false);
        });
    }
  }, [showSearchModal, destinations.length]);
  
  const onNav = (category: 'stays' | 'things-to-do' | 'getaways') => {
    router.push(`/destinations?category=${category}`);
  };

  const handleSearchSubmit = () => {
    if (!selectedDestination) {
      alert('Please select a destination');
      return;
    }

    const destinationName = encodeURIComponent(selectedDestination);
    let categoryParam = '';
    
    if (selectedCategory === 'getaways') {
      categoryParam = 'getaways';
    } else if (selectedCategory === 'things-to-do') {
      categoryParam = 'things-to-do';
    }

    const queryParams = new URLSearchParams({
      destination: destinationName,
    });
    
    if (categoryParam) {
      queryParams.set('category', categoryParam);
    }

    setShowSearchModal(false);
    router.push(`/stay-listings?${queryParams.toString()}`);
  };

  const defaultMobileImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=1080&h=1920";
  const defaultDesktopImage = "https://images.unsplash.com/photo-1610520814919-467f10b43486?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=3840";

  return (
    <section className="relative">
      <div className="relative h-[100svh] sm:h-[100vh] w-full overflow-hidden rounded-none bg-gray-100">
        {/* Mobile background image - Portrait 4K quality */}
        {(mobileImage || defaultMobileImage) && (
          <Image
            src={optimizeCloudinaryUrl(mobileImage || defaultMobileImage)}
            alt="Beautiful nature landscape background"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover sm:hidden"
          />
        )}
        {/* Desktop background image - 4K quality */}
        {(desktopImage || defaultDesktopImage) && (
          <Image
            src={optimizeCloudinaryUrl(desktopImage || defaultDesktopImage)}
            alt="Lush green hills background"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="hidden sm:block object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {/* Compact Search Bar - Top middle, under navigation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-24 sm:top-28 md:top-32 w-full max-w-2xl px-4 z-20">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-4 shadow-lg hover:bg-white/15 transition-all group"
          >
            <div className="flex items-center justify-center gap-3 text-white">
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base font-medium">Click here to quick search</span>
            </div>
          </button>
        </div>

        {/* Desktop: Stable titles with glow animation */}
        <div className="hidden sm:flex absolute inset-0 items-center font-serif justify-center">
          <div className="select-none w-full flex items-center justify-center">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-[4.5vw] sm:text-[5vw] lg:text-[5.5vw] leading-none tracking-tight">
              <button 
                onClick={() => onNav('stays')} 
                className="hero-title-desktop hero-title-1 text-white/95 hover:text-brand transition-colors"
              >
                Stays
              </button>
              <span className="text-white/95"><TentIcon /></span>
              <button 
                onClick={() => onNav('things-to-do')} 
                className="hero-title-desktop hero-title-2 text-white/95 hover:text-brand transition-colors"
              >
                Things to Do
              </button>
              <span className="text-white/95"><TentIcon /></span>
              <button 
                onClick={() => onNav('getaways')} 
                className="hero-title-desktop hero-title-3 text-white/95 hover:text-brand transition-colors"
              >
                Getaways
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked vertical design with icons between */}
        <div className="sm:hidden absolute inset-0 flex items-center font-serif justify-center px-4">
          <div className="select-none w-full flex flex-col items-center justify-center gap-2">
            <button 
              onClick={() => onNav('stays')} 
              className="hero-title-mobile text-white text-4xl font-bold tracking-wide hover:text-brand transition-colors"
            >
              Stays
            </button>
            <span className="hero-title-mobile text-white/95 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 20l9-16 9 16M4 20h16M9 20l3-6 3 6" />
              </svg>
            </span>
            <button 
              onClick={() => onNav('things-to-do')} 
              className="hero-title-mobile text-white text-4xl font-bold tracking-wide hover:text-brand transition-colors"
            >
              Things to Do
            </button>
            <span className="hero-title-mobile text-white/95 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 20l9-16 9 16M4 20h16M9 20l3-6 3 6" />
              </svg>
            </span>
            <button 
              onClick={() => onNav('getaways')} 
              className="hero-title-mobile text-white text-4xl font-bold tracking-wide hover:text-brand transition-colors"
            >
              Getaways
            </button>
          </div>
        </div>

        {/* Search Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowSearchModal(false)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-xl font-bold text-gray-900">Search Destinations</h2>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Destination Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Destination
                  </label>
                  {loadingDestinations ? (
                    <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                      <p className="text-sm text-gray-500">Loading destinations...</p>
                    </div>
                  ) : (
                    <select
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent"
                    >
                      <option value="">Choose a destination...</option>
                      {destinations.map((dest) => (
                        <option key={dest._id || dest.slug} value={dest.name}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Category
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedCategory('stays')}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                        selectedCategory === 'stays'
                          ? 'border-[#E51A4B] bg-[#E51A4B] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Stays
                    </button>
                    <button
                      onClick={() => setSelectedCategory('things-to-do')}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                        selectedCategory === 'things-to-do'
                          ? 'border-[#E51A4B] bg-[#E51A4B] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Things to Do
                    </button>
                    <button
                      onClick={() => setSelectedCategory('getaways')}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-semibold transition ${
                        selectedCategory === 'getaways'
                          ? 'border-[#E51A4B] bg-[#E51A4B] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Getaways
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSearchSubmit}
                  disabled={!selectedDestination}
                  className="w-full bg-[#E51A4B] hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Made with Love in India - Bottom Left */}
        <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 z-20">
          <a
            href="https://madewithloveinindia.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm sm:text-lg md:text-xl font-medium group"
          >
            <span>Made with</span>
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-[#f43f5e] text-[#f43f5e] group-hover:scale-110 transition-transform" />
            <span>in India</span>
          </a>
        </div>

        {/* Centered bottom light gray down arrow */}
        <div className="absolute left-0 right-0 bottom-6 sm:bottom-8 flex items-center justify-center">
          <a
            href="/destinations"
            aria-label="Go to destinations"
            className="text-gray-300 hover:text-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

