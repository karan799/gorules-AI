import { Router } from 'express';
import { evaluateRequestSchema } from '@gorules-editor/shared-jdm';
import { createDecisionFromGraph } from '../../../core/services/zen-engine.service.js';

export const evaluateRouter = Router();

evaluateRouter.post('/evaluate', async (req, res, next) => {
  try {
    const { content, context } = evaluateRequestSchema.parse(req.body);
    const decision = createDecisionFromGraph(content);
    const response = await decision.evaluate(context);
    res.json(response);
  } catch (err) {
    next(err);
  }
});
