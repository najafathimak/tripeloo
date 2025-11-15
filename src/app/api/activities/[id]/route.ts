import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';

const COLLECTION = 'activities';

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }
    
    const decodedActivityId = decodeURIComponent(activityId);
    
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let activity = null;
    
    if (ObjectId.isValid(decodedActivityId)) {
      try {
        const objectId = new ObjectId(decodedActivityId);
        activity = await db.collection(COLLECTION).findOne({ _id: objectId });
      } catch (err) {
        // ObjectId query failed, try next strategy
      }
    }
    
    if (!activity) {
      const allActivities = await db.collection(COLLECTION).find({}).toArray();
      activity = allActivities.find((a: any) => {
        const idStr = a._id?.toString() || a.id || '';
        return idStr === decodedActivityId || idStr === activityId;
      });
    }
    
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found', activityId: decodedActivityId }, { status: 404 });
    }
    
    // Get destination name if destinationSlug exists
    let destinationName = '';
    if (activity.destinationSlug) {
      const destination = await findDestinationBySlugOrName(activity.destinationSlug);
      destinationName = destination?.name || '';
    }
    
    const mappedActivity = {
      id: activity._id?.toString() || activity.id || '',
      name: activity.name || '',
      destinationSlug: activity.destinationSlug || '',
      destinationName: destinationName,
      category: activity.category || '',
      coverImage: activity.coverImage || '',
      carouselImages: activity.carouselImages || [],
      startingPrice: activity.startingPrice || 0,
      originalPrice: activity.originalPrice || null,
      currency: activity.currency || 'INR',
      about: activity.about || '',
      includes: activity.includes || [],
      excludes: activity.excludes || [],
      location: activity.location || '',
      activityDetails: activity.activityDetails || {},
      additionalDetails: activity.additionalDetails || [],
    };
    
    return NextResponse.json({ data: mappedActivity }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[api/activities/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

