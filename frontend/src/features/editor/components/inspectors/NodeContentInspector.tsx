import { Input } from 'antd';
import type { NodeType } from '@gorules-editor/shared-jdm';

interface NodeContentInspectorProps {
  nodeType: NodeType;
  content: unknown;
  onChange: (content: Record<string, unknown>) => void;
}

/** Fallback JSON editor for node types without a dedicated inspector yet */
export function NodeContentInspector({ content, onChange }: NodeContentInspectorProps) {
  return (
    <Input.TextArea
      rows={12}
      value={JSON.stringify(content ?? {}, null, 2)}
      onChange={(e) => {
        try {
          onChange(JSON.parse(e.target.value) as Record<string, unknown>);
        } catch {
          /* ignore invalid json while typing */
        }
      }}
      style={{ fontFamily: 'monospace', fontSize: 11 }}
    />
  );
}
