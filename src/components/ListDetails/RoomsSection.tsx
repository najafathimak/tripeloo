"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const defaultRooms = [
  {
    id: 1,
    name: "Deluxe Room",
    rate: "₹12,500 / night",
    thumb:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    features: [
      "King-size bed",
      "Private balcony",
      "Air conditioning",
      "Complimentary breakfast",
      "High-speed Wi-Fi",
    ],
  },
  {
    id: 2,
    name: "Suite Room",
    rate: "₹18,900 / night",
    thumb:
      "https://images.unsplash.com/photo-1600585154154-1c5b1b2253a1?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154154-1c5b1b2253a1?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687342-71e4c1239d9e?w=1200&q=80",
    ],
    features: [
      "Spacious living area",
      "Ocean view balcony",
      "Mini bar & coffee maker",
      "Luxury bath amenities",
      "24/7 room service",
    ],
  },
  {
    id: 3,
    name: "Luxury Villa",
    rate: "₹28,500 / night",
    thumb:
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687352-cf1f879e6b1e?w=1200&q=80",
    ],
    features: [
      "Private pool",
      "Jacuzzi bath",
      "Outdoor dining area",
      "Personal butler service",
      "Smart home control system",
    ],
  },
];

export default function RoomsSection({
  rooms: roomsProp,
  onRoomSelect,
}: {
  rooms?: any[];
  onRoomSelect: (rooms: any[]) => void;
}) {
  // Only show rooms if they exist - don't use defaultRooms fallback
  if (!roomsProp || !Array.isArray(roomsProp) || roomsProp.length === 0) {
    return null;
  }

  // Map database rooms to component format
  const rooms = roomsProp.map((room, index) => ({
    id: room.id || index + 1,
    name: room.name || `Room ${index + 1}`,
    rate: room.rate || "Price on request",
    thumb: room.thumb || room.images?.[0] || "",
    images: room.images || [room.thumb || ""],
    features: room.features || [],
  }));

  const [selectedRoom, setSelectedRoom] = useState<null | (typeof rooms)[0]>(
    null
  );
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]);

  const handleRoomToggle = (room: any) => {
    let updated;
    if (selectedRooms.find((r) => r.id === room.id)) {
      updated = selectedRooms.filter((r) => r.id !== room.id);
    } else {
      updated = [...selectedRooms, room];
    }
    setSelectedRooms(updated);
    onRoomSelect(updated);
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Rooms
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const isSelected = selectedRooms.find((r) => r.id === room.id);
          return (
          <div
            key={room.id}
            className={`cursor-pointer rounded-xl overflow-hidden shadow-md border transition-all duration-300 hover:shadow-lg hover:border-red-500 ${
              isSelected
                ? "border-red-500 ring-2 ring-red-300 ring-offset-2 scale-[1.02] shadow-lg"
                : "border-gray-200"
            }`}
            onClick={() => handleRoomToggle(room)}
          >
            {room.thumb ? (
              <img
                src={optimizeCloudinaryUrl(room.thumb)}
                alt={room.name}
                width={180}
                height={120}
                className="h-[120px] w-full object-cover cursor-pointer"
                onClick={() => setSelectedRoom(room)}
                loading="lazy"
              />
            ) : (
              <div className="h-[120px] w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
            <div className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-sm flex items-center gap-1 transition-colors ${
                  isSelected ? "text-red-600" : "text-gray-800"
                }`}>
                  {room.name}
                </h3>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? "bg-red-500 border-red-500 scale-110" 
                    : "border-gray-300"
                }`}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>

              {/* 🔥 Highlighted Price */}
              <p className={`text-[15px] font-semibold mt-1 transition-colors ${
                isSelected ? "text-red-600" : "text-red-600"
              }`}>
                {room.rate}
              </p>
            </div>
          </div>
          );
        })}
      </div>

      {/* Room modal view */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full p-4 shadow-lg">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-5">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedRoom.name}
              </h3>
              <p className="text-sm font-medium text-red-600 mt-1">
                {selectedRoom.rate}
              </p>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              modules={[Navigation]}
              navigation
            >
              {selectedRoom.images.filter((img: string) => img && img.trim() !== "").map((img: string, i: number) => (
                <SwiperSlide key={i}>
                  <img
                    src={optimizeCloudinaryUrl(img)}
                    alt={selectedRoom.name}
                    width={800}
                    height={500}
                    className="w-full h-80 object-cover rounded-lg"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
              {selectedRoom.features.map((feature: string, index: number) => (
                <div key={index} className="text-sm px-3 py-1">
                  • {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
