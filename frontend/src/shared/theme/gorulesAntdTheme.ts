import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const gorulesAntdTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#6366f1',
    colorBgLayout: '#f5f5f7',
    colorBgContainer: '#ffffff',
    colorBorder: '#e5e7eb',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    borderRadius: 6,
    fontSize: 13,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#fafafa',
      bodyBg: '#f5f5f7',
      headerHeight: 48,
      headerPadding: '0 16px',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#eef2ff',
      itemSelectedColor: '#4f46e5',
      itemHoverBg: '#f3f4f6',
    },
    Button: { borderRadius: 6, controlHeight: 32 },
    Tabs: { cardBg: '#ffffff' },
    Table: {
      headerBg: '#f9fafb',
      headerColor: '#374151',
      rowHoverBg: '#f9fafb',
    },
  },
};
