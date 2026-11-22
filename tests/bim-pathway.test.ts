import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { armoryEntries } from '../src/data/armory';

// The BIM pathway (#92). /examples/bim-pathway/tools/bim_pathway.py computes everything under generated/, and the CI job
// bim_pathway recomputes it and fails on any difference. These tests pin what the pages and recipes claim about it.

const EX = 'public/examples/bim-pathway';
const GEN = join(EX, 'generated');
const json = <T = Record<string, unknown>>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');

interface Requirement { label: string; failures: { element: string; reason: string }[] }
interface Spec { identifier: string; status: 'pass' | 'fail'; requirements: Requirement[] }
interface IdsResult { passed: number; failed: number; specifications: Spec[] }
interface MeshElement { class: string; triangles: number; closed: boolean; consistentlyOriented: boolean; eulerCharacteristic: number; throughHoles: number | null; enclosedVolume_m3: number | null; ifcopenshellVolume_m3: number; volumesAgree: boolean }
interface Quantity { id: string; value: number | null; unit: string; sources: string[]; GlobalIds: string[]; method: string; assumption: string }
interface Geometry { allBuilt: boolean; elements: { id: number; class: string; built: boolean; volume_m3: number }[] }

const PINNED_SAMPLE = '73b0e45d931d5dc13bfee5fdc7bd80f796526445458b2de74c4168d209097832';

describe('BIM pathway files', () => {
  const manifest = json<{ inputs: Record<string, string>; edited: Record<string, string>; coordination?: Record<string, string>; tools: Record<string, string> }>('manifest.json');

  it('serves the pinned buildingSMART sample, unchanged, with its licence', () => {
    expect(sha256(join(EX, 'wall-with-opening-and-window.ifc'))).toBe(PINNED_SAMPLE);
    expect(readFileSync(join(EX, 'LICENSE-buildingSMART.txt'), 'utf8')).toMatch(/Creative Commons Attribution 4\.0/);
  });

  it('records the hash of every input, of the edited copy and of the coordination outputs', () => {
    for (const [name, hash] of Object.entries(manifest.inputs)) expect(sha256(join(EX, name)), name).toBe(hash);
    for (const [name, hash] of Object.entries(manifest.edited)) expect(sha256(join(GEN, name)), name).toBe(hash);
    expect(Object.keys(manifest.inputs)).toEqual(expect.arrayContaining(['coordination-brief.json', 'review-gates.json']));
    expect(Object.keys(manifest.coordination ?? {})).toHaveLength(5);
    for (const [name, hash] of Object.entries(manifest.coordination ?? {})) expect(sha256(join(GEN, name)), name).toBe(hash);
  });

  it('pins the tool versions the requirements file installs', () => {
    const requirements = readFileSync('public/examples/bim-pathway/tools/requirements.txt', 'utf8');
    expect(requirements).toContain(`ifcopenshell==${manifest.tools.ifcopenshell}`);
    expect(requirements).toContain(`ifctester==${manifest.tools.ifctester}`);
    expect(requirements).toMatch(/--hash=sha256:/);
  });

  it('declares both IDS files as IDS 1.0', () => {
    for (const name of ['practice-requirements.ids', 'randori-cards.ids']) {
      expect(readFileSync(join(EX, name), 'utf8')).toContain('http://standards.buildingsmart.org/IDS/1.0/ids.xsd');
    }
  });
});

