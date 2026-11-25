import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { sectorPackInputs, sectorPacks } from '../src/data/sector-packs';
import { checkSectorPacks, fillEvidence, packTemplate, SectorPackError, type SectorPackInput, type SectorPackReferences } from '../src/lib/sector-pack';
import { sectorPackReferences, type PackRecipe } from '../src/lib/sector-pack-references';

// Sector packs (#93, docs/sector-packs.md). The build runs checkSectorPacks against the loaded recipes; these tests
// run it against the same YAML files, and add what the build cannot see: the CI jobs and the input hashes.

const RECIPES = 'src/content/kata-recipes';
const recipes: PackRecipe[] = readdirSync(RECIPES).filter((name) => name.endsWith('.yaml')).map((name) => {
  const data = parseYaml(readFileSync(join(RECIPES, name), 'utf8')) as Pick<PackRecipe, 'status' | 'metadata'>;
  return { slug: basename(name, '.yaml'), status: data.status, metadata: data.metadata };
});
const pages = readdirSync('src/pages/katas').filter((name) => name.endsWith('.astro') && !name.startsWith('[')).map((name) => basename(name, '.astro'));
const refs = sectorPackReferences(recipes, pages);
const ci = readFileSync('.gitlab-ci.yml', 'utf8');
const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const pack = (id: string): SectorPackInput => {
  const found = sectorPackInputs.find((candidate) => candidate.id === id);
  if (!found) throw new Error('no pack ' + id);
  return structuredClone(found);
};
const problemsWith = (changed: SectorPackInput, overrides: Partial<SectorPackReferences> = {}) =>
  checkSectorPacks(sectorPackInputs.map((candidate) => (candidate.id === changed.id ? changed : candidate)), { ...refs, ...overrides }).join('\n');

/** The script lines of one top-level CI job. */
function jobScript(name: string): string {
  const start = ci.indexOf('\n' + name + ':\n');
  if (start < 0) return '';
  const rest = ci.slice(start + 1);
  const next = rest.slice(1).search(/\n[a-z_.:-]+:\n/);
  return next < 0 ? rest : rest.slice(0, next + 1);
}

