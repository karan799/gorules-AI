import { createId } from '@gorules-editor/shared-jdm';
import type {
  DecisionTableColumn,
  DecisionTableContent,
} from '@gorules-editor/shared-jdm';

export function normalizeTableContent(raw: unknown): DecisionTableContent {
  const c = (raw ?? {}) as Partial<DecisionTableContent>;
  return {
    hitPolicy: c.hitPolicy === 'collect' ? 'collect' : 'first',
    inputs: Array.isArray(c.inputs) ? c.inputs : [],
    outputs: Array.isArray(c.outputs) ? c.outputs : [],
    rules: Array.isArray(c.rules) ? c.rules : [],
    passThrough: c.passThrough ?? true,
    inputField: c.inputField ?? null,
    outputPath: c.outputPath ?? null,
    executionMode: c.executionMode ?? 'single',
  };
}

export function addInputColumn(content: DecisionTableContent): DecisionTableContent {
  const col: DecisionTableColumn = {
    id: createId(),
    name: 'Input',
    field: 'field',
  };
  return { ...content, inputs: [...content.inputs, col] };
}

export function addOutputColumn(content: DecisionTableContent): DecisionTableContent {
  const col: DecisionTableColumn = {
    id: createId(),
    name: 'Output',
    field: 'output',
  };
  return { ...content, outputs: [...content.outputs, col] };
}

export function removeColumn(
  content: DecisionTableContent,
  columnId: string,
): DecisionTableContent {
  const inputs = content.inputs.filter((c) => c.id !== columnId);
  const outputs = content.outputs.filter((c) => c.id !== columnId);
  const rules = content.rules.map((rule) => {
    const next = { ...rule };
    delete next[columnId];
    return next;
  });
  return { ...content, inputs, outputs, rules };
}

export function updateColumn(
  content: DecisionTableContent,
  columnId: string,
  patch: Partial<DecisionTableColumn>,
): DecisionTableContent {
  const mapCol = (cols: DecisionTableColumn[]) =>
    cols.map((c) => (c.id === columnId ? { ...c, ...patch } : c));
  return {
    ...content,
    inputs: mapCol(content.inputs),
    outputs: mapCol(content.outputs),
  };
}

export function addRule(content: DecisionTableContent): DecisionTableContent {
  const rule: Record<string, string> & { _id: string } = { _id: createId() };
  for (const col of [...content.inputs, ...content.outputs]) {
    rule[col.id] = '';
  }
  return { ...content, rules: [...content.rules, rule] };
}

export function removeRule(content: DecisionTableContent, ruleId: string): DecisionTableContent {
  return {
    ...content,
    rules: content.rules.filter((r) => r._id !== ruleId),
  };
}

export function updateRuleCell(
  content: DecisionTableContent,
  ruleId: string,
  columnId: string,
  value: string,
): DecisionTableContent {
  return {
    ...content,
    rules: content.rules.map((r) =>
      r._id === ruleId ? { ...r, [columnId]: value } : r,
    ),
  };
}

export function reorderInputColumns(
  content: DecisionTableContent,
  fromIndex: number,
  toIndex: number,
): DecisionTableContent {
  const inputs = [...content.inputs];
  const [item] = inputs.splice(fromIndex, 1);
  inputs.splice(toIndex, 0, item);
  return { ...content, inputs };
}

export function reorderOutputColumns(
  content: DecisionTableContent,
  fromIndex: number,
  toIndex: number,
): DecisionTableContent {
  const outputs = [...content.outputs];
  const [item] = outputs.splice(fromIndex, 1);
  outputs.splice(toIndex, 0, item);
  return { ...content, outputs };
}

export function reorderRules(
  content: DecisionTableContent,
  fromIndex: number,
  toIndex: number,
): DecisionTableContent {
  const rules = [...content.rules];
  const [item] = rules.splice(fromIndex, 1);
  rules.splice(toIndex, 0, item);
  return { ...content, rules };
}

export function updateRuleDescription(
  content: DecisionTableContent,
  ruleId: string,
  description: string,
): DecisionTableContent {
  return {
    ...content,
    rules: content.rules.map((r) =>
      r._id === ruleId ? { ...r, _description: description } : r,
    ),
  };
}
