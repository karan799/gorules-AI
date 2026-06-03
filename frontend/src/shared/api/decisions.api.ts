import type { DecisionGraph } from '@gorules-editor/shared-jdm';
import { graphToJdmPayload } from '@gorules-editor/shared-jdm';

const API_BASE = '/api/v1';

export async function simulateGraph(
  graph: DecisionGraph,
  context: Record<string, unknown>,
): Promise<unknown> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: graphToJdmPayload(graph), context }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Simulation failed');
  }

  return res.json();
}

export async function validateGraph(graph: DecisionGraph): Promise<{ valid: boolean }> {
  const res = await fetch(`${API_BASE}/validate/graph`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: graphToJdmPayload(graph) }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Validation failed');
  }

  return res.json();
}
