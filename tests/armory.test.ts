import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { armoryEntries, armoryStackRecipes } from '../src/data/armory';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { ARMORY_KINDS, ArmoryError, ECOSYSTEMS, armoryEntrySchema, armoryUsage, listingGaps, validateArmory, type ArmoryEntryInput, type ArmoryReferences } from '../src/lib/armory';

const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const refs: ArmoryReferences = { resources: resourceIds(), kataStackRecipes: kataDimensions.stackRecipes, today: '2026-11-20' };
const problems = (entries: unknown, recipes: unknown = armoryStackRecipes, references = refs): readonly string[] => {
  try { validateArmory({ entries, recipes }, references); return []; }
  catch (error) { if (error instanceof ArmoryError) return error.problems; throw error; }
};
const real = validateArmory({ entries: armoryEntries, recipes: armoryStackRecipes }, refs);
const resolved = (id: string) => {
  const found = real.entries.find((candidate) => candidate.entry.id === id);
  if (!found) throw new Error(`entry ${id} missing`);
  return found;
};
const input = (id: string): ArmoryEntryInput => {
  const found = armoryEntries.find((entry) => entry.id === id);
  if (!found) throw new Error(`entry ${id} missing`);
  return structuredClone(found);
};
const evidence = (path: string): Record<string, unknown> => JSON.parse(readFileSync(join('public', path), 'utf8')) as Record<string, unknown>;

