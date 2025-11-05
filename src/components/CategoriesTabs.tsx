"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sampleCards = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: `Cozy Stay ${i + 1}`,
  image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
  price: 3499
}));

export function CategoriesTabs() {
  const [tab, setTab] = useState<'stays' | 'activities' | 'trips'>('stays');

  // React to hash changes so hero clicks can switch tab
  useEffect(() => {
    const setFromHash = () => {
      const h = (window.location.hash || '').replace('#', '');
      if (h === 'stays') setTab('stays');
      if (h === 'things-to-do') setTab('activities');
      if (h === 'trips') setTab('trips');
    };
    setFromHash();
    window.addEventListener('hashchange', setFromHash);
    return () => window.removeEventListener('hashchange', setFromHash);
  }, []);

  return (
    <section id="explore" className="mt-12 sm:mt-16">
      <div className="container">
        <div className="flex items-center gap-2">
          {([
            { key: 'stays', label: 'Stays' },
            { key: 'activities', label: 'Things to Do' },
            { key: 'trips', label: 'Trips' }
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === key ? 'bg-brand text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-3 sm:gap-4 min-w-max">
            {sampleCards.map((c) => (
              <Link key={c.id} href={`/${tab}/${c.id}`} className="group w-56 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="relative h-32">
                  <Image src={c.image} alt={c.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <div className="font-semibold truncate">{c.title}</div>
                  <div className="mt-1 text-sm text-gray-600">₹ {c.price.toLocaleString()} / night</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

