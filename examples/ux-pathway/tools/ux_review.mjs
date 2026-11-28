/**
 * The unseen UX Randori round (UX-R01, round U): its brief, its sealed partner card, its review rubric, and the review
 * of a learner's own answer. No dependencies: the Node standard library only.
 *
 * Two uses:
 *   1. ux_pathway.mjs calls renderUnseen() on every pipeline. It refuses the round if its brief or its constraint is one
 *      of the worked rounds (then it would not be unseen), if a rubric row names a check the scripts do not have, or if
 *      a row has no pass rule or evidence. It writes randori-unseen/brief.md (for the learner), partner-card.md (for the
 *      partner, sealed), rubric.md and rubric.json (for the reviewer) and review-sheet.md (blank).
 *   2. A learner or a reviewer runs it on an answer:
 *
 *        node tools/ux_review.mjs <pack dir> <adapted flow.json> [--first <first flow.json>] [--out <review.md>]
 *
 *      It runs the rubric rows a script can judge (the structural checks and the hidden constraint), computes what the
 *      constraint changed when the first flow is given, and writes a review sheet with the other rows left for the
 *      reviewer, the partner and the learner. Exit 0 when every script row passes, 1 when one does not, 2 when an input
 *      cannot be read.
 *
 * No answer to this round is published. The site's tests run the review on a reference answer that is kept out of the
 * site (tests/fixtures/ux-randori-unseen/).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONSTRAINT_CHECKS, checkConstraint, diffFlows } from './ux_randori.mjs';

export const UNSEEN_INPUT = 'inputs/randori-unseen.json';
const JUDGES = { script: 'tools/ux_review.mjs', reviewer: 'the reviewer', partner: 'the partner', learner: 'the learner' };

function cell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

/** Refuses a round that is not unseen, or a rubric a reviewer could not apply. Returns the problems found. */
export function validateUnseen(input, worked, structuralCheckIds) {
  const problems = [];
  if (!input || typeof input !== 'object') return ['the unseen round file is not a JSON object'];
  for (const key of ['id', 'brief', 'constraint', 'rubric', 'result']) if (!input[key]) problems.push('the unseen round has no ' + key);
  if (problems.length) return problems;
  if (!CONSTRAINT_CHECKS[input.constraint.id]) problems.push('no check for the hidden constraint "' + input.constraint.id + '"');
  for (const round of worked.rounds ?? []) {
    if (round.constraint && round.constraint.id === input.constraint.id) problems.push('worked round ' + round.id + ' already answers the constraint "' + input.constraint.id + '", so it is not unseen');
    if (round.brief === input.brief.text) problems.push('worked round ' + round.id + ' already answers this brief, so it is not unseen');
  }
  const known = new Set([...structuralCheckIds, ...Object.keys(CONSTRAINT_CHECKS)]);
  const ids = new Set();
  for (const row of input.rubric) {
    if (ids.has(row.id)) problems.push('rubric row "' + row.id + '" appears twice');
    ids.add(row.id);
    if (!JUDGES[row.judge]) problems.push('rubric row "' + row.id + '" has an unknown judge "' + row.judge + '"');
    if (!row.criterion || !row.pass || !row.evidence) problems.push('rubric row "' + row.id + '" needs a criterion, a pass rule and the evidence to look at');
    if (row.judge === 'script') {
      if (!Array.isArray(row.checks) || row.checks.length === 0) problems.push('rubric row "' + row.id + '" is judged by the script but names no check');
      for (const id of row.checks ?? []) if (!known.has(id)) problems.push('rubric row "' + row.id + '" names a check the scripts do not have: ' + id);
    }
  }
  if (!input.rubric.some((row) => row.judge === 'script' && (row.checks ?? []).includes(input.constraint.id))) problems.push('no rubric row checks the hidden constraint');
  if (!input.rubric.some((row) => row.judge === 'partner')) problems.push('no rubric row is judged by a partner walk');
  return problems;
}

function readFlowShape(flow, name) {
  if (!flow || typeof flow !== 'object') throw new Error(name + ' is not a JSON object');
  for (const key of ['screens', 'states', 'transitions']) if (!Array.isArray(flow[key])) throw new Error(name + ' has no ' + key + ' list (see inputs/pocket-invoice-flow.json for the format)');
  if (typeof flow.start !== 'string') throw new Error(name + ' has no start state');
  for (const state of flow.states) if (!state || typeof state.id !== 'string' || !Array.isArray(state.elements)) throw new Error(name + ': every state needs an id and an elements list');
}

/**
 * Reviews a learner's answer. `checkStructure` is the structural check from ux_pathway.mjs. Returns one row per rubric
 * row: status pass or not yet for the script rows, and the judge's name for the others.
 */
