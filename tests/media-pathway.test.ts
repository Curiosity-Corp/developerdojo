import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The media pathway (#93). tools/media_pathway.py computes everything under generated/, and the CI job
// media_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/media-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const AUDIO = 'inputs/artemis-ii-launch-pad-camera-site-4.wav';
const PINNED_AUDIO = '18b1c6c1dae385f4f9e69b36377d41399ec50c50ce532dfbf1041962e838410d';

interface Check { id: string; case: number; expected: string; computed: string; status: string }
interface Card { title: string; integrated_LUFS: string; changeFromBS1770_LU: string }

describe('media pathway files', () => {
  it('serves NASA’s recording unchanged, at the hash the manifest records, as 48 kHz 16-bit stereo PCM', () => {
    const bytes = readFileSync(join(EX, AUDIO));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(PINNED_AUDIO);
    expect(createHash('sha1').update(bytes).digest('hex')).toBe('b05c096ee0279ce700741f0852dea19f80038b4e');
    expect(bytes.length).toBe(6343708);
    expect(json<{ inputs: Record<string, string> }>('manifest.json').inputs).toEqual({ [AUDIO]: PINNED_AUDIO });
    expect(bytes.toString('latin1', 0, 4)).toBe('RIFF');
    expect(bytes.toString('latin1', 8, 16)).toBe('WAVEfmt ');
    // fmt chunk: PCM (1), 2 channels, 48000 Hz, 16 bits per sample.
    expect([bytes.readUInt16LE(20), bytes.readUInt16LE(22), bytes.readUInt32LE(24), bytes.readUInt16LE(34)]).toEqual([1, 2, 48000, 16]);
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(['inspection.json', 'loudness-series.csv', 'loudness.json', 'manifest.json', 'normalisation.json', 'randori/cards.json', 'reference-checks.json', 'summary.md']);
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('gives every EBU Tech 3341 test response it lists within its tolerance', () => {
    const result = json<{ passed: number; failed: number; checks: Check[] }>('reference-checks.json');
    expect([result.passed, result.failed, result.checks.length]).toEqual([59, 0, 59]);
    for (const check of result.checks) expect(check.status, check.id).toBe('pass');
    expect([...new Set(result.checks.map((check) => check.case))]).toEqual([1, 2, 3, 4, 5, 6, 9, 10, 12, 13, 15, 16, 17, 18, 19]);
    const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));
    expect([byId['case1-I']?.expected, byId['case1-I']?.computed]).toEqual(['-23.0 +/-0.1 LUFS', '-22.99 LUFS']);
    expect(byId['case6-I']?.computed).toBe('-23.02 LUFS');
    expect([byId['case19-TP']?.expected, byId['case19-TP']?.computed]).toEqual(['3.0 +0.2/-0.4 dBTP', '3.03 dBTP']);
  });

  it('matches the numbers the page and recipes quote', () => {
    const inspection = json<{ header: Record<string, number | string>; channels: { samplePeak_dBFS: string; rms_dBFS: string; samplesAtFullScale: number }[]; channelsIdentical: boolean }>('inspection.json');
    expect([inspection.header.channels, inspection.header.sampleRate_Hz, inspection.header.bitsPerSample, inspection.header.frames, inspection.header.duration_s]).toEqual([2, 48000, 16, 1582381, '32.966']);
    expect(inspection.channels.map((channel) => [channel.samplePeak_dBFS, channel.rms_dBFS, channel.samplesAtFullScale])).toEqual([['-10.99', '-32.32', 0], ['-10.99', '-32.32', 0]]);
    expect(inspection.channelsIdentical).toBe(true);
    const loudness = json<Record<string, unknown>>('loudness.json');
    expect([loudness.integrated_LUFS, loudness.relativeGate_LUFS, loudness.gatingBlocks, loudness.gatingBlocksUsed, loudness.maxMomentary_LUFS, loudness.maxShortTerm_LUFS, loudness.maxTruePeak_dBTP]).toEqual(['-27.92', '-40.06', 326, 193, '-23.14', '-23.85', '-10.98']);
    const plan = json<Record<string, unknown>>('normalisation.json');
    expect([plan.target_LUFS, plan.maxTruePeak_dBTP, plan.gain_dB, plan.remeasuredAfterGain_LUFS, plan.truePeakAfterGain_dBTP, plan.truePeakWithinLimitAfterGain, plan.gainAllowedByTruePeak_dB, plan.withinToleranceAsDelivered]).toEqual(['-23.0', '-1.0', '4.92', '-23.02', '-6.06', true, '9.98', false]);
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, [card.integrated_LUFS, card.changeFromBS1770_LU]]))).toEqual({ A: ['-27.87', '0.05'], B: ['-30.06', '-2.14'], C: ['-30.93', '-3.01'] });
    // Every card is measured against the MED-002 integrated loudness.
    for (const card of Object.values(cards)) expect(Number(card.integrated_LUFS) - Number(card.changeFromBS1770_LU)).toBeCloseTo(-27.92, 2);
  });

  it('has one loudness row every 100 ms, from the first full momentary window to the end', () => {
    const lines = readFileSync(join(GEN, 'loudness-series.csv'), 'utf8').trim().split('\n');
    expect(lines[0]).toBe('time_s,momentary_LUFS,shortTerm_LUFS');
    expect(lines).toHaveLength(327);
    expect(lines[1]?.startsWith('0.4,')).toBe(true);
    expect(lines.filter((line) => line.startsWith('3.0,'))[0]?.split(',')[2]).not.toBe('');
  });

  it('carries no email address and claims no compliance in what it publishes', () => {
    for (const path of ['README.md', 'tools/media_pathway.py', 'tools/fetch_input.py', 'generated/summary.md']) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
    }
    for (const path of ['README.md', 'generated/summary.md']) expect(readFileSync(join(EX, path), 'utf8'), path).toMatch(/not a broadcast\s+compliance check/i);
  });
});
