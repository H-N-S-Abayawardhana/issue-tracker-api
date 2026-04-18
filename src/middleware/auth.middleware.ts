import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload }         from '../config/jwt';
import { sendError }                        from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authentication required. Please log in.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (err: unknown) {
    const isExpired = (err as Error).name === 'TokenExpiredError';
    sendError(res, isExpired ? 'Session expired. Please log in again.' : 'Invalid token.', 401);
  }
}
