"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProviderDashboard() {

  const router = useRouter();

  useEffect(() => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/provider/login");
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");

    router.push("/provider/login");

  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Provider Dashboard</h1>

      <p>Welcome to Tripeloo Dashboard</p>

      <button
        onClick={handleLogout}
        style={{
          background: "red",
          color: "white",
          padding: "8px",
          borderRadius: "5px",
          border: "none"
        }}
      >
        Logout
      </button>

    </div>
  );
}