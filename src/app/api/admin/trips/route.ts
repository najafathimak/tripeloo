import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'trips';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const searchParams = request.nextUrl.searchParams;
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    const query: any = {};
    if (!includeHidden) {
      query.isHidden = { $ne: true };
    }
    
    const trips = await db.collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    const mapped = trips.map((trip: any) => ({
      id: trip._id?.toString() || trip.id || '',
      name: trip.name || '',
      destinationSlug: trip.destinationSlug || '',
      category: trip.category || '',
      coverImage: trip.coverImage || '',
      startingPrice: trip.startingPrice || 0,
      originalPrice: trip.originalPrice || null,
      currency: trip.currency || 'INR',
      summary: trip.summary || '',
      isHidden: trip.isHidden || false,
      createdAt: trip.createdAt || null,
      updatedAt: trip.updatedAt || null,
    }));
    
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error('[api/admin/trips] error', error);
    return NextResponse.json(
      { error: 'Failed to load trips' },
      { status: 500 }
    );
  }
}

