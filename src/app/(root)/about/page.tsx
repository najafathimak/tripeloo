import { assets } from "../../../assets/assets";
import Image from "next/image";
import ContactSection from "@/components/Contact";

const About = () => {
  return (
    <div className="text-black min-h-screen ">
      {/* ---------- About Section ---------- */}
      <section className="relative px-6 sm:px-10 py-16 overflow-hidden">
        {/* Background Image with subtle overlay */}
        <Image
          src={assets.about}
          alt="Luxury stay background"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-10"
        />

        <div className="relative mt-5 z-10 max-w-6xl mx-auto">
          <h2 className="text-center text-3xl sm:text-4xl font-semibold text-[#E51A4B] mb-12">
            About <span className="text-red-400 font-bold">Us</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Overlapping Image Style */}
            <div className="relative w-full md:w-1/2 flex justify-center">
              <div className="relative w-[320px] sm:w-[400px]">
                <Image
                  src={assets.staysfeatures}
                  alt="Tripeloo"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-2xl shadow-xl object-cover"
                />

                {/* Smaller overlapping image (for visual style) */}
                <div className="absolute bottom-[-30px] right-[-30px] w-[160px] sm:w-[200px] rounded-xl overflow-hidden shadow-md border-4 border-white">
                  <Image
                    src={assets.img}
                    alt="Luxury resort"
                    width={200}
                    height={150}
                    className="object-cover w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="flex flex-col gap-6 md:w-1/2 text-base sm:text-lg text-gray-700 leading-relaxed">
              <p>
                Welcome to <b className="text-sky-800">Tripeloo</b> — your
                trusted travel companion for discovering the most beautiful
                resorts, holiday destinations, and exclusive travel packages
                across the globe. We’re here to make travel planning effortless,
                enjoyable, and truly unforgettable.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 mt-2">
                What We Offer
              </h3>
              <p>
                At <b className="text-sky-800">Tripeloo</b>, we connect
                travelers with handpicked resorts, curated vacation packages,
                and unique local experiences. From luxury beach stays to
                adventure getaways, our platform lets you explore, compare, and
                book with ease — bringing transparency, comfort, and excitement
                to every step of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Contact Section ---------- */}
      <section className="px-6 sm:px-10 py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-8xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#E51A4B] mb-12">
            Contact <span className="text-red-400 font-bold">Us</span>
          </h2>
          <ContactSection />
        </div>
      </section>
    </div>
  );
};

export default About;
