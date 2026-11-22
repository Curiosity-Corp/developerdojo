import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assessmentMap } from '../src/data/assessment-map';
import { ADVANCED_MINIMUM, checkAssessmentMap, loadAssessmentMap, type AssessmentMap } from '../src/lib/assessment-map';

// The assessment map (#90): the shipped data holds every rule, and each rule rejects data that breaks it.
const root = join(import.meta.dirname, '..');
const read = (...parts: string[]) => readFileSync(join(root, ...parts), 'utf8');
const copy = (): AssessmentMap => structuredClone(assessmentMap) as AssessmentMap;
const rank = (map: AssessmentMap, id: AssessmentMap['ranks'][number]['rank']) => {
  const found = map.ranks.find((item) => item.rank === id);
  if (!found) throw new Error(`no ${id} in the map`);
  return found;
};

describe('the shipped assessment map', () => {
  it('holds every rule', () => {
    expect(checkAssessmentMap(assessmentMap)).toEqual([]);
    expect(() => loadAssessmentMap(assessmentMap)).not.toThrow();
  });

  it('labels every rubric and belt stage proposed, and reports no pilot result', () => {
    for (const item of assessmentMap.ranks) expect(item.rubric.status).toBe('proposed');
    for (const stage of assessmentMap.belts.stages) expect(stage.status).toBe('proposed');
    expect(assessmentMap.pilot.status).toBe('not-run');
    for (const measure of assessmentMap.pilot.measures) expect(measure.value).toBeNull();
  });

  it('requires the advanced minimum, transfer for Master Developer, teaching and adaptation for Sensei', () => {
    for (const id of ['master-developer', 'sensei'] as const) {
      for (const criterion of rank(assessmentMap, id).rubric.criteria) {
        for (const demand of ADVANCED_MINIMUM) expect(criterion.demands, criterion.id).toContain(demand);
      }
    }
    expect(rank(assessmentMap, 'master-developer').rubric.criteria.some((c) => c.demands.includes('transfer'))).toBe(true);
    const sensei = rank(assessmentMap, 'sensei').rubric.criteria.flatMap((c) => c.demands);
    expect(sensei).toContain('teaching');
    expect(sensei).toContain('domain-adaptation');
  });
});

