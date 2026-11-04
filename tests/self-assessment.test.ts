import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  HONESTY_QUESTIONS,
  LEVEL_NAMES,
  SKILLS,
  emptyAssessment,
  gapSentence,
  latestLevel,
  parseAssessment,
  renderScoreSheet,
  scoreOf,
  setCoach,
  setEvidence,
  setHonesty,
  setLevel,
  summarise,
} from '../src/lib/self-assessment';

const page = readFileSync('src/content/library/rubric-track-a-self-assessment.md', 'utf8');

/** The rows of the markdown table that follows a given "### Skill X: ..." heading. */
function levelRows(skillId: string): string[] {
  const start = page.indexOf(`### Skill ${skillId}:`);
  expect(start, `skill ${skillId} heading`).toBeGreaterThan(-1);
  const next = page.indexOf('\n### ', start + 5);
  const section = page.slice(start, next === -1 ? undefined : next);
  return section
    .split('\n')
    .filter((line) => /^\| \*\*\d /.test(line))
    .map((line) => line.split('|')[2]?.trim() ?? '');
}

describe('self-assessment data matches the rubric page', () => {
  it('has the six skills of the page, in order', () => {
    expect(SKILLS.map((skill) => skill.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    for (const skill of SKILLS) expect(page).toContain(`### Skill ${skill.id}: `);
  });

  for (const skill of SKILLS) {
    it(`skill ${skill.id} has the same four level sentences as the page`, () => {
      expect(levelRows(skill.id)).toEqual([...skill.levels]);
    });
  }

  it('uses the same level names as the page', () => {
    for (const [index, name] of LEVEL_NAMES.entries()) expect(page).toContain(`| ${index + 1} | ${name} |`);
  });

  it('asks the same three honesty questions as the page', () => {
    for (const question of HONESTY_QUESTIONS) {
      // The page writes "my milestones" in bold; compare without the markdown marks.
      expect(page.replace(/\*\*/g, '')).toContain(question);
    }
  });

  it('has the page frontmatter that switches the tool on', () => {
    expect(page).toMatch(/^tool: self-assessment-track-a$/m);
  });
});

describe('assessment state', () => {
  it('sets level, evidence and coach score, and clears them again', () => {
    let state = setLevel(emptyAssessment(), 1, 'A', 3);
    state = setEvidence(state, 1, 'A', 'map/repository-map.md');
    state = setCoach(state, 'A', 2);
    expect(scoreOf(state, 1, 'A')).toEqual({ level: 3, evidence: 'map/repository-map.md' });
    expect(state.coach['A']).toBe(2);
    state = setLevel(state, 1, 'A', undefined);
    expect(scoreOf(state, 1, 'A')).toEqual({ evidence: 'map/repository-map.md' });
    state = setEvidence(state, 1, 'A', '');
    expect(state.weeks['1']).toBeUndefined();
    expect(setCoach(state, 'A', undefined).coach).toEqual({});
  });

  it('keeps weeks apart', () => {
    let state = setLevel(emptyAssessment(), 1, 'B', 2);
    state = setLevel(state, 2, 'B', 3);
    expect(scoreOf(state, 1, 'B').level).toBe(2);
    expect(scoreOf(state, 2, 'B').level).toBe(3);
    expect(latestLevel(state, 'B')).toBe(3);
    expect(latestLevel(state, 'C')).toBeUndefined();
  });

  it('parses defensively: unknown skills, weeks, levels and shapes are dropped', () => {
    expect(parseAssessment(null)).toEqual(emptyAssessment());
    expect(parseAssessment('x')).toEqual(emptyAssessment());
    const parsed = parseAssessment({
      weeks: { '1': { A: { level: 9, evidence: 'ok' }, Z: { level: 2, evidence: '' }, B: { level: 4, evidence: 5 } }, '9': { A: { level: 1, evidence: '' } } },
      coach: { A: 0, B: 3, Q: 2 },
      honesty: { '1': { answers: ['yes', 'maybe'], note: 'n' }, '2': { answers: [], note: '' } },
    });
    expect(parsed.weeks['1']).toEqual({ A: { evidence: 'ok' }, B: { level: 4, evidence: '' } });
    expect(parsed.weeks['9']).toBeUndefined();
    expect(parsed.coach).toEqual({ B: 3 });
    expect(parsed.honesty['1']).toEqual({ answers: ['yes', '', ''], note: 'n' });
    expect(parsed.honesty['2']).toBeUndefined();
  });

  it('caps very long text', () => {
    const state = setEvidence(emptyAssessment(), 1, 'A', 'x'.repeat(5000));
    expect(scoreOf(state, 1, 'A').evidence.length).toBe(600);
  });
});

describe('summary and gap', () => {
  it('counts scores, the target, the floor and missing evidence', () => {
    let state = emptyAssessment();
    for (const skill of SKILLS) {
      state = setLevel(state, 4, skill.id, 3);
      state = setEvidence(state, 4, skill.id, 'link');
    }
    expect(summarise(state, 4)).toMatchObject({ scored: 6, atTarget: 6, belowFloor: [], missingEvidence: [], meetsTarget: true });
    state = setLevel(state, 4, 'C', 1);
    state = setEvidence(state, 4, 'D', '');
    const result = summarise(state, 4);
    expect(result.meetsTarget).toBe(false);
    expect(result.belowFloor).toEqual(['C']);
    expect(result.missingEvidence).toEqual(['D']);
    expect(summarise(emptyAssessment(), 1).scored).toBe(0);
  });

  it('describes the gap with the coach in plain words', () => {
    expect(gapSentence(3, undefined)).toBe('');
    expect(gapSentence(3, 3)).toContain('both scored 3');
    expect(gapSentence(4, 2)).toContain('2 levels higher');
    expect(gapSentence(2, 3)).toContain('1 level lower');
  });
});

describe('Markdown score sheet', () => {
  it('has the same table as the rubric page and says it is not a grade', () => {
    const md = renderScoreSheet(emptyAssessment(), '2026-11-04');
    expect(md).toContain('| Skill | Week 1 | Week 2 | Week 3 | Week 4 | Coach score (Week 4) | Evidence (one example) |');
    expect(md).toContain('not a grade and not a certificate');
    for (const skill of SKILLS) expect(md).toContain(`| ${skill.id}. ${skill.name} |`);
    expect(md).not.toContain('## Evidence by week');
    expect(md).not.toContain('honesty check');
  });

  it('fills scores, evidence by week and the honesty check, and escapes table characters', () => {
    let state = setLevel(emptyAssessment(), 1, 'A', 2);
    state = setEvidence(state, 1, 'A', 'first | map\nnotes');
    state = setLevel(state, 2, 'A', 3);
    state = setCoach(state, 'A', 3);
    state = setHonesty(state, 2, { answers: ['yes', 'yes', 'no'], note: 'I need to practise out loud.' });
    const md = renderScoreSheet(state, '2026-11-04');
    expect(md).toContain('| A. Whole-product view | 2 | 3 |  |  | 3 | first \\| map notes |');
    expect(md).toContain('### Week 1\n\n- A. Whole-product view: first \\| map notes');
    expect(md).toContain('## No-AI-epics honesty check');
    expect(md).toContain('Can I explain each epic out loud without notes? No');
    expect(md).toContain('- Note: I need to practise out loud.');
    expect(md.endsWith('\n')).toBe(true);
  });
});
