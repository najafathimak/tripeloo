"use client";

import { useState } from "react";

export default function PropertyPage() {
  const [property, setProperty] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Property Data:", property);
    alert("Property Saved");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Add / Edit Property</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

        {/* Property Name */}
        <div>
          <label className="block font-medium">Property Name</label>
          <input
            type="text"
            name="name"
            value={property.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter property name"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={property.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter location"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={property.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter price"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={property.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter property description"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Property
        </button>

      </form>
    </div>
  );
}