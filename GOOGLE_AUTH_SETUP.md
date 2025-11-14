# Google Authentication Setup Guide

## Step 1: Get Google OAuth Credentials

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "Tripeloo Auth")
5. Click **"Create"**

### 1.2 Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity Services"**
3. Click on it and click **"Enable"**

### 1.3 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen first:
   - Choose **"External"** (unless you have a Google Workspace)
   - Fill in:
     - **App name**: Tripeloo
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click **"Save and Continue"**
   - Add scopes: `email`, `profile`, `openid`
   - Click **"Save and Continue"**
   - Add test users (your email) if needed
   - Click **"Save and Continue"**
   - Review and click **"Back to Dashboard"**

4. Now create OAuth Client ID:
   - **Application type**: Web application
   - **Name**: Tripeloo Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production - add this later)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production - add this later)
   - Click **"Create"**

5. **Copy the Client ID and Client Secret** - You'll need these!

## Step 2: Add Environment Variables

### 2.1 Create/Update `.env.local` file

In your project root (`D:\Tripeloo\Next.js`), create or update `.env.local`:

```env
# MongoDB Configuration (if not already set)
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=tripeloo

# Cloudinary Configuration (if not already set)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Panel Password (if not already set)
ADMIN_PASSWORD=your_secure_password_here

# Google OAuth Credentials (ADD THESE)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string_here
```

### 2.2 Generate NEXTAUTH_SECRET

Run this command in your terminal to generate a secure secret:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

**Or use online generator:**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

**Or use OpenSSL (if installed):**
```bash
openssl rand -base64 32
```

## Step 3: Verify Setup

### 3.1 Check Your `.env.local` File

Make sure your `.env.local` file contains:
- ✅ `GOOGLE_CLIENT_ID` - From Google Cloud Console
- ✅ `GOOGLE_CLIENT_SECRET` - From Google Cloud Console  
- ✅ `NEXTAUTH_URL` - `http://localhost:3000` for development
- ✅ `NEXTAUTH_SECRET` - Generated random string

### 3.2 Restart Development Server

After adding environment variables, **restart your development server**:

1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again

Environment variables are only loaded when the server starts!

## Step 4: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Click **"Continue with Google"**
4. You should be redirected to Google's login page
5. After logging in, you'll be redirected back to your app

## Step 5: Production Setup (When Deploying)

When you're ready to deploy:

1. **Update Google Cloud Console**:
   - Add your production domain to **Authorized JavaScript origins**
   - Add your production callback URL to **Authorized redirect URIs**

2. **Update Environment Variables** (on your hosting platform):
   - Set `NEXTAUTH_URL` to your production URL (e.g., `https://yourdomain.com`)
   - Keep the same `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Keep the same `NEXTAUTH_SECRET` (don't change this!)

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes or typos

### Error: "invalid_client"
- Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure there are no extra spaces in `.env.local`

### Error: "NEXTAUTH_SECRET is not set"
- Make sure `NEXTAUTH_SECRET` is in your `.env.local` file
- Restart your development server after adding it

### Session not persisting
- Check that `NEXTAUTH_URL` matches your current URL
- Verify MongoDB connection is working (sessions are stored in database)

## Quick Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 Client ID
- [ ] Added redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Copied Client ID and Client Secret
- [ ] Added `GOOGLE_CLIENT_ID` to `.env.local`
- [ ] Added `GOOGLE_CLIENT_SECRET` to `.env.local`
- [ ] Generated and added `NEXTAUTH_SECRET` to `.env.local`
- [ ] Added `NEXTAUTH_URL=http://localhost:3000` to `.env.local`
- [ ] Restarted development server
- [ ] Tested login at `/login` page

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal/console for server errors
3. Verify all environment variables are set correctly
4. Make sure MongoDB is running and accessible

