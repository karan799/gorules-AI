import { Layout } from 'antd';
import { addNode, hasConfiguredGraph, type NodeType } from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../store/editor.store';
import { EditorToolbar } from '../components/EditorToolbar';
import { ComponentPalette } from '../components/ComponentPalette';
import { GraphCanvas } from '../components/graph/GraphCanvas';
import { SimulatorPanel } from '../components/SimulatorPanel';
import { NodeInspector } from '../components/NodeInspector';
import { EmptyGraphView } from '../components/EmptyGraphView';

const { Header, Sider, Content } = Layout;

export function EditorPage() {
  const graph = useEditorStore((s) => s.graph);
  const setGraph = useEditorStore((s) => s.setGraph);
  const simulatorOpen = useEditorStore((s) => s.simulatorOpen);
  const setSimulatorOpen = useEditorStore((s) => s.setSimulatorOpen);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);

  const handleAddNode = (type: NodeType) => {
    const next = addNode(graph, type, {
      x: 200 + graph.nodes.length * 40,
      y: 180 + (graph.nodes.length % 3) * 60,
    });
    setGraph(next);
  };

  const showEmpty = !hasConfiguredGraph(graph) && graph.nodes.length === 0;

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
        <EditorToolbar />
      </Header>
      <Layout>
        <Sider width={200} theme="light" style={{ borderRight: '1px solid #e5e7eb' }}>
          <ComponentPalette onAddNode={handleAddNode} />
        </Sider>
        <Content style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <GraphCanvas />
            {showEmpty && <EmptyGraphView />}
          </div>
          {selectedNodeId && (
            <div
              style={{
                height: 220,
                borderTop: '1px solid #e5e7eb',
                background: '#fff',
                overflow: 'auto',
              }}
            >
              <NodeInspector />
            </div>
          )}
        </Content>
        <Sider
          width={320}
          theme="light"
          collapsible
          collapsed={!simulatorOpen}
          onCollapse={(c) => setSimulatorOpen(!c)}
          reverseArrow
          style={{ borderLeft: '1px solid #e5e7eb' }}
        >
          <SimulatorPanel />
        </Sider>
      </Layout>
    </Layout>
  );
}
