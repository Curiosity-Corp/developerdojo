import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The agriculture pathway (#93). tools/agri_pathway.py computes everything under generated/, and the CI job
// agriculture_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/agriculture-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const RECORD = 'inputs/noaa-ghcnd-USW00093193-2023.csv';
const PINNED_RECORD = 'abde499065220574370762a23f9acc7a60b76c0951a02da95b770bc003b3b9a7';

interface Check { id: string; published: number; computed: number; status: string }
interface Season { et0_mm: number; etc_mm: number; rain_mm: number; effectiveRain_mm: number; irrigationNeed_mm: number }
interface Month extends Season { month: string; daysUnavailable: number }
interface Irrigation { planting: string; harvest: string; seasonDays: number; kc: { initial: number; mid: number; end: number }; months: Month[]; season: Season }
interface Card { season: Season; changeInIrrigationNeed_mm: number }

describe('agriculture pathway files', () => {
  it('serves the NOAA record unchanged, at the hash the manifest records', () => {
    const digest = createHash('sha256').update(readFileSync(join(EX, RECORD))).digest('hex');
    expect(digest).toBe(PINNED_RECORD);
    expect(json<{ inputs: Record<string, string> }>('manifest.json').inputs).toEqual({ [RECORD]: PINNED_RECORD });
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('reproduces every FAO reference value it lists', () => {
    const result = json<{ passed: number; failed: number; checks: Check[] }>('reference-checks.json');
    expect(result.failed).toBe(0);
    expect(result.passed).toBe(result.checks.length);
    expect(result.checks.map((check) => check.id)).toEqual(expect.arrayContaining(['EX8-Ra', 'EX18-ET0', 'TM3-Pe-260']));
    for (const check of result.checks) expect(check.computed, check.id).toBe(check.published);
  });

  it('adds up: monthly irrigation need is ETc minus effective rain, and the season is the sum of its months', () => {
    const irrigation = json<Irrigation>('irrigation.json');
    expect(irrigation).toMatchObject({ planting: '2023-04-01', harvest: '2023-08-28', seasonDays: 150, kc: { initial: 0.3, mid: 1.2, end: 0.35 } });
    for (const month of irrigation.months) expect(month.irrigationNeed_mm, month.month).toBeCloseTo(month.etc_mm - month.effectiveRain_mm, 1);
    const sum = (key: keyof Season) => irrigation.months.reduce((total, month) => total + month[key], 0);
    for (const key of ['et0_mm', 'etc_mm', 'rain_mm', 'irrigationNeed_mm'] as const) expect(irrigation.season[key], key).toBeCloseTo(sum(key), 0);
  });

  it('matches the numbers the recipes quote', () => {
    const irrigation = json<Irrigation>('irrigation.json');
    expect(irrigation.season).toEqual({ et0_mm: 835.3, etc_mm: 726.8, rain_mm: 13.8, effectiveRain_mm: 0, irrigationNeed_mm: 726.8 });
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, card.changeInIrrigationNeed_mm]))).toEqual({ A: 22.5, B: 26.9, C: -2.4 });
    const inspection = json<{ rows: number; missingDates: string[]; elements: Record<string, { missing: number; qualityFlags: Record<string, number> }> }>('inspection.json');
    expect(inspection.rows).toBe(365);
    expect(inspection.missingDates).toEqual([]);
    for (const element of Object.values(inspection.elements)) expect(element).toMatchObject({ missing: 0, qualityFlags: {} });
  });

  it('has one daily row for every day of the record', () => {
    const lines = readFileSync(join(GEN, 'et0-daily.csv'), 'utf8').trim().split('\n');
    expect(lines[0]).toBe('date,tmax,tmin,prcp,ra,rs,et0_pm,et0_hargreaves');
    expect(lines).toHaveLength(366);
  });

  it('names no person and claims no approval in what it publishes', () => {
    for (const path of ['README.md', 'tools/agri_pathway.py', 'generated/summary.md']) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).not.toMatch(/\b(Allen|Pereira|Raes|Smith|Brouwer|Heibloem|Menne)\b/);
      expect(text, path).toMatch(/(not|nothing here is) an irrigation recommendation/i);
    }
  });
});
