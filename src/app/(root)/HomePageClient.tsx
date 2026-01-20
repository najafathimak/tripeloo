"use client";

import { Hero } from '@/components/Hero';
import { FeaturedDestinations } from '@/components/FeaturedDestinations';
import { AboutBand } from '@/components/AboutBand';
import OurSpecialities from '@/components/OurSpecialities';
import StatisticsSection from '@/components/StatisticsSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { MixedCardsCarousel } from '@/components/MixedCardsCarousel';
import { LeadFormPopup } from '@/components/LeadFormPopup';
import { useEffect, useState, useRef } from 'react';

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

  const popupTriggeredRef = useRef(false);
  const hasShownPopupRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if form was already filled/submitted
    const formFilled = localStorage.getItem('leadFormFilled') === 'true';
    
    if (formFilled) {
      // If filled, check 24-hour cooldown
      const lastShownTimestamp = localStorage.getItem('leadPopupLastShown');
      if (lastShownTimestamp) {
        const lastShown = parseInt(lastShownTimestamp, 10);
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours
        
        if (now - lastShown < oneDayInMs) {
          hasShownPopupRef.current = true;
          setHasShownPopup(true);
          return;
        }
      }
    } else {
      // If not filled, check 30-minute cooldown
      const lastShownTimestamp = localStorage.getItem('leadPopupLastShown');
      if (lastShownTimestamp) {
        const lastShown = parseInt(lastShownTimestamp, 10);
        const now = Date.now();
        const thirtyMinutesInMs = 30 * 60 * 1000; // 30 minutes
        
        if (now - lastShown < thirtyMinutesInMs) {
          hasShownPopupRef.current = true;
          setHasShownPopup(true);
          return;
        }
      }
    }

    let timeoutId: NodeJS.Timeout;
    let scrollTimeoutId: NodeJS.Timeout;

    // Wait for page to load before checking
    const checkScroll = () => {
      if (hasShownPopupRef.current || popupTriggeredRef.current) return;

      const featuredSection = document.getElementById('featured-destinations-section');
      
      if (!featuredSection) {
        // Retry after a short delay if element not found
        timeoutId = setTimeout(checkScroll, 500);
        return;
      }

      const featuredRect = featuredSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger when featured section is visible in viewport
      const featuredIsVisible = featuredRect.top < windowHeight * 0.8 && featuredRect.bottom > 0;

      if (featuredIsVisible && !popupTriggeredRef.current) {
        popupTriggeredRef.current = true;
        // Add a small delay before showing popup for better UX
        scrollTimeoutId = setTimeout(() => {
          setShowLeadPopup(true);
          hasShownPopupRef.current = true;
          setHasShownPopup(true);
          localStorage.setItem('leadPopupLastShown', Date.now().toString());
        }, 300);
      }
    };

    // Scroll detection for sections - use requestAnimationFrame for smoother performance
    let rafId: number;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
        scrollTimeoutId = setTimeout(checkScroll, 150);
      });
    };

    // Initial check after component mounts and page loads
    timeoutId = setTimeout(checkScroll, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []); // Empty dependency array - only run once on mount

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
      {/* <AboutBand 
        title={homeData?.discoverTitle}
        content={homeData?.discoverContent}
        buttonText={homeData?.discoverButtonText}
        buttonLink={homeData?.discoverButtonLink}
      /> */}
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

