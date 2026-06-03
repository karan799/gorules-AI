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

  let message = err instanceof Error ? err.message : 'Internal server error';
  let status = message.includes('not found') ? 404 : 500;

  try {
    const parsed = JSON.parse(message) as { type?: string; source?: string };
    if (parsed.source) {
      message = parsed.source;
      status = 400;
    }
  } catch {
    /* not JSON — use raw message */
  }

  console.error('[api]', err);
  res.status(status).json({ error: message });
}
