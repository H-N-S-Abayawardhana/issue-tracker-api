import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

// Must have 4 parameters — Express recognises it as an error handler
export function errorHandler(
  err:  AppError,
  _req: Request,
  res:  Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  console.error('[Error]', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}
