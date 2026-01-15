import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';

const COLLECTION = 'trips';

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;
    
    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }
    
    const decodedTripId = decodeURIComponent(tripId);
    
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let trip = null;
    
    if (ObjectId.isValid(decodedTripId)) {
      try {
        const objectId = new ObjectId(decodedTripId);
        trip = await db.collection(COLLECTION).findOne({ _id: objectId });
      } catch (err) {
        // ObjectId query failed, try next strategy
      }
    }
    
    if (!trip) {
      const allTrips = await db.collection(COLLECTION).find({}).toArray();
      trip = allTrips.find((t: any) => {
        const idStr = t._id?.toString() || t.id || '';
        return idStr === decodedTripId || idStr === tripId;
      });
    }
    
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found', tripId: decodedTripId }, { status: 404 });
    }
    
    let destinationName = '';
    if (trip.destinationSlug) {
      const destination = await findDestinationBySlugOrName(trip.destinationSlug);
      destinationName = destination?.name || '';
    }
    
    const mappedTrip = {
      id: trip._id?.toString() || trip.id || '',
      name: trip.name || '',
      destinationSlug: trip.destinationSlug || '',
      destinationName: destinationName,
      category: trip.category || '',
      coverImage: trip.coverImage || '',
      carouselImages: trip.carouselImages || [],
      startingPrice: trip.startingPrice || 0,
      originalPrice: trip.originalPrice || null,
      currency: trip.currency || 'INR',
      summary: trip.summary || '',
      includes: trip.includes || [],
      excludes: trip.excludes || [],
      properties: trip.properties || [],
      packages: trip.packages || [],
      location: trip.location || '',
      additionalDetails: trip.additionalDetails || [],
      nearbyStays: Array.isArray(trip.nearbyStays)
        ? trip.nearbyStays.map((id: any) => id?.toString?.() || String(id))
        : [],
      nearbyActivities: Array.isArray(trip.nearbyActivities)
        ? trip.nearbyActivities.map((id: any) => id?.toString?.() || String(id))
        : [],
      importantInfo: trip.importantInfo || '',
    };
    
    return NextResponse.json({ data: mappedTrip }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[api/trips/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load trip', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

