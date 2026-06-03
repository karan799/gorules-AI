import { useCallback, useEffect, useMemo, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
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
  addNode,
  type DecisionGraph,
  type NodeType,
} from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../../store/editor.store';
import { getTracedNodeIds } from '../../lib/trace.utils';
import { DecisionGraphNode, type GraphNodeData } from './DecisionGraphNode';

const nodeTypes = { decisionNode: DecisionGraphNode };

const DRAG_TYPE = 'application/gorules-node-type';

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

function GraphCanvasInner() {
  const graph = useEditorStore((s) => s.graph);
  const setGraph = useEditorStore((s) => s.setGraph);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId);
  const trace = useEditorStore((s) => s.simulation?.trace);
  const tracedIds = useMemo(() => getTracedNodeIds(trace), [trace]);
  const { screenToFlowPosition } = useReactFlow();

  const flow = useMemo(() => graphToFlow(graph), [graph]);
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);

  useEffect(() => {
    const next = graphToFlow(graph);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [graph, setNodes, setEdges]);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData(DRAG_TYPE) as NodeType;
      if (!nodeType) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      setGraph(addNode(graph, nodeType, position));
    },
    [graph, setGraph, screenToFlowPosition],
  );

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

  const hasTrace = Boolean(trace);

  return (
    <div className="graph-canvas" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          selected: n.id === selectedNodeId,
          className: hasTrace
            ? tracedIds.has(n.id)
              ? 'trace-hit'
              : 'trace-skip'
            : undefined,
        }))}
        edges={edges.map((e) => ({
          ...e,
          className:
            tracedIds.has(e.source) && tracedIds.has(e.target) ? 'trace-hit' : undefined,
          style:
            tracedIds.has(e.source) && tracedIds.has(e.target)
              ? { stroke: '#22c55e', strokeWidth: 2.5 }
              : undefined,
        }))}
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

export function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
}

export { DRAG_TYPE };
