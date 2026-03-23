"use client";

import { useState } from "react";

export default function EditPropertyPage() {
  const [property, setProperty] = useState({
    title: "",
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
    alert("Property Updated Successfully");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Edit Property</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={property.title}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="location"
          placeholder="Location"
          value={property.location}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="price"
          placeholder="Price"
          value={property.price}
          onChange={handleChange}
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={property.description}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}