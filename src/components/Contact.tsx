"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-8 justify-center items-center">
        {/* Email */}
        <div className="bg-sky-50 shadow-md rounded-xl p-8 flex items-start gap-4 w-full md:w-1/3 hover:shadow-lg transition">
          <Mail className="text-sky-500 w-8 h-8 mt-1" />
          <div className="text-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Email Us
            </h3>
            <p className="text-gray-600 text-lg">info@supportcompany.com</p>
            <p className="text-gray-600 text-lg ">info@example.com</p>
          </div>
        </div>

        {/* Call */}
        <div className="bg-sky-50 shadow-md rounded-xl p-8 flex items-start gap-4 w-full md:w-1/3 hover:shadow-lg transition">
          <Phone className="text-green-500 w-8 h-8 mt-1" />
          <div className="text-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Call Us
            </h3>
            <p className="text-gray-600 text-lg">+7704345017</p>
            <p className="text-gray-600 text-lg">+866-398-5917</p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-sky-50 shadow-md rounded-xl p-8 flex items-start gap-4 w-full md:w-1/3 hover:shadow-lg transition">
          <MapPin className="text-pink-500 w-8 h-8 mt-1" />
          <div className="text-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Visit Us
            </h3>
            <p className="text-gray-600 text-lg">
              4517 Washington Ave. Manchester,
              <br />
              Kentucky 39495
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
