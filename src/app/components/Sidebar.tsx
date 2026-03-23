"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div style={styles.sidebar}>
      
      {/* Logo */}
      <h2 style={styles.logo}>Tripeloo</h2>

      {/* Dashboard */}
      <div style={styles.menu} onClick={() => router.push("/dashboard")}>
        🏠 Dashboard
      </div>

      {/* Bookings */}
      <div style={styles.menu} onClick={() => router.push("/bookings")}>
        📋 Bookings
      </div>

      {/* ✅ UPDATED: LEADS */}
      <div style={styles.menu} onClick={() => router.push("/users")}>
        👤 Leads
      </div>

      {/* Packages */}
      <div style={styles.menu} onClick={() => router.push("/packages")}>
        📦 Packages
      </div>

      {/* Logout */}
      <button
        style={styles.logout}
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}

const styles: any = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "linear-gradient(180deg, #1e293b, #0f172a)",
    color: "#fff",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    marginBottom: "40px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  menu: {
    padding: "12px",
    marginBottom: "12px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.05)",
    transition: "0.3s",
  },
  logout: {
    marginTop: "auto",
    padding: "12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};