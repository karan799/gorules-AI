import { Button, Input, Space, Typography, Popconfirm } from 'antd';
import { ZenCodeEditor } from '@/shared/components/ZenCodeEditor';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ExpressionContent } from '@gorules-editor/shared-jdm';
import {
  normalizeExpressionContent,
  addExpression,
  removeExpression,
  updateExpression,
} from '../../lib/expression.utils';

const { Text } = Typography;

interface ExpressionEditorProps {
  content: unknown;
  onChange: (content: ExpressionContent) => void;
}

export function ExpressionEditor({ content, onChange }: ExpressionEditorProps) {
  const data = normalizeExpressionContent(content);
  const setData = (next: ExpressionContent) => onChange(next);

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setData(addExpression(data))}
        >
          Add expression
        </Button>
      </Space>
      {data.expressions.length === 0 && (
        <Text type="secondary">No expressions defined</Text>
      )}
      {data.expressions.map((entry, index) => (
        <div
          key={entry.id}
          style={{
            marginBottom: 12,
            padding: 12,
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            background: '#fafafa',
          }}
        >
          <Space style={{ width: '100%', marginBottom: 8 }} align="center">
            <Text type="secondary" style={{ fontSize: 11 }}>
              #{index + 1}
            </Text>
            <Input
              size="small"
              placeholder="Output key (e.g. customer.fullName)"
              value={entry.key}
              onChange={(e) => setData(updateExpression(data, entry.id, { key: e.target.value }))}
              style={{ flex: 1 }}
            />
            <Popconfirm
              title="Remove expression?"
              onConfirm={() => setData(removeExpression(data, entry.id))}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
          <ZenCodeEditor
            value={entry.value}
            placeholder="Zen expression value"
            minHeight={48}
            onChange={(value) => setData(updateExpression(data, entry.id, { value }))}
          />
        </div>
      ))}
    </div>
  );
}
