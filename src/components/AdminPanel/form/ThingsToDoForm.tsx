"use client";
import React, { useState } from "react";

const ThingsToDoForm = () => {
  const [includes, setIncludes] = useState([""]);
  const [excludes, setExcludes] = useState([""]);
  const [carousel, setCarousel] = useState([{ image: "", title: "" }]);

  const addField = (type: string) => {
    if (type === "include") setIncludes([...includes, ""]);
    if (type === "exclude") setExcludes([...excludes, ""]);
    if (type === "carousel")
      setCarousel([...carousel, { image: "", title: "" }]);
  };

  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        Add Things To Do
      </h2>

      <form className="max-w-6xl mx-auto px-6 space-y-8 text-left">
        {/* 🏷️ Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Activity Title (e.g., Discover Rocky Mountain National Park)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* 💰 Pricing */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Current Price (INR)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Original Price (INR)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* 🧾 About */}
        <div>
          <h3 className="font-semibold text-lg mb-3">About</h3>
          <textarea
            rows={5}
            placeholder="Describe the activity in detail..."
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* ⏱️ Duration and Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <input
            type="text"
            placeholder="Duration (e.g., 8 hours)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Age Group (e.g., 8-99)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Language (e.g., English)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Includes</h3>
            {includes.map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Include ${i + 1}`}
                className="border border-gray-300 rounded-md p-3 w-full mb-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            ))}
            <button
              type="button"
              onClick={() => addField("include")}
              className="text-sm text-red-600 mt-2 hover:underline"
            >
              + Add Include
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Excludes</h3>
            {excludes.map((_, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Exclude ${i + 1}`}
                className="border border-gray-300 rounded-md p-3 w-full mb-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            ))}
            <button
              type="button"
              onClick={() => addField("exclude")}
              className="text-sm text-red-600 mt-2 hover:underline"
            >
              + Add Exclude
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Carousel Images</h3>
          {carousel.map((_, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-4 mb-3">
              <input
                type="file"
                className="border bg-white border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Image Title / Caption"
                className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("carousel")}
            className="text-sm text-red-600 mt-2 hover:underline"
          >
            + Add Carousel Image
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Location</h3>
          <input
            type="text"
            placeholder="Location (e.g., Kerala, India)"
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* 🧾 Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-[#E51A4B] hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-md shadow-md transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThingsToDoForm;
