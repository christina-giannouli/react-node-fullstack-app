import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { type Area, formDefaultValues, formSchema, type FormValues } from '@/schema/form';
import { ListingType } from '@/types/property.ts';
import { Input } from '@/components/ui/input.tsx';
import { type ChangeEvent } from 'react';
import { areaLabel, useAreaSearch } from '@/hooks/useAreaSearch.ts';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/components/reui/autocomplete.tsx';
import { saveProperty } from '@/api/properties.ts';
import { toast } from 'sonner';

const TITLE_MAX_LENGTH = 155;

interface FormProps {
  onViewListings?: () => void;
}

export function Form({ onViewListings }: FormProps) {
  const { query, areas, loading, updateQuery, reset: resetAreaSearch } = useAreaSearch();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const handleValueChange = (value: string, onChange: (area: Area | undefined) => void) => {
    onChange(updateQuery(value));
  };

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (price: number | undefined) => void
  ) => {
    // Keep digits only, so the price is always a whole number.
    const digits = e.target.value.replace(/\D/g, '');
    onChange(digits === '' ? undefined : Number(digits));
  };

  const handleReset = () => {
    reset();
    resetAreaSearch();
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      const property = await saveProperty(data);
      toast.success(`"${property.title}" successfully saved.`, {
        action: onViewListings && { label: 'See your listings', onClick: onViewListings },
      });
      handleReset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save property');
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardContent>
        <form id="xe_property_classification" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Property Title */}
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property_title">Title*</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="property_title"
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="Classified title up to 155 chars"
                      autoComplete="off"
                    ></InputGroupInput>
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/{TITLE_MAX_LENGTH} characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Listing Type */}
            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="listing_type">Type*</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      ref={field.ref}
                      id="listing_type"
                      className="w-[180px]"
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(ListingType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Location */}
            <Controller
              name="area"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property_area">Area*</FieldLabel>
                  <Autocomplete
                    name={field.name}
                    items={areas}
                    itemToStringValue={areaLabel}
                    filter={null}
                    value={query}
                    onValueChange={(value) => handleValueChange(value, field.onChange)}
                  >
                    <AutocompleteInput
                      ref={field.ref}
                      id="property_area"
                      placeholder="Type in the property's area"
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      showClear
                    />
                    <AutocompleteContent>
                      <AutocompleteEmpty>
                        {loading ? 'Searching...' : 'No areas found'}
                      </AutocompleteEmpty>

                      <AutocompleteList>
                        {(area: Area) => (
                          <AutocompleteItem key={area.placeId} value={area}>
                            {area.mainText},{' '}
                            <span className="text-muted-foreground text-xs">
                              {area.secondaryText}
                            </span>
                          </AutocompleteItem>
                        )}
                      </AutocompleteList>
                    </AutocompleteContent>
                  </Autocomplete>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Price */}
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property_price">Price in euros*</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => handlePriceChange(e, field.onChange)}
                    id="property_price"
                    aria-invalid={fieldState.invalid}
                    placeholder="Amount"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="property_description">Extra description</FieldLabel>
                  <Textarea
                    {...field}
                    id="property_description"
                    placeholder="Type here..."
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          {/* Reset button*/}
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          {/* Submit button*/}
          <Button type="submit" form="xe_property_classification" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
