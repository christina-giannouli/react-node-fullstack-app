import type { FormValues } from '@/schema/form';
import type { Property } from '@/types/property.ts';

export async function getProperties(signal?: AbortSignal): Promise<Property[]> {
  const res = await fetch('/api/properties', { signal });

  if (!res.ok) {
    // Throw a generic error if the response is not JSON
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Failed to fetch properties');
  }

  return res.json();
}

export async function saveProperty(property: FormValues): Promise<Property> {
  const res = await fetch('/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(property),
  });

  if (!res.ok) {
    // Throw a generic error if the response is not JSON
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Failed to save property');
  }

  return res.json();
}
