"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Leads() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Aisha",
      email: "aisha@gmail.com",
      booking: "Goa Trip",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Rahul",
      email: "rahul@gmail.com",
      booking: "Manali Tour",
      status: "Pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [newLead, setNewLead] = useState("");

  // Add Lead
  const addLead = () => {
    if (newLead) {
      setLeads([
        ...leads,
        {
          id: Date.now(),
          name: newLead,
          email: "new@gmail.com",
          booking: "New Package",
          status: "Pending",
        },
      ]);
      setNewLead("");
    }
  };

  // Delete Lead
  const deleteLead = (id: number) => {
    setLeads(leads.filter((l) => l.id !== id));
  };

  // Filter + Search
  const filteredLeads = leads.filter((l) => {
    return (
      l.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || l.status === filter)
    );
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={styles.container}>
        <h1 style={styles.heading}>Leads</h1>

        {/* Controls */}
        <div style={styles.topBar}>
          <input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.input}
          >
            <option>All</option>
            <option>Confirmed</option>
            <option>Pending</option>
          </select>

          <input
            placeholder="Add new lead"
            value={newLead}
            onChange={(e) => setNewLead(e.target.value)}
            style={styles.input}
          />

          <button onClick={addLead} style={styles.addBtn}>
            + Add
          </button>
        </div>

        {/* Table */}
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Booking</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.name}</td>
                  <td>{l.email}</td>

                  {/* 🔥 CLICKABLE BOOKING */}
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        onClick={() => {
                          localStorage.setItem(
                            "selectedLead",
                            JSON.stringify(l)
                          );
                          window.location.href = `/users/${l.id}`;
                        }}
                        style={{
                          fontWeight: "bold",
                          color: "#2563eb",
                          cursor: "pointer",
                        }}
                      >
                        {l.booking}
                      </span>

                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        Linked Booking
                      </span>
                    </div>
                  </td>

                  <td>
                    <span style={styles.status}>{l.status}</span>
                  </td>

                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteLead(l.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    flex: 1,
    padding: "40px",
    background: "#f1f5f9",
  },
  heading: {
    marginBottom: "20px",
  },
  topBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  addBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
  },
  status: {
    padding: "5px 10px",
    borderRadius: "10px",
    background: "#dcfce7",
    color: "green",
  },
  deleteBtn: {
    background: "red",
    color: "#fff",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
  },
};