import { NextResponse } from 'next/server';
import { listDestinations } from '@/server/services/destinationsService';

export async function GET() {
  try {
    const data = await listDestinations();
    // TEMP: Log to server console to verify DB connection
    console.log('[api/destinations] fetched', {
      count: Array.isArray(data) ? data.length : 0,
      sample: Array.isArray(data) && data.length > 0 ? data[0] : null
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[api/destinations] error', error);
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 });
  }
}


