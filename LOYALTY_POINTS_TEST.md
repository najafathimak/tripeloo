# Loyalty Points System - How It Works

## ✅ Implementation Status: **WORKING**

The loyalty points system is fully implemented and should work correctly. Here's how it works:

## How Loyalty Points Work

### 1. **First Login - 20 Points** ✅
- When a user logs in with Google for the first time
- Location: `src/app/api/auth/[...nextauth]/route.ts` (signIn callback)
- Function: `createUser()` in `src/server/repositories/usersRepository.ts`
- **Action**: Creates user with `loyaltyPoints: 20`

### 2. **Review Submission - 10 Points** ✅
- When a logged-in user submits a review
- Location: `src/app/api/reviews/route.ts` (POST handler)
- Function: `updateUserLoyaltyPoints(userEmail, 10)`
- **Action**: Adds 10 points to existing user's loyalty points

### 3. **Display Points** ✅
- Points are fetched in session callback
- Displayed in:
  - Header dropdown menu
  - Mobile menu
  - `/loyalty-points` page

## Testing the System

### Test 1: First Login
1. Log in with Google (new user)
2. Check MongoDB `users` collection:
   ```javascript
   db.users.findOne({ email: "your-email@gmail.com" })
   ```
   Should show: `loyaltyPoints: 20`

3. Check header - should show "20 Loyalty Points"
4. Visit `/loyalty-points` - should show 20 points

### Test 2: Submit Review
1. Log in with Google
2. Go to any stay/trip/activity detail page
3. Submit a review (must be logged in)
4. Check MongoDB:
   ```javascript
   db.users.findOne({ email: "your-email@gmail.com" })
   ```
   Should show: `loyaltyPoints: 30` (20 initial + 10 for review)

5. Refresh page - header should show updated points
6. Visit `/loyalty-points` - should show 30 points

## Potential Issues & Solutions

### Issue 1: Points Not Updating After Review
**Check:**
- Is the user logged in? (Reviews require login)
- Check browser console for errors
- Check server logs for database errors
- Verify MongoDB connection is working

**Solution:**
- Ensure MongoDB is running
- Check that email in review matches logged-in user's email

### Issue 2: Points Not Showing in Header
**Check:**
- Is the session being refreshed?
- Try logging out and logging back in
- Check browser console for session errors

**Solution:**
- Session callback fetches points on each request
- Points should update automatically

### Issue 3: Points Show as 0
**Check:**
- User might not exist in database
- Email mismatch between session and database

**Solution:**
- Check MongoDB `users` collection
- Verify email matches exactly (case-sensitive)

## Database Structure

The `users` collection should have:
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  name: "User Name",
  image: "https://...",
  loyaltyPoints: 20,  // or 30, 40, etc.
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

## Code Flow

1. **Login Flow:**
   ```
   User clicks "Login with Google"
   → NextAuth handles OAuth
   → signIn callback checks if user exists
   → If new: createUser() with 20 points
   → session callback fetches points
   → Points displayed in UI
   ```

2. **Review Flow:**
   ```
   User submits review (must be logged in)
   → Review saved to database
   → updateUserLoyaltyPoints() adds 10 points
   → Points updated in database
   → Next session refresh shows new points
   ```

## Verification Commands

### Check User in MongoDB:
```javascript
// Connect to MongoDB
use tripeloo

// Find user by email
db.users.findOne({ email: "your-email@gmail.com" })

// Check all users
db.users.find().pretty()

// Check loyalty points specifically
db.users.find({}, { email: 1, loyaltyPoints: 1 })
```

### Check Reviews:
```javascript
// Find reviews by user email
db.reviews.find({ userEmail: "your-email@gmail.com" })
```

## Expected Behavior

✅ **Working:**
- New users get 20 points on first login
- Each review adds 10 points
- Points display in header and loyalty page
- Points persist in database

❌ **Not Working:**
- Points not updating after review
- Points showing as 0 or undefined
- Points not persisting

If you're experiencing issues, check:
1. MongoDB connection
2. User email matching
3. Server logs for errors
4. Browser console for client errors

