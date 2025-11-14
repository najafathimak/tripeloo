import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'destinations';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const searchParams = request.nextUrl.searchParams;
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    const query: any = {};
    if (!includeHidden) {
      query.isHidden = { $ne: true };
    }
    
    const destinations = await db.collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    const mapped = destinations.map((dest: any) => ({
      id: dest._id?.toString() || dest.id || '',
      name: dest.name || '',
      slug: dest.slug || '',
      location: dest.location || '',
      coverImage: dest.coverImage || '',
      startingPrice: dest.startingPrice || 0,
      currency: dest.currency || 'INR',
      summary: dest.summary || '',
      tags: dest.tags || [],
      isHidden: dest.isHidden || false,
      createdAt: dest.createdAt || null,
      updatedAt: dest.updatedAt || null,
    }));
    
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error('[api/admin/destinations] error', error);
    return NextResponse.json(
      { error: 'Failed to load destinations' },
      { status: 500 }
    );
  }
}

