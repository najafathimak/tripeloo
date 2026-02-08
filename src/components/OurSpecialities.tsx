'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Map, BookOpen, Home } from 'lucide-react';

const specialities = [
  {
    icon: MessageCircle,
    title: '24/7 Chat Assistance',
    description: 'Got a question or need help during your trip? Our support team is just a message away — anytime, anywhere.',
  },
  {
    icon: Map,
    title: 'Customised Itineraries',
    description: 'Every traveler is unique, so is every Tripeloo trip. We design your journey around your interests, pace, and preferences.',
  },
  {
    icon: BookOpen,
    title: 'Travel Guide for All Packages',
    description: 'From history to hidden spots, our expert travel guides add depth and insight to every journey.',
  },
  {
    icon: Home,
    title: 'Unique Staycation',
    description: 'We manage and partner with unique stays across destinations to deliver comfort, character, and convenience.',
  },
];

export default function OurSpecialities() {
  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: chat-style messages, alternating left/right slide on scroll */}
        <div className="md:hidden space-y-6">
          {specialities.map((block, index) => {
            const Icon = block.icon;
            const isFromLeft = index % 2 === 0; // 0, 2 = from left; 1, 3 = from right

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isFromLeft ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`flex ${isFromLeft ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-4 shadow-lg ${
                    isFromLeft
                      ? 'rounded-tl-sm bg-[#E51A4B]/5 border-l-4 border-[#E51A4B]'
                      : 'rounded-tr-sm bg-gray-50 border-r-4 border-[#E51A4B]'
                  }`}
                >
                  {/* Highlight: icon + title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#E51A4B] text-white shrink-0">
                      <Icon className="w-5 h-5" strokeWidth={1.8} stroke="currentColor" fill="none" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 font-display">
                      {block.title}
                    </h3>
                  </div>
                  {/* Message */}
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">
                    {block.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: grid with same chat-style cards, alternating slide */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {specialities.map((block, index) => {
            const Icon = block.icon;
            const isFromLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isFromLeft ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-full max-w-[280px] rounded-2xl px-5 py-5 shadow-lg bg-white border border-gray-100 hover:shadow-xl hover:border-[#E51A4B]/20 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-[#E51A4B] text-white shadow-lg shadow-[#E51A4B]/20 mx-auto">
                    <Icon className="w-7 h-7" strokeWidth={1.8} stroke="currentColor" fill="none" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 font-display">
                    {block.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {block.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
