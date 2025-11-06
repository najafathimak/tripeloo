import Image from 'next/image';
import Link from 'next/link';
import { destinations as fallback } from '@/data/destinations';

type Card = { slug: string; name: string; image: string };

async function fetchFeatured(): Promise<Card[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? '';
    const res = await fetch(`${base}/api/destinations`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed');
    const json = await res.json();
    const rows = (json.data as Array<any>) || [];
    return rows.slice(0, 4).map((d: any) => ({ slug: d.slug, name: d.name, image: d.coverImage }));
  } catch {
    return fallback.slice(0, 4).map((d) => ({ slug: d.slug, name: d.name, image: d.coverImage }));
  }
}

export async function FeaturedDestinations() {
  const destinations = await fetchFeatured();
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

