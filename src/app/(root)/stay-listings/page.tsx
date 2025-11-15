import StayListingsContent from "@/components/stay-listings/StayListingsContent";
import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Explore Destinations",
  description:
    "Find the best stays, activities, and trips for your chosen destination on Tripeloo. Browse hotels, resorts, experiences, and travel packages in Wayanad, Munnar, Coorg, and more.",
  keywords: [
    'destination stays',
    'hotel listings',
    'resort listings',
    'travel activities',
    'trip packages',
    'Wayanad',
    'Munnar',
    'Coorg',
    'Kerala',
    'Karnataka',
  ],
  openGraph: {
    title: "Explore Destinations | Tripeloo",
    description: "Find the best stays, activities, and trips for your chosen destination on Tripeloo.",
    url: `${siteConfig.url}/stay-listings`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Explore Destinations on Tripeloo',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Explore Destinations | Tripeloo",
    description: "Find the best stays, activities, and trips for your chosen destination on Tripeloo.",
  },
  alternates: {
    canonical: `${siteConfig.url}/stay-listings`,
  },
};

export default function StayListingsPage() {
  return (
    <main className="mb-16">
      <Suspense fallback={<div>Loading...</div>}>
        <StayListingsContent />
      </Suspense>
    </main>
  );
}
