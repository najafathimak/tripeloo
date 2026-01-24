"use client";
import { useState, useEffect, useRef } from "react";
import { LeadFormPopup } from "@/components/LeadFormPopup";

interface BookingSidebarProps {
  selectedRooms: any[];
  title: string;
  price: string;
  oldPrice: string;
  savings: string;
  className?: string;
  isMobile?: boolean;
  isPackage?: boolean;
  destination?: string;
  itemType?: 'stay' | 'activity' | 'trip';
  itemLocation?: string;
  itemImportantInfo?: string;
}

const BookingSidebar = ({
  selectedRooms,
  title,
  price,
  oldPrice,
  savings,
  className = "",
  isMobile = false,
  isPackage = false,
  destination,
  itemType,
  itemLocation,
  itemImportantInfo,
}: BookingSidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(true);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to hide fixed button when form section is visible
  useEffect(() => {
    if (!isMobile || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hide button when form section is in viewport
          setShowFixedButton(!entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '-100px 0px', // Add some margin to trigger earlier
      }
    );

    if (formSectionRef.current) {
      observer.observe(formSectionRef.current);
    }

    return () => {
      if (formSectionRef.current) {
        observer.unobserve(formSectionRef.current);
      }
    };
  }, [isMobile]);

  // Mobile view: No button shown (BottomBookingTab handles it)
  if (isMobile) {
    return null;
  }

  // Desktop view: LeadFormPopup as fixed element
  return (
    <>
      <div className={`hidden md:block ${className}`}>
        <div className="border shadow-xl p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl sticky top-24 overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E51A4B]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-gray-800 font-semibold text-lg line-clamp-2 mb-3">{title}</h2>
            {itemType !== 'trip' && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-xl font-bold text-gray-900">{price}</p>
              </div>
            )}
            
            {/* Selected Rooms Info */}
            {selectedRooms.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-sm font-semibold text-green-800">
                    {selectedRooms.length} {selectedRooms.length === 1 ? 'Room' : 'Rooms'} Selected
                  </span>
                </div>
                <div className="text-xs text-green-700">
                  {selectedRooms.map((room, idx) => (
                    <div key={idx} className="truncate">
                      • {room.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impressive Connect Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`group relative w-full text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                selectedRooms.length > 0
                  ? 'bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-500 hover:to-green-600 animate-pulse'
                  : 'bg-gradient-to-r from-[#E51A4B] via-[#E51A4B] to-[#c91742] hover:from-[#c91742] hover:via-[#E51A4B] hover:to-[#E51A4B]'
              }`}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {/* Icon with animation */}
              <div className="relative z-10 flex items-center justify-center">
                {selectedRooms.length > 0 ? (
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    className="group-hover:scale-110 transition-transform duration-300"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="group-hover:scale-110 transition-transform duration-300"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                )}
              </div>
              
              {/* Text with animation */}
              <span className="relative z-10 text-base group-hover:tracking-wide transition-all duration-300">
                {selectedRooms.length > 0 ? 'Fill Details to Continue' : 'Connect with us'}
              </span>
              
              {/* Arrow icon */}
              <div className="relative z-10 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            </button>
            
            {/* Additional info text */}
            <p className="text-xs text-gray-500 text-center mt-3">
              {selectedRooms.length > 0 
                ? 'Complete your booking details below' 
                : 'Get instant quotes & personalized assistance'}
            </p>
          </div>
        </div>
      </div>

      {/* LeadFormPopup - Desktop */}
      <LeadFormPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSkip={() => setIsModalOpen(false)}
        itemName={title}
        itemType={itemType}
        itemPrice={price}
        itemDestination={destination}
      />
    </>
  );
};

export default BookingSidebar;
