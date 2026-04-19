import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function start(): Promise<void> {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start();
