import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output only: pure HTML/CSS/JS, no SSR, no backend, no runtime calls to other hosts.
// Served from the root of https://developerdojo.org (GitHub Pages custom domain).
export default defineConfig({
  site: 'https://developerdojo.org',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  // The dev toolbar never ships in production output; keep it off for dev screenshots too.
  devToolbar: { enabled: false },
});
