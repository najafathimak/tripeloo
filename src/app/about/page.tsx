import { assets } from "../../assets/assets";
import Image from "next/image";
import ContactSection from "@/components/Contact";

const About = () => {
  return (
    <div className="text-black min-h-screen  mt-8">
      <div className="relative px-8 py-16 overflow-hidden">
        <Image
          src={assets.about}
          alt="Luxury stay background"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-10"
        />

        <div className="relative z-10">
          <div className="text-center text-2xl text-sky-800 mb-10">
            <p>
              About <span className="text-sky-700 font-medium">US</span>
            </p>
          </div>

          <div className="my-10 flex flex-col md:flex-row gap-12 items-center">
            <Image
              src={assets.staysfeatures}
              alt="Tripeloo"
              width={400}
              height={300}
              className="w-full md:max-w-[400px] rounded-lg shadow-md h-auto"
            />

            <div className="flex flex-col gap-6 md:w-2/4 text-sm text-gray-600">
              <p>
                Welcome to <b>Tripeloo</b> — your trusted travel companion for
                discovering the most beautiful resorts, holiday destinations,
                and exclusive travel packages across the globe. We’re here to
                make travel planning effortless, enjoyable, and truly
                unforgettable.
              </p>

              <b className="text-gray-800 text-base">What We Offer</b>
              <p>
                At <b>Tripeloo</b>, we connect travelers with handpicked
                resorts, curated vacation packages, and unique local
                experiences. From luxury beach stays to adventure getaways, our
                platform lets you explore, compare, and book with ease. We aim
                to bring transparency, comfort, and excitement to every step of
                your journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 ">
        <div className="flex flex-col gap-2 text-center text-2xl text-sky-800">
          <p>
            Contact <span className="text-sky-700 font-medium">US</span>
          </p>
          <div className="mt-6">
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
