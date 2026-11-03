import { z } from 'zod';

/** Fixed vocabularies (v2 content contract). Adding a value is a deliberate schema change. */
export const LESSON_LEVELS = ['foundation', 'core', 'advanced'] as const;
export const RESOURCE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export const COSTS = ['free', 'free-audit', 'free-tier', 'paid'] as const;
export const FORMATS = [
  'course',
  'video',
  'docs',
  'tutorial',
  'interactive',
  'book',
  'article',
  'certification',
  'podcast',
] as const;
export const TRACK_GROUPS = ['product', 'ai', 'engineering'] as const;
export const SKILLS = [
  'product-discovery',
  'personas-journeys',
  'roadmapping-epics',
  'agile-delivery',
  'stakeholder-communication',
  'brand-web-design',
  'ai-agents',
  'prompt-engineering',
  'ai-evaluation',
  'git-gitlab',
  'ci-cd',
  'cloud-platforms',
  'kubernetes-gitops',
  'infrastructure-as-code',
  'security',
  'observability-reliability',
  'itsm-service-management',
  'open-source',
  'data-analytics',
  'communication-writing',
  'career-portfolio',
] as const;

export type LessonLevel = (typeof LESSON_LEVELS)[number];
export type ResourceLevel = (typeof RESOURCE_LEVELS)[number];
export type Cost = (typeof COSTS)[number];
export type Format = (typeof FORMATS)[number];
export type TrackGroup = (typeof TRACK_GROUPS)[number];
export type Skill = (typeof SKILLS)[number];

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use lowercase words joined by hyphens');
/** "<publisher-slug>/<resource-slug>" */
export const resourceId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use <publisher>/<resource>, for example anthropic/prompt-engineering-interactive-tutorial');

/** Library entry frontmatter (markdown files under src/content/library, at any depth). The first four fields are required; the rest are optional. */
export const librarySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** Section the entry is grouped under on /library, e.g. "Platform". */
  section: z.string().min(1),
  /** Sort order inside the section (ascending). */
  order: z.number().int().nonnegative(),
  /** Track slug (a file in src/content/tracks). Checked at build time. */
  track: slug.optional(),
  level: z.enum(LESSON_LEVELS).optional(),
  /** Honest estimate of reading plus exercise time, e.g. "45 min". */
  duration: z.string().min(1).optional(),
  /** What the learner can do afterwards. */
  outcomes: z.array(z.string().min(1)).optional(),
  /** Resource ids shown as "Further learning". Checked at build time. */
  resources: z.array(resourceId).optional(),
  /** Library slugs to read first. */
  prerequisites: z.array(z.string().min(1)).optional(),
  updated: z.coerce.date().optional(),
});
export type LibraryFrontmatter = z.infer<typeof librarySchema>;

/** Track overview (src/content/tracks/<slug>.md). The body is the overview text. */
export const trackSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  group: z.enum(TRACK_GROUPS),
  order: z.number().int().nonnegative(),
  /** lucide icon name, see src/components/Icon.astro */
  icon: z.string().min(1),
  level: z.enum(LESSON_LEVELS),
  skills: z.array(z.enum(SKILLS)).min(1),
  outcomes: z.array(z.string().min(1)).min(1),
});
export type TrackFrontmatter = z.infer<typeof trackSchema>;

/** One external learning resource (a yaml file at src/content/resources/PUBLISHER/RESOURCE.yaml). */
export const resourceSchema = z.object({
  /** Exact title as the publisher shows it. */
  title: z.string().min(1),
  /** Publisher display name, e.g. "Anthropic". */
  provider: z.string().min(1),
  url: z.url({ protocol: /^https$/, hostname: z.regexes.domain }),
  cost: z.enum(COSTS),
  format: z.enum(FORMATS),
  level: z.enum(RESOURCE_LEVELS),
  /** Only when the publisher states it or it is obvious, e.g. "about 2 hours". */
  duration: z.string().min(1).optional(),
  skills: z.array(z.enum(SKILLS)).min(1),
  /** Two to four sentences: what it covers and why a Dojo learner should take it. */
  summary: z.string().min(1),
  /** Date the URL was last checked. */
  verifiedOn: z.coerce.date(),
});
export type ResourceFrontmatter = z.infer<typeof resourceSchema>;

const isoDateTime = z.iso.datetime({ offset: true });

/** One live session or workshop. src/data/events.json is an array of these (empty until announced). */
export const eventSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  /** ISO 8601 with offset, e.g. 2027-02-07T15:00:00+08:00 */
  start: isoDateTime,
  end: isoDateTime.optional(),
  /** IANA zone used to display the time, e.g. Asia/Manila */
  timezone: z.string().min(1).default('UTC'),
  /** Short label shown after the time, e.g. PHT. Falls back to the zone's own short name. */
  timezoneLabel: z.string().min(1).optional(),
  format: z.string().min(1).optional(),
  /** Kind of session; shown as a chip and used for the legend on /events. */
  type: z.enum(['live-build', 'demo-day', 'workshop', 'office-hours']).optional(),
  status: z.enum(['scheduled', 'live', 'replay', 'cancelled']).default('scheduled'),
  registerUrl: z.url().optional(),
  replayUrl: z.url().optional(),
});
export type DojoEvent = z.infer<typeof eventSchema>;
export const eventsSchema = z.array(eventSchema).superRefine((events, ctx) => {
  const seen = new Set<string>();
  events.forEach((event, index) => {
    if (seen.has(event.id)) {
      ctx.addIssue({ code: 'custom', message: `Duplicate event id "${event.id}"`, path: [index, 'id'] });
    }
    seen.add(event.id);
  });
});

/** A build challenge. */
export const challengeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  /** lucide icon name, see src/components/Icon.astro */
  icon: z.string().min(1),
  status: z.enum(['ongoing', 'upcoming', 'closed']),
  /** Optional link to a brief; omit while the brief is being written. */
  href: z.string().min(1).optional(),
});
export type Challenge = z.infer<typeof challengeSchema>;
export const challengesSchema = z.array(challengeSchema).superRefine((items, ctx) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      ctx.addIssue({ code: 'custom', message: `Duplicate challenge id "${item.id}"`, path: [index, 'id'] });
    }
    seen.add(item.id);
  });
});

/**
 * Certificate registry entry. The registry starts empty: an entry is added only when a real
 * certificate has been issued. `holder` is a public display name the holder agreed to publish.
 */
export const certificateSchema = z.object({
  /** Public verification code printed on the certificate. */
  code: z.string().regex(/^[A-Z0-9-]{6,32}$/),
  holder: z.string().min(1),
  level: z.enum(['developer', 'master-developer', 'sensei']),
  issuedOn: z.iso.date(),
  /** Link to the holder's Product Package or public work, if they chose to share it. */
  evidenceUrl: z.url().optional(),
});
export type Certificate = z.infer<typeof certificateSchema>;
export const certificatesSchema = z.array(certificateSchema).superRefine((items, ctx) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    if (seen.has(item.code)) {
      ctx.addIssue({ code: 'custom', message: `Duplicate certificate code "${item.code}"`, path: [index, 'code'] });
    }
    seen.add(item.code);
  });
});
