import type { Trip } from '@/components/stay-listings/DestinationData';
import { findTripsByDestination } from '@/server/repositories/tripsRepository';

export async function listTripsByDestination(destinationSlug: string): Promise<Trip[]> {
  return await findTripsByDestination(destinationSlug);
}

