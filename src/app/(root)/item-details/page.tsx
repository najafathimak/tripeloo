"use client";
import ListCarousel from "@/components/ListDetails/ListCarousel";
import LocationSection from "@/components/ListDetails/LocationSection";
import PriceSection from "@/components/ListDetails/PriceSection";
import ReviewsSection from "@/components/ListDetails/ReviewsSection";
import RoomsSection from "@/components/ListDetails/RoomsSection";
import BookingSidebar from "@/components/ListDetails/ListingDetailsClient";
import { Star, Car, Hotel, Utensils, Mountain } from "lucide-react";
import { useState, useRef } from "react";

const ListingDetails = () => {
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
  const bookingRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToBooking = () => {
    if (bookingRef.current) {
      // ✨ Slow smooth scroll effect
      bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="mx-0 pt-11 sm:mx-[10%] relative">
      <ListCarousel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          {/* LEFT CONTENT */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              Highlights of Iceland | Tracing City Sights and Northern Lights
            </h1>

            {/* Rating + Price */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-600">
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Star className="w-4 h-4 fill-emerald-500" />
                  <span>5.0</span>
                </div>
                <span className="text-sm">(388 reviews)</span>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  INR 2,27,683
                </p>
                <span className="line-through text-gray-500 text-sm sm:text-base">
                  INR 3,02,818
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Car size={18} /> <span>Transfer Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Hotel size={18} /> <span>Stay Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils size={18} /> <span>Breakfast Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Mountain size={18} /> <span>Sightseeing Included</span>
              </div>
            </div>

            {/* Resort Properties */}
            <div className="mt-8 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">
                Resort Properties
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                <div>🏊‍♂️ Swimming Pool</div>
                <div>🍽️ Kitchen Access</div>
                <div>🏋️ Gym</div>
                <div>🌐 Free Wi-Fi</div>
                <div>🚗 Parking Available</div>
                <div>🧺 Laundry Service</div>
                <div>🌳 Garden View</div>
              </div>
            </div>

            {/* Rooms Section */}
            <div className="px-4 sm:px-6 mb-5 mt-8 relative">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Choose Your Room
                </h2>
              </div>

              {/* Info Badge */}
              <div className="inline-block bg-[#7E22CE]/10 text-[#7E22CE] text-xs font-medium px-3 py-1 rounded-full mb-4">
                💡 Select your preferred room type to continue booking
              </div>

              <RoomsSection onRoomSelect={(rooms) => setSelectedRooms(rooms)} />
            </div>

            {/* Price Section */}
            <div className="mb-5">
              <PriceSection />
            </div>

            {/* Mobile Booking Sidebar */}
            <div ref={bookingRef} className="md:hidden">
              <BookingSidebar
                selectedRooms={selectedRooms}
                title="Highlights Of Iceland | Tracing City Sights And Northern Lights"
                price="INR 2,27,683"
                oldPrice="INR 3,02,818"
                savings="INR 75,135"
              />
            </div>

            {/* Location + Reviews */}
            <div className="px-4 sm:px-6 mb-5">
              <LocationSection />
            </div>
            <div className="px-4 sm:px-6 mb-5">
              <ReviewsSection />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div ref={bookingRef} className="hidden md:block sticky top-20">
            <BookingSidebar
              selectedRooms={selectedRooms}
              title="Highlights Of Iceland | Tracing City Sights And Northern Lights"
              price="INR 2,27,683"
              oldPrice="INR 3,02,818"
              savings="INR 75,135"
              className="w-full lg:w-[350px]"
            />
          </div>
        </div>
      </div>

      {/* ✅ Floating Book Now Button - Subtle Theme Style */}
      <button
        onClick={handleScrollToBooking}
        className="fixed bottom-5 right-5 bg-[#7E22CE]/15 hover:bg-[#7E22CE]/25 text-[#7E22CE] font-medium px-4 py-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
      >
        <span>Book Now</span>
        <span className="text-lg animate-bounce">↓</span>
      </button>
    </div>
  );
};

export default ListingDetails;
