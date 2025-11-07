import Image from "next/image";
import { assets } from "../assets/assets";

const StayFeatures = () => {
  return (
    <section className="relative min-h-screen bg-white text-black flex flex-col items-center overflow-hidden px-6 md:px-16 py-24">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={assets.staysfeatures}
          alt="Luxury stay background"
          fill
          className="object-cover opacity-15"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 max-w-6xl w-full">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center text-[#E51A4B]">
          Beautiful Stays for Every Kind of Traveller
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3]">
              <Image
                src={assets.img}
                alt="Luxury resort room"
                fill
                className="rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="text-gray-700">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#E51A4B]">
              Comfort Meets Elegance
            </h3>
            <p className="text-base md:text-lg leading-relaxed mb-4">
              Discover handpicked accommodations designed to make your travels
              unforgettable. From serene beachfront villas and cozy mountain
              cabins to urban luxury hotels — we’ve curated stays that match
              your style and comfort.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              Each stay comes with verified amenities, real guest reviews, and
              easy booking options. Whether you seek adventure, relaxation, or a
              romantic escape, our stays promise a blend of luxury, warmth, and
              authenticity wherever your journey takes you.
            </p>
          </div>
        </div>
      </div>

      {/* Soft background animation */}
      <div className="absolute inset-0 -z-10 animate-pulse bg-gradient-to-tr from-[#E51A4B]/10 via-white/30 to-[#E51A4B]/10 blur-3xl opacity-40" />
    </section>
  );
};

export default StayFeatures;
