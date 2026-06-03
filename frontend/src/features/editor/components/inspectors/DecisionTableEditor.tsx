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
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnEvalMode, DecisionTableContent } from '@gorules-editor/shared-jdm';
import { ZenCodeEditor } from '@/shared/components/ZenCodeEditor';
import { useEditorStore } from '../../store/editor.store';
import { getActiveRuleIds } from '../../lib/trace.utils';
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
  reorderInputColumns,
  reorderOutputColumns,
  reorderRules,
} from '../../lib/decision-table.utils';

const { Text } = Typography;

interface DecisionTableEditorProps {
  content: unknown;
  nodeId: string;
  onChange: (content: DecisionTableContent) => void;
}

export function DecisionTableEditor({ content, nodeId, onChange }: DecisionTableEditorProps) {
  const table = normalizeTableContent(content);
  const trace = useEditorStore((s) => s.simulation?.trace);
  const activeRuleIds = useMemo(() => getActiveRuleIds(nodeId, trace), [nodeId, trace]);

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

    const makeCol = (
      col: { id: string; name: string; field: string; type?: ColumnEvalMode },
      kind: 'input' | 'output',
      index: number,
      reorder: (content: DecisionTableContent, from: number, to: number) => DecisionTableContent,
      cols: typeof table.inputs,
    ) => ({
      title: (
        <ColumnHeader
          label={kind === 'input' ? 'IN' : 'OUT'}
          name={col.name}
          field={col.field}
          evalMode={col.type ?? 'expression'}
          onNameChange={(name) => setTable(updateColumn(table, col.id, { name }))}
          onFieldChange={(field) => setTable(updateColumn(table, col.id, { field }))}
          onEvalModeChange={(type) => setTable(updateColumn(table, col.id, { type }))}
          onRemove={() => setTable(removeColumn(table, col.id))}
          onMoveUp={() => index > 0 && setTable(reorder(table, index, index - 1))}
          onMoveDown={() => index < cols.length - 1 && setTable(reorder(table, index, index + 1))}
          canMoveUp={index > 0}
          canMoveDown={index < cols.length - 1}
        />
      ),
      dataIndex: col.id,
      key: col.id,
      width: 180,
      render: (_: string, record: { _id: string }) => (
        <ZenCodeEditor
          value={(record as Record<string, string>)[col.id] ?? ''}
          placeholder={kind === 'input' ? 'Condition' : 'Output'}
          minHeight={36}
          mode={col.type === 'unary' ? 'unary' : 'expression'}
          onChange={(v) => setTable(updateRuleCell(table, record._id, col.id, v))}
        />
      ),
    });

    const inputCols = table.inputs.map((col, i) =>
      makeCol(col, 'input', i, reorderInputColumns, table.inputs),
    );
    const outputCols = table.outputs.map((col, i) =>
      makeCol(col, 'output', i, reorderOutputColumns, table.outputs),
    );

    const actionsCol = {
      title: '',
      key: '_actions',
      width: 72,
      fixed: 'right' as const,
      render: (_: unknown, record: { _id: string }, index: number) => (
        <Space size={0}>
          <Button
            type="text"
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            onClick={() => setTable(reorderRules(table, index, index - 1))}
          />
          <Button
            type="text"
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={index === table.rules.length - 1}
            onClick={() => setTable(reorderRules(table, index, index + 1))}
          />
          <Popconfirm
            title="Delete this rule?"
            onConfirm={() => setTable(removeRule(table, record._id))}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
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
          <Button size="small" icon={<PlusOutlined />} onClick={() => setTable(addInputColumn(table))}>
            Input column
          </Button>
          <Button size="small" icon={<PlusOutlined />} onClick={() => setTable(addOutputColumn(table))}>
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
        scroll={{ x: 'max-content', y: 400 }}
        rowClassName={(record) =>
          activeRuleIds.includes(record._id) ? 'table-rule-active' : ''
        }
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
  evalMode,
  onNameChange,
  onFieldChange,
  onEvalModeChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  label: string;
  name: string;
  field: string;
  evalMode: ColumnEvalMode;
  onNameChange: (v: string) => void;
  onFieldChange: (v: string) => void;
  onEvalModeChange: (v: ColumnEvalMode) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div style={{ minWidth: 130 }}>
      <Flex justify="space-between" align="center">
        <Text style={{ fontSize: 10, color: '#6366f1' }}>{label}</Text>
        <Space size={0}>
          <Button type="text" size="small" icon={<ArrowUpOutlined />} disabled={!canMoveUp} onClick={onMoveUp} />
          <Button type="text" size="small" icon={<ArrowDownOutlined />} disabled={!canMoveDown} onClick={onMoveDown} />
        </Space>
      </Flex>
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
      <Select
        size="small"
        value={evalMode}
        style={{ width: '100%', marginTop: 4 }}
        options={[
          { value: 'expression', label: 'Expression' },
          { value: 'unary', label: 'Unary' },
        ]}
        onChange={onEvalModeChange}
      />
      <Button type="link" size="small" danger onClick={onRemove} style={{ padding: 0, height: 'auto' }}>
        Remove
      </Button>
    </div>
  );
}
