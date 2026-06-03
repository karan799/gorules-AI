/** Extract node IDs that were executed during simulation from Zen Engine trace payloads */

export function getTracedNodeIds(trace: unknown): Set<string> {
  const ids = new Set<string>();
  if (!trace) return ids;

  if (Array.isArray(trace)) {
    for (const entry of trace) {
      collectNodeId(entry, ids);
    }
    return ids;
  }

  if (typeof trace === 'object') {
    const obj = trace as Record<string, unknown>;

    if (Array.isArray(obj.nodes)) {
      for (const entry of obj.nodes) collectNodeId(entry, ids);
    }

    if (obj.nodes && typeof obj.nodes === 'object' && !Array.isArray(obj.nodes)) {
      for (const key of Object.keys(obj.nodes as object)) {
        ids.add(key);
      }
    }

    if (Array.isArray(obj.trace)) {
      return getTracedNodeIds(obj.trace);
    }

    collectNodeId(obj, ids);
  }

  return ids;
}

function collectNodeId(entry: unknown, ids: Set<string>): void {
  if (!entry || typeof entry !== 'object') return;
  const e = entry as Record<string, unknown>;
  const id =
    (typeof e.nodeId === 'string' && e.nodeId) ||
    (typeof e.id === 'string' && e.id) ||
    (typeof e.node_id === 'string' && e.node_id) ||
    (typeof e.name === 'string' && e.name);

  if (id) ids.add(id);
}

export function isNodeTraced(nodeId: string, trace: unknown): boolean {
  return getTracedNodeIds(trace).has(nodeId);
}