describe('BIM pathway results', () => {
  it('fails only REQ-03 on the original, on the wall, because FireRating is empty', () => {
    const ids = json<IdsResult>('original/ids.json');
    expect([ids.passed, ids.failed]).toEqual([5, 1]);
    const failed = ids.specifications.filter((spec) => spec.status === 'fail');
    expect(failed.map((spec) => spec.identifier)).toEqual(['REQ-03']);
    expect(failed[0]?.requirements[0]?.failures.map((failure) => failure.element)).toEqual(['#45']);
  });

  it('passes all six requirements on the edited copy', () => {
    const ids = json<IdsResult>('edited/ids.json');
    expect([ids.passed, ids.failed]).toEqual([6, 0]);
    expect(ids.specifications.map((spec) => spec.identifier)).toEqual(['REQ-01', 'REQ-02', 'REQ-03', 'REQ-04', 'REQ-05', 'REQ-06']);
  });

  it('reports the schema and geometry separately, and both hold on both models', () => {
    for (const key of ['original', 'edited']) {
      expect(json<{ valid: boolean; issues: unknown[] }>(`${key}/schema.json`)).toMatchObject({ valid: true, issues: [] });
      const geometry = json<Geometry>(`${key}/geometry.json`);
      expect(geometry.allBuilt).toBe(true);
      expect(geometry.elements.find((element) => element.class === 'IfcWall')?.volume_m3).toBe(1.5);
    }
  });

  it('changes exactly one property and keeps every GlobalId', () => {
    const change = json<{ propertyChanges: { element: string; property: string; before: { value: string }; after: { value: string } }[]; globalIdsKept: number; globalIdsInOriginal: number; globalIdsAdded: number }>('change.json');
    expect(change.propertyChanges).toHaveLength(1);
    expect(change.propertyChanges[0]).toMatchObject({ element: '#45', property: 'Pset_WallCommon.FireRating', before: { value: '' }, after: { value: 'REI 60' } });
    expect(change.globalIdsKept).toBe(change.globalIdsInOriginal);
    expect(change.globalIdsAdded).toBe(0);
  });

  it('gives the Randori cards the results BIM-R01 states', () => {
    const randori = json<IdsResult>('randori/ids.json');
    expect(Object.fromEntries(randori.specifications.map((spec) => [spec.identifier, spec.status]))).toEqual({ 'CARD-A': 'fail', 'CARD-B': 'pass', 'CARD-C': 'pass' });
  });

  it('matches the property counts and empty values the recipes cite', () => {
    type Psets = Record<string, { properties: Record<string, { empty: boolean }> }>;
    const properties = json<Record<string, { propertySets: Psets }>>('original/properties.json');
    const count = (id: string) => Object.values(properties[id]?.propertySets ?? {}).reduce((sum, pset) => sum + Object.keys(pset.properties).length, 0);
    expect(count('#45')).toBe(10);
    expect(count('#102')).toBe(9);
    const wall = properties['#45']?.propertySets.Pset_WallCommon?.properties ?? {};
    expect(Object.entries(wall).filter(([, value]) => value.empty).map(([name]) => name).sort()).toEqual(['AcousticRating', 'FireRating', 'Reference', 'SurfaceSpreadOfFlame']);
  });
});

describe('BIM pathway 3D mesh and quantities (BIM-005, BIM-006)', () => {
  it('exports the wall and the window as closed meshes whose volumes match IfcOpenShell', () => {
    const mesh = json<{ elements: MeshElement[]; excluded: string[]; allClosed: boolean; allVolumesAgree: boolean }>('mesh/mesh-checks.json');
    expect(mesh.elements.map((element) => element.class)).toEqual(['IfcWall', 'IfcWindow']);
    expect(mesh.excluded).toEqual(['#80=IfcOpeningElement']);
    expect([mesh.allClosed, mesh.allVolumesAgree]).toEqual([true, true]);
    const [wall, window] = mesh.elements;
    expect(wall).toMatchObject({ consistentlyOriented: true, eulerCharacteristic: 0, throughHoles: 1, enclosedVolume_m3: 1.5 });
    expect(window).toMatchObject({ consistentlyOriented: true, eulerCharacteristic: 2, throughHoles: 0, enclosedVolume_m3: 0.2 });
    const obj = readFileSync(join(GEN, 'mesh/wall-with-opening-and-window.obj'), 'utf8');
    expect(obj.match(/^o .+$/gm)).toEqual(['o IfcWall_3ZYW59sxj8lei475l7EhLU', 'o IfcWindow_0tA4DSHd50le6Ov9Yu0I9X']);
    expect(obj.match(/^f /gm)?.length).toBe(mesh.elements.reduce((sum, element) => sum + element.triangles, 0));
  });

  it('gives the quantities the BIM-006 recipe quotes, each traced to sources', () => {
    const data = json<{ quantities: Quantity[]; crossChecks: { agree: boolean }[]; authoredQuantitySets: number }>('quantities/quantities.json');
    const value = Object.fromEntries(data.quantities.map((row) => [row.id, row.value]));
    expect(value).toEqual({ 'Q-01': 3, 'Q-02': 0.3, 'Q-03': 2, 'Q-04': 1.8, 'Q-05': 0.3, 'Q-06': 1.5, 'Q-07': 6, 'Q-08': 1, 'Q-09': 5, 'Q-10': 1, 'Q-11': 0.7 });
    for (const row of data.quantities) {
      expect(row.sources.length, row.id).toBeGreaterThan(0);
      expect(row.GlobalIds.length, row.id).toBeGreaterThan(0);
      expect(row.method, row.id).not.toBe('');
      expect(row.assumption, row.id).not.toBe('');
    }
    expect(data.crossChecks).toHaveLength(4);
    expect(data.crossChecks.every((check) => check.agree)).toBe(true);
    expect(data.authoredQuantitySets).toBe(0);
    const csv = readFileSync(join(GEN, 'quantities/quantities.csv'), 'utf8').trim().split('\n');
    expect(csv).toHaveLength(data.quantities.length + 1);
  });
});

