import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { NodeType } from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../../store/editor.store';

export interface GraphNodeData {
  label: string;
  nodeType: NodeType;
  jdmNodeId: string;
}

const TYPE_LABELS: Record<NodeType, string> = {
  inputNode: 'Request',
  outputNode: 'Response',
  decisionTableNode: 'Decision table',
  expressionNode: 'Expression',
  functionNode: 'Function',
  switchNode: 'Switch',
  decisionNode: 'Decision',
};

export function DecisionGraphNode({ data, selected }: NodeProps) {
  const d = data as unknown as GraphNodeData;
  const trace = useEditorStore((s) => s.simulation?.trace);
  const hasTrace = Boolean(trace);

  return (
    <div className={`graph-node ${selected ? 'selected' : ''} ${hasTrace ? 'trace-hit' : ''}`}>
      {d.nodeType !== 'inputNode' && (
        <Handle type="target" position={Position.Left} style={{ background: '#6366f1' }} />
      )}
      <div className="graph-node-type">{TYPE_LABELS[d.nodeType]}</div>
      <div className="graph-node-name">{d.label}</div>
      {d.nodeType !== 'outputNode' && (
        <Handle type="source" position={Position.Right} style={{ background: '#6366f1' }} />
      )}
    </div>
  );
}
