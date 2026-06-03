import { Collapse, Typography } from 'antd';
import { getNodeTrace } from '../../lib/trace.utils';
import { useEditorStore } from '../../store/editor.store';

const { Text } = Typography;

interface NodeTracePanelProps {
  nodeId: string;
}

export function NodeTracePanel({ nodeId }: NodeTracePanelProps) {
  const trace = useEditorStore((s) => s.simulation?.trace);
  const entry = getNodeTrace(nodeId, trace);

  if (!trace) {
    return <Text type="secondary">Run simulator to see execution trace</Text>;
  }

  if (!entry) {
    return <Text type="secondary">Node was not executed in last simulation</Text>;
  }

  return (
    <Collapse
      size="small"
      items={[
        {
          key: 'input',
          label: 'Input',
          children: (
            <pre style={{ fontSize: 11, margin: 0, overflow: 'auto', maxHeight: 120 }}>
              {JSON.stringify(entry.input, null, 2)}
            </pre>
          ),
        },
        {
          key: 'output',
          label: 'Output',
          children: (
            <pre style={{ fontSize: 11, margin: 0, overflow: 'auto', maxHeight: 120 }}>
              {JSON.stringify(entry.output, null, 2)}
            </pre>
          ),
        },
        {
          key: 'performance',
          label: 'Performance',
          children: (
            <pre style={{ fontSize: 11, margin: 0 }}>
              {JSON.stringify(entry.performance, null, 2)}
            </pre>
          ),
        },
      ]}
    />
  );
}
