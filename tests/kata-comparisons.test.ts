import { describe, expect, it } from 'vitest';
import { arenaFileContext, arenaRecordFiles } from '../src/lib/arena-content';
import { resolveArenaRecords, type ArmMeasurement, type ResolvedArenaRecord } from '../src/lib/arena-records';
import { kataComparisons } from '../src/lib/kata-comparisons';

// The comparisons a kata recipe page shows (#84) come from the Arena records (#89), computed from the run files.

const records = resolveArenaRecords(arenaRecordFiles(), arenaFileContext(process.cwd(), '2026-11-21'));
const byId = (id: string): ResolvedArenaRecord => {
  const found = records.find((item) => item.record.id === id);
  if (!found) throw new Error(`no record ${id}`);
  return found;
};
const measured = (id: string, arm: string): ArmMeasurement => {
  const value = byId(id).arms[arm];
  if (value?.kind !== 'measured') throw new Error(`${id} ${arm} is not measured`);
  return value;
};
const summary = (rows: ReturnType<typeof kataComparisons>) => rows.map((row) => `${row.variable}:${row.status}:${row.recordId}`);

describe('FND-001 comparisons on the recipe page', () => {
  const rows = kataComparisons('FND-001', records);

  it('show the harness, model and instructions as measured, and skill, tool and delegation as proposed', () => {
    expect(summary(rows)).toEqual([
      'harness:measured:ARN-003', 'model:measured:ARN-001', 'instructions:measured:ARN-001',
      'skill:proposed:ARN-001', 'tool:proposed:ARN-001', 'delegation:proposed:ARN-001',
    ]);
  });

  it('carry the numbers the Arena record computes, never typed ones', () => {
    for (const row of rows) {
      if (row.status !== 'measured') continue;
      for (const arm of [row.control, row.variant]) {
        const value = measured(row.recordId, arm.id);
        expect(arm.measured, `${row.variable} ${arm.id}`).toEqual({
          runs: value.runs,
          passingAll: value.passingAll,
          afterCorrection: expect.objectContaining({ count: value.passingAll.count + value.corrections.passingAll, of: value.runs }),
          meanSeconds: value.meanSeconds,
          totalCostUsd: value.totalCostUsd,
          costBasis: value.costBasis,
        });
      }
      expect(row.recordHref).toBe(byId(row.recordId).href);
    }
  });

  it('leave out kata records of other katas and the external benchmark', () => {
    expect(kataComparisons('NOPE-001', records)).toEqual([]);
    expect(rows.some((row) => row.recordId === 'ARN-002')).toBe(false);
  });
});

describe('comparison rules', () => {
  it('show a proposed design again when the record that measured it is superseded', () => {
    const superseded = records.map((item) => item.record.id === 'ARN-003' ? { ...item, supersededBy: { id: 'ARN-999', slug: 'later', href: '/arena/evidence/later' } } : item);
    const rows = kataComparisons('FND-001', superseded);
    expect(summary(rows)[0]).toBe('harness:proposed:ARN-001');
    expect(rows.some((row) => row.recordId === 'ARN-003')).toBe(false);
  });

  it('show one proposed row per variable, from the newest record', () => {
    const copy: ResolvedArenaRecord = { ...byId('ARN-001'), slug: 'copy', href: '/arena/evidence/copy', record: { ...byId('ARN-001').record, id: 'ARN-998', date: '2026-11-22' } };
    const rows = kataComparisons('FND-001', [...records, copy]);
    expect(rows.filter((row) => row.variable === 'skill').map((row) => row.recordId)).toEqual(['ARN-998']);
  });

  it('show an arm without Dojo measurements as unmeasured, never as zero', () => {
    const base = byId('ARN-001');
    const arms = Object.fromEntries(Object.entries(base.arms).filter(([id]) => id !== 'instructions'));
    const rows = kataComparisons('FND-001', [{ ...base, arms }]);
    const row = rows.find((item) => item.variable === 'instructions');
    expect(row?.status).toBe('measured');
    if (row?.status === 'measured') expect(row.variant.measured).toBeUndefined();
  });
});
