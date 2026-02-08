"use client";

import Link from "next/link";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { useEffect, useState } from "react";
import { destinations as fallback } from "@/data/destinations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Card = { slug: string; name: string; image: string };

export function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
        
        // First, try to get featured destinations from home API
        const homeRes = await fetch(`${base}/api/home`, { cache: "no-store" });
        if (homeRes.ok) {
          const homeData = await homeRes.json();
          const featuredSlugs = homeData.data?.featuredDestinations || [];
          
          if (featuredSlugs.length > 0) {
            // Fetch all destinations to match with featured slugs
            const destRes = await fetch(`${base}/api/destinations`, { cache: "no-store" });
            if (destRes.ok) {
              const destJson = await destRes.json();
              const allDestinations = (destJson.data as Array<any>) || [];
              
              // Map featured slugs to destinations in order
              const featured = featuredSlugs
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((featured: any) => {
                  const dest = allDestinations.find((d: any) => d.slug === featured.slug);
                  return dest ? {
                    slug: dest.slug,
                    name: dest.name,
                    image: dest.coverImage,
                  } : null;
                })
                .filter((d: any) => d !== null)
                .slice(0, 8);
              
              if (featured.length > 0) {
                setDestinations(featured);
                setLoading(false);
                return;
              }
            }
          }
        }
        
        // Fallback to default: first 8 destinations
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
      <section className="mt-0" id="featured-destinations-section">
        <div className="container">
          <div className="flex items-end justify-between">
            <h2 className="text-lg sm:text-2xl font-bold">
              Tripeloo highlights
            </h2>
            <Link href="/destinations" className="text-brand text-sm">
              View all
            </Link>
          </div>
          <div className="mt-4 flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden rounded-xl border border-gray-100 bg-gray-100 animate-pulse"
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
    <section className="mt-0" id="featured-destinations-section">
      <div className="container">
        <div className="flex items-end justify-between">
          <h2 className="text-lg sm:text-2xl font-bold">
            Tripeloo highlights
          </h2>
          <Link href="/destinations" className="text-brand text-sm">
            View all
          </Link>
        </div>

        <div className="mt-4 relative px-10 md:px-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next-highlights",
              prevEl: ".swiper-button-prev-highlights",
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            loop={destinations.length > 4}
            className="!pb-10"
          >
            {destinations.map((d) => (
              <SwiperSlide key={d.slug}>
                <Link
                  href={`/destinations/${d.slug}#destination-overview-section`}
                  className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm h-full"
                >
                  <div className="relative h-28 sm:h-40">
                    <img
                      src={optimizeCloudinaryUrl(d.image)}
                      alt={d.name}
                      width={400}
                      height={160}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="font-semibold text-gray-900">{d.name}</div>
                    {/* Non-clickable tags to convey what's available at this destination */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 cursor-default select-none">
                        Stays
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 cursor-default select-none">
                        Things to do
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 cursor-default select-none">
                        Food spots
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {destinations.length > 3 && (
            <>
              <button
                type="button"
                className="swiper-button-prev-highlights absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 hover:border-[#E51A4B] hover:text-[#E51A4B] hidden md:flex items-center justify-center"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="swiper-button-next-highlights absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl border border-gray-200 hover:border-[#E51A4B] hover:text-[#E51A4B] hidden md:flex items-center justify-center"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
