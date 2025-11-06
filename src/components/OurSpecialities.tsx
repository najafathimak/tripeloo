'use client';

import { MessageCircle, Map, BookOpen, Home } from 'lucide-react';

const specialities = [
  {
    icon: MessageCircle,
    title: '24/7 Chat Assistance',
    description: 'Got a question or need help during your trip? Our support team is just a message away -anytime, anywhere.'
  },
  {
    icon: Map,
    title: 'Customised Itineraries',
    description: 'Every traveler is unique so is every Navigo trip. We design your journey around your interests, pace, and preferences.'
  },
  {
    icon: BookOpen,
    title: 'Travel Guide for All Packages',
    description: 'From history to hidden spots, our expert travel guides add depth and insight to every journey.'
  },
  {
    icon: Home,
    title: 'Unique Staycation',
    description: 'We manage and partner with unique stays across destinations to deliver comfort, character, and convenience.'
  }
];

export default function OurSpecialities() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12"></h2>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {specialities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                  style={{ backgroundColor: '#E51A4B' }}
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {item.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}