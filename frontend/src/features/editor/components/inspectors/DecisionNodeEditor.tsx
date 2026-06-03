import { Input, Typography } from 'antd';
import type { DecisionContent } from '@gorules-editor/shared-jdm';

const { Text } = Typography;

interface DecisionNodeEditorProps {
  content: unknown;
  onChange: (content: DecisionContent) => void;
}

export function DecisionNodeEditor({ content, onChange }: DecisionNodeEditorProps) {
  const c = (content ?? {}) as Partial<DecisionContent>;

  return (
    <div>
      <Text type="secondary" style={{ fontSize: 11 }}>
        Sub-decision key (loaded by backend ZenEngine loader)
      </Text>
      <Input
        placeholder="e.g. pricing/calculate-discount"
        value={c.key ?? ''}
        onChange={(e) =>
          onChange({
            key: e.target.value,
            passThrough: c.passThrough ?? true,
            inputField: c.inputField ?? null,
            outputPath: c.outputPath ?? null,
            executionMode: c.executionMode ?? 'single',
          })
        }
        style={{ marginTop: 4, marginBottom: 12 }}
      />
      <Text type="secondary" style={{ fontSize: 11 }}>
        Configure a filesystem or API loader in backend for this key.
      </Text>
    </div>
  );
}
