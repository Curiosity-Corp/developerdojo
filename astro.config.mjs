import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import moves from './src/data/taxonomy-moves.json' with { type: 'json' };
import { parseLedger, routeRedirects } from './src/lib/taxonomy-identifiers.ts';

// Static output only: pure HTML/CSS/JS, no SSR, no backend, no runtime calls to other hosts.
// Served from the root of https://developerdojo.org (GitHub Pages custom domain).
export default defineConfig({
  site: 'https://developerdojo.org',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  // Code blocks: github-dark (the default) greys comments to 3.05:1; github-dark-default keeps every token at WCAG AA.
  markdown: { shikiConfig: { theme: 'github-dark-default' } },
  // Moved kata routes (#82): every move in src/data/taxonomy-moves.json is a static redirect page, so
  // old links keep working. tests/taxonomy-identifiers.test.ts checks this list against the ledger.
  redirects: routeRedirects(parseLedger(moves)),
  // The dev toolbar never ships in production output; keep it off for dev screenshots too.
  devToolbar: { enabled: false },
});
