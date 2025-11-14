import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTIONS: Record<string, string> = {
  destinations: 'destinations',
  stays: 'stays',
  activities: 'activities',
  trips: 'trips',
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    const body = await request.json();
    const { isHidden } = body;
    
    if (!COLLECTIONS[type]) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    if (typeof isHidden !== 'boolean') {
      return NextResponse.json({ error: 'isHidden must be a boolean' }, { status: 400 });
    }
    
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    const collection = db.collection(COLLECTIONS[type]);
    
    let query: any = {};
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      // Try to find by string ID
      const allItems = await collection.find({}).toArray();
      const item = allItems.find((item: any) => {
        const itemId = item._id?.toString() || item.id || '';
        return itemId === id;
      });
      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      query._id = item._id;
    }
    
    const result = await collection.updateOne(
      query,
      { 
        $set: { 
          isHidden: isHidden,
          updatedAt: new Date(),
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: isHidden ? 'Item hidden successfully' : 'Item unhidden successfully' 
    });
  } catch (error) {
    console.error('[api/admin/[type]/[id]/hide] error', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

