import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderUsability, shortestPath, walkTask, type TaskInput, type TaskResult } from '../public/examples/ux-pathway/tools/ux_usability.mjs';

// The UX-008 usability walkthrough (#91). The ux_pathway CI job reruns the script and diffs its output; these tests
// pin what the pathway page quotes, and break the flow and the tasks to prove each check can fail.

const DIR = 'public/examples/ux-pathway/';
const json = (path: string): unknown => JSON.parse(readFileSync(DIR + path, 'utf8'));
interface Flow { start: string; states: { id: string; kind: string; elements: { type: string; to?: string }[] }[]; transitions: { from: string; to: string; kind: string }[] }
const flow = (): Flow => structuredClone(json('inputs/pocket-invoice-flow.json') as Flow);
const tasks = (): { tasks: TaskInput[] } => structuredClone(json('inputs/usability-tasks.json') as { tasks: TaskInput[] });
const task = (id: string): TaskInput => {
  const found = tasks().tasks.find((t) => t.id === id);
  if (!found) throw new Error('no task ' + id);
  return found;
};
const failed = (result: TaskResult): string[] => result.checks.filter((c) => !c.pass).map((c) => c.id);

describe('the published usability walkthrough', () => {
  const generated = json('generated/usability/tasks.json') as { pass: boolean; tasks: TaskResult[] };

  it('passes, and matches a fresh walk of the inputs', () => {
    expect(generated.pass).toBe(true);
    expect(generated.tasks).toEqual(tasks().tasks.map((t) => walkTask(flow(), t)));
  });

  it('sends a first invoice from sign-up in four button presses', () => {
    const t2 = generated.tasks.find((t) => t.id === 'T2');
    expect(t2?.steps.map((s) => s.n)).toEqual([1, 6, 7, 15]);
    expect(t2?.steps.every((s) => s.control !== null)).toBe(true);
  });

  it('records the returning-user finding with its decision, and nothing else as a finding', () => {
    const findings = generated.tasks.flatMap((t) => t.findings.map((f) => t.id + ' ' + f.item));
    expect(findings).toEqual(['T7 signup-error (transition 2)']);
    expect(readFileSync(DIR + 'generated/usability/walkthrough.md', 'utf8')).toContain('a returning user who fills in the sign-up form by mistake');
  });
});

describe('the walkthrough checks can fail', () => {
  it('finds the shortest path, preferring the lower transition numbers on a tie', () => {
    expect(shortestPath(flow(), 'send-error', 'invoice-sent')?.map((t) => t.n)).toEqual([17, 7, 15]);
    expect(shortestPath(flow(), 'signup', 'signup')).toEqual([]);
  });

  it('fails a task over its step budget', () => {
    expect(failed(walkTask(flow(), { ...task('T2'), maxSteps: 3 }))).toEqual(['within-budget']);
  });

  it('fails a task whose goal cannot be reached, or whose state does not exist', () => {
    const broken = flow();
    broken.transitions = broken.transitions.filter((t) => t.to !== 'invoice-sent');
    expect(failed(walkTask(broken, task('T2')))).toContain('goal-reachable');
    expect(failed(walkTask(flow(), { ...task('T1'), goal: 'nowhere' }))).toContain('states-exist');
  });

  it('fails a step that only the prototype has a link for', () => {
    // signup -> signup-error is caused by a bad entry, not by a button of its own.
    expect(failed(walkTask(flow(), { ...task('T1'), goal: 'signup-error' }))).toEqual(['steps-are-buttons']);
  });

  it('fails an error that strands the user, unless it is a recorded finding, and fails a finding that went stale', () => {
    const t7 = task('T7');
    expect(failed(walkTask(flow(), { ...t7, acceptedFindings: [] }))).toEqual(['errors-lead-to-goal']);
    const fixed = flow();
    fixed.transitions.push({ from: 'signup-error', to: 'sign-in', kind: 'branch' });
    expect(failed(walkTask(fixed, t7))).toEqual(['errors-lead-to-goal']);
    expect(walkTask(fixed, { ...t7, acceptedFindings: [] }).pass).toBe(true);
  });

  it('refuses two tasks with the same id', () => {
    const file = tasks();
    file.tasks.push({ ...task('T1') });
    expect(renderUsability(flow(), file).failures).toContain('usability: task id T1 is used twice');
  });
});
