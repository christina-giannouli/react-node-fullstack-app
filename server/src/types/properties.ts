import type { UUID } from 'node:crypto';
import type { z } from 'zod';
import type { propertySchema } from '../schema/properties.ts';

// z.uuid() checks the format but infers a plain string, so narrow the id to a UUID type.
export type PropertyResponse = z.infer<typeof propertySchema> & { id: UUID };
