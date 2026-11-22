import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { missionPlaybook } from '../src/data/mission-playbook';
import { senseiContributions } from '../src/data/sensei-contributions';
import { checkContributions, type Contribution, type ContributionReferences } from '../src/lib/sensei-contributions';

// The Sensei contribution log (#94): the shipped log holds every rule against the real recipe files, Arena records and
// mission playbook, and each rule rejects a log that breaks it.
const root = join(import.meta.dirname, '..');
const yamlFiles = (dir: string) => readdirSync(join(root, dir)).filter((name) => name.endsWith('.yaml')).map((name) => ({ name, data: parseYaml(readFileSync(join(root, dir, name), 'utf8')) as unknown }));
interface RecipeFile {
  metadata: { id: string };
  agents?: { roles?: { role: string; reviewGate: string }[] };
  changes?: { date: string; review: string | { unavailable: string } }[];
}
const recipes = yamlFiles('src/content/kata-recipes').map(({ name, data }) => {
  const recipe = data as RecipeFile;
  return { slug: name.slice(0, -5), id: recipe.metadata.id, roles: recipe.agents?.roles ?? [], changes: recipe.changes ?? [] };
});
const refs: ContributionReferences = {
  recipes,
  arenaRecordIds: yamlFiles('src/content/arena').map(({ data }) => (data as { id: string }).id),
  routed: missionPlaybook.workedMission.retrospective.improvements.map((item) => ({ ...item.evidence, status: item.status })),
};
const copy = (): Contribution[] => structuredClone(senseiContributions);
const first = (log: Contribution[]): Contribution => {
  const item = log[0];
  if (!item) throw new Error('the log is empty');
  return item;
};
const withRefs = (change: (value: ContributionReferences) => void): ContributionReferences => {
  const value = structuredClone(refs) as ContributionReferences;
  change(value);
  return value;
};

describe('the shipped contribution log', () => {
  it('holds every rule against the recipes, Arena records and mission playbook', () => {
    expect(checkContributions(senseiContributions, refs)).toEqual([]);
  });

  it('exercises the UX-005 review-gate improvement routed from the mission retrospective, without claiming a review', () => {
    const item = senseiContributions.find((entry) => entry.id === 'ux-005-review-gate');
    expect(item?.kind).toBe('kata-improvement');
    expect(item?.review.independent).toHaveProperty('unavailable');
    expect(item?.review.outcome).toBe('applied');
    const gate = recipes.find((recipe) => recipe.slug === 'ux-005-implement-and-qa')?.roles.find((role) => role.role === 'Drafting assistant')?.reviewGate;
    expect(gate).toBe(item?.change.after);
    expect(gate).not.toContain('Penpot');
    const routed = missionPlaybook.workedMission.retrospective.improvements.find((entry) => entry.evidence.recipe === 'ux-005-implement-and-qa');
    expect(routed?.status).toBe('applied');
  });

  it('records a change-history entry on the kata itself, with the review marked unavailable', () => {
    const recipe = recipes.find((entry) => entry.slug === 'ux-005-implement-and-qa');
    const entry = recipe?.changes.find((change) => change.date === '2026-11-21');
    expect(entry?.review).toHaveProperty('unavailable');
  });

  it('leaves the Penpot katas, where the old wording is right, unchanged', () => {
    for (const slug of ['ux-001-sitemap', 'ux-002-low-fidelity', 'ux-003-tokens', 'ux-004-components']) {
      const gate = recipes.find((recipe) => recipe.slug === slug)?.roles.find((role) => role.role === 'Drafting assistant')?.reviewGate;
      expect(gate, slug).toContain('before it goes into Penpot');
    }
  });
});

describe('the rules reject a log that breaks them', () => {
  it('rejects "accepted" without a recorded independent review', () => {
    const log = copy();
    first(log).review.outcome = 'accepted';
    expect(checkContributions(log, refs).join()).toMatch(/"accepted" needs a recorded independent review/);
  });

  it('rejects "applied" once an independent review is recorded', () => {
    const log = copy();
    first(log).review.independent = 'A reviewing Sensei who is not the author compared the gate with the brief and agreed.';
    expect(checkContributions(log, withRefs((value) => {
      const change = value.recipes.find((recipe) => recipe.slug === 'ux-005-implement-and-qa')?.changes[0];
      if (change) change.review = 'Reviewed.';
    })).join()).toMatch(/so the outcome is "accepted"/);
  });

  it('rejects mentoring feedback in the public log', () => {
    const log = copy();
    first(log).kind = 'mentoring-feedback';
    expect(checkContributions(log, refs).join()).toMatch(/mentoring feedback is private/);
  });

  it('rejects an applied change the recipe does not show, or with no change-history entry', () => {
    const log = copy();
    first(log).change.after = 'You compare every line with the flow before it goes anywhere at all.';
    expect(checkContributions(log, refs).join()).toMatch(/does not read as the "after" text/);
    const noHistory = copy();
    delete first(noHistory).history;
    expect(checkContributions(noHistory, refs).join()).toMatch(/needs history.changedOn/);
    const wrongDate = copy();
    first(wrongDate).history = { changedOn: '2026-12-01' };
    expect(checkContributions(wrongDate, refs).join()).toMatch(/no change-history entry dated 2026-12-01/);
  });

  it('rejects a proposal whose target already reads as the proposal', () => {
    const log = copy();
    first(log).review.outcome = 'proposed';
    delete first(log).history;
    expect(checkContributions(log, refs).join()).toMatch(/should still read as the "before" text/);
  });

  it('rejects an outcome the mission playbook does not match', () => {
    expect(checkContributions(senseiContributions, withRefs((value) => {
      const routed = value.routed[0];
      if (routed) routed.status = 'routed';
    })).join()).toMatch(/marks it "routed"/);
  });

  it('rejects a change to something that runs without a security review', () => {
    const log = copy();
    first(log).security = { executable: true, review: { unavailable: 'Nobody has looked at the code yet.' } };
    expect(checkContributions(log, refs).join()).toMatch(/needs a recorded security review/);
  });

  it('rejects a missing target, and a benchmark correction aimed at a kata', () => {
    const log = copy();
    first(log).target = { part: 'review-gate', recipe: 'ux-005-implement-and-qa', role: 'Imaginary reviewer' };
    expect(checkContributions(log, refs).join()).toMatch(/has no agent role "Imaginary reviewer"/);
    const benchmark = copy();
    first(benchmark).kind = 'benchmark-correction';
    expect(checkContributions(benchmark, refs).join()).toMatch(/a benchmark correction targets an Arena record/);
    const arena = copy();
    first(arena).kind = 'benchmark-correction';
    first(arena).target = { part: 'arena-record', record: 'ARN-999' };
    expect(checkContributions(arena, refs).join()).toMatch(/ARN-999 does not exist/);
  });

  it('rejects an issue reference or repository path in published text', () => {
    const log = copy();
    first(log).origin = 'Routed from issue #95 and recorded in src/data/sensei-contributions.ts by the maintainers.';
    expect(checkContributions(log, refs).join()).toMatch(/must not match/);
  });
});
