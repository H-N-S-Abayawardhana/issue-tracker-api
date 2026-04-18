import bcrypt      from 'bcryptjs';
import { User }    from '../models/user.model';
import { signToken } from '../config/jwt';

interface RegisterInput { name: string; email: string; password: string; }
interface LoginInput    { email: string; password: string; }

export async function registerUser({ name, email, password }: RegisterInput) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = Object.assign(new Error('An account with this email already exists.'), { statusCode: 409 });
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const doc = await User.create({ name, email, password_hash });

  const user  = { id: doc._id.toString(), name: doc.name, email: doc.email };
  const token = signToken({ id: user.id, email: user.email, name: user.name });

  return { user, token };
}

export async function loginUser({ email, password }: LoginInput) {
  const doc = await User.findOne({ email }).select('+password_hash');
  if (!doc) {
    throw Object.assign(new Error('Invalid email or password.'), { statusCode: 401 });
  }

  const isMatch = await bcrypt.compare(password, doc.password_hash);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password.'), { statusCode: 401 });
  }

  const user  = { id: doc._id.toString(), name: doc.name, email: doc.email };
  const token = signToken({ id: user.id, email: user.email, name: user.name });

  return { user, token };
}

export async function getUserById(id: string) {
  const doc = await User.findById(id).select('-password_hash');
  if (!doc) {
    throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  }
  return doc.toJSON();
}
