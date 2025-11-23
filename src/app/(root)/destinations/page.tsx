import type { Metadata } from "next";
import { Suspense } from "react";
import { destinations as fallbackDestinations } from "@/data/destinations";
import { Destination } from "@/types/destination";
import { siteConfig } from "@/config/site";
import DestinationsClient from "@/components/destinations/DestinationsClient";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Discover curated destinations with stays, experiences, and trips. Explore top travel destinations in India including Wayanad, Munnar, Coorg, and more. Find hotels, resorts, activities, and travel packages.",
  keywords: [
    'travel destinations',
    'India destinations',
    'Kerala destinations',
    'Karnataka destinations',
    'Wayanad',
    'Munnar',
    'Coorg',
    'hill stations',
    'tourist places',
  ],
  openGraph: {
    title: "Destinations | Tripeloo",
    description: "Discover curated destinations with stays, experiences, and trips.",
    url: `${siteConfig.url}/destinations`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Destinations on Tripeloo',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Destinations | Tripeloo",
    description: "Discover curated destinations with stays, experiences, and trips.",
  },
  alternates: {
    canonical: `${siteConfig.url}/destinations`,
  },
};

async function fetchDestinations() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/destinations`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error("Failed");
    const json = await res.json();
    return json.data as typeof fallbackDestinations;
  } catch {
    return fallbackDestinations;
  }
}

export default async function DestinationsPage() {
  const destinations: Destination[] = await fetchDestinations();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Travel Destinations',
    description: 'Discover curated destinations with stays, experiences, and trips',
    numberOfItems: destinations.length,
    itemListElement: destinations.map((dest, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'TouristDestination',
        name: dest.name,
        description: dest.summary,
        image: dest.coverImage,
        address: {
          '@type': 'PostalAddress',
          addressLocality: dest.location,
          addressCountry: 'IN',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={
        <div className="container py-32">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">
              Popular Destinations
            </h1>
            <p className="mt-2 text-gray-600">
              Explore top spots with cover images, starting prices, and highlights.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <article
                key={d._id}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative h-56 w-full bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </article>
            ))}
          </div>
        </div>
      }>
        <DestinationsClient destinations={destinations} />
      </Suspense>
    </>
  );
}
