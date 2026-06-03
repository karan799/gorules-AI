import { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { ensureZenWasmLoaded } from '@/shared/wasm/zenWasm';
import {
  validateZenExpression,
  type ExpressionMode,
} from '@/shared/wasm/zenExpression';

interface ZenCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  mode?: ExpressionMode;
}

export function ZenCodeEditor({
  value,
  onChange,
  placeholder = '',
  minHeight = 32,
  mode = 'expression',
}: ZenCodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const [error, setError] = useState<string | undefined>();

  onChangeRef.current = onChange;

  useEffect(() => {
    ensureZenWasmLoaded().catch(console.error);
  }, []);

  useEffect(() => {
    if (!hostRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const text = update.state.doc.toString();
            onChangeRef.current(text);
            void runValidation(text);
          }
        }),
        EditorView.theme({
          '&': { minHeight: `${minHeight}px`, fontSize: '12px' },
          '.cm-content': { fontFamily: 'ui-monospace, monospace' },
          '&.cm-invalid': { borderColor: '#ef4444' },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    void runValidation(value);

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [mode, minHeight]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
      void runValidation(value);
    }
  }, [value]);

  async function runValidation(text: string) {
    const result = await validateZenExpression(text, mode);
    setError(result.valid ? undefined : result.message);
  }

  return (
    <div>
      <div
        ref={hostRef}
        title={placeholder}
        style={{
          border: error ? '1px solid #ef4444' : '1px solid #e5e7eb',
          borderRadius: 4,
          overflow: 'hidden',
          background: '#fff',
        }}
      />
      {error && (
        <div style={{ fontSize: 10, color: '#ef4444', marginTop: 2 }}>{error}</div>
      )}
    </div>
  );
}
