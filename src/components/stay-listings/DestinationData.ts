export type Stay = {
  id: string;
  name: string;
  coverImage: string;
  startingPrice: number;
  highlights: string[];
  category: string;
};

export type Activity = {
  id: string;
  name: string;
  coverImage: string;
  duration: string;
  price: number;
  startingPrice?: number; // Optional field for database compatibility
  category: string;
};

export type Trip = {
  id: string;
  name: string;
  coverImage: string;
  duration: string;
  price: number;
  category: string;
};

export const stayData: Record<string, Stay[]> = {
  wayanad: [
    {
      id: "mountain",
      name: "Wayanad Jungle Resort",
      coverImage:
        "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 3499,
      highlights: ["Private cottages", "Infinity pool", "Forest view"],
      category: "Resort",
    },
    {
      id: "mountain2",
      name: "Eco-Friendly Treehouse",
      coverImage:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 2999,
      highlights: ["Treehouse stay", "Eco-friendly", "Nature view"],
      category: "Eco Stay",
    },
    {
      id: "mountain3",
      name: "Luxury Mountain Villa",
      coverImage:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 5999,
      highlights: ["Luxury villa", "Private pool", "Mountain view"],
      category: "Luxury",
    },
  ],
  goa: [
    {
      id: "beachside",
      name: "Goa Beachside Retreat",
      coverImage:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 4499,
      highlights: ["Beachfront rooms", "Pool bar", "Live music evenings"],
      category: "Beach Resort",
    },
    {
      id: "beachside2",
      name: "Budget Beach Hostel",
      coverImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 999,
      highlights: ["Budget-friendly", "Beach access", "Social atmosphere"],
      category: "Budget",
    },
    {
      id: "beachside3",
      name: "5-Star Beachfront Hotel",
      coverImage:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop",
      startingPrice: 8999,
      highlights: ["5-star luxury", "Spa", "Fine dining"],
      category: "Luxury",
    },
  ],
};

export const activitiesData: Record<string, Activity[]> = {
  wayanad: [
    {
      id: "trekking",
      name: "Chembra Peak Trek",
      coverImage:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop",
      duration: "6 hours",
      price: 1500,
      category: "Adventure",
    },
    {
      id: "wildlife",
      name: "Wildlife Safari",
      coverImage:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
      duration: "4 hours",
      price: 2000,
      category: "Wildlife",
    },
    {
      id: "waterfalls",
      name: "Waterfall Tour",
      coverImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
      duration: "5 hours",
      price: 1200,
      category: "Nature",
    },
  ],
  goa: [
    {
      id: "watersports",
      name: "Water Sports Package",
      coverImage:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=1600&auto=format&fit=crop",
      duration: "3 hours",
      price: 2500,
      category: "Adventure",
    },
    {
      id: "nightlife",
      name: "Nightlife Tour",
      coverImage:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      duration: "4 hours",
      price: 1800,
      category: "Entertainment",
    },
    {
      id: "heritage",
      name: "Heritage Walk",
      coverImage:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop",
      duration: "3 hours",
      price: 800,
      category: "Cultural",
    },
  ],
};

export const tripsData: Record<string, Trip[]> = {
  wayanad: [
    {
      id: "camping",
      name: "Forest Camping Experience",
      coverImage:
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1600&auto=format&fit=crop",
      duration: "2 days",
      price: 5000,
      category: "Adventure",
    },
    {
      id: "heritage",
      name: "Heritage Tour",
      coverImage:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop",
      duration: "3 days",
      price: 8000,
      category: "Cultural",
    },
    {
      id: "nature",
      name: "Nature & Wildlife Package",
      coverImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
      duration: "2 days",
      price: 4500,
      category: "Nature",
    },
  ],
  goa: [
    {
      id: "island",
      name: "Island Hopping Tour",
      coverImage:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1600&auto=format&fit=crop",
      duration: "1 day",
      price: 3500,
      category: "Adventure",
    },
    {
      id: "beach",
      name: "Beach Paradise Package",
      coverImage:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
      duration: "2 days",
      price: 6000,
      category: "Relaxation",
    },
    {
      id: "party",
      name: "Party & Nightlife Tour",
      coverImage:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      duration: "2 days",
      price: 5500,
      category: "Entertainment",
    },
  ],
};
