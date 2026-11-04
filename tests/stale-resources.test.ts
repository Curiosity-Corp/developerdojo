import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

// The quarterly refresh list (#58): scripts/list-stale-resources.mjs reads resource YAML only.
const dir = mkdtempSync(join(tmpdir(), 'stale-resources-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

function resource(path: string, provider: string, title: string, verifiedOn?: string): void {
  mkdirSync(join(dir, path, '..'), { recursive: true });
  const lines = [`title: "${title}"`, `provider: "${provider}"`, `url: "https://example.org/${title}"`];
  if (verifiedOn) lines.push(`verifiedOn: ${verifiedOn}`);
  writeFileSync(join(dir, path), `${lines.join('\n')}\n`);
}

resource('b/fresh.yaml', 'Beta Publisher', 'fresh', '2027-01-20');
resource('b/old.yaml', 'Beta Publisher', 'old', '2026-10-01');
resource('a/edge.yaml', 'Alpha Publisher', 'edge', '2026-11-03');
resource('a/undated.yaml', 'Alpha Publisher', 'undated');

function run(...extra: string[]): string {
  return execFileSync('node', ['scripts/list-stale-resources.mjs', '--dir', dir, ...extra], { encoding: 'utf8' });
}

describe('list-stale-resources', () => {
  it('lists resources older than 90 days and undated ones, grouped by provider, and exits 0', () => {
    const out = run('--today', '2027-02-01');
    expect(out).toContain('2 of 4 resources need a fresh check.');
    expect(out).toContain('- [ ] [old](https://example.org/old) · verified 2026-10-01 (123 days)');
    expect(out).toContain('[undated](https://example.org/undated) · verified missing (date missing)');
    expect(out).not.toContain('[fresh]');
    expect(out.indexOf('## Alpha Publisher')).toBeLessThan(out.indexOf('## Beta Publisher'));
  });

  it('treats exactly 90 days as fresh and 91 days as stale', () => {
    expect(run('--today', '2027-02-01')).not.toContain('[edge]');
    expect(run('--today', '2027-02-02')).toContain('[edge]');
  });

  it('honours --days', () => {
    expect(run('--today', '2027-02-01', '--days', '400')).toContain('1 of 4 resources need a fresh check.');
  });

  // Reads every resource file (861 today), so it can pass the 5 s default on a busy machine.
  it('runs clean on the real catalogue', { timeout: 30_000 }, () => {
    const out = execFileSync('node', ['scripts/list-stale-resources.mjs'], { encoding: 'utf8' });
    expect(out).toMatch(/^# Stale resources/);
  });
});
