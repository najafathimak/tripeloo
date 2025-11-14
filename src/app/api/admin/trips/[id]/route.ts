import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'trips';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let trip = null;
    
    // Try ObjectId first
    if (ObjectId.isValid(id)) {
      try {
        const objectId = new ObjectId(id);
        trip = await db.collection(COLLECTION).findOne({ _id: objectId });
      } catch (err) {
        console.log('[api/admin/trips/[id]] ObjectId query failed:', err);
      }
    }
    
    // Fallback: string comparison
    if (!trip) {
      const allTrips = await db.collection(COLLECTION).find({}).toArray();
      trip = allTrips.find((t: any) => {
        const tripId = t._id?.toString() || t.id || '';
        return tripId === id;
      });
    }
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    
    // Map trip data - include all fields for editing
    const mappedTrip = {
      ...trip,
      id: trip._id?.toString() || trip.id || '',
    };
    
    return NextResponse.json({ data: mappedTrip });
  } catch (error) {
    console.error('[api/admin/trips/[id]] GET error', error);
    return NextResponse.json(
      { error: 'Failed to load trip' },
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
      summary,
      includes = [],
      excludes = [],
      properties = [],
      packages = [],
      location,
      additionalDetails = [],
    } = body;

    if (!name || !destinationSlug || !category || !coverImage || !startingPrice || !summary) {
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
      const allTrips = await db.collection(COLLECTION).find({}).toArray();
      const trip = allTrips.find((t: any) => {
        const tripId = t._id?.toString() || t.id || '';
        return tripId === id;
      });
      if (!trip) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      query._id = trip._id;
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
          summary: summary.trim(),
          includes: Array.isArray(includes) ? includes.filter((i: string) => i.trim()) : [],
          excludes: Array.isArray(excludes) ? excludes.filter((e: string) => e.trim()) : [],
          properties: Array.isArray(properties) ? properties.filter((p: string) => p.trim()) : [],
          packages: Array.isArray(packages) ? packages.map((pkg: any) => ({
            id: pkg.id || Date.now().toString(),
            name: pkg.name?.trim() || '',
            duration: pkg.duration?.trim() || '',
            price: Number(pkg.price) || 0,
            thumb: pkg.thumb?.trim() || '',
            images: Array.isArray(pkg.images) ? pkg.images.filter((img: string) => img && img.trim()) : [],
            highlights: Array.isArray(pkg.highlights) ? pkg.highlights.filter((h: string) => h && h.trim()) : [],
          })) : [],
          location: location?.trim() || '',
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
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Trip updated successfully',
    });
  } catch (error) {
    console.error('[api/admin/trips/[id]] PUT error', error);
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    );
  }
}

