"use client";

export default function LocationSection() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Location
      </h2>

      <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
        {/* Map Embed */}
        <iframe
          title="Resort Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.918154788175!2d75.78040267571218!3d10.998432955779308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ee3a93e4efc3%3A0x4b2f33a780a35f50!2sKozhikode%2C%20Kerala!5e0!3m2!1sen!2sin!4v1709477898104!5m2!1sen!2sin"
          width="100%"
          height="350"
          allowFullScreen={true}
          loading="lazy"
          className="border-0 w-full"
        ></iframe>

        {/* Info Below Map */}
        <div className="p-4 text-gray-700 bg-gray-50">
          <h3 className="text-lg font-semibold text-sky-700 mb-1">
            Ocean Breeze Resort
          </h3>
          <p className="text-sm">
            Beachside Road, Kozhikode, Kerala 673001, India
          </p>
          <p className="text-sm mt-2">
            +91 98765 43210 &nbsp;&nbsp; ✉️ contact@oceanbreezeresort.com
          </p>
        </div>
      </div>
    </div>
  );
}
