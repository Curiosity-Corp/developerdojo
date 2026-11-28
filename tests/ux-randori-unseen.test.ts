import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkStructure } from '../public/examples/ux-pathway/tools/ux_pathway.mjs';
import { CONSTRAINT_CHECKS, checkConstraint } from '../public/examples/ux-pathway/tools/ux_randori.mjs';
import { renderUnseen, reviewFlow, validateUnseen } from '../public/examples/ux-pathway/tools/ux_review.mjs';

// The unseen UX Randori round (UX-R01, round U, #91). No answer is published; the reference answer lives in
// tests/fixtures/ux-randori-unseen/, outside the site. These tests prove the rubric's script rows mean something:
// the reference answer passes, the first sitemap misses the card, and each way of breaking the card is caught.

const DIR = 'public/examples/ux-pathway/';
const FIXTURES = 'tests/fixtures/ux-randori-unseen/';
const json = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));

interface Element { type: string; label?: string; value?: string; to?: string; rows?: string[][] }
interface State { id: string; kind: string; elements: Element[] }
interface Transition { from: string; to: string; kind: string; commits?: boolean }
interface Flow { start: string; states: State[]; transitions: Transition[] }
interface Unseen { id: string; brief: { text: string }; constraint: { id: string; text: string }; rubric: { id: string; judge: string; checks?: string[] }[] }

const unseen = json(DIR + 'inputs/randori-unseen.json') as Unseen;
const worked = json(DIR + 'inputs/randori-rounds.json') as { rounds: { id: string; brief: string; constraint: { id: string } }[] };
const flow = (name: 'first' | 'adapted'): Flow => structuredClone(json(FIXTURES + name + '.json') as Flow);
const structuralIds = checkStructure(json(DIR + 'inputs/pocket-invoice-flow.json')).map((c) => c.id);
const state = (f: Flow, id: string): State => {
  const found = f.states.find((s) => s.id === id);
  if (!found) throw new Error('no state ' + id);
  return found;
};

describe('the unseen Randori round', () => {
  it('is unseen: no worked round answers its brief or its card, and its card has a check', () => {
    expect(validateUnseen(unseen, worked, structuralIds)).toEqual([]);
    expect(Object.keys(CONSTRAINT_CHECKS)).toContain(unseen.constraint.id);
    expect(worked.rounds.map((r) => r.constraint.id)).not.toContain(unseen.constraint.id);
    expect(worked.rounds.map((r) => r.brief)).not.toContain(unseen.brief.text);
  });

  it('is refused when a worked round already answers its card or its brief', () => {
    const answered = { rounds: [...worked.rounds, { id: 'X', brief: unseen.brief.text, constraint: { id: unseen.constraint.id } }] };
    const problems = validateUnseen(unseen, answered, structuralIds);
    expect(problems.some((p) => p.includes('already answers the constraint'))).toBe(true);
    expect(problems.some((p) => p.includes('already answers this brief'))).toBe(true);
    expect(renderUnseen(unseen, answered, structuralIds).failures.length).toBeGreaterThan(0);
  });

  it('is refused when a rubric row names a check the scripts do not have, or no row checks the card', () => {
    const broken = structuredClone(unseen);
    broken.rubric[0]!.checks = ['no-such-check'];
    expect(validateUnseen(broken, worked, structuralIds)).toContain('rubric row "structure" names a check the scripts do not have: no-such-check');
    const noCard = structuredClone(unseen);
    noCard.rubric = noCard.rubric.filter((row) => row.id !== 'constraint');
    expect(validateUnseen(noCard, worked, structuralIds)).toContain('no rubric row checks the hidden constraint');
  });

  it('publishes a brief and a rubric that do not reveal the card, and a partner card that does', () => {
    const files = Object.fromEntries(renderUnseen(unseen, worked, structuralIds).files);
    for (const name of ['randori-unseen/brief.md', 'randori-unseen/rubric.md', 'randori-unseen/rubric.json', 'randori-unseen/review-sheet.md']) {
      expect(files[name], name).toBeDefined();
      expect(files[name], name).not.toContain(unseen.constraint.text);
      expect(files[name], name).not.toContain(unseen.constraint.id);
      expect(readFileSync(DIR + 'generated/' + name, 'utf8'), name).toBe(files[name]);
    }
    expect(files['randori-unseen/partner-card.md']).toContain(unseen.constraint.text);
    expect(files['randori-unseen/brief.md']).toContain(unseen.brief.text);
  });
});

