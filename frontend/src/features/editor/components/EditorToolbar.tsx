import { Button, Flex, Input, Space, Upload, Typography } from 'antd';
import {
  FileAddOutlined,
  FolderOpenOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { DecisionGraph } from '@gorules-editor/shared-jdm';
import { useEditorStore } from '../store/editor.store';

const { Text } = Typography;

export function EditorToolbar() {
  const docMeta = useEditorStore((s) => s.document);
  const graph = useEditorStore((s) => s.graph);
  const dirty = useEditorStore((s) => s.dirty);
  const setDocumentName = useEditorStore((s) => s.setDocumentName);
  const newDocument = useEditorStore((s) => s.newDocument);
  const loadGraph = useEditorStore((s) => s.loadGraph);
  const setDirty = useEditorStore((s) => s.setDirty);

  const downloadJson = (fileName: string) => {
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setDirty(false);
  };

  const handleOpen = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as DecisionGraph;
        loadGraph(parsed, {
          name: file.name.replace(/\.json$/i, ''),
          fileName: file.name,
        });
      } catch {
        console.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <Flex align="center" justify="space-between" style={{ width: '100%' }}>
      <Space size="small">
        <Button icon={<FileAddOutlined />} onClick={newDocument}>
          New
        </Button>
        <Upload accept=".json,application/json" showUploadList={false} beforeUpload={handleOpen}>
          <Button icon={<FolderOpenOutlined />}>Open</Button>
        </Upload>
        <Button
          icon={<SaveOutlined />}
          type="primary"
          onClick={() => downloadJson(docMeta.fileName)}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            const name = window.prompt('Save as', docMeta.fileName);
            if (name) downloadJson(name.endsWith('.json') ? name : `${name}.json`);
          }}
        >
          Save as
        </Button>
      </Space>
      <Space>
        <Input
          variant="borderless"
          value={docMeta.name}
          onChange={(e) => setDocumentName(e.target.value)}
          style={{ maxWidth: 280, fontWeight: 600, textAlign: 'center' }}
        />
        {dirty && <Text type="secondary">Unsaved</Text>}
      </Space>
      <div style={{ width: 200 }} />
    </Flex>
  );
}
