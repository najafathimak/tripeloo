# Cloudinary Setup Guide

## Step 1: Get Your Cloudinary Credentials

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (if you don't have one)
3. After logging in, go to your **Dashboard**
4. You'll see your credentials:
   - **Cloud Name** (e.g., `dxyz123`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 2: Add Credentials to Environment File

1. In your project root directory (`D:\Tripeloo\Next.js`), create a file named `.env.local`
   - If the file already exists, open it
   - If it doesn't exist, create it

2. Add the following lines to `.env.local`:

```env
# Existing environment variables (if any)
MONGODB_URI=your_mongodb_uri
MONGODB_DB=tripeloo
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

3. Replace the placeholder values with your actual Cloudinary credentials:
   - Replace `your_cloud_name_here` with your Cloud Name
   - Replace `your_api_key_here` with your API Key
   - Replace `your_api_secret_here` with your API Secret

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Step 3: Restart Your Development Server

After adding the environment variables, you **must restart** your Next.js development server:

1. Stop the server (press `Ctrl+C` in the terminal)
2. Start it again with `npm run dev`

**Important:** Environment variables are only loaded when the server starts, so changes won't take effect until you restart.

## Step 4: Access the Admin Destination Page

1. Start your development server: `npm run dev`
2. Open your browser and go to: `http://localhost:3000/admin/destinations`

Or navigate through the admin menu:
- Go to `http://localhost:3000/admin`
- Click on "Destinations" in the navigation menu

## Troubleshooting

### If you get "Cloudinary credentials are not configured" error:

1. Make sure `.env.local` file exists in the project root
2. Check that all three Cloudinary variables are set correctly
3. Make sure there are no extra spaces or quotes around the values
4. Restart your development server after making changes

### If image upload fails:

1. Verify your Cloudinary credentials are correct
2. Check that your Cloudinary account is active
3. Check the browser console and server logs for specific error messages
4. Make sure the image file is less than 10MB and in a supported format (JPEG, PNG, WebP)

## Security Note

⚠️ **Never commit `.env.local` to Git!** This file contains sensitive credentials and should be kept private. It's already in `.gitignore` by default.

