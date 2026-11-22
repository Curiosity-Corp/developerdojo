import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { assessmentMap } from '../src/data/assessment-map';
import { kataCatalog } from '../src/data/kata-catalog';
import { missionPlaybook } from '../src/data/mission-playbook';
import { transferPractice } from '../src/data/mission-transfer';
import { sectorPacks } from '../src/data/sector-packs';
import type { MissionPlaybook, MissionReferences } from '../src/lib/mission-playbook';
import { assemblePractice, checkTransferPractice, PRACTICE_STEPS, practiceAdaptations, SITE, type RecipeFacts, type TransferPractice } from '../src/lib/mission-transfer';

// Transfer practice (#95): every pathway built on the foundation katas offers a practice sheet, each sheet is read
// from its pathway, and no sheet claims a rubric result.
const root = join(import.meta.dirname, '..');
const RECIPES = join(root, 'src/content/kata-recipes');
interface RecipeFile {
  metadata: { id: string; title: string; foundationKataIds?: string[]; capabilityIds?: string[]; constraintIds?: string[]; standards?: { name: string; version: string }[] };
  agents?: { roles?: { role: string; reviewGate: string }[] };
}
const files = readdirSync(RECIPES).filter((name) => name.endsWith('.yaml')).map((name) => ({ slug: name.slice(0, -5), data: parseYaml(readFileSync(join(RECIPES, name), 'utf8')) as RecipeFile }));
const recipes: RecipeFacts[] = files.map(({ slug, data }) => ({
  slug,
  href: `/katas/${slug}`,
  id: data.metadata.id,
  title: data.metadata.title,
  roles: data.agents?.roles ?? [],
  capabilityIds: data.metadata.capabilityIds ?? [],
  standards: data.metadata.standards ?? [],
  constraintIds: data.metadata.constraintIds ?? [],
}));
const refs: MissionReferences = {
  assessment: assessmentMap,
  recipes: files.map(({ slug, data }) => ({ slug, id: data.metadata.id, roles: data.agents?.roles ?? [], foundationKataIds: data.metadata.foundationKataIds ?? [] })),
  packs: sectorPacks,
  catalogIds: kataCatalog.map((entry) => entry.metadata.id),
};
const playbook = missionPlaybook as MissionPlaybook;
const copy = (): TransferPractice => structuredClone(transferPractice) as TransferPractice;
const assembled = assemblePractice({ practice: transferPractice, playbook, assessment: assessmentMap, recipes, packs: sectorPacks, catalog: kataCatalog });
const UNPUBLISHABLE_IN_SHEETS = [/(^|\s)[#!]\d+\b/, /git\.developerdojo\.org/i, /\bsrc\//, /\.gitlab/, /\bdocs\//, /\btests?\//, /\be2e\//];

describe('the shipped transfer practice', () => {
  it('holds every rule against the recipes, sector packs and the playbook', () => {
    expect(checkTransferPractice(transferPractice, playbook, refs)).toEqual([]);
    expect(transferPractice.steps.map((item) => item.id)).toEqual([...PRACTICE_STEPS]);
  });

  it('offers every sector pack that builds on the foundation katas, once, in pack order', () => {
    const foundation = playbook.workedMission.foundation.kataIds;
    const expected = sectorPacks.filter((pack) => foundation.every((id) => pack.foundationKataIds.includes(id))).map((pack) => pack.id);
    expect(expected.length).toBeGreaterThanOrEqual(4);
    expect(assembled.fields.map((field) => field.packId)).toEqual(expected);
    expect(practiceAdaptations(transferPractice, playbook).map((item) => item.packId).sort()).toEqual([...expected].sort());
  });

  it('reads each field from its pathway: gate, first kata, Randori, inputs, checks and review limit', () => {
    for (const field of assembled.fields) {
      const pack = sectorPacks.find((item) => item.id === field.packId);
      expect(pack, field.packId).toBeDefined();
      if (!pack) continue;
      expect(field.katas.map((item) => item.id)).toEqual(pack.kataIds);
      expect(field.randori.id).toBe(pack.randoriKataId);
      expect(field.checks).toEqual(pack.checks.map((check) => check.name));
      expect(field.professionalReview.limit).toBe(pack.professionalReview.limit);
      const gate = recipes.find((item) => item.slug === field.gate.kata.href.replace('/katas/', ''));
      expect(gate?.roles.find((role) => role.role === field.gate.role)?.reviewGate).toBe(field.gate.reviewGate);
      // Capabilities the foundation already teaches are not listed as what the field changes.
      expect(field.capabilities).not.toContain('Verify evidence');
      expect(field.capabilities).not.toContain('Manage context');
    }
  });

  it('writes a sheet per field with every template line, the field facts and an unavailable rubric result', () => {
    expect([...assembled.sheets.keys()]).toEqual(assembled.fields.map((field) => field.packId));
    for (const field of assembled.fields) {
      const sheet = assembled.sheets.get(field.packId) ?? '';
      for (const part of [playbook.template.brief, playbook.template.transfer, playbook.template.retrospective]) {
        for (const item of part) expect(sheet.split('\n').some((line) => line.startsWith(`- ${item.label}:`)), `${field.packId}: ${item.label}`).toBe(true);
      }
      expect(sheet).toContain(field.gate.reviewGate);
      expect(sheet).toContain(field.randori.id);
      for (const input of field.inputs) expect(sheet).toContain(input.terms);
      for (const check of field.checks) expect(sheet).toContain(check);
      expect(sheet).toContain(`${SITE}${field.pathway}`);
      expect(sheet).toContain('- Independent rubric result: Unavailable until an independent reviewer records it.');
      for (const criterion of assembled.criteria) {
        expect(sheet).toContain(`- ${criterion.id} ${criterion.title}: Unavailable.`);
        for (const item of criterion.evidence) expect(sheet).toContain(`- [ ] ${item.title}:`);
      }
      for (const route of playbook.routes) expect(sheet).toContain(`${SITE}${route.worksheet}`);
      expect(sheet).not.toMatch(/: (Observed|Not yet observed|Unclear)\b/);
      for (const pattern of UNPUBLISHABLE_IN_SHEETS) expect(sheet, `${field.packId}: ${pattern}`).not.toMatch(pattern);
    }
  });

  it('serves one sheet per field from the examples route', () => {
    expect(existsSync(join(root, 'src/pages/examples/mission-transfer/[pack].md.ts'))).toBe(true);
  });
});

describe('the rules reject a practice that breaks them', () => {
  it('rejects a pathway built on the foundation katas that has no practice', () => {
    const practice = copy();
    practice.additionalFields = [];
    expect(checkTransferPractice(practice, playbook, refs).join()).toMatch(/sector pack science builds on PRACTICE-001 and PRACTICE-002 but has no transfer practice/);
  });

  it('rejects a field the worked mission already adapts', () => {
    const practice = copy();
    practice.additionalFields.push({ packId: 'ux', reference: 'The flow and the done-when list for each screen.', gate: { recipe: 'ux-001-sitemap', role: 'Drafting assistant' } });
    expect(checkTransferPractice(practice, playbook, refs).join()).toMatch(/sector pack ux has more than one transfer practice/);
  });

  it('rejects a review gate that is not in the field, or a role that does not exist', () => {
    const wrongPack = copy();
    wrongPack.additionalFields[0]!.gate.recipe = 'agr-002-reference-et';
    expect(checkTransferPractice(wrongPack, playbook, refs).join()).toMatch(/is not a kata of sector pack science/);
    const role = copy();
    role.additionalFields[0]!.gate.role = 'Imaginary reviewer';
    expect(checkTransferPractice(role, playbook, refs).join()).toMatch(/has no agent role "Imaginary reviewer"/);
    const pack = copy();
    pack.additionalFields[0]!.packId = 'astronomy';
    expect(checkTransferPractice(pack, playbook, refs).join()).toMatch(/sector pack astronomy does not exist/);
  });

  it('rejects steps out of order and an issue reference in published text', () => {
    const steps = copy();
    steps.steps = [...steps.steps].reverse();
    expect(checkTransferPractice(steps, playbook, refs).join()).toMatch(/practice steps must be/);
    const leak = copy();
    leak.notice = 'Tracked in issue #95 on the project board.';
    expect(checkTransferPractice(leak, playbook, refs).join()).toMatch(/must not match/);
  });
});
