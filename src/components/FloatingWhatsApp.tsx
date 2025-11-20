"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getPrimaryWhatsAppNumber, formatWhatsAppNumber } from '@/utils/whatsapp';

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOverWhiteBg, setIsOverWhiteBg] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';
  
  // Hide on detail pages (they have their own booking forms)
  const isDetailPage = pathname === '/item-details' || 
                       pathname === '/things-to-do' || 
                       pathname === '/trips';

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Check if we're still in the hero section (first 100vh)
      setIsInHeroSection(scrollY < heroHeight);
      
      // If scrolled past hero section, we're likely over white background
      setIsOverWhiteBg(scrollY > heroHeight * 0.7);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial state

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const onWhatsAppClick = () => {
    if (typeof window === 'undefined') return;
    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const text = `Hi Tripeloo! I would like to discuss about my vacation and stays. ${site}`;
    const phoneNumber = formatWhatsAppNumber(getPrimaryWhatsAppNumber());
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Show rotating text only on home page and when in hero section
  const showRotatingText = isHomePage && isInHeroSection;

  // Don't render on detail pages (after hooks are called)
  if (isDetailPage) {
    return null;
  }

  return (
    <div className="fixed -right-2 sm:right-6 bottom-2 sm:bottom-8 z-50">
      <div className={`relative ${showRotatingText ? 'h-40 w-40 sm:h-48 sm:w-48' : 'h-16 w-16 sm:h-20 sm:w-20'}`}>
        {/* Rotating circular text - Only on home page hero section, Desktop only */}
        {showRotatingText && (
          <svg 
            className="hidden sm:block absolute inset-0 h-full w-full animate-spin-slower" 
            viewBox="0 0 180 180" 
            fill="none"
          >
            <defs>
              <path id="circlePathFloating" d="M90,90 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text 
              fontSize="12" 
              letterSpacing="3" 
              fontWeight="700" 
              fill="#ffffff" 
              xmlSpace="preserve"
            >
              <textPath href="#circlePathFloating" startOffset="0%">
                LET'S PLAN YOUR VACATION WITH TRIPELOO•     LET'S PLAN YOUR VACATION WITH TRIPELOO     •     LET'S PLAN YOUR VACATION WITH TRIPELOO     •     LET'S PLAN YOUR VACATION WITH TRIPELOO     •
              </textPath>
            </text>
          </svg>
        )}
        
        {/* WhatsApp button with popping animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            aria-label="WhatsApp"
            title="Chat on WhatsApp"
            onClick={onWhatsAppClick}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center animate-pop opacity-90 sm:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-6 w-6 sm:h-8 sm:w-8"
              aria-hidden="true"
            >
              <path fill="currentColor" d="M19.11 6.18A9.8 9.8 0 0 0 5.56 20.73l-1 3.69a.8.8 0 0 0 1 1l3.69-1A9.8 9.8 0 1 0 19.11 6.18m-3.38 16.9a8.1 8.1 0 0 1-4.1-1.12l-.29-.18-2.43.66.65-2.43-.19-.29a8.16 8.16 0 1 1 6.35 3.36"/>
              <path fill="currentColor" d="M13.59 10.87c-.21-.46-.44-.47-.64-.48h-.55a1 1 0 0 0-.72.34 3 3 0 0 0-.9 2.23 5.17 5.17 0 0 0 1.08 2.76 11.78 11.78 0 0 0 3.6 3.6 8.25 8.25 0 0 0 2.76 1.08c1 .25 1.9.08 2.63-.54a2.3 2.3 0 0 0 .75-1.5c.06-.16.06-.3 0-.42s-.19-.14-.4-.23l-1.22-.59c-.2-.09-.34-.14-.49.11s-.57.71-.7.86-.26.18-.48.07a6.7 6.7 0 0 1-2-1.23 9 9 0 0 1-1.68-2.09c-.13-.23 0-.35.09-.47s.2-.24.29-.37a1.56 1.56 0 0 0 .2-.33.39.39 0 0 0 0-.37c-.06-.11-.49-1.19-.67-1.62"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

