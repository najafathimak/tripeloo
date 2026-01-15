"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Destination } from "@/types/destination";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface DestinationsClientProps {
  destinations: Destination[];
}

export default function DestinationsClient({ destinations }: DestinationsClientProps) {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || null;

  return (
    <div className="container py-8 sm:py-12">
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
           <motion.article
             key={d._id}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
           >
             <Link
               href={
                 category
                   ? `/destinations/${d.slug}?category=${category}`
                   : `/destinations/${d.slug}`
               }
               className="flex flex-col h-full"
             >
               <div className="relative h-56 w-full overflow-hidden">
                 <img
                   src={d.coverImage}
                   alt={d.name}
                   width={400}
                   height={224}
                   className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 <div className="absolute bottom-2 left-2 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs text-white">
                   {d.location}
                 </div>
               </div>
               <div className="p-4 flex flex-col flex-1">
                 <div className="flex items-start justify-between gap-3 mb-2">
                   <h2 className="text-lg font-semibold leading-snug group-hover:text-[#E51A4B] transition-colors">
                     {d.name}
                   </h2>
                   <div className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                     from {d.currency} {d.startingPrice.toLocaleString("en-IN")}
                   </div>
                 </div>
                 <p className="mt-2 line-clamp-2 text-sm text-gray-600 flex-1">
                   {d.summary}
                 </p>
                 <div className="mt-3 flex flex-wrap gap-2 mb-4">
                   {d.tags.map((t) => (
                     <span
                       key={t}
                       className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                     >
                       {t}
                     </span>
                   ))}
                 </div>
                 {/* CTA Button */}
                 <motion.div
                   whileHover={{ x: 5 }}
                   className="inline-flex items-center gap-2 text-[#E51A4B] font-semibold text-sm group-hover:gap-3 transition-all mt-auto"
                 >
                   <span>View Overview</span>
                   <ArrowRight className="w-4 h-4" />
                 </motion.div>
               </div>
             </Link>
           </motion.article>
        ))}
      </div>
    </div>
  );
}

