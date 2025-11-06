import { getDb } from '@/server/db/client';
import type { Destination } from '@/types/destination';

const COLLECTION = 'destinations';

export async function findAllDestinations(): Promise<Destination[]> {
  const db = await getDb();
  const rows = await db.collection<Destination>(COLLECTION).find({}).limit(100).toArray();
  return rows.map((r) => ({ ...r, _id: r._id?.toString() }));
}


