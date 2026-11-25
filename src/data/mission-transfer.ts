import type { TransferPractice } from '../lib/mission-transfer';

/**
 * Transfer practice (developerdojo#95): the steps and the self-check a learner follows to carry the worked mission's
 * technique into one field, and the fields the worked mission does not adapt to. src/lib/mission-transfer.ts holds
 * the schema and the rules; every other line of a practice sheet is read from the sector packs and recipes.
 * docs/mission-playbook.md is the editor's guide. Published text: no names, no issue references, no repository paths.
 */
export const transferPractice = {
  title: 'Carry the technique into a field yourself',
  notice: 'A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.',
  steps: [
    { id: 'foundation', label: 'Practise the foundation', text: 'Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it:' },
    { id: 'first-kata', label: 'Do the first field kata', text: 'Work it with the published inputs, and write down what this field uses as its independent check:' },
    { id: 'gate', label: 'Apply the field’s own review gate', text: 'Keep an assistant’s output only when the gate confirms it, and log every time it did not:' },
    { id: 'randori', label: 'Take an unseen change', text: 'Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead:' },
    { id: 'evidence', label: 'Gather the evidence the rubric asks for', text: 'Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap:' },
    { id: 'review', label: 'Ask someone else to assess the transfer', text: 'A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable.' },
  ],
  additionalFields: [
    {
      packId: 'science',
      reference: 'The GUM’s printed worked examples, which the code must reproduce before it touches the temperature record.',
      gate: { recipe: 'sci-002-uncertainty-budget', role: 'Explaining assistant' },
    },
    {
      packId: 'finance',
      reference: 'Appendix J’s printed worked examples, which the code must reproduce before it computes any other annual percentage rate.',
      gate: { recipe: 'fin-002-annual-percentage-rate', role: 'Explaining assistant' },
    },
    {
      packId: 'manufacturing',
      reference: 'The NIST/SEMATECH e-Handbook’s printed factor table and case study results, which the code must reproduce before it sets any control limit.',
      gate: { recipe: 'mfg-002-control-limits', role: 'Explaining assistant' },
    },
    {
      packId: 'media',
      reference: 'EBU Tech 3341’s published test signals and readings, which the meter must give within their tolerances before it measures any recording.',
      gate: { recipe: 'med-002-measure-loudness', role: 'Explaining assistant' },
    },
  ],
  selfCheck: [
    'I can name this field’s independent reference and show one assistant output it rejected or corrected.',
    'Every input I used is listed with its source and terms, and nothing private, confidential or personal is in this sheet.',
    'I ran the field’s checks myself and recorded the commands and results, failures included.',
    'I wrote down what this field requires from a qualified professional, and I did not claim that approval.',
  ],
} satisfies TransferPractice;
