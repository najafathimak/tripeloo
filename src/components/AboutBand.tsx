import { Circle } from 'lucide-react';

interface AboutBandProps {
  title?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function AboutBand({ 
  title = "Discover India with Tripeloo",
  content = "At Tripeloo, we handcraft travel experiences that celebrate India's diverse beauty — from misty mountains to sun-kissed beaches, royal heritage, and hidden escapes. Whether you seek adventure or serenity, our curated stays and guided journeys ensure every trip feels personal and effortless.",
  buttonText = "hello@tripeloo.com",
  buttonLink = "mailto:hello@tripeloo.com"
}: AboutBandProps) {
  const stayTypes = [
    "Resorts",
    "Poolvillas",
    "Tent rooms",
    "Wood house",
    "Homestay",
    "Hotels"
  ];

  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="container py-10 sm:py-14">
        <div className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-serif">
            {content}
          </p>
          <div className="pt-4">
            <a
              href={buttonLink}
              className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition"
            >
              {buttonText}
            </a>
          </div>
        </div>

        {/* Moving Items Marquee */}
        <div className="mt-8 sm:mt-10 overflow-hidden">
          <div className="marquee-stay-types">
            <div className="marquee-stay-types__track">
              {[...stayTypes, ...stayTypes].map((item, index) => (
                <span key={index} className="marquee-stay-types__item">
                  {item}
                  {index < stayTypes.length * 2 - 1 && (
                    <Circle className="marquee-stay-types__icon" size={4} fill="currentColor" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
