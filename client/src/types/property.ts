import type { FormValues } from '@/schema/form.ts';

export const ListingType = {
  rent: 'Rent',
  buy: 'Buy',
  exchange: 'Exchange',
  donation: 'Donation',
} as const;

export type Property = FormValues & {
  id: string;
  createdAt: string;
};