describe('sector packs', () => {
  it('has the UX, BIM, agriculture, science, finance and manufacturing packs, and every one passes the build check', () => {
    expect(sectorPacks.map((candidate) => candidate.id)).toEqual(['ux', 'bim', 'agriculture', 'science', 'finance', 'manufacturing']);
    expect(checkSectorPacks(sectorPackInputs, refs)).toEqual([]);
  });

  it('has at least one non-software sector with a real, hashed input', () => {
    const real = sectorPacks.filter((candidate) => Array.isArray(candidate.inputs) && !candidate.fieldIds.some((field) => ['software', 'ux', 'data'].includes(field)));
    expect(real.map((candidate) => candidate.id)).toEqual(['bim', 'agriculture', 'science', 'finance', 'manufacturing']);
  });

  it('serves every input unchanged, at the hash the pack records', () => {
    for (const candidate of sectorPacks) {
      if (!Array.isArray(candidate.inputs)) continue;
      for (const input of candidate.inputs) expect(sha256(join('public', input.path)), input.path).toBe(input.sha256);
    }
  });

  it('runs every check in a CI job that exists, and diffs a script\'s output against the published files', () => {
    for (const candidate of sectorPacks) {
      for (const check of candidate.checks) {
        const script = jobScript(check.ciJob);
        expect(script, check.ciJob).not.toBe('');
        if (!check.runs.startsWith('public/')) continue;
        expect(script, check.ciJob).toContain(check.runs);
        expect(script, check.ciJob).toMatch(new RegExp('diff -r \\S+ ' + check.runs.replace(/\/tools\/.*$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/generated'));
      }
    }
  });

  it('holds back deploys until every pack check job passes', () => {
    const jobs = [...new Set(sectorPacks.flatMap((candidate) => candidate.checks.map((check) => check.ciJob)))];
    for (const deploy of ['pages', 'publish_github_pages']) {
      const needs = /needs: \[([^\]]*)\]/.exec(jobScript(deploy))?.[1]?.split(',').map((job) => job.trim()) ?? [];
      for (const job of jobs) expect(needs, deploy + ' needs ' + job).toContain(job);
    }
  });

  it('fills every pack template: terms, procedures, a versioned standard, native files, all belt stages and a review state', () => {
    for (const candidate of sectorPacks) {
      const template = packTemplate(candidate, refs.recipes);
      expect(candidate.ontology.length, candidate.id).toBeGreaterThanOrEqual(3);
      expect(candidate.procedures.flatMap((procedure) => procedure.kataIds), candidate.id).toEqual(expect.arrayContaining(candidate.kataIds));
      expect(template.standards.length, candidate.id).toBeGreaterThan(0);
      expect(template.artifactTypes.length, candidate.id).toBeGreaterThan(0);
      expect(template.beltStages, candidate.id).toEqual(['practice', 'adapt', 'demonstrate']);
      // No qualified reviewer is available to the Dojo yet; a change here needs the written review as evidence.
      expect(candidate.professionalReview.reviewers.map((reviewer) => reviewer.state), candidate.id).toEqual(candidate.professionalReview.reviewers.map(() => 'none-available'));
    }
    expect(packTemplate(sectorPacks.find((candidate) => candidate.id === 'science')!, refs.recipes).standards).toEqual([{ name: 'Guide to the expression of uncertainty in measurement (GUM)', version: 'JCGM 100:2008', kataIds: ['SCI-002', 'SCI-003', 'SCI-R01'] }]);
  });

  it('keeps the agriculture record hash in the manifest the page reads', () => {
    const manifest = JSON.parse(readFileSync('public/examples/agriculture-pathway/generated/manifest.json', 'utf8')) as { inputs: Record<string, string> };
    const input = pack('agriculture').inputs;
    if (!Array.isArray(input)) throw new Error('agriculture has a real input');
    expect(Object.values(manifest.inputs)).toEqual([input[0]?.sha256]);
  });
});

describe('sector pack check failures', () => {
  it('rejects a verified line that claims approval', () => {
    const changed = pack('agriculture');
    changed.verified = [...changed.verified, 'The estimate is approved for irrigation planning.'];
    expect(problemsWith(changed)).toMatch(/never claims compliance, certification or approval/);
  });

  it('rejects a Randori listed with the practice katas, and a practice kata as the Randori', () => {
    const changed = pack('agriculture');
    changed.kataIds = [...changed.kataIds, 'AGR-R01'];
    changed.randoriKataId = 'AGR-003';
    const problems = problemsWith(changed);
    expect(problems).toMatch(/list the Randori in randoriKataId/);
    expect(problems).toMatch(/a Randori kata ID ends in -R01/);
  });

  it('rejects a kata with no recipe, a foundation that is not one, and a missing page', () => {
    const changed = pack('agriculture');
    changed.kataIds = [...changed.kataIds, 'AGR-009'];
    changed.foundationKataIds = ['AGR-001'];
    changed.pathway = '/katas/agriculture-missing';
    const problems = problemsWith(changed);
    expect(problems).toMatch(/AGR-009 has no recipe/);
    expect(problems).toMatch(/AGR-001 is not a foundation kata/);
    expect(problems).toMatch(/pathway page \/katas\/agriculture-missing does not exist/);
  });

  it('rejects a professional review flag that disagrees with the recipes', () => {
    const changed = pack('agriculture');
    changed.professionalReview = { ...changed.professionalReview, required: false };
    expect(problemsWith(changed)).toMatch(/AGR-001 has professionalReviewRequired true but the pack says false/);
  });

  it('rejects a kata claimed by two packs', () => {
    const changed = pack('agriculture');
    changed.kataIds = [...changed.kataIds, 'BIM-001'];
    expect(problemsWith(changed)).toMatch(/kata BIM-001 already belongs to the bim pack/);
  });

  it('rejects unknown Armory, gallery and field references', () => {
    const changed = pack('agriculture');
    changed.armory = { stackRecipeIds: ['no-such-stack'], entryIds: ['no-such-tool'] };
    changed.galleryEntryIds = ['bim-pathway-edited-model'];
    changed.fieldIds = ['agriculture', 'no-such-field'];
    const problems = problemsWith(changed);
    expect(problems).toMatch(/stack recipe no-such-stack is not in the Armory/);
    expect(problems).toMatch(/Armory entry no-such-tool does not exist/);
    expect(problems).toMatch(/gallery entry bim-pathway-edited-model is taught by BIM-004, which is not in the pack/);
    expect(problems).toMatch(/field no-such-field is not in src\/lib\/fields.ts/);
  });

  it('rejects files outside the examples folder, missing files and missing evidence', () => {
    const changed = pack('agriculture');
    changed.checks = [{ ...changed.checks[0]!, outputs: ['/examples/bim-pathway/generated/summary.md', '/examples/agriculture-pathway/generated/missing.json'] }];
    changed.verified = [...changed.verified, { text: 'A line with evidence.', evidence: '/examples/agriculture-pathway/nothing.json' }];
    const problems = problemsWith(changed);
    expect(problems).toMatch(/\/examples\/bim-pathway\/generated\/summary.md is outside \/examples\/agriculture-pathway/);
    expect(problems).toMatch(/missing.json does not exist under public/);
    expect(problems).toMatch(/evidence \/examples\/agriculture-pathway\/nothing.json does not exist/);
  });

  it('rejects an input without an https source or a sha256', () => {
    const changed = pack('agriculture');
    const inputs = changed.inputs;
    if (!Array.isArray(inputs)) throw new Error('agriculture has a real input');
    changed.inputs = [{ ...inputs[0]!, source: 'http://example.org/data.csv', sha256: 'abc' }];
    expect(problemsWith(changed)).toMatch(/inputs/);
  });

  it('rejects a procedure naming a kata outside the pack, a practice kata in no procedure, and a term defined twice', () => {
    const changed = pack('agriculture');
    changed.procedures = [{ name: 'Inspect', kataIds: ['AGR-001', 'BIM-001'] }, { name: 'Estimate', kataIds: ['AGR-002'] }];
    changed.ontology = [...changed.ontology, { term: 'effective rainfall', meaning: 'Again.' }];
    const problems = problemsWith(changed);
    expect(problems).toMatch(/BIM-001 is not a kata of this pack/);
    expect(problems).toMatch(/the term effective rainfall is defined twice/);
    const uncovered = pack('agriculture');
    uncovered.procedures = [{ name: 'Inspect', kataIds: ['AGR-001'] }, { name: 'Estimate', kataIds: ['AGR-002'] }];
    expect(problemsWith(uncovered)).toMatch(/AGR-003 practises none of the pack procedures/);
  });

  it('requires a review state with evidence before a pack can say a qualified reviewer reviewed it', () => {
    const changed = pack('science');
    changed.professionalReview = { ...changed.professionalReview, reviewers: [{ role: 'Metrologist', scope: 'The budget.', state: 'reviewed' }] };
    expect(problemsWith(changed)).toMatch(/a reviewed state needs the evidence path of the written review/);
    changed.professionalReview = { ...changed.professionalReview, reviewers: [{ role: 'Metrologist', scope: 'The budget.', state: 'reviewed', evidence: '/examples/science-pathway/review.md' }] };
    expect(problemsWith(changed)).toMatch(/review evidence \/examples\/science-pathway\/review.md does not exist/);
    changed.professionalReview = { ...changed.professionalReview, reviewers: [] };
    expect(problemsWith(changed)).toMatch(/professionalReview\.reviewers/);
  });

  it('requires a versioned standard and belt criteria at every stage across the pack katas', () => {
    const bare = refs.recipes.map((recipe) => (recipe.id.startsWith('SCI-') ? { ...recipe, standards: [], beltStages: recipe.id === 'SCI-001' ? [] : ['practice'] } : recipe));
    const problems = checkSectorPacks(sectorPackInputs, { ...refs, recipes: bare }).join('\n');
    expect(problems).toMatch(/science: no pack kata names a versioned standard/);
    expect(problems).toMatch(/science: SCI-001 has no belt criteria/);
    expect(problems).toMatch(/science: no pack kata has a demonstrate belt criterion/);
  });

  it('fills placeholders from facts and fails the build when a fact is missing', () => {
    expect(fillEvidence('{days} days', { days: 365 }, 'agriculture')).toBe('365 days');
    expect(() => fillEvidence('{days} days, {missing} missing', { days: 365 }, 'agriculture')).toThrow(SectorPackError);
  });
});
