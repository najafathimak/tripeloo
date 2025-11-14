import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'stays';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const searchParams = request.nextUrl.searchParams;
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    const query: any = {};
    if (!includeHidden) {
      query.isHidden = { $ne: true };
    }
    
    const stays = await db.collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    const mapped = stays.map((stay: any) => ({
      id: stay._id?.toString() || stay.id || '',
      name: stay.name || '',
      destinationSlug: stay.destinationSlug || '',
      category: stay.category || '',
      coverImage: stay.coverImage || '',
      startingPrice: stay.startingPrice || 0,
      originalPrice: stay.originalPrice || null,
      currency: stay.currency || 'INR',
      summary: stay.summary || '',
      isHidden: stay.isHidden || false,
      createdAt: stay.createdAt || null,
      updatedAt: stay.updatedAt || null,
    }));
    
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error('[api/admin/stays] error', error);
    return NextResponse.json(
      { error: 'Failed to load stays' },
      { status: 500 }
    );
  }
}

