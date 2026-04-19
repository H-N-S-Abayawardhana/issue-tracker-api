import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { sendSuccess } from '../utils/response';

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.find().select('name email').sort({ name: 1 }).lean();
    const mapped = users.map((u) => ({
      id: (u._id as { toString(): string }).toString(),
      name: u.name,
      email: u.email,
    }));
    sendSuccess(res, { users: mapped });
  } catch (err) {
    next(err);
  }
}
