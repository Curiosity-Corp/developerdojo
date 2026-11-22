// Optional CI experiment for #113. This does not replace the blocking accessibility suite.
//
// Two questions, on the built catalog page (/library/resources/), on one shared CI runner:
//   1. Does asking axe to aggregate only violations (`resultTypes: ['violations']`) make the full scan
//      faster without changing what it finds? Every rule still runs on every node; axe only stops building
//      selectors and HTML snippets for every passing and inapplicable node. Full scans alternate
//      baseline / violations-only (AB then BA, reversed for dark), and the job fails if the two treatments of
//      a theme ever disagree on any violation id or node.
//   2. Where does a full axe scan spend its time? One pass per theme runs each rule of the full scan on its own
//      and records its time and node counts (`perRule`).
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';
import AxeModule from '@axe-core/playwright';

const AxeBuilder = AxeModule.default ?? AxeModule;
const port = 4321;
const origin = `http://127.0.0.1:${port}`;
const route = '/library/resources/';
const reportFile = 'catalog-a11y-profile.json';
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const treatments = {
  baseline: {},
  'violations-only': { resultTypes: ['violations'] },
};
const report = {
  description: 'Exploratory full-page axe scans on one shared CI runner; not real-device or learner performance.',
  startedAt: new Date().toISOString(),
  commit: process.env.CI_COMMIT_SHA ?? 'unknown',
  pipeline: process.env.CI_PIPELINE_URL ?? 'unknown',
  chromium: null,
  route,
  tags,
  treatments,
  viewport: { width: 1440, height: 900 },
  measurements: [],
  perRule: [],
  agreement: [],
  error: null,
};
const save = () => writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);
const server = spawn(process.execPath, ['scripts/serve-dist.mjs', 'dist', String(port)], { stdio: 'inherit' });
let browser;

/** One violation node as a comparable string: rule, impact and the node's selector. */
const violationKeys = (violations) =>
  violations.flatMap((v) => v.nodes.map((n) => `${v.id} ${v.impact} ${n.target.join(' ')}`)).sort();

/** A fresh context with the catalog loaded in the given theme; returns the page and its counts. */
async function openCatalog(theme) {
  const context = await browser.newContext({ viewport: report.viewport });
  const page = await context.newPage();
  const loadStarted = performance.now();
  await page.goto(`${origin}${route}`, { waitUntil: 'load' });
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
  const metrics = await page.evaluate(() => {
    const items = document.querySelectorAll('#resource-list > li[data-resource]');
    if (!items.length) throw new Error('No resource cards found');
    return {
      resources: items.length,
      domElements: document.querySelectorAll('*').length,
      hardwareConcurrency: navigator.hardwareConcurrency,
      userAgent: navigator.userAgent,
    };
  });
  return { context, page, metrics, setupMs: Math.round(performance.now() - loadStarted) };
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Static server exited with code ${server.exitCode}`);
    try {
      const response = await fetch(`${origin}${route}`, { signal: AbortSignal.timeout(1000) });
      if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}`);
      ready = true;
      break;
    } catch {
      await delay(500);
    }
  }
  if (!ready) throw new Error('Built catalog did not become available within 30 seconds');

  browser = await chromium.launch();
  report.chromium = browser.version();

  // 1. Full scans: baseline against violations-only, AB then BA in light; BA then AB in dark.
  const order = [
    ['light', 'baseline'], ['light', 'violations-only'], ['light', 'violations-only'], ['light', 'baseline'],
    ['dark', 'violations-only'], ['dark', 'baseline'], ['dark', 'baseline'], ['dark', 'violations-only'],
  ];
  for (const [theme, treatment] of order) {
    const { context, page, metrics, setupMs } = await openCatalog(theme);
    try {
      const scanStarted = performance.now();
      const result = await new AxeBuilder({ page }).withTags(tags).options(treatments[treatment]).analyze();
      const sample = {
        sequence: report.measurements.length + 1,
        theme,
        treatment,
        setupMs,
        scanMs: Math.round(performance.now() - scanStarted),
        ...metrics,
        // Keep every violation, its impact and nodes: do not filter the results to improve timing.
        violations: result.violations,
        violationKeys: violationKeys(result.violations),
        incompleteRules: result.incomplete.map((r) => r.id).sort(),
        // A rule can appear in two lists (color-contrast both passes and is incomplete), so count each rule once.
        ruleIds: [...new Set([...result.passes, ...result.violations, ...result.incomplete, ...result.inapplicable].map((r) => r.id))].sort(),
      };
      report.measurements.push(sample);
      await save();
      console.log(JSON.stringify({ ...sample, violations: sample.violations.length, violationKeys: sample.violationKeys.length, ruleIds: sample.ruleIds.length }));
    } finally {
      await context.close();
    }
  }

  // 2. Per-rule pass, one per theme, over exactly the rules the full scans ran. Each rule runs alone, so one
  // rule's cost cannot hide in another's. One loaded page per theme: axe resets its caches on every run, and
  // reloading the 900-card page for each of some 90 rules would push the job past its hour.
  for (const theme of ['light', 'dark']) {
    const ruleIds = report.measurements.find((s) => s.theme === theme)?.ruleIds ?? [];
    if (!ruleIds.length) throw new Error(`No full ${theme} scan recorded its rules`);
    const run = await openCatalog(theme);
    try {
      for (const ruleId of ruleIds) {
        const started = performance.now();
        const result = await new AxeBuilder({ page: run.page }).withRules([ruleId]).analyze();
        const count = (list) => list.reduce((sum, r) => sum + r.nodes.length, 0);
        report.perRule.push({
          theme,
          ruleId,
          scanMs: Math.round(performance.now() - started),
          passes: count(result.passes),
          violations: count(result.violations),
          incomplete: count(result.incomplete),
        });
      }
    } finally {
      await run.context.close();
    }
    await save();
    const top = report.perRule.filter((r) => r.theme === theme).sort((a, b) => b.scanMs - a.scanMs).slice(0, 5);
    console.log(JSON.stringify({ theme, rules: ruleIds.length, slowest: top }));
  }

  // The violations-only treatment may only be adopted if it finds exactly what the baseline finds.
  for (const theme of ['light', 'dark']) {
    const samples = report.measurements.filter((s) => s.theme === theme);
    const reference = JSON.stringify(samples[0].violationKeys);
    const same = samples.every((s) => JSON.stringify(s.violationKeys) === reference);
    report.agreement.push({ theme, sameViolationNodes: same, samples: samples.map((s) => s.sequence) });
    if (!same) {
      console.error(`${theme}: the treatments disagree on violation nodes; inspect the artifact.`);
      process.exitCode = 1;
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
