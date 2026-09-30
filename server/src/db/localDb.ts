import type { PropertyResponse } from '../types/properties.ts';

const properties: PropertyResponse[] = [];

export function addProperty(property: PropertyResponse): PropertyResponse {
  properties.push(property);
  return property;
}

export function getProperties(): PropertyResponse[] {
  return properties;
}
