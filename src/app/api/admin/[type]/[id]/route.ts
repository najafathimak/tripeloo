import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTIONS: Record<string, string> = {
  destinations: 'destinations',
  stays: 'stays',
  activities: 'activities',
  trips: 'trips',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { type, id } = await params;
    
    if (!COLLECTIONS[type]) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;
    const collection = db.collection(COLLECTIONS[type]);
    
    let item = null;
    
    if (ObjectId.isValid(id)) {
      try {
        const objectId = new ObjectId(id);
        item = await collection.findOne({ _id: objectId });
      } catch (err) {
        // Try next strategy
      }
    }
    
    if (!item) {
      const allItems = await collection.find({}).toArray();
      item = allItems.find((i: any) => {
        const itemId = i._id?.toString() || i.id || '';
        return itemId === id;
      });
    }
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    const mappedItem = {
      ...item,
      id: item._id?.toString() || item.id || '',
    };
    
    return NextResponse.json({ data: mappedItem });
  } catch (error) {
    console.error('[api/admin/[type]/[id]] error', error);
    return NextResponse.json(
      { error: 'Failed to load item' },
      { status: 500 }
    );
  }
}

