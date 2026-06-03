import { Input, Typography } from 'antd';
import type { InputContent } from '@gorules-editor/shared-jdm';

const { Text } = Typography;

interface InputNodeEditorProps {
  content: unknown;
  onChange: (content: InputContent) => void;
}

export function InputNodeEditor({ content, onChange }: InputNodeEditorProps) {
  const c = (content ?? {}) as InputContent;

  return (
    <div>
      <Text type="secondary" style={{ fontSize: 11 }}>
        JSON Schema (optional)
      </Text>
      <Input.TextArea
        rows={8}
        placeholder="{}"
        value={c.schema ?? ''}
        onChange={(e) => onChange({ schema: e.target.value })}
        style={{ marginTop: 4, fontFamily: 'monospace', fontSize: 12 }}
      />
    </div>
  );
}
