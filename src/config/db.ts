import mongoose from 'mongoose';

/**
 * Connect to MongoDB using the MONGO_URI env variable.
 * Exits the process on failure so the server never starts in a broken state.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌  MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', (err as Error).message);
    process.exit(1);
  }
}
