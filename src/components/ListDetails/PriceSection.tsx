"use client";

import { Check } from "lucide-react";

interface PriceSectionProps {
  includes?: string[];
  excludes?: string[];
}

export default function PriceSection({ includes = [], excludes = [] }: PriceSectionProps) {
  // Fallback to default data if no props provided
  const priceIncludes = includes.length > 0 
    ? includes.map((item, index) => ({ id: index + 1, title: item }))
    : [
        { id: 1, title: "3 Nights Accommodation" },
        { id: 2, title: "2 Meals / day" },
        { id: 3, title: "On Trip Transport" },
        { id: 4, title: "Airport Transfers" },
        { id: 5, title: "Box Lunch, Dinner & Snacks" },
      ];

  const priceExcludes = excludes.length > 0
    ? excludes.map((item, index) => ({ id: index + 1, title: item }))
    : [
        { id: 1, title: "Departure Taxes" },
        { id: 2, title: "Entry Fees" },
        { id: 3, title: "Airport Transfers" },
        { id: 4, title: "Box Lunch, Dinner & Snacks" },
      ];

  return (
    <section className="bg-red-50 py-7 px-6 md:px-5 rounded-lg">
      {priceIncludes.length > 0 && (
        <div className={priceExcludes.length > 0 ? "mb-10" : ""}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Price Includes
          </h2>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
            {priceIncludes.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Check className="text-green-600 w-5 h-5 flex-shrink-0" />
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {priceExcludes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Price Excludes
          </h2>
          <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
            {priceExcludes.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-red-600 w-5 h-5 flex-shrink-0 flex items-center justify-center">•</span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
