"use client";

import { Hero } from '@/components/Hero';
import { FeaturedDestinations } from '@/components/FeaturedDestinations';
import { AboutBand } from '@/components/AboutBand';
import OurSpecialities from '@/components/OurSpecialities';
import StatisticsSection from '@/components/StatisticsSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { MixedCardsCarousel } from '@/components/MixedCardsCarousel';
import { LeadFormPopup } from '@/components/LeadFormPopup';
import { useEffect, useState } from 'react';

interface HomePageData {
  heroDesktopImage: string;
  heroMobileImage: string;
  discoverTitle: string;
  discoverContent: string;
  discoverButtonText: string;
  discoverButtonLink: string;
  testimonialsHeading: string;
  testimonials: Array<{
    id: string;
    image: string;
    title: string;
    experience: string;
    name: string;
    location: string;
  }>;
  heroBanners?: Array<{
    id: string;
    image: string;
    title?: string;
    link?: string;
  }>;
}

export default function HomePageClient() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    // Check if form was already filled/submitted - if yes, never show again
    if (typeof window !== 'undefined') {
      const formFilled = localStorage.getItem('leadFormFilled');
      if (formFilled === 'true') {
        setHasShownPopup(true);
        return;
      }

      // Check if popup was shown recently (within 24 hours)
      const lastShownTimestamp = localStorage.getItem('leadPopupLastShown');
      if (lastShownTimestamp) {
        const lastShown = parseInt(lastShownTimestamp, 10);
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        // If shown within last 24 hours, don't show again
        if (now - lastShown < oneDayInMs) {
          setHasShownPopup(true);
          return;
        }
        // If more than 24 hours have passed, clear the timestamp and allow popup to show
        localStorage.removeItem('leadPopupLastShown');
      }
    }

    let timeoutId: NodeJS.Timeout;
    let scrollTimeoutId: NodeJS.Timeout;
    let popupTriggered = false;

    // Wait for page to load before checking
    const checkScroll = () => {
      if (hasShownPopup || popupTriggered) return;

      const discoverSection = document.getElementById('discover-section');
      const featuredSection = document.getElementById('featured-destinations-section');
      
      if (!discoverSection || !featuredSection) {
        // Retry after a short delay if elements not found
        timeoutId = setTimeout(checkScroll, 500);
        return;
      }

      const discoverRect = discoverSection.getBoundingClientRect();
      const featuredRect = featuredSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;

      // Check if user has scrolled past the discover section
      const hasPassedDiscover = discoverRect.bottom < windowHeight * 0.5;
      
      // Check if featured section is entering viewport (top is visible)
      const featuredIsVisible = featuredRect.top < windowHeight * 0.9 && featuredRect.top > -100;

      // Trigger popup when:
      // 1. User has scrolled past the discover section
      // 2. Featured section is becoming visible
      // 3. User is in the "between" zone
      if (hasPassedDiscover && featuredIsVisible && !popupTriggered) {
        popupTriggered = true;
        // Add a small delay before showing popup for better UX
        scrollTimeoutId = setTimeout(() => {
          setShowLeadPopup(true);
          setHasShownPopup(true);
          if (typeof window !== 'undefined') {
            // Store current timestamp instead of just 'true'
            localStorage.setItem('leadPopupLastShown', Date.now().toString());
          }
        }, 300);
      }
    };

    // Scroll detection for sections
    const handleScroll = () => {
      // Debounce scroll events
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(checkScroll, 150);
    };

    // Initial check after component mounts and page loads
    timeoutId = setTimeout(checkScroll, 500);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasShownPopup]);

  const fetchHomeData = async () => {
    try {
      const res = await fetch('/api/home');
      if (res.ok) {
        const data = await res.json();
        setHomeData(data.data);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowLeadPopup(false);
  };

  const handleSkipPopup = () => {
    setShowLeadPopup(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E51A4B]"></div>
      </main>
    );
  }

  return (
    <>
      <Hero 
        banners={homeData?.heroBanners}
      />
      <MixedCardsCarousel />
      <AboutBand 
        title={homeData?.discoverTitle}
        content={homeData?.discoverContent}
        buttonText={homeData?.discoverButtonText}
        buttonLink={homeData?.discoverButtonLink}
      />
      <div id="featured-destinations-section">
      <FeaturedDestinations />
      </div>
      <OurSpecialities />
      <StatisticsSection />
      <TestimonialsCarousel 
        heading={homeData?.testimonialsHeading}
        testimonials={homeData?.testimonials}
      />
      <LeadFormPopup
        isOpen={showLeadPopup}
        onClose={handleClosePopup}
        onSkip={handleSkipPopup}
      />
    </>
  );
}

