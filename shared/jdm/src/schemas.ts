import { z } from 'zod';

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const edgeSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  type: z.string().optional(),
});

export const nodeSchema = z.object({
  id: z.string(),
  type: z.enum([
    'inputNode',
    'outputNode',
    'decisionTableNode',
    'expressionNode',
    'functionNode',
    'switchNode',
    'decisionNode',
  ]),
  name: z.string(),
  position: positionSchema,
  content: z.record(z.unknown()).optional(),
});

export const decisionGraphSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  metadata: z.record(z.unknown()).optional(),
});

export const simulateRequestSchema = z.object({
  content: decisionGraphSchema,
  context: z.record(z.unknown()).default({}),
});

export const evaluateRequestSchema = simulateRequestSchema;
