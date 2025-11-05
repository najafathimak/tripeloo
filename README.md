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

