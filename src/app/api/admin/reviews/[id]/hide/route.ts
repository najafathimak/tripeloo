import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';

const COLLECTION = 'reviews';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isHidden } = await request.json();

    if (typeof isHidden !== 'boolean') {
      return NextResponse.json({ error: 'isHidden must be a boolean' }, { status: 400 });
    }

    const db = await getDb();
    const ObjectId = require('mongodb').ObjectId;

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      // Fallback for string IDs
      const review = await db.collection(COLLECTION).findOne({ $or: [{ _id: new ObjectId(id) }, { id: id }] });
      if (!review) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
      query._id = review._id;
    }

    const result = await db.collection(COLLECTION).updateOne(
      query,
      { $set: { isHidden: isHidden, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Review ${isHidden ? 'hidden' : 'unhidden'} successfully` 
    });
  } catch (error) {
    console.error('[api/admin/reviews/[id]/hide] error', error);
    return NextResponse.json(
      { error: 'Failed to update review visibility' },
      { status: 500 }
    );
  }
}

