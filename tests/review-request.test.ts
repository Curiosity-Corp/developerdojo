import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assessmentMap } from '../src/data/assessment-map';
import { sectorPacks } from '../src/data/sector-packs';
import { checkAssessmentMap, loadAssessmentMap, type AssessmentMap } from '../src/lib/assessment-map';
import { fields } from '../src/lib/fields';
import { RANKS } from '../src/lib/ranks';
import { reviewSubjects, specialistBelts } from '../src/lib/review-record';
import {
  LEARNER_EVIDENCE,
  MAX_LOCATION,
  criterionReadiness,
  emptyRequest,
  looksLikeSecret,
  parseRequest,
  parseRequestPage,
  renderRequest,
  requestProblems,
  requestSubjects,
  type RequestPage,
  type RequestSubject,
  type ReviewRequest,
} from '../src/lib/review-request';

// The independent review request (#90): the learner's half of a pilot review.
const root = join(import.meta.dirname, '..');
const read = (...parts: string[]) => readFileSync(join(root, ...parts), 'utf8');
const map = loadAssessmentMap(assessmentMap);
const fieldName = (id: string) => fields.find((field) => field.id === id)?.name;
const randori = (kataId: string) => ({ title: `Randori ${kataId}`, href: `/katas/${kataId.toLowerCase()}` });
const belts = specialistBelts(sectorPacks, fieldName, randori);
const rankName = (id: string) => RANKS.find((rank) => rank.id === id)?.name ?? id;
const subjects = requestSubjects(map, belts, rankName);
const ids = subjects.map((subject) => subject.id);
const page: RequestPage = { subjects, evidence: map.pilot.evidence, steps: map.pilot.steps.map((step) => step.title) };
const subject = (id: string): RequestSubject => {
  const found = subjects.find((item) => item.id === id);
  if (!found) throw new Error(`no subject ${id}`);
  return found;
};

/** A request with everything filled in, so each test can take one thing away. */
function complete(subjectId: string): ReviewRequest {
  return {
    subjectId,
    locations: Object.fromEntries(LEARNER_EVIDENCE.map((kind) => [kind, `my-repo/${kind}/`])),
    scope: { open: 'The repository and the run logs.', keep: 'Nothing after the session.', share: 'Only the review log, with the coordinator.', until: 'Two weeks after the session.' },
    aiUse: 'none',
    noPrivateDetails: true,
  };
}

describe('the subjects a learner can ask to be reviewed against', () => {
  it('are exactly the review record subjects, in the same order', () => {
    expect(ids).toEqual(reviewSubjects(map, belts, rankName).map((item) => item.id));
  });

  it('carry each criterion\'s evidence as kinds, from the assessment map', () => {
    for (const rank of map.ranks) {
      const found = subject(`rank:${rank.rank}`);
      expect(found.criteria.map((criterion) => [criterion.id, criterion.evidence])).toEqual(rank.rubric.criteria.map((criterion) => [criterion.id, criterion.evidence]));
      expect(found.unseenTask).toBe(rank.unseenTask);
      expect(found.randori).toBeUndefined();
    }
  });

  it('give each specialist belt the field Randori, the field limit and the shared kind of unseen task', () => {
    for (const pack of sectorPacks) {
      const found = subject(`belt:${pack.id}:brown`);
      expect(found.unseenTask).toBe(map.specialistBelts.unseenTask);
      expect(found.randori).toEqual(randori(pack.randoriKataId));
      expect(found.professionalReview?.limit).toBe(pack.professionalReview.limit);
      expect(found.criteria.find((criterion) => criterion.id === 'SPB-2')?.evidence).toEqual(['failures', 'tests', 'review-log']);
    }
  });

  it('fails the build when a criterion names evidence the pilot does not list', () => {
    const broken = structuredClone(map) as AssessmentMap;
    broken.pilot.evidence = broken.pilot.evidence.filter((item) => item.kind !== 'failures');
    expect(() => requestSubjects(broken, belts, rankName)).toThrow(/not a pilot evidence kind/);
  });

  it('the map refuses a rank or the specialist belts without a kind of unseen task', () => {
    const noRank = structuredClone(assessmentMap) as unknown as { ranks: { unseenTask?: string }[] };
    delete noRank.ranks[0]!.unseenTask;
    expect(checkAssessmentMap(noRank).join()).toMatch(/unseenTask/);
    const noBelt = structuredClone(assessmentMap) as unknown as { specialistBelts: { unseenTask?: string } };
    delete noBelt.specialistBelts.unseenTask;
    expect(checkAssessmentMap(noBelt).join()).toMatch(/unseenTask/);
  });
});

