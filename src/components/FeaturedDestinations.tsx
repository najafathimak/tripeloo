import Image from 'next/image';
import Link from 'next/link';

const destinations = [
  {
    slug: 'wayanad',
    name: 'Wayanad',
    image: 'https://images.unsplash.com/photo-1563738066387-c2abdbbd3061?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'munnar',
    name: 'Munnar',
    image: 'https://images.unsplash.com/photo-1530032099965-1993a4b9ad1a?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'coorg',
    name: 'Coorg',
    image: 'https://images.unsplash.com/photo-1617814074383-6b6564a5bc2a?q=80&w=1200&auto=format&fit=crop'
  },
  {
    slug: 'alleppey',
    name: 'Alleppey',
    image: 'https://images.unsplash.com/photo-1563293941-669ce8d2dc83?q=80&w=1200&auto=format&fit=crop'
  }
];

export function FeaturedDestinations() {
  return (
    <section className="mt-16 sm:mt-24">
      <div className="container">
        <div className="flex items-end justify-between">
          <h2 className="text-lg sm:text-2xl font-bold">Featured Destinations</h2>
          <Link href="/destinations" className="text-brand text-sm">View all</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {destinations.map((d) => (
            <Link key={d.slug} href={`/destinations/${d.slug}`} className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="relative h-28 sm:h-40">
                <Image src={d.image} alt={d.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-3 sm:p-4">
                <div className="font-semibold">{d.name}</div>
                <div className="text-xs text-gray-500">Explore stays & activities</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

