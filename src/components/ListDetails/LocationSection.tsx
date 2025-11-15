"use client";

import { MapPin } from "lucide-react";

interface LocationSectionProps {
  location?: string;
  destinationName?: string;
}

export default function LocationSection({ location, destinationName }: LocationSectionProps = {}) {
  // Show location from DB if available, otherwise show destination name
  const displayLocation = location?.trim() || destinationName?.trim() || "Location not specified";
  
  const locationData = {
    name: displayLocation,
    latitude: 52.2298,
    longitude: 21.0118,
  };

  return (
    <section className="mt-10 relative ">
      {/* Section heading */}
      <div className=" mb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 ">
          Location
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the breathtaking landscapes and local
        </p>
      </div>

      {/* Location Card */}
      <div className="relative bg-gradient-to-br from-sky-50 via-white to-sky-100 rounded-3xl shadow-lg p-10 overflow-hidden border border-sky-100">
        {/* Decorative gradient background */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.15), transparent 40%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-6 h-6 text-sky-600 animate-bounce" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Location
            </h3>
          </div>

          <p className="text-gray-700 mb-6">{locationData.name}</p>

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 -left-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl opacity-40" />
        </div>
      </div>
    </section>
  );
}
