"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Destination } from "@/types/destination";

interface DestinationsClientProps {
  destinations: Destination[];
}

export default function DestinationsClient({ destinations }: DestinationsClientProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="container py-32">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Popular Destinations
        </h1>
        <p className="mt-2 text-gray-600">
          Explore top spots with cover images, starting prices, and highlights.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((d) => (
          <article
            key={d._id}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
          >
            <Link
              href={{
                pathname: "/stay-listings",
                query: {
                  destination: d.location,
                  ...(category && { category }),
                },
              }}
            >
              <div className="relative h-56 w-full">
                <Image
                  src={d.coverImage}
                  alt={d.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                  {d.location}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-snug">
                    {d.name}
                  </h2>
                  <div className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    from {d.currency} {d.startingPrice.toLocaleString("en-IN")}
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {d.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

