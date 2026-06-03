import { useState } from 'react';
import { Button, Collapse, Input, Space, Typography, App } from 'antd';
import { PlayCircleOutlined, ClearOutlined } from '@ant-design/icons';
import { simulateGraph } from '@/shared/api/decisions.api';
import { useEditorStore } from '../store/editor.store';

const { Text } = Typography;

const DEFAULT_REQUEST = `{
  "input": "hello"
}`;

export function SimulatorPanel() {
  const { message } = App.useApp();
  const graph = useEditorStore((s) => s.graph);
  const simulation = useEditorStore((s) => s.simulation);
  const setSimulation = useEditorStore((s) => s.setSimulation);
  const [request, setRequest] = useState(DEFAULT_REQUEST);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const context = JSON.parse(request) as Record<string, unknown>;
      const result = (await simulateGraph(graph, context)) as Record<string, unknown>;
      setSimulation({
        result: result.result,
        trace: result.trace,
        performance: result.performance,
      });
      message.success('Simulation complete');
    } catch (e) {
      const err = e instanceof Error ? e.message : 'Simulation failed';
      setSimulation({ error: err });
      message.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setSimulation(null);

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Text strong>Simulator</Text>
      <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>
        Request context (JSON)
      </Text>
      <Input.TextArea
        rows={8}
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
      <Space style={{ marginTop: 12, marginBottom: 12 }}>
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          loading={loading}
          onClick={handleRun}
        >
          Run
        </Button>
        <Button icon={<ClearOutlined />} onClick={handleClear}>
          Clear
        </Button>
      </Space>
      {simulation?.error && (
        <Text type="danger">{simulation.error}</Text>
      )}
      {simulation && !simulation.error && (
        <Collapse
          style={{ flex: 1, overflow: 'auto' }}
          items={[
            {
              key: 'result',
              label: 'Result',
              children: (
                <pre style={{ fontSize: 11, margin: 0, overflow: 'auto' }}>
                  {JSON.stringify(simulation.result, null, 2)}
                </pre>
              ),
            },
            {
              key: 'trace',
              label: 'Trace',
              children: (
                <pre style={{ fontSize: 11, margin: 0, overflow: 'auto', maxHeight: 240 }}>
                  {JSON.stringify(simulation.trace, null, 2)}
                </pre>
              ),
            },
            {
              key: 'performance',
              label: 'Performance',
              children: (
                <pre style={{ fontSize: 11, margin: 0 }}>
                  {JSON.stringify(simulation.performance, null, 2)}
                </pre>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
