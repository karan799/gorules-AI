import { useEffect, useState, type ReactNode } from 'react';
import { ConfigProvider, App as AntApp, Spin } from 'antd';
import { gorulesAntdTheme } from '@/shared/theme/gorulesAntdTheme';
import { ensureZenWasmLoaded } from '@/shared/wasm/zenWasm';
import 'antd/dist/reset.css';

export function AppProviders({ children }: { children: ReactNode }) {
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    ensureZenWasmLoaded()
      .then(() => setWasmReady(true))
      .catch((err) => {
        console.warn('[zen-wasm] failed to load; expression lint disabled', err);
        setWasmReady(true);
      });
  }, []);

  if (!wasmReady) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin tip="Loading rules engine…" />
      </div>
    );
  }

  return (
    <ConfigProvider theme={gorulesAntdTheme}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
