import { Menu, Typography } from 'antd';
import type { NodeType } from '@gorules-editor/shared-jdm';
import { PALETTE_ITEMS } from '../store/editor.store';

const { Text } = Typography;

interface ComponentPaletteProps {
  onAddNode: (type: NodeType) => void;
}

export function ComponentPalette({ onAddNode }: ComponentPaletteProps) {
  return (
    <div style={{ padding: '12px 8px' }}>
      <Text type="secondary" style={{ fontSize: 11, padding: '0 12px' }}>
        COMPONENTS
      </Text>
      <Menu
        mode="inline"
        selectable={false}
        items={PALETTE_ITEMS.map((item) => ({
          key: item.type,
          label: item.label,
          onClick: () => onAddNode(item.type),
        }))}
        style={{ border: 'none', marginTop: 8 }}
      />
      <Text type="secondary" style={{ fontSize: 11, padding: '12px', display: 'block' }}>
        Click to add at center of graph
      </Text>
    </div>
  );
}
