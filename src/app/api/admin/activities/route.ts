import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'activities';

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const searchParams = request.nextUrl.searchParams;
    const includeHidden = searchParams.get('includeHidden') === 'true';
    
    const query: any = {};
    if (!includeHidden) {
      query.isHidden = { $ne: true };
    }
    
    const activities = await db.collection(COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    const mapped = activities.map((activity: any) => ({
      id: activity._id?.toString() || activity.id || '',
      name: activity.name || '',
      propertyName: activity.propertyName || '',
      destinationSlug: activity.destinationSlug || '',
      category: activity.category || '',
      coverImage: activity.coverImage || '',
      startingPrice: activity.startingPrice || 0,
      originalPrice: activity.originalPrice || null,
      currency: activity.currency || 'INR',
      about: activity.about || '',
      location: activity.location || '',
      contactNumber: activity.contactNumber || '',
      address: activity.address || '',
      includes: activity.includes || [],
      excludes: activity.excludes || [],
      isHidden: activity.isHidden || false,
      createdAt: activity.createdAt || null,
      updatedAt: activity.updatedAt || null,
    }));
    
    return NextResponse.json({ data: mapped });
  } catch (error) {
    console.error('[api/admin/activities] error', error);
    return NextResponse.json(
      { error: 'Failed to load activities' },
      { status: 500 }
    );
  }
}

