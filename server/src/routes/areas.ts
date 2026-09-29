import { Router, type Request, type Response } from 'express';
import { areasResponseSchema } from '../schema/areas.ts';
import type { AreaResponse, AreasQuery } from '../types/areas.ts';
import type { ErrorResponse } from '../types/errors.ts';
import { handleError } from '../utils/handleError.ts';

const router = Router();

router.get(
  '/',
  async (
    req: Request<{}, AreaResponse[] | ErrorResponse, {}, AreasQuery>,
    res: Response<AreaResponse[] | ErrorResponse>
  ) => {
    const query = req.query.input;

    // If the query is not a string or is too small,
    // return an empty array to avoid unnecessary API calls.
    if (typeof query !== 'string' || query.trim().length < 3) return res.json([]);

    try {
      const url = `${process.env.API_URL}?input=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        return handleError(res, response.status, 'Failed to fetch areas.');
      }

      const data = areasResponseSchema.parse(await response.json());
      return res.json(data);
    } catch (error: unknown) {
      return handleError(res, 500, 'An error occurred while fetching areas.', error);
    }
  }
);

export default router;
