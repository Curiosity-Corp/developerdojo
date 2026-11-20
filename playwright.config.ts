import { defineConfig, devices } from '@playwright/test';

// The e2e suite runs against the BUILT site served by `astro preview` (CI builds first).
// PORT lets several checkouts run the suite on one machine without sharing a server.
const port = Number(process.env['PORT'] ?? 4321);

// E2E_BASE_URL points the suite at a deployed site instead (the e2e:production job, against
// https://developerdojo.org; hypervoid/admiral#123). Then no local server starts and only the
// read-only production subset runs: routes, navigation, menus, images and the landing page.
// Nothing in it writes data or submits a form.
const productionBaseURL = process.env['E2E_BASE_URL'];
const PRODUCTION_SPECS = ['smoke.spec.ts', 'dojo-navigation.spec.ts', 'mega-navigation.spec.ts', 'production-landing.spec.ts', 'start-here.spec.ts'];

export default defineConfig({
  testDir: 'e2e',
  ...(productionBaseURL ? { testMatch: PRODUCTION_SPECS } : {}),
  fullyParallel: true,
  // The CI runner pod has little CPU: 16 browser workers starved each other into 30s timeouts.
  workers: process.env['CI'] ? 3 : undefined,
  timeout: process.env['CI'] ? 60_000 : 30_000,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: productionBaseURL ?? `http://127.0.0.1:${port}`,
    // A trace snapshots the DOM at every step. On the resources catalogue (12k+ nodes) that
    // turned a 1.5s check into a 60s timeout, so CI records a trace only on the retry (#66).
    trace: process.env['CI'] ? 'on-first-retry' : 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
  ],
  ...(productionBaseURL
    ? {}
    : {
        webServer: {
          command: `node scripts/serve-dist.mjs dist ${port}`,
          url: `http://127.0.0.1:${port}`,
          reuseExistingServer: !process.env['CI'],
          timeout: 60_000,
        },
      }),
});
