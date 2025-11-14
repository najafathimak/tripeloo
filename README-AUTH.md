# Google Login & Loyalty Points Setup

## Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string_here
```

## Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local`

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Database Collections

The system will automatically create these collections in MongoDB:

- `users` - User accounts with loyalty points
- `accounts` - OAuth account information (managed by NextAuth)
- `sessions` - User sessions (managed by NextAuth)
- `verificationTokens` - Email verification tokens (managed by NextAuth)

## Loyalty Points System

### Earning Points:
- **20 points** - First time login with Google
- **10 points** - Each review submitted

### Features:
- Points are automatically tracked in the `users` collection
- Users can view their points at `/loyalty-points`
- Points are included in booking WhatsApp messages
- Points are displayed in the user menu in the header

## User Flow

1. User clicks "Login" → Redirected to Google OAuth
2. After successful login → User is created in database with 20 points
3. User submits review → 10 points added automatically
4. User books → WhatsApp message includes email and loyalty points link
5. User clicks loyalty link → Shows current points balance

