import { z } from 'zod';
import { areaSchema } from './areas.ts';

// TODO: Move those to a shared package. So client and server can share the same schemas.

// Keep in sync with ListingType in the client.
export const ListingType = {
  rent: 'Rent',
  buy: 'Buy',
  exchange: 'Exchange',
  donation: 'Donation',
} as const;

// What the client sends when creating a property. Same rules as the client's form schema.
export const propertyInputSchema = z.object({
  title: z.string().trim().min(1).max(155),
  type: z.enum(ListingType),
  area: areaSchema,
  price: z.int().positive(),
  description: z.string().optional(),
});

// A stored property: the input plus the fields the server creates.
export const propertySchema = propertyInputSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
});
