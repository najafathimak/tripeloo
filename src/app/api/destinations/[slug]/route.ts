import { NextRequest, NextResponse } from 'next/server';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';
import { findStaysByDestination } from '@/server/repositories/staysRepository';
import { findActivitiesByDestination } from '@/server/repositories/activitiesRepository';
import { findTripsByDestination } from '@/server/repositories/tripsRepository';

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Destination slug is required' }, { status: 400 });
    }

    const decodedSlug = decodeURIComponent(slug);
    
    // Fetch destination
    const destination = await findDestinationBySlugOrName(decodedSlug);
    
    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Fetch all related data
    const [stays, activities, trips] = await Promise.all([
      findStaysByDestination(decodedSlug),
      findActivitiesByDestination(decodedSlug),
      findTripsByDestination(decodedSlug),
    ]);

    // Map destination with custom images (if available in future)
    const destinationData = {
      id: destination._id?.toString() || '',
      name: destination.name || '',
      slug: destination.slug || '',
      location: destination.location || '',
      coverImage: destination.coverImage || '',
      startingPrice: destination.startingPrice || 0,
      currency: destination.currency || 'INR',
      summary: destination.summary || '',
      tags: destination.tags || [],
      // Custom images for carousel
      customImages: (destination as any).carouselImages || [],
      // Overview section
      overviewHeading: (destination as any).overviewHeading || `About ${destination.name}`,
      overviewDescription: (destination as any).overviewDescription || destination.summary || '',
    };

    return NextResponse.json({
      data: {
        destination: destinationData,
        stays: stays || [],
        activities: activities || [],
        trips: trips || [],
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[api/destinations/[slug]] error', error);
    return NextResponse.json(
      { error: 'Failed to load destination' },
      { status: 500 }
    );
  }
}

