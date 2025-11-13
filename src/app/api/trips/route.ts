import { NextRequest, NextResponse } from 'next/server';
import { listTripsByDestination } from '@/server/services/tripsService';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const destinationParam = searchParams.get('destination');
    
    if (!destinationParam) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 });
    }
    
    // First, try to find the destination to get the actual slug
    const destination = await findDestinationBySlugOrName(destinationParam);
    const destinationSlug = destination?.slug || destinationParam.toLowerCase().trim();
    
    const data = await listTripsByDestination(destinationSlug);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[api/trips] error', error);
    return NextResponse.json({ error: 'Failed to load trips' }, { status: 500 });
  }
}

