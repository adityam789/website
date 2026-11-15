'use client';

import { createContext, useContext, useSyncExternalStore, ReactNode } from 'react';

type Theme = 'light' | 'dark';

// The <head> script in app/layout.tsx sets html.dark before first paint; this store just mirrors that class.
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => { listeners.delete(l); };
};
const getSnapshot = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
const getServerSnapshot = (): Theme => 'light';

function toggle() {
  const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark';
  const apply = () => {
    document.documentElement.classList.toggle('dark', next === 'dark');
    listeners.forEach(l => l());
  };
  try { localStorage.setItem('theme', next); } catch { /* private mode */ }
  // Cross-fade the whole page between themes where the browser supports it.
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(apply);
  else apply();
}

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: 'light', toggle });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
