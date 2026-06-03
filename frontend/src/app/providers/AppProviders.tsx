import { ConfigProvider, App as AntApp } from 'antd';
import { gorulesAntdTheme } from '@/shared/theme/gorulesAntdTheme';
import type { ReactNode } from 'react';
import 'antd/dist/reset.css';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={gorulesAntdTheme}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}
