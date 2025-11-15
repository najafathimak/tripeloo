import { getDb } from "../db/client";
import { User } from "@/types/user";

const COLLECTION_NAME = "users";

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.collection(COLLECTION_NAME).findOne<User>({ email });
  return user;
}

export async function createUser(userData: {
  email: string;
  name: string;
  image?: string;
}): Promise<User> {
  const db = await getDb();
  const now = new Date();
  
  const newUser: Omit<User, "_id"> = {
    email: userData.email,
    name: userData.name,
    image: userData.image,
    loyaltyPoints: 20, // Initial 20 points for first login
    pointHistory: [
      {
        type: 'earned',
        points: 20,
        note: 'Welcome bonus - First time login',
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(COLLECTION_NAME).insertOne(newUser);
  
  return {
    _id: result.insertedId.toString(),
    ...newUser,
  };
}

export async function updateUserLoyaltyPoints(
  email: string,
  pointsToAdd: number
): Promise<User | null> {
  const db = await getDb();
  
  try {
    // First check if user exists
    const existingUser = await db.collection(COLLECTION_NAME).findOne<User>({ email });
    if (!existingUser) {
      console.error(`User not found for email: ${email}`);
      return null;
    }

    // Ensure loyaltyPoints field exists
    if (existingUser.loyaltyPoints === undefined || existingUser.loyaltyPoints === null) {
      await db.collection(COLLECTION_NAME).updateOne(
        { email },
        { $set: { loyaltyPoints: 0 } }
      );
    }

    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { email },
      {
        $inc: { loyaltyPoints: pointsToAdd },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    // If findOneAndUpdate didn't return value, fetch the user directly
    if (!result?.value) {
      const updatedUser = await db.collection(COLLECTION_NAME).findOne<User>({ email });
      return updatedUser;
    }

    return result.value as User;
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    // Try to fetch user to verify update succeeded
    const user = await db.collection(COLLECTION_NAME).findOne<User>({ email });
    return user;
  }
}

export async function getUserLoyaltyPoints(email: string): Promise<number> {
  const db = await getDb();
  const user = await db.collection(COLLECTION_NAME).findOne<User>(
    { email },
    { projection: { loyaltyPoints: 1 } }
  );
  
  return user?.loyaltyPoints || 0;
}

