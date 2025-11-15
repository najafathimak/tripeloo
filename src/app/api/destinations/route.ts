import { NextResponse } from 'next/server';
import { listDestinations } from '@/server/services/destinationsService';

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await listDestinations();
    return NextResponse.json({ data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[api/destinations] error', error);
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 });
  }
}