describe('BIM pathway coordination, sequence and review (BIM-007, BIM-008, BIM-R02)', () => {
  interface Pair { element: string; overlap_m3: number; gap_m: number }
  interface Clashes { hardClashes: string[]; routesAgree: boolean; boxRoute: { holds: boolean; pairs: Pair[] }; clashTree: { hard: { b: string; aGlobalId: string; bGlobalId: string }[] } }
  interface Issue { id: string; type: string; status: string; GlobalIds: string[]; reviewGates: string[] }
  interface BcfCheck { version: string; parts: { errors: string[] }[]; schemaFiles: { file: string; matchesOfficial: boolean }[]; readBack: { tool: string; topics: { selected: string[]; selectedInModel: boolean }[] } }
  const WALL = '3ZYW59sxj8lei475l7EhLU';

  it('adds one duct to the edited copy and finds its one hard clash, with the wall, by both routes', () => {
    const geometry = json<Geometry>('coordination/geometry.json');
    expect(geometry.allBuilt).toBe(true);
    expect(geometry.elements.map((element) => element.class).sort()).toEqual(['IfcDuctSegment', 'IfcOpeningElement', 'IfcWall', 'IfcWindow']);
    expect(geometry.elements.find((element) => element.class === 'IfcDuctSegment')?.volume_m3).toBe(0.15);
    const clashes = json<Clashes>('coordination/clashes.json');
    expect([clashes.routesAgree, clashes.boxRoute.holds]).toEqual([true, true]);
    expect(clashes.hardClashes).toEqual(['#45=IfcWall']);
    expect(clashes.clashTree.hard.map((clash) => clash.b)).toEqual(['#45=IfcWall']);
    expect(clashes.boxRoute.pairs.find((pair) => pair.element === '#45=IfcWall')?.overlap_m3).toBe(0.03);
    expect(clashes.boxRoute.pairs.find((pair) => pair.element === '#102=IfcWindow')).toMatchObject({ overlap_m3: 0, gap_m: 0.03 });
    expect(json<{ valid: boolean; issues: unknown[] }>('coordination/schema.json')).toMatchObject({ valid: true, issues: [] });
  });

  it('raises the clash as an open issue in a BCF 3.0 file that validates and reads back', () => {
    const { issues } = json<{ issues: Issue[] }>('coordination/issues.json');
    expect(issues.map((issue) => [issue.id, issue.type, issue.status])).toEqual([['ISS-001', 'Clash', 'Open']]);
    expect(issues[0]?.GlobalIds).toContain(WALL);
    expect(issues[0]?.reviewGates).toEqual(['G2', 'G3']);
    const bcf = json<BcfCheck>('coordination/bcf-check.json');
    expect(bcf.version).toBe('3.0');
    expect(bcf.parts.length).toBeGreaterThanOrEqual(4);
    expect(bcf.parts.every((part) => part.errors.length === 0)).toBe(true);
    expect(bcf.readBack.tool).toBe('bcf-client');
    expect(bcf.readBack.topics).toHaveLength(1);
    expect(bcf.readBack.topics[0]?.selectedInModel).toBe(true);
    expect(bcf.readBack.topics[0]?.selected.sort()).toEqual([...(issues[0]?.GlobalIds ?? [])].sort());
    expect(bcf.schemaFiles.map((file) => file.file)).toContain('schemas/bcf-xml/v3.0/markup.xsd');
    expect(bcf.schemaFiles.every((file) => file.matchesOfficial)).toBe(true);
    expect(readFileSync(join(GEN, 'coordination/issues.bcf')).subarray(0, 2).toString('latin1')).toBe('PK');
  });

  it('maps every element to one task and derives each dependency from the model or an issue', () => {
    const schedule = json<{ order: string[]; tasks: { task: string; builds: string[]; duration: null; heldBy: string[] }[]; dependencies: { before: string; after: string; because: string[] }[]; readBack: { matchesWhatWasWritten: boolean; workSchedules: number } }>('planning/schedule.json');
    expect(schedule.order).toEqual(['T-010', 'T-020', 'T-030', 'T-040']);
    expect(schedule.dependencies.map((dependency) => `${dependency.before}>${dependency.after}`)).toEqual(['T-010>T-020', 'T-010>T-030', 'T-030>T-040']);
    for (const dependency of schedule.dependencies) expect(dependency.because.length).toBeGreaterThan(0);
    expect(schedule.tasks.flatMap((task) => task.builds).sort()).toEqual(['#102=IfcWindow', '#150=IfcDuctSegment', '#45=IfcWall', '#80=IfcOpeningElement']);
    expect(schedule.tasks.every((task) => task.duration === null)).toBe(true);
    expect(schedule.tasks.find((task) => task.task === 'T-040')?.heldBy).toEqual(['ISS-001']);
    expect(schedule.readBack).toMatchObject({ matchesWhatWasWritten: true, workSchedules: 1 });
    expect(json<{ valid: boolean }>('planning/schema.json').valid).toBe(true);
  });

  it('cites a source on every cost line and prices none', () => {
    const cost = json<{ lines: { id: string; source: string; quantity: number; rate: null; amount: null }[]; priced: number }>('planning/cost-plan.json');
    expect(cost.lines.map((line) => [line.id, line.source, line.quantity])).toEqual([['C-01', 'Q-06', 1.5], ['C-02', 'count', 1], ['C-03', 'duct-length', 1.5], ['C-04', 'issues', 1]]);
    expect(cost.priced).toBe(0);
    expect(cost.lines.every((line) => line.rate === null && line.amount === null)).toBe(true);
  });

  it('gives the specialist Randori cards the results BIM-R02 states', () => {
    const { cards } = json<{ cards: { id: string; changes: string; newIssues?: string[]; fieldOfViewWithinOfficial21Range?: boolean; routesAgree?: boolean }[] }>('randori-coordination/cards.json');
    expect(cards.map((card) => [card.id, card.changes])).toEqual([['CARD-R', 'requirement'], ['CARD-F', 'format'], ['CARD-T', 'tool']]);
    expect(cards[0]?.newIssues).toEqual(['ISS-002']);
    expect(cards[1]?.fieldOfViewWithinOfficial21Range).toBe(true);
    expect(cards[2]?.routesAgree).toBe(true);
    const bcf21 = json<BcfCheck>('randori-coordination/bcf21-check.json');
    expect(bcf21.version).toBe('2.1');
    expect(bcf21.parts.every((part) => part.errors.length === 0)).toBe(true);
    expect(bcf21.readBack.topics).toHaveLength(1);
    const clearance = json<{ issues: Issue[] }>('randori-coordination/issues-clearance.json');
    expect(clearance.issues.map((issue) => issue.id)).toEqual(['ISS-001', 'ISS-002']);
  });

  it('names reviewers for every gate, reviews none and is never construction ready', () => {
    const review = json<{ gates: { id: string; reviewers: string[]; status: string; evidence: string[] }[]; reviewed: number; constructionReady: boolean }>('review/review-package.json');
    expect(review.gates.map((gate) => gate.id)).toEqual(['G1', 'G2', 'G3', 'G4', 'G5']);
    for (const gate of review.gates) {
      expect(gate.reviewers.length, gate.id).toBeGreaterThan(0);
      expect(gate.status, gate.id).toBe('not-reviewed');
      for (const path of gate.evidence) expect(existsSync(join(GEN, path)), `${gate.id}: ${path}`).toBe(true);
    }
    expect([review.reviewed, review.constructionReady]).toEqual([0, false]);
    expect(readFileSync(join(GEN, 'review/review-package.md'), 'utf8')).toContain('Construction ready: no.');
  });
});