export function reviewFlow(input, adapted, { checkStructure, first }) {
  readFlowShape(adapted, 'the adapted flow');
  if (first) readFlowShape(first, 'the first flow');
  const structure = Object.fromEntries(checkStructure(adapted).map((c) => [c.id, c]));
  const constraint = checkConstraint(adapted, input.constraint.id);
  const rows = input.rubric.map((row) => {
    if (row.judge !== 'script') return { id: row.id, criterion: row.criterion, judge: row.judge, status: 'for ' + JUDGES[row.judge], findings: [] };
    const results = row.checks.map((id) => (id === input.constraint.id ? constraint : structure[id] ?? (CONSTRAINT_CHECKS[id] ? checkConstraint(adapted, id) : null)));
    const findings = results.flatMap((c, i) => (c === null ? [row.checks[i] + ': not run'] : c.failures.map((f) => c.id + ': ' + f)));
    return { id: row.id, criterion: row.criterion, judge: row.judge, status: findings.length === 0 ? 'pass' : 'not yet', findings };
  });
  const firstResult = first ? { constraintMet: checkConstraint(first, input.constraint.id).pass, diff: diffFlows(first, adapted) } : null;
  return { round: input.id, product: adapted.product?.name ?? 'your flow', states: adapted.states.length, transitions: adapted.transitions.length, scriptPass: rows.every((r) => r.judge !== 'script' || r.status === 'pass'), rows, first: firstResult };
}

function list(items) {
  return items.length ? items.join(', ') : 'none';
}

/** The review sheet: the script rows filled in, the other rows blank for their judge. `review` null gives a blank sheet. */
export function reviewSheetMd(input, review) {
  const lines = [
    '# UX Randori, round ' + input.id + ': review sheet',
    '',
    review ? 'Answer: ' + review.product + ', ' + review.states + ' states, ' + review.transitions + ' transitions. Script rows written by tools/ux_review.mjs; fill in the rest by hand.' : 'Blank. Run `node tools/ux_review.mjs . your-flow.json --first your-first-flow.json --out review.md` to fill in the script rows.',
    '',
    '| Row | Criterion | Judged by | Result | Findings, or the one change that would make it pass |',
    '| --- | --- | --- | --- | --- |',
    ...input.rubric.map((row) => {
      const r = review?.rows.find((x) => x.id === row.id);
      const result = row.judge === 'script' ? (r ? r.status : '') : '';
      return '| ' + row.id + ' | ' + cell(row.criterion) + ' | ' + JUDGES[row.judge] + ' | ' + result + ' | ' + cell(r ? r.findings.join('; ') : '') + ' |';
    }),
    '',
  ];
  if (review?.first) {
    lines.push(
      '## What the constraint changed, computed from your two flows',
      '',
      'Your first flow ' + (review.first.constraintMet ? 'already met the constraint, so it changed nothing: say why on the changed row.' : 'did not meet the constraint.'),
      '',
      '| Change | Items |',
      '| --- | --- |',
      '| States added | ' + cell(list(review.first.diff.statesAdded)) + ' |',
      '| States removed | ' + cell(list(review.first.diff.statesRemoved)) + ' |',
      '| Transitions added | ' + cell(list(review.first.diff.transitionsAdded)) + ' |',
      '| Transitions removed | ' + cell(list(review.first.diff.transitionsRemoved)) + ' |',
      '',
    );
  }
  lines.push(
    '## Partner walk notes',
    '',
    '| Task | Where they went | Where they stopped or hesitated | What changed, or why not |',
    '| --- | --- | --- | --- |',
    '| | | | |',
    '',
    'Time box: ' + input.timeBoxMinutes + ' minutes. Started: ____ Finished: ____ Without an assistant, with fictional data only (learner): ____ Time confirmed (partner): ____',
    '',
    input.result,
    '',
  );
  return lines.join('\n');
}

function briefMd(input) {
  const b = input.brief;
  return [
    '# UX Randori, round ' + input.id + ': ' + b.product,
    '',
    'For the learner. Read this, then start: you have ' + input.timeBoxMinutes + ' minutes and no assistant. Your partner holds one more card and will show it to you after ' + input.constraint.revealAfter.replace(/^the learner/, 'you') + '.',
    '',
    '**The brief.** ' + b.text,
    '',
    '**Who uses it.** ' + b.user,
    '',
    '**Their job.** ' + b.job,
    '',
    '**Your flow must include**',
    '',
    ...b.mustInclude.map((item) => '- ' + item),
    '',
    '**What to hand in.** A first sitemap (before the card), the adapted sitemap and low-fidelity screens, wired as a clickable prototype, and both sitemaps as flow files. ' + input.flowFormat,
    '',
    b.fictional,
    '',
    'No answer to this round is published. The rubric (rubric.md) says how it is reviewed and does not reveal the card; you may read it first. Do not read partner-card.md, or the constraint checks in tools/ux_randori.mjs, before your round: the card is only unseen if you keep it so.',
    '',
  ].join('\n');
}

