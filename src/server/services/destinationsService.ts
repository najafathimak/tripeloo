import type { Destination } from '@/types/destination';
import { findAllDestinations } from '@/server/repositories/destinationsRepository';

export async function listDestinations(): Promise<Destination[]> {
  return await findAllDestinations();
}


