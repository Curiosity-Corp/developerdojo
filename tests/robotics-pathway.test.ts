import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The robotics pathway (#93). tools/robotics_pathway.py computes everything under generated/, and the CI job
// robotics_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/robotics-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(join(EX, path))).digest('hex');
const PINNED = {
  'inputs/ur-description-LICENSE.txt': '143077f9f6a8de5a99f78c2c2472801fb53cf240277ef661642f079b9acdfff8',
  'inputs/ur5-default-kinematics.yaml': '4559bd027c93ce7c0e2a343d6f71f742fe4a67ea9d7ef67535189f4efbe9c3ac',
  'scenario/configurations.csv': '8889288dd14fdeb1e22b912d3703e9d6080a5ddc038f23358eebf1ed29efb31e',
  'scenario/targets.csv': '6315a3d82c01d18de30271d07968de7a6b6e694ecbe30eda35feee8e77a9c17d',
};

interface Check { function: string; printed: string; computed: string; pass: boolean }
interface DhEntry { parameter: string; publishedValue_m: number; fileEntry: string; sign: string; equal: boolean }
interface Pose { configuration: string; position_m: string[]; detJs: string; largestDisagreement: string }
interface Solve { target: string; guess: string; success: boolean; iterations: number; thetas_rad: string[] | null; checkByChain?: { orientationError_mrad: string; positionError_mm: string }; reason?: string }

describe('robotics pathway files', () => {
  it('serves the UR5 file, its licence and the scenario unchanged, at the hashes the manifest records', () => {
    const inputs = json<{ inputs: Record<string, string> }>('manifest.json').inputs;
    expect(inputs).toEqual(PINNED);
    for (const [path, hash] of Object.entries(PINNED)) expect(sha256(path), path).toBe(hash);
    expect(readFileSync(join(EX, 'inputs/ur5-default-kinematics.yaml')).length).toBe(639);
    expect(readFileSync(join(EX, 'inputs/ur-description-LICENSE.txt'), 'utf8')).toMatch(/Redistribution and use in source and binary forms/);
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(['ik.json', 'inspection.json', 'manifest.json', 'poses.csv', 'poses.json', 'randori/cards.json', 'reference-checks.json', 'summary.md']);
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('reproduces every value printed in the code library’s worked examples', () => {
    const result = json<{ passed: number; failed: number; functions: string[]; checks: Check[] }>('reference-checks.json');
    expect([result.passed, result.failed, result.checks.length]).toEqual([188, 0, 188]);
    expect(result.functions).toHaveLength(12);
    for (const check of result.checks) {
      expect(check.pass, `${check.function} ${check.printed}`).toBe(true);
      expect(Number(check.computed), `${check.function} ${check.printed}`).toBeCloseTo(Number(check.printed), 6);
    }
    expect(new Set(result.checks.map((check) => check.function))).toEqual(new Set(result.functions));
  });

  it('maps the six DH lengths to the file, d5 with its sign reversed, as ROB-001 asks the learner to find', () => {
    const inspection = json<{ dhTable: { fileEntries: DhEntry[] }; numericalResidue: { entry: string }[]; reachBound_m: string }>('inspection.json');
    expect(inspection.dhTable.fileEntries.map((entry) => [entry.parameter, entry.fileEntry, entry.sign, entry.equal])).toEqual([
      ['d1', 'shoulder.z', '+', true],
      ['a2', 'forearm.x', '+', true],
      ['a3', 'wrist_1.x', '+', true],
      ['d4', 'wrist_1.z', '+', true],
      ['d5', 'wrist_2.y', '-', true],
      ['d6', 'wrist_3.y', '+', true],
    ]);
    expect(inspection.numericalResidue.map((residue) => residue.entry)).toEqual(['wrist_2.z', 'wrist_3.z']);
    expect(inspection.reachBound_m).toBe('1.10335');
  });

  it('computes the poses the page and recipes quote, three methods agreeing, and the singular configurations', () => {
    const poses = json<{ agreement: { tolerance: number; largestDisagreement: string }; configurations: Pose[] }>('poses.json');
    expect(Number(poses.agreement.largestDisagreement)).toBeLessThan(poses.agreement.tolerance);
    expect(poses.configurations.map((pose) => [pose.configuration, pose.position_m.join(', '), pose.detJs])).toEqual([
      ['home', '-0.817250, -0.191450, -0.005491', '0.000000'],
      ['upright', '0.000000, -0.191450, 1.001059', '0.000000'],
      ['reach', '-0.496712, -0.328511, 0.303252', '-0.097153'],
      ['side', '-0.524965, 0.485946, 0.284606', '-0.110114'],
      ['wrist-straight', '-0.462450, -0.403379, 0.385517', '0.000000'],
    ]);
    const csv = readFileSync(join(GEN, 'poses.csv'), 'utf8').trim().split('\n');
    expect(csv).toHaveLength(6);
  });

  it('finds the joint solutions, checks each by the joint chain, and reports the target out of reach as no solution', () => {
    const ik = json<{ tolerances: { orientation_rad: number; position_m: number }; solutions: Solve[] }>('ik.json');
    expect(ik.solutions.map((solve) => [solve.target, solve.guess, solve.success, solve.iterations])).toEqual([
      ['pick', 'near', true, 2],
      ['pick', 'elbow-other-way', true, 3],
      ['place', 'near', true, 3],
      ['beyond-reach', 'near', false, 20],
    ]);
    expect(ik.solutions[0]?.thetas_rad).toEqual(['0.399987', '-1.300089', '1.600003', '-1.899947', '-1.570851', '0.199920']);
    expect(ik.solutions[1]?.thetas_rad).toEqual(['0.399987', '0.217418', '-1.599960', '-0.217429', '-1.570789', '0.199966']);
    for (const solve of ik.solutions.filter((candidate) => candidate.success)) {
      expect(Number(solve.checkByChain?.orientationError_mrad) / 1000, solve.target).toBeLessThan(ik.tolerances.orientation_rad);
      expect(Number(solve.checkByChain?.positionError_mm) / 1000, solve.target).toBeLessThan(ik.tolerances.position_m);
    }
    const beyond = ik.solutions[3];
    expect(beyond?.thetas_rad).toBeNull();
    expect(beyond?.reason).toMatch(/1\.208 m from the shoulder joint, beyond the 1\.103 m bound/);
  });

  it('recomputes the four Randori cards', () => {
    const cards = json<Record<string, { positionChange_mm?: string; orientationChange_deg?: string; detJsBefore?: string; detJsAfter?: string }>>('randori/cards.json');
    expect([cards.A?.positionChange_mm, cards.A?.orientationChange_deg]).toEqual(['807.64', '151.911']);
    expect([cards.B?.positionChange_mm, cards.B?.orientationChange_deg]).toEqual(['0.29', '0.000']);
    expect([cards.C?.positionChange_mm, cards.C?.orientationChange_deg]).toEqual(['189.30', '0.000']);
    expect([cards.D?.detJsBefore, cards.D?.detJsAfter]).toEqual(['-0.097153', '0.000000']);
  });

  it('says it is simulation only and not a safety assessment, and carries no email address', () => {
    for (const path of ['README.md', 'tools/robotics_pathway.py', 'tools/fetch_input.py', 'generated/summary.md', 'scenario/configurations.csv', 'scenario/targets.csv']) {
      expect(readFileSync(join(EX, path), 'utf8'), path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
    }
    for (const path of ['README.md', 'generated/summary.md']) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).toMatch(/simulation\s+only/i);
      expect(text, path).toMatch(/not\s+a\s+safety\s+assessment|nothing\s+here\s+is\s+a\s+safety\s+assessment/i);
    }
    expect(readFileSync(join(EX, 'README.md'), 'utf8')).toMatch(/ISO 10218-1 and ISO 10218-2 are named only/);
  });
});
