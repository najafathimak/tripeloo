import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/server/db/client';
import { findUserByEmail, updateUserLoyaltyPoints } from '@/server/repositories/usersRepository';

const COLLECTION_NAME = 'users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, points, note } = body;

    // Validation
    if (!email || email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!points || typeof points !== 'number' || points <= 0) {
      return NextResponse.json(
        { error: 'Valid points amount is required' },
        { status: 400 }
      );
    }

    if (!note || note.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note/reason is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await findUserByEmail(email.trim().toLowerCase());

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has enough points
    const currentPoints = user.loyaltyPoints || 0;
    if (points > currentPoints) {
      return NextResponse.json(
        { error: `User only has ${currentPoints} points. Cannot claim ${points} points.` },
        { status: 400 }
      );
    }

    // Update loyalty points (reduce by points)
    const updatedUser = await updateUserLoyaltyPoints(email.trim().toLowerCase(), -points);
    
    // Get final balance - fetch user if updateUser didn't return value
    let finalBalance: number;
    if (updatedUser) {
      finalBalance = updatedUser.loyaltyPoints;
    } else {
      // Verify update succeeded by fetching user again
      const verifyUser = await findUserByEmail(email.trim().toLowerCase());
      if (!verifyUser) {
        return NextResponse.json(
          { error: 'User not found after update' },
          { status: 500 }
        );
      }
      finalBalance = verifyUser.loyaltyPoints;
      
      // Verify points were actually reduced
      if (finalBalance !== currentPoints - points) {
        return NextResponse.json(
          { error: 'Points update verification failed' },
          { status: 500 }
        );
      }
    }

    // Record transaction in user's history
    const db = await getDb();
    try {
      // Initialize pointHistory array if it doesn't exist
      await db.collection(COLLECTION_NAME).updateOne(
        { email: email.trim().toLowerCase(), pointHistory: { $exists: false } },
        {
          $set: { pointHistory: [] },
        }
      );

      // Add transaction to history
      await db.collection(COLLECTION_NAME).updateOne(
        { email: email.trim().toLowerCase() },
        {
          $push: {
            pointHistory: {
              type: 'claimed',
              points: -points,
              note: note.trim(),
              claimedBy: 'admin',
              createdAt: new Date(),
            } as any,
          } as any,
        }
      );
    } catch (historyError) {
      console.error("Error recording point history:", historyError);
      // Don't fail the claim if history recording fails
    }

    return NextResponse.json({
      success: true,
      message: `Successfully claimed ${points} points`,
      newBalance: finalBalance,
      previousBalance: currentPoints,
    });
  } catch (error: any) {
    console.error('[api/admin/loyalty-points/claim] POST error', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to claim points' },
      { status: 500 }
    );
  }
}

