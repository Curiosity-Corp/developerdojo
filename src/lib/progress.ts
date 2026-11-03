/**
 * Per-browser learning progress. Pure functions (no DOM) so they can be unit tested.
 * The state lives only in this browser's localStorage; nothing is ever sent anywhere.
 */

export const PROGRESS_STORAGE_KEY = 'dojo-progress-v1';

/** Module id -> local calendar day (YYYY-MM-DD) on which it was marked complete. */
export interface ProgressState {
  completed: Record<string, string>;
}

export interface TrainModule {
  id: string;
  /** Short label such as "Week 1". */
  label: string;
  title: string;
  description: string;
  icon: string;
  /** Library page that teaches this module. */
  href: string;
}

export const DEVELOPER_MODULES: readonly TrainModule[] = [
  {
    id: 'developer-week-1',
    label: 'Week 1',
    title: 'See the whole product',
    description: 'Draw the product on one page and start customer discovery.',
    icon: 'lightbulb',
    href: '/library/week-1-see-the-whole-product',
  },
  {
    id: 'developer-week-2',
    label: 'Week 2',
    title: 'Know the people',
    description: 'Personas, touch points and customer journeys.',
    icon: 'users',
    href: '/library/week-2-know-the-people',
  },
  {
    id: 'developer-week-3',
    label: 'Week 3',
    title: 'Problems to epics',
    description: 'Turn problems into a roadmap you write yourself.',
    icon: 'list-checks',
    href: '/library/week-3-problems-to-epics',
  },
  {
    id: 'developer-week-4',
    label: 'Week 4',
    title: 'Defend the roadmap',
    description: 'Stakeholders, and AI agents in practice.',
    icon: 'bot',
    href: '/library/week-4-defend-the-roadmap',
  },
  {
    id: 'developer-week-5',
    label: 'Week 5',
    title: 'Brand, website, mockups',
    description: 'Name the product, publish a site, draw the next version.',
    icon: 'palette',
    href: '/library/week-5-brand-website-mockups',
  },
  {
    id: 'developer-week-6',
    label: 'Week 6',
    title: 'Catalogue, demo, package',
    description: 'Record a demo and present your Product Package.',
    icon: 'package-check',
    href: '/library/week-6-catalogue-demo-package',
  },
];

export const MASTER_MODULES: readonly TrainModule[] = [
  {
    id: 'master-ownership',
    label: 'Module 1',
    title: 'Whole-product ownership',
    description: 'Product, engineering and delivery under one owner.',
    icon: 'box',
    href: '/library/master-developer-overview',
  },
  {
    id: 'master-agents',
    label: 'Module 2',
    title: 'AI-agent orchestration',
    description: 'Steer several agents across the product lifecycle.',
    icon: 'bot',
    href: '/library/master-developer-overview#the-five-ideas',
  },
  {
    id: 'master-launch',
    label: 'Module 3',
    title: 'Production launch',
    description: 'Run everything from git, keep secrets out, close drift.',
    icon: 'rocket',
    href: '/library/iac-gitops-and-drift',
  },
  {
    id: 'master-platform',
    label: 'Module 4',
    title: 'Platform and operations',
    description: 'The shared ground under every product.',
    icon: 'layers',
    href: '/library/internal-developer-platform',
  },
];

export const ALL_MODULES: readonly TrainModule[] = [...DEVELOPER_MODULES, ...MASTER_MODULES];

const DAY = /^\d{4}-\d{2}-\d{2}$/;

export function emptyState(): ProgressState {
  return { completed: {} };
}

/** Parse stored JSON defensively: unknown ids, bad dates and bad shapes are dropped. */
export function parseState(raw: string | null, validIds: readonly string[] = ALL_MODULES.map((m) => m.id)): ProgressState {
  if (!raw) return emptyState();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return emptyState();
  }
  if (typeof data !== 'object' || data === null || !('completed' in data)) return emptyState();
  const source = (data as { completed: unknown }).completed;
  if (typeof source !== 'object' || source === null) return emptyState();
  const completed: Record<string, string> = {};
  for (const [id, day] of Object.entries(source)) {
    if (validIds.includes(id) && typeof day === 'string' && DAY.test(day)) completed[id] = day;
  }
  return { completed };
}

/** Local calendar day as YYYY-MM-DD. */
export function localDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toggleModule(state: ProgressState, id: string, now: Date): ProgressState {
  const completed = { ...state.completed };
  if (completed[id]) delete completed[id];
  else completed[id] = localDay(now);
  return { completed };
}

/**
 * Streak: how many days in a row (counting back from today, or from yesterday if nothing is done
 * yet today) include at least one module marked complete.
 */
export function computeStreak(state: ProgressState, now: Date): number {
  const days = new Set(Object.values(state.completed));
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function countDone(state: ProgressState, modules: readonly TrainModule[]): number {
  return modules.filter((m) => Boolean(state.completed[m.id])).length;
}

export function percent(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
