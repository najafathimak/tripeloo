import Image from 'next/image';

type Card = {
  title: string;
  subtitle?: string;
  price?: string;
  image: string;
  cta: string;
};

const stays: Card[] = [
  { title: 'Luxury Resort, Wayanad', subtitle: 'Resort • Hill View', price: '₹8,000 / night', image: 'https://images.unsplash.com/photo-1501117716987-c8e71d1cd834?q=80&w=1200&auto=format&fit=crop', cta: 'View Details' },
  { title: 'Beachfront Villa, Goa', subtitle: 'Villa • Sea View', price: '₹15,000 / night', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop', cta: 'View Details' },
  { title: 'Tea Estate Bungalow, Munnar', subtitle: 'Bungalow • Plantation', price: '₹7,200 / night', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop', cta: 'View Details' },
];

const activities: Card[] = [
  { title: 'Ziplining Adventure, Munnar', subtitle: '2 hours', price: '₹1,500 / person', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop', cta: 'Book Now' },
  { title: 'Backwater Kayaking, Alleppey', subtitle: 'Half Day', price: '₹1,200 / person', image: 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1200&auto=format&fit=crop', cta: 'Book Now' },
  { title: 'Desert Safari, Jaisalmer', subtitle: 'Evening', price: '₹2,000 / person', image: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca9?q=80&w=1200&auto=format&fit=crop', cta: 'Book Now' },
];

export function TripsStaysGrid() {
  return (
    <section className="py-10 sm:py-12">
      <div className="container">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Food spots & Stays</h2>
          <a href="#trips" className="text-brand text-sm font-semibold hover:underline">Explore all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...stays, ...activities].map((card, idx) => (
            <article key={idx} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
              <div className="relative h-44 sm:h-48">
                <Image src={card.image} alt={card.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                {card.subtitle && <p className="text-sm text-gray-600 mt-1">{card.subtitle}</p>}
                {card.price && <p className="text-sm font-semibold text-brand mt-2">{card.price}</p>}
                <button className="btn-ghost mt-4 w-full">{card.cta}</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


