import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { ensureZenWasmLoaded } from '@/shared/wasm/zenWasm';

interface ZenCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function ZenCodeEditor({
  value,
  onChange,
  placeholder = '',
  minHeight = 32,
}: ZenCodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
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
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': { minHeight: `${minHeight}px`, fontSize: '12px' },
          '.cm-content': { fontFamily: 'ui-monospace, monospace' },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      title={placeholder}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 4,
        overflow: 'hidden',
        background: '#fff',
      }}
    />
  );
}
