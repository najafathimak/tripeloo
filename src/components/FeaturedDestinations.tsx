"use client";

import Image from "next/image";
import Link from "next/link";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { useEffect, useState } from "react";
import { destinations as fallback } from "@/data/destinations";

type Card = { slug: string; name: string; image: string };

export function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
        const res = await fetch(`${base}/api/destinations`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        const rows = (json.data as Array<any>) || [];
        const featured = rows.slice(0, 8).map((d: any) => ({
          slug: d.slug,
          name: d.name,
          image: d.coverImage,
        }));
        setDestinations(featured);
      } catch {
        const featured = fallback.slice(0, 8).map((d) => ({
          slug: d.slug,
          name: d.name,
          image: d.coverImage,
        }));
        setDestinations(featured);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="mt-16 sm:mt-24">
        <div className="container">
          <div className="flex items-end justify-between">
            <h2 className="text-lg sm:text-2xl font-bold">
              Featured Destinations
            </h2>
            <Link href="/destinations" className="text-brand text-sm">
              View all
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-gray-100 bg-gray-100 animate-pulse"
              >
                <div className="h-28 sm:h-40 bg-gray-200" />
                <div className="p-3 sm:p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 sm:mt-24">
      <div className="container">
        <div className="flex items-end justify-between">
          <h2 className="text-lg sm:text-2xl font-bold">
            Featured Destinations
          </h2>
          <Link href="/destinations" className="text-brand text-sm">
            View all
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {destinations.map((d) => {
            const encodedName = encodeURIComponent(d.name);
            return (
              <Link
                key={d.slug}
                href={`/stay-listings?destination=${encodedName}`}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative h-28 sm:h-40">
                  <Image
                    src={optimizeCloudinaryUrl(d.image)}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-xs text-gray-500">
                    Explore stays & activities
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