describe('what makes a request ready', () => {
  it('the learner brings five kinds of evidence; the reviewer writes the review log', () => {
    expect([...LEARNER_EVIDENCE]).toEqual(['artifacts', 'configuration', 'tests', 'failures', 'decisions']);
  });

  it('an empty request lists every missing location, scope line, the AI choice and the privacy check', () => {
    const problems = requestProblems(emptyRequest('rank:developer'), subject('rank:developer'), map.pilot.evidence);
    expect(problems).toHaveLength(LEARNER_EVIDENCE.length + 4 + 2);
    expect(problems).toContain('Say where the reviewer will find: Reproducible configuration.');
    expect(problems).toContain('Write the scope: access ends, and copies are deleted, on or by.');
    expect(problems).toContain('Choose whether an AI service may read your material.');
    expect(problems).toContain('Confirm the request names no person and holds no secret or private material.');
    expect(problems.join()).not.toMatch(/Review log/);
  });

  it('a complete request is ready, for a rank and for a belt', () => {
    for (const id of ['rank:master-developer', 'belt:science:black']) expect(requestProblems(complete(id), subject(id), map.pilot.evidence)).toEqual([]);
  });

  it('each missing piece stops it', () => {
    const base = complete('rank:sensei');
    const without = (change: (request: ReviewRequest) => void): string[] => {
      const request = structuredClone(base);
      change(request);
      return requestProblems(request, subject('rank:sensei'), map.pilot.evidence);
    };
    expect(without((request) => { request.locations.decisions = '   '; })).toEqual(['Say where the reviewer will find: Decision evidence.']);
    expect(without((request) => { request.scope.share = ''; })).toEqual(['Write the scope: the reviewer may share, and with whom.']);
    expect(without((request) => { request.aiUse = ''; })).toEqual(['Choose whether an AI service may read your material.']);
    expect(without((request) => { request.noPrivateDetails = false; })).toEqual(['Confirm the request names no person and holds no secret or private material.']);
    expect(without((request) => { request.subjectId = 'rank:developer'; })).toEqual(['The request is for a different subject than the one shown.']);
  });

  it('refuses text that looks like a credential, and accepts an ordinary link', () => {
    for (const secret of ['password: hunter2', 'API_KEY=abc123', 'token = x', 'https://me:pa55@example.org/repo', '-----BEGIN OPENSSH PRIVATE KEY-----']) {
      expect(looksLikeSecret(secret), secret).toBe(true);
    }
    for (const fine of ['https://example.org/me/my-repo', 'checks/run-1.log', 'The token budget in notes/decisions.md', 'Password policy section of the README']) {
      expect(looksLikeSecret(fine), fine).toBe(false);
    }
    const request = complete('rank:developer');
    request.locations.configuration = 'settings.json, api_key: abc';
    expect(requestProblems(request, subject('rank:developer'), map.pilot.evidence)).toEqual(['Something you typed looks like a password, key or token. Remove it: give the reviewer access instead.']);
  });

  it('shows per criterion which evidence is not located yet, and where the reviewer adds the log', () => {
    const request = emptyRequest('rank:developer');
    request.locations.artifacts = 'my-repo/';
    const readiness = criterionReadiness(request, subject('rank:developer'));
    expect(readiness.find((item) => item.id === 'DEV-1')).toEqual({ id: 'DEV-1', title: 'Outcome and checks', missing: ['tests'], reviewerWrites: false });
    expect(readiness.find((item) => item.id === 'DEV-3')).toEqual({ id: 'DEV-3', title: 'Failures on the record', missing: ['failures', 'tests'], reviewerWrites: true });
    expect(criterionReadiness(complete('rank:developer'), subject('rank:developer')).every((item) => item.missing.length === 0)).toBe(true);
  });
});

