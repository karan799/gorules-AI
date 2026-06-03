export interface NodeTraceEntry {
  nodeId: string;
  name?: string;
  input?: unknown;
  output?: unknown;
  performance?: unknown;
  traceData?: Record<string, unknown>;
}

export function getNodeTraceEntries(trace: unknown): NodeTraceEntry[] {
  if (!trace) return [];

  const entries: NodeTraceEntry[] = [];
  const seen = new Set<string>();

  const push = (nodeId: string, data: Record<string, unknown>) => {
    if (!nodeId || seen.has(nodeId)) return;
    seen.add(nodeId);
    entries.push({
      nodeId,
      name: typeof data.name === 'string' ? data.name : undefined,
      input: data.input,
      output: data.output,
      performance: data.performance,
      traceData: (data.traceData ?? data) as Record<string, unknown>,
    });
  };

  if (Array.isArray(trace)) {
    for (const item of trace) {
      if (item && typeof item === 'object') {
        const e = item as Record<string, unknown>;
        const nodeId = resolveNodeId(e);
        if (nodeId) push(nodeId, e);
      }
    }
    return entries;
  }

  if (typeof trace !== 'object') return entries;
  const root = trace as Record<string, unknown>;

  if (Array.isArray(root.trace)) return getNodeTraceEntries(root.trace);

  if (Array.isArray(root.nodes)) {
    for (const item of root.nodes) {
      if (item && typeof item === 'object') {
        const e = item as Record<string, unknown>;
        const nodeId = resolveNodeId(e);
        if (nodeId) push(nodeId, e);
      }
    }
  }

  if (root.nodes && typeof root.nodes === 'object' && !Array.isArray(root.nodes)) {
    for (const [key, val] of Object.entries(root.nodes as Record<string, unknown>)) {
      push(key, val && typeof val === 'object' ? (val as Record<string, unknown>) : {});
    }
    return entries;
  }

  // Zen Engine trace: { [nodeId]: { id, name, input, output, traceData } }
  for (const [key, val] of Object.entries(root)) {
    if (key === 'trace' || key === 'nodes' || key === 'performance') continue;
    if (val && typeof val === 'object') {
      const e = val as Record<string, unknown>;
      const nodeId = resolveNodeId(e) ?? key;
      if (typeof e.id === 'string' || typeof e.name === 'string' || e.input !== undefined || e.output !== undefined) {
        push(nodeId, e);
      }
    }
  }

  return entries;
}

export function getTracedNodeIds(trace: unknown): Set<string> {
  return new Set(getNodeTraceEntries(trace).map((e) => e.nodeId));
}

export function isNodeTraced(nodeId: string, trace: unknown): boolean {
  return getTracedNodeIds(trace).has(nodeId);
}

/** True when the node actually ran (not just present as a trace stub) */
export function isNodeExecuted(nodeId: string, trace: unknown): boolean {
  const entry = getNodeTrace(nodeId, trace);
  if (!entry) return false;
  if (entry.traceData && Object.keys(entry.traceData).length > 0) return true;
  if (entry.output !== null && entry.output !== undefined) return true;
  return false;
}

export function getExecutedNodeIds(trace: unknown): Set<string> {
  return new Set(
    getNodeTraceEntries(trace)
      .filter((e) => isNodeExecuted(e.nodeId, trace))
      .map((e) => e.nodeId),
  );
}

export function getNodeTrace(nodeId: string, trace: unknown): NodeTraceEntry | undefined {
  return getNodeTraceEntries(trace).find((e) => e.nodeId === nodeId);
}

export function getActiveRuleIds(nodeId: string, trace: unknown): string[] {
  const entry = getNodeTrace(nodeId, trace);
  if (!entry) return [];

  const ids: string[] = [];
  const ruleMeta = entry.traceData?.rule as Record<string, unknown> | undefined;
  if (ruleMeta && typeof ruleMeta._id === 'string') {
    ids.push(ruleMeta._id);
  }

  const sources = [
    entry.traceData?.activeRules,
    entry.traceData?.matchedRules,
    (entry.output as Record<string, unknown> | undefined)?.activeRules,
    entry.traceData?.table &&
      (entry.traceData.table as Record<string, unknown>).rules,
  ];

  for (const c of sources) {
    if (!Array.isArray(c)) continue;
    for (const r of c) {
      if (typeof r === 'string') ids.push(r);
      else if (r && typeof r === 'object' && typeof (r as { _id?: string })._id === 'string') {
        ids.push((r as { _id: string })._id);
      }
    }
  }

  return [...new Set(ids)];
}

function resolveNodeId(e: Record<string, unknown>): string | undefined {
  if (typeof e.nodeId === 'string' && e.nodeId) return e.nodeId;
  if (typeof e.id === 'string' && e.id) return e.id;
  if (typeof e.node_id === 'string' && e.node_id) return e.node_id;
  return undefined;
}
