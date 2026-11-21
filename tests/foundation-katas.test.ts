import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { KATA_DIRECTORY } from '../src/data/kata-directory';
import {
  FOUNDATION_AREAS, SHARED_FOUNDATION_ID, foundationDimensions, stagedFoundationKatas, type StagedFoundationKata,
} from '../src/data/foundation-katas';
import { fields } from '../src/lib/fields';
import { KataCatalogError, validateKataCatalog, type KataCatalogEntryInput, type KataReferences } from '../src/lib/kata-catalog';

// The same registries src/pages/fields.astro passes, read from the files, plus the family's vocabulary.
const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const resources = resourceIds();
const merge = (key: keyof typeof foundationDimensions): string[] => [...kataDimensions[key], ...foundationDimensions[key]];
const refs: KataReferences = {
  fields: fields.map((field) => field.id),
  resources,
  pathways: readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3)),
  outcomes: merge('outcomes'), artifacts: merge('artifacts'), capabilities: merge('capabilities'),
  constraints: merge('constraints'), stackRecipes: merge('stackRecipes'),
};

/** The real shared foundation: FND-001's recipe (#84). */
const fnd001 = parseYaml(readFileSync('src/content/kata-recipes/fnd-001-stack-comparison.yaml', 'utf8')) as { metadata: KataCatalogEntryInput['metadata'] };
const sharedFoundation: KataCatalogEntryInput = { href: '/katas/fnd-001-stack-comparison', linkLabel: fnd001.metadata.title, metadata: fnd001.metadata };
const asEntry = (kata: StagedFoundationKata): KataCatalogEntryInput => ({ href: kata.plannedHref, linkLabel: kata.metadata.title, metadata: kata.metadata });
const problems = (entries: unknown): readonly string[] => {
  try { validateKataCatalog(entries, refs); return []; }
  catch (error) { if (error instanceof KataCatalogError) return error.problems; throw error; }
};
const pageFor = (href: string): string => join('src/pages', `${href}.astro`);

describe('staged foundation family (#85): contract', () => {
  it('validates against the real registries and the shared foundation', () => {
    expect(sharedFoundation.metadata.id).toBe(SHARED_FOUNDATION_ID);
    expect(problems([sharedFoundation, ...stagedFoundationKatas.map(asEntry)])).toEqual([]);
  });

  it('fails validation without the shared foundation, so the dependency is real', () => {
    expect(problems(stagedFoundationKatas.map(asEntry))).toContain(`FND-002: unknown foundation ${SHARED_FOUNDATION_ID}`);
  });

  it('stages FND-002 to FND-010, one per area #85 names', () => {
    expect(stagedFoundationKatas.map((kata) => kata.metadata.id)).toEqual(['FND-002', 'FND-003', 'FND-004', 'FND-005', 'FND-006', 'FND-007', 'FND-008', 'FND-009', 'FND-010']);
    expect(stagedFoundationKatas.map((kata) => kata.area).sort()).toEqual([...FOUNDATION_AREAS].sort());
  });

  it('makes every record a foundation that depends on the shared foundation', () => {
    for (const kata of stagedFoundationKatas) {
      expect(kata.metadata.layer, kata.metadata.id).toBe('foundation');
      expect(kata.metadata.foundationKataIds, kata.metadata.id).toContain(SHARED_FOUNDATION_ID);
    }
  });

  it('adds vocabulary without repeating an existing ID, and uses every ID it adds', () => {
    const used = {
      outcomes: stagedFoundationKatas.flatMap((kata) => kata.metadata.outcomeIds),
      artifacts: stagedFoundationKatas.flatMap((kata) => kata.metadata.artifactTypes),
      capabilities: stagedFoundationKatas.flatMap((kata) => kata.metadata.capabilityIds),
      constraints: stagedFoundationKatas.flatMap((kata) => kata.metadata.constraintIds ?? []),
      stackRecipes: stagedFoundationKatas.flatMap((kata) => kata.metadata.stackRecipeIds ?? []),
    };
    for (const key of Object.keys(foundationDimensions) as (keyof typeof foundationDimensions)[]) {
      for (const id of foundationDimensions[key]) {
        expect(kataDimensions[key], `${key} ${id}`).not.toContain(id);
        expect(used[key], `${key} ${id} unused`).toContain(id);
      }
    }
  });
});

