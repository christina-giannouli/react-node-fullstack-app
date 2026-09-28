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
import { formDefaultValues, formSchema, type FormValues } from '@/schema/form';
import { ListingType } from '@/types/property.ts';
import { Input } from '@/components/ui/input.tsx';

const TITLE_MAX_LENGTH = 155;

export function Form() {
  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

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
                  <Input
                    {...field}
                    id="property_area"
                    aria-invalid={fieldState.invalid}
                    type="search"
                    placeholder="Type in the property's area"
                    autoComplete="off"
                    onChange={(e) => {
                      console.log(e.target.value);
                      field.onChange(e);
                    }}
                  />
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
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      field.onChange(digits === '' ? undefined : Number(digits));
                    }}
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
          <Button type="button" variant="outline" onClick={() => reset()}>
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
