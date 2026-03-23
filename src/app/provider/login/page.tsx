"use client";

export default function LoginPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f4f4",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Provider Login</h2>

        <input
          placeholder="Email"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#ff3b5c",
            color: "white",
            border: "none",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}