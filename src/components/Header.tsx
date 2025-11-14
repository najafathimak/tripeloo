"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const openMenu = () => {
    setClosing(false);
    setOpen(true);
  };

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 280);
  };

  return (
    <header className={`${isHomePage ? 'absolute' : 'relative'} top-0 z-30 w-full ${isHomePage ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <button aria-label="Open Menu" className={`md:hidden ${isHomePage ? 'text-white' : 'text-gray-900'}`} onClick={openMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo_new.png"
              alt="Tripeloo Logo"
              width={150}
              height={50}
              className={`h-10 sm:h-12 lg:h-16 w-auto`}
              priority
            />
          </Link>
        </div>

        <nav className={`hidden md:flex items-center gap-6 text-sm ${isHomePage ? 'text-white' : 'text-gray-900 font-semibold'}`}>
          <Link href="/destinations" className={`${isHomePage ? 'hover:text-brand' : 'hover:text-[#E51A4B] font-semibold'}`}>Destinations</Link>
          <Link href="/about" className={`${isHomePage ? 'hover:text-brand' : 'hover:text-[#E51A4B] font-semibold'}`}>About / Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Call Assistance - Desktop */}
          <a
            href="tel:8089909386"
            className={`hidden md:inline-flex items-center gap-2 rounded-full border ${isHomePage ? 'border-white/60 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-50'} px-4 py-2 text-sm font-semibold transition`}
          >
            <Phone size={16} />
            <span>Call Assistance</span>
          </a>
          
          {/* Call Icon - Mobile */}
          <a
            href="tel:8089909386"
            className={`md:hidden ${isHomePage ? 'text-white hover:text-brand' : 'text-gray-900 hover:text-[#E51A4B]'} transition-colors p-2`}
            aria-label="Call Assistance"
          >
            <Phone size={20} />
          </a>
          
          <Link href="/login" className={`inline-flex items-center justify-center rounded-full border ${isHomePage ? 'border-white/60 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-50'} px-4 py-2 text-sm font-semibold transition`}>Login</Link>
        </div>
      </div>

      {(open || closing) && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${closing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeMenu} />
          <div className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white text-gray-900 shadow-xl ${closing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Image
                src="/assets/logo_new.png"
                alt="Tripeloo Logo"
                width={130}
                height={43}
                className="h-10 w-auto"
              />
              <button aria-label="Close Menu" className="p-2" onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="grid gap-2 p-4 text-sm">
              <Link href="/destinations" className="py-2 hover:text-brand" onClick={closeMenu}>Destinations</Link>
              <Link href="/about" className="py-2 hover:text-brand" onClick={closeMenu}>About / Contact</Link>
            </nav>
            <div className="p-4 border-t border-gray-100 space-y-3">
              <a
                href="tel:8089909386"
                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                onClick={closeMenu}
              >
                <Phone size={18} />
                <span>Call Assistance</span>
              </a>
              <Link href="/login" className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition" onClick={closeMenu}>Login</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

