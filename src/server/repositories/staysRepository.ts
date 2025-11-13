import { getDb } from '@/server/db/client';
import type { Stay } from '@/components/stay-listings/DestinationData';

const COLLECTION = 'stays';

export async function findStaysByDestination(destinationSlugOrName: string): Promise<Stay[]> {
  const db = await getDb();
  const normalized = destinationSlugOrName.toLowerCase().trim();
  
  // Query with case-insensitive match for destinationSlug
  const rows = await db.collection<any>(COLLECTION)
    .find({
      $or: [
        { destinationSlug: { $regex: new RegExp(`^${normalized}$`, 'i') } },
        { destinationSlug: normalized },
        // Also try matching if destinationSlug contains the normalized value
        { destinationSlug: { $regex: new RegExp(normalized, 'i') } }
      ]
    })
    .toArray();
  
  return rows.map((r) => ({
    id: r._id?.toString() || r.id || '',
    name: r.name || '',
    coverImage: r.coverImage || r.image || '',
    startingPrice: r.startingPrice || r.price || 0,
    highlights: r.highlights || [],
    category: r.category || 'General', // Map category from DB or default
  }));
}

