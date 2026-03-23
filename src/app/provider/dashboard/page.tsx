"use client";

import Link from "next/link";

export default function ProviderDashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Travel Provider Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Bookings</h2>
          <p className="text-2xl font-bold mt-2">25</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Confirmed</h2>
          <p className="text-2xl font-bold mt-2 text-green-600">18</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Pending</h2>
          <p className="text-2xl font-bold mt-2 text-orange-500">7</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Manage Bookings
        </h2>

        <Link href="/provider/bookings">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg">
            Go to Bookings →
          </button>
        </Link>
      </div>
    </div>
  );
}