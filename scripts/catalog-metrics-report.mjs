#!/usr/bin/env node
// Merges the resource-catalogue and site-search measurements every e2e shard wrote to catalog-metrics/*.json (#113) into
// catalog-metrics/summary.json and a readable catalog-metrics/summary.md: load, filter response and
// accessibility-scan time, each with the resource count and the runner it ran on.
// Usage: node scripts/catalog-metrics-report.mjs [dir]   (default: catalog-metrics)
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'catalog-metrics';
if (!existsSync(dir)) {
  console.warn(`catalog-metrics: no ${dir}/ directory, so no shard recorded a catalogue measurement`);
  process.exit(0);
}

const records = [];
for (const name of readdirSync(dir).filter((n) => n.endsWith('.json') && n !== 'summary.json').sort()) {
  const path = join(dir, name);
  try {
    records.push(JSON.parse(readFileSync(path, 'utf8')));
  } catch (error) {
    console.error(`catalog-metrics: ${path} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

const ms = (value) => (typeof value === 'number' ? `${(value / 1000).toFixed(2)} s` : 'n/a');
const runner = (r) => `${r.runner?.shard ?? '?'} (${r.runner?.cpus ?? '?'} CPU, load ${r.runner?.loadAverage1m ?? '?'})`;
const byKind = (kind) => records.filter((r) => r.kind === kind).sort((a, b) => `${a.project}${a.test}`.localeCompare(`${b.project}${b.test}`));

const lines = ['# Resource catalogue measurements', ''];
const load = byKind('load');
lines.push('## Page load', '', '| Project | CPU | Resources | DOM elements | HTML (decoded) | DOMContentLoaded | Load | FCP | LCP | Long tasks (total) | Script | Layout | Style | Runner |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of load) {
  lines.push(`| ${r.project}${r.retry ? ` (retry ${r.retry})` : ''} | ${r.cpuThrottle}x | ${r.resources} | ${r.domElements} | ${Math.round((r.htmlDecodedBytes ?? 0) / 1024)} KiB | ${ms(r.domContentLoadedMs)} | ${ms(r.loadEventMs)} | ${ms(r.firstContentfulPaintMs)} | ${ms(r.largestContentfulPaintMs)} | ${r.longTasks} (${ms(r.longTaskTotalMs)}) | ${ms(r.mainThreadMs?.script)} | ${ms(r.mainThreadMs?.layout)} | ${ms(r.mainThreadMs?.styleRecalc)} | ${runner(r)} |`);
}
lines.push('', '## Filter response (median, change to next paint)', '', '| Project | CPU | Resources | Filter | Clear | Script / change | Layout / change | Style / change | Runner |', '|---|---|---|---|---|---|---|---|---|');
for (const r of byKind('interaction')) {
  lines.push(`| ${r.project}${r.retry ? ` (retry ${r.retry})` : ''} | ${r.cpuThrottle}x | ${r.resources} | ${ms(r.filterToPaintMs)} | ${ms(r.clearToPaintMs)} | ${ms(r.perChangeMainThreadMs?.script)} | ${ms(r.perChangeMainThreadMs?.layout)} | ${ms(r.perChangeMainThreadMs?.styleRecalc)} | ${runner(r)} |`);
}
lines.push('', '## Accessibility scan (per part)', '', '| Project | Theme | Part | Resources | DOM elements | Navigation + theme | Scan | Finished | Runner |', '|---|---|---|---|---|---|---|---|---|');
const scans = byKind('scan').sort((a, b) => `${a.project}${a.theme}${a.part}`.localeCompare(`${b.project}${b.theme}${b.part}`));
for (const r of scans) {
  lines.push(`| ${r.project}${r.retry ? ` (retry ${r.retry})` : ''} | ${r.theme} | ${r.part} | ${r.resources} | ${r.domElements} | ${ms(r.navigationAndThemeMs)} | ${ms(r.scanElapsedMs)} | ${r.finished ? 'yes' : 'no'} | ${runner(r)} |`);
}
const scanTotal = scans.filter((r) => !r.retry).reduce((sum, r) => sum + (r.scanElapsedMs ?? 0), 0);
lines.push('', `Summed scan time (first attempts): ${ms(scanTotal)} over ${scans.filter((r) => !r.retry).length} parts.`, '');

// Site search start-up (#112): the header search from opening to the first result, split into its stages.
lines.push('## Site search start-up (header search, fresh browser context)', '', '| Project | CPU | Cold to first result (wall) | Module import | Index init | Query to results | Query to first preview | Pagefind requests (KiB) | Long tasks (total) | Script | Warm to first result | Runner |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const r of byKind('search')) {
  const requests = Object.entries(r.cold?.pagefindRequests ?? {}).map(([kind, v]) => `${kind} ${v.requests}x ${Math.round(v.transferBytes / 1024)}`).join(', ') || 'none';
  const s = r.cold?.stagesMs ?? {};
  lines.push(`| ${r.project}${r.retry ? ` (retry ${r.retry})` : ''} | ${r.cpuThrottle}x | ${ms(r.cold?.wallToResultMs)} | ${ms(s.moduleImport)} | ${ms(s.indexInit)} | ${ms(s.queryToSearched)} | ${ms(s.queryToFirstResult)} | ${requests} | ${r.cold?.longTasks ?? '?'} (${ms(r.cold?.longTaskTotalMs)}) | ${ms(r.cold?.scriptMs)} | ${ms(r.warm?.wallToResultMs)} | ${runner(r)} |`);
}
lines.push('');

writeFileSync(join(dir, 'summary.json'), `${JSON.stringify(records, null, 2)}\n`);
writeFileSync(join(dir, 'summary.md'), `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
