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

  it('lists non-verified catalog entries from the lifecycle ledger by owning role (#96)', () => {
    const ledgerPath = join(dir, 'catalog-lifecycle.json');
    const row = (id: string, state: string, maintainerRole: string, extra: Record<string, string> = {}) => ({
      id, surface: 'armory', title: id, href: `/armory/registry#${id}`, state, area: 'integration-compatibility', maintainerRole, provenance: ['x'], ...extra,
    });
    writeFileSync(ledgerPath, JSON.stringify({ generatedOn: '2026-11-22', matrix: [], entries: [
      row('fine', 'verified', 'Catalog maintainer', { verifiedOn: '2026-11-20', dueOn: '2027-02-18' }),
      row('changed', 'stale', 'Catalog maintainer', { verifiedOn: '2026-11-20', dueOn: '2027-02-18', reason: 'A change was reported.' }),
      row('gone', 'unavailable', 'Kata maintainer', { reason: 'Withdrawn upstream.' }),
    ] }));
    const out = execFileSync('node', ['scripts/list-stale-resources.mjs', '--catalog', ledgerPath], { encoding: 'utf8' });
    expect(out).toContain('2 of 3 catalog entries are not verified.');
    expect(out).toContain('- [ ] review due: [changed](/armory/registry#changed) (armory changed, integration-compatibility) · verified 2026-11-20 · due 2027-02-18 · A change was reported.');
    expect(out).toContain('- [ ] unavailable: [gone](/armory/registry#gone) (armory gone, integration-compatibility) · never verified · Withdrawn upstream.');
    expect(out).not.toContain('[fine]');
    expect(out.indexOf('## Catalog maintainer')).toBeLessThan(out.indexOf('## Kata maintainer'));
  });

  it('exits 2 on an unreadable ledger', () => {
    expect(() => execFileSync('node', ['scripts/list-stale-resources.mjs', '--catalog', join(dir, 'missing.json')], { encoding: 'utf8', stdio: 'pipe' })).toThrow(/cannot read catalog ledger/);
  });

  // Reads every resource file (861 today), so it can pass the 5 s default on a busy machine.
  it('runs clean on the real catalogue', { timeout: 30_000 }, () => {
    const out = execFileSync('node', ['scripts/list-stale-resources.mjs'], { encoding: 'utf8' });
    expect(out).toMatch(/^# Stale resources/);
  });
});
