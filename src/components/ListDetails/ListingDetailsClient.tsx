"use client";
import { useState, useEffect, useRef } from "react";
import { WhatsAppBookingForm } from "@/components/ListDetails/WhatsAppBookingForm";
import { LeadFormPopup } from "@/components/LeadFormPopup";
import { X } from "lucide-react";

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

  // Mobile view: WhatsApp button that opens LeadFormPopup
  if (isMobile) {
    return (
      <>
        {/* Fixed Bottom Button - Mobile Only */}
        <div className="fixed bottom-6 left-0 right-0 z-40 md:hidden flex justify-center px-4 pointer-events-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-3.5 px-6 rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center gap-2.5 min-w-[200px] pointer-events-auto active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="text-base">Chat on WhatsApp</span>
          </button>
        </div>

        {/* LeadFormPopup - Mobile Only */}
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
  }

  // Desktop view: Original form
  return (
    <>
      <div className={`hidden md:block ${className}`}>
        <div className="border shadow-md p-6 bg-white rounded-2xl sticky top-24">
          <h2 className="text-gray-800 font-semibold text-lg line-clamp-2 mb-3">{title}</h2>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-bold text-gray-900">{price}</p>
          </div>
          <WhatsAppBookingForm 
            selectedRooms={selectedRooms} 
            isPackage={isPackage}
            destination={destination}
            itemName={title}
            itemType={itemType}
            itemLocation={itemLocation}
            itemPrice={price}
            itemImportantInfo={itemImportantInfo}
            isMobile={false}
          />
        </div>
      </div>

    </>
  );
};

export default BookingSidebar;
