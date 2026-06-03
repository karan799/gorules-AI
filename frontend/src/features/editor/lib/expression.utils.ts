import { createId } from '@gorules-editor/shared-jdm';
import type { ExpressionContent, ExpressionEntry } from '@gorules-editor/shared-jdm';

export function normalizeExpressionContent(raw: unknown): ExpressionContent {
  const c = (raw ?? {}) as Partial<ExpressionContent>;
  return {
    expressions: Array.isArray(c.expressions) ? c.expressions : [],
  };
}

export function addExpression(content: ExpressionContent): ExpressionContent {
  const entry: ExpressionEntry = { id: createId(), key: '', value: '' };
  return { expressions: [...content.expressions, entry] };
}

export function removeExpression(content: ExpressionContent, id: string): ExpressionContent {
  return { expressions: content.expressions.filter((e) => e.id !== id) };
}

export function updateExpression(
  content: ExpressionContent,
  id: string,
  patch: Partial<ExpressionEntry>,
): ExpressionContent {
  return {
    expressions: content.expressions.map((e) => (e.id === id ? { ...e, ...patch } : e)),
  };
}

export function reorderExpressions(
  content: ExpressionContent,
  fromIndex: number,
  toIndex: number,
): ExpressionContent {
  const expressions = [...content.expressions];
  const [item] = expressions.splice(fromIndex, 1);
  expressions.splice(toIndex, 0, item);
  return { expressions };
}
