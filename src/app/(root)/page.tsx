export default function Home() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f5f7fb" }}>

      {/* HERO SECTION */}
      <section
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "50px", marginBottom: "10px" }}>
            Explore the World with Tripeloo
          </h1>

          <p style={{ fontSize: "18px", marginBottom: "25px" }}>
            Discover amazing travel destinations and unforgettable experiences
          </p>

          <button
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Explore Trips
          </button>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section style={{ padding: "60px 40px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "40px", fontSize: "32px" }}>
          Popular Destinations
        </h2>

        <div
          style={{
            display: "flex",
            gap: "25px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["Goa", "Munnar", "Manali", "Wayanad"].map((place) => (
            <div
              key={place}
              style={{
                width: "260px",
                background: "white",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`https://source.unsplash.com/400x300/?${place}`}
                alt={place}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                }}
              />

              <div style={{ padding: "15px" }}>
                <h3>{place}</h3>
                <p>Beautiful destination to explore.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        style={{
          background: "white",
          padding: "60px 40px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "40px", fontSize: "30px" }}>
          Why Choose Tripeloo?
        </h2>

        <div
          style={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "250px" }}>
            <h3>🌍 Best Destinations</h3>
            <p>Handpicked travel experiences across beautiful places.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>💰 Affordable Packages</h3>
            <p>Best travel deals with affordable pricing.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>⭐ Trusted Providers</h3>
            <p>Verified travel providers and safe travel planning.</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        style={{
          background: "#2563eb",
          color: "white",
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Start Your Travel Journey Today
        </h2>

        <p style={{ marginBottom: "25px" }}>
          Join thousands of travelers exploring the world with Tripeloo
        </p>

        <button
          style={{
            padding: "12px 25px",
            background: "white",
            color: "#2563eb",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Book Now
        </button>
      </section>

    </div>
  );
}