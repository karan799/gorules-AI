import { useRef } from 'react';
import { Row, Col } from 'antd';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { FunctionContent } from '@gorules-editor/shared-jdm';
import { NodeTracePanel } from './NodeTracePanel';

const DEFAULT_SOURCE = `/**
 * @param {input} input
 * @returns {output}
 */
const handler = (input) => {
  return input;
};
`;

interface FunctionEditorProps {
  content: unknown;
  nodeId: string;
  onChange: (content: FunctionContent) => void;
}

export function FunctionEditor({ content, nodeId, onChange }: FunctionEditorProps) {
  const raw = content as Partial<FunctionContent> | undefined;
  const source = raw?.source ?? DEFAULT_SOURCE;
  const heightRef = useRef(280);

  const handleMount: OnMount = (editor) => {
    editor.focus();
  };

  return (
    <Row gutter={12}>
      <Col span={16}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
          <Editor
            height={heightRef.current}
            defaultLanguage="javascript"
            value={source}
            onChange={(value) => onChange({ source: value ?? '' })}
            onMount={handleMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
            theme="vs"
          />
        </div>
      </Col>
      <Col span={8}>
        <NodeTracePanel nodeId={nodeId} />
      </Col>
    </Row>
  );
}
