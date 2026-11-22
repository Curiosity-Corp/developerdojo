import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { armoryEntries, armoryStackRecipes } from '../src/data/armory';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { validateArmory } from '../src/lib/armory';
import {
  FALLBACK_TEXT, LIFECYCLE_AREAS, MAINTAINER_ROLES, OWNERSHIP_MATRIX, ROLE_LABELS, addDays, lifecycleLedger, lifecycleRecordSchema, recordLifecycle, resolveLifecycle,
  type LifecycleRecordInput,
} from '../src/lib/catalog-lifecycle';
import { KataCatalogError, validateCuratedLifecycle } from '../src/lib/kata-catalog';

// Catalog lifecycle (#96): the ownership matrix, the computed states and the minimum fields gate.

const doc = readFileSync('docs/catalog-lifecycle.md', 'utf8');
const base = { area: 'integration-compatibility' as const, maintainerRole: 'Catalog maintainer', recorded: 'verified' as const, verifiedOn: '2026-11-20', provenance: ['source'] };
const problems = (input: unknown): readonly string[] => {
  try { validateCuratedLifecycle(input); return []; }
  catch (error) { if (error instanceof KataCatalogError) return error.problems; throw error; }
};
const catalogCopy = () => structuredClone(kataCatalog) as unknown as (Record<string, unknown> & { lifecycle: Record<string, unknown> })[];

describe('ownership matrix', () => {
  it('covers every area with an owner, a cadence, triggers and evidence', () => {
    expect(Object.keys(OWNERSHIP_MATRIX).sort()).toEqual([...LIFECYCLE_AREAS].sort());
    for (const policy of Object.values(OWNERSHIP_MATRIX)) {
      expect(MAINTAINER_ROLES).toContain(policy.owner);
      expect(policy.cadenceDays).toBeGreaterThan(0);
      expect(policy.triggers.length).toBeGreaterThan(0);
      expect(policy.evidence.length).toBeGreaterThan(0);
    }
  });

  it('is documented: the maintainer doc names every area, role and cadence', () => {
    for (const policy of Object.values(OWNERSHIP_MATRIX)) {
      const row = doc.split('\n').find((line) => line.startsWith(`| ${policy.label} |`));
      expect(row, `docs/catalog-lifecycle.md has no matrix row for ${policy.label}`).toBeDefined();
      expect(row).toContain(`| ${ROLE_LABELS[policy.owner]} |`);
      expect(row).toContain(`| ${policy.cadenceDays} days |`);
    }
    for (const label of Object.values(ROLE_LABELS)) expect(doc).toContain(label);
  });

  it('keeps people out: roles only, no person fields', () => {
    expect(() => lifecycleRecordSchema.parse({ ...kataCatalog[0]?.lifecycle, person: 'Someone' })).toThrow();
  });
});

describe('resolveLifecycle', () => {
  it('is verified inside the cadence and stale the day after it', () => {
    const due = addDays('2026-11-20', 90);
    expect(due).toBe('2027-02-18');
    expect(resolveLifecycle(base, due)).toMatchObject({ state: 'verified', dueOn: due });
    expect(resolveLifecycle(base, addDays(due, 1))).toMatchObject({ state: 'stale', reason: 'Its review date has passed.' });
  });

  it('uses the earlier of the cadence and the entry’s own next review', () => {
    expect(resolveLifecycle({ ...base, nextReview: '2026-12-01' }, '2026-12-02').state).toBe('stale');
    expect(resolveLifecycle({ ...base, nextReview: '2027-12-01' }, '2026-12-02')).toMatchObject({ state: 'verified', dueOn: '2027-02-18' });
  });

  it('is stale at once when a change is reported after the last check', () => {
    const view = resolveLifecycle({ ...base, changeReported: { date: '2026-11-22', change: 'Version 2 is out.' } }, '2026-11-22');
    expect(view.state).toBe('stale');
    expect(view.reason).toContain('Version 2 is out.');
  });

  it('is stale when never verified and unavailable when withdrawn', () => {
    const unverified = { area: base.area, maintainerRole: base.maintainerRole, recorded: base.recorded, provenance: base.provenance };
    expect(resolveLifecycle(unverified, '2026-11-22')).toMatchObject({ state: 'stale', reason: 'This entry has not been verified yet.' });
    expect(resolveLifecycle({ ...base, recorded: 'unavailable', reason: 'Gone.' }, '2026-11-22')).toMatchObject({ state: 'unavailable', reason: 'Gone.' });
  });

  it('has fallback text for every state that is not verified', () => {
    expect(FALLBACK_TEXT.stale).toMatch(/source/);
    expect(FALLBACK_TEXT.unavailable).toMatch(/progress/);
  });
});

