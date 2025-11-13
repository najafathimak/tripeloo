"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export type Package = {
  id: string;
  name: string;
  duration: string;
  price: number;
  thumb: string;
  images: string[];
  highlights: string[];
};

const defaultPackages: Package[] = [
  {
    id: "1",
    name: "7 Days Package",
    duration: "7 days / 6 nights",
    price: 50000,
    thumb: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
    ],
    highlights: [
      "Accommodation for 6 nights",
      "All meals included",
      "Guided tours",
      "Transportation",
      "Travel insurance",
      "24/7 support",
    ],
  },
  {
    id: "2",
    name: "5 Days Package",
    duration: "5 days / 4 nights",
    price: 35000,
    thumb: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
    ],
    highlights: [
      "Accommodation for 4 nights",
      "Breakfast included",
      "City tours",
      "Airport transfers",
      "Local guide",
    ],
  },
  {
    id: "3",
    name: "3 Days Package",
    duration: "3 days / 2 nights",
    price: 20000,
    thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
    ],
    highlights: [
      "Accommodation for 2 nights",
      "Breakfast included",
      "Sightseeing tours",
      "Transportation",
    ],
  },
  {
    id: "4",
    name: "2 Days Package",
    duration: "2 days / 1 night",
    price: 12000,
    thumb: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
    ],
    highlights: [
      "Accommodation for 1 night",
      "Breakfast included",
      "Quick city tour",
    ],
  },
];

export default function PackagesSection({
  packages = defaultPackages,
  onPackageSelect,
}: {
  packages?: Package[];
  onPackageSelect: (packages: Package[]) => void;
}) {
  const [selectedPackage, setSelectedPackage] = useState<null | Package>(null);
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);

  const handlePackageToggle = (pkg: Package) => {
    let updated;
    if (selectedPackages.find((p) => p.id === pkg.id)) {
      updated = selectedPackages.filter((p) => p.id !== pkg.id);
    } else {
      updated = [...selectedPackages, pkg];
    }
    setSelectedPackages(updated);
    onPackageSelect(updated);
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Packages
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`cursor-pointer rounded-xl overflow-hidden shadow-md border transition-all duration-200 hover:shadow-lg hover:border-red-500 ${
              selectedPackages.find((p) => p.id === pkg.id)
                ? "border-red-500 ring-1 ring-red-300"
                : "border-gray-200"
            }`}
          >
            <Image
              src={pkg.thumb}
              alt={pkg.name}
              width={400}
              height={200}
              className="h-[200px] w-full object-cover"
              onClick={() => setSelectedPackage(pkg)}
            />
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base text-gray-800">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{pkg.duration}</p>
                </div>
                <input
                  type="checkbox"
                  checked={!!selectedPackages.find((p) => p.id === pkg.id)}
                  onChange={() => handlePackageToggle(pkg)}
                  className="accent-red-500 w-5 h-5"
                />
              </div>

              {/* 🔥 Highlighted Price */}
              <p className="text-lg font-bold text-red-600 mt-1">
                ₹{pkg.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Package modal view */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition-colors z-10 bg-white rounded-full p-2 shadow-md"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-5">
              <h3 className="text-2xl font-semibold text-gray-900">
                {selectedPackage.name}
              </h3>
              <p className="text-base text-gray-600 mt-1">
                {selectedPackage.duration}
              </p>
              <p className="text-xl font-bold text-red-600 mt-2">
                ₹{selectedPackage.price.toLocaleString()}
              </p>
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              modules={[Navigation]}
              navigation
              className="mb-5"
            >
              {selectedPackage.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <Image
                    src={img}
                    alt={selectedPackage.name}
                    width={800}
                    height={500}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Package Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPackage.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-gray-700 text-sm sm:text-base"
                  >
                    <span className="text-red-500 font-bold mt-1">•</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

