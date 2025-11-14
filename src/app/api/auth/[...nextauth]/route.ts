import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getMongoClient } from "@/server/db/client";
import { createUser, findUserByEmail, getUserLoyaltyPoints } from "@/server/repositories/usersRepository";
import type { NextRequest } from "next/server";

// MongoDB adapter expects a Promise<MongoClient>
const clientPromise = getMongoClient().then(client => client);

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await findUserByEmail(user.email!);
          
          if (!existingUser) {
            // Create new user with 20 loyalty points
            await createUser({
              email: user.email!,
              name: user.name!,
              image: user.image || undefined,
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },
    async session({ session, user }: any) {
      if (session.user && user) {
        session.user.id = user.id;
        // Get loyalty points - user.email might be in user object or session.user
        const userEmail = (user as any).email || session.user.email;
        if (userEmail) {
          const loyaltyPoints = await getUserLoyaltyPoints(userEmail);
          (session.user as any).loyaltyPoints = loyaltyPoints;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database" as const,
  },
};

// NextAuth v5 beta structure
const { handlers } = NextAuth(authOptions);

// Export handlers for Next.js App Router
export const { GET, POST } = handlers;