function partnerCardMd(input) {
  return [
    '# UX Randori, round ' + input.id + ': the sealed card',
    '',
    'For the partner only. Do not show it until ' + input.constraint.revealAfter + '.',
    '',
    '**The constraint.** ' + input.constraint.text,
    '',
    '**What the script checks.** ' + CONSTRAINT_CHECKS[input.constraint.id].description,
    '',
    '**Your part.** Keep time. Show the card at the right moment and say nothing more about it. When the prototype is wired, walk it without help, one task from the brief at a time, thinking aloud, and write down where you went and where you stopped. Then sign the review sheet.',
    '',
  ].join('\n');
}

function rubricMd(input) {
  return [
    '# UX Randori, round ' + input.id + ': review rubric',
    '',
    'For the reviewer. It does not name the hidden constraint; the partner card does. Rows judged by the script are run by `node tools/ux_review.mjs <pack dir> <adapted flow.json> --first <first flow.json>`; the others are judged by the person named.',
    '',
    '| Row | Criterion | Judged by | Passes when | Evidence |',
    '| --- | --- | --- | --- | --- |',
    ...input.rubric.map((row) => '| ' + row.id + ' | ' + cell(row.criterion) + ' | ' + JUDGES[row.judge] + (row.judge === 'script' ? ' (' + row.checks.map((id) => (id === input.constraint.id ? 'the hidden constraint' : id)).join(', ') + ')' : '') + ' | ' + cell(row.pass) + ' | ' + cell(row.evidence) + ' |'),
    '',
    input.result,
    '',
    '## Not judged by this rubric',
    '',
    '- Visual polish: the round is low fidelity on purpose.',
    '- Whether the flow would work as software: it is a sitemap and a prototype, not an app.',
    '- Usability with real users: one partner walk is a check for dead ends and confusion, not a usability study.',
    '',
  ].join('\n');
}

/** The unseen round's files for the generated folder. Pure: no file system access. */
export function renderUnseen(input, worked, structuralCheckIds) {
  const failures = validateUnseen(input, worked, structuralCheckIds).map((p) => 'randori unseen round: ' + p);
  if (failures.length) return { files: [], failures };
  const rubric = {
    generator: 'tools/ux_review.mjs',
    round: input.id,
    timeBoxMinutes: input.timeBoxMinutes,
    rows: input.rubric.map((row) => ({ id: row.id, criterion: row.criterion, judge: row.judge, ...(row.judge === 'script' ? { checks: row.checks.map((id) => (id === input.constraint.id ? 'hidden-constraint' : id)) } : {}), pass: row.pass, evidence: row.evidence })),
    result: input.result,
  };
  return {
    files: [
      ['randori-unseen/brief.md', briefMd(input)],
      ['randori-unseen/partner-card.md', partnerCardMd(input)],
      ['randori-unseen/rubric.md', rubricMd(input)],
      ['randori-unseen/rubric.json', JSON.stringify(rubric, null, 2) + '\n'],
      ['randori-unseen/review-sheet.md', reviewSheetMd(input, null)],
    ],
    failures: [],
  };
}

// ---------------------------------------------------------------- command line

function readJson(path) {
  let raw;
  try { raw = readFileSync(path, 'utf8'); } catch (error) { throw new Error('cannot read ' + path + ': ' + error.message); }
  try { return JSON.parse(raw); } catch (error) { throw new Error(path + ' is not valid JSON: ' + error.message); }
}

function parseArgs(argv) {
  const positional = [];
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--first' || argv[i] === '--out') {
      if (!argv[i + 1]) throw new Error(argv[i] + ' needs a file name');
      options[argv[i].slice(2)] = argv[++i];
    } else positional.push(argv[i]);
  }
  return { positional, options };
}

async function main(argv) {
  const { positional, options } = parseArgs(argv);
  const [packDir, adaptedPath] = positional;
  if (!packDir || !adaptedPath) { console.error('usage: node ux_review.mjs <pack dir> <adapted flow.json> [--first <first flow.json>] [--out <review.md>]'); return 2; }
  const { checkStructure } = await import('./ux_pathway.mjs');
  const input = readJson(join(packDir, UNSEEN_INPUT));
  const review = reviewFlow(input, readJson(adaptedPath), { checkStructure, first: options.first ? readJson(options.first) : undefined });
  const sheet = reviewSheetMd(input, review);
  if (options.out) {
    try { writeFileSync(options.out, sheet); } catch (error) { throw new Error('cannot write ' + options.out + ': ' + error.message); }
  } else process.stdout.write(sheet);
  for (const row of review.rows.filter((r) => r.judge === 'script')) console.error('ux_review: ' + row.id + ': ' + row.status + (row.findings.length ? ' (' + row.findings.join('; ') + ')' : ''));
  return review.scriptPass ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }, (error) => { console.error('ux_review: ' + error.message); process.exitCode = 2; });
}
