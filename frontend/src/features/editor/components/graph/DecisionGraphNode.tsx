import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Tooltip } from 'antd';
import type { NodeType } from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../../store/editor.store';
import { getNodeTrace, isNodeTraced } from '../../lib/trace.utils';

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
  const traced = isNodeTraced(d.jdmNodeId, trace);
  const entry = getNodeTrace(d.jdmNodeId, trace);

  const className = [
    'graph-node',
    selected && 'selected',
    traced && 'trace-hit',
    trace && !traced && 'trace-skip',
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipTitle = entry
    ? `Executed\nOutput: ${JSON.stringify(entry.output)?.slice(0, 80) ?? '—'}`
    : trace
      ? 'Not executed'
      : undefined;

  const body = (
    <div className={className}>
      {d.nodeType !== 'inputNode' && (
        <Handle type="target" position={Position.Left} style={{ background: '#6366f1' }} />
      )}
      <div className="graph-node-type">{TYPE_LABELS[d.nodeType]}</div>
      <div className="graph-node-name">{d.label}</div>
      {traced && <div className="graph-node-trace-badge">executed</div>}
      {d.nodeType !== 'outputNode' && (
        <Handle type="source" position={Position.Right} style={{ background: '#6366f1' }} />
      )}
    </div>
  );

  return tooltipTitle ? <Tooltip title={tooltipTitle}>{body}</Tooltip> : body;
}
