import type { z } from 'zod';
import type { areaSchema } from '../schema/areas.ts';

export interface AreasQuery {
  input?: string;
}

export type AreaResponse = z.infer<typeof areaSchema>;

