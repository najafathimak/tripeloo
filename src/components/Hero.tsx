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

  const onWhatsAppClick = () => {
    if (typeof window === 'undefined') return;
    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const text = `Hi Tripeloo! I'd like to plan a trip. ${site}`;
    const url = `https://wa.me/918089909386?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="relative">
      <div className="relative h-[100svh] sm:h-[100vh] w-full overflow-hidden rounded-none bg-gray-100">
        //"https://cdn.pixabay.com/photo/2018/03/29/19/33/aurora-3273419_1280.jpg
        <Image
          src="https://images.unsplash.com/photo-1610520814919-467f10b43486?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2149"
          alt="Lush green hills background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Moving marquee */}
        <div className="absolute inset-0 flex items-center font-serif justify-center">
          <div className="marquee select-none w-full">
            <div className="marquee__track">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="marquee__item text-[15vw] sm:text-[8vw] leading-none tracking-tight">
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
            <div className="max-w-xs font-extralight font-serif">
              <div className="hero-slogan text-white text-sm sm:text-base leading-snug">
                Your gateway to unforgettable trips and stays.
              </div>
              <div className="hero-slogan delay-150 text-white text-sm sm:text-base leading-snug">
                Let’s travel together!
              </div>
            </div>
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
                  aria-label="WhatsApp"
                  title="Chat on WhatsApp"
                  onClick={onWhatsAppClick}
                  className="h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-[0.98] transition flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="h-6 w-6 sm:h-10 sm:w-10"
                    aria-hidden="true"
                  >
                    <path fill="currentColor" d="M19.11 6.18A9.8 9.8 0 0 0 5.56 20.73l-1 3.69a.8.8 0 0 0 1 1l3.69-1A9.8 9.8 0 1 0 19.11 6.18m-3.38 16.9a8.1 8.1 0 0 1-4.1-1.12l-.29-.18-2.43.66.65-2.43-.19-.29a8.16 8.16 0 1 1 6.35 3.36"/>
                    <path fill="currentColor" d="M13.59 10.87c-.21-.46-.44-.47-.64-.48h-.55a1 1 0 0 0-.72.34 3 3 0 0 0-.9 2.23 5.17 5.17 0 0 0 1.08 2.76 11.78 11.78 0 0 0 3.6 3.6 8.25 8.25 0 0 0 2.76 1.08c1 .25 1.9.08 2.63-.54a2.3 2.3 0 0 0 .75-1.5c.06-.16.06-.3 0-.42s-.19-.14-.4-.23l-1.22-.59c-.2-.09-.34-.14-.49.11s-.57.71-.7.86-.26.18-.48.07a6.7 6.7 0 0 1-2-1.23 9 9 0 0 1-1.68-2.09c-.13-.23 0-.35.09-.47s.2-.24.29-.37a1.56 1.56 0 0 0 .2-.33.39.39 0 0 0 0-.37c-.06-.11-.49-1.19-.67-1.62"/>
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

