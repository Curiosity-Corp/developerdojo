// Optional CI experiment for #113. This does not replace the blocking accessibility suite.
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import AxeModule from '@axe-core/playwright';

const AxeBuilder = AxeModule.default ?? AxeModule;
const port = 4321;
const origin = `http://127.0.0.1:${port}`;
// Texture mode changes the visual backdrop for comparison only; it does not assess the live page.
const textureMode = process.argv.includes('--texture');
const reportFile = textureMode ? 'catalog-texture-profile.json' : 'catalog-a11y-profile.json';
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const report = {
  description: textureMode
    ? 'Exploratory scans compare the original page with its body texture removed only in the test browser. Modified-backdrop findings do not verify contrast on the original page.'
    : 'Exploratory full-page axe scans on one shared CI runner; not real-device or learner performance.',
  experiment: textureMode ? 'texture' : 'content-visibility',
  startedAt: new Date().toISOString(),
  commit: process.env.CI_COMMIT_SHA ?? 'unknown',
  pipeline: process.env.CI_PIPELINE_URL ?? 'unknown',
  chromium: null,
  tags,
  viewport: { width: 1440, height: 900 },
  measurements: [],
  error: null,
};
const save = () => writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);
const server = spawn(process.execPath, ['scripts/serve-dist.mjs', 'dist', String(port)], { stdio: 'inherit' });
let browser;

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Static server exited with code ${server.exitCode}`);
    try {
      const response = await fetch(`${origin}/library/resources/`, { signal: AbortSignal.timeout(1000) });
      if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}`);
      ready = true;
      break;
    } catch {
      await delay(500);
    }
  }
  if (!ready) throw new Error('Built catalog did not become available within 30 seconds');

  if (textureMode) await mkdir('catalog-texture-screenshots', { recursive: true });
  browser = await chromium.launch();
  report.chromium = browser.version();
  // A new context per scan, with treatment order reversed between themes.
  // The texture comparison is exploratory: repeat the job before interpreting timings or findings.
  const order = textureMode
    ? [['light', 'baseline'], ['light', 'texture-removed'], ['dark', 'texture-removed'], ['dark', 'baseline']]
    : [
      ['light', 'baseline'], ['light', 'visible'], ['light', 'visible'], ['light', 'baseline'],
      ['dark', 'visible'], ['dark', 'baseline'], ['dark', 'baseline'], ['dark', 'visible'],
    ];
  for (const [theme, treatment] of order) {
    const context = await browser.newContext({ viewport: report.viewport });
    try {
      const page = await context.newPage();
      const loadStarted = performance.now();
      await page.goto(`${origin}/library/resources/`, { waitUntil: 'load' });
      await page.emulateMedia({ colorScheme: theme });
      await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
      if (treatment === 'visible') {
        await page.addStyleTag({ content: '#resource-list > li { content-visibility: visible !important; }' });
      }
      if (treatment === 'texture-removed') {
        await page.addStyleTag({ content: 'body::before { content: none !important; }' });
      }
      const metrics = await page.evaluate(() => {
        const items = [...document.querySelectorAll('#resource-list > li[data-resource]')];
        if (!items.length) throw new Error('No resource cards found');
        return {
          resources: items.length,
          domElements: document.querySelectorAll('*').length,
          contentVisibility: getComputedStyle(items[0]).contentVisibility,
          bodyBeforeContent: getComputedStyle(document.body, '::before').content,
          bodyBeforeBackgroundImage: getComputedStyle(document.body, '::before').backgroundImage,
          bodyBeforeOpacity: getComputedStyle(document.body, '::before').opacity,
          hardwareConcurrency: navigator.hardwareConcurrency,
          userAgent: navigator.userAgent,
        };
      });
      const expected = treatment === 'visible' ? 'visible' : 'auto';
      if (metrics.contentVisibility !== expected) {
        throw new Error(`Expected ${expected} content-visibility for ${treatment}; found ${metrics.contentVisibility}`);
      }
      if (textureMode) {
        const textureAbsent = metrics.bodyBeforeContent === 'none' || metrics.bodyBeforeContent === 'normal';
        if ((treatment === 'texture-removed') !== textureAbsent) {
          throw new Error(`Unexpected body::before content for ${treatment}: ${metrics.bodyBeforeContent}`);
        }
      }
      const setupMs = Math.round(performance.now() - loadStarted);
      const scanStarted = performance.now();
      const result = await new AxeBuilder({ page }).withTags(tags).analyze();
      const sample = {
        sequence: report.measurements.length + 1,
        theme,
        treatment,
        setupMs,
        scanMs: Math.round(performance.now() - scanStarted),
        ...metrics,
        // Keep every violation, its impact and nodes: do not filter the results to improve timing.
        violations: result.violations,
        incomplete: result.incomplete,
      };
      report.measurements.push(sample);
      await save();
      if (textureMode) {
        // Illustrative viewport only; it does not establish contrast across the whole page.
        await page.screenshot({ path: `catalog-texture-screenshots/${theme}-${treatment}.png` });
      }
      console.log(JSON.stringify({ ...sample, violations: sample.violations.length, incomplete: sample.incomplete.length }));
    } finally {
      await context.close();
    }
  }
  // A reported difference is evidence to inspect, not a conclusion about the cause or a release gate.
  const serious = report.measurements.flatMap((sample) => sample.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'));
  if (serious.length) {
    console.error(`The experiment observed ${serious.length} serious or critical violations; inspect the artifact.`);
    process.exitCode = 1;
  }
} catch (error) {
  report.error = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error(report.error);
  process.exitCode = 1;
} finally {
  report.finishedAt = new Date().toISOString();
  await save();
  if (browser) await browser.close();
  server.kill();
}
