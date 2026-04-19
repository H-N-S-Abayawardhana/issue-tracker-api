import 'dotenv/config';

const REQUIRED: readonly string[] = ['MONGO_URI', 'JWT_SECRET'];

for (const key of REQUIRED) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  PORT: process.env['PORT'] ?? '5000',
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  MONGO_URI: process.env['MONGO_URI']!,
  JWT_SECRET: process.env['JWT_SECRET']!,
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] ?? '7d',
  FRONTEND_URLS: (process.env['FRONTEND_URL'] ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
} as const;
