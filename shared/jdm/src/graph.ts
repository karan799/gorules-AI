import { createId, createNode, defaultContentForType } from './defaults.js';
import type { DecisionEdge, DecisionGraph, DecisionNode, NodeType } from './types.js';

export function addNode(
  graph: DecisionGraph,
  type: NodeType,
  position: { x: number; y: number },
): DecisionGraph {
  const node = createNode(type, position);
  return { ...graph, nodes: [...graph.nodes, node] };
}

export function removeNode(graph: DecisionGraph, nodeId: string): DecisionGraph {
  return {
    ...graph,
    nodes: graph.nodes.filter((n) => n.id !== nodeId),
    edges: graph.edges.filter((e) => e.sourceId !== nodeId && e.targetId !== nodeId),
  };
}

export function updateNode(
  graph: DecisionGraph,
  nodeId: string,
  patch: Partial<Pick<DecisionNode, 'name' | 'position' | 'content'>>,
): DecisionGraph {
  return {
    ...graph,
    nodes: graph.nodes.map((n) => (n.id === nodeId ? { ...n, ...patch } : n)),
  };
}

export function connectNodes(
  graph: DecisionGraph,
  sourceId: string,
  targetId: string,
  sourceHandle?: string,
  targetHandle?: string,
): DecisionGraph {
  const exists = graph.edges.some(
    (e) =>
      e.sourceId === sourceId &&
      e.targetId === targetId &&
      e.sourceHandle === sourceHandle &&
      e.targetHandle === targetHandle,
  );
  if (exists) return graph;

  const edge: DecisionEdge = {
    id: createId(),
    sourceId,
    targetId,
    sourceHandle,
    targetHandle,
    type: 'edge',
  };
  return { ...graph, edges: [...graph.edges, edge] };
}

export function disconnectEdge(graph: DecisionGraph, edgeId: string): DecisionGraph {
  return { ...graph, edges: graph.edges.filter((e) => e.id !== edgeId) };
}

export function hasConfiguredGraph(graph: DecisionGraph): boolean {
  return (
    graph.nodes.some((n) => n.type !== 'inputNode' && n.type !== 'outputNode') ||
    graph.nodes.length > 2
  );
}

export function graphToJdmPayload(graph: DecisionGraph): DecisionGraph {
  return {
    nodes: graph.nodes.map((n) => ({
      ...n,
      content: n.content ?? defaultContentForType(n.type),
    })),
    edges: graph.edges,
    ...(graph.metadata ? { metadata: graph.metadata } : {}),
  };
}
