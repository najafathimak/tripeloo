"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const pathname = usePathname();

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

  // Define all links in one place for cleaner mapping
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/admin", label: "Carousal" },
    { href: "/admin/destinations", label: "Destinations" },
    { href: "/admin/stay", label: "Stay" },
    { href: "/admin/things", label: "Things-to-do" },
    { href: "/admin/trips", label: "Trips" },
  ];

  return (
    <header className="font-semibold font-sans sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Open Menu"
            className="md:hidden"
            onClick={openMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="h-6 w-6"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link href="/admin" className="font-extrabold text-xl tracking-tight">
            <span className="text-[#E51A4B]">Trip</span>
            <span className="text-gray-900">eloo</span>
            <span className="ml-2 text-xs font-normal text-gray-500">Admin</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg transition-all ${
                pathname === href
                  ? "bg-[#E51A4B] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#E51A4B]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#E51A4B]/10 text-[#E51A4B] rounded-lg text-xs font-semibold">
            <div className="w-2 h-2 bg-[#E51A4B] rounded-full animate-pulse"></div>
            Admin Panel
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {(open || closing) && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
              closing ? "animate-fade-out" : "animate-fade-in"
            }`}
            onClick={closeMenu}
          />
          <div
            className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white/95 backdrop-blur-md text-gray-900 shadow-xl border-r border-gray-200 ${
              closing ? "animate-slide-out-left" : "animate-slide-in-left"
            }`}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="font-extrabold text-lg">
                <span className="text-[#E51A4B]">Trip</span>eloo
              </div>
              <button
                aria-label="Close Menu"
                className="p-2"
                onClick={closeMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  className="h-6 w-6"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="grid gap-1 p-4 text-sm">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    pathname === href
                      ? "bg-[#E51A4B] text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#E51A4B]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
