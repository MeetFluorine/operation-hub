// GitHub Pages has no server-side routing. When someone refreshes /operations-hub/mrs,
// Pages cannot find that file and serves 404.html instead. Making 404.html an exact copy
// of index.html lets the app boot and resolve the route on the client.
import { copyFileSync, existsSync } from 'node:fs';

const source = 'dist/index.html';

if (!existsSync(source)) {
  console.error('dist/index.html was not found. Run the Vite build first.');
  process.exit(1);
}

copyFileSync(source, 'dist/404.html');
console.log('Created dist/404.html (route refresh fallback for GitHub Pages)');
