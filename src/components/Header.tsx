"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Phone, User, LogOut } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { data: session, status } = useSession();

  // Prevent hydration mismatch by only rendering session-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Link href="/" className={`${isHomePage ? 'hover:text-brand' : 'hover:text-[#E51A4B] font-semibold'}`}>Home</Link>
          <Link href="/destinations" className={`${isHomePage ? 'hover:text-brand' : 'hover:text-[#E51A4B] font-semibold'}`}>Destinations</Link>
          <Link href="/about" className={`${isHomePage ? 'hover:text-brand' : 'hover:text-[#E51A4B] font-semibold'}`}>About / Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Call Assistance - Desktop */}
          <a
            href="tel:7066444430"
            className={`hidden md:inline-flex items-center gap-2 rounded-full border ${isHomePage ? 'border-white/60 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-50'} px-4 py-2 text-sm font-semibold transition`}
          >
            <Phone size={16} />
            <span>Call Assistance</span>
          </a>
          
          {/* Call Icon - Mobile */}
          <a
            href="tel:7066444430"
            className={`md:hidden ${isHomePage ? 'text-white hover:text-brand' : 'text-gray-900 hover:text-[#E51A4B]'} transition-colors p-2`}
            aria-label="Call Assistance"
          >
            <Phone size={20} />
          </a>
          
          {mounted && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`inline-flex items-center gap-2 rounded-full border ${isHomePage ? 'border-white/60 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-50'} px-4 py-2 text-sm font-semibold transition`}
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User size={16} />
                )}
                <span className="hidden sm:inline">{session.user.name?.split(' ')[0] || 'User'}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                    {(session.user as any).loyaltyPoints !== undefined && (
                      <p className="text-xs text-[#E51A4B] font-semibold mt-1">
                        {((session.user as any).loyaltyPoints || 0)} Loyalty Points
                      </p>
                    )}
                  </div>
                  <Link
                    href="/loyalty-points"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    View Loyalty Points
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : mounted ? (
            <Link href="/login" className={`inline-flex items-center justify-center rounded-full border ${isHomePage ? 'border-white/60 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-50'} px-4 py-2 text-sm font-semibold transition`}>Login</Link>
          ) : (
            <div className={`inline-flex items-center justify-center rounded-full border ${isHomePage ? 'border-white/60 text-white' : 'border-gray-300 text-gray-900'} px-4 py-2 text-sm font-semibold opacity-0`}>Login</div>
          )}
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
              <Link href="/" className="py-2 hover:text-brand" onClick={closeMenu}>Home</Link>
              <Link href="/destinations" className="py-2 hover:text-brand" onClick={closeMenu}>Destinations</Link>
              <Link href="/about" className="py-2 hover:text-brand" onClick={closeMenu}>About / Contact</Link>
            </nav>
            <div className="p-4 border-t border-gray-100 space-y-3">
              <a
                href="tel:7066444430"
                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                onClick={closeMenu}
              >
                <Phone size={18} />
                <span>Call Assistance</span>
              </a>
              {mounted && session?.user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                    {(session.user as any).loyaltyPoints !== undefined && (
                      <p className="text-xs text-[#E51A4B] font-semibold mt-1">
                        {((session.user as any).loyaltyPoints || 0)} Loyalty Points
                      </p>
                    )}
                  </div>
                  <Link
                    href="/loyalty-points"
                    className="block text-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                    onClick={closeMenu}
                  >
                    View Loyalty Points
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      closeMenu();
                    }}
                    className="w-full rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : mounted ? (
                <Link href="/login" className="flex-1 inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition" onClick={closeMenu}>Login</Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

