// Minimal static server for the built site (dist/), used by the Playwright e2e suite.
// Mirrors GitHub Pages behaviour: /path -> /path/index.html, unknown path -> 404.html with status 404.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] ?? '/');
  const candidate = normalize(join(root, decoded));
  if (candidate !== root && !candidate.startsWith(root + sep)) return undefined;
  for (const path of [candidate, join(candidate, 'index.html')]) {
    try {
      if ((await stat(path)).isFile()) return path;
    } catch {
      /* try the next candidate */
    }
  }
  return undefined;
}

createServer(async (request, response) => {
  try {
    const file = await resolveFile(request.url ?? '/');
    const status = file ? 200 : 404;
    const path = file ?? join(root, '404.html');
    const body = await readFile(path);
    response.writeHead(status, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { 'content-type': 'text/plain' });
    response.end(`Server error: ${error instanceof Error ? error.message : String(error)}`);
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving ${root} at http://127.0.0.1:${port}`));
