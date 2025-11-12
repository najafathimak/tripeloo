"use client";
import React, { useState } from "react";

const StayForm = () => {
  const [includes, setIncludes] = useState([""]);
  const [properties, setProperties] = useState([""]);
  const [features, setFeatures] = useState([""]);
  const [carousel, setCarousel] = useState([{ image: "", title: "" }]);
  const [rooms, setRooms] = useState([{ name: "", image: "", feature: "" }]);

  const addField = (type: string) => {
    if (type === "include") setIncludes([...includes, ""]);
    if (type === "property") setProperties([...properties, ""]);
    if (type === "features") setFeatures([...features, ""]);
    if (type === "carousel")
      setCarousel([...carousel, { image: "", title: "" }]);
    if (type === "room")
      setRooms([...rooms, { name: "", image: "", feature: "" }]);
  };

  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        Add Stay Details
      </h2>

      <form className="max-w-6xl mx-auto px-6 space-y-8 text-left">
        {/* 🏨 Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Stay Title"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Name"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* 💰 Price */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            placeholder="Current Price"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Original Price (optional)"
            className="border border-gray-300 rounded-md p-4 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* ✅ Includes */}
        <div className="grid md:grid-cols-2 gap-6 w-full">
          <div className="">
            <h3 className="font-semibold text-lg mb-3">Includes</h3>
            <div className="space-y-2 grid w-full ">
              {includes.map((_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Include ${i + 1}`}
                  className="border  border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => addField("include")}
              className="text-sm text-red-600 mt-2 hover:underline"
            >
              + Add Include
            </button>
          </div>

          {/* 🏝️ Resort Properties */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Resort Properties</h3>
            <div className="space-y-2 grid">
              {properties.map((_, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Property ${i + 1}`}
                  className="border border-gray-300 rounded-md p-3 w-full   focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => addField("property")}
              className="text-sm text-red-600 mt-2 hover:underline"
            >
              + Add Property
            </button>
          </div>
        </div>

        {/* 🖼️ Carousel Images */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Carousel Images</h3>
          {carousel.map((_, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-3 mb-2">
              <input
                type="file"
                className="border bg-white border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Title"
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

        {/* 🛏️ Rooms */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Rooms</h3>
          {rooms.map((_, i) => (
            <div
              key={i}
              className="border border-red-300 rounded-lg p-4 space-y-3 mb-3"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder={`Room Name ${i + 1}`}
                  className="border border-gray-300 rounded-md p-3 w-full   focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
                <input
                  type="file"
                  className="border bg-white border-gray-300 rounded-md p-3 w-full  focus:ring-2 focus:ring-red-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2 grid ">
                {features.map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`features ${i + 1}`}
                    className="border  border-gray-300 rounded-md p-3 w-2/5 focus:ring-2 focus:ring-red-400 focus:outline-none"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => addField("features")}
                className="text-sm text-red-600 mt-2 hover:underline"
              >
                + Add Features
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("room")}
            className="text-sm text-red-600 mt-2 hover:underline"
          >
            + Add Room
          </button>
        </div>

        {/* 📍 Location */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Location</h3>
          <input
            type="text"
            placeholder="Location Name"
            className="border border-gray-300 rounded-md p-3 w-full focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
        </div>

        {/* Submit */}
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

export default StayForm;
