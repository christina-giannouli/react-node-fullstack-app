import type { FormValues } from '@/schema/form.ts';

export const ListingType = {
  rent: 'Rent',
  buy: 'Buy',
  exchange: 'Exchange',
  donation: 'Donation',
} as const;

// Union type for listing type
export type ListingType = (typeof ListingType)[keyof typeof ListingType];

export const PropertyType = {
  apartment: 'Apartment',
  house: 'House',
  villa: 'Villa',
  land: 'Land',
  officeSpace: 'Office Space',
  warehouse: 'Warehouse',
  parkingLot: 'Parking Lot',
  garageSpace: 'Garage Space',
  storage: 'Storage',
} as const;

// Union type for property type
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export type Property = FormValues & {
  id: string;
};
