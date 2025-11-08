export type Stay = {
  id: string;
  name: string;
  coverImage: string;
  startingPrice: number;
  highlights: string[];
};

export type Activity = {
  id: string;
  name: string;
  coverImage: string;
  duration: string;
  price: number;
};

export type Trip = {
  id: string;
  name: string;
  coverImage: string;
  duration: string;
  price: number;
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
    },
    {
      id: "wildlife",
      name: "Wildlife Safari",
      coverImage:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
      duration: "4 hours",
      price: 2000,
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
    },
    {
      id: "heritage",
      name: "Heritage Tour",
      coverImage:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop",
      duration: "3 days",
      price: 8000,
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
    },
  ],
};
