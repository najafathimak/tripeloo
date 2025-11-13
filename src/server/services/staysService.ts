import type { Stay } from '@/components/stay-listings/DestinationData';
import { findStaysByDestination } from '@/server/repositories/staysRepository';

export async function listStaysByDestination(destinationSlug: string): Promise<Stay[]> {
  return await findStaysByDestination(destinationSlug);
}

