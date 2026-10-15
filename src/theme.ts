import { useCallback, useEffect, useState } from 'react';
import { readStored, writeStored } from './storage';

export type Theme = 'light' | 'dark';

function initialTheme(): Theme {
  const saved = readStored('oh-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      writeStored('oh-theme', next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
