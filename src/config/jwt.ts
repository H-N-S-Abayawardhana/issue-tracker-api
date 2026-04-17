import jwt from 'jsonwebtoken';

const SECRET     = process.env.JWT_SECRET     || 'changeme';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  id:    string;
  email: string;
  name:  string;
}

export function signToken(payload: JwtPayload): string {
  // Cast expiresIn to any to satisfy the overloaded jwt.sign typings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as any);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
