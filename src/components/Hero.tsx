"use client";

import Image from 'next/image';

function TentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="inline h-[0.7em] w-[0.7em] align-baseline">
      <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 20l9-16 9 16M4 20h16M9 20l3-6 3 6" />
    </svg>
  );
}

export function Hero() {
  const onNav = (hash: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = hash;
      const el = document.getElementById('explore');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative">
      <div className="relative h-[100svh] sm:h-[100vh] w-full overflow-hidden rounded-none bg-gray-100">
        <Image
          src="https://cdn.pixabay.com/photo/2018/03/29/19/33/aurora-3273419_1280.jpg"
          alt="Lush green hills background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Moving marquee */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="marquee select-none w-full">
            <div className="marquee__track">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="marquee__item text-[10vw] leading-none tracking-tight">
                  <button onClick={() => onNav('stays')} className="hover:text-brand transition-colors">Stays</button>
                  <span className="px-6 align-middle"><TentIcon /></span>
                  <button onClick={() => onNav('things-to-do')} className="hover:text-brand transition-colors">Things to Do</button>
                  <span className="px-6 align-middle"><TentIcon /></span>
                  <button onClick={() => onNav('trips')} className="hover:text-brand transition-colors">Trips</button>
                  <span className="px-6 align-middle"><TentIcon /></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-left row: short text + rotating circular download icon */}
        <div className="absolute left-0 right-0 bottom-6 sm:bottom-8">
          <div className="container flex items-center justify-start gap-4">
            <p className="max-w-xs text-white text-sm sm:text-base font-semibold leading-snug">
              Your gateway to unforgettable trips and stays.
              <br />Let’s travel together!
            </p>
            <div className="relative h-56 w-56 sm:h-40 sm:w-40 ml-auto">
              <svg className="absolute inset-0 h-full w-full animate-spin-slower" viewBox="0 0 180 180" fill="none">
                <defs>
                  <path id="circlePathRow" d="M90,90 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text fontSize="12" letterSpacing="3" fontWeight="700" fill="#ffffff" xmlSpace="preserve">
                  <textPath href="#circlePathRow" startOffset="0%">
                    LET'S PLAN YOUR VACATION WITH TRIPELOO•     LET'S PLAN YOUR VACATION WITH TRIPELOO     •     LET'S PLAN YOUR VACATION WITH TRIPELOO     •     LET'S PLAN YOUR VACATION WITH TRIPELOO     •
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  aria-label="Download"
                  onClick={() => onNav('stays')}
                  className="h-28 w-28 sm:h-24 sm:w-24 rounded-full bg-white text-gray-900 shadow-lg hover:bg-white/95 transition flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-10 w-10 sm:h-10 sm:w-10">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
                  </svg>
                </button>
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

