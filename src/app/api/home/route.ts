import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'homepage';

export async function GET() {
  try {
    const db = await getDb();
    const homeData = await db.collection(COLLECTION).findOne({});

    if (!homeData) {
      // Return default structure if no data exists
      return NextResponse.json({
        data: {
          heroDesktopImage: '',
          heroMobileImage: '',
          discoverTitle: 'Discover India with Tripeloo',
          discoverContent: 'At Tripeloo, we handcraft travel experiences that celebrate India\'s diverse beauty — from misty mountains to sun-kissed beaches, royal heritage, and hidden escapes. Whether you seek adventure or serenity, our curated stays and guided journeys ensure every trip feels personal and effortless.',
          discoverButtonText: 'hello@tripeloo.com',
          discoverButtonLink: 'mailto:hello@tripeloo.com',
          testimonialsHeading: 'Testimonials',
          testimonials: [],
        },
      });
    }

    const mappedData = {
      id: homeData._id?.toString() || '',
      heroDesktopImage: homeData.heroDesktopImage || '',
      heroMobileImage: homeData.heroMobileImage || '',
      discoverTitle: homeData.discoverTitle || 'Discover India with Tripeloo',
      discoverContent: homeData.discoverContent || '',
      discoverButtonText: homeData.discoverButtonText || 'hello@tripeloo.com',
      discoverButtonLink: homeData.discoverButtonLink || 'mailto:hello@tripeloo.com',
      testimonialsHeading: homeData.testimonialsHeading || 'Testimonials',
      testimonials: homeData.testimonials || [],
    };

    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.error('[api/home] GET error', error);
    return NextResponse.json(
      { error: 'Failed to load home page data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      heroDesktopImage,
      heroMobileImage,
      discoverTitle,
      discoverContent,
      discoverButtonText,
      discoverButtonLink,
      testimonialsHeading,
      testimonials = [],
    } = body;

    if (!heroDesktopImage || !heroMobileImage || !discoverTitle || !discoverContent || !discoverButtonText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Check if homepage data exists
    const existing = await db.collection(COLLECTION).findOne({});
    
    const homeData = {
      heroDesktopImage: heroDesktopImage.trim(),
      heroMobileImage: heroMobileImage.trim(),
      discoverTitle: discoverTitle.trim(),
      discoverContent: discoverContent.trim(),
      discoverButtonText: discoverButtonText.trim(),
      discoverButtonLink: discoverButtonLink?.trim() || 'mailto:hello@tripeloo.com',
      testimonialsHeading: testimonialsHeading?.trim() || 'Testimonials',
      testimonials: Array.isArray(testimonials) ? testimonials.map((t: any) => ({
        id: t.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        image: t.image?.trim() || '',
        title: t.title?.trim() || '',
        experience: t.experience?.trim() || '',
        name: t.name?.trim() || '',
        location: t.location?.trim() || '',
      })) : [],
      updatedAt: new Date(),
    };

    if (existing) {
      // Update existing
      await db.collection(COLLECTION).updateOne(
        { _id: existing._id },
        { $set: homeData }
      );
    } else {
      // Create new
      await db.collection(COLLECTION).insertOne({
        ...homeData,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Home page updated successfully',
    });
  } catch (error) {
    console.error('[api/home] PUT error', error);
    return NextResponse.json(
      { error: 'Failed to update home page' },
      { status: 500 }
    );
  }
}

