import type { MissionPlaybook } from '../lib/mission-playbook';

/**
 * The mission playbook (developerdojo#95). src/lib/mission-playbook.ts holds the schema and the rules; the build
 * fails on data that breaks them, and tests/mission-playbook.test.ts checks every reference against the files.
 * docs/mission-playbook.md is the editor's guide.
 *
 * The worked mission is real and public: it reads the site's own UX, BIM and agriculture pathways, which publish
 * their inputs with licences and recompute every output in CI. It contains no client, customer or person
 * material. Its independent rubric result stays null (shown as Unavailable) until the assessment map's review
 * pilot has run. Published text: no names, no issue references, no repository paths.
 */
export const missionPlaybook = {
  template: {
    title: 'My mission brief and retrospective',
    notice: 'This is a blank working document, not proof that a mission or review happened.',
    brief: [
      { id: 'goal', label: 'Goal, audience and decision-maker', prompt: 'What result, for whom, and who decides that it is done. Use identifiers your agreement allows.' },
      { id: 'authorized-inputs', label: 'Authorized inputs and permissions', prompt: 'Each input, where it came from, its licence or terms, and who allowed you to use it. Leave out anything you may not share.' },
      { id: 'constraints', label: 'Real-world constraints', prompt: 'Time, budget, data, privacy, the tools you may or may not use, and the limits set by the field or the people involved.' },
      { id: 'stack', label: 'Chosen stack', prompt: 'The harness, model, instructions, tools, versions and permissions you actually used, and why this stack.' },
      { id: 'dependencies', label: 'Dependencies', prompt: 'The people, systems, files and earlier work the mission needs, and what happens if one is missing.' },
      { id: 'acceptance', label: 'Acceptance criteria and who checks them', prompt: 'Observable checks written before the work starts, and who runs each one.' },
      { id: 'approvals', label: 'Independent review and qualified professional approval required', prompt: 'Who must review or approve the result before anyone relies on it. Write "none required" only with the reason.' },
      { id: 'katas', label: 'Katas practiced and how I will adapt them', prompt: 'The kata IDs you practiced and the technique you are taking from each.' },
    ],
    transfer: [
      { id: 'foundation-technique', label: 'Foundation technique that transfers', prompt: 'The technique in one sentence, and the foundation kata it comes from.' },
      { id: 'what-changes', label: 'Specialist capabilities and standards that change', prompt: 'For the new field: its reference or source of truth, the capabilities, standards and tools it adds, and the review it requires.' },
      { id: 'rubric-result', label: 'Independent rubric result', prompt: 'The criterion ID from the assessment map (MD-1 or SEN-2), recorded as Observed, Not yet observed or Unclear with an evidence reference, by an independent reviewer. Write Unavailable until a reviewer has recorded it.' },
    ],
    retrospective: [
      { id: 'what-happened', label: 'What actually happened', prompt: 'The result and the main decisions, as they happened rather than as planned.' },
      { id: 'evidence', label: 'Evidence that supports it', prompt: 'Where each artifact, check result and log can be reviewed, privately if it has to be.' },
      { id: 'failures', label: 'Failures and what changed', prompt: 'What went wrong, what caused it, what you changed and which check confirmed the repair.' },
      { id: 'uncertain', label: 'What remains uncertain or untested', prompt: 'Checks that did not run, measurements that are unavailable, and reviews still owed.' },
      { id: 'improvement', label: 'A verified technique improvement or benchmark correction', prompt: 'Only one you reproduced and can show evidence for, with nothing private in it.' },
      { id: 'route', label: 'Where I am sending it', prompt: 'A technique improvement or a benchmark correction goes to the Sensei contribution process with its worksheet.' },
      { id: 'sharing', label: 'What may be shared, by whom, under which licences', prompt: 'What you removed to make it shareable, and who agreed to the rest being shared.' },
    ],
    closing: 'Do not put credentials or information you cannot share into an AI service or public repository. This document does not approve work or award a certificate.',
  },
  routes: [
    { kind: 'technique-improvement', label: 'Technique improvement', when: 'A change to a kata step or technique that you reproduced and can show evidence for.', worksheet: '/examples/sensei/kata-improvement.md', guide: '/sensei/contribute' },
    { kind: 'benchmark-correction', label: 'Benchmark correction', when: 'A dated benchmark or evidence claim on this site that your own reproduced run shows is wrong or out of date.', worksheet: '/examples/sensei/benchmark-correction.md', guide: '/sensei/contribute' },
  ],
  rubricCriterionIds: ['MD-1', 'SEN-2'],
  workedMission: {
    id: 'one-check-three-fields',
    title: 'One check, three fields',
    provenance: 'Built by the Dojo maintainers from the site’s own UX, BIM and agriculture pathways. It is not a learner, client or customer mission, and it uses only files those pathways already publish with their sources and terms.',
    goal: 'Show that one foundation technique carries into three specialist fields, and record exactly what each field changes: its reference, capabilities, standards, stack and required review.',
    audience: 'Learners who finished the two foundation katas and want to see a technique move between fields before they carry one themselves.',
    foundation: {
      technique: 'An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example.',
      kataIds: ['PRACTICE-001', 'PRACTICE-002'],
    },
    adaptations: [
      { packId: 'ux', reference: 'The flow and the done-when list for each screen, and contrast ratios computed from the design tokens.', gate: { recipe: 'ux-001-sitemap', role: 'Drafting assistant' } },
      { packId: 'bim', reference: 'The IFC file itself: a claim stays only when code run on the file shows it.', gate: { recipe: 'bim-001-inspect-model', role: 'Explaining assistant' } },
      { packId: 'agriculture', reference: 'FAO’s published worked examples, which the code must reproduce before it touches the weather record.', gate: { recipe: 'agr-002-reference-et', role: 'Explaining assistant' } },
    ],
    sharedConstraints: [
      'No client, customer or personal material: every input is published on its pathway page with its source and terms.',
      'Each field keeps its own professional review boundary. This mission approves nothing.',
    ],
    rubricResult: {
      reviewer: null,
      why: 'No independent reviewer has assessed this transfer. The review pilot on the assessment map has not run, so the result is unavailable: it is neither a pass nor a fail.',
      criteria: [
        {
          id: 'SEN-2',
          observation: null,
          offered: ['configuration', 'tests'],
          missing: ['decisions'],
          note: 'The pathways publish their stacks and the outputs CI checks. A reviewer still has to name a second field and hear the decisions defended, and that has not happened.',
        },
      ],
    },
    retrospective: {
      checkedOn: '2026-11-21',
      whatHappened: 'The three pathways were built separately, each on the same two foundation katas. Read side by side, each field has the same review gate in its own terms, and CI recomputes every output on every pipeline.',
      uncertain: 'No learner has run any of the three pathways, no independent reviewer has assessed the transfer, and nothing here has the professional review that real BIM or agriculture work requires.',
      improvements: [
        {
          kind: 'technique-improvement',
          title: 'UX-005: the review gate names the wrong destination',
          observed: 'In UX-005 the drafting assistant writes the web page, but its review gate said each line is compared before it goes into Penpot. The wording matched the earlier Penpot katas, where it is right.',
          proposal: 'Name the page instead: compare every line with the flow and the done-when list before it goes into the page.',
          evidence: { recipe: 'ux-005-implement-and-qa', role: 'Drafting assistant' },
          status: 'applied',
        },
      ],
      sharing: 'Everything here is already public on the pathway pages under the terms they record. Nothing private was used, so nothing had to be removed.',
    },
  },
  boundaries: [
    'A brief, a transfer record or a retrospective is a planning and learning aid. It is not proof of completed work and does not award a belt or a rank.',
    'The transfer criteria come from the assessment map and are proposed. Only an independent reviewer records a result; until then it is unavailable.',
    'Regulated or safety-critical work needs approval from a qualified professional, separate from any Dojo review.',
    'This site does not save or send what you type. Share a retrospective only with permission, and without client, customer or personal material.',
  ],
} satisfies MissionPlaybook;
