/** A scored run has passed and attempted checks; NA/NA records an unassessed run. */
export interface ArenaRun {
  passed: number | null;
  attempted: number | null;
  cost: number | null;
  seconds: number | null;
}

export type RunParse = { ok: true; runs: ArenaRun[] } | { ok: false; error: string };

function optionalNumber(value: string): number | null | undefined {
  if (!value) return null;
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)) return undefined;
  const number = Number(value);
  if (number === 0 && /[1-9]/.test(value)) return undefined;
  return Number.isFinite(number) && number <= 1_000_000_000 ? number : undefined;
}

/** Each line is passed, attempted, cost, seconds. A blank cost or duration is unknown. */
export function parseArenaRuns(raw: string): RunParse {
  const lines = raw.split(/\r?\n/).map((line, index) => ({ text: line.trim(), number: index + 1 })).filter((line) => line.text);
  if (!lines.length) return { ok: false, error: 'Enter at least one run.' };
  if (lines.length > 100) return { ok: false, error: 'Use at most 100 runs per setup.' };
  const runs: ArenaRun[] = [];
  for (const line of lines) {
    const values = line.text.split(',').map((value) => value.trim());
    if (values.length !== 4) return { ok: false, error: `Line ${line.number}: use four comma-separated fields.` };
    const [passedRaw = '', totalRaw = '', costRaw = '', secondsRaw = ''] = values;
    const unassessed = passedRaw.toUpperCase() === 'NA' && totalRaw.toUpperCase() === 'NA';
    let passed: number | null = null;
    let attempted: number | null = null;
    if (!unassessed) {
      if (!/^\d+$/.test(passedRaw) || !/^\d+$/.test(totalRaw)) return { ok: false, error: `Line ${line.number}: use whole-number checks or NA,NA.` };
      passed = Number(passedRaw); attempted = Number(totalRaw);
      if (!Number.isSafeInteger(passed) || !Number.isSafeInteger(attempted) || attempted < 1 || attempted > 1_000_000 || passed > attempted) {
        return { ok: false, error: `Line ${line.number}: checks passed must be from zero to the checks attempted.` };
      }
    }
    const cost = optionalNumber(costRaw); const seconds = optionalNumber(secondsRaw);
    if (cost === undefined || seconds === undefined) return { ok: false, error: `Line ${line.number}: cost and seconds must be nonnegative numbers or blank.` };
    runs.push({ passed, attempted, cost, seconds });
  }
  return { ok: true, runs };
}

export function sameRubricSize(a: ArenaRun[], b: ArenaRun[]): boolean {
  return new Set([...a, ...b].flatMap((run) => run.attempted === null ? [] : [run.attempted])).size <= 1;
}

export function summarizeArenaRuns(label: string, runs: ArenaRun[]): string {
  const assessed = runs.filter((run) => run.passed !== null && run.attempted !== null);
  const passed = assessed.reduce((sum, run) => sum + (run.passed ?? 0), 0);
  const attempted = assessed.reduce((sum, run) => sum + (run.attempted ?? 0), 0);
  const checks = assessed.length ? `${passed}/${attempted} checks passed across ${assessed.length} assessed ${assessed.length === 1 ? 'run' : 'runs'}` : 'No checks assessed';
  const summarizeMetric = (name: string, values: (number | null)[]) => {
    const missing = values.filter((value) => value === null).length;
    if (missing) return `${name}: unknown for ${missing}/${values.length} runs; no average calculated`;
    const mean = values.reduce<number>((sum, value) => sum + (value ?? 0), 0) / values.length;
    return `${name}: approximately ${Number(mean.toPrecision(6))} average per run`;
  };
  return `${label}: ${runs.length} runs; ${checks}; ${runs.length - assessed.length} unassessed. ${summarizeMetric('Cost', runs.map((run) => run.cost))}. ${summarizeMetric('Seconds', runs.map((run) => run.seconds))}.`;
}
