import { Router } from 'express';
import { simulateRequestSchema } from '@gorules-editor/shared-jdm';
import { createDecisionFromGraph } from '../../../core/services/zen-engine.service.js';

export const simulateRouter = Router();

simulateRouter.post('/simulate', async (req, res, next) => {
  try {
    const { content, context } = simulateRequestSchema.parse(req.body);
    const decision = createDecisionFromGraph(content);
    const response = await decision.evaluate(context, { trace: true });
    res.json(response);
  } catch (err) {
    next(err);
  }
});
