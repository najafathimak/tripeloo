import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';

const COLLECTION = 'tour_packages';

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: packageId } = await params;
    if (!packageId) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    const decodedId = decodeURIComponent(packageId);
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;

    let pkg: any = null;
    if (ObjectId.isValid(decodedId)) {
      try {
        pkg = await db.collection(COLLECTION).findOne({ _id: new ObjectId(decodedId), isHidden: { $ne: true } });
      } catch {
        // ignore
      }
    }
    if (!pkg) {
      const all = await db.collection(COLLECTION).find({ isHidden: { $ne: true } }).toArray();
      pkg = all.find((t: any) => (t._id?.toString() || t.id || '') === decodedId);
    }
    if (!pkg) {
      return NextResponse.json({ error: 'Tour package not found' }, { status: 404 });
    }

    let destinationName = '';
    if (pkg.destinationSlug) {
      const dest = await findDestinationBySlugOrName(pkg.destinationSlug);
      destinationName = dest?.name || '';
    }

    const mapped = {
      id: pkg._id?.toString() || pkg.id || '',
      name: pkg.name || '',
      destinationSlug: pkg.destinationSlug || '',
      destinationName: destinationName,
      coverImage: pkg.coverImage || '',
      carouselImages: pkg.carouselImages || [],
      summary: pkg.summary || '',
      packagePrice: pkg.packagePrice ?? 0,
      currency: pkg.currency || 'INR',
      numberOfDays: pkg.numberOfDays ?? 0,
      numberOfNights: pkg.numberOfNights ?? 0,
      durationOptions: pkg.durationOptions || [],
      inclusions: pkg.inclusions || [],
      exclusions: pkg.exclusions || [],
      tripHighlights: pkg.tripHighlights || [],
      detailedItinerary: pkg.detailedItinerary || '',
      countrySpecificGuidelines: pkg.countrySpecificGuidelines || '',
      formType: pkg.formType || 'enquiry',
    };

    return NextResponse.json(
      { data: mapped },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('[api/tour-packages/[id]] error', error);
    return NextResponse.json({ error: 'Failed to load tour package' }, { status: 500 });
  }
}
