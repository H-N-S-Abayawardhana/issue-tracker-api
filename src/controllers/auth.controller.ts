import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain }           from 'express-validator';
import * as authService                    from '../services/auth.service';
import { sendSuccess }                     from '../utils/response';


export const registerRules: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

export const loginRules: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user, token } = await authService.registerUser(req.body);
    sendSuccess(res, { user, token }, 'Account created successfully.', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { user, token } = await authService.loginUser(req.body);
    sendSuccess(res, { user, token }, 'Logged in successfully.');
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getUserById(req.user!.id);
    sendSuccess(res, { user });
  } catch (err) {
    next(err);
  }
}
