import StayListingsContent from "@/components/stay-listings/StayListingsContent";
import { Suspense } from "react";

export const metadata = {
  title: "Explore Destinations | Tripeloo",
  description:
    "Find the best stays, activities, and trips for your chosen destination on Tripeloo.",
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