describe('staged foundation family (#85): honest status', () => {
  it('is staged: no page, no catalog record, no directory entry', () => {
    const catalogIds = new Set(kataCatalog.map((entry) => entry.metadata.id));
    const directory = new Set(KATA_DIRECTORY.map((entry) => entry.href));
    for (const kata of stagedFoundationKatas) {
      expect(kata.status).toBe('staged');
      expect(catalogIds.has(kata.metadata.id), kata.metadata.id).toBe(false);
      expect(directory.has(kata.plannedHref), kata.plannedHref).toBe(false);
      expect(existsSync(pageFor(kata.plannedHref)), kata.plannedHref).toBe(false);
    }
  });

  it('says why each record is incomplete, and claims no maintainer', () => {
    for (const kata of stagedFoundationKatas) {
      expect(kata.openGaps.length, kata.metadata.id).toBeGreaterThan(0);
      expect(kata.maintainer).toBe('unassigned');
      expect(kata.maintainerRole.trim()).not.toBe('');
      expect(kata.evidenceAssessment.trim()).not.toBe('');
    }
  });

  it('reuses only published practice pages, and starter IDs that point at them', () => {
    const directory = new Set(KATA_DIRECTORY.map((entry) => entry.href));
    for (const kata of stagedFoundationKatas) {
      expect(kata.reusedPractice.length, kata.metadata.id).toBeGreaterThan(0);
      for (const practice of kata.reusedPractice) {
        expect(existsSync(pageFor(practice.href)), practice.href).toBe(true);
        expect(directory.has(practice.href), practice.href).toBe(true);
        if (practice.practiceId) {
          expect(kataCatalog.find((entry) => entry.metadata.id === practice.practiceId)?.href, practice.practiceId).toBe(practice.href);
        }
      }
    }
  });

  it('names a real candidate exercise, dated when it was opened, with its rights state', () => {
    for (const kata of stagedFoundationKatas) {
      const exercise = kata.candidateExercise;
      expect(resources, exercise.resourceId).toContain(exercise.resourceId);
      expect(kata.metadata.externalResources, exercise.resourceId).toContain(exercise.resourceId);
      if (exercise.state === 'linked') expect(exercise.checkedOn, kata.metadata.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(exercise.rights.note.trim()).not.toBe('');
    }
  });

  it('assesses with pass or fail rubric checks and recorded evidence', () => {
    for (const kata of stagedFoundationKatas) {
      expect(kata.assessment.rubric.length, kata.metadata.id).toBeGreaterThanOrEqual(3);
      expect(kata.assessment.passThreshold).toMatch(/^\d+ of \d+$/);
      expect(Number(kata.assessment.passThreshold.split(' of ')[1])).toBe(kata.assessment.rubric.length);
      expect(kata.metadata.verificationEvidence?.length, kata.metadata.id).toBeGreaterThan(0);
    }
  });
});

describe('staged foundation family (#85): transfer and the unseen mission', () => {
  it('transfers across fields: every record names one, and the family covers at least five', () => {
    const covered = new Set(stagedFoundationKatas.flatMap((kata) => kata.metadata.crossFieldTransfers ?? []));
    for (const kata of stagedFoundationKatas) expect(kata.metadata.crossFieldTransfers?.length, kata.metadata.id).toBeGreaterThan(0);
    expect(covered.size).toBeGreaterThanOrEqual(5);
  });

  it('teaches when to equip a capability, including when not to', () => {
    const armory = stagedFoundationKatas.find((kata) => kata.area === 'skills-and-tools');
    expect(armory?.outcome).toMatch(/when the agent should invoke it/);
    expect(armory?.outcome).toMatch(/equipping nothing/);
  });

  const mission = stagedFoundationKatas.find((kata) => kata.metadata.id === 'FND-010');

  it('FND-010 sets goal, constraints and rubric, and prescribes no model, harness, tools or hierarchy', () => {
    expect(mission?.mission).toBeDefined();
    expect(mission?.metadata.stackRecipeIds ?? []).toEqual([]);
    expect(mission?.mission?.notPrescribed).toEqual(['model', 'harness', 'tools', 'hierarchy']);
    expect(mission?.mission?.constraints.length).toBeGreaterThan(0);
    const brief = [mission?.mission?.goal, mission?.mission?.input, ...(mission?.mission?.constraints ?? [])].join(' ');
    expect(brief).not.toMatch(/\b(Claude|ChatGPT|GPT|Gemini|Codex|Copilot|MCP|subagent|orchestrator)\b/i);
  });

  it('FND-010 answer key follows from the mission input', () => {
    const input = mission?.mission?.input ?? '';
    const number = (pattern: RegExp): number => Number(pattern.exec(input)?.[1]);
    const zones = 3;
    expect(input).toMatch(/Three zones/);
    const litresPerMinute = number(/(\d+) litres per minute/);
    const minutesA = number(/(\d+) minutes every day/);
    const minutesB = number(/(\d+) minutes every third day/);
    const [daysB, period] = [number(/(\d+) watering days in/), number(/watering days in (\d+)/)];
    const scheduleA = zones * litresPerMinute * minutesA * period;
    const scheduleB = zones * litresPerMinute * minutesB * daysB;
    expect(mission?.mission?.answerKey).toEqual({ scheduleALitres: scheduleA, scheduleBLitres: scheduleB, differenceLitres: scheduleA - scheduleB });
    expect(mission?.assessment.rubric[0]).toContain(`${scheduleA.toLocaleString('en-US')} L`);
  });
});
