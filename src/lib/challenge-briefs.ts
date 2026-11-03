/**
 * Full briefs for the Build Sprint challenges. The list itself (title, status, summary) lives in
 * src/data/challenges.json; this file holds the long-form text for each challenge detail page.
 * A challenge without an entry here gets no detail page. `html` fields are author-written and trusted.
 */
export interface Deliverable {
  title: string;
  text: string;
}

export interface ChallengeBrief {
  /** Matches an id in src/data/challenges.json */
  id: string;
  eyebrow: string;
  /** One plain sentence under the page title */
  tagline: string;
  /** The brief itself: short paragraphs */
  brief: string[];
  /** Plain-words "the goal in one line" */
  goal: string;
  whoFor: string[];
  notFor: string[];
  deliverables: Deliverable[];
  /** Rules specific to this challenge, on top of the shared Build Sprint rules */
  extraRules: string[];
  /** What the judges look at beyond the six rubric skills */
  judgeNotes: string[];
  /** Suggested pace. A suggestion, not a deadline. */
  pace: string;
}

/** Rules that apply to every Build Sprint. */
export const SHARED_RULES: readonly { title: string; text: string }[] = [
  {
    title: 'People write the epics and the roadmap',
    text: 'You write every epic and every roadmap sentence yourself, in your own words. AI never does. This is Rule 1 of The Way. Plain, simple English is welcome; clear thinking matters more than perfect grammar.',
  },
  {
    title: 'Disclose all AI use',
    text: 'Keep an AI-use note in your repository: which tools, for which tasks, and what you checked yourself. Honest use is welcome. Hidden use is the only real way to lose points.',
  },
  {
    title: 'Everything lives in a public git repository',
    text: 'Your work is a public repository on GitLab.com or GitHub. History matters: judges read your commits, issues and decision log, not only the final result.',
  },
  {
    title: 'Open source first, and honest licences',
    text: 'Prefer open-source tools. Say which licence your own work uses, and give credit for anything you reuse.',
  },
  {
    title: 'Fix forward',
    text: 'When something breaks, write down the cause and ship the fix. Do not hide it or quietly undo it. Your decision log should show this.',
  },
  {
    title: 'No private data, no secrets',
    text: 'Use fake data in demos. Never commit passwords, keys, or real customers’ details. Do not submit anyone else’s work as your own.',
  },
  {
    title: 'Team size: one person, or up to three',
    text: 'You may work alone or in a small team of up to three people. AI agents are tools, not team members. Name every human who took part.',
  },
  {
    title: 'Follow the code of conduct',
    text: 'Be kind and specific when you give feedback. The Developer Dojo code of conduct applies to every submission and every conversation about it.',
  },
];

