import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages project sites are served from /<repository-name>/.
// For a custom domain served at the root, build with VITE_BASE=/
export default defineConfig(() => {
  const raw = process.env.VITE_BASE ?? '/operations-hub/';
  const base = raw.endsWith('/') ? raw : `${raw}/`;
  return {
    base,
    plugins: [react(), tailwindcss()],
  };
});
