import { Router } from 'express';
import { simulateRouter } from './simulate.routes.js';
import { evaluateRouter } from './evaluate.routes.js';
import { validateRouter } from './validate.routes.js';

export const v1Router = Router();

v1Router.use(simulateRouter);
v1Router.use(evaluateRouter);
v1Router.use(validateRouter);

v1Router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gorules-editor-api' });
});
