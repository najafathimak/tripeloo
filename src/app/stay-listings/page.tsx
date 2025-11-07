"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaPlaneDeparture,
  FaCloud,
  FaSun,
  FaMountain,
  FaCompass,
  FaWhatsapp,
  FaLeaf,
  FaHiking,
  FaCarSide,
  FaSuitcaseRolling,
  FaRoad,
} from "react-icons/fa";

type Stay = {
  id: string;
  name: string;
  coverImage: string;
  startingPrice: number;
  highlights: string[];
};

const stayData: Record<string, Stay[]> = {
  wayanad: [
    {
      id: "stay1",
      name: "Wayanad Jungle Resort",
      coverImage:
        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 3499,
      highlights: ["Private cottages", "Infinity pool", "Forest view"],
    },
  ],
  goa: [
    {
      id: "stay1",
      name: "Goa Beachside Retreat",
      coverImage:
        "https://images.unsplash.com/photo-1546484959-f9a53db89f9e?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 4499,
      highlights: ["Beachfront rooms", "Pool bar", "Live music evenings"],
    },
  ],
};

const tabData = ["Stays", "Things to Do", "Trips"];

function StayListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawDestination = searchParams.get("destination");
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Stays");

  useEffect(() => setIsVisible(true), []);

  // No destination provided — redirect after 5s
  useEffect(() => {
    if (!rawDestination) {
      const timer = setTimeout(() => router.push("/destinations"), 5000);
      return () => clearTimeout(timer);
    }
  }, [rawDestination, router]);

  if (!rawDestination) {
    return (
      <section className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white via-[#FFF8F9] to-[#FFF0F3] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Choose Your Destination First
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
            Redirecting you to the destination selection page in 5 seconds
          </p>
          <div className="animate-pulse text-[#E51A4B] text-sm md:text-base font-semibold tracking-wide">
            /destinations
          </div>
        </motion.div>
      </section>
    );
  }

  const decodedDestination = decodeURIComponent(rawDestination).toLowerCase();
  const matchedKey =
    Object.keys(stayData).find((key) =>
      decodedDestination.includes(key.toLowerCase())
    ) || null;
  const stays = matchedKey ? stayData[matchedKey] : null;
  const hasStays = stays && stays.length > 0;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-[#FFF8F9] to-[#FFF0F3] pb-16 md:pb-20 pt-16 md:pt-20">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {activeTab === "Stays" && (
          <>
            {/* Sun */}
            <motion.div
              className="absolute top-6 md:top-10 left-4 md:left-16 text-[#E51A4B] text-4xl md:text-6xl opacity-20 md:opacity-30"
              animate={{ y: [0, 20, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <FaSun />
            </motion.div>
            
            {/* Clouds */}
            <motion.div
              className="absolute top-16 md:top-24 left-0 text-gray-300 text-3xl md:text-5xl opacity-30"
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 25, repeat: Infinity }}
            >
              <FaCloud />
            </motion.div>
            <motion.div
              className="absolute top-32 md:top-40 right-10 text-gray-200 text-2xl md:text-4xl opacity-25"
              animate={{ x: [100, -50, 100] }}
              transition={{ duration: 35, repeat: Infinity }}
            >
              <FaCloud />
            </motion.div>
            <motion.div
              className="absolute top-48 md:top-56 left-1/3 text-gray-300 text-2xl md:text-3xl opacity-20"
              animate={{ x: [-30, 80, -30] }}
              transition={{ duration: 30, repeat: Infinity }}
            >
              <FaCloud />
            </motion.div>
            
            {/* Airplanes */}
            <motion.div
              className="absolute bottom-1/4 left-[-80px] md:left-[-120px] text-[#E51A4B] text-3xl md:text-5xl rotate-12"
              animate={{ x: ["-10%", "110%"] }}
              transition={{ duration: 40, repeat: Infinity }}
            >
              <FaPlaneDeparture />
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-[-100px] md:right-[-150px] text-[#E51A4B] text-2xl md:text-4xl opacity-25 -rotate-12"
              animate={{ x: ["110%", "-10%"] }}
              transition={{ duration: 50, repeat: Infinity, delay: 10 }}
            >
              <FaPlaneDeparture />
            </motion.div>
            
            {/* Mountains */}
            <motion.div
              className="absolute bottom-0 left-1/4 text-gray-400 text-5xl md:text-8xl opacity-15 md:opacity-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <FaMountain />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-1/4 text-gray-300 text-5xl md:text-8xl opacity-15 md:opacity-20"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            >
              <FaMountain />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 text-gray-400 text-4xl md:text-7xl opacity-10 md:opacity-15"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 11, repeat: Infinity }}
            >
              <FaMountain />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 text-gray-300 text-4xl md:text-6xl opacity-10 md:opacity-15"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 13, repeat: Infinity }}
            >
              <FaMountain />
            </motion.div>
            
            {/* Additional decorative elements */}
            <motion.div
              className="absolute top-1/2 left-8 md:left-20 text-[#E51A4B] text-2xl md:text-3xl opacity-15"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <FaSun />
            </motion.div>
          </>
        )}

        {activeTab === "Things to Do" && (
          <>
            <motion.div
              className="absolute top-1/3 left-4 md:left-10 text-green-500 text-3xl md:text-5xl opacity-30 md:opacity-40"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <FaCompass />
            </motion.div>
            <motion.div
              className="absolute bottom-1/4 right-4 md:right-10 text-green-600 text-4xl md:text-6xl opacity-25 md:opacity-30"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <FaLeaf />
            </motion.div>
            <motion.div
              className="absolute top-1/2 right-1/4 text-orange-400 text-4xl md:text-6xl opacity-30 md:opacity-40"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            >
              <FaHiking />
            </motion.div>
          </>
        )}

        {activeTab === "Trips" && (
          <>
            <motion.div
              className="absolute bottom-1/4 left-[-100px] md:left-[-150px] text-[#E51A4B] text-3xl md:text-5xl"
              animate={{ x: ["-10%", "110%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <FaCarSide />
            </motion.div>
            <motion.div
              className="absolute bottom-16 md:bottom-20 right-1/4 text-gray-400 text-5xl md:text-8xl opacity-15 md:opacity-20"
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            >
              <FaRoad />
            </motion.div>
            <motion.div
              className="absolute top-1/4 right-8 md:right-20 text-[#E51A4B] text-3xl md:text-5xl opacity-30 md:opacity-40"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <FaSuitcaseRolling />
            </motion.div>
          </>
        )}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 p-1 w-full max-w-md overflow-x-auto">
            {tabData.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm lg:text-base font-semibold rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-700 hover:text-[#E51A4B]"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="active-tab"
                    className="absolute inset-0 bg-[#E51A4B] rounded-full z-0 shadow-md"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 md:mb-16 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 capitalize leading-tight">
            {activeTab === "Stays" && `Stays in ${decodedDestination}`}
            {activeTab === "Things to Do" && `Things to Do in ${decodedDestination}`}
            {activeTab === "Trips" && `Trips around ${decodedDestination}`}
          </h1>
        </div>

        {/* No stays available */}
        {!hasStays && activeTab === "Stays" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-gray-700 mt-12 md:mt-20 px-4 max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-900 leading-snug">
              No stays or resorts available in this location right now
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              We're expanding our listings soon. For assistance, contact our support team.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 md:gap-3 bg-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:bg-green-600 transition-all text-sm md:text-base font-semibold hover:shadow-xl"
            >
              <FaWhatsapp className="text-lg md:text-xl" /> Chat with us on WhatsApp
            </a>
          </motion.div>
        )}

        {/* Show stays if available */}
        {hasStays && activeTab === "Stays" && (
          <motion.div
            key="stays"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {stays.map((stay) => (
              <motion.div
                key={stay.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className="relative h-56 md:h-64 w-full overflow-hidden">
                  <Image
                    src={stay.coverImage}
                    alt={stay.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 right-3 bg-white/95 text-gray-900 text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 shadow-md backdrop-blur-sm">
                    ₹{stay.startingPrice} / night
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-bold text-lg md:text-xl text-gray-900 group-hover:text-[#E51A4B] transition-colors mb-3 md:mb-4 leading-tight">
                    {stay.name}
                  </h3>
                  <ul className="text-sm md:text-base text-gray-600 list-disc list-inside space-y-1.5 md:space-y-2 leading-relaxed">
                    {stay.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Things to Do available */}
        {activeTab === "Things to Do" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-gray-700 mt-12 md:mt-20 px-4 max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-900 leading-snug">
              No activities or experiences available in this location right now
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              We're curating amazing experiences for you. For custom activity recommendations, contact our support team.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 md:gap-3 bg-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:bg-green-600 transition-all text-sm md:text-base font-semibold hover:shadow-xl"
            >
              <FaWhatsapp className="text-lg md:text-xl" /> Chat with us on WhatsApp
            </a>
          </motion.div>
        )}

        {/* No Trips available */}
        {activeTab === "Trips" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-gray-700 mt-12 md:mt-20 px-4 max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-900 leading-snug">
              No trip packages available for this destination right now
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              We're designing perfect itineraries. For personalized trip planning, reach out to our support team.
            </p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 md:gap-3 bg-green-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:bg-green-600 transition-all text-sm md:text-base font-semibold hover:shadow-xl"
            >
              <FaWhatsapp className="text-lg md:text-xl" /> Chat with us on WhatsApp
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default function StayListingsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-base md:text-lg text-gray-500">Loading...</div>}>
      <StayListingsContent />
    </Suspense>
  );
}