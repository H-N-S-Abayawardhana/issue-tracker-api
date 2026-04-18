import 'dotenv/config';
import express       from 'express';
import cors          from 'cors';
import routes        from './routes/index';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://issuetrackapp.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

app.use(errorHandler);

export default app;
