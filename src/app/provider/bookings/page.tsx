"use client";

import { useState } from "react";

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      mobile: "9876543210",
      date: "2026-03-20",
      travelers: 2,
      status: "confirmed",
      room: "Deluxe Room",
      advance: 3000,
      extras: ["Breakfast", "Airport Pickup"],
    },
    {
      id: 2,
      name: "Anjali Nair",
      mobile: "9123456780",
      date: "2026-03-22",
      travelers: 4,
      status: "pending",
      request: "Sea view room with extra bed",
    },
  ]);

  const handleAccept = (id: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "confirmed",
              room: "Standard Room",
              advance: 2000,
              extras: ["Breakfast"],
            }
          : b
      )
    );
  };

  const handleReject = (id: number) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // 🔍 Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.mobile.includes(search);

    const matchesFilter =
      filter === "all" ? true : b.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Bookings Dashboard</h1>

      {/* 🔍 Search + Filter */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h2 className="text-lg font-semibold">{booking.name}</h2>
            <p className="text-sm text-gray-600">
              📞 {booking.mobile} | 📅 {booking.date}
            </p>
            <p className="text-sm">👥 {booking.travelers} Travelers</p>

            <p
              className={`font-bold ${
                booking.status === "confirmed"
                  ? "text-green-600"
                  : "text-orange-500"
              }`}
            >
              {booking.status.toUpperCase()}
            </p>

            {/* Confirmed */}
            {booking.status === "confirmed" && (
              <div className="text-sm mt-2">
                <p>🏨 {booking.room}</p>
                <p>💰 ₹{booking.advance}</p>
                <p>✨ {booking.extras.join(", ")}</p>
              </div>
            )}

            {/* Pending */}
            {booking.status === "pending" && (
              <div className="mt-3">
                <p className="text-sm mb-2">📝 {booking.request}</p>

                <button
                  onClick={() => handleAccept(booking.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(booking.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}