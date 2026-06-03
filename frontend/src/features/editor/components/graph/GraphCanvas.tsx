import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@/styles/graph-canvas.css';
import {
  connectNodes,
  disconnectEdge,
  updateNode,
  type DecisionGraph,
} from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../../store/editor.store';
import { DecisionGraphNode, type GraphNodeData } from './DecisionGraphNode';

const nodeTypes = { decisionNode: DecisionGraphNode };

function graphToFlow(graph: DecisionGraph): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = graph.nodes.map((n) => ({
    id: n.id,
    type: 'decisionNode',
    position: n.position,
    data: { label: n.name, nodeType: n.type, jdmNodeId: n.id } satisfies GraphNodeData,
  }));
  const edges: Edge[] = graph.edges.map((e) => ({
    id: e.id,
    source: e.sourceId,
    target: e.targetId,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
  }));
  return { nodes, edges };
}

export function GraphCanvas() {
  const graph = useEditorStore((s) => s.graph);
  const setGraph = useEditorStore((s) => s.setGraph);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId);

  const flow = useMemo(() => graphToFlow(graph), [graph]);
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);

  useEffect(() => {
    const next = graphToFlow(graph);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [graph, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const next = connectNodes(
        graph,
        connection.source,
        connection.target,
        connection.sourceHandle ?? undefined,
        connection.targetHandle ?? undefined,
      );
      setGraph(next);
      setEdges((eds) => addEdge(connection, eds));
    },
    [graph, setGraph, setEdges],
  );

  const onNodeDragStop = useCallback(
    (_: unknown, node: Node) => {
      setGraph(updateNode(graph, node.id, { position: node.position }));
    },
    [graph, setGraph],
  );

  const onSelectionChange = useCallback(
    ({ nodes: sel }: { nodes: Node[] }) => {
      setSelectedNodeId(sel[0]?.id ?? null);
    },
    [setSelectedNodeId],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      let next = graph;
      for (const e of deleted) {
        next = disconnectEdge(next, e.id);
      }
      setGraph(next);
    },
    [graph, setGraph],
  );

  return (
    <div className="graph-canvas">
      <ReactFlow
        nodes={nodes.map((n) => ({ ...n, selected: n.id === selectedNodeId }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
