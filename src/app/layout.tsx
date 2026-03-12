import "./globals.css";

export const metadata = {
  title: "Tripeloo",
  description: "Travel Rhythm Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 40px",
            background: "white",
            borderBottom: "1px solid #eee",
          }}
        >
          {/* Logo */}
          <h2 style={{ color: "#e11d48", margin: 0 }}>Tripeloo</h2>

          {/* Navigation */}
          <nav style={{ display: "flex", gap: "25px" }}>
            <a href="/">Home</a>
            <a href="/destinations">Destinations</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>

          {/* Right Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #2563eb",
                background: "white",
                color: "#2563eb",
              }}
            >
              Call Assistance
            </button>

            <button
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "none",
                background: "#2563eb",
                color: "white",
              }}
            >
              Login
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}