import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';
import type { Destination } from '@/types/destination';

const COLLECTION = 'destinations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      location,
      coverImage,
      startingPrice,
      currency = 'INR',
      summary,
      tags = [],
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      errors.name = 'Destination name is required';
    }

    if (!slug || slug.trim().length === 0) {
      errors.slug = 'Slug is required';
    } else {
      // Validate slug format (lowercase, alphanumeric, hyphens)
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        errors.slug = 'Slug must be lowercase alphanumeric with hyphens only';
      }
    }

    if (!location || location.trim().length === 0) {
      errors.location = 'Location is required';
    }

    if (!coverImage || coverImage.trim().length === 0) {
      errors.coverImage = 'Cover image is required';
    } else {
      // Validate URL format
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

    if (!Array.isArray(tags)) {
      errors.tags = 'Tags must be an array';
    }

    // Check for duplicate slug
    if (!errors.slug) {
      const db = await getDb();
      const existing = await db.collection(COLLECTION).findOne({ slug });
      if (existing) {
        errors.slug = 'A destination with this slug already exists';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Insert destination
    const db = await getDb();
    const result = await db.collection<Destination>(COLLECTION).insertOne({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      location: location.trim(),
      coverImage: coverImage.trim(),
      startingPrice: Number(startingPrice),
      currency: currency.trim().toUpperCase(),
      summary: summary.trim(),
      tags: tags.filter((tag: string) => tag.trim().length > 0).map((tag: string) => tag.trim()),
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Destination created successfully',
    });
  } catch (error) {
    console.error('[api/destinations/create] error', error);
    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    );
  }
}

