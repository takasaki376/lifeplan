'use client';

import { Provider } from 'jotai';
import { DevTools } from 'jotai-devtools';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <DevTools />
      {children}
    </Provider>
  );
}
