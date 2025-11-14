import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'stays';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    
    let stay = null;
    
    // Try ObjectId first
    if (ObjectId.isValid(id)) {
      try {
        const objectId = new ObjectId(id);
        stay = await db.collection(COLLECTION).findOne({ _id: objectId });
      } catch (err) {
        console.log('[api/admin/stays/[id]] ObjectId query failed:', err);
      }
    }
    
    // Fallback: string comparison
    if (!stay) {
      const allStays = await db.collection(COLLECTION).find({}).toArray();
      stay = allStays.find((s: any) => {
        const stayId = s._id?.toString() || s.id || '';
        return stayId === id;
      });
    }
    
    if (!stay) {
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }
    
    // Map stay data - include all fields for editing
    const mappedStay = {
      ...stay,
      id: stay._id?.toString() || stay.id || '',
    };
    
    return NextResponse.json({ data: mappedStay });
  } catch (error) {
    console.error('[api/admin/stays/[id]] GET error', error);
    return NextResponse.json(
      { error: 'Failed to load stay' },
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
      rooms = [],
      location,
      contactNumber,
      address,
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
      const allStays = await db.collection(COLLECTION).find({}).toArray();
      const stay = allStays.find((s: any) => {
        const stayId = s._id?.toString() || s.id || '';
        return stayId === id;
      });
      if (!stay) {
        return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
      }
      query._id = stay._id;
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
          rooms: Array.isArray(rooms) ? rooms.map((room: any) => ({
            id: room.id || Date.now().toString(),
            name: room.name?.trim() || '',
            rate: room.rate?.toString() || '',
            thumb: room.thumb?.trim() || '',
            images: Array.isArray(room.images) ? room.images.filter((img: string) => img && img.trim()) : [],
            features: Array.isArray(room.features) ? room.features.filter((f: string) => f.trim()) : [],
          })) : [],
          location: location?.trim() || '',
          contactNumber: contactNumber?.trim() || '',
          address: address?.trim() || '',
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
      return NextResponse.json({ error: 'Stay not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Stay updated successfully',
    });
  } catch (error) {
    console.error('[api/admin/stays/[id]] PUT error', error);
    return NextResponse.json(
      { error: 'Failed to update stay' },
      { status: 500 }
    );
  }
}
