"use client";

import Sidebar from "../components/Sidebar";

export default function Packages() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ padding: "30px", flex: 1 }}>
        <h1>Packages Page</h1>
      </div>
    </div>
  );
}