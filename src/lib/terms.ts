/**
 * The Dojo's own words, said one way everywhere (#79). One source for the terminology guide on /start;
 * tests/terms.test.ts checks that src/content/library/glossary.md carries the same definition for each term,
 * so the guide and the glossary cannot drift apart.
 *
 * Release boundary: these definitions describe the site as it is. They do not change the program rules,
 * assessments or certificates; any change to those waits for the recorded approvals in #80.
 */
export interface Term {
  /** The word as the site writes it (case matters: kata, belt, Randori, mission, Sensei). */
  term: string;
  /** One or two plain sentences, written for a reader in their second language. */
  definition: string;
  /** Where the site shows this today. */
  href: string;
}

export const TERMS: readonly Term[] = [
  {
    term: 'Developer',
    definition:
      'Anyone who develops an outcome: you define it, orchestrate AI agents and tools to make it, and verify the result. Developer is also the first rank on the training path.',
    href: '/train#developer',
  },
  {
    term: 'Orchestrator',
    definition:
      'The person who chooses, equips and directs AI agents toward an outcome and answers for the result. The orchestrator is the developer.',
    href: '/stack-lab',
  },
  {
    term: 'Universal foundation',
    definition:
      'The skills every developer shares in any field: outcomes and evidence, instructions and context, agent stacks, and verification.',
    href: '/stack-lab',
  },
  {
    term: 'Field expertise',
    definition:
      'The tools, standards and qualified review that one field adds on top of the universal foundation, such as robotics or biotechnology.',
    href: '/fields',
  },
  {
    term: 'Agent stack',
    definition: 'The harness, models, instructions, skills and tools you choose for a piece of work.',
    href: '/stack-lab',
  },
  {
    term: 'Kata',
    definition: 'A repeatable technique you practice, from a clear outcome to the evidence that it worked.',
    href: '/katas',
  },
  {
    term: 'Belt',
    definition:
      'A practice stage for showing capability in one field: practice, adapt, demonstrate. Belts are not issued yet, and a belt is never a professional license.',
    href: '/belts',
  },
  {
    term: 'Randori',
    definition:
      'Practice without a recipe: you get a goal, constraints and checks, then choose your own stack and approach.',
    href: '/randori',
  },
  {
    term: 'Mission',
    definition: 'Real work where you apply a practiced technique, with agreed permissions, checks and review.',
    href: '/missions',
  },
  {
    term: 'Master Developer',
    definition:
      'The second rank. A Master Developer owns a whole product end to end and runs it in the real world.',
    href: '/train#master-developer',
  },
  {
    term: 'Sensei',
    definition: 'The third rank. A Sensei coaches other developers, reviews their work and hosts live builds.',
    href: '/sensei',
  },
];
