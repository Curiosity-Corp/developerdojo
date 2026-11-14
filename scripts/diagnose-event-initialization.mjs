// Optional CI diagnostic for #122. It does not alter the normal test suite or its timeout.
// Run with Node >= 22.23.4 and installed dependencies; each sample is a fresh child process.
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { fileURLToPath } from 'node:url';

const reportPath = 'event-initialization-diagnostic.json';
const self = fileURLToPath(import.meta.url);
const zones = ['UTC', 'Asia/Manila'];
const repeats = 5;
const rounds = 3;
const timeoutMs = 120_000;

async function optionalText(path) {
  try { return (await readFile(path, 'utf8')).trim(); }
  catch { return null; }
}

async function cpuSnapshot() {
  // cgroup v2 counters are shared by the job's cgroup, not specific to this child.
  // Do not guess values on cgroup v1, unavailable files, or unexpected formats.
  const stat = await optionalText('/sys/fs/cgroup/cpu.stat');
  const max = await optionalText('/sys/fs/cgroup/cpu.max');
  const values = {};
  if (stat !== null) {
    for (const line of stat.split('\n')) {
      const match = /^(usage_usec|nr_periods|nr_throttled|throttled_usec)\s+(\d+)$/.exec(line.trim());
      if (match) values[match[1]] = Number(match[2]);
    }
  }
  return { counters: Object.keys(values).length ? values : null, quota: max || null };
}

function delta(start, end) {
  if (!start?.counters || !end?.counters) return null;
  const result = {};
  for (const key of Object.keys(start.counters)) {
    const a = start.counters[key];
    const b = end.counters[key];
    result[key] = Number.isFinite(a) && Number.isFinite(b) && b >= a ? b - a : null;
  }
  return Object.keys(result).length ? result : null;
}

function timed(action) {
  const before = process.cpuUsage();
  const start = process.hrtime.bigint();
  const result = action();
  const wallMs = Number(process.hrtime.bigint() - start) / 1e6;
  const cpu = process.cpuUsage(before);
  return { wallMs, cpuMs: (cpu.user + cpu.system) / 1000, success: result };
}

async function child(mode, zone) {
  if (!['schema', 'intl'].includes(mode) || !zones.includes(zone)) throw new Error('Invalid sample request');
  let action;
  const importStart = process.hrtime.bigint();
  if (mode === 'schema') {
    const { eventsSchema } = await import('../src/lib/schemas.ts');
    const fixture = [{ id: 'format-example', title: 'Example', description: 'Fictional diagnostic fixture.', start: '2099-01-01T10:00:00+00:00', timezone: zone }];
    action = () => eventsSchema.safeParse(fixture).success;
  } else {
    action = () => { new Intl.DateTimeFormat('en-US', { timeZone: zone }); return true; };
  }
  const importMs = Number(process.hrtime.bigint() - importStart) / 1e6;
  const before = await cpuSnapshot();
  const first = timed(action);
  const repeated = Array.from({ length: repeats }, () => timed(action));
  const after = await cpuSnapshot();
  process.stdout.write(`${JSON.stringify({ mode, zone, importMs, first, repeated, cpuQuota: before.quota, cgroupCpuDelta: delta(before, after) })}\n`);
  if (![first, ...repeated].every((sample) => sample.success)) process.exitCode = 1;
}

function runChild(mode, zone) {
  return new Promise((resolve) => {
    const start = process.hrtime.bigint();
    const proc = spawn(process.execPath, ['--experimental-strip-types', self, '--sample', mode, zone], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let settled = false;
    const timeout = setTimeout(() => { timedOut = true; proc.kill(); }, timeoutMs);
    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');
    proc.stdout.on('data', (chunk) => { stdout += chunk; });
    proc.stderr.on('data', (chunk) => { stderr += chunk; });
    proc.on('error', (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({ mode, zone, error: `Could not start child: ${error.name}` });
    });
    proc.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const processWallMs = Number(process.hrtime.bigint() - start) / 1e6;
      if (timedOut || code !== 0) {
        // Do not include arbitrary process stderr in the artifact; preserve a bounded category.
        resolve({ mode, zone, processWallMs, error: timedOut ? 'Child timed out' : `Child failed (exit ${code}, signal ${signal ?? 'none'})`, stderrPresent: stderr.length > 0 });
        return;
      }
      try { resolve({ processWallMs, ...JSON.parse(stdout) }); }
      catch { resolve({ mode, zone, processWallMs, error: 'Child returned invalid JSON' }); }
    });
  });
}

async function main() {
  if (process.argv[2] === '--sample') return child(process.argv[3], process.argv[4]);
  const report = {
    description: 'Fresh-process diagnostic in one CI job. Cgroup data is shared and timings alone do not establish cause or real-user performance.',
    startedAt: new Date().toISOString(),
    node: process.versions.node,
    icu: process.versions.icu ?? null,
    availableParallelism: availableParallelism(),
    rounds,
    repeats,
    samples: [],
  };
  const save = () => writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  await save();
  // One and three children mirror the current worker cap without assuming actual simultaneous CPU.
  // Alternating order reduces, but does not eliminate, time/load bias.
  for (let round = 0; round < rounds; round++) {
    const widths = round % 2 ? [3, 1] : [1, 3];
    for (const width of widths) {
      for (const mode of ['schema', 'intl']) {
        for (const zone of zones) {
          const samples = await Promise.all(Array.from({ length: width }, () => runChild(mode, zone)));
          report.samples.push(...samples.map((sample) => ({ round: round + 1, concurrency: width, ...sample })));
          await save();
          console.log(JSON.stringify({ round: round + 1, concurrency: width, mode, zone, samples }));
        }
      }
    }
  }
  report.finishedAt = new Date().toISOString();
  await save();
  if (report.samples.some((sample) => sample.error)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Diagnostic failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
