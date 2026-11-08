export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation. "Start free" is the header call to action. */
export const NAV: readonly NavItem[] = [
  { label: 'Katas', href: '/katas' },
  { label: 'Train', href: '/train' },
  { label: 'Sensei', href: '/sensei' },
  { label: 'Library', href: '/library' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Events', href: '/events' },
  { label: 'Membership', href: '/membership' },
];

/** Outcome-led shortcuts complement, rather than replace, the existing primary links. */
export interface MenuGroup {
  title: string;
  links: readonly (NavItem & { description: string })[];
}

export const NAV_MENUS: Readonly<Record<string, readonly MenuGroup[]>> = {
  Katas: [
    { title: 'Start making', links: [
      { label: 'Make a prototype', href: '/katas/first-prototype', description: 'Create a small interactive experience.' },
      { label: 'Turn an idea into a plan', href: '/katas/spark-ideas', description: 'Shape an idea into a clear brief.' },
      { label: 'Rescue messy data', href: '/katas/data-rescue', description: 'Make a report you can check.' },
    ] },
    { title: 'Explore by field', links: [
      { label: 'Scan a room in 3D', href: '/katas/scan-a-room', description: 'Explore a real 3D room and its workflow.' },
      { label: 'Design a user journey', href: '/katas/ux-journey', description: 'Study a working prototype and create your own.' },
      { label: 'Industry workshops', href: '/katas/industry-workshops', description: 'Try design, audio, business and more.' },
      { label: 'Cloud workshops', href: '/katas/cloud-workshops', description: 'Learn with official provider training.' },
      { label: 'Explore outcomes', href: '/gallery', description: 'See what you could develop.' },
    ] },
    { title: 'Practice your judgment', links: [
      { label: 'Find AI mistakes', href: '/katas/error-clinic', description: 'Check claims against the evidence.' },
      { label: 'Try a new constraint', href: '/katas/constraint-roulette', description: 'Adapt your approach to a challenge.' },
      { label: 'Choose a Randori challenge', href: '/katas/randori-challenges', description: 'Solve an unfamiliar cross-field problem.' },
      { label: 'Explore Randori', href: '/randori', description: 'Practice without a prescribed recipe.' },
    ] },
  ],
  Train: [
    { title: 'Build your foundation', links: [
      { label: 'Compare instructions', href: '/katas/compare-instructions', description: 'Change a brief and check the result.' },
      { label: 'Explore the Stack Lab', href: '/stack-lab', description: 'Learn how your agent stack fits together.' },
      { label: 'Inspect the Armory', href: '/armory/registry', description: 'Review real tools, sources and access.' },
      { label: 'Working with AI agents', href: '/library/tracks/working-with-ai-agents', description: 'Learn context, delegation and review.' },
      { label: 'Training paths', href: '/train', description: 'Explore existing Developer training.' },
    ] },
    { title: 'Practice and progress', links: [
      { label: 'Explore belts', href: '/belts', description: 'See the capability progression.' },
      { label: 'Developer certificates', href: '/certificates', description: 'Read the current certificate information.' },
      { label: 'Try a challenge', href: '/challenges', description: 'Apply a skill to a fresh problem.' },
    ] },
    { title: 'Go further', links: [
      { label: 'Choose a field', href: '/fields', description: 'Connect foundations with a specialty.' },
      { label: 'Explore missions', href: '/missions', description: 'Apply techniques to real work.' },
      { label: 'Meet the Sensei', href: '/sensei', description: 'Explore mentoring and teaching.' },
    ] },
  ],
  Library: [
    { title: 'Learn from others', links: [
      { label: 'Browse resources', href: '/library/resources', description: 'Find checked courses, videos and docs.' },
      { label: 'Browse tracks', href: '/library/tracks', description: 'Explore lessons grouped by skill.' },
      { label: 'Explore the Armory', href: '/armory', description: 'Understand tools, skills and permissions.' },
    ] },
    { title: 'Compare and reflect', links: [
      { label: 'Visit the Arena', href: '/arena', description: 'Learn to compare stacks with evidence.' },
      { label: 'Compare two stacks', href: '/katas/budget-boss', description: 'Work with your own measurements.' },
      { label: 'Explore decision replay', href: '/katas/decision-replay', description: 'Study choices behind a build.' },
    ] },
    { title: 'Keep practicing', links: [
      { label: 'Practice offline', href: '/katas/pocket-dojo', description: 'Use the optional offline pack.' },
      { label: 'Make a portfolio', href: '/katas/portfolio', description: 'Prepare a learner-owned showcase.' },
      { label: 'Find upcoming events', href: '/events', description: 'See community learning opportunities.' },
    ] },
  ],
};

export const START_FREE: NavItem = { label: 'Start free', href: '/membership' };

export const GITHUB_URL = 'https://github.com/Curiosity-Corp/developerdojo';

export const FOOTER_LINKS: readonly NavItem[] = [
  { label: 'About CRC', href: '/about' },
  { label: 'Sponsors (Reveltek)', href: '/sponsors' },
  { label: 'Become a sponsor', href: '/sponsors#become-a-sponsor' },
  { label: 'Contact', href: '/contact' },
  { label: 'Code of conduct', href: '/code-of-conduct' },
  { label: 'GitHub', href: GITHUB_URL },
];

/** True when `pathname` is the nav item's page or below it. */
export function isActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
