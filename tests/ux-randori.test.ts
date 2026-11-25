import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkStructure } from '../public/examples/ux-pathway/tools/ux_pathway.mjs';
import { CONSTRAINT_CHECKS, checkConstraint, diffFlows, screenHtml } from '../public/examples/ux-pathway/tools/ux_randori.mjs';

// The worked UX Randori rounds (UX-R01, #91). The ux_pathway CI job reruns the script and diffs its output; these
// tests pin what the page quotes, and prove each hidden-constraint check fails when the adapted flow breaks it, so a
// passing round means something.

const DIR = 'public/examples/ux-pathway/';
const json = (path: string): unknown => JSON.parse(readFileSync(DIR + path, 'utf8'));

interface Element { type: string; label?: string; value?: string; to?: string; place?: { row: number; col: number } }
interface State { id: string; screen: string; kind: string; elements: Element[]; undoSeconds?: number; awaits?: string; offline?: boolean }
interface Transition { from: string; to: string; kind: string; commits?: boolean; undo?: boolean; actor?: string }
interface Flow { start: string; states: State[]; transitions: Transition[] }
interface Round { id: string; constraint: { id: string; text: string }; first: Flow; adapted: Flow }
interface RoundResult { id: string; first: { constraint: { pass: boolean; failures: string[] } }; adapted: { structure: { pass: boolean }; constraint: { pass: boolean } }; diff: Record<string, string[]>; files: string[]; screens: { first: string[]; adapted: string[] } }

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

describe('the screen round (focus order and one action per screen)', () => {
  const state = (flow: Flow, id: string): State => {
    const found = flow.states.find((s) => s.id === id);
    if (!found) throw new Error('no state ' + id);
    return found;
  };

  it('finds both problems in the first version, on the screens the browser test walks', () => {
    const d = generated.rounds.find((r) => r.id === 'D');
    expect(d?.first.constraint.failures).toEqual([
      'tool: focus goes Return by, Borrow, Back to the shelf; reading goes Borrow, Return by, Back to the shelf',
      'borrowed: 2 actions (Return it, Report it broken)',
    ]);
    for (const which of ['first', 'adapted'] as const) {
      expect(d?.screens[which].length, which).toBe(round('D')[which].states.length);
      for (const file of d?.screens[which] ?? []) expect(manifest.outputs, file).toContain(file);
    }
    expect(d?.screens.first[0]).toBe('randori/D-first/shelf.html');
    for (const r of generated.rounds.filter((x) => x.id !== 'D')) expect(r.screens, r.id).toEqual({ first: [], adapted: [] });
  });

  it('fails when Borrow goes back to the top right corner, ahead of the date in reading but not in focus', () => {
    const moved = round('D').adapted;
    const borrow = state(moved, 'tool').elements.find((e) => e.label === 'Borrow');
    if (!borrow) throw new Error('no Borrow button');
    borrow.place = { row: 1, col: 2 };
    expect(checkConstraint(moved, 'keyboard-focus-one-action').failures).toEqual(['tool: focus goes Return by, Borrow, Back to the shelf; reading goes Borrow, Return by, Back to the shelf']);
  });

  it('fails when the link to the broken report takes effect at once: a second action on the loan screen', () => {
    const twice = round('D').adapted;
    const report = twice.transitions.find((t) => t.from === 'borrowed' && t.to === 'report');
    if (!report) throw new Error('no borrowed > report transition');
    report.commits = true;
    expect(checkConstraint(twice, 'keyboard-focus-one-action').failures).toEqual(['borrowed: 2 actions (Return it, Report it broken)']);
  });

  it('refuses a screen that places some elements and not others', () => {
    const half = round('D').adapted;
    const heading = state(half, 'tool').elements[0];
    if (!heading) throw new Error('the tool screen has no elements');
    delete heading.place;
    expect(() => checkConstraint(half, 'keyboard-focus-one-action')).toThrow(/places 4 of its 5 elements/);
  });

  it('writes each action as a submit button and each move as a link, in the listed order, placed where the state says', () => {
    const adapted = round('D').adapted;
    const html = screenHtml(adapted, state(adapted, 'borrowed'), 'D', 'adapted');
    expect(html.match(/<button /g)).toHaveLength(1);
    expect(html).toContain('<form action="returned.html" method="get" style="grid-column: 1 / -1;"><button type="submit" class="primary" data-control="Return it">Return it</button></form>');
    expect(html).toContain('<a href="report.html" data-control="Report it broken">Report it broken</a>');
    const tool = screenHtml(adapted, state(adapted, 'tool'), 'D', 'adapted');
    expect(tool.indexOf('data-control="Return by"')).toBeLessThan(tool.indexOf('data-control="Borrow"'));
    expect(tool).toContain('style="grid-row: 3; grid-column: 2;"><button type="submit" class="primary" data-control="Borrow">');
    expect(readFileSync(DIR + 'generated/randori/D-adapted/tool.html', 'utf8')).toBe(tool);
  });
});
