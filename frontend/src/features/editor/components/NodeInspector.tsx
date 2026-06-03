import { Tabs, Input, Typography, Empty } from 'antd';
import type { DecisionNode } from '@gorules-editor/shared-jdm';
import { updateNode } from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../store/editor.store';
import { DecisionTableEditor } from './inspectors/DecisionTableEditor';
import { ExpressionEditor } from './inspectors/ExpressionEditor';
import { FunctionEditor } from './inspectors/FunctionEditor';
import { SwitchEditor } from './inspectors/SwitchEditor';
import { InputNodeEditor } from './inspectors/InputNodeEditor';
import { DecisionNodeEditor } from './inspectors/DecisionNodeEditor';
import { NodeTracePanel } from './inspectors/NodeTracePanel';
import { NodeContentInspector } from './inspectors/NodeContentInspector';

const { Text } = Typography;

export function NodeInspector() {
  const graph = useEditorStore((s) => s.graph);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const setGraph = useEditorStore((s) => s.setGraph);

  const node = graph.nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="Select a node to edit" />
      </div>
    );
  }

  const update = (patch: Partial<DecisionNode>) => {
    setGraph(updateNode(graph, node.id, patch));
  };

  const editorTab = getEditorForNode(node, (content) => update({ content }));

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <Tabs
        items={[
          {
            key: 'general',
            label: 'General',
            children: (
              <div>
                <Text type="secondary">Name</Text>
                <Input
                  value={node.name}
                  onChange={(e) => update({ name: e.target.value })}
                  style={{ marginTop: 4, marginBottom: 12 }}
                />
                <Text type="secondary">Type</Text>
                <Input value={node.type} disabled style={{ marginTop: 4 }} />
              </div>
            ),
          },
          {
            key: 'editor',
            label: getEditorTabLabel(node.type),
            children: editorTab,
          },
          {
            key: 'trace',
            label: 'Trace',
            children: <NodeTracePanel nodeId={node.id} />,
          },
        ]}
      />
    </div>
  );
}

function getEditorTabLabel(type: DecisionNode['type']): string {
  switch (type) {
    case 'decisionTableNode':
      return 'Table';
    case 'expressionNode':
      return 'Expression';
    case 'functionNode':
      return 'Function';
    case 'switchNode':
      return 'Switch';
    case 'decisionNode':
      return 'Decision';
    default:
      return 'Content';
  }
}

function getEditorForNode(
  node: DecisionNode,
  onContentChange: (content: DecisionNode['content']) => void,
) {
  switch (node.type) {
    case 'decisionTableNode':
      return (
        <DecisionTableEditor
          nodeId={node.id}
          content={node.content}
          onChange={onContentChange}
        />
      );
    case 'expressionNode':
      return <ExpressionEditor content={node.content} onChange={onContentChange} />;
    case 'functionNode':
      return (
        <FunctionEditor nodeId={node.id} content={node.content} onChange={onContentChange} />
      );
    case 'switchNode':
      return <SwitchEditor content={node.content} onChange={onContentChange} />;
    case 'inputNode':
      return <InputNodeEditor content={node.content} onChange={onContentChange} />;
    case 'decisionNode':
      return <DecisionNodeEditor content={node.content} onChange={onContentChange} />;
    default:
      return (
        <NodeContentInspector
          nodeType={node.type}
          content={node.content}
          onChange={onContentChange}
        />
      );
  }
}
