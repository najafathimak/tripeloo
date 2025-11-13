import { getDb } from '@/server/db/client';
import type { Destination } from '@/types/destination';

const COLLECTION = 'destinations';

export async function findAllDestinations(): Promise<Destination[]> {
  const db = await getDb();
  const rows = await db.collection<Destination>(COLLECTION).find({}).limit(100).toArray();
  return rows.map((r) => ({ ...r, _id: r._id?.toString() }));
}

export async function findDestinationBySlugOrName(slugOrName: string): Promise<Destination | null> {
  const db = await getDb();
  const normalized = slugOrName.toLowerCase().trim();
  
  // Try to find by slug first
  let destination = await db.collection<Destination>(COLLECTION).findOne({
    slug: { $regex: new RegExp(`^${normalized}$`, 'i') }
  });
  
  // If not found, try by name
  if (!destination) {
    destination = await db.collection<Destination>(COLLECTION).findOne({
      name: { $regex: new RegExp(normalized, 'i') }
    });
  }
  
  // If still not found, try by location
  if (!destination) {
    destination = await db.collection<Destination>(COLLECTION).findOne({
      location: { $regex: new RegExp(normalized, 'i') }
    });
  }
  
  return destination ? { ...destination, _id: destination._id?.toString() } : null;
}


