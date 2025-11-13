"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image, MapPin, Hotel, Activity, Plane, Menu, X } from "lucide-react";

export function AdminHeader() {
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

  // Admin-specific navigation links
  const adminNavLinks = [
    { href: "/admin", label: "Carousel", icon: Image },
    { href: "/admin/destinations", label: "Destinations", icon: MapPin },
    { href: "/admin/stay", label: "Stays", icon: Hotel },
    { href: "/admin/things", label: "Things to Do", icon: Activity },
    { href: "/admin/trips", label: "Trips", icon: Plane },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Open Menu"
              className="md:hidden text-gray-700 hover:text-[#E51A4B] transition-colors"
              onClick={openMenu}
            >
              <Menu size={24} />
            </button>

            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E51A4B] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg leading-tight">
                  <span className="text-[#E51A4B]">Trip</span>
                  <span className="text-gray-900">eloo</span>
                </span>
                <span className="text-xs text-gray-500 font-normal">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {adminNavLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#E51A4B] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#E51A4B]"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700">Active</span>
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
            className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl border-r border-gray-200 ${
              closing ? "animate-slide-out-left" : "animate-slide-in-left"
            }`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#E51A4B]">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="text-white" size={24} />
                <div className="font-extrabold text-lg text-white">
                  Admin Panel
                </div>
              </div>
              <button
                aria-label="Close Menu"
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile nav links */}
            <nav className="grid gap-1 p-4 bg-white">
              {adminNavLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[#E51A4B] text-white font-semibold shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#E51A4B]"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

