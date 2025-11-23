import type { Metadata } from "next";
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
      <DestinationsClient destinations={destinations} />
    </>
  );
}