describe('the rules reject a map that breaks them', () => {
  it('rejects a rubric or belt stage marked approved', () => {
    const map = copy() as unknown as { ranks: { rubric: { status: string } }[]; belts: { stages: { status: string }[] } };
    map.ranks[1]!.rubric.status = 'approved';
    expect(checkAssessmentMap(map).join()).toMatch(/proposed/);
    const belts = copy() as unknown as typeof map;
    belts.belts.stages[4]!.status = 'issued';
    expect(checkAssessmentMap(belts)).not.toEqual([]);
  });

  for (const demand of ADVANCED_MINIMUM) {
    it(`rejects an advanced criterion without ${demand}`, () => {
      const map = copy();
      const criterion = rank(map, 'master-developer').rubric.criteria[1]!;
      criterion.demands = criterion.demands.filter((item) => item !== demand);
      expect(checkAssessmentMap(map).join('\n')).toContain(`${criterion.id} is advanced and must require ${demand}`);
    });
  }

  it('rejects a Master Developer rubric without transfer', () => {
    const map = copy();
    for (const criterion of rank(map, 'master-developer').rubric.criteria) criterion.demands = criterion.demands.filter((item) => item !== 'transfer');
    expect(checkAssessmentMap(map)).toContain('Master Developer must assess transfer across a tool family or field');
  });

  it('rejects a Sensei rubric without teaching or without domain adaptation', () => {
    const noTeaching = copy();
    for (const criterion of rank(noTeaching, 'sensei').rubric.criteria) criterion.demands = criterion.demands.filter((item) => item !== 'teaching');
    expect(checkAssessmentMap(noTeaching)).toContain('Sensei must assess teaching or reviewing a generalizable technique');
    const noAdaptation = copy();
    for (const criterion of rank(noAdaptation, 'sensei').rubric.criteria) criterion.demands = criterion.demands.filter((item) => item !== 'domain-adaptation');
    expect(checkAssessmentMap(noAdaptation)).toContain('Sensei must assess the domain adaptations of the technique');
  });

  it('rejects a Developer rubric called advanced, and ranks out of order', () => {
    const tier = copy();
    rank(tier, 'developer').rubric.tier = 'advanced';
    expect(checkAssessmentMap(tier).join('\n')).toContain('developer rubric must be foundation');
    const order = copy();
    order.ranks.reverse();
    expect(checkAssessmentMap(order).join('\n')).toMatch(/ranks must be listed once each/);
  });

  it('rejects a criterion id that belongs to another rank, or is listed twice', () => {
    const map = copy();
    rank(map, 'sensei').rubric.criteria[0]!.id = 'MD-1';
    const problems = checkAssessmentMap(map).join('\n');
    expect(problems).toContain('MD-1 belongs to sensei and must start with SEN-');
    expect(problems).toContain('criterion MD-1 is listed twice');
  });

  it('rejects a pilot measure with a value before any pilot has run, and accepts null as unavailable', () => {
    const map = copy();
    map.pilot.measures[0]!.value = '0';
    expect(checkAssessmentMap(map).join('\n')).toContain('has a value, but no pilot has run');
  });

  it('rejects a pilot missing one of the six kinds of evidence', () => {
    const map = copy();
    map.pilot.evidence[5]!.kind = 'artifacts';
    expect(checkAssessmentMap(map).join('\n')).toContain('pilot evidence must include decisions');
  });

  it('rejects belt stages out of order', () => {
    const map = copy();
    map.belts.stages.reverse();
    expect(checkAssessmentMap(map).join('\n')).toContain('belt stages must be white, yellow, green, brown, black in order');
  });

  for (const [name, pattern] of [
    ['a checklist or attendance does not award a belt', /checklist/i],
    ['not professional licensure or accreditation', /licensure/i],
    ['the static site takes no authenticated submissions', /authenticated/i],
    ['qualified professional approval stays separate', /qualified professional/i],
    ['consent before sharing', /consent/i],
  ] as const) {
    it(`requires the boundary: ${name}`, () => {
      const map = copy();
      map.boundaries = map.boundaries.filter((line) => !pattern.test(line));
      while (map.boundaries.length < 4) map.boundaries.push('A placeholder boundary line for the test.');
      expect(checkAssessmentMap(map)).toContain(`boundaries must state: ${name}`);
    });
  }

  it('rejects specialist belt criteria with another prefix, without a Randori criterion, or without field limits', () => {
    const prefix = copy();
    prefix.specialistBelts.criteria[0]!.id = 'DEV-9';
    expect(checkAssessmentMap(prefix).join('\n')).toContain('DEV-9 is a specialist belt criterion and must start with SPB-');
    const noRandori = copy();
    for (const criterion of noRandori.specialistBelts.criteria) criterion.demands = criterion.demands.filter((item) => item !== 'unseen-constraint');
    expect(checkAssessmentMap(noRandori).join('\n')).toContain('specialist belts must have a Randori criterion');
    const noLimits = copy();
    for (const criterion of noLimits.specialistBelts.criteria) criterion.demands = criterion.demands.filter((item) => item !== 'domain-adaptation');
    expect(checkAssessmentMap(noLimits).join('\n')).toContain('specialist belts must assess the limits and qualified review of the field');
  });

  it('rejects reviewed specialist stages out of order or repeated', () => {
    const order = copy();
    order.specialistBelts.reviewedStages = ['black', 'brown'];
    expect(checkAssessmentMap(order).join('\n')).toContain('reviewedStages must list each stage once, in belt order');
    const repeated = copy();
    repeated.specialistBelts.reviewedStages = ['brown', 'brown'];
    expect(checkAssessmentMap(repeated).join('\n')).toContain('reviewedStages must list each stage once, in belt order');
  });

  it('rejects unknown fields, so nothing unreviewed slips onto the page', () => {
    const map = copy() as unknown as Record<string, unknown>;
    map.approvedBy = 'someone';
    expect(checkAssessmentMap(map)).not.toEqual([]);
  });

  it('fails the build with one readable message listing every problem', () => {
    const map = copy();
    map.pilot.measures[0]!.value = '3';
    rank(map, 'developer').rubric.tier = 'advanced';
    expect(() => loadAssessmentMap(map)).toThrow(/assessment map is invalid[\s\S]*foundation[\s\S]*no pilot has run/);
  });
});

describe('the map is reachable and the procedure is written', () => {
  it('links each specialist belt to the review record, and the pilot to the record', () => {
    const page = read('src', 'pages', 'assessment-map.astro');
    expect(page).toContain('href="/review-record"');
    expect(page).toContain('/review-record?subject=belt:');
    expect(read('src', 'pages', 'belt-review.astro')).toContain('href="/review-record"');
  });

  it('is linked from the belts, certificates and review pages', () => {
    for (const path of [['src', 'components', 'BeltJourney.astro'], ['src', 'pages', 'certificates.astro'], ['src', 'pages', 'belt-review.astro']]) {
      expect(read(...path), path.join('/')).toContain('href="/assessment-map"');
    }
  });

  it('the belts page takes its stages from the map, so the two cannot drift apart', () => {
    expect(read('src', 'components', 'BeltJourney.astro')).toContain('assessmentMap.belts.stages');
  });

  it('has a pilot procedure that reuses the certificate steps and the Sensei handbook, linked from the handbook', () => {
    const doc = read('docs', 'independent-review-pilot.md');
    for (const heading of ['## 3. The evidence the reviewer receives', '## 4. Run a pilot review', '## 5. After the review: correct, withdraw, report', '## 6. What the pilot reuses']) {
      expect(doc, heading).toContain(heading);
    }
    expect(doc).toMatch(/certificates\.md#8-issue-a-certificate/);
    expect(doc).toMatch(/certificates\.md#9-correct-an-entry/);
    expect(doc).toMatch(/sensei-run-a-30-minute-review/);
    expect(doc).toMatch(/takes no authenticated submissions/);
    expect(doc).toMatch(/not professional licensure or accreditation/);
    expect(read('docs', 'handbook.md')).toContain('independent-review-pilot.md');
  });

  it('every library page the pilot procedure links to exists', () => {
    const doc = read('docs', 'independent-review-pilot.md');
    const targets = [...doc.matchAll(/\]\(\.\.\/(src\/content\/library\/[a-z0-9-]+\.md)\)/g)].map((match) => match[1]!);
    expect(targets.length).toBeGreaterThan(3);
    for (const target of targets) expect(() => read(target), target).not.toThrow();
  });
});
