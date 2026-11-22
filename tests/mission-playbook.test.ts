import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { assessmentMap } from '../src/data/assessment-map';
import { kataCatalog } from '../src/data/kata-catalog';
import { missionBrief } from '../src/data/mission-brief';
import { missionPlaybook } from '../src/data/mission-playbook';
import { sectorPacks } from '../src/data/sector-packs';
import { BRIEF_FIELDS, checkMissionPlaybook, renderMissionBrief, type MissionPlaybook, type MissionReferences } from '../src/lib/mission-playbook';

// The mission playbook (#95): the shipped data holds every rule against the real files, and each rule rejects data
// that breaks it.
const root = join(import.meta.dirname, '..');
const RECIPES = join(root, 'src/content/kata-recipes');
interface RecipeFile { metadata: { id: string; foundationKataIds?: string[] }; agents?: { roles?: { role: string; reviewGate: string }[] } }
const recipes = readdirSync(RECIPES).filter((name) => name.endsWith('.yaml')).map((name) => {
  const data = parseYaml(readFileSync(join(RECIPES, name), 'utf8')) as RecipeFile;
  return { slug: name.slice(0, -5), id: data.metadata.id, roles: data.agents?.roles ?? [], foundationKataIds: data.metadata.foundationKataIds ?? [] };
});
const pagePath = (path: string) => [join(root, 'src/pages', `${path}.astro`), join(root, 'src/pages', path, 'index.astro')].some((file) => existsSync(file));
const publicPath = (path: string) => existsSync(join(root, 'public', path));
const routeLinks = missionPlaybook.routes.flatMap((route) => [route.worksheet, route.guide]);
const refs: MissionReferences = {
  assessment: assessmentMap,
  recipes,
  packs: sectorPacks,
  catalogIds: kataCatalog.map((entry) => entry.metadata.id),
  sitePaths: routeLinks.filter((path) => pagePath(path) || publicPath(path)),
};
const copy = (): MissionPlaybook => structuredClone(missionPlaybook) as MissionPlaybook;

describe('the shipped mission playbook', () => {
  it('holds every rule against the recipes, sector packs, catalog and assessment map', () => {
    expect(checkMissionPlaybook(missionPlaybook, refs)).toEqual([]);
  });

  it('links only to worksheets and guides that exist', () => {
    for (const path of routeLinks) expect(pagePath(path) || publicPath(path), path).toBe(true);
  });

  it('generates the editable brief from the template, with every field the mission brief needs', () => {
    expect(missionPlaybook.template.brief.map((field) => field.id)).toEqual([...BRIEF_FIELDS]);
    expect(missionBrief).toBe(renderMissionBrief(missionPlaybook.template, missionPlaybook.routes));
    for (const part of [missionPlaybook.template.brief, missionPlaybook.template.transfer, missionPlaybook.template.retrospective]) {
      for (const field of part) expect(missionBrief).toContain(`- ${field.label}:`);
    }
    for (const route of missionPlaybook.routes) expect(missionBrief).toContain(route.worksheet);
    // Phrases the existing page, download and browser tests rely on.
    expect(missionBrief).toContain('not proof that a mission or review happened');
    expect(missionBrief).toContain('Authorized inputs and permissions');
    expect(missionBrief).toContain('Independent review and qualified professional approval');
  });

  it('reuses the assessment map rubric and claims no result before a review has run', () => {
    const ids = assessmentMap.ranks.flatMap((rank) => rank.rubric.criteria.map((criterion) => criterion.id));
    for (const id of missionPlaybook.rubricCriterionIds) expect(ids).toContain(id);
    const prompt = missionPlaybook.template.transfer.find((field) => field.id === 'rubric-result')?.prompt ?? '';
    for (const id of missionPlaybook.rubricCriterionIds) expect(prompt).toContain(id);
    expect(missionPlaybook.workedMission.rubricResult.reviewer).toBeNull();
    if (assessmentMap.pilot.status === 'not-run') {
      for (const result of missionPlaybook.workedMission.rubricResult.criteria) expect(result.observation).toBeNull();
    }
  });

  it('builds the worked mission on foundations every adapted pathway shares', () => {
    for (const adaptation of missionPlaybook.workedMission.adaptations) {
      const pack = sectorPacks.find((item) => item.id === adaptation.packId);
      expect(pack, adaptation.packId).toBeDefined();
      for (const id of missionPlaybook.workedMission.foundation.kataIds) expect(pack?.foundationKataIds).toContain(id);
    }
    expect(missionPlaybook.workedMission.adaptations.length).toBeGreaterThanOrEqual(2);
  });

  it('routes the verified improvement through an existing Sensei worksheet', () => {
    for (const item of missionPlaybook.workedMission.retrospective.improvements) {
      const route = missionPlaybook.routes.find((candidate) => candidate.kind === item.kind);
      expect(route, item.title).toBeDefined();
      const recipe = recipes.find((candidate) => candidate.slug === item.evidence.recipe);
      expect(recipe?.roles.map((candidate) => candidate.role)).toContain(item.evidence.role);
    }
  });
});

