import type { UUID } from 'node:crypto';
import type { Property } from 'shared/types/property.ts';

// The server always creates the id with randomUUID(), so narrow it to a UUID type.
export type PropertyResponse = Property & { id: UUID };
