"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { assets } from "../../assets/assets";

interface ListCarouselProps {
  carouselImages?: Array<{ url: string }>;
  coverImage?: string;
}

const ThingsCarousel = ({ carouselImages = [], coverImage }: ListCarouselProps) => {
  // Use carouselImages if provided, otherwise fallback to default slides
  const slides = carouselImages.length > 0
    ? carouselImages.map((img, index) => ({
        id: index + 1,
        image: img.url,
        title: "",
        subtitle: "",
      }))
    : [
        {
          id: 1,
          image: assets.staysfeatures,
          title: "Explore the World with Tripeloo",
          subtitle: "Discover breathtaking destinations and unforgettable stays",
        },
        {
          id: 2,
          image: assets.img,
          title: "Luxury Stays, Unbeatable Prices",
          subtitle: "Find handpicked hotels, resorts, and villas tailored for you",
        },
        {
          id: 3,
          image: assets.about,
          title: "Your Journey Starts Here",
          subtitle: "Plan your dream vacation effortlessly with Tripeloo",
        },
      ];

  // If only coverImage is provided, use it as the first slide
  if (coverImage && carouselImages.length === 0) {
    slides.unshift({
      id: 0,
      image: coverImage,
      title: "",
      subtitle: "",
    });
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  return (
    <section className="relative h-[70vh] sm:h-[90vh] mt-6 overflow-hidden">
      <div className="embla h-full rounded-sm sm:rounded-3xl" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide) => (
            <div
              className="embla__slide flex-[0_0_100%] relative h-[70vh] sm:h-[90vh] "
              key={slide.id}
            >
              <Image
                src={slide.image}
                alt={slide.title || "Carousel image"}
                fill
                className="object-cover brightness-75 rounded-sm sm:rounded-3xl"
                priority
              />
              {slide.title && slide.subtitle && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
                    {slide.subtitle}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white z-10"
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white z-10"
      >
        ›
      </button>
    </section>
  );
};

export default ThingsCarousel;
