import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { propertyInputSchema } from '../schema/properties.ts';
import { addProperty, getProperties } from '../db/localDb.ts';
import type { ErrorResponse } from '../types/errors.ts';
import type { PropertyResponse } from '../types/properties.ts';
import { handleError } from '../utils/handleError.ts';

const router = Router();

router.post(
  '/',
  (
    req: Request<{}, PropertyResponse | ErrorResponse, unknown>,
    res: Response<PropertyResponse | ErrorResponse>
  ) => {
    // Runtime validation of the property input.
    const result = propertyInputSchema.safeParse(req.body);

    if (!result.success) {
      return handleError(res, 400, 'Invalid property.', result.error);
    }

    try {
      // This is where we would actually save the property to a database.
      const property = addProperty({
        ...result.data,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      });
      return res.status(201).json(property);
    } catch (error: unknown) {
      return handleError(res, 500, 'An error occurred while creating the property.', error);
    }
  }
);

router.get('/', (_req: Request, res: Response<PropertyResponse[] | ErrorResponse>) => {
  try {
    return res.json(getProperties());
  } catch (error: unknown) {
    return handleError(res, 500, 'An error occurred while fetching properties.', error);
  }
});

export default router;
