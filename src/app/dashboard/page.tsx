"use client";

import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={styles.container}>
        <h1 style={styles.heading}>Dashboard</h1>

        <div style={styles.grid}>
          
          <div style={styles.card}>
            <h3>Total Bookings</h3>
            <p>120</p>
          </div>

          <div style={styles.card}>
            <h3>Total Users</h3>
            <p>80</p>
          </div>

          <div style={styles.card}>
            <h3>Revenue</h3>
            <p>₹45,000</p>
          </div>

          <div style={styles.card}>
            <h3>Packages</h3>
            <p>15</p>
          </div>

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
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "0.3s",
  },
};