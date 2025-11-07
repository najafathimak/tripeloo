"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { assets } from "../../assets/assets";

const ListCarousel = () => {
  const slides = [
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

  return (
    <section className="relative h-[70vh] sm:h-[90vh] mt-6  ">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="h-full rounded-sm sm:rounded-3xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[90vh] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover brightness-75 rounded-sm sm:rounded-3xl"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ListCarousel;
