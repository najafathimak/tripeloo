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
    alert("Property Saved");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "26px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Add / Edit Property
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label>Property Name</label>
            <input
              type="text"
              name="name"
              value={property.name}
              onChange={handleChange}
              placeholder="Enter property name"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginTop: "5px",
              }}
            />
          </div>

          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={property.location}
              onChange={handleChange}
              placeholder="Enter location"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginTop: "5px",
              }}
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={property.price}
              onChange={handleChange}
              placeholder="Enter price"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginTop: "5px",
              }}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={property.description}
              onChange={handleChange}
              placeholder="Enter property description"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginTop: "5px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Save Property
          </button>
        </form>
      </div>
    </div>
  );
}