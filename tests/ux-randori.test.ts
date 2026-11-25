import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkStructure } from '../public/examples/ux-pathway/tools/ux_pathway.mjs';
import { CONSTRAINT_CHECKS, checkConstraint, diffFlows } from '../public/examples/ux-pathway/tools/ux_randori.mjs';

// The worked UX Randori rounds (UX-R01, #91). The ux_pathway CI job reruns the script and diffs its output; these
// tests pin what the page quotes, and prove each hidden-constraint check fails when the adapted flow breaks it, so a
// passing round means something.

const DIR = 'public/examples/ux-pathway/';
const json = (path: string): unknown => JSON.parse(readFileSync(DIR + path, 'utf8'));

interface Element { type: string; label?: string; value?: string; to?: string }
interface State { id: string; screen: string; kind: string; elements: Element[]; undoSeconds?: number; awaits?: string; offline?: boolean }
interface Transition { from: string; to: string; kind: string; commits?: boolean; undo?: boolean; actor?: string }
interface Flow { states: State[]; transitions: Transition[] }
interface Round { id: string; constraint: { id: string; text: string }; first: Flow; adapted: Flow }
interface RoundResult { id: string; first: { constraint: { pass: boolean } }; adapted: { structure: { pass: boolean }; constraint: { pass: boolean } }; diff: Record<string, string[]>; files: string[] }

const input = json('inputs/randori-rounds.json') as { rounds: Round[] };
const generated = json('generated/randori/rounds.json') as { pass: boolean; rounds: RoundResult[] };
const manifest = json('generated/manifest.json') as { outputs: string[] };
const round = (id: string): Round => {
  const found = input.rounds.find((r) => r.id === id);
  if (!found) throw new Error('no round ' + id);
  return structuredClone(found);
};

describe('the published Randori rounds', () => {
  it('cover every hidden constraint that has a flow check, each in its own round', () => {
    expect(input.rounds.map((r) => r.constraint.id).sort()).toEqual(Object.keys(CONSTRAINT_CHECKS).sort());
  });

  it('pass in the generated record: the first sitemap misses the constraint, the adapted one meets it', () => {
    expect(generated.pass).toBe(true);
    expect(generated.rounds.map((r) => r.id)).toEqual(input.rounds.map((r) => r.id));
    for (const r of generated.rounds) {
      expect(r.first.constraint.pass, r.id).toBe(false);
      expect(r.adapted.constraint.pass, r.id).toBe(true);
      expect(r.adapted.structure.pass, r.id).toBe(true);
      for (const file of r.files) expect(manifest.outputs, file).toContain(file);
    }
  });

  it('re-check here the same way', () => {
    for (const r of input.rounds) {
      for (const flow of [r.first, r.adapted]) expect(checkStructure(flow).filter((c) => !c.pass), r.id).toEqual([]);
      expect(checkConstraint(r.first, r.constraint.id).pass, r.id).toBe(false);
      expect(checkConstraint(r.adapted, r.constraint.id).failures, r.id).toEqual([]);
    }
  });

  it('record what the constraint changed, computed from the flows', () => {
    const a = round('A');
    expect(diffFlows(a.first, a.adapted).statesRemoved).toEqual(['cancel-dialog']);
    expect(generated.rounds.find((r) => r.id === 'B')?.diff.statesAdded).toEqual(['requested', 'declined']);
  });

  it('refuse a constraint without a check', () => {
    expect(() => checkConstraint(round('A').adapted, 'one-action-per-screen')).toThrow(/no check for the hidden constraint/);
  });
});

describe('each hidden-constraint check fails when the adapted flow breaks it', () => {
  it('undo-30s: an Undo shorter than 30 seconds, or none at all', () => {
    const short = round('A').adapted;
    const reserved = short.states.find((s) => s.id === 'reserved');
    if (!reserved) throw new Error('no reserved state');
    reserved.undoSeconds = 10;
    expect(checkConstraint(short, 'undo-30s').failures).toEqual(['book > reserved: reserved offers no Undo for 30 seconds']);
    const none = round('A').adapted;
    none.transitions = none.transitions.filter((t) => !t.undo);
    expect(checkConstraint(none, 'undo-30s').failures).toHaveLength(2);
  });

  it('second-person-approval: no decline, or a way into the loan that skips the keeper', () => {
    const noDecline = round('B').adapted;
    noDecline.transitions = noDecline.transitions.filter((t) => t.to !== 'declined');
    expect(checkConstraint(noDecline, 'second-person-approval').failures).toContain('requested: the keeper has no way to decline');
    const bypass = round('B').adapted;
    bypass.transitions.push({ from: 'shelf', to: 'borrowed', kind: 'branch' });
    expect(checkConstraint(bypass, 'second-person-approval').failures).toContain('borrowed: entered from shelf without approval');
  });

  it('offline-keeps-input: an offline state that drops a typed value', () => {
    const lossy = round('C').adapted;
    const offline = lossy.states.find((s) => s.id === 'permission-offline');
    const allergies = offline?.elements.find((e) => e.label === 'Medical needs or allergies');
    if (!allergies) throw new Error('no allergies field');
    allergies.value = '';
    expect(checkConstraint(lossy, 'offline-keeps-input').failures).toEqual(['permission: the offline state drops a field or its value']);
  });
});
