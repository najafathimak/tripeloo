"use client";

import { Star } from "lucide-react";
import Image from "next/image";

const ratingSummary = {
  average: 5.0,
  totalReviews: 388,
  distribution: [388, 0, 0, 0, 0], // [5,4,3,2,1 stars]
};

const reviews = [
  {
    id: 1,
    name: "Elaina Strong",
    date: "12 Dec 2023",
    booked: "Highlights of Iceland | Tracing City Sights and Northern Lights",
    review:
      "Spectacular sights and warm hospitality made our Iceland tour unforgettable. The memories we made will last a lifetime. Every point was discussed in great depth. The visa crew were constantly open and honest. Everything went smoothly the entire time. Thank you so much and congrats to the Tripeloo team!",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&q=80",
  },
  {
    id: 2,
    name: "Manish Behera",
    date: "12 Dec 2023",
    booked: "Highlights of Iceland | Tracing City Sights and Northern Lights",
    review:
      "Fantastic arrangements, smooth planning, and a very helpful support team. Loved every bit of the trip. Highly recommend Tripeloo for stress-free travel planning!",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
  },
];

export default function ReviewsSection() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Reviews ({ratingSummary.totalReviews})
      </h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center border-r pr-8">
          <div className="flex items-center mb-2">
            <Star className="text-green-500 fill-green-500 w-6 h-6" />
            <Star className="text-green-500 fill-green-500 w-6 h-6" />
            <Star className="text-green-500 fill-green-500 w-6 h-6" />
            <Star className="text-green-500 fill-green-500 w-6 h-6" />
            <Star className="text-green-500 fill-green-500 w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-green-600">
            {ratingSummary.average.toFixed(1)}
          </p>
          <p className="text-sm text-green-700">From 70+ countries</p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 w-full">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div
              key={star}
              className="flex items-center gap-2 text-gray-700 text-sm mb-1"
            >
              <span className="w-4">{star}</span>
              <Star className="text-yellow-500 fill-yellow-500 w-4 h-4" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{
                    width: `${
                      (ratingSummary.distribution[5 - star] /
                        ratingSummary.totalReviews) *
                        100 || 0
                    }%`,
                  }}
                />
              </div>
              <span className="w-8 text-right text-xs text-gray-500">
                {ratingSummary.distribution[5 - star]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-8 space-y-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Image
                  src={r.avatar}
                  alt={r.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{r.name}</h3>
                  <p className="text-sm text-gray-500">
                    Reviewed: {r.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <Star className="w-4 h-4 fill-green-500" /> 5.0/5
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold text-gray-800">Booked:</span>{" "}
              {r.booked}
            </p>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              {r.review}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
