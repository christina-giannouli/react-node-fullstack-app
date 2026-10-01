import { z } from 'zod';
import type { Area } from 'shared/types/property.ts';

export const areaSchema = z.object({
  placeId: z.string().min(1),
  mainText: z.string(),
  secondaryText: z.string(),
}) satisfies z.ZodType<Area>;

export const areasResponseSchema = z.array(areaSchema);
