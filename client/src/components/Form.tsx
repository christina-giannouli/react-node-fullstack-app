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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { type Area, formDefaultValues, formSchema, type FormValues } from '@/schema/form';
import { ListingType } from '@/types/property.ts';
import { Input } from '@/components/ui/input.tsx';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce.ts';
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/components/reui/autocomplete.tsx';

const TITLE_MAX_LENGTH = 155;
const MIN_AREA_QUERY_LENGTH = 3;

const areaLabel = (area: Area) => `${area.mainText}, ${area.secondaryText}`;

export function Form() {
  const [query, setQuery] = useState('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);

  // Label of the area the input currently matches, so we don't search for it again.
  const selectedLabel = useRef<string | null>(null);
  const debouncedQuery = useDebounce<string>(query);

  useEffect(() => {
    // Don't fetch if the query is too short.'
    if (debouncedQuery.trim().length < MIN_AREA_QUERY_LENGTH) return;

    // If the user has selected an area, don't query it again.
    if (debouncedQuery === selectedLabel.current) return;

    let cancelledRequest = false;
    setLoading(true);

    fetch(`/api/areas?input=${encodeURIComponent(debouncedQuery)}`)
      .then(async (res) => {
        if (!res.ok) {
          // Ignore the error so we can throw it and safely catch it later.
          const error = await res.json().catch(() => null);
          throw new Error(error?.message || 'Failed to fetch areas');
        }

        return res.json();
      })
      .then((data: Area[]) => {
        if (!cancelledRequest) setAreas(data);
      })
      .catch((err: Error) => {
        console.error(err);
        setAreas([]);
      })
      .finally(() => {
        if (!cancelledRequest) setLoading(false);
      });

    // Cancel the request if the component is unmounted
    // or the query changes, to avoid race conditions
    return () => {
      cancelledRequest = true;
    };
  }, [debouncedQuery]);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const handleValueChange = (value: string, onChange: (area: Area | undefined) => void) => {
    // The value is only a valid area when the text matches a suggestion.
    const area = areas.find((area) => areaLabel(area) === value);

    selectedLabel.current = area ? value : null;
    setQuery(value);

    if (value.trim().length < MIN_AREA_QUERY_LENGTH) setAreas([]);
    onChange(area);
  };

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (price: number | undefined) => void
  ) => {
    // Keep digits only, so the price is always a whole number.
    const digits = e.target.value.replace(/\D/g, '');
    onChange(digits === '' ? undefined : Number(digits));
  };

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">New property classified</CardTitle>
      </CardHeader>
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
                      showTrigger
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
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setQuery('');
              setAreas([]);
            }}
          >
            Reset
          </Button>
          {/* Submit button*/}
          <Button type="submit" form="xe_property_classification">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
