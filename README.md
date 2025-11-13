## Environment variables

Create a `.env.local` with:

```
MONGODB_URI=
MONGODB_DB=tripeloo
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Panel Password (required for accessing admin routes)
ADMIN_PASSWORD=your_secure_password_here
```

### Setting up Cloudinary

1. Sign up for a free account at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard to get your credentials
3. Add the credentials to your `.env.local` file
4. Images will be uploaded to the `tripeloo/destinations` folder in your Cloudinary account

### Setting up Admin Password

1. Choose a secure password for admin panel access
2. Add it to your `.env.local` file as `ADMIN_PASSWORD=your_secure_password_here`
3. **Important:** Use a strong password and never commit it to version control
4. When accessing any `/admin/*` route, you'll be prompted to enter this password
5. The password is stored in session storage, so you'll stay logged in until you logout or close the browser

# Tripeloo Booking Platform (Landing)

Mobile-first Next.js landing page with Tailwind, SEO, and modular config.

## Scripts

- dev: start dev server
- build: build production
- start: run production

## Stack

- Next.js 14 (App Router)
- Tailwind CSS (custom brand color #E51A4B)
- next-seo + Next Metadata

## Development

```bash
pnpm i # or npm i / yarn
pnpm dev
```

## Structure

- `src/app` — app router, layout and landing page
- `src/components` — UI components
- `src/config` — site + SEO config (plug-and-play)

## Future-Ready

- Keep UI in Next server for now
- Extract business logic to separate Express server later without touching UI

## Environment

- Copy `.env.example` to `.env.local` and update values

