import type { PropertyResponse } from '../types/properties.ts';

// Sample listings, so the properties page isn't empty after a restart.
// The placeIds are placeholders, not real ids from the areas API.
const properties: PropertyResponse[] = [
  {
    id: '3f2b8c1e-5d4a-4e7b-9a6c-1d2e3f4a5b6c',
    title: 'Sunny 2-bedroom apartment near the Acropolis',
    type: 'Rent',
    area: { placeId: 'sample-place-1', mainText: 'Koukaki', secondaryText: 'Athens, Greece' },
    price: 950,
    description: 'Renovated in 2023, balcony with a view of the Acropolis.',
    createdAt: '2026-09-20T09:15:00.000Z',
  },
  {
    id: '8a7c6b5d-4e3f-4a2b-8c1d-0e9f8a7b6c5d',
    title: 'Seaside house with private garden',
    type: 'Buy',
    area: { placeId: 'sample-place-2', mainText: 'Peraia', secondaryText: 'Thessaloniki, Greece' },
    price: 285000,
    description: 'Three bedrooms, private garden, 100 m from the beach.',
    createdAt: '2026-09-24T16:40:00.000Z',
  },
  {
    id: 'c4d5e6f7-a8b9-4c0d-9e1f-2a3b4c5d6e7f',
    title: 'Stone cottage at Mount Olympus',
    type: 'Exchange',
    area: { placeId: 'sample-place-3', mainText: 'Litochoro', secondaryText: 'Pieria, Greece' },
    price: 120000,
    createdAt: '2026-09-28T11:05:00.000Z',
  },
];

export function addProperty(property: PropertyResponse): PropertyResponse {
  properties.push(property);
  return property;
}

export function getProperties(): PropertyResponse[] {
  return properties;
}
