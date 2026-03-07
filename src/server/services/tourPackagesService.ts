import type { TourPackageListItem } from '@/components/stay-listings/DestinationData';
import { findTourPackagesByDestination } from '@/server/repositories/tourPackagesRepository';

export async function listTourPackagesByDestination(destinationSlug: string): Promise<TourPackageListItem[]> {
  return await findTourPackagesByDestination(destinationSlug);
}
