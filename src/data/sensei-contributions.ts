import type { Contribution } from '../lib/sensei-contributions';

/**
 * The public Sensei contribution log (developerdojo#94). src/lib/sensei-contributions.ts holds the schema and the
 * rules, and the build fails on data that breaks them; tests/sensei-contributions.test.ts checks every entry against
 * the recipe files and the mission playbook. docs/sensei-contributions.md is the editor's guide.
 *
 * Published text: no names, no issue references, no repository paths. Mentoring feedback never goes here.
 * The UX-005 entry is the first contribution taken through the kata improvement template. No second person has
 * reviewed it, so its independent review is unavailable and its outcome is "applied", not "accepted".
 */
export const senseiContributions: Contribution[] = [
  {
    id: 'ux-005-review-gate',
    kind: 'kata-improvement',
    title: 'UX-005: the review gate names the right destination',
    origin: 'The retrospective of the worked mission "One check, three fields" on the mission playbook. Reading the three pathways side by side showed one review gate that did not fit its kata.',
    target: { part: 'review-gate', recipe: 'ux-005-implement-and-qa', role: 'Drafting assistant' },
    provenance: {
      source: 'The UX-005 recipe as published on this site, read next to UX-001 to UX-004, on 21 November 2026.',
      rights: 'Dojo content under the MIT licence. No outside material is reused.',
      confidentiality: 'None involved: the kata uses an invented app, and the change is one sentence of Dojo text. No learner or customer material was used or seen.',
    },
    security: {
      executable: false,
      review: 'Nothing that runs changes: no code, skill, tool, integration or permission. The change is one sentence of wording in a review gate.',
    },
    reproduction: {
      steps: [
        'Open UX-005 and read the review gate of the Drafting assistant.',
        'Read the same role in UX-001 to UX-004, where the assistant drafts work that goes into the Penpot file.',
        'Compare each gate with what the assistant produces in that kata, as the responsibility line and the brief state it.',
      ],
      observed: 'UX-005 said each line is compared "before it goes into Penpot", but its assistant writes the web page from the flow and tokens. In UX-001 to UX-004 the same words are right.',
      checkedOn: '2026-11-21',
    },
    change: {
      before: 'You compare every line with the flow and the done-when list before it goes into Penpot.',
      after: 'You compare every line with the flow and the done-when list before it goes into the page.',
    },
    review: {
      author: 'Dojo maintainers, with AI assistance',
      independent: { unavailable: 'No second person has reviewed this change. It counts as accepted only after a reviewer who is not the author records a decision.' },
      outcome: 'applied',
      decision: 'Applied by the maintainers as a wording correction, because it changes no step, check or permission. The automated site checks ran on it; they check the record and the pages, not whether the wording is right.',
      corrections: [],
    },
    history: { changedOn: '2026-11-21' },
    aiUse: 'An AI agent read the recipes, drafted the record and made the change. The observation was first made by the same maintainers while building the worked mission.',
  },
];
