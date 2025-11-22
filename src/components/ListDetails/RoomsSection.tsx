"use client";

import { useState } from "react";
import Image from "next/image";
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
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`cursor-pointer rounded-xl overflow-hidden shadow-md border transition-all duration-200 hover:shadow-lg hover:border-red-500 ${
              selectedRooms.find((r) => r.id === room.id)
                ? "border-red-500 ring-1 ring-red-300"
                : "border-gray-200"
            }`}
          >
            {room.thumb ? (
              <Image
                src={optimizeCloudinaryUrl(room.thumb)}
                alt={room.name}
                width={180}
                height={120}
                className="h-[120px] w-full object-cover"
                onClick={() => setSelectedRoom(room)}
              />
            ) : (
              <div className="h-[120px] w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
            <div className="p-3 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                  {room.name}
                </h3>
                <input
                  type="checkbox"
                  checked={!!selectedRooms.find((r) => r.id === room.id)}
                  onChange={() => handleRoomToggle(room)}
                  className="accent-red-500 w-4 h-4"
                />
              </div>

              {/* 🔥 Highlighted Price */}
              <p className="text-[15px] font-semibold text-red-600 mt-1">
                {room.rate}
              </p>
            </div>
          </div>
        ))}
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
                  <Image
                    src={optimizeCloudinaryUrl(img)}
                    alt={selectedRoom.name}
                    width={800}
                    height={500}
                    className="w-full h-80 object-cover rounded-lg"
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
