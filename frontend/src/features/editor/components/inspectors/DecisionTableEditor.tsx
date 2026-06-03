import { useMemo } from 'react';
import {
  Button,
  Input,
  Select,
  Space,
  Table,
  Typography,
  Popconfirm,
  Flex,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { DecisionTableContent } from '@gorules-editor/shared-jdm';
import { ZenCodeEditor } from '@/shared/components/ZenCodeEditor';
import {
  normalizeTableContent,
  addInputColumn,
  addOutputColumn,
  addRule,
  removeRule,
  removeColumn,
  updateColumn,
  updateRuleCell,
  updateRuleDescription,
} from '../../lib/decision-table.utils';

const { Text } = Typography;

interface DecisionTableEditorProps {
  content: unknown;
  onChange: (content: DecisionTableContent) => void;
}

export function DecisionTableEditor({ content, onChange }: DecisionTableEditorProps) {
  const table = normalizeTableContent(content);

  const setTable = (next: DecisionTableContent) => onChange(next);

  const columns = useMemo(() => {
    const descCol = {
      title: 'Description',
      dataIndex: '_description',
      key: '_description',
      width: 140,
      fixed: 'left' as const,
      render: (_: string, record: { _id: string; _description?: string }) => (
        <Input
          size="small"
          variant="borderless"
          placeholder="Rule description"
          value={record._description ?? ''}
          onChange={(e) =>
            setTable(updateRuleDescription(table, record._id, e.target.value))
          }
        />
      ),
    };

    const inputCols = table.inputs.map((col) => ({
      title: (
        <ColumnHeader
          label="IN"
          name={col.name}
          field={col.field}
          onNameChange={(name) => setTable(updateColumn(table, col.id, { name }))}
          onFieldChange={(field) => setTable(updateColumn(table, col.id, { field }))}
          onRemove={() => setTable(removeColumn(table, col.id))}
        />
      ),
      dataIndex: col.id,
      key: col.id,
      width: 160,
      render: (_: string, record: { _id: string }) => (
        <ZenCodeEditor
          value={(record as Record<string, string>)[col.id] ?? ''}
          placeholder="Condition"
          minHeight={36}
          onChange={(v) => setTable(updateRuleCell(table, record._id, col.id, v))}
        />
      ),
    }));

    const outputCols = table.outputs.map((col) => ({
      title: (
        <ColumnHeader
          label="OUT"
          name={col.name}
          field={col.field}
          onNameChange={(name) => setTable(updateColumn(table, col.id, { name }))}
          onFieldChange={(field) => setTable(updateColumn(table, col.id, { field }))}
          onRemove={() => setTable(removeColumn(table, col.id))}
        />
      ),
      dataIndex: col.id,
      key: col.id,
      width: 160,
      render: (_: string, record: { _id: string }) => (
        <ZenCodeEditor
          value={(record as Record<string, string>)[col.id] ?? ''}
          placeholder="Output"
          minHeight={36}
          onChange={(v) => setTable(updateRuleCell(table, record._id, col.id, v))}
        />
      ),
    }));

    const actionsCol = {
      title: '',
      key: '_actions',
      width: 48,
      fixed: 'right' as const,
      render: (_: unknown, record: { _id: string }) => (
        <Popconfirm
          title="Delete this rule?"
          onConfirm={() => setTable(removeRule(table, record._id))}
        >
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    };

    return [descCol, ...inputCols, ...outputCols, actionsCol];
  }, [table, setTable]);

  return (
    <div style={{ padding: '8px 0' }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Space>
          <Text type="secondary">Hit policy</Text>
          <Select
            size="small"
            value={table.hitPolicy}
            style={{ width: 120 }}
            options={[
              { value: 'first', label: 'First' },
              { value: 'collect', label: 'Collect' },
            ]}
            onChange={(hitPolicy) =>
              setTable({ ...table, hitPolicy: hitPolicy as 'first' | 'collect' })
            }
          />
        </Space>
        <Space>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setTable(addInputColumn(table))}
          >
            Input column
          </Button>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setTable(addOutputColumn(table))}
          >
            Output column
          </Button>
          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => setTable(addRule(table))}>
            Add rule
          </Button>
        </Space>
      </Flex>

      <Table
        size="small"
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
        dataSource={table.rules.map((r) => ({ ...r, key: r._id }))}
        columns={columns}
        locale={{ emptyText: 'No rules — click Add rule' }}
      />
    </div>
  );
}

function ColumnHeader({
  label,
  name,
  field,
  onNameChange,
  onFieldChange,
  onRemove,
}: {
  label: string;
  name: string;
  field: string;
  onNameChange: (v: string) => void;
  onFieldChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ minWidth: 120 }}>
      <Text style={{ fontSize: 10, color: '#6366f1' }}>{label}</Text>
      <Input
        size="small"
        variant="borderless"
        value={name}
        placeholder="Name"
        onChange={(e) => onNameChange(e.target.value)}
        style={{ fontWeight: 600, padding: 0 }}
      />
      <Input
        size="small"
        variant="borderless"
        value={field}
        placeholder="field.path"
        onChange={(e) => onFieldChange(e.target.value)}
        style={{ fontSize: 11, color: '#6b7280', padding: 0 }}
      />
      <Button type="link" size="small" danger onClick={onRemove} style={{ padding: 0, height: 'auto' }}>
        Remove
      </Button>
    </div>
  );
}
