import { NextRequest, NextResponse } from 'next/server';
import { findStayById } from '@/server/repositories/staysRepository';
import { getDb } from '@/server/db/client';
import { findDestinationBySlugOrName } from '@/server/repositories/destinationsRepository';

export const revalidate = 3600;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: stayId } = await params;
    
    if (!stayId) {
      return NextResponse.json({ error: 'Stay ID is required' }, { status: 400 });
    }
    
    const decodedStayId = decodeURIComponent(stayId);
    
    const stay = await findStayById(decodedStayId);
    
    if (!stay) {
      return NextResponse.json({ error: 'Stay not found', stayId: decodedStayId }, { status: 404 });
    }
    
    // Get destination name if destinationSlug exists
    let destinationName = '';
    if (stay.destinationSlug) {
      const destination = await findDestinationBySlugOrName(stay.destinationSlug);
      destinationName = destination?.name || '';
    }
    
    // Add destinationName to stay data
    const stayWithDestination = {
      ...stay,
      destinationName: destinationName,
    };
    
    return NextResponse.json({ data: stayWithDestination }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[api/stays/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load stay', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

