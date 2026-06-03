import cors from 'cors';
import express from 'express';
import { corsOptions } from './config/cors.js';
import { v1Router } from './api/routes/v1/index.js';
import { errorMiddleware } from './api/middleware/error.middleware.js';

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));

  app.use('/api/v1', v1Router);
  app.use(errorMiddleware);

  return app;
}
