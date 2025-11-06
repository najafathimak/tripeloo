"use client";

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

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
    <header className="absolute top-0 z-30 w-full bg-gray-700/20">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <button aria-label="Open Menu" className="md:hidden text-white" onClick={openMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="font-extrabold text-xl tracking-tight text-white">
            <span className="text-brand">Trip</span><span className="text-white">eloo</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link href="/destinations" className="hover:text-brand">Destinations</Link>
          <Link href="/about" className="hover:text-brand">About / Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">Login</Link>
        </div>
      </div>

      {(open || closing) && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${closing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeMenu} />
          <div className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white text-gray-900 shadow-xl ${closing ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="font-extrabold text-lg"><span className="text-brand">Trip</span>eloo</div>
              <button aria-label="Close Menu" className="p-2" onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="grid gap-2 p-4 text-sm">
              <Link href="/destinations" className="py-2 hover:text-brand" onClick={closeMenu}>Destinations</Link>
              <Link href="/about" className="py-2 hover:text-brand" onClick={closeMenu}>About / Contact</Link>
            </nav>
            <div className="p-4 border-t border-gray-100 flex">
              <Link href="/login" className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition" onClick={closeMenu}>Login</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

