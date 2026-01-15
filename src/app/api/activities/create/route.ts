import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'activities';

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
      about,
      includes = [],
      excludes = [],
      location,
      contactNumber,
      address,
      activityDetails = {},
      additionalDetails = [],
      nearbyStays = [],
      nearbyTrips = [],
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      errors.name = 'Activity name is required';
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

    // Starting price is optional - only validate if provided
    if (startingPrice !== undefined && startingPrice !== null && startingPrice !== '') {
      const priceNum = Number(startingPrice);
      if (isNaN(priceNum) || priceNum < 0) {
        errors.startingPrice = 'Starting price must be a positive number';
      }
    }

    if (!about || about.trim().length === 0) {
      errors.about = 'About/Description is required';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Insert activity
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne({
      name: name.trim(),
      propertyName: propertyName?.trim() || '',
      destinationSlug: destinationSlug.trim().toLowerCase(),
      category: category.trim(),
      coverImage: coverImage.trim(),
      carouselImages: carouselImages.filter((img: any) => img.url && img.url.trim()),
      startingPrice: startingPrice ? Number(startingPrice) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      currency: currency.trim().toUpperCase(),
      about: about.trim(),
      includes: includes.filter((inc: string) => inc.trim().length > 0),
      excludes: excludes.filter((exc: string) => exc.trim().length > 0),
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
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Activity created successfully',
    });
  } catch (error) {
    console.error('[api/activities/create] error', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}


  }
}

