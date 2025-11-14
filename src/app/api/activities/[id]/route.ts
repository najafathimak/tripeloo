import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'activities';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    
    console.log('[api/activities/[id]] Received activityId:', activityId);
    
    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }
    
    const decodedActivityId = decodeURIComponent(activityId);
    console.log('[api/activities/[id]] Decoded activityId:', decodedActivityId);
    
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let activity = null;
    
    // Try ObjectId first
    if (ObjectId.isValid(decodedActivityId)) {
      try {
        const objectId = new ObjectId(decodedActivityId);
        activity = await db.collection(COLLECTION).findOne({ _id: objectId });
        if (activity) {
          console.log('[api/activities/[id]] ✓ Found by ObjectId');
        }
      } catch (err) {
        console.log('[api/activities/[id]] ObjectId query failed:', err);
      }
    }
    
    // Fallback: string comparison
    if (!activity) {
      const allActivities = await db.collection(COLLECTION).find({}).toArray();
      activity = allActivities.find((a: any) => {
        const idStr = a._id?.toString() || a.id || '';
        return idStr === decodedActivityId || idStr === activityId;
      });
      if (activity) {
        console.log('[api/activities/[id]] ✓ Found by string comparison');
      }
    }
    
    if (!activity) {
      console.log('[api/activities/[id]] ✗ Activity not found');
      return NextResponse.json({ error: 'Activity not found', activityId: decodedActivityId }, { status: 404 });
    }
    
    // Map activity data
    const mappedActivity = {
      id: activity._id?.toString() || activity.id || '',
      name: activity.name || '',
      destinationSlug: activity.destinationSlug || '',
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
    
    console.log('[api/activities/[id]] Activity found:', mappedActivity.id);
    return NextResponse.json({ data: mappedActivity });
  } catch (error) {
    console.error('[api/activities/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

