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
    { href: "/admin/stay", label: "Stay" },
    { href: "/admin/things", label: "Things-to-do" },
    { href: "/admin/trips", label: "Trips" },
  ];

  return (
    <header className="font-semibold font-sans absolute top-0 z-30 w-full bg-gray-50/20 transition-colors duration-300">
      <div className="container flex items-center justify-between py-4">
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

          <Link href="/" className="font-extrabold text-xl tracking-tight">
            <span className="text-[#E51A4B]">Trip</span>
            <span className="text-black">eloo</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                pathname === href ? "text-[#E51A4B]" : "hover:text-[#E51A4B]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <p>Admin</p>
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
            className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white text-gray-900 shadow-xl ${
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
            <nav className="grid gap-2 p-4 text-sm">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`py-2 transition-colors ${
                    pathname === href
                      ? "text-[#E51A4B]"
                      : "hover:text-[#E51A4B]"
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
