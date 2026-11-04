/**
 * Track A self-assessment: the data, the saved state and the Markdown score sheet. No DOM.
 *
 * The level sentences are the same words as the tables on the page
 * src/content/library/rubric-track-a-self-assessment.md. A unit test (tests/self-assessment.test.ts)
 * reads that page and fails if the two ever drift apart.
 *
 * These scores are the learner's own reading of the rubric. They are not a grade and not a certificate.
 */

export const ASSESSMENT_NAME = 'self-assessment:track-a';
export const ASSESSMENT_VERSION = 1;

export const LEVEL_NAMES = ['Beginning', 'Developing', 'Competent', 'Strong'] as const;
export const WEEKS = [1, 2, 3, 4] as const;
export const TARGET_LEVEL = 3;
export const FLOOR_LEVEL = 2;
export const MAX_EVIDENCE = 600;
export const MAX_NOTE = 600;

export interface Skill {
  id: string;
  name: string;
  /** Level 1 to 4, in order. */
  levels: readonly [string, string, string, string];
}

export const SKILLS: readonly Skill[] = [
  {
    id: 'A',
    name: 'Whole-product view',
    levels: [
      'I know my own part only.',
      'I know most parts but miss links between them.',
      'My map shows every repo, domain, service and integration and how they connect.',
      'I can predict how a change in one part hits the others, and show where.',
    ],
  },
  {
    id: 'B',
    name: 'Customers and personas',
    levels: [
      'I describe users in general words.',
      'I have personas but they come from guesses.',
      'Personas use real evidence and separate user from customer.',
      'Personas change my priorities, and I can show the evidence trail.',
    ],
  },
  {
    id: 'C',
    name: 'Journeys and touch points',
    levels: [
      'I list screens or pages.',
      'I map one journey with some touch points.',
      'I map user and customer journeys, with the pain points and the owner of each touch point.',
      'I find gaps nobody saw, and each gap links to a candidate epic.',
    ],
  },
  {
    id: 'D',
    name: 'Writing epics',
    levels: [
      'My epics are big tasks.',
      'Epics have a goal but no measure or scope limit.',
      'Each epic has problem, outcome, measure, scope in and out, dependencies and risks, in my own words.',
      'My epics make other people say "now I understand what we are doing and why".',
    ],
  },
  {
    id: 'E',
    name: 'Roadmap and priorities',
    levels: [
      'A list with no order.',
      'An order with no reasons.',
      'Ordered by value, risk and dependency, with a reason for each position.',
      'I defend the order, say what I chose NOT to do, and adjust when facts change.',
    ],
  },
  {
    id: 'F',
    name: 'Hand-off to agents and GitLab',
    levels: [
      'Agents often ask what I mean.',
      'Milestones are clear but epics in GitLab are incomplete.',
      'Epics, dates and labels are correct in GitLab. Milestones are clear enough for agents.',
      'Agents produce the right issues first time, and I review them fast and well.',
    ],
  },
];

export const HONESTY_QUESTIONS = [
  'Did I write every epic and roadmap sentence myself?',
  'Did I use AI only for the allowed list (explain, spell-check, search facts, break my milestones into issues)?',
  'Can I explain each epic out loud without notes?',
] as const;

export type Answer = 'yes' | 'no' | '';

export interface SkillScore {
  /** 1 to 4, or undefined when not scored yet. */
  level?: number;
  evidence: string;
}

export interface Honesty {
  answers: [Answer, Answer, Answer];
  note: string;
}

export interface Assessment {
  /** week number as text -> skill id -> score */
  weeks: Record<string, Record<string, SkillScore>>;
  /** skill id -> the coach's level (1 to 4) */
  coach: Record<string, number>;
  /** week number as text -> honesty check */
  honesty: Record<string, Honesty>;
}

export function emptyAssessment(): Assessment {
  return { weeks: {}, coach: {}, honesty: {} };
}

const SKILL_IDS: readonly string[] = SKILLS.map((skill) => skill.id);
const WEEK_KEYS: readonly string[] = WEEKS.map(String);

function asLevel(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 4 ? value : undefined;
}

