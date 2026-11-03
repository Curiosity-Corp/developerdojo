import type { Cost, Format, LessonLevel, ResourceLevel, Skill, TrackGroup } from './schemas';

/** Plain-words labels for the fixed vocabularies. */
export const COST_LABELS: Record<Cost, string> = {
  free: 'Free',
  'free-audit': 'Free to audit',
  'free-tier': 'Free tier',
  paid: 'Paid',
};

export const FORMAT_LABELS: Record<Format, string> = {
  course: 'Course',
  video: 'Video',
  docs: 'Docs',
  tutorial: 'Tutorial',
  interactive: 'Interactive',
  book: 'Book',
  article: 'Article',
  certification: 'Certification',
  podcast: 'Podcast',
};

export const LESSON_LEVEL_LABELS: Record<LessonLevel, string> = {
  foundation: 'Foundation',
  core: 'Core',
  advanced: 'Advanced',
};

export const RESOURCE_LEVEL_LABELS: Record<ResourceLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const GROUP_LABELS: Record<TrackGroup, string> = {
  product: 'Product skills',
  ai: 'Working with AI',
  engineering: 'Engineering skills',
  frameworks: 'Frameworks',
};

export const SKILL_LABELS: Record<Skill, string> = {
  'product-discovery': 'Product discovery',
  'personas-journeys': 'Personas and journeys',
  'roadmapping-epics': 'Roadmaps and epics',
  'agile-delivery': 'Agile delivery',
  'stakeholder-communication': 'Stakeholder communication',
  'brand-web-design': 'Brand and web design',
  'ai-agents': 'AI agents',
  'prompt-engineering': 'Prompt engineering',
  'ai-evaluation': 'AI evaluation',
  'git-gitlab': 'Git and GitLab',
  'ci-cd': 'CI/CD',
  'cloud-platforms': 'Cloud platforms',
  'kubernetes-gitops': 'Kubernetes and GitOps',
  'infrastructure-as-code': 'Infrastructure as code',
  security: 'Security',
  'observability-reliability': 'Observability and reliability',
  'itsm-service-management': 'IT service management',
  'open-source': 'Open source',
  'data-analytics': 'Data and analytics',
  'communication-writing': 'Communication and writing',
  'career-portfolio': 'Career and portfolio',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "3 November 2026", in UTC so the build machine's time zone never moves the day. */
export function formatDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()] ?? ''} ${date.getUTCFullYear()}`;
}
