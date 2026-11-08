/** Site sections connect the new practice model to resources that already exist. */
export interface DojoSection {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  introTitle: string;
  intro: string;
  steps: { title: string; description: string; href?: string; link?: string }[];
  nextTitle: string;
  next: string;
  nextHref: string;
  nextLabel: string;
}

export const dojoSections: DojoSection[] = [
  {
    slug: 'gallery', eyebrow: 'See the outcome', title: 'The Gallery',
    description: 'Explore the outcomes a developer can create and the evidence behind them.',
    introTitle: 'Try a result, then make your own',
    intro: 'Start with a working prototype or an example project brief. Both were created for these exercises with AI assistance. Follow the kata to create your own and check the result.',
    steps: [
      { title: 'A clickable mini app', description: 'Try the Pocket Garden example, then ask an assistant to create a prototype you can test and remix.', href: '/katas/first-prototype', link: 'Make a clickable prototype' },
      { title: 'An idea becomes a plan', description: 'See a complete example brief and use a ready-to-copy prompt to develop your own idea.', href: '/katas/spark-ideas', link: 'Turn an idea into a plan' },
      { title: 'Look behind the result', description: 'Check inputs, instructions, tools and evidence. These starter examples are not a complete benchmark or verified replay of the same stack.' },
    ],
    nextTitle: 'Make something today', next: 'Choose a starter kata, try its example and make the result your own.', nextHref: '/katas', nextLabel: 'Explore katas',
  },
  {
    slug: 'stack-lab', eyebrow: 'Universal foundations', title: 'The Stack Lab',
    description: 'Learn how harnesses, models, instructions, context, tools, agents and verification shape an outcome.',
    introTitle: 'Learn the parts. Learn how they work together.',
    intro: 'The same development foundations can travel between fields. Each field adds its own tools, evidence and standards. These existing lessons are a place to start while the foundational kata collection is developed.',
    steps: [
      { title: 'Harness and model', description: 'Understand the model, agent loop, available tools and their limits.', href: '/library/tracks/working-with-ai-agents/01-how-ai-agents-work', link: 'How AI agents work' },
      { title: 'Instructions and context', description: 'Give the agent a clear task and the information it needs.', href: '/library/tracks/working-with-ai-agents/03-context-and-instructions', link: 'Context and instructions' },
      { title: 'Delegation and orchestration', description: 'Choose roles, handoffs and review points for multi-agent work.', href: '/library/tracks/agent-orchestration/05-delegation-briefs-and-the-autonomy-ladder', link: 'Delegation briefs' },
      { title: 'Evidence and evaluation', description: 'Define acceptance criteria and independently check the work.', href: '/library/tracks/working-with-ai-agents/08-evals-and-testing-ai-work', link: 'Evals and testing' },
    ],
    nextTitle: 'Compare stacks carefully', next: 'The first planned foundation kata compares the same goal across different stack choices. Record versions, inputs, outputs and checks, and isolate one change where practical.', nextHref: '/katas', nextLabel: 'Explore the kata approach',
  },
  {
    slug: 'armory', eyebrow: 'Equip your agents', title: 'The Armory',
    description: 'Choose skills, tools and integrations for the work, with attention to trust and permissions.',
    introTitle: 'Equip for the mission',
    intro: 'A harness coordinates the work; models generate and reason; instructions and skills shape the method; integrations give access to tools and information. Choose capabilities for a task and give them only the access they need.',
    steps: [
      { title: 'Find learning resources', description: 'Browse the existing library of courses, documentation and tutorials.', href: '/library/resources', link: 'Open the resource library' },
      { title: 'Check permissions and trust', description: 'Read the source and permissions of a skill or integration before using it; consider what it can read, write or execute.', href: '/library/tracks/working-with-ai-agents/09-safety-security-and-trust', link: 'Safety, security and trust' },
      { title: 'Test access', description: 'Check the actual version, compatibility and permitted operations in your own environment. An integration name alone does not prove it can create or edit an artifact.' },
    ],
    nextTitle: 'A registry is in development', next: 'The planned Armory will record source, compatibility, licensing, permissions and verification for individual tools. The existing resource library is available now.', nextHref: '/library/resources', nextLabel: 'Browse existing resources',
  },
  {
    slug: 'arena', eyebrow: 'Compare with evidence', title: 'The Arena',
    description: 'Learn how to compare models, harnesses and complete stacks with transparent evidence.',
    introTitle: 'A fair comparison starts with a clear task',
    intro: 'A result depends on more than a model name. Compare like with like where possible; record what changed, what stayed fixed, and what could not be controlled.',
    steps: [
      { title: 'Record the configuration', description: 'Keep the task, inputs, harness and model versions, instructions, tools, permissions and date with each experiment.' },
      { title: 'Use a relevant rubric', description: 'Measure the outcome for its field as well as system qualities such as reliability, cost where measurable, and completion of checks.' },
      { title: 'Report limitations', description: 'Keep failures, repetitions and uncertainty visible. Do not treat a single result or another provider’s score as a universal ranking.', href: '/library/tracks/working-with-ai-agents/08-evals-and-testing-ai-work', link: 'Learn about evaluations' },
    ],
    nextTitle: 'Compare your own results', next: 'There are no Dojo benchmark results on this page yet. Record your own dated measurements and compare them without claiming a universal winner.', nextHref: '/katas/budget-boss', nextLabel: 'Compare two stacks',
  },
  {
    slug: 'belts', eyebrow: 'Demonstrate capability', title: 'The Belts',
    description: 'Explore how evidence of field-specific ability can complement universal development ranks.',
    introTitle: 'Show what you can develop',
    intro: 'Practice a technique, adapt it, and show your work. The following belt stages are a practice framework for field-specific capability; Developer, Master Developer and Sensei remain the broader development and mentoring ranks.',
    steps: [
      { title: 'Practice', description: 'Follow a documented technique and explain the goal, stack and checks.' },
      { title: 'Adapt', description: 'Change a constraint, tool or requirement and explain the effect on the outcome.' },
      { title: 'Demonstrate', description: 'Provide artifacts and evidence for independent review, including an unfamiliar challenge where appropriate.' },
    ],
    nextTitle: 'Status and professional boundaries', next: 'The checklist is for practice and does not award a belt. Specialist belts are not currently issued here. A Dojo belt is not a professional license, permit or approval. The existing certificate information remains available.', nextHref: '/certificates', nextLabel: 'Existing certificates',
  },
  {
    slug: 'randori', eyebrow: 'Practice without a recipe', title: 'Randori',
    description: 'Learn to adapt your development stack when a challenge is unfamiliar.',
    introTitle: 'Choose your own approach',
    intro: 'Randori gives a developer a goal, constraints and evaluation criteria without prescribing the tools or sequence. You choose a stack, execute within its permissions, check the result and explain your decisions.',
    steps: [
      { title: 'Understand the challenge', description: 'Identify the desired artifact, constraints, risks and evidence needed for acceptance.' },
      { title: 'Build and adapt the stack', description: 'Choose suitable harnesses, models, instructions, skills and tools. Change course when evidence or constraints require it.' },
      { title: 'Verify and explain', description: 'Check the outcome, document limitations and show how you responded to failures or changes.' },
    ],
    nextTitle: 'Practice today', next: 'Try an unfamiliar challenge with changing constraints. Dedicated Randori assessments are still being developed.', nextHref: '/katas/constraint-roulette', nextLabel: 'Try Constraint Roulette',
  },
  {
    slug: 'missions', eyebrow: 'Take practice into the world', title: 'The Missions',
    description: 'Apply development techniques to real work and bring the lessons back responsibly.',
    introTitle: 'Adapt the technique to the work',
    intro: 'A mission applies practiced development techniques to a real goal. The developer defines what success means, selects a suitable stack, manages permissions and verifies the outcome.',
    steps: [
      { title: 'Agree on the brief', description: 'Set the outcome, constraints, responsibilities, permissions and acceptance criteria with the people involved.' },
      { title: 'Develop and verify', description: 'Keep a trace of decisions and evidence; use independent or qualified review where the work requires it.' },
      { title: 'Learn without exposing private work', description: 'Share a retrospective only when permitted, removing confidential material and respecting ownership and licenses.' },
    ],
    nextTitle: 'Prepare for a mission', next: 'A dedicated mission playbook is being developed. The existing product training includes briefs, acceptance criteria and delivery practice.', nextHref: '/train', nextLabel: 'Explore current training',
  },
];
