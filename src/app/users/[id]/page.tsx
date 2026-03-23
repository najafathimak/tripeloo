"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LeadDetails() {
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedLead");
    if (stored) {
      setLead(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={styles.container}>
      
      <button onClick={() => router.push("/users")} style={styles.backBtn}>
        ← Back to Leads
      </button>

      <h1>Lead Details</h1>

      {lead ? (
        <div style={styles.card}>
          <p><strong>ID:</strong> {lead.id}</p>
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Booking:</strong> {lead.booking}</p>
          <p><strong>Status:</strong> {lead.status}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    padding: "40px",
    background: "#f1f5f9",
    minHeight: "100vh",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px",
  },
  backBtn: {
    marginBottom: "20px",
    padding: "8px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};