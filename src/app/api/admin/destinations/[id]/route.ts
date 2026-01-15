import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'destinations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let destination = null;
    
    if (ObjectId.isValid(id)) {
      try {
        const objectId = new ObjectId(id);
        destination = await db.collection(COLLECTION).findOne({ _id: objectId });
      } catch (err) {
        // Try next strategy
      }
    }
    
    if (!destination) {
      const allDestinations = await db.collection(COLLECTION).find({}).toArray();
      destination = allDestinations.find((d: any) => {
        const destId = d._id?.toString() || d.id || '';
        return destId === id;
      });
    }
    
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    
    const mappedDestination = {
      ...destination,
      id: destination._id?.toString() || destination.id || '',
    };
    
    return NextResponse.json({ data: mappedDestination });
  } catch (error) {
    console.error('[api/admin/destinations/[id]] GET error', error);
    return NextResponse.json(
      { error: 'Failed to load destination' },
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
      slug,
      location,
      coverImage,
      startingPrice,
      currency,
      summary,
      tags = [],
      carouselImages = [],
      overviewHeading,
      overviewDescription,
    } = body;

    if (!name || !slug || !location || !coverImage || !startingPrice || !summary) {
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
      const allDestinations = await db.collection(COLLECTION).find({}).toArray();
      const destination = allDestinations.find((d: any) => {
        const destId = d._id?.toString() || d.id || '';
        return destId === id;
      });
      if (!destination) {
        return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
      }
      query._id = destination._id;
    }

    const result = await db.collection(COLLECTION).updateOne(
      query,
      {
        $set: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          location: location.trim(),
          coverImage: coverImage.trim(),
          startingPrice: Number(startingPrice),
          currency: currency?.trim().toUpperCase() || 'INR',
          summary: summary.trim(),
          tags: Array.isArray(tags) ? tags.filter((tag: string) => tag.trim().length > 0).map((tag: string) => tag.trim()) : [],
          carouselImages: Array.isArray(carouselImages) ? carouselImages.filter((img: string) => img && img.trim().length > 0).map((img: string) => img.trim()) : [],
          overviewHeading: overviewHeading?.trim() || '',
          overviewDescription: overviewDescription?.trim() || '',
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Destination updated successfully',
    });
  } catch (error) {
    console.error('[api/admin/destinations/[id]] PUT error', error);
    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    );
  }
}