function asText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Accepts anything; keeps only known weeks and skills, valid levels and capped text. */
export function parseAssessment(data: unknown): Assessment {
  const result = emptyAssessment();
  if (!isRecord(data)) return result;

  if (isRecord(data['weeks'])) {
    for (const week of WEEK_KEYS) {
      const source = data['weeks'][week];
      if (!isRecord(source)) continue;
      for (const id of SKILL_IDS) {
        const entry = source[id];
        if (!isRecord(entry)) continue;
        const level = asLevel(entry['level']);
        const evidence = asText(entry['evidence'], MAX_EVIDENCE);
        if (level === undefined && evidence === '') continue;
        const score: SkillScore = { evidence };
        if (level !== undefined) score.level = level;
        (result.weeks[week] ??= {})[id] = score;
      }
    }
  }

  if (isRecord(data['coach'])) {
    for (const id of SKILL_IDS) {
      const level = asLevel(data['coach'][id]);
      if (level !== undefined) result.coach[id] = level;
    }
  }

  if (isRecord(data['honesty'])) {
    for (const week of WEEK_KEYS) {
      const source = data['honesty'][week];
      if (!isRecord(source)) continue;
      const raw = Array.isArray(source['answers']) ? (source['answers'] as unknown[]) : [];
      const answers = HONESTY_QUESTIONS.map((_, index): Answer => (raw[index] === 'yes' || raw[index] === 'no' ? raw[index] : '')) as Honesty['answers'];
      const note = asText(source['note'], MAX_NOTE);
      if (note === '' && answers.every((answer) => answer === '')) continue;
      result.honesty[week] = { answers, note };
    }
  }
  return result;
}

function copy(state: Assessment): Assessment {
  return parseAssessment(JSON.parse(JSON.stringify(state)));
}

/** Set (or clear, with undefined) the level for one skill in one week. */
export function setLevel(state: Assessment, week: number, skill: string, level: number | undefined): Assessment {
  const next = copy(state);
  const weekScores = (next.weeks[String(week)] ??= {});
  const evidence = weekScores[skill]?.evidence ?? '';
  const score: SkillScore = { evidence };
  if (level !== undefined) score.level = level;
  weekScores[skill] = score;
  return parseAssessment(next);
}

export function setEvidence(state: Assessment, week: number, skill: string, evidence: string): Assessment {
  const next = copy(state);
  const weekScores = (next.weeks[String(week)] ??= {});
  const score: SkillScore = { evidence: evidence.slice(0, MAX_EVIDENCE) };
  const level = weekScores[skill]?.level;
  if (level !== undefined) score.level = level;
  weekScores[skill] = score;
  return parseAssessment(next);
}

export function setCoach(state: Assessment, skill: string, level: number | undefined): Assessment {
  const next = copy(state);
  if (level === undefined) delete next.coach[skill];
  else next.coach[skill] = level;
  return parseAssessment(next);
}

export function setHonesty(state: Assessment, week: number, honesty: Honesty): Assessment {
  const next = copy(state);
  next.honesty[String(week)] = { answers: [...honesty.answers] as Honesty['answers'], note: honesty.note.slice(0, MAX_NOTE) };
  return parseAssessment(next);
}

export function scoreOf(state: Assessment, week: number, skill: string): SkillScore {
  return state.weeks[String(week)]?.[skill] ?? { evidence: '' };
}

export interface Summary {
  scored: number;
  atTarget: number;
  /** Skill ids scored below level 2. */
  belowFloor: string[];
  /** Skill ids with a score but no evidence. The rubric says: no evidence, score one level lower. */
  missingEvidence: string[];
  /** True when all six are scored 3 or higher and none is below 2. */
  meetsTarget: boolean;
}

export function summarise(state: Assessment, week: number): Summary {
  let scored = 0;
  let atTarget = 0;
  const belowFloor: string[] = [];
  const missingEvidence: string[] = [];
  for (const skill of SKILLS) {
    const { level, evidence } = scoreOf(state, week, skill.id);
    if (level === undefined) continue;
    scored += 1;
    if (level >= TARGET_LEVEL) atTarget += 1;
    if (level < FLOOR_LEVEL) belowFloor.push(skill.id);
    if (evidence.trim() === '') missingEvidence.push(skill.id);
  }
  return { scored, atTarget, belowFloor, missingEvidence, meetsTarget: atTarget === SKILLS.length && belowFloor.length === 0 };
}

