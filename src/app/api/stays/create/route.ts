import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'stays';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      destinationSlug,
      category,
      coverImage,
      carouselImages = [],
      startingPrice,
      originalPrice,
      currency = 'INR',
      summary,
      includes = [],
      excludes = [],
      properties = [],
      rooms = [],
      location,
      additionalDetails = [],
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      errors.name = 'Stay name is required';
    }

    if (!destinationSlug || destinationSlug.trim().length === 0) {
      errors.destinationSlug = 'Destination is required';
    }

    if (!category || category.trim().length === 0) {
      errors.category = 'Category is required';
    }

    if (!coverImage || coverImage.trim().length === 0) {
      errors.coverImage = 'Cover image is required';
    } else {
      try {
        new URL(coverImage);
      } catch {
        errors.coverImage = 'Cover image must be a valid URL';
      }
    }

    if (!startingPrice || typeof startingPrice !== 'number' || startingPrice <= 0) {
      errors.startingPrice = 'Starting price must be a positive number';
    }

    if (!summary || summary.trim().length === 0) {
      errors.summary = 'Summary is required';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Insert stay
    // Note: rating and reviewCount will be calculated from reviews collection, not stored here
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne({
      name: name.trim(),
      destinationSlug: destinationSlug.trim().toLowerCase(),
      category: category.trim(),
      coverImage: coverImage.trim(),
      carouselImages: carouselImages.filter((img: any) => img.url && img.url.trim()),
      startingPrice: Number(startingPrice),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      currency: currency.trim().toUpperCase(),
      summary: summary.trim(),
      includes: includes.filter((inc: string) => inc.trim().length > 0),
      excludes: excludes.filter((exc: string) => exc.trim().length > 0),
      properties: properties.filter((prop: string) => prop.trim().length > 0),
      rooms: rooms.map((room: any) => ({
        name: room.name?.trim() || '',
        rate: room.rate?.trim() || '',
        thumb: room.thumb?.trim() || '',
        images: Array.isArray(room.images) ? room.images.filter((img: string) => img.trim()) : [],
        features: Array.isArray(room.features) ? room.features.filter((f: string) => f.trim()) : [],
      })),
      location: location?.trim() || '',
      additionalDetails: additionalDetails.map((detail: any) => ({
        heading: detail.heading?.trim() || '',
        type: detail.type || 'description',
        description: detail.type === 'description' ? (detail.description?.trim() || '') : undefined,
        points: detail.type === 'points' ? (detail.points?.filter((p: string) => p.trim()) || []) : undefined,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Stay created successfully',
    });
  } catch (error) {
    console.error('[api/stays/create] error', error);
    return NextResponse.json(
      { error: 'Failed to create stay' },
      { status: 500 }
    );
  }
}

