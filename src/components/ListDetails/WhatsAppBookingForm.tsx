"use client";
import { useState } from "react";
import dayjs from "dayjs";

interface Room {
  id: number | string;
  name: string;
  rate?: string;
  price?: number;
  duration?: string;
}

interface WhatsAppBookingFormProps {
  selectedRooms: Room[];
  isPackage?: boolean;
}

export const WhatsAppBookingForm = ({ selectedRooms, isPackage = false }: WhatsAppBookingFormProps) => {
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const todayDate = dayjs().format("YYYY-MM-DD");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (isPackage) {
      // For packages, only travel date is required
      if (!checkIn) {
        alert("Please select your travel date.");
        return;
      }
      const today = dayjs().startOf("day");
      const travelDate = dayjs(checkIn);
      if (travelDate.isBefore(today)) {
        alert("Past dates are not allowed.");
        return;
      }
    } else {
      // For stays, both check-in and check-out are required
      if (!checkIn || !checkOut) {
        alert("Please select both check-in and check-out dates.");
        return;
      }
      const today = dayjs().startOf("day");
      const checkInDate = dayjs(checkIn);
      const checkOutDate = dayjs(checkOut);

      if (checkInDate.isBefore(today) || checkOutDate.isBefore(today)) {
        alert("Past dates are not allowed.");
        return;
      }

      if (checkOutDate.isBefore(checkInDate)) {
        alert("Check-out date must be after check-in date.");
        return;
      }
    }

    const selectedItemText =
      selectedRooms.length > 0
        ? selectedRooms
            .map((r, i) => {
              const price = r.price || (r.rate ? parseInt(r.rate.replace(/[^\d]/g, "")) : 0);
              const duration = r.duration ? ` (${r.duration})` : "";
              return `${i + 1}. ${r.name}${duration} - ₹${price.toLocaleString()}`;
            })
            .join("\n")
        : isPackage ? "No specific package selected" : "No specific room selected";

    const itemType = isPackage ? "Package(s)" : "Room(s)";
    const message = `Hello! I would like to book this ${isPackage ? "trip" : "stay"}
    
Selected ${itemType}:
${selectedItemText}

Adults: ${adults}
Kids: ${kids}
${!isPackage ? `Check-in: ${checkIn}\nCheck-out: ${checkOut}` : `Travel Date: ${checkIn || "To be selected"}`}

Please confirm availability and total price.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918089909386?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleCall = () => {
    window.open("tel:+918089909386");
  };

  return (
    <form
      onSubmit={handleBooking}
      className="mt-3 flex flex-col gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      {/* Selected Rooms/Packages Summary */}
      {selectedRooms.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-gray-800 font-medium text-sm mb-2">
            Selected {isPackage ? "Package(s)" : "Room(s)"}
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {selectedRooms.map((r) => {
              const price = r.price || (r.rate ? parseInt(r.rate.replace(/[^\d]/g, "")) : 0);
              const duration = r.duration ? ` (${r.duration})` : "";
              return (
                <li key={r.id} className="flex justify-between">
                  <span>{r.name}{duration}</span>
                  <span className="font-semibold">₹{price.toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Adults & Kids */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col flex-1">
          <label className="text-gray-700 font-medium text-sm">Adults</label>
          <input
            type="number"
            min="1"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="border px-2 py-1.5 rounded-lg w-full text-sm"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-gray-700 font-medium text-sm">Kids</label>
          <input
            type="number"
            min="0"
            value={kids}
            onChange={(e) => setKids(Number(e.target.value))}
            className="border px-2 py-1.5 rounded-lg w-full text-sm"
          />
        </div>
      </div>

      {/* Dates – improved for mobile */}
      {isPackage ? (
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium text-sm">Travel Date</label>
          <input
            type="date"
            min={todayDate}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border px-2 py-1.5 rounded-lg w-full text-sm"
          />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col flex-1 min-w-0">
            <label className="text-gray-700 font-medium text-sm">Check-in</label>
            <input
              type="date"
              min={todayDate}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border px-2 py-1.5 rounded-lg w-full text-sm"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <label className="text-gray-700 font-medium text-sm">Check-out</label>
            <input
              type="date"
              min={todayDate}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border px-2 py-1.5 rounded-lg w-full text-sm"
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button
          type="submit"
          className="flex-1 bg-[#E51A4B] hover:bg-red-700 transition text-white font-semibold py-2 rounded-lg text-sm"
        >
          Book Now on WhatsApp
        </button>
        <button
          type="button"
          onClick={handleCall}
          className="flex-1 border border-[#E51A4B] text-[#E51A4B] hover:bg-red-50 transition font-semibold py-2 rounded-lg text-sm"
        >
          Call Directly
        </button>
      </div>
    </form>
  );
};