describe('a stored request', () => {
  it('is kept only for a subject that exists, with capped text and known fields', () => {
    expect(parseRequest({ subjectId: 'rank:emperor' }, ids)).toBeUndefined();
    expect(parseRequest('nonsense', ids)).toBeUndefined();
    const parsed = parseRequest({
      subjectId: 'belt:science:brown',
      locations: { artifacts: 'x'.repeat(MAX_LOCATION + 50), 'review-log': 'learners do not supply this', extra: 'dropped' },
      scope: { open: 'repo', keep: 5 },
      aiUse: 'sometimes',
      noPrivateDetails: 'yes',
      unknown: true,
    }, ids);
    expect(parsed).toEqual({
      subjectId: 'belt:science:brown',
      locations: { artifacts: 'x'.repeat(MAX_LOCATION) },
      scope: { open: 'repo', keep: '', share: '', until: '' },
      aiUse: '',
      noPrivateDetails: false,
    });
  });

  it('round-trips a complete request', () => {
    const request = complete('rank:developer');
    expect(parseRequest(JSON.parse(JSON.stringify(request)), ids)).toEqual(request);
  });
});

describe('the request as Markdown', () => {
  it('names the subject, the evidence for each criterion, the scope and the kind of unseen task', () => {
    const text = renderRequest(complete('rank:master-developer'), subject('rank:master-developer'), page);
    expect(text).toMatch(/^# Independent review request/);
    expect(text).toContain('- Review against: Master Developer rank (proposed rubric)');
    expect(text).toContain('- Status: ready to send');
    expect(text).toContain('| MD-2 Recovery from a changed tool or failure | Failures: my-repo/failures/; Tests and checks: my-repo/tests/; Review log: written by the reviewer in the session |');
    expect(text).toContain('- The reviewer may keep a copy of: Nothing after the session.');
    expect(text).toContain('- AI services: No AI service may read my material.');
    expect(text).toContain(`Its kind: ${map.ranks[1]!.unseenTask}`);
    expect(text).toContain('1. Agree scope, access and consent');
    expect(text).toContain('awards nothing and is not an application for a certificate');
    expect(text).not.toContain('Qualified review in this field');
  });

  it('says what is missing in a draft, and adds the Randori and field limit for a belt', () => {
    const text = renderRequest(emptyRequest('belt:science:brown'), subject('belt:science:brown'), page);
    expect(text).toMatch(/- Status: draft, \d+ things still missing/);
    expect(text).toContain('- The actual artifacts: _Not given yet._');
    expect(text).toContain('- AI services: _Not chosen yet._');
    expect(text).toContain(`Field Randori it draws on: ${randori(sectorPacks.find((pack) => pack.id === 'science')!.randoriKataId).title}`);
    expect(text).toContain('## Qualified review in this field');
  });

  it('keeps a table cell intact when a location holds a pipe or a line break', () => {
    const request = complete('rank:developer');
    request.locations.artifacts = 'repo | branch\nmain';
    expect(renderRequest(request, subject('rank:developer'), page)).toContain('The actual artifacts: repo \\| branch main');
  });
});

describe('the page data and links', () => {
  it('survives the trip through the page as JSON, and drops malformed parts', () => {
    expect(parseRequestPage(JSON.parse(JSON.stringify(page)))).toEqual(page);
    const broken = parseRequestPage({ subjects: [{ id: 'x' }, ...JSON.parse(JSON.stringify(page.subjects.slice(0, 1)))], evidence: [{ kind: 'gossip', title: 't', description: 'd' }], steps: ['one', 2] });
    expect(broken.subjects.map((item) => item.id)).toEqual([page.subjects[0]!.id]);
    expect(broken.evidence).toEqual([]);
    expect(broken.steps).toEqual(['one']);
    expect(parseRequestPage(null)).toEqual({ subjects: [], evidence: [], steps: [] });
  });

  it('is linked from the assessment map, the review record and the practice review page', () => {
    for (const path of ['src/pages/assessment-map.astro', 'src/pages/review-record.astro', 'src/pages/belt-review.astro']) {
      expect(read(...path.split('/')), path).toContain('/review-request');
    }
    expect(read('src', 'pages', 'review-request.astro')).toContain('<ReviewRequest page={page} />');
    expect(read('docs', 'independent-review-pilot.md')).toContain('## 11. The review request');
  });
});
