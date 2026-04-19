import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

// Must have 4 parameters
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;

  console.error('[Error]', err);

  const isOperational = statusCode < 500;
  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Internal server error',
  });
}
