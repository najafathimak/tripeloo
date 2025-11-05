"use client";

import { useEffect, useState } from 'react';

type Coords = { lat: number; lng: number } | null;

export function NearbySection() {
  const [coords, setCoords] = useState<Coords>(null);
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setSupported(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setSupported(false),
      { maximumAge: 60_000 }
    );
  }, []);

  return (
    <section className="mt-12 sm:mt-16">
      <div className="container">
        <h2 className="text-lg sm:text-2xl font-bold">Destinations Near You</h2>
        <p className="mt-1 text-sm text-gray-600">We’ll personalize recommendations based on your location.</p>
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
          {coords ? (
            <div>
              Your location detected: <span className="font-semibold">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>. Nearby listings coming soon.
            </div>
          ) : (
            <div>
              {supported ? 'Detecting your location…' : 'Location not available. Explore popular destinations above.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

