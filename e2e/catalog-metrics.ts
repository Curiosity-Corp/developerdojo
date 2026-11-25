// Catalogue measurements (#113): each record is one JSON file under catalog-metrics/, kept as a CI artifact
// of the e2e shard that wrote it. e2e:report merges every shard's files with scripts/catalog-metrics-report.mjs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { cpus, loadavg, totalmem } from 'node:os';
import { join } from 'node:path';
import type { TestInfo } from '@playwright/test';

export const CATALOG_METRICS_DIR = 'catalog-metrics';

// The runner the numbers came from: CPU count and load decide how far a timing can be trusted.
const runner = () => ({
  shard: process.env['CI_NODE_INDEX'] ? `${process.env['CI_NODE_INDEX']}/${process.env['CI_NODE_TOTAL']}` : 'local',
  pipeline: process.env['CI_PIPELINE_ID'] ?? null,
  job: process.env['CI_JOB_ID'] ?? null,
  commit: process.env['CI_COMMIT_SHORT_SHA'] ?? null,
  cpus: cpus().length,
  cpuModel: cpus()[0]?.model ?? 'unknown',
  memoryGiB: Math.round((totalmem() / 2 ** 30) * 10) / 10,
  loadAverage1m: Math.round((loadavg()[0] ?? 0) * 100) / 100,
});

export function recordCatalogMetric(kind: 'load' | 'interaction' | 'scan', testInfo: TestInfo, data: Record<string, unknown>): void {
  const record = {
    kind,
    test: testInfo.titlePath.slice(1).join(' > '),
    project: testInfo.project.name,
    retry: testInfo.retry,
    recordedAt: new Date().toISOString(),
    runner: { ...runner(), playwrightWorkers: testInfo.config.workers },
    ...data,
  };
  mkdirSync(CATALOG_METRICS_DIR, { recursive: true });
  const name = `${kind}-${testInfo.testId}-${testInfo.project.name}-r${testInfo.retry}.json`.replace(/[^\w.-]+/g, '-');
  writeFileSync(join(CATALOG_METRICS_DIR, name), `${JSON.stringify(record, null, 2)}\n`);
  console.info(`[catalog-diagnostics] ${kind}`, JSON.stringify(record));
}
