import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'reviews';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get('itemId');
    const itemType = searchParams.get('itemType');
    const includeHidden = searchParams.get('includeHidden') === 'true';

    const db = await getDb();
    let query: any = {};

    // Filter by itemId and itemType if provided
    if (itemId && itemType) {
      query.itemId = itemId.trim();
      query.itemType = itemType.trim().toLowerCase();
    }

    // Exclude hidden reviews unless explicitly requested
    if (!includeHidden) {
      query.isHidden = { $ne: true };
    }

    const reviews = await db.collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    const mappedReviews = reviews.map((r) => ({
      id: r._id?.toString() || r.id || '',
      itemId: r.itemId || '',
      itemType: r.itemType || '',
      userName: r.userName || 'Anonymous',
      userEmail: r.userEmail || '',
      rating: r.rating || 0,
      review: r.review || '',
      isHidden: r.isHidden || false,
      createdAt: r.createdAt || new Date(),
    }));

    return NextResponse.json({ data: mappedReviews });
  } catch (error) {
    console.error('[api/admin/reviews] GET error', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