describe('the rules reject a playbook that breaks them', () => {
  it('rejects an independent result recorded before any review has run', () => {
    const playbook = copy();
    playbook.workedMission.rubricResult.criteria[0]!.observation = 'Observed';
    expect(checkMissionPlaybook(playbook, refs).join()).toMatch(/no independent review has run/);
  });

  it('rejects a rubric criterion that is not in the assessment map, or does not assess transfer', () => {
    const missing = copy();
    missing.rubricCriterionIds = ['MD-9'];
    expect(checkMissionPlaybook(missing, refs).join()).toMatch(/MD-9 is not in the assessment map/);
    const notTransfer = copy();
    notTransfer.rubricCriterionIds = ['DEV-1', 'SEN-2'];
    expect(checkMissionPlaybook(notTransfer, refs).join()).toMatch(/DEV-1 does not assess transfer/);
  });

  it('rejects evidence kinds the criterion does not ask for, and kinds left unaccounted for', () => {
    const playbook = copy();
    playbook.workedMission.rubricResult.criteria[0]!.offered = ['configuration', 'tests', 'failures'];
    expect(checkMissionPlaybook(playbook, refs).join()).toMatch(/does not ask for failures evidence/);
    const short = copy();
    short.workedMission.rubricResult.criteria[0]!.missing = [];
    expect(checkMissionPlaybook(short, refs).join()).toMatch(/asks for decisions evidence/);
  });

  it('rejects a foundation that a pathway does not build on, and a review gate that does not exist', () => {
    const foundation = copy();
    foundation.workedMission.foundation.kataIds = ['PRACTICE-001', 'PRACTICE-005'];
    expect(checkMissionPlaybook(foundation, refs).join()).toMatch(/does not build on PRACTICE-005/);
    const gate = copy();
    gate.workedMission.adaptations[0]!.gate.role = 'Imaginary reviewer';
    expect(checkMissionPlaybook(gate, refs).join()).toMatch(/has no agent role "Imaginary reviewer"/);
    const wrongPack = copy();
    wrongPack.workedMission.adaptations[0]!.gate.recipe = 'bim-001-inspect-model';
    expect(checkMissionPlaybook(wrongPack, refs).join()).toMatch(/is not a kata of sector pack ux/);
  });

  it('rejects a missing brief field and an issue reference in published text', () => {
    const brief = copy();
    brief.template.brief = brief.template.brief.filter((field) => field.id !== 'approvals');
    expect(checkMissionPlaybook(brief, refs)).not.toEqual([]);
    const leak = copy();
    leak.workedMission.retrospective.sharing = 'Tracked in issue #94 on the project board.';
    expect(checkMissionPlaybook(leak, refs).join()).toMatch(/must not match/);
  });

  it('rejects a route whose worksheet the site does not have', () => {
    const playbook = copy();
    playbook.routes[0]!.worksheet = '/examples/sensei/missing.md';
    expect(checkMissionPlaybook(playbook, refs).join()).toMatch(/which the site does not have/);
  });
});
