"use client";

import { Check, Dot } from "lucide-react";

interface IncludeItem {
  id: number;
  title: string;
}

const includes: IncludeItem[] = [
  { id: 1, title: "Expert Tour Guide" },
  { id: 2, title: "Water Refill - Bring your own reusable bottle" },
  { id: 3, title: "Entrance Fee" },
  { id: 4, title: "Upscale Transportation" },
];

const excludes: IncludeItem[] = [
  { id: 1, title: "Gratuities" },
  {
    id: 2,
    title: "Children under 8 years old - call local operator for exceptions",
  },
  {
    id: 3,
    title: "We do NOT provide additional clothing for our guests",
  },
  { id: 4, title: "Lunch Is not provided" },
];

export default function IncludeItemSection() {
  return (
    <section className="bg-red-50 py-7 px-6 md:px-5 rounded-lg">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          What Includes
        </h2>
        <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
          {includes.map((item) => (
            <div className="flex items-start gap-2">
              <Dot size={20} className="text-red-500  " />
              <p className="text-sm text-gray-700 leading-snug">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          What Excludes
        </h2>
        <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
          {excludes.map((item) => (
            <div className="flex items-start gap-3">
              <Dot size={20} className="text-red-500 mt-1 shrink-0" />
              <p className="text-sm text-gray-700 leading-snug">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
