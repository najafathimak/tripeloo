import { getDb } from '@/server/db/client';
import type { Destination } from '@/types/destination';

const COLLECTION = 'destinations';

export async function findAllDestinations(): Promise<Destination[]> {
  const db = await getDb();
  const rows = await db.collection<Destination>(COLLECTION)
    .find({ isHidden: { $ne: true } })
    .limit(100)
    .toArray();
  return rows.map((r) => ({ ...r, _id: r._id?.toString() }));
}

export async function findDestinationBySlugOrName(slugOrName: string): Promise<Destination | null> {
  const db = await getDb();
  const normalized = slugOrName.toLowerCase().trim();
  
  // Try to find by slug first (exclude hidden)
  let destination = await db.collection<Destination>(COLLECTION).findOne({
    $and: [
      { slug: { $regex: new RegExp(`^${normalized}$`, 'i') } },
      { isHidden: { $ne: true } }
    ]
  });
  
  // If not found, try by name (exclude hidden)
  if (!destination) {
    destination = await db.collection<Destination>(COLLECTION).findOne({
      $and: [
        { name: { $regex: new RegExp(normalized, 'i') } },
        { isHidden: { $ne: true } }
      ]
    });
  }
  
  // If still not found, try by location (exclude hidden)
  if (!destination) {
    destination = await db.collection<Destination>(COLLECTION).findOne({
      $and: [
        { location: { $regex: new RegExp(normalized, 'i') } },
        { isHidden: { $ne: true } }
      ]
    });
  }
  
  return destination ? { ...destination, _id: destination._id?.toString() } : null;
}


