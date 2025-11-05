import Image from 'next/image';

const posts = [
  {
    title: 'Top 7 Monsoon Getaways in Kerala',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'A First-Timer’s Guide to Goa',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Hidden Hill Stations You Must Visit',
    image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop',
  },
];

export function BlogTeasers() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="container">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">From the Blog</h2>
          <a href="#" className="text-brand text-sm font-semibold hover:underline">Read all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <article key={i} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
              <div className="relative h-40">
                <Image src={p.image} alt={p.title} fill className="object-cover transition-transform group-hover:scale-[1.02]" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{p.title}</h3>
                <button className="btn-ghost mt-3 w-full">Read</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


