import { z } from 'zod';

/** Library entry frontmatter (src/content/library/*.md). */
export const librarySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  /** Section the entry is grouped under on /library, e.g. "Platform". */
  section: z.string().min(1),
  /** Sort order inside the section (ascending). */
  order: z.number().int().nonnegative(),
});
export type LibraryFrontmatter = z.infer<typeof librarySchema>;

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
