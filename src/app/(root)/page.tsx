import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { FeaturedDestinations } from '@/components/FeaturedDestinations';
import { AboutBand } from '@/components/AboutBand';
import OurSpecialities from '@/components/OurSpecialities';
import StatisticsSection from '@/components/StatisticsSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { siteConfig } from '@/config/site';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Tripeloo: Discover and book curated stays, activities, and trips across top destinations in India. Find the best hotels, resorts, and experiences in Wayanad, Munnar, Coorg, and more.',
  keywords: [
    'travel booking',
    'hotel booking',
    'resort booking',
    'things to do',
    'travel packages',
    'Wayanad hotels',
    'Munnar resorts',
    'Coorg stays',
    'Kerala tourism',
    'Karnataka tourism',
    'India travel',
  ],
  openGraph: {
    title: `${siteConfig.name} — Book Stays, Things To Do & Getaways`,
    description: 'Discover and book curated stays, activities, and trips across top destinations in India.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Tripeloo - Travel Booking Platform',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Book Stays, Things To Do & Getaways`,
    description: 'Discover and book curated stays, activities, and trips across top destinations in India.',
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}/assets/Logo.png`,
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi', 'Malayalam'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    offers: {
      '@type': 'Offer',
      category: 'Travel Services',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HomePageClient />
      </main>
    </>
  );
}
