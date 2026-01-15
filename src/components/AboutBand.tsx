"use client";

import { Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AboutBandProps {
  title?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
}

// Fallback categories if no categories are fetched
const fallbackCategories = [
  "Resorts",
  "Poolvillas",
  "Tent rooms",
  "Wood house",
  "Homestay",
  "Hotels"
];

export function AboutBand({ 
  title = "Discover India with Tripeloo",
  content = "At Tripeloo, we handcraft travel experiences that celebrate India's diverse beauty — from misty mountains to sun-kissed beaches, royal heritage, and hidden escapes. Whether you seek adventure or serenity, our curated stays and guided journeys ensure every trip feels personal and effortless.",
  buttonText = "hello@tripeloo.com",
  buttonLink = "mailto:hello@tripeloo.com"
}: AboutBandProps) {
  const [stayTypes, setStayTypes] = useState<string[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?type=stay');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            // Filter only active categories and get their names
            const activeCategories = data.data
              .filter((cat: any) => cat.isActive !== false)
              .map((cat: any) => cat.name);
            
            // Use fetched categories if available, otherwise use fallback
            setStayTypes(activeCategories.length > 0 ? activeCategories : fallbackCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep fallback categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="discover-section" className="bg-gray-50 border-y border-gray-100">
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
