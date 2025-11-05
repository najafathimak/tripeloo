"use client";

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 z-30 w-full bg-transparent">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <button aria-label="Open Menu" className="md:hidden text-white" onClick={() => setOpen(!open)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="font-extrabold text-xl tracking-tight text-white">
            <span className="text-brand">Trip</span><span className="text-white">eloo</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <a href="#stays" className="hover:text-brand">Stays</a>
          <a href="#things-to-do" className="hover:text-brand">Things to Do</a>
          <a href="#trips" className="hover:text-brand">Trips</a>
          <Link href="/destinations" className="hover:text-brand">Destinations</Link>
          <Link href="/about" className="hover:text-brand">About / Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:inline-flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">Login</Link>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white/90 transition">Sign Up</Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black/40 backdrop-blur">
          <div className="container grid gap-2 py-3 text-sm text-white">
            <a href="#stays" onClick={() => setOpen(false)}>Stays</a>
            <a href="#things-to-do" onClick={() => setOpen(false)}>Things to Do</a>
            <a href="#trips" onClick={() => setOpen(false)}>Trips</a>
            <Link href="/destinations" onClick={() => setOpen(false)}>Destinations</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About / Contact</Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 inline-flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition" onClick={() => setOpen(false)}>Login</Link>
              <Link href="/signup" className="flex-1 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white/90 transition" onClick={() => setOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