describe('BIM pathway evidence links', () => {
  const recipes = readdirSync('src/content/kata-recipes').filter((file) => file.startsWith('bim-'));

  it('has ten recipes, and every evidence path they cite is a published file', () => {
    expect(recipes).toHaveLength(10);
    for (const file of recipes) {
      const text = readFileSync(join('src/content/kata-recipes', file), 'utf8');
      parseYaml(text);
      const paths = [...text.matchAll(/\/examples\/bim-pathway\/[\w./-]+/g)].map((match) => match[0].replace(/[.,]$/, ''));
      expect(paths.length, file).toBeGreaterThan(0);
      for (const path of paths) expect(existsSync(join('public', path)), `${file}: ${path}`).toBe(true);
    }
  });

  it('keeps the Armory smoke-test evidence in step with the generated results', () => {
    for (const id of ['ifcopenshell', 'ifctester']) {
      const entry = armoryEntries.find((candidate) => candidate.id === id);
      const smokeTest = entry?.smokeTest;
      expect(smokeTest && 'result' in smokeTest ? smokeTest.result : undefined, id).toBe('passed');
    }
    const tester = JSON.parse(readFileSync('public/examples/armory/ifctester.json', 'utf8')) as Record<string, unknown>;
    expect(JSON.stringify(tester)).toContain('REQ-03');
    const editEvidence = readFileSync('public/examples/armory/ifcopenshell-edit-validate.json', 'utf8');
    const edited = Object.values(json<{ edited: Record<string, string> }>('manifest.json').edited)[0] ?? 'missing';
    expect(editEvidence).toContain(edited);
  });
});
