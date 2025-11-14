export interface PointTransaction {
  type: 'earned' | 'claimed' | 'adjusted';
  points: number; // Positive for earned, negative for claimed
  note: string;
  claimedBy?: string; // Admin email or 'admin'
  createdAt: Date;
}

export interface User {
  _id?: string;
  email: string;
  name: string;
  image?: string; // Profile picture URL
  loyaltyPoints: number;
  pointHistory?: PointTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

