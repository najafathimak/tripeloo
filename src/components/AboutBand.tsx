export function AboutBand() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="container py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm sm:text-base text-gray-700 max-w-3xl">
            Tripeloo helps you discover handpicked stays, curated activities, and seamless trips across India. 
            Chat with our experts on WhatsApp or call us to plan your next getaway.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/0000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              WhatsApp Us
            </a>
            <a href="tel:+910000000000" className="btn-ghost">Call Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}


