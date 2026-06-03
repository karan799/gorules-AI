import { Empty, Button } from 'antd';
import { useEditorStore } from '../store/editor.store';

export function EmptyGraphView() {
  const newDocument = useEditorStore((s) => s.newDocument);
  const graph = useEditorStore((s) => s.graph);

  if (graph.nodes.length > 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <Empty
        description="Decision View Not Configured"
        style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.9)', padding: 32 }}
      >
        <Button type="primary" onClick={newDocument}>
          Create starter graph
        </Button>
      </Empty>
    </div>
  );
}
