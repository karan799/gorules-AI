import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupMonaco } from '@/shared/monaco/setupMonaco';
import { AppProviders } from '@/app/providers/AppProviders';
import App from '@/app/App';
import '@/styles/global.css';

setupMonaco();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
