"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ArrowRight, Phone } from "lucide-react";
import { getPrimaryWhatsAppNumber } from "@/utils/whatsapp";
import { LeadFormPopup } from "@/components/LeadFormPopup";
import "swiper/css";
import "swiper/css/navigation";

interface DestinationStaysSectionProps {
  destinationSlug?: string;
  destinationName?: string;
}

interface StayCard {
  id: string;
  name: string;
  coverImage: string;
  startingPrice?: number;
}

const PHONE_HREF = `tel:${getPrimaryWhatsAppNumber().replace(/[\s\-]/g, "")}`;

export function DestinationStaysSection({ destinationSlug = "wayanad", destinationName: propDestinationName }: DestinationStaysSectionProps = {}) {
  const router = useRouter();
  const [destinationName, setDestinationName] = useState(propDestinationName || "Wayanad");
  const [stays, setStays] = useState<StayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [leadPopupStay, setLeadPopupStay] = useState<StayCard | null>(null);

  useEffect(() => {
    const slug = destinationSlug || "wayanad";
    if (propDestinationName) setDestinationName(propDestinationName);
    const fetchStays = async () => {
      try {
        const res = await fetch(`/api/destinations/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setStays([]);
          return;
        }
        const json = await res.json();
        const dest = json.data?.destination;
        const staysList = json.data?.stays || [];
        if (dest?.name) setDestinationName(dest.name);
        setStays(
          staysList.map((s: any) => ({
            id: s._id?.toString() || s.id || "",
            name: s.name || "",
            coverImage: s.coverImage || "",
            startingPrice: s.startingPrice,
          }))
        );
      } catch {
        setStays([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, [destinationSlug, propDestinationName]);

  const handleStayClick = (stayId: string) => {
    const params = new URLSearchParams({
      stay: stayId,
      destination: destinationName,
    });
    router.push(`/item-details?${params.toString()}`);
  };

  const discoverMoreUrl = `/stay-listings?destination=${encodeURIComponent(destinationName)}`;

  const openLeadForm = (stay: StayCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLeadPopupStay(stay);
    setShowLeadPopup(true);
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#E51A4B] border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (stays.length === 0) return null;

  const StayCardContent = ({ stay, onConnectClick }: { stay: StayCard; onConnectClick: (e: React.MouseEvent) => void }) => (
    <>
      <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
        <img
          src={optimizeCloudinaryUrl(stay.coverImage || "/placeholder-image.jpg")}
          alt={stay.name}
          width={400}
          height={300}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
          Stay
        </div>
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-[#E51A4B] transition-colors font-display">
          {stay.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          {stay.startingPrice != null && stay.startingPrice > 0 ? (
            <p className="text-lg sm:text-xl font-bold text-[#E51A4B]">
              ₹{stay.startingPrice.toLocaleString()}
              <span className="text-xs text-gray-600 font-normal"> / night</span>
            </p>
          ) : (
            <span />
          )}
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#E51A4B] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>
        {/* Phone + Connect with Tripeloo - stop propagation so card click doesn't fire */}
        <div
          className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={PHONE_HREF}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-[#E51A4B] hover:text-white transition-colors shrink-0"
            aria-label="Call Tripeloo"
          >
            <Phone className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={onConnectClick}
            className="flex-1 min-w-0 py-2.5 px-3 rounded-xl bg-[#E51A4B] hover:bg-[#c91742] text-white text-sm font-semibold transition-colors text-center"
          >
            Connect with Tripeloo
          </button>
        </div>
      </div>
    </>
  );

  return (
    <section className="py-10 sm:py-12 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-display">
            Stays in {destinationName}
          </h2>
        </motion.div>

        {/* Carousel: mobile = 1 card + peek of next, autoplay; desktop = 4 cards */}
        <div className="relative px-2 sm:px-4 md:px-12">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.15}
            slidesPerGroup={1}
            breakpoints={{
              768: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next-dest-stays",
              prevEl: ".swiper-button-prev-dest-stays",
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={stays.length > 1}
            className="!pb-12"
          >
            {stays.map((stay) => (
              <SwiperSlide key={stay.id}>
                <motion.div
                  onClick={() => handleStayClick(stay.id)}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                >
                  <StayCardContent stay={stay} onConnectClick={(e) => openLeadForm(stay, e)} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          {stays.length > 1 && (
            <>
              <button
                type="button"
                className="swiper-button-prev-dest-stays absolute left-0 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-800 p-2.5 md:p-3 rounded-full shadow-xl border border-gray-200 hover:border-[#E51A4B] hover:text-[#E51A4B] flex items-center justify-center"
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                className="swiper-button-next-dest-stays absolute right-0 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-800 p-2.5 md:p-3 rounded-full shadow-xl border border-gray-200 hover:border-[#E51A4B] hover:text-[#E51A4B] flex items-center justify-center"
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="text-center mt-3 hidden md:block">
            <Link
              href={discoverMoreUrl}
              className="inline-flex items-center gap-1.5 text-sm text-[#E51A4B] font-medium hover:text-red-700 transition-colors"
            >
              Discover more stays in {destinationName}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mobile only: Discover More - small, near cards */}
        <div className="md:hidden mt-3 px-2">
          <Link
            href={discoverMoreUrl}
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 text-sm font-medium text-[#E51A4B] border border-[#E51A4B]/40 rounded-lg hover:bg-[#E51A4B]/5 active:scale-[0.98] transition-all"
          >
            Discover more stays in {destinationName}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <LeadFormPopup
        isOpen={showLeadPopup}
        onClose={() => { setShowLeadPopup(false); setLeadPopupStay(null); }}
        onSkip={() => { setShowLeadPopup(false); setLeadPopupStay(null); }}
        itemName={leadPopupStay?.name}
        itemType="stay"
        itemPrice={leadPopupStay?.startingPrice != null && leadPopupStay.startingPrice > 0 ? `₹${leadPopupStay.startingPrice.toLocaleString()}/ night` : undefined}
        itemDestination={destinationName}
      />
    </section>
  );
}
