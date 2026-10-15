import { useCallback, useEffect, useState } from 'react';

// Minimal path based router built on the History API. No dependency needed for four routes.

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function hrefFor(route: string): string {
  return `${base}${route === '/' ? '/' : route}`;
}

function readPath(): string {
  let p = window.location.pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length);
  p = p.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export function usePath() {
  const [path, setPath] = useState<string>(readPath);

  useEffect(() => {
    const onPop = () => setPath(readPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === readPath()) return;
    window.history.pushState(null, '', hrefFor(to));
    setPath(to);
  }, []);

  return { path, navigate };
}
