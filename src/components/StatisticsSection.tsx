"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Calendar, Home, MapPin } from "lucide-react";

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  caption: string;
  duration?: number; // Animation duration in ms
}

const stats: Stat[] = [
  {
    icon: Users,
    value: 4000,
    suffix: "+",
    label: "Clients Served",
    caption: "Happy travelers trust us for their journeys",
    duration: 2000,
  },
  {
    icon: Calendar,
    value: 6,
    suffix: "+",
    label: "Years Industrial Experience",
    caption: "Dedicated to excellence in travel experiences",
    duration: 2000,
  },
  {
    icon: Home,
    value: 400,
    suffix: "+",
    label: "Stays",
    caption: "Curated accommodations across destinations",
    duration: 2000,
  },
  {
    icon: MapPin,
    value: 14,
    suffix: "+",
    label: "Destinations",
    caption: "Beautiful places waiting to be explored",
    duration: 2000,
  },
];

export default function StatisticsSection() {
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounts();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounts = () => {
    stats.forEach((stat, index) => {
      const duration = stat.duration || 2000;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = stat.value;
      const steps = 60; // Number of animation steps
      const stepDuration = duration / steps;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);

        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = currentValue;
          return newCounts;
        });

        if (progress < 1) {
          setTimeout(animate, stepDuration);
        } else {
          // Ensure final value is set
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = endValue;
            return newCounts;
          });
        }
      };

      // Stagger the animations slightly
      setTimeout(animate, index * 100);
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#E51A4B] to-[#c91742] text-white overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating circles - more visible */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/15 rounded-full blur-2xl animate-float-1"></div>
        <div className="absolute top-1/4 right-20 w-48 h-48 bg-white/15 rounded-full blur-2xl animate-float-2"></div>
        <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-white/15 rounded-full blur-2xl animate-float-3"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 bg-white/15 rounded-full blur-2xl animate-float-4"></div>
        <div className="absolute top-1/2 left-1/3 w-52 h-52 bg-white/12 rounded-full blur-2xl animate-float-5"></div>
        <div className="absolute bottom-1/3 right-1/4 w-38 h-38 bg-white/15 rounded-full blur-2xl animate-float-6"></div>
        
        {/* Animated gradient orbs - more visible */}
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-white/8 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/3 w-[450px] h-[450px] bg-white/8 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-white/6 rounded-full blur-3xl animate-pulse-slow-delayed-2"></div>
        
        {/* Floating particles - more visible */}
        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-white/40 rounded-full animate-particle-1 shadow-lg shadow-white/20"></div>
        <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-white/40 rounded-full animate-particle-2 shadow-lg shadow-white/20"></div>
        <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-white/40 rounded-full animate-particle-3 shadow-lg shadow-white/20"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-particle-4 shadow-lg shadow-white/20"></div>
        <div className="absolute top-1/4 left-2/3 w-3.5 h-3.5 bg-white/40 rounded-full animate-particle-5 shadow-lg shadow-white/20"></div>
        <div className="absolute bottom-1/4 right-2/3 w-2.5 h-2.5 bg-white/40 rounded-full animate-particle-6 shadow-lg shadow-white/20"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-20 right-1/4 w-24 h-24 border-2 border-white/20 rounded-lg rotate-45 animate-rotate-slow"></div>
        <div className="absolute bottom-32 left-1/5 w-20 h-20 border-2 border-white/20 rounded-lg rotate-12 animate-rotate-slow-reverse"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 border-2 border-white/20 rounded-full animate-rotate-slow"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const displayValue = counts[index];

            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                </div>

                {/* Number with animation */}
                <div className="mb-2 sm:mb-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tabular-nums">
                    {displayValue.toLocaleString()}
                  </span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
                    {stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <p className="text-xs sm:text-sm lg:text-base font-medium text-white/90 leading-tight mb-2">
                  {stat.label}
                </p>
                
                {/* Caption */}
                <p className="text-[10px] sm:text-xs text-white/70 font-light leading-relaxed max-w-[200px]">
                  {stat.caption}
                </p>
              </div>
            );
          })}
        </div>

        {/* Positive Caption */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-white/80 font-light italic max-w-2xl mx-auto leading-relaxed">
            Trusted by thousands of travelers, we're committed to creating unforgettable experiences that bring joy and adventure to every journey.
          </p>
        </div>
      </div>
    </section>
  );
}

