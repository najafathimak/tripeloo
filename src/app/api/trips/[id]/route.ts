import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';

const COLLECTION = 'trips';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;
    
    console.log('[api/trips/[id]] Received tripId:', tripId);
    
    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }
    
    const decodedTripId = decodeURIComponent(tripId);
    console.log('[api/trips/[id]] Decoded tripId:', decodedTripId);
    
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let trip = null;
    
    // Try ObjectId first
    if (ObjectId.isValid(decodedTripId)) {
      try {
        const objectId = new ObjectId(decodedTripId);
        trip = await db.collection(COLLECTION).findOne({ _id: objectId });
        if (trip) {
          console.log('[api/trips/[id]] ✓ Found by ObjectId');
        }
      } catch (err) {
        console.log('[api/trips/[id]] ObjectId query failed:', err);
      }
    }
    
    // Fallback: string comparison
    if (!trip) {
      const allTrips = await db.collection(COLLECTION).find({}).toArray();
      trip = allTrips.find((t: any) => {
        const idStr = t._id?.toString() || t.id || '';
        return idStr === decodedTripId || idStr === tripId;
      });
      if (trip) {
        console.log('[api/trips/[id]] ✓ Found by string comparison');
      }
    }
    
    if (!trip) {
      console.log('[api/trips/[id]] ✗ Trip not found');
      return NextResponse.json({ error: 'Trip not found', tripId: decodedTripId }, { status: 404 });
    }
    
    // Fetch destination info for fallback location
    let destinationName = '';
    if (trip.destinationSlug) {
      const destination = await findDestinationBySlugOrName(trip.destinationSlug);
      destinationName = destination?.name || '';
    }
    
    // Map trip data
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
    };
    
    console.log('[api/trips/[id]] Trip found:', mappedTrip.id);
    return NextResponse.json({ data: mappedTrip });
  } catch (error) {
    console.error('[api/trips/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load trip', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

