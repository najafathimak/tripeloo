import { getDb } from '@/server/db/client';

const COLLECTION = 'categories';

export interface Category {
  _id?: string;
  name: string;
  type: 'stay' | 'activity' | 'trip' | 'all';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function findAllCategories(type?: 'stay' | 'activity' | 'trip' | 'all'): Promise<Category[]> {
  const db = await getDb();
  const query: any = {};
  
  if (type && type !== 'all') {
    query.$or = [
      { type: type },
      { type: 'all' }
    ];
  }
  
  const rows = await db.collection<Category>(COLLECTION)
    .find(query)
    .sort({ name: 1 })
    .toArray();
  
  return rows.map((r) => ({
    ...r,
    _id: r._id?.toString(),
    createdAt: r.createdAt || new Date(),
    updatedAt: r.updatedAt || new Date(),
  }));
}

export async function findCategoryById(id: string): Promise<Category | null> {
  const db = await getDb();
  
  try {
    const ObjectId = require('mongodb').ObjectId;
    if (ObjectId.isValid(id)) {
      const category = await db.collection<Category>(COLLECTION).findOne({
        _id: new ObjectId(id)
      });
      return category ? { ...category, _id: category._id?.toString() } : null;
    }
  } catch (error) {
    console.error('[findCategoryById] Error:', error);
  }
  
  return null;
}

export async function findCategoryByName(name: string, type?: 'stay' | 'activity' | 'trip' | 'all'): Promise<Category | null> {
  const db = await getDb();
  const query: any = {
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
  };
  
  if (type && type !== 'all') {
    query.$or = [
      { type: type },
      { type: 'all' }
    ];
  }
  
  const category = await db.collection<Category>(COLLECTION).findOne(query);
  return category ? { ...category, _id: category._id?.toString() } : null;
}

export async function createCategory(category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  const db = await getDb();
  const now = new Date();
  
  const newCategory: Omit<Category, '_id'> = {
    ...category,
    isActive: category.isActive !== undefined ? category.isActive : true,
    createdAt: now,
    updatedAt: now,
  };
  
  const result = await db.collection<Category>(COLLECTION).insertOne(newCategory as any);
  return {
    ...newCategory,
    _id: result.insertedId.toString(),
  };
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, '_id' | 'createdAt'>>): Promise<Category | null> {
  const db = await getDb();
  
  try {
    const ObjectId = require('mongodb').ObjectId;
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
    };
    
    const result = await db.collection<Category>(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result ? { ...result, _id: result._id?.toString() } : null;
  } catch (error) {
    console.error('[updateCategory] Error:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = await getDb();
  
  try {
    const ObjectId = require('mongodb').ObjectId;
    if (!ObjectId.isValid(id)) {
      return false;
    }
    
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('[deleteCategory] Error:', error);
    return false;
  }
}

