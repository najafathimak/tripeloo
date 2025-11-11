"use client";

import { useEffect, useState } from "react";
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

import { stayData, activitiesData, tripsData } from "./DestinationData";

const tabData = ["Stays", "Things to Do", "Trips"];

function StayListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawDestination = searchParams.get("destination");
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("Stays");

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    if (!rawDestination) {
      const timer = setTimeout(() => router.push("/destinations"), 5000);
      return () => clearTimeout(timer);
    }
  }, [rawDestination, router]);

  const handleItemClick = (itemId: string) => {
    if (!rawDestination) return;
  
    const destination = encodeURIComponent(rawDestination);
    let queryParam = "";
    let targetPage = "";
  
    if (activeTab === "Stays") {
      queryParam = `stay=${itemId}`;
      targetPage = "/item-details";
    } else if (activeTab === "Things to Do") {
      queryParam = `things-to-do=${itemId}`;
      targetPage = "/things-to-do";
    } else if (activeTab === "Trips") {
      queryParam = `trips=${itemId}`;
      targetPage = "/trips";
    }
  
    router.push(`${targetPage}?destination=${destination}&${queryParam}`);
  }; 

  if (!rawDestination) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-pink-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <FaCompass className="text-6xl text-[#E51A4B] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Choose Your Destination First
          </h1>
          <p className="text-gray-600 mb-6">
            Redirecting you to the destination selection page in 5 seconds
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/destinations")}
            className="bg-[#E51A4B] text-white px-6 py-3 rounded-full font-semibold"
          >
            Go to Destinations
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const decodedDestination = decodeURIComponent(rawDestination).toLowerCase();
  const matchedKey =
    Object.keys(stayData).find((key) =>
      decodedDestination.includes(key.toLowerCase())
    ) || null;

  const stays = matchedKey ? stayData[matchedKey] : null;
  const activities = matchedKey ? activitiesData[matchedKey] : null;
  const trips = matchedKey ? tripsData[matchedKey] : null;

  const hasStays = stays && stays.length > 0;
  const hasActivities = activities && activities.length > 0;
  const hasTrips = trips && trips.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br mt-12 from-blue-50 via-white to-pink-50">
      {/* Dynamic Background Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {activeTab === "Stays" && (
          <>
            {/* Sun */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10"
            >
              <FaSun className="text-yellow-400 text-8xl" />
            </motion.div>

            {/* Clouds */}
            <motion.div
              animate={{ x: [0, 100, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-20 left-10"
            >
              <FaCloud className="text-white text-6xl opacity-40" />
            </motion.div>
            <motion.div
              animate={{ x: [0, -80, 0] }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute top-40 right-20"
            >
              <FaCloud className="text-white text-5xl opacity-30" />
            </motion.div>

            {/* Airplanes */}
            <motion.div
              animate={{ x: [-100, window.innerWidth + 100] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute top-32 left-0"
            >
              <FaPlaneDeparture className="text-gray-400 text-4xl opacity-50" />
            </motion.div>

            {/* Mountains */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 0.3 }}
              transition={{ duration: 1.5 }}
              className="absolute bottom-0 left-0"
            >
              <FaMountain className="text-gray-500 text-9xl" />
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 0.25 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute bottom-0 right-10"
            >
              <FaMountain className="text-gray-400 text-7xl" />
            </motion.div>
          </>
        )}

        {activeTab === "Things to Do" && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 right-20"
            >
              <FaCompass className="text-[#E51A4B] text-7xl opacity-20" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-40 left-20"
            >
              <FaHiking className="text-green-600 text-6xl opacity-30" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-20 right-40"
            >
              <FaLeaf className="text-green-500 text-5xl opacity-25" />
            </motion.div>
          </>
        )}

        {activeTab === "Trips" && (
          <>
            <motion.div
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-32 left-20"
            >
              <FaCarSide className="text-blue-500 text-7xl opacity-30" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-32 right-20"
            >
              <FaSuitcaseRolling className="text-orange-500 text-6xl opacity-25" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-10"
            >
              <FaRoad className="text-gray-400 text-8xl opacity-20" />
            </motion.div>
          </>
        )}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
          transition={{ duration: 0.6 }}
          className="flex gap-2 md:gap-3 mb-8 md:mb-10 bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-lg max-w-2xl mx-auto"
        >
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
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-[#E51A4B] to-[#FF6B6B] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-[#E51A4B] to-[#FF6B6B] bg-clip-text text-transparent capitalize"
        >
          {activeTab === "Stays" && `Stays in ${decodedDestination}`}
          {activeTab === "Things to Do" &&
            `Things to Do in ${decodedDestination}`}
          {activeTab === "Trips" && `Trips around ${decodedDestination}`}
        </motion.h1>

        {/* No stays available */}
        {!hasStays && activeTab === "Stays" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl max-w-2xl mx-auto"
          >
            <FaSuitcaseRolling className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No stays or resorts available in this location right now
            </h2>
            <p className="text-gray-600 mb-6">
              We're expanding our listings soon. For assistance, contact our
              support team.
            </p>
            <motion.a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp className="text-xl" />
              Chat with us on WhatsApp
            </motion.a>
          </motion.div>
        )}

        {/* Show stays if available */}
        {hasStays && activeTab === "Stays" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {stays.map((stay, index) => (
              <motion.div
                key={stay.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleItemClick(stay.id)}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={stay.coverImage}
                    alt={stay.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-[#E51A4B] font-bold text-lg">
                      ₹{stay.startingPrice}
                      <span className="text-sm text-gray-600"> / night</span>
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#E51A4B] transition">
                    {stay.name}
                  </h3>
                  <ul className="space-y-2">
                    {stay.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <span className="w-1.5 h-1.5 bg-[#E51A4B] rounded-full" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Things to Do available */}
        {!hasActivities && activeTab === "Things to Do" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl max-w-2xl mx-auto"
          >
            <FaHiking className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No activities or experiences available in this location right now
            </h2>
            <p className="text-gray-600 mb-6">
              We're curating amazing experiences for you. For custom activity
              recommendations, contact our support team.
            </p>
            <motion.a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp className="text-xl" />
              Chat with us on WhatsApp
            </motion.a>
          </motion.div>
        )}

        {/* Show activities if available */}
        {hasActivities && activeTab === "Things to Do" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleItemClick(activity.id)}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={activity.coverImage}
                    alt={activity.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-[#E51A4B] font-bold text-lg">
                      ₹{activity.price}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#E51A4B] transition">
                    {activity.name}
                  </h3>
                  <p className="text-gray-600">Duration: {activity.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Trips available */}
        {!hasTrips && activeTab === "Trips" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl max-w-2xl mx-auto"
          >
            <FaCarSide className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No trip packages available for this destination right now
            </h2>
            <p className="text-gray-600 mb-6">
              We're designing perfect itineraries. For personalized trip
              planning, reach out to our support team.
            </p>
            <motion.a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp className="text-xl" />
              Chat with us on WhatsApp
            </motion.a>
          </motion.div>
        )}

        {/* Show trips if available */}
        {hasTrips && activeTab === "Trips" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleItemClick(trip.id)}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={trip.coverImage}
                    alt={trip.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <p className="text-[#E51A4B] font-bold text-lg">
                      ₹{trip.price}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#E51A4B] transition">
                    {trip.name}
                  </h3>
                  <p className="text-gray-600">Duration: {trip.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StayListingsContent;
