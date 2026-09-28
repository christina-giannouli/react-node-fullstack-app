import * as z from 'zod';
import type { DefaultValues } from 'react-hook-form';
import { ListingType } from '@/types/property.ts';

export const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Property title is required.')
    .max(155, 'Property title must be at most 155 characters.'),
  type: z.enum(ListingType, { error: 'Property listing type is required.' }),
  area: z.string().min(1, { error: 'Property area is required.' }),
  price: z
    .int({ error: 'Property price is required.' })
    .positive('Property price must be greater than 0.'),
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const formDefaultValues: DefaultValues<FormValues> = {
  title: '',
  type: undefined,
  area: '',
  price: undefined,
  description: '',
};
