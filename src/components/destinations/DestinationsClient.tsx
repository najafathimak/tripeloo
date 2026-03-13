"use client";

import { motion } from "framer-motion";

type Destination = {
  id?: string;
  name: string;
  image: string;
  description?: string;
};

export default function DestinationsClient({
  destinations,
}: {
  destinations: Destination[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {destinations.map((d, index) => (
        <motion.article
          key={d.id ?? index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
        >
          
          {/* Image */}
          <img
            src={d.image}
            alt={d.name}
            className="w-full h-48 object-cover"
          />

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold">{d.name}</h3>
            {d.description && (
              <p className="text-gray-600 text-sm mt-2">
                {d.description}
              </p>
            )}
          </div>

        </motion.article>
      ))}

    </div>
  );
}