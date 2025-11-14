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

export async function findStayById(stayId: string): Promise<any | null> {
  const db = await getDb();
  
  try {
    const ObjectId = require('mongodb').ObjectId;
    
    console.log('[findStayById] Searching for stay with ID:', stayId);
    console.log('[findStayById] ID type:', typeof stayId);
    console.log('[findStayById] ID length:', stayId?.length);
    
    // Clean the ID - remove any whitespace
    const cleanStayId = stayId?.trim();
    
    // Try multiple query strategies
    let stay = null;
    
    // Strategy 1: Try as ObjectId if valid (most common case)
    if (cleanStayId && ObjectId.isValid(cleanStayId)) {
      try {
        const objectId = new ObjectId(cleanStayId);
        stay = await db.collection(COLLECTION).findOne({ _id: objectId });
        if (stay) {
          console.log('[findStayById] ✓ Found by ObjectId');
          return mapStayData(stay);
        }
      } catch (err) {
        console.log('[findStayById] ObjectId query failed:', err);
      }
    } else {
      console.log('[findStayById] ID is not a valid ObjectId format');
    }
    
    // Strategy 2: Try finding by converting all _id to string and comparing
    // This handles the case where ID is passed as string from frontend
    if (!stay) {
      console.log('[findStayById] Trying string comparison method...');
      const allStays = await db.collection(COLLECTION).find({}).toArray();
      console.log('[findStayById] Total stays in DB:', allStays.length);
      
      stay = allStays.find((s: any) => {
        const idStr = s._id?.toString() || s.id || '';
        const match = idStr === cleanStayId || idStr === stayId;
        if (match) {
          console.log('[findStayById] ✓ Match found! DB _id:', s._id, 'as string:', idStr, 'matches:', cleanStayId);
        }
        return match;
      });
      
      if (stay) {
        console.log('[findStayById] ✓ Found by string comparison');
        return mapStayData(stay);
      }
    }
    
    // Strategy 3: Try finding by id field (if stored separately)
    if (!stay) {
      stay = await db.collection(COLLECTION).findOne({ id: cleanStayId });
      if (stay) {
        console.log('[findStayById] ✓ Found by id field');
        return mapStayData(stay);
      }
    }
    
    console.log('[findStayById] ✗ Stay not found after all strategies');
    console.log('[findStayById] Searched ID:', cleanStayId);
    return null;
  } catch (error) {
    console.error('[findStayById] Error:', error);
    return null;
  }
}

function mapStayData(stay: any): any {
  return {
    id: stay._id?.toString() || stay.id || '',
    name: stay.name || '',
    destinationSlug: stay.destinationSlug || '',
    category: stay.category || '',
    coverImage: stay.coverImage || '',
    carouselImages: stay.carouselImages || [],
    startingPrice: stay.startingPrice || 0,
    originalPrice: stay.originalPrice || null,
    currency: stay.currency || 'INR',
    summary: stay.summary || '',
    includes: stay.includes || [],
    excludes: stay.excludes || [],
    properties: stay.properties || [],
    rooms: stay.rooms || [],
    location: stay.location || '',
    additionalDetails: stay.additionalDetails || [],
  };
}
    

