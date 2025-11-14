"use client";

import { Dot } from "lucide-react";

interface IncludeItemSectionProps {
  includes?: string[];
  excludes?: string[];
}

export default function IncludeItemSection({ includes = [], excludes = [] }: IncludeItemSectionProps) {
  // Fallback to default data if no props provided
  const defaultIncludes = [
    "Expert Tour Guide",
    "Water Refill - Bring your own reusable bottle",
    "Entrance Fee",
    "Upscale Transportation",
  ];

  const defaultExcludes = [
    "Gratuities",
    "Children under 8 years old - call local operator for exceptions",
    "We do NOT provide additional clothing for our guests",
    "Lunch Is not provided",
  ];

  const displayIncludes = includes.length > 0 ? includes : defaultIncludes;
  const displayExcludes = excludes.length > 0 ? excludes : defaultExcludes;

  return (
    <section className="bg-red-50 py-7 px-6 md:px-5 rounded-lg">
      {displayIncludes.length > 0 && (
        <div className={displayExcludes.length > 0 ? "mb-10" : ""}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            What Includes
          </h2>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
            {displayIncludes.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <Dot size={20} className="text-red-500" />
                <p className="text-sm text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {displayExcludes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            What Excludes
          </h2>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
            {displayExcludes.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Dot size={20} className="text-red-500 mt-1 shrink-0" />
                <p className="text-sm text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
