import { NextRequest, NextResponse } from 'next/server';
import { findCategoryById, updateCategory, deleteCategory } from '@/server/repositories/categoriesRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await findCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('[api/categories/[id]] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, type, isActive } = body;
    
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (type !== undefined) {
      const validTypes = ['stay', 'activity', 'trip', 'all'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid type. Must be: stay, activity, trip, or all' },
          { status: 400 }
        );
      }
      updates.type = type;
    }
    if (isActive !== undefined) updates.isActive = isActive;
    
    const category = await updateCategory(id, updates);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('[api/categories/[id]] PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('[api/categories/[id]] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

