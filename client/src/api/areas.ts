import type { Area } from '@/schema/form';

export async function getAreas(query: string, signal?: AbortSignal): Promise<Area[]> {
  const res = await fetch(`/api/areas?input=${encodeURIComponent(query)}`, { signal });

  if (!res.ok) {
    // Throw a generic error if the response is not JSON
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Failed to fetch areas');
  }

  return res.json();
}
