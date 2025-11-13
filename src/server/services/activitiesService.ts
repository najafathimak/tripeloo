import type { Activity } from '@/components/stay-listings/DestinationData';
import { findActivitiesByDestination } from '@/server/repositories/activitiesRepository';

export async function listActivitiesByDestination(destinationSlug: string): Promise<Activity[]> {
  return await findActivitiesByDestination(destinationSlug);
}