describe('armory registry: published records', () => {
  it('validates against the resources collection and kataDimensions.stackRecipes', () => {
    expect(problems(armoryEntries)).toEqual([]);
  });

  it('lists exactly the entries with a passed smoke test and nothing missing', () => {
    expect(real.entries.filter((entry) => entry.listed).map((entry) => entry.entry.id).sort())
      .toEqual(['claude-code', 'claude-haiku-5-5', 'claude-sonnet-5-5', 'git', 'ifcopenshell', 'mcp-filesystem', 'playwright-mcp']);
    for (const entry of real.entries) expect(entry.listed).toBe(entry.gaps.length === 0);
  });

  it('keeps the anchors of the earlier registry so old links still land', () => {
    for (const id of ['claude-code', 'gemini-cli', 'cloudflare-harness', 'skills-format', 'scan-to-threejs', 'playwright-mcp', 'mcp-filesystem', 'blender-mcp', 'intuit-cli', 'xai-docs']) {
      expect(armoryEntries.some((entry) => entry.id === id), id).toBe(true);
    }
  });

  it('covers every kind and every specialist ecosystem', () => {
    expect(new Set(armoryEntries.map((entry) => entry.kind))).toEqual(new Set(ARMORY_KINDS));
    expect(new Set(armoryEntries.flatMap((entry) => entry.ecosystems ?? []))).toEqual(new Set(ECOSYSTEMS));
  });

  it('gives every executable entry that is listed a provenance review, and the scan-to-threejs skill a source review', () => {
    for (const { entry, listed } of real.entries) if (listed && entry.executable) expect('date' in entry.securityReview, entry.id).toBe(true);
    const skill = resolved('scan-to-threejs').entry.securityReview;
    expect('scope' in skill && skill.scope).toBe('provenance-and-source');
  });

  it('uses https for every source and links nothing internal', () => {
    for (const entry of armoryEntries) for (const source of entry.sources) {
      if (source.url) expect(source.url, entry.id).toMatch(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\//);
      expect(JSON.stringify(source), entry.id).not.toMatch(/developerdojo\.org|focuspass|\.internal|\/issues\//);
    }
  });

  it('links every listed smoke test to an evidence file that exists', () => {
    for (const { entry, listed } of real.entries) {
      if (!listed || !('evidence' in entry.smokeTest)) continue;
      for (const path of entry.smokeTest.evidence) expect(existsSync(join('public', path)), path).toBe(true);
    }
  });
});

describe('armory registry: evidence matches the records', () => {
  it('filesystem server: 16 tools, sandbox calls succeed and the outside read is refused', () => {
    const run = evidence('/examples/armory/mcp-filesystem.json') as { transcript: { server: { version: string }; tools: { name: string }[]; steps: { call: { name: string }; isError: boolean; text: string }[] } };
    expect(run.transcript.server.version).toBe('2.4.0');
    expect(run.transcript.tools).toHaveLength(16);
    const steps = run.transcript.steps;
    expect(steps.slice(0, -1).every((step) => !step.isError)).toBe(true);
    expect(steps.map((step) => step.call.name)).toEqual(expect.arrayContaining(['write_file', 'edit_file']));
    expect(steps.at(-1)).toMatchObject({ isError: true });
    expect(steps.at(-1)?.text).toContain('Access denied');
    expect(JSON.stringify(run)).not.toMatch(/\/tmp\/|\/home\//);
  });

  it('Playwright MCP: 25 tools and the clicked button is reported pressed', () => {
    const run = evidence('/examples/armory/playwright-mcp.json') as { transcript: { tools: { name: string }[]; steps: { call: { name: string }; isError: boolean; text: string }[] } };
    expect(run.transcript.tools).toHaveLength(25);
    expect(run.transcript.tools.map((tool) => tool.name)).toEqual(expect.arrayContaining(['browser_evaluate', 'browser_run_code_unsafe']));
    const snapshot = run.transcript.steps.find((step) => step.call.name === 'browser_snapshot');
    expect(snapshot?.isError).toBe(false);
    expect(snapshot?.text).toMatch(/button "Planted"[^\n]*\[pressed\]/);
    expect(JSON.stringify(run)).not.toMatch(/\/tmp\/|\/home\//);
  });

  it('IfcOpenShell: version and counts match the record', () => {
    const run = evidence('/examples/armory/ifcopenshell.json') as { output: { ifcopenshell: string; schema: string; counts: Record<string, number> } };
    expect(run.output.ifcopenshell).toBe(resolved('ifcopenshell').entry.version && '0.9.0.post1');
    expect(run.output).toMatchObject({ schema: 'IFC4', counts: { IfcWall: 1, IfcOpeningElement: 1, IfcWindow: 1, IfcBuildingStorey: 1, IfcPropertySet: 2 } });
  });

  it('Git: two commits, clean tree, fsck clean', () => {
    expect(evidence('/examples/armory/git.json')).toMatchObject({ output: { version: 'git version 2.53.0', commits: 2, uncommittedFiles: 0, fsck: 'no errors' } });
  });

  it('Claude Code and the two models: FND-001 runs used the recorded harness version and models without error', () => {
    for (const [file, model] of [['baseline-r1', 'claude-sonnet-5-5'], ['baseline-r2', 'claude-sonnet-5-5'], ['baseline-r3', 'claude-sonnet-5-5'], ['model-r1', 'claude-haiku-5-5'], ['model-r2', 'claude-haiku-5-5'], ['model-r3', 'claude-haiku-5-5']] as const) {
      const run = evidence(`/examples/fnd-001/runs/${file}.json`);
      expect(run, file).toMatchObject({ isError: false, requestedModel: model, modelsUsed: [model] });
      expect(String(run.harness)).toContain('2.1.329');
    }
    for (const id of ['claude-sonnet-5-5', 'claude-haiku-5-5']) {
      const { entry } = resolved(id);
      expect('value' in entry.version && entry.version.value).toBe(id);
    }
  });
});

describe('armory registry: rules', () => {
  it('rejects an entry with an unknown kind or a missing source', () => {
    expect(problems([{ ...input('git'), kind: 'robot' }]).join('\n')).toMatch(/git: kind/);
    expect(problems([{ ...input('git'), sources: [] }]).join('\n')).toMatch(/git: sources/);
  });

  it('requires a note for a community maintainer and a documentation or repository source', () => {
    const entry = input('scan-to-threejs');
    entry.maintainer = { name: 'Someone', status: 'community' };
    expect(problems([entry]).join('\n')).toMatch(/community/);
    const onlyPricing = input('git');
    onlyPricing.sources = [{ label: 'Prices', role: 'pricing', url: 'https://example.com/prices' }];
    expect(problems([onlyPricing]).join('\n')).toMatch(/documentation or repository/);
  });

  it('refuses tested claims without a passed smoke test', () => {
    const entry = input('git');
    entry.smokeTest = { unavailable: 'not run' };
    expect(problems([entry]).join('\n')).toMatch(/smoke/);
  });

  it('refuses evidence outside the published evidence folders', () => {
    const entry = input('git');
    if ('evidence' in entry.smokeTest) entry.smokeTest.evidence = ['/home/someone/run.json'];
    expect(problems([entry]).join('\n')).toMatch(/evidence/);
  });

  it('refuses a review dated after the entry was last verified', () => {
    const entry = input('git');
    if ('date' in entry.smokeTest) entry.smokeTest.date = '2026-12-01';
    expect(problems([entry]).join('\n')).toMatch(/smokeTest/);
  });

  it('reports unknown resources, duplicates and replacements', () => {
    const unknownResource = input('git');
    unknownResource.sources = [{ label: 'Gone', role: 'documentation', resourceId: 'nobody/nothing' }];
    expect(problems([unknownResource])).toContain('git: unknown resource nobody/nothing');
    expect(problems([input('git'), input('git')])).toContain('duplicate entry ID: git');
    const withdrawn = input('ffmpeg');
    withdrawn.withdrawn = { reason: 'Replaced', replacedBy: 'missing-tool' };
    expect(problems([input('git'), withdrawn])).toContain('ffmpeg: unknown replacement missing-tool');
  });

  it('keeps stack recipes and kataDimensions.stackRecipes in step, both ways', () => {
    expect(problems([input('git')], armoryStackRecipes.slice(0, 1))).toContain('kataDimensions.stackRecipes names git-and-node, which has no Armory recipe');
    const extra = [...armoryStackRecipes, { id: 'new-stack', title: 'New', summary: 'New stack.', components: [{ entryId: 'git', role: 'Records' }] }];
    expect(problems([input('git')], extra)).toContain('recipe new-stack: add it to kataDimensions.stackRecipes so katas can reference it');
    const badComponent = [{ ...armoryStackRecipes[1], components: [{ entryId: 'nope', role: 'x' }] }, armoryStackRecipes[0]];
    expect(problems([input('git')], badComponent)).toContain('recipe git-and-node: unknown entry nope');
  });

  it('computes listing gaps instead of trusting a flag', () => {
    const entry = armoryEntrySchema.parse(input('gemini-cli'));
    expect(listingGaps(entry)).toEqual(expect.arrayContaining(['no recorded smoke test', 'setup not written', 'no security or provenance review', 'permission scope incomplete']));
    const withdrawn = armoryEntrySchema.parse({ ...input('git'), withdrawn: { reason: 'Superseded' } });
    expect(listingGaps(withdrawn)).toContain('withdrawn');
    const failed = input('git');
    if ('result' in failed.smokeTest) failed.smokeTest.result = 'failed';
    failed.operations = failed.operations?.map((operation) => ({ ...operation, evidence: 'documented' as const }));
    failed.compatibility = failed.compatibility?.map((row) => ({ ...row, evidence: 'documented' as const }));
    expect(listingGaps(armoryEntrySchema.parse(failed))).toContain('smoke test failed');
  });

  it('marks an entry due once its next review date has passed', () => {
    const later = validateArmory({ entries: armoryEntries, recipes: armoryStackRecipes }, { ...refs, today: '2027-02-21' });
    expect(later.entries.every((entry) => entry.reviewDue)).toBe(true);
    expect(real.entries.some((entry) => entry.reviewDue)).toBe(false);
  });

  it('links katas to the recipes and entries they use', () => {
    const usage = armoryUsage(real, kataCatalog.map(({ metadata, href }) => ({ id: metadata.id, title: metadata.title, href, stackRecipeIds: metadata.stackRecipeIds ?? [], externalResources: metadata.externalResources ?? [] })));
    expect(usage.recipes.get('git-and-node')?.map((kata) => kata.id)).toEqual(['PRACTICE-006']);
    expect(usage.entries.get('git')?.map((kata) => kata.id)).toEqual(['PRACTICE-006']);
    expect(usage.recipes.get('assistant-and-browser')?.length).toBe(8);
  });
});
