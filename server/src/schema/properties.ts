import { z } from 'zod';
import { ListingType, type PropertyInput } from 'shared/types/property.ts';
import { areaSchema } from './areas.ts';

// What the client sends when creating a property. Same rules as the client's form schema.
export const propertyInputSchema = z.object({
  title: z.string().trim().min(1).max(155),
  type: z.enum(ListingType),
  area: areaSchema,
  price: z.int().positive(),
  description: z.string().optional(),
  // Type error here if the rules stop matching the shared PropertyInput type.
}) satisfies z.ZodType<PropertyInput>;

// A stored property: the input plus the fields the server creates.
export const propertySchema = propertyInputSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
});
