import type { Metadata } from "next";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import DestinationDetailClient from "@/components/destinations/DestinationDetailClient";
import { findDestinationBySlugOrName } from "@/server/repositories/destinationsRepository";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const destination = await findDestinationBySlugOrName(decodedSlug);

  if (!destination) {
    return {
      title: "Destination Not Found",
      description: "The requested destination could not be found.",
    };
  }

  const title = `${destination.name} | Tripeloo`;
  const description = destination.summary || `Discover ${destination.name} - Find the best stays, things to do, and experiences in ${destination.location}.`;

  return {
    title,
    description,
    keywords: [
      destination.name,
      destination.location,
      'travel',
      'tourism',
      'hotels',
      'stays',
      'activities',
      'things to do',
      ...(destination.tags || []),
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/destinations/${destination.slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: destination.coverImage || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${destination.name} - ${siteConfig.name}`,
        }
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [destination.coverImage || siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/destinations/${destination.slug}`,
    },
  };
}

export default async function DestinationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { slug } = await params;
  const { category } = await searchParams;
  const decodedSlug = decodeURIComponent(slug);

  // Generate structured data for SEO
  const destination = await findDestinationBySlugOrName(decodedSlug);
  
  const structuredData = destination ? {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.summary,
    image: destination.coverImage,
    address: {
      '@type': 'PostalAddress',
      addressLocality: destination.location,
      addressCountry: 'IN',
    },
    url: `${siteConfig.url}/destinations/${destination.slug}`,
  } : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E51A4B]"></div>
        </div>
      }>
        <DestinationDetailClient slug={decodedSlug} category={category} />
      </Suspense>
    </>
  );
}

