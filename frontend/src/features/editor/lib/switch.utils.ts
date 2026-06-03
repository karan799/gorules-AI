import { createId } from '@gorules-editor/shared-jdm';
import type { SwitchCondition, SwitchContent } from '@gorules-editor/shared-jdm';

export function normalizeSwitchContent(raw: unknown): SwitchContent {
  const c = (raw ?? {}) as Partial<SwitchContent>;
  return {
    hitPolicy: c.hitPolicy ?? 'first',
    conditions: Array.isArray(c.conditions) ? c.conditions : [],
  };
}

export function addCondition(content: SwitchContent): SwitchContent {
  const condition: SwitchCondition = { id: createId(), condition: '', field: '' };
  return { conditions: [...content.conditions, condition] };
}

export function removeCondition(content: SwitchContent, id: string): SwitchContent {
  return { conditions: content.conditions.filter((c) => c.id !== id) };
}

export function updateCondition(
  content: SwitchContent,
  id: string,
  patch: Partial<SwitchCondition>,
): SwitchContent {
  return {
    conditions: content.conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  };
}
