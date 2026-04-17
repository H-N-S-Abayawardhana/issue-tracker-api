import { Response } from 'express';

export function sendSuccess(
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200
): Response {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors: unknown = null
): Response {
  const body: Record<string, unknown> = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}
