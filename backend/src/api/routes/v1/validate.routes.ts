import { Router } from 'express';
import { decisionGraphSchema } from '@gorules-editor/shared-jdm';
import { createDecisionFromGraph } from '../../../core/services/zen-engine.service.js';

export const validateRouter = Router();

validateRouter.post('/validate/graph', async (req, res, next) => {
  try {
    const content = decisionGraphSchema.parse(req.body.content ?? req.body);
    createDecisionFromGraph(content);
    res.json({ valid: true });
  } catch (err) {
    next(err);
  }
});
