import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.flatten(),
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  const status = message.includes('not found') ? 404 : 500;

  console.error('[api]', err);
  res.status(status).json({ error: message });
}
