"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const correctPassword = process.env.NEXT_PUBLIC_PROVIDER_PASSWORD;

  const handleLogin = () => {
    if (password === correctPassword) {
      window.location.href = "/provider/dashboard";
    } else {
      setError("Wrong password");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Travel Provider Login</h1>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          marginTop: "20px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          border: "none",
        }}
      >
        Login
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}