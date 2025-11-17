import { NextRequest, NextResponse } from 'next/server';
import { findAllCategories, createCategory } from '@/server/repositories/categoriesRepository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'stay' | 'activity' | 'trip' | 'all' | null;
    
    const categories = await findAllCategories(type || undefined);
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('[api/categories] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, isActive } = body;
    
    if (!name || !type) {
      return NextResponse.json(
        { success: false, error: 'Name and type are required' },
        { status: 400 }
      );
    }
    
    const validTypes = ['stay', 'activity', 'trip', 'all'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid type. Must be: stay, activity, trip, or all' },
        { status: 400 }
      );
    }
    
    const category = await createCategory({
      name: name.trim(),
      type: type as 'stay' | 'activity' | 'trip' | 'all',
      isActive: isActive !== undefined ? isActive : true,
    });
    
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('[api/categories] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

