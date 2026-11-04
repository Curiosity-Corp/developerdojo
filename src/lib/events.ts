import type { DojoEvent, DojoEventDetail } from './schemas';

export type EventType = NonNullable<DojoEvent['type']>;

/** The four kinds of session. Used for chips and for the legend on /events. */
export const EVENT_TYPES: Record<EventType, { label: string; icon: string; description: string }> = {
  'live-build': {
    label: 'Live Build',
    icon: 'monitor-play',
    description: 'A Sensei builds a real product step by step, live, and explains each decision. You watch, ask, and build along.',
  },
  'demo-day': {
    label: 'Demo Day',
    icon: 'presentation',
    description: 'Members show finished work: a Product Package or a Build Sprint result. Short demos, honest feedback.',
  },
  workshop: {
    label: 'Workshop',
    icon: 'hammer',
    description: 'A focused, hands-on session on one skill, such as writing an epic or briefing an AI agent.',
  },
  'office-hours': {
    label: 'Office Hours',
    icon: 'messages-square',
    description: 'Open time with a Sensei. Bring a question, a stuck issue, or a draft epic.',
  },
};

export const EVENT_TYPE_ORDER: readonly EventType[] = ['live-build', 'demo-day', 'workshop', 'office-hours'];

/** An event that has a detail page: its `detail` part is present. No detail means no page. */
export type DetailedEvent = DojoEvent & { detail: DojoEventDetail };

/** The events that get a page at /events/<id>/. An empty list of events gives an empty list. */
export function eventsWithDetail(events: readonly DojoEvent[]): DetailedEvent[] {
  return events.filter((event): event is DetailedEvent => event.detail !== undefined);
}

function zoneLabel(date: Date, zone: string, override?: string): string {
  if (override) return override;
  const name = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value;
  return name ?? zone;
}

export interface EventWhen {
  /** e.g. "Saturday, February 7, 2027" in the event's own zone */
  dateLong: string;
  /** e.g. "3:00 PM - 4:30 PM PHT" (the end is left out when unknown) */
  time: string;
  /** Short zone name, e.g. "PHT" */
  zone: string;
  /** IANA zone the times are shown in, e.g. "Asia/Manila" */
  zoneName: string;
}

/** Human-readable date and time for an event, always including the timezone. */
export function describeWhen(event: DojoEvent): EventWhen {
  const start = new Date(event.start);
  const opts = { timeZone: event.timezone } as const;
  const dateLong = new Intl.DateTimeFormat('en-US', {
    ...opts,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(start);
  const clock = new Intl.DateTimeFormat('en-US', { ...opts, hour: 'numeric', minute: '2-digit' });
  const zone = zoneLabel(start, event.timezone, event.timezoneLabel);
  const startClock = clock.format(start);
  const time = event.end ? `${startClock} - ${clock.format(new Date(event.end))} ${zone}` : `${startClock} ${zone}`;
  return { dateLong, time, zone, zoneName: event.timezone };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** "YYYY-MM-DD" of the event's start in its own timezone (the day it is shown on in the calendar). */
export function localDayKey(event: DojoEvent): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: event.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(event.start));
  return parts;
}

export interface CalendarCell {
  /** null for the empty cells before the 1st and after the last day */
  day: number | null;
  key: string | null;
  events: DojoEvent[];
}

export interface CalendarMonth {
  year: number;
  /** 1-12 */
  month: number;
  label: string;
  weeks: CalendarCell[][];
}

/** A Sunday-first month grid with the events placed on their own local day. */
export function buildMonth(year: number, month: number, events: readonly DojoEvent[]): CalendarMonth {
  const byDay = new Map<string, DojoEvent[]>();
  for (const event of events) {
    const key = localDayKey(event);
    byDay.set(key, [...(byDay.get(key) ?? []), event]);
  }
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = first.getUTCDay();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < lead; i += 1) cells.push({ day: null, key: null, events: [] });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${pad(month)}-${pad(day)}`;
    cells.push({ day, key, events: byDay.get(key) ?? [] });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, key: null, events: [] });
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const label = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(first);
  return { year, month, label, weeks };
}

/** One grid for every month that has at least one event, in order. */
export function buildCalendar(events: readonly DojoEvent[]): CalendarMonth[] {
  const months = new Set<string>();
  for (const event of events) months.add(localDayKey(event).slice(0, 7));
  return [...months].sort().map((key) => {
    const [year, month] = key.split('-').map(Number) as [number, number];
    return buildMonth(year, month, events);
  });
}

const ICS_UTC = (date: Date): string =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

function icsEscape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Fold a content line at 75 characters, continuation lines start with one space (RFC 5545). */
function fold(line: string): string {
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    chunks.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return chunks.join('\r\n');
}

/** An RFC 5545 calendar file for one event. Times are written in UTC so every calendar app agrees. */
export function buildIcs(event: DojoEvent, stamp: Date = new Date()): string {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
  const when = describeWhen(event);
  const kind = event.type ? `${EVENT_TYPES[event.type].label}. ` : '';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Developer Dojo//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@developerdojo.org`,
    `DTSTAMP:${ICS_UTC(stamp)}`,
    `DTSTART:${ICS_UTC(start)}`,
    `DTEND:${ICS_UTC(end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(`${kind}${event.description} (${when.time}, ${when.zoneName})`)}`,
    `STATUS:${event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`,
    ...(event.registerUrl ? [`URL:${event.registerUrl}`] : ['URL:https://developerdojo.org/events']),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}
