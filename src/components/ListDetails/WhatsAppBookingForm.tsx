"use client";
import { useState } from "react";
import dayjs from "dayjs";

interface Room {
  id: number;
  name: string;
  rate: string;
}

interface WhatsAppBookingFormProps {
  selectedRooms: Room[];
}

export const WhatsAppBookingForm = ({ selectedRooms }: WhatsAppBookingFormProps) => {
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const todayDate = dayjs().format("YYYY-MM-DD");

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

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

    const selectedRoomText =
      selectedRooms.length > 0
        ? selectedRooms
            .map(
              (r, i) => `${i + 1}. ${r.name} - ₹${r.rate.replace(/[^\d]/g, "")}`
            )
            .join("\n")
        : "No specific room selected";

    const message = `Hello! I would like to book "Highlights of Iceland | Tracing City Sights and Northern Lights"
    
Selected Room(s):
${selectedRoomText}

Adults: ${adults}
Kids: ${kids}
Check-in: ${checkIn}
Check-out: ${checkOut}

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
      {/* Selected Rooms Summary */}
      {selectedRooms.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-gray-800 font-medium text-sm mb-2">
            Selected Room(s)
          </h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {selectedRooms.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span>{r.name}</span>
                <span className="font-semibold">₹{r.rate}</span>
              </li>
            ))}
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
      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center sm:gap-3">
        <div className="flex flex-col flex-1">
          <label className="text-gray-700 font-medium text-sm">Check-in</label>
          <input
            type="date"
            min={todayDate}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border px-2 py-1.5 rounded-lg w-full text-sm"
          />
        </div>

        <div className="flex flex-col flex-1">
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
