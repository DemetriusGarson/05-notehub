import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'modern-normalize';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </React.StrictMode>
  </QueryClientProvider>
);
