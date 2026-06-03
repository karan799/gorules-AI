import { Tabs, Input, Typography, Empty } from 'antd';
import type { DecisionNode } from '@gorules-editor/shared-jdm';
import { updateNode } from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../store/editor.store';

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

  return (
    <div style={{ padding: 16 }}>
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
            key: 'content',
            label: 'Content',
            children: (
              <Input.TextArea
                rows={12}
                value={JSON.stringify(node.content ?? {}, null, 2)}
                onChange={(e) => {
                  try {
                    const content = JSON.parse(e.target.value);
                    update({ content });
                  } catch {
                    /* ignore invalid json while typing */
                  }
                }}
                style={{ fontFamily: 'monospace', fontSize: 11 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
