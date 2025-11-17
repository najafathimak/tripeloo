import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'trips';

export async function POST(request: NextRequest) {
  try {
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
      currency = 'INR',
      summary,
      includes = [],
      excludes = [],
      properties = [],
      packages = [],
      location,
      contactNumber,
      address,
      additionalDetails = [],
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      errors.name = 'Trip name is required';
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

    // Insert trip
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne({
      name: name.trim(),
      propertyName: propertyName?.trim() || '',
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
      packages: packages.map((pkg: any) => ({
        name: pkg.name?.trim() || '',
        duration: pkg.duration?.trim() || '',
        price: Number(pkg.price) || 0,
        thumb: pkg.thumb?.trim() || '',
        images: Array.isArray(pkg.images) ? pkg.images.filter((img: string) => img && img.trim()) : [],
        highlights: Array.isArray(pkg.highlights) ? pkg.highlights.filter((h: string) => h && h.trim()) : [],
      })),
      location: location?.trim() || '',
      contactNumber: contactNumber?.trim() || '',
      address: address?.trim() || '',
      additionalDetails: additionalDetails.map((detail: any) => ({
        heading: detail.heading?.trim() || '',
        type: detail.type || 'description',
        description: detail.type === 'description' ? (detail.description?.trim() || '') : undefined,
        points: detail.type === 'points' ? (detail.points?.filter((p: string) => p.trim()) || []) : undefined,
      })),
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Trip created successfully',
    });
  } catch (error) {
    console.error('[api/trips/create] error', error);
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    );
  }
}

