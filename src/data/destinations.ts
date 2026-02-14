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
    id: 'wayanad',
    name: 'Wayanad',
    slug: 'wayanad',
    location: 'Wayanad, Kerala',
    coverImage: 'https://images.unsplash.com/photo-1501117716987-c8e71d1cd834?q=80&w=1600&auto=format&fit=crop',
    startingPrice: 2499,
    currency: 'INR',
    summary: 'Lush hills, wildlife sanctuaries, and scenic plantations.',
    tags: ['hills', 'nature', 'stays']
  },
  {
    id: 'munnar',
    name: 'Munnar',
    slug: 'munnar',
    location: 'Munnar, Kerala',
    coverImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    startingPrice: 1999,
    currency: 'INR',
    summary: 'Tea estates, misty valleys, and mountain retreats.',
    tags: ['tea', 'mountains', 'stays']
  },
  {
    id: 'coorg',
    name: 'Coorg',
    slug: 'coorg',
    location: 'Coorg, Karnataka',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
    startingPrice: 2199,
    currency: 'INR',
    summary: 'Coffee plantations, waterfalls, and peaceful homestays.',
    tags: ['coffee', 'plantations', 'stays']
  }
];


