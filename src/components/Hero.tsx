"use client";

import Image from 'next/image';

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
  const onNav = (hash: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = hash;
      const el = document.getElementById('explore');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const defaultMobileImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=1080&h=1920";
  const defaultDesktopImage = "https://images.unsplash.com/photo-1610520814919-467f10b43486?ixlib=rb-4.1.0&auto=format&fit=crop&q=100&w=3840";

  return (
    <section className="relative">
      <div className="relative h-[100svh] sm:h-[100vh] w-full overflow-hidden rounded-none bg-gray-100">
        {/* Mobile background image - Portrait 4K quality */}
        {(mobileImage || defaultMobileImage) && (
          <Image
            src={mobileImage || defaultMobileImage}
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
            src={desktopImage || defaultDesktopImage}
            alt="Lush green hills background"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="hidden sm:block object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {/* Desktop: Stable titles with glow animation */}
        <div className="hidden sm:flex absolute inset-0 items-center font-serif justify-center">
          <div className="select-none w-full flex items-center justify-center">
            <div className="flex items-center gap-6 sm:gap-8 text-[7vw] leading-none tracking-tight">
              <button 
                onClick={() => onNav('destinations')} 
                className="hero-title-desktop hero-title-1 text-white/95 hover:text-brand transition-colors"
              >
                Stays
              </button>
              <span className="text-white/95"><TentIcon /></span>
              <button 
                onClick={() => onNav('destinations')} 
                className="hero-title-desktop hero-title-2 text-white/95 hover:text-brand transition-colors"
              >
                Things to Do
              </button>
              <span className="text-white/95"><TentIcon /></span>
              <button 
                onClick={() => onNav('destinations')} 
                className="hero-title-desktop hero-title-3 text-white/95 hover:text-brand transition-colors"
              >
                Trips
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked vertical design with icons between */}
        <div className="sm:hidden absolute inset-0 flex items-center font-serif justify-center px-4">
          <div className="select-none w-full flex flex-col items-center justify-center gap-2">
            <button 
              onClick={() => onNav('destinations')} 
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
              onClick={() => onNav('destinations')} 
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
              onClick={() => onNav('destinations')} 
              className="hero-title-mobile text-white text-4xl font-bold tracking-wide hover:text-brand transition-colors"
            >
              Trips
            </button>
          </div>
        </div>

        {/* Bottom-left row: short text - aligned with WhatsApp icon */}
        <div className="absolute left-0 right-0 bottom-6 sm:bottom-8">
          <div className="container flex items-end justify-start gap-4 px-4 sm:px-0">
            <div className="max-w-xs font-extralight font-serif sm:pb-0 pb-12">
              {/* Mobile: Compact line-by-line - aligned with WhatsApp icon */}
              <div className="sm:hidden space-y-1">
                <div className="hero-slogan text-white text-xs leading-tight">
                  Your gateway to
                </div>
                <div className="hero-slogan delay-150 text-white text-xs leading-tight">
                  unforgettable trips
                </div>
                <div className="hero-slogan delay-300 text-white text-xs leading-tight">
                  and stays.
                </div>
                <div className="hero-slogan delay-450 text-white text-xs leading-tight mt-1">
                  Let's travel together!
                </div>
              </div>
              {/* Desktop: Original layout */}
              <div className="hidden sm:block">
                <div className="hero-slogan text-white text-base leading-snug">
                  Your gateway to unforgettable trips and stays.
                </div>
                <div className="hero-slogan delay-150 text-white text-base leading-snug">
                  Let's travel together!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Centered bottom light gray down arrow */}
        <div className="absolute left-0 right-0 bottom-6 sm:bottom-8 flex items-center justify-center">
          <button
            aria-label="Scroll to explore"
            onClick={() => onNav('stays')}
            className="text-gray-300 hover:text-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

