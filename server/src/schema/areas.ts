import { z } from 'zod';

export const areaSchema = z.object({
  placeId: z.string().min(1),
  mainText:z.string(),
  secondaryText:z.string(),
})

export const areasResponseSchema = z.array(areaSchema);
