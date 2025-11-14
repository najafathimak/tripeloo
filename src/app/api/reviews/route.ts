import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'reviews';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      itemId,
      itemType, // 'stay', 'activity', 'trip'
      userName,
      userEmail,
      rating,
      review,
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!itemId || itemId.trim().length === 0) {
      errors.itemId = 'Item ID is required';
    }

    if (!itemType || !['stay', 'activity', 'trip'].includes(itemType)) {
      errors.itemType = 'Item type must be stay, activity, or trip';
    }

    if (!userName || userName.trim().length === 0) {
      errors.userName = 'Name is required';
    }

    if (!userEmail || userEmail.trim().length === 0) {
      errors.userEmail = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        errors.userEmail = 'Invalid email format';
      }
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      errors.rating = 'Rating must be a number between 1 and 5';
    }

    if (!review || review.trim().length === 0) {
      errors.review = 'Review text is required';
    } else if (review.trim().length < 10) {
      errors.review = 'Review must be at least 10 characters long';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Insert review
    const db = await getDb();
    const result = await db.collection(COLLECTION).insertOne({
      itemId: itemId.trim(),
      itemType: itemType.trim().toLowerCase(),
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      rating: Number(rating),
      review: review.trim(),
      isHidden: false, // New reviews are visible by default
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('[api/reviews] POST error', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get('itemId');
    const itemType = searchParams.get('itemType');

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: 'itemId and itemType are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const reviews = await db.collection(COLLECTION)
      .find({
        itemId: itemId.trim(),
        itemType: itemType.trim().toLowerCase(),
        isHidden: { $ne: true }, // Exclude hidden reviews for users
      })
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    // Calculate average rating and distribution
    const totalReviews = reviews.length;
    let averageRating = 0;
    const distribution = [0, 0, 0, 0, 0]; // [5,4,3,2,1 stars]

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => {
        const rating = r.rating || 0;
        if (rating >= 1 && rating <= 5) {
          distribution[5 - rating]++; // 5-star is index 0, 1-star is index 4
        }
        return acc + rating;
      }, 0);
      averageRating = sum / totalReviews;
    }

    const mappedReviews = reviews.map((r) => ({
      id: r._id?.toString() || r.id || '',
      userName: r.userName || 'Anonymous',
      userEmail: r.userEmail || '',
      rating: r.rating || 0,
      review: r.review || '',
      createdAt: r.createdAt || new Date(),
    }));

    return NextResponse.json({
      data: mappedReviews,
      summary: {
        average: averageRating,
        totalReviews,
        distribution,
      },
    });
  } catch (error) {
    console.error('[api/reviews] GET error', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

