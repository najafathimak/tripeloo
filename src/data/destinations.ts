export type Destination = {
  id: string;
  name: string;
  slug: string;
  location: string;
  coverImage: string;
  startingPrice: number;
  currency: string;
  summary: string;
  tags: string[];
};

export const destinations: Destination[] = [
  {
    id: 'goa-beach-retreat',
    name: 'Goa Beach Retreat',
    slug: 'goa-beach-retreat',
    location: 'Goa, India',
    coverImage: 'https://images.unsplash.com/photo-1546484959-f9a53db89f9e?q=80&w=1600&auto=format&fit=crop',
    startingPrice: 2499,
    currency: 'INR',
    summary: 'Beachside stays with curated activities and nightlife hops.',
    tags: ['beach', 'nightlife', 'stays']
  },
  {
    id: 'manali-mountain-escape',
    name: 'Manali Mountain Escape',
    slug: 'manali-mountain-escape',
    location: 'Manali, Himachal',
    coverImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530d?q=80&w=1600&auto=format&fit=crop',
    startingPrice: 1999,
    currency: 'INR',
    summary: 'Snow peaks, pine trails, and cosy cabins.',
    tags: ['mountain', 'hiking', 'cabins']
  },
  {
    id: 'jaipur-heritage-walks',
    name: 'Jaipur Heritage Walks',
    slug: 'jaipur-heritage-walks',
    location: 'Jaipur, Rajasthan',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop',
    startingPrice: 1499,
    currency: 'INR',
    summary: 'Palaces, pink hues, and royal street food tours.',
    tags: ['heritage', 'culture', 'food']
  }
];


