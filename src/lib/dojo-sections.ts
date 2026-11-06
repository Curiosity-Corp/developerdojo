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
    introTitle: 'Start with something real',
    intro: 'A finished result should lead you to its source, the stack that produced it and the checks behind it. The Dojo is building a collection of examples with that evidence; a complete showcase and recipe have not yet been published.',
    steps: [
      { title: 'Look for the artifact', description: 'A useful showcase identifies what was created, who can use it, and whether the source can be inspected or edited.' },
      { title: 'Trace the process', description: 'A kata should explain its inputs, harness, model, instructions, skills, tools and agent roles, along with meaningful limitations.' },
      { title: 'Inspect the evidence', description: 'Tests, review and provenance help you judge the result. A polished image alone does not prove that an editable or approved artifact exists.' },
    ],
    nextTitle: 'Practice while the gallery grows', next: 'Explore the current learning tracks and the foundations behind the future showcases.', nextHref: '/library/tracks', nextLabel: 'Explore learning tracks',
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
    nextTitle: 'Benchmarks are being prepared', next: 'There are no Dojo benchmark results on this page yet. Future comparisons need dated methods, sources and artifacts before they can be published.', nextHref: '/stack-lab', nextLabel: 'Study the stack',
  },
  {
    slug: 'belts', eyebrow: 'Demonstrate capability', title: 'The Belts',
    description: 'Explore how evidence of field-specific ability can complement universal development ranks.',
    introTitle: 'A belt should represent what you can do',
    intro: 'The planned belt system will assess demonstrated capability in a field. It is distinct from the Developer, Master Developer and Sensei progression, which describes broader development and orchestration skills.',
    steps: [
      { title: 'Practice', description: 'Follow a documented technique and explain the goal, stack and checks.' },
      { title: 'Adapt', description: 'Change a constraint, tool or requirement and explain the effect on the outcome.' },
      { title: 'Demonstrate', description: 'Provide artifacts and evidence for independent review, including an unfamiliar challenge where appropriate.' },
    ],
    nextTitle: 'Status and professional boundaries', next: 'Specialist belts and their assessment process are being designed; they are not currently issued here. A Dojo belt will not be a professional license, permit or approval. The existing certificate information remains available.', nextHref: '/certificates', nextLabel: 'Existing certificates',
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
    nextTitle: 'Practice today', next: 'Dedicated Randori assessments are being developed. The existing challenges offer product-focused briefs with their own rules.', nextHref: '/challenges', nextLabel: 'Explore existing challenges',
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
