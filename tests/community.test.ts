import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BRIEFS, getBrief } from '../src/lib/challenge-briefs';
import { buildCalendar, buildIcs, buildMonth, describeWhen, localDayKey } from '../src/lib/events';
import { challengesSchema, eventSchema, type DojoEvent } from '../src/lib/schemas';

const root = join(import.meta.dirname, '..');

const sample: DojoEvent = eventSchema.parse({
  id: 'sample-live-build',
  title: 'Sample, Live Build; with symbols',
  description: 'Sample description',
  start: '2027-02-07T15:00:00+08:00',
  end: '2027-02-07T16:30:00+08:00',
  timezone: 'Asia/Manila',
  timezoneLabel: 'PHT',
  type: 'live-build',
});

describe('event helpers', () => {
  it('shows the time with its timezone', () => {
    const when = describeWhen(sample);
    expect(when.time).toBe('3:00 PM - 4:30 PM PHT');
    expect(when.zoneName).toBe('Asia/Manila');
    expect(when.dateLong).toBe('Sunday, February 7, 2027');
  });

  it('places an event on its own local day, not the UTC day', () => {
    const lateNight = { ...sample, start: '2027-02-07T01:00:00+08:00', end: undefined };
    expect(localDayKey(lateNight)).toBe('2027-02-07');
  });

  it('builds a Sunday-first month grid with the event on its day', () => {
    const month = buildMonth(2027, 2, [sample]);
    expect(month.label).toBe('February 2027');
    expect(month.weeks.every((week) => week.length === 7)).toBe(true);
    const cells = month.weeks.flat();
    expect(cells.find((cell) => cell.day === 7)?.events).toHaveLength(1);
    expect(cells.filter((cell) => cell.day !== null)).toHaveLength(28);
  });

  it('builds one grid per month that has events, and none for no events', () => {
    expect(buildCalendar([])).toEqual([]);
    const march = { ...sample, id: 'march', start: '2027-03-02T10:00:00+08:00', end: undefined };
    expect(buildCalendar([sample, march]).map((m) => m.label)).toEqual(['February 2027', 'March 2027']);
  });

  it('writes a valid, escaped .ics file with UTC times', () => {
    const ics = buildIcs(sample, new Date('2027-01-01T00:00:00Z'));
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('UID:sample-live-build@developerdojo.org');
    expect(ics).toContain('DTSTART:20270207T070000Z');
    expect(ics).toContain('DTEND:20270207T083000Z');
    expect(ics).toContain('SUMMARY:Sample\\, Live Build\\; with symbols');
    for (const line of ics.split('\r\n')) expect(line.length).toBeLessThanOrEqual(75);
  });
});

describe('challenge briefs', () => {
  const challenges = challengesSchema.parse(JSON.parse(readFileSync(join(root, 'src/data/challenges.json'), 'utf8')));

  it('every ongoing challenge has a full brief and a detail-page link', () => {
    for (const challenge of challenges.filter((c) => c.status === 'ongoing')) {
      expect(getBrief(challenge.id), challenge.id).toBeDefined();
      expect(challenge.href).toBe(`/challenges/${challenge.id}`);
    }
  });

  it('every brief matches a listed challenge and is fully written', () => {
    for (const brief of BRIEFS) {
      expect(challenges.some((c) => c.id === brief.id), brief.id).toBe(true);
      expect(brief.brief.length).toBeGreaterThanOrEqual(3);
      expect(brief.deliverables.length).toBeGreaterThanOrEqual(5);
      expect(brief.whoFor.length).toBeGreaterThan(0);
    }
  });
});
