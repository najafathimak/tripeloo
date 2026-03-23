"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Bookings() {
  const [search, setSearch] = useState("");

  const data = [
    { id: 1, name: "Aisha", place: "Goa", status: "Confirmed" },
    { id: 2, name: "Rahul", place: "Manali", status: "Pending" },
    { id: 3, name: "Sara", place: "Dubai", status: "Cancelled" },
  ];

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={styles.container}>
        <h1>Bookings</h1>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Place</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.place}</td>
                <td>
                  <span
                    style={{
                      color:
                        item.status === "Confirmed"
                          ? "green"
                          : item.status === "Pending"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    flex: 1,
    padding: "40px",
    background: "#f1f5f9",
    minHeight: "100vh",
  },
  search: {
    padding: "10px",
    margin: "15px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  table: {
    width: "100%",
    background: "#fff",
    borderRadius: "10px",
    padding: "10px",
  },
};