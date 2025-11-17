import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'activities';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let activity = null;
    
    if (ObjectId.isValid(id)) {
      try {
        const objectId = new ObjectId(id);
        activity = await db.collection(COLLECTION).findOne({ _id: objectId });
      } catch (err) {
        // Try next strategy
      }
    }
    
    if (!activity) {
      const allActivities = await db.collection(COLLECTION).find({}).toArray();
      activity = allActivities.find((a: any) => {
        const activityId = a._id?.toString() || a.id || '';
        return activityId === id;
      });
    }
    
    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }
    
    const mappedActivity = {
      ...activity,
      id: activity._id?.toString() || activity.id || '',
    };
    
    return NextResponse.json({ data: mappedActivity });
  } catch (error) {
    console.error('[api/admin/activities/[id]] GET error', error);
    return NextResponse.json(
      { error: 'Failed to load activity' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const {
      name,
      propertyName,
      destinationSlug,
      category,
      coverImage,
      carouselImages = [],
      startingPrice,
      originalPrice,
      currency,
      about,
      includes = [],
      excludes = [],
      location,
      contactNumber,
      address,
      activityDetails = {},
      additionalDetails = [],
    } = body;

    if (!name || !destinationSlug || !category || !coverImage || !startingPrice || !about) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let query: any = {};
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      const allActivities = await db.collection(COLLECTION).find({}).toArray();
      const activity = allActivities.find((a: any) => {
        const activityId = a._id?.toString() || a.id || '';
        return activityId === id;
      });
      if (!activity) {
        return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
      }
      query._id = activity._id;
    }

    const result = await db.collection(COLLECTION).updateOne(
      query,
      {
        $set: {
          name: name.trim(),
          propertyName: propertyName?.trim() || '',
          destinationSlug: destinationSlug.trim(),
          category: category.trim(),
          coverImage: coverImage.trim(),
          carouselImages: Array.isArray(carouselImages) ? carouselImages : [],
          startingPrice: Number(startingPrice),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          currency: currency || 'INR',
          about: about.trim(),
          includes: Array.isArray(includes) ? includes.filter((i: string) => i.trim()) : [],
          excludes: Array.isArray(excludes) ? excludes.filter((e: string) => e.trim()) : [],
          location: location?.trim() || '',
          contactNumber: contactNumber?.trim() || '',
          address: address?.trim() || '',
          activityDetails: {
            ages: activityDetails.ages?.trim() || '',
            duration: activityDetails.duration?.trim() || '',
            startTime: activityDetails.startTime?.trim() || '',
            mobileTicket: activityDetails.mobileTicket || false,
            animalWelfare: activityDetails.animalWelfare || false,
            liveGuide: activityDetails.liveGuide?.trim() || '',
            maxGroupSize: activityDetails.maxGroupSize?.trim() || '',
          },
          additionalDetails: additionalDetails.map((detail: any) => ({
            heading: detail.heading?.trim() || '',
            type: detail.type || 'description',
            description: detail.type === 'description' ? (detail.description?.trim() || '') : undefined,
            points: detail.type === 'points' ? (detail.points?.filter((p: string) => p.trim()) || []) : undefined,
          })),
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Activity updated successfully',
    });
  } catch (error) {
    console.error('[api/admin/activities/[id]] PUT error', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