export const BRIEFS: readonly ChallengeBrief[] = [
  {
    id: 'build-a-real-mvp',
    eyebrow: 'Build Sprint',
    tagline: 'Turn one real idea into a small product that a real person can try, and prove you owned it from start to finish.',
    goal: 'Ship the smallest product that solves one real problem for one real kind of person, and show the thinking behind it.',
    brief: [
      'An MVP (minimum viable product) is the smallest working version of a product that a real person can use and give you feedback on. It is not a demo that only works on your laptop, and it is not a long list of features. It is one clear promise, kept.',
      'In this sprint you pick a real problem, talk to the people who have it, write the epics, and steer AI agents to build the first version. You decide what to build and, just as important, what not to build. The agents do the typing. You do the thinking.',
      'You finish with a Product Package: an honest picture of where the product is today, a public page, a name, a catalogue of what it does, a roadmap you can defend, a short demo, and the evidence that you managed the work.',
    ],
    whoFor: [
      'Learners on the Developer path who want to practise on a real product before, during, or after the six weeks.',
      'Career changers who want one finished, public project that shows how they think.',
      'Developers who are moving from typing code to steering AI agents.',
      'Small teams of up to three who want to build something together in the open.',
    ],
    notFor: [
      'Copying an existing app without a real user in mind.',
      'Work that hides which parts were written by AI.',
      'Products that collect real personal data without a clear, lawful reason.',
    ],
    deliverables: [
      { title: 'A product brief', text: 'One page: who it is for, the problem, the promise. Start from the product brief template in the library.' },
      { title: 'Evidence from real people', text: 'Notes from talking to at least three people who have the problem, written in your own words. Names can be removed.' },
      { title: 'Epics and a roadmap', text: 'Three to eight epics written by you, in order, with a reason for each place and a list of what is out of scope.' },
      { title: 'A working MVP', text: 'Running software that a stranger can open or install. A public link is best; clear run instructions in the README is the minimum.' },
      { title: 'A five-minute demo', text: 'A recorded walk-through or a written script of the real journey, using fake data.' },
      { title: 'Product Package folder', text: 'The eight-part folder from the Product Package standard, linked from your README.' },
      { title: 'An AI-use note', text: 'What you used AI for, what you did by hand, and what you checked.' },
    ],
    extraRules: [
      'The MVP must solve one problem for one kind of person. If you cannot say it in one sentence, shrink it.',
      'The roadmap must say what you chose not to build, and why.',
    ],
    judgeNotes: [
      'Does the product do what the brief promises, for a person who is not you?',
      'Does the evidence show you learned something from real people and changed your plan because of it?',
    ],
    pace: 'We suggest two to four weeks of part-time work. This is a suggestion, not a deadline: the brief is open until we announce otherwise on this page.',
  },
  {
    id: 'ai-agent-workflow-challenge',
    eyebrow: 'Build Sprint',
    tagline: 'Plan, build and ship one feature with AI agents, and show a repeatable workflow that a human clearly leads.',
    goal: 'Show a clear, repeatable path from a human-written epic to a shipped feature, with agents doing the building and you doing the steering and review.',
    brief: [
      'AI agents are fast, but they are only as good as the instructions you give them. This challenge is about the instructions: how you turn a whole-product idea into small, clear issues that an agent can finish in one change, and how you check the result.',
      'Pick an existing product, your own or an open-source one you have permission to work on. Choose one real feature. Write the epic and the milestone yourself. Break the work into issues. Let agents draft the changes. Review every change like a careful teammate would, and ship.',
      'The result is not only a feature. It is a written workflow someone else could follow: what you gave the agents, what came back, where it went wrong, and how you fixed it forward.',
    ],
    whoFor: [
      'Developers who already write code and want a disciplined way to work with agents.',
      'Learners who have finished week 3 or 4 of the Developer path and want to practise epics and hand-off.',
      'Small teams of up to three who want to compare their agent workflows.',
    ],
    notFor: [
      'Asking an agent to invent the epic or the roadmap for you. That breaks Rule 1.',
      'Accepting agent changes without reading them.',
      'Large rewrites. Choose one feature that fits in a few days.',
    ],
    deliverables: [
      { title: 'A human-written epic', text: 'Written in your own words using the epic standard: goal, measure, scope in and out, acceptance, risks, owner.' },
      { title: 'A milestone and clear issues', text: 'Issues small enough for an agent to finish in one change, each with acceptance checks. Keep them in your repository.' },
      { title: 'The shipped feature', text: 'The feature merged and working in a public repository, with tests or a clear way to check it.' },
      { title: 'A workflow log', text: 'For each issue: the instruction you gave, what the agent returned, what you changed, and how long it took. Be honest about the failures.' },
      { title: 'A time comparison', text: 'A simple, honest note of how long the work took with agents compared with your own estimate of doing it by hand. Measured or labelled as an estimate. No invented numbers.' },
      { title: 'An AI-use note', text: 'Which tools and models, which tasks, and what you verified yourself.' },
      { title: 'A short Product Package', text: 'At least the current state, the roadmap, the demo and the evidence of epic management, linked from your README.' },
    ],
    extraRules: [
      'Every merged change must have been read by a human before merging. Say so in the log.',
      'Include at least one thing that went wrong and how you fixed it forward.',
    ],
    judgeNotes: [
      'Hand-off to agents (skill F) counts most here: do the agents produce the right work first time because your issues are clear?',
      'Is the log honest? A candid log with failures scores better than a perfect-looking one.',
    ],
    pace: 'We suggest one to three weeks of part-time work. This is a suggestion, not a deadline: the brief is open until we announce otherwise on this page.',
  },
];

export function getBrief(id: string): ChallengeBrief | undefined {
  return BRIEFS.find((brief) => brief.id === id);
}

/** The six rubric skills judges score from 1 to 4 (see /library/product-package-rubric). */
export const RUBRIC_SKILLS: readonly { code: string; name: string; question: string }[] = [
  { code: 'A', name: 'Whole-product view', question: 'Does your map show every part of the product and how the parts connect?' },
  { code: 'B', name: 'Customers and personas', question: 'Are your personas based on real evidence?' },
  { code: 'C', name: 'Journeys and touch points', question: 'Did you map what users and customers actually go through?' },
  { code: 'D', name: 'Writing epics', question: 'Are your epics clear, measurable and in your own words?' },
  { code: 'E', name: 'Roadmap and priorities', question: 'Can you defend the order, and say what you chose not to do?' },
  { code: 'F', name: 'Hand-off to agents', question: 'Do agents get instructions clear enough to do the right work?' },
];
