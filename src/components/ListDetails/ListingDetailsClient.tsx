"use client";
import { WhatsAppBookingForm } from "@/components/ListDetails/WhatsAppBookingForm";

interface BookingSidebarProps {
  selectedRooms: any[];
  title: string;
  price: string;
  oldPrice: string;
  savings: string;
  className?: string;
  isMobile?: boolean;
}

const BookingSidebar = ({
  selectedRooms,
  title,
  price,
  oldPrice,
  savings,
  className = "",
  isMobile = false,
}: BookingSidebarProps) => {
  return (
    <div
      className={`
        border shadow-md p-6 bg-white rounded-2xl
        ${isMobile ? "fixed bottom-0 left-0 right-0 z-50 rounded-none shadow-lg" : "sticky top-24"}
        ${className}
      `}
    >
      <h2 className="text-gray-800 font-semibold text-lg line-clamp-2">{title}</h2>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xl font-bold text-gray-900">{price}</p>
        <span className="line-through text-gray-500 text-sm">{oldPrice}</span>
      </div>

      <p className="text-emerald-600 text-sm mt-1">SAVE {savings}</p>

      <div className="mt-4">
        <WhatsAppBookingForm selectedRooms={selectedRooms} />
      </div>
    </div>
  );
};

export default BookingSidebar;
