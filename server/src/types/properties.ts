import type { UUID } from 'node:crypto';
import type { z } from 'zod';
import type {
  ListingType as ListingTypes,
  propertyInputSchema,
  propertySchema,
} from '../schema/properties.ts';

// Union type for listing type, same as the client's ListingType
export type ListingType = (typeof ListingTypes)[keyof typeof ListingTypes];

export type PropertyInput = z.infer<typeof propertyInputSchema>;

// z.uuid() checks the format but infers a plain string, so narrow the id to a UUID type.
export type PropertyResponse = z.infer<typeof propertySchema> & { id: UUID };