describe('the review of an answer (tools/ux_review.mjs)', () => {
  it('passes every script row on the reference answer and computes what the card changed', () => {
    const review = reviewFlow(unseen, flow('adapted'), { checkStructure, first: flow('first') });
    expect(review.scriptPass).toBe(true);
    expect(review.rows.filter((r) => r.judge === 'script').map((r) => [r.id, r.status])).toEqual([['structure', 'pass'], ['constraint', 'pass']]);
    expect(review.rows.filter((r) => r.judge !== 'script').every((r) => r.status.startsWith('for '))).toBe(true);
    expect(review.first?.constraintMet).toBe(false);
    expect(review.first?.diff.statesAdded.sort()).toEqual(['book-error', 'check', 'giveup-check']);
  });

  it('marks the first sitemap not yet: sound in structure, but it misses the card', () => {
    const review = reviewFlow(unseen, flow('first'), { checkStructure });
    expect(review.rows.find((r) => r.id === 'structure')?.status).toBe('pass');
    expect(review.rows.find((r) => r.id === 'constraint')?.status).toBe('not yet');
    expect(review.scriptPass).toBe(false);
  });

  const breaks: [string, (f: Flow) => void, RegExp][] = [
    ['an action taken from a screen with fields', (f) => { f.transitions.find((t) => t.from === 'check' && t.to === 'booked')!.from = 'slots'; state(f, 'slots').elements.push({ type: 'button', label: 'Book now', variant: 'primary', to: 'booked' } as Element); }, /takes effect from slots, a screen with fields/],
    ['a summary that leaves out a choice', (f) => { state(f, 'check').elements.find((e) => e.type === 'summary')!.rows!.pop(); }, /does not show "What you will cook" from slots/],
    ['a check screen with no summary', (f) => { const s = state(f, 'giveup-check'); s.elements = s.elements.filter((e) => e.type !== 'summary'); }, /giveup-check shows no summary/],
    ['a way back that empties a field', (f) => { delete state(f, 'slots').elements.find((e) => e.label === 'Time')!.value; }, /going back empties "Time"/],
    ['no way back from the check screen', (f) => { f.transitions = f.transitions.filter((t) => !(t.from === 'giveup-check' && t.to === 'bookings')); state(f, 'giveup-check').elements = state(f, 'giveup-check').elements.filter((e) => e.to !== 'bookings'); }, /giveup-check: no way back/],
  ];
  for (const [name, mutate, expected] of breaks) {
    it('catches ' + name, () => {
      const broken = flow('adapted');
      mutate(broken);
      const result = checkConstraint(broken, unseen.constraint.id);
      expect(result.pass).toBe(false);
      expect(result.failures.join('\n')).toMatch(expected);
    });
  }

  it('runs from the command line: exit 0 on the reference, 1 on the first sitemap, 2 on a file it cannot read', () => {
    const run = (args: string[]): { code: number; stderr: string } => {
      try {
        execFileSync('node', [DIR + 'tools/ux_review.mjs', DIR, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
        return { code: 0, stderr: '' };
      } catch (error) {
        const failed = error as { status: number; stderr: Buffer };
        return { code: failed.status, stderr: failed.stderr.toString() };
      }
    };
    const out = join(mkdtempSync(join(tmpdir(), 'ux-review-')), 'review.md');
    expect(run([FIXTURES + 'adapted.json', '--first', FIXTURES + 'first.json', '--out', out]).code).toBe(0);
    const sheet = readFileSync(out, 'utf8');
    expect(sheet).toMatch(/\| structure \|[^\n]*\| pass \|/);
    expect(sheet).toContain('| States added | check, book-error, giveup-check |');
    expect(run([FIXTURES + 'first.json']).code).toBe(1);
    const missing = run([FIXTURES + 'no-such-file.json']);
    expect(missing.code).toBe(2);
    expect(missing.stderr).toContain('cannot read');
    const bad = join(mkdtempSync(join(tmpdir(), 'ux-review-')), 'bad.json');
    writeFileSync(bad, '{"states": []}');
    expect(run([bad]).stderr).toContain('has no screens list');
  });
});
