import { ensureZenWasmLoaded } from './zenWasm';

export type ExpressionMode = 'expression' | 'unary' | 'template';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export async function validateZenExpression(
  expression: string,
  mode: ExpressionMode = 'expression',
): Promise<ValidationResult> {
  if (!expression.trim()) return { valid: true };

  try {
    await ensureZenWasmLoaded();
    const wasm = await import('@gorules/zen-engine-wasm');

    let result: unknown;
    if (mode === 'unary') {
      result = wasm.validateUnaryExpression(expression);
    } else if (mode === 'template') {
      try {
        wasm.renderTemplate(expression, {});
        return { valid: true };
      } catch (e) {
        return { valid: false, message: e instanceof Error ? e.message : 'Invalid template' };
      }
    } else {
      result = wasm.validateExpression(expression);
    }

    if (result === null || result === undefined) return { valid: true };
    if (typeof result === 'boolean') return { valid: result };
    if (typeof result === 'string') return result ? { valid: false, message: result } : { valid: true };
    if (typeof result === 'object' && result !== null) {
      const r = result as Record<string, unknown>;
      if (r.valid === false || r.error) {
        return { valid: false, message: String(r.message ?? r.error) };
      }
    }
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      message: err instanceof Error ? err.message : 'Validation failed',
    };
  }
}
