import { Button, Input, Select, Space, Typography, Popconfirm } from 'antd';
import { ZenCodeEditor } from '@/shared/components/ZenCodeEditor';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { SwitchContent } from '@gorules-editor/shared-jdm';
import {
  normalizeSwitchContent,
  addCondition,
  removeCondition,
  updateCondition,
} from '../../lib/switch.utils';

const { Text } = Typography;

interface SwitchEditorProps {
  content: unknown;
  onChange: (content: SwitchContent) => void;
}

export function SwitchEditor({ content, onChange }: SwitchEditorProps) {
  const data = normalizeSwitchContent(content);
  const setData = (next: SwitchContent) => onChange(next);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Text type="secondary">Hit policy</Text>
        <Select
          size="small"
          value={data.hitPolicy ?? 'first'}
          style={{ width: 120 }}
          options={[
            { value: 'first', label: 'First' },
            { value: 'collect', label: 'Collect' },
          ]}
          onChange={(hitPolicy) => setData({ ...data, hitPolicy })}
        />
        <Button
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setData(addCondition(data))}
        >
          Add branch
        </Button>
      </Space>
      {data.conditions.length === 0 && (
        <Text type="secondary">No branches — add a condition</Text>
      )}
      {data.conditions.map((branch, index) => (
        <div
          key={branch.id}
          style={{
            marginBottom: 12,
            padding: 12,
            border: '1px solid #e5e7eb',
            borderRadius: 6,
          }}
        >
          <Space style={{ width: '100%', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12 }}>
              Branch {index + 1}
            </Text>
            <Popconfirm
              title="Remove branch?"
              onConfirm={() => setData(removeCondition(data, branch.id))}
            >
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Field (optional)
          </Text>
          <Input
            size="small"
            placeholder="e.g. status"
            value={branch.field ?? ''}
            onChange={(e) =>
              setData(updateCondition(data, branch.id, { field: e.target.value }))
            }
            style={{ marginBottom: 8 }}
          />
          <Text type="secondary" style={{ fontSize: 11 }}>
            Condition
          </Text>
          <ZenCodeEditor
            value={branch.condition}
            placeholder='e.g. "> 100" or expression'
            minHeight={48}
            onChange={(condition) =>
              setData(updateCondition(data, branch.id, { condition }))
            }
          />
        </div>
      ))}
    </div>
  );
}
