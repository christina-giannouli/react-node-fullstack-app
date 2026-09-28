import * as z from 'zod';
import type { DefaultValues } from 'react-hook-form';
import { ListingType } from '@/types/property.ts';

export const areaSchema = z.object(
  {
    placeId: z.string(),
    mainText: z.string(),
    secondaryText: z.string(),
  },
  { error: 'Property area is required.' }
);

export type Area = z.infer<typeof areaSchema>;

export const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Property title is required.')
    .max(155, 'Property title must be at most 155 characters.'),
  type: z.enum(ListingType, { error: 'Property listing type is required.' }),
  area: areaSchema,
  price: z
    .int({ error: 'Property price is required.' })
    .positive('Property price must be greater than 0.'),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const formDefaultValues: DefaultValues<FormValues> = {
  title: '',
  type: undefined,
  area: undefined,
  price: undefined,
  description: '',
};
