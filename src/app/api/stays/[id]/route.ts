import { NextRequest, NextResponse } from 'next/server';
import { findStayById } from '@/server/repositories/staysRepository';
import { getDb } from '@/server/db/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: stayId } = await params;
    
    console.log('[api/stays/[id]] Received stayId:', stayId);
    console.log('[api/stays/[id]] stayId type:', typeof stayId);
    
    if (!stayId) {
      return NextResponse.json({ error: 'Stay ID is required' }, { status: 400 });
    }
    
    // Decode URL-encoded ID if needed
    const decodedStayId = decodeURIComponent(stayId);
    console.log('[api/stays/[id]] Decoded stayId:', decodedStayId);
    
    // User-facing: exclude hidden items
    const stay = await findStayById(decodedStayId);
    
    if (!stay) {
      console.log('[api/stays/[id]] Stay not found for ID:', decodedStayId);
      return NextResponse.json({ error: 'Stay not found', stayId: decodedStayId }, { status: 404 });
    }
    
    console.log('[api/stays/[id]] Stay found:', stay.id);
    return NextResponse.json({ data: stay });
  } catch (error) {
    console.error('[api/stays/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load stay', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

