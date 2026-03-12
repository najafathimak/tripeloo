"use client";

import { providerData } from "../../../data/providerData";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", fontFamily: "Arial", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "230px",
          background: "#1e293b",
          color: "white",
          padding: "25px",
        }}
      >
        <h2 style={{ marginBottom: "40px" }}>Tripeloo</h2>

        <p style={{ marginBottom: "20px", cursor: "pointer" }}>🏠 Dashboard</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>📅 Bookings</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>✈ Trips</p>
        <p style={{ marginBottom: "20px", cursor: "pointer" }}>💰 Earnings</p>

        <button
          onClick={() => (window.location.href = "/provider/login")}
          style={{
            marginTop: "40px",
            padding: "10px",
            width: "100%",
            background: "#ef4444",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "#f1f5f9", padding: "40px" }}>
        
        <h1 style={{ marginBottom: "30px" }}>
          Welcome Travel Provider 👋
        </h1>

        {/* Dashboard Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
          
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              flex: 1,
              transition: "0.3s",
            }}
          >
            <h3>📊 Total Bookings</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold", color: "#2563eb" }}>
              {providerData.totalBookings}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              flex: 1,
            }}
          >
            <h3>💰 Total Earnings</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold", color: "#16a34a" }}>
              ₹{providerData.totalEarnings}
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              flex: 1,
            }}
          >
            <h3>✈ Active Trips</h3>
            <p style={{ fontSize: "30px", fontWeight: "bold", color: "#ea580c" }}>
              {providerData.activeTrips}
            </p>
          </div>

        </div>

        {/* Recent Bookings */}
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Recent Bookings</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Trip</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
              </tr>
            </thead>

            <tbody>
              {providerData.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ padding: "12px", borderTop: "1px solid #ddd" }}>
                    {booking.customer}
                  </td>
                  <td style={{ padding: "12px", borderTop: "1px solid #ddd" }}>
                    {booking.trip}
                  </td>
                  <td style={{ padding: "12px", borderTop: "1px solid #ddd" }}>
                    {booking.date}
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