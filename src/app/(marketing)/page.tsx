import { Hero } from '@/components/Hero';
import { FeaturedDestinations } from '@/components/FeaturedDestinations';
import { AboutBand } from '@/components/AboutBand';
import OurSpecialities from '@/components/OurSpecialities';
import { NearbySection } from '@/components/NearbySection';

export default function Page() {
  return (
    <main>
      <Hero />
      <AboutBand />
      <FeaturedDestinations />
      <OurSpecialities />
      <NearbySection />
    </main>
  );
}

