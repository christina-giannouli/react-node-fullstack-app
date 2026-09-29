import type { Response } from 'express';
import type { ErrorResponse } from '../types/errors.ts';

export function handleError(
  res: Response<ErrorResponse>,
  status: number,
  message: string,
  error?: unknown
): Response<ErrorResponse> {
  const debugMessage = error instanceof Error ? error.message : null;

  return res.status(status).json({
    debugMessage,
    message,
    status,
    timestamp: new Date().toISOString(),
  });
}
