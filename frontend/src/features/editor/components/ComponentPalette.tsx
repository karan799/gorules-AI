import { Menu, Typography } from 'antd';
import type { NodeType } from '@gorules-editor/shared-jdm';
import { PALETTE_ITEMS } from '../store/editor.store';
import { DRAG_TYPE } from './graph/GraphCanvas';

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
      <Text type="secondary" style={{ fontSize: 10, padding: '4px 12px', display: 'block' }}>
        Drag onto graph or click to add
      </Text>
      <Menu
        mode="inline"
        selectable={false}
        items={PALETTE_ITEMS.map((item) => ({
          key: item.type,
          label: (
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(DRAG_TYPE, item.type);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onClick={() => onAddNode(item.type)}
              style={{ cursor: 'grab', userSelect: 'none' }}
            >
              {item.label}
            </div>
          ),
        }))}
        style={{ border: 'none', marginTop: 8 }}
      />
    </div>
  );
}
