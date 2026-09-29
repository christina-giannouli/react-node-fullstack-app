import { describe, it, expect } from 'vitest';
import { formDefaultValues, formSchema, type FormValues } from '@/schema/form.ts';
import { ListingType } from '@/types/property.ts';

// Returns the validation message for one field, or undefined if that field is valid.
// (error.message is a JSON dump of all issues, so we read the field's issue instead.)
const fieldError = (values: unknown, field: keyof FormValues) =>
  formSchema.safeParse(values).error?.issues.find((issue) => issue.path[0] === field)?.message;

describe('Form Schema', () => {
  const validFormValues: FormValues = {
    title: 'Mount Olympus villa',
    type: 'Rent',
    area: {
      placeId: '123',
      mainText: 'Mount Olympus',
      secondaryText: 'Greece',
    },
    price: 800,
    description: '',
  };

  it('should validate the form values', () => {
    const parsedFormValues = formSchema.safeParse(validFormValues);

    expect(parsedFormValues.success).toBe(true);
    expect(parsedFormValues.data).toEqual(validFormValues);
  });

  it('should reject the default values of an untouched form', () => {
    expect(formSchema.safeParse(formDefaultValues).success).toBe(false);
  });

  describe('title', () => {
    it('should show an error message if the title is empty', () => {
      expect(fieldError({ ...validFormValues, title: '' }, 'title')).toBe(
        'Property title is required.'
      );
    });

    it('should show an error message if the title only has spaces', () => {
      expect(fieldError({ ...validFormValues, title: '   ' }, 'title')).toBe(
        'Property title is required.'
      );
    });

    it('should show an error message if the title is longer than 155 characters', () => {
      expect(fieldError({ ...validFormValues, title: 'a'.repeat(156) }, 'title')).toBe(
        'Property title must be at most 155 characters.'
      );
    });

    it('should trim the title', () => {
      const parsedFormValues = formSchema.safeParse({ ...validFormValues, title: '  Villa  ' });

      expect(parsedFormValues.data?.title).toBe('Villa');
    });
  });

  describe('type', () => {
    it.each(Object.values(ListingType))('should accept the %s listing type', (type) => {
      expect(fieldError({ ...validFormValues, type }, 'type')).toBeUndefined();
    });

    it.each([
      ['an unknown type', 'Sell'],
      ['a missing type', undefined],
    ])('should show an error message for %s', (_, type) => {
      expect(fieldError({ ...validFormValues, type }, 'type')).toBe(
        'Property listing type is required.'
      );
    });
  });

  describe('area', () => {
    it.each([
      ['a missing area', undefined],
      ['free text instead of a selected suggestion', 'Mount Olympus, Greece'],
    ])('should show an error message for %s', (_, area) => {
      expect(fieldError({ ...validFormValues, area }, 'area')).toBe('Property area is required.');
    });

    it('should reject an area without a placeId', () => {
      const area = { mainText: 'Mount Olympus', secondaryText: 'Greece' };

      expect(fieldError({ ...validFormValues, area }, 'area')).toBeDefined();
    });
  });

  describe('price', () => {
    it('should show an error message if the price is missing', () => {
      expect(fieldError({ ...validFormValues, price: undefined }, 'price')).toBe(
        'Property price is required.'
      );
    });

    it.each([0, -100])('should show an error message if the price is negative', (price) => {
      expect(fieldError({ ...validFormValues, price }, 'price')).toBe(
        'Property price must be greater than 0.'
      );
    });

    it('should show an error message if the price is a decimal', () => {
      expect(fieldError({ ...validFormValues, price: 1.5 }, 'price')).toBe(
        'Property price must be a whole number.'
      );
    });
  });

  describe('description', () => {
    it('should accept a missing description', () => {
      expect(
        fieldError({ ...validFormValues, description: undefined }, 'description')
      ).toBeUndefined();
    });

    it('should accept any text as a description', () => {
      expect(
        fieldError(
          { ...validFormValues, description: 'Sea view, renovated in 2024.' },
          'description'
        )
      ).toBeUndefined();
    });
  });
});
