"use client";

export default function PropertyForm() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-[500px]">

        <h1 className="text-3xl font-bold text-center mb-2">
          Property Management
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Add or edit property details
        </p>

        <form className="flex flex-col gap-5">

          {/* Property Name */}
          <div>
            <label className="block font-semibold mb-1">
              Property Name
            </label>

            <input
              type="text"
              placeholder="Enter property name"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-1">
              Location
            </label>

            <input
              type="text"
              placeholder="Enter location"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-semibold mb-1">
              Price per Night
            </label>

            <input
              type="number"
              placeholder="Enter price"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">
              Description
            </label>

            <textarea
              placeholder="Enter property description"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
          </div>

          <button className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save Property
          </button>

        </form>

      </div>

    </div>
  );
}