"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    thumb:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154351-527701b73f11?w=1200&q=80",
    ],
    features: [
      "King-size bed",
      "Private balcony",
      "Air conditioning",
      "Complimentary breakfast",
      "High-speed Wi-Fi",
      "Flat-screen TV",
    ],
  },
  {
    id: 2,
    name: "Suite Room",
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
      "Free airport pickup",
    ],
  },
  {
    id: 3,
    name: "Luxury Villa",
    thumb:
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687352-cf1f879e6b1e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154370-7c8f1b2c6b9c?w=1200&q=80",
    ],
    features: [
      "Private pool",
      "Jacuzzi bath",
      "Outdoor dining area",
      "Personal butler service",
      "Private garden view",
      "Smart home control system",
    ],
  },
  {
    id: 4,
    name: "Luxury Villa",
    thumb:
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687352-cf1f879e6b1e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154370-7c8f1b2c6b9c?w=1200&q=80",
    ],
    features: [
      "Private pool",
      "Jacuzzi bath",
      "Outdoor dining area",
      "Personal butler service",
      "Private garden view",
      "Smart home control system",
    ],
  },
  {
    id: 5,
    name: "Luxury Villa",
    thumb:
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687352-cf1f879e6b1e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154370-7c8f1b2c6b9c?w=1200&q=80",
    ],
    features: [
      "Private pool",
      "Jacuzzi bath",
      "Outdoor dining area",
      "Personal butler service",
      "Private garden view",
      "Smart home control system",
    ],
  },
  {
    id: 6,
    name: "Luxury Villa",
    thumb:
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154364-29893d53f5b1?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687352-cf1f879e6b1e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154370-7c8f1b2c6b9c?w=1200&q=80",
    ],
    features: [
      "Private pool",
      "Jacuzzi bath",
      "Outdoor dining area",
      "Personal butler service",
      "Private garden view",
      "Smart home control system",
    ],
  },
];

export default function RoomsSection() {
  const [selectedRoom, setSelectedRoom] = useState<null | (typeof rooms)[0]>(
    null
  );

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Rooms
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3  gap-5">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-red-500 w-[180px]"
          >
            <Image
              src={room.thumb}
              alt={room.name}
              width={180}
              height={120}
              className="h-[120px] w-full object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-800">
                {room.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl max-w-3xl w-full p-4">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-500"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              {selectedRoom.name}
            </h3>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              modules={[Navigation]}
              navigation
              className="rounded-xl"
            >
              {selectedRoom.images.map((img: string, i: number) => (
                <SwiperSlide key={i}>
                  <Image
                    src={img}
                    alt={selectedRoom.name}
                    width={800}
                    height={500}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700">
              {selectedRoom.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm  px-3 py-2 rounded-lg"
                >
                  <ul>
                    <li>{feature}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
