"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProviderLogin() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e:any) => {
    e.preventDefault();

    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (data.success) {

      localStorage.setItem("isLoggedIn", "true");

      router.push("/provider/dashboard");

    } else {
      setError("Invalid login credentials");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        Tripeloo
      </h1>

      <p>Provider Login</p>

      <form
        onSubmit={handleLogin}
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >

        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            border: "none"
          }}
        >
          Login
        </button>

      </form>

    </div>
  );
}