/** The learner's most recent scored level for a skill (latest week that has one). */
export function latestLevel(state: Assessment, skill: string): number | undefined {
  for (const week of [...WEEKS].reverse()) {
    const level = scoreOf(state, week, skill).level;
    if (level !== undefined) return level;
  }
  return undefined;
}

/** One plain sentence about the gap between the learner's score and the coach's score. */
export function gapSentence(mine: number | undefined, coach: number | undefined): string {
  if (mine === undefined || coach === undefined) return '';
  if (mine === coach) return `You and your coach both scored ${mine}.`;
  const difference = Math.abs(mine - coach);
  const unit = difference === 1 ? 'level' : 'levels';
  return mine > coach
    ? `You scored ${mine}, your coach scored ${coach}: you are ${difference} ${unit} higher. What did they see that you missed?`
    : `You scored ${mine}, your coach scored ${coach}: you are ${difference} ${unit} lower. What did you see that they missed?`;
}

function cell(text: string): string {
  return text.replace(/\r?\n+/g, ' ').replace(/\|/g, '\\|').trim();
}

/** The Markdown score sheet: same table as the rubric page, plus evidence by week and the honesty check. */
export function renderScoreSheet(state: Assessment, today: string): string {
  const lines: string[] = [
    '# Track A score sheet',
    '',
    'Made with the self-assessment on developerdojo.org. These scores are my own reading of the rubric. They are not a grade and not a certificate.',
    '',
    `Last updated: ${today}`,
    '',
    '## Scores',
    '',
    `| Skill | ${WEEKS.map((week) => `Week ${week}`).join(' | ')} | Coach score (Week 4) | Evidence (one example) |`,
    `|---|${[...WEEKS, 'coach', 'evidence'].map(() => '---|').join('')}`,
  ];
  for (const skill of SKILLS) {
    const levels = WEEKS.map((week) => String(scoreOf(state, week, skill.id).level ?? ''));
    const latest = [...WEEKS].reverse().map((week) => scoreOf(state, week, skill.id).evidence.trim()).find((text) => text !== '') ?? '';
    lines.push(`| ${skill.id}. ${skill.name} | ${levels.join(' | ')} | ${state.coach[skill.id] ?? ''} | ${cell(latest)} |`);
  }
  lines.push('', 'Levels: 1 Beginning, 2 Developing, 3 Competent, 4 Strong. Target: level 3 on all six skills by the end of Week 4, no skill below level 2.', '');

  const evidenceBlocks: string[] = [];
  for (const week of WEEKS) {
    const rows = SKILLS.flatMap((skill) => {
      const { evidence } = scoreOf(state, week, skill.id);
      return evidence.trim() === '' ? [] : [`- ${skill.id}. ${skill.name}: ${cell(evidence)}`];
    });
    if (rows.length > 0) evidenceBlocks.push(`### Week ${week}`, '', ...rows, '');
  }
  if (evidenceBlocks.length > 0) lines.push('## Evidence by week', '', ...evidenceBlocks);

  const honestyBlocks: string[] = [];
  for (const week of WEEKS) {
    const entry = state.honesty[String(week)];
    if (!entry) continue;
    honestyBlocks.push(`### Week ${week}`, '');
    HONESTY_QUESTIONS.forEach((question, index) => {
      const answer = entry.answers[index];
      honestyBlocks.push(`- ${question} ${answer === 'yes' ? 'Yes' : answer === 'no' ? 'No' : '(not answered)'}`);
    });
    if (entry.note.trim() !== '') honestyBlocks.push(`- Note: ${cell(entry.note)}`);
    honestyBlocks.push('');
  }
  if (honestyBlocks.length > 0) lines.push('## No-AI-epics honesty check', '', ...honestyBlocks);

  return `${lines.join('\n').trimEnd()}\n`;
}
