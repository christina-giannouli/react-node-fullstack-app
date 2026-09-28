import { Router, type Request, type Response } from 'express';
import { areasResponseSchema } from '../schema/areas.ts';
import type { AreaResponse, AreasQuery, ErrorResponse } from '../types/areas.ts';

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
        const errorData = (await response.json()) as ErrorResponse;
        return res.status(errorData.status).json(errorData);
      }

      const data = areasResponseSchema.parse(await response.json());
      res.json(data);
    } catch (error) {
      const err = {
        debugMessage: error instanceof Error ? error.message : null,
        message: 'An error occurred while fetching areas.',
        status: 500,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(err);
    }
  }
);

export default router;
