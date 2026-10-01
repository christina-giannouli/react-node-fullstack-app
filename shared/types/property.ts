// Types shared by the client and the server.
// This file must not import any package: it lives outside both projects' node_modules.

export const ListingType = {
  rent: 'Rent',
  buy: 'Buy',
  exchange: 'Exchange',
  donation: 'Donation',
} as const;

// Union type for listing type: 'Rent' | 'Buy' | 'Exchange' | 'Donation'
export type ListingType = (typeof ListingType)[keyof typeof ListingType];

// An area suggestion from the areas API.
export interface Area {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

// What the client sends when creating a property.
export interface PropertyInput {
  title: string;
  type: ListingType;
  area: Area;
  price: number;
  description?: string;
}

// The stored property
export interface Property extends PropertyInput {
  id: string;
  createdAt: string;
}