describe('curated kata catalog: minimum lifecycle fields', () => {
  it('passes for the published catalog', () => {
    expect(problems(kataCatalog)).toEqual([]);
    for (const entry of validateCuratedLifecycle(kataCatalog)) expect(recordLifecycle(entry.lifecycle, entry.lifecycle.verifiedOn).state).toBe('verified');
  });

  it('fails when an entry has no lifecycle record', () => {
    const copy = catalogCopy();
    delete (copy[0] as Record<string, unknown>)['lifecycle'];
    expect(problems(copy)).toEqual([expect.stringMatching(/^PRACTICE-001: lifecycle:/)]);
  });

  for (const field of ['area', 'maintainerRole', 'verifiedOn', 'checked', 'provenance', 'state'] as const) {
    it(`fails when lifecycle.${field} is missing`, () => {
      const copy = catalogCopy();
      delete copy[1]?.lifecycle[field];
      expect(problems(copy)).toEqual([expect.stringMatching(new RegExp(`^PRACTICE-002: lifecycle\\.${field}:`))]);
    });
  }

  it('fails when an unavailable entry gives no reason, or a change report predates the check', () => {
    const copy = catalogCopy();
    if (copy[2]) copy[2].lifecycle['state'] = 'unavailable';
    if (copy[3]) copy[3].lifecycle['changeReported'] = { date: '2020-01-01', change: 'Old news.' };
    expect(problems(copy)).toEqual(expect.arrayContaining([
      expect.stringMatching(/^PRACTICE-003: lifecycle\.reason:/), expect.stringMatching(/^PRACTICE-004: lifecycle\.changeReported\.date:/),
    ]));
  });

  it('rejects an unknown maintainer role', () => {
    const record: LifecycleRecordInput = { ...(kataCatalog[0]?.lifecycle as LifecycleRecordInput) };
    expect(lifecycleRecordSchema.safeParse({ ...record, maintainerRole: 'site-owner' }).success).toBe(false);
  });
});

describe('the exercised change (Claude Code 2.1.330)', () => {
  const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory()
      ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
      : []);
  const armory = (today: string) => validateArmory({ entries: armoryEntries, recipes: armoryStackRecipes }, { resources: resourceIds(), kataStackRecipes: kataDimensions.stackRecipes, today });
  const claudeCode = (today: string) => armory(today).entries.find((resolved) => resolved.entry.id === 'claude-code')?.lifecycle;

  it('is due with the reported change, keeping its last real check date and owner', () => {
    const view = claudeCode('2026-11-22');
    expect(view).toMatchObject({ state: 'stale', verifiedOn: '2026-11-20', maintainerRole: 'Catalog maintainer', area: 'harness-model-pricing' });
    expect(view?.reason).toContain('2.1.330');
  });

  it('appears in the ledger the weekly report reads', () => {
    const rows = armory('2026-11-22').entries.map((resolved) => ({ id: resolved.entry.id, surface: 'armory' as const, title: resolved.entry.name, href: `/armory/registry#${resolved.entry.id}`, ...resolved.lifecycle }));
    const ledger = lifecycleLedger(rows, '2026-11-22');
    expect(ledger.entries.find((row) => row.id === 'claude-code')?.state).toBe('stale');
    expect(ledger.matrix).toHaveLength(LIFECYCLE_AREAS.length);
  });
});
