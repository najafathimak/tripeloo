import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FeaturedDestinations } from '@/components/FeaturedDestinations';
import { CategoriesTabs } from '@/components/CategoriesTabs';
import { NearbySection } from '@/components/NearbySection';
import { Footer } from '@/components/Footer';
import { AboutBand } from '@/components/AboutBand';
import { TripsStaysGrid } from '@/components/TripsStaysGrid';
import { BlogTeasers } from '@/components/BlogTeasers';

export default function Page() {
  return (
    <main>
      <Header />
      <Hero />
      <AboutBand />
      <FeaturedDestinations />
      {/* anchor aliases so hero buttons can address different hashes */}
      <div id="stays" />
      <div id="things-to-do" />
      <div id="trips" />
      <TripsStaysGrid />
      <CategoriesTabs />
      <BlogTeasers />
      <NearbySection />
      <Footer />
    </main>
  );
}

