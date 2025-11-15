"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, MapPin, Hotel, Activity, Plane, Menu, X, MessageSquare, Gift, FileText } from "lucide-react";

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
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/home-page", label: "Home Page", icon: ImageIcon },
    { href: "/admin/destinations", label: "Destinations", icon: MapPin },
    { href: "/admin/stays", label: "Stays", icon: Hotel },
    { href: "/admin/things", label: "Things to Do", icon: Activity },
    { href: "/admin/trips", label: "Trips", icon: Plane },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/loyalty-points", label: "Loyalty Points", icon: Gift },
    { href: "/admin/brochure", label: "Brochure", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 min-h-[64px]">
          {/* Logo */}
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0 min-w-0">
            <button
              aria-label="Open Menu"
              className="md:hidden text-gray-700 hover:text-[#E51A4B] transition-colors flex-shrink-0"
              onClick={openMenu}
            >
              <Menu size={24} />
            </button>

            <Link href="/admin" className="flex items-center gap-1 lg:gap-2 flex-shrink-0 min-w-0">
              <Image
                src="/assets/logo_new.png"
                alt="Tripeloo Logo"
                width={130}
                height={43}
                className="h-10 md:h-11 lg:h-12 w-auto flex-shrink-0"
                priority
              />
              <span className="text-xs text-gray-500 font-normal hidden lg:inline whitespace-nowrap">Admin Panel</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 min-w-0 justify-end ml-2">
            {adminNavLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-2 rounded-lg transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-[#E51A4B] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#E51A4B]"
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-[18px] lg:h-[18px] flex-shrink-0" />
                  <span className="font-medium text-xs lg:text-sm whitespace-nowrap">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg flex-shrink-0 ml-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700 whitespace-nowrap">Active</span>
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
                <Image
                  src="/assets/logo_new.png"
                  alt="Tripeloo Logo"
                  width={130}
                  height={43}
                  className="h-10 w-auto"
                />
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

