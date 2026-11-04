import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { eventDetailSchema, eventSchema, eventsSchema } from '../src/lib/schemas';
import { eventsWithDetail } from '../src/lib/events';
import { getEvents } from '../src/lib/data';

const root = join(import.meta.dirname, '..');

/** The fields every event must have in src/data/events.json. Keep in step with docs/handbook.md. */
const REQUIRED_EVENT_FIELDS = ['id', 'title', 'description', 'start', 'timezone'] as const;
/** The five parts of a detail page. When `detail` is there, all of them must be there. */
const REQUIRED_DETAIL_FIELDS = ['bring', 'agenda', 'howToJoin', 'accessibility', 'language'] as const;

// Test-only fixture, written in the format the handbook explains. It is never read by the site build.
const FORMAT_ONLY_EVENT = {
  id: 'format-only-example',
  title: 'Format only example',
  description: 'This object exists to test the format. It is not a real event.',
  start: '2099-01-01T10:00:00+00:00',
  end: '2099-01-01T11:00:00+00:00',
  timezone: 'UTC',
  detail: {
    bring: ['Nothing special.'],
    agenda: ['Part one', 'Part two'],
    howToJoin: ['Open the link on the event page.'],
    accessibility: 'Format-only text.',
    language: 'Format-only text.',
  },
};

function without(value: object, key: string): Record<string, unknown> {
  const copy: Record<string, unknown> = { ...(value as Record<string, unknown>) };
  delete copy[key];
  return copy;
}

describe('event required fields', () => {
  it('the list of required fields here matches the schema', () => {
    const required = Object.entries(eventSchema.shape)
      .filter(([, field]) => !field.safeParse(undefined).success)
      .map(([name]) => name)
      .sort();
    expect(required).toEqual([...REQUIRED_EVENT_FIELDS].sort());
    const detailRequired = Object.entries(eventDetailSchema.shape)
      .filter(([, field]) => !field.safeParse(undefined).success)
      .map(([name]) => name)
      .sort();
    expect(detailRequired).toEqual([...REQUIRED_DETAIL_FIELDS].sort());
  });

  it('accepts the format-only example', () => {
    expect(eventsSchema.safeParse([FORMAT_ONLY_EVENT]).success).toBe(true);
  });

  for (const field of REQUIRED_EVENT_FIELDS) {
    it(`rejects an event with no ${field}`, () => {
      expect(eventsSchema.safeParse([without(FORMAT_ONLY_EVENT, field)]).success).toBe(false);
    });
    it(`rejects an event with an empty ${field}`, () => {
      expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, [field]: '   ' }]).success).toBe(false);
    });
  }

  for (const field of REQUIRED_DETAIL_FIELDS) {
    it(`rejects a detail page with no ${field}`, () => {
      const event = { ...FORMAT_ONLY_EVENT, detail: without(FORMAT_ONLY_EVENT.detail, field) };
      expect(eventsSchema.safeParse([event]).success).toBe(false);
    });
  }

  it('rejects empty lists in a detail page', () => {
    for (const field of ['bring', 'agenda', 'howToJoin']) {
      const event = { ...FORMAT_ONLY_EVENT, detail: { ...FORMAT_ONLY_EVENT.detail, [field]: [] } };
      expect(eventsSchema.safeParse([event]).success, field).toBe(false);
    }
  });
});

describe('event value rules', () => {
  it('rejects a misspelled field name instead of ignoring it', () => {
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, registerURL: 'https://example.org/x' }]).success).toBe(false);
    const detail = { ...FORMAT_ONLY_EVENT.detail, acessibility: 'x' };
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, detail }]).success).toBe(false);
  });
  it('rejects a timezone that does not exist and a start with no offset', () => {
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, timezone: 'Mars/Olympus' }]).success).toBe(false);
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, start: '2099-01-01T10:00:00' }]).success).toBe(false);
  });
  it('rejects an end that is not after the start', () => {
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, end: FORMAT_ONLY_EVENT.start }]).success).toBe(false);
  });
  it('rejects ids that are not lowercase words joined by hyphens', () => {
    for (const id of ['Has Caps', 'trailing-', '-leading', 'two--hyphens', '']) {
      expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, id }]).success, id).toBe(false);
    }
  });
  it('accepts only https links', () => {
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, registerUrl: 'https://example.org/join' }]).success).toBe(true);
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, registerUrl: 'http://example.org/join' }]).success).toBe(false);
    expect(eventsSchema.safeParse([{ ...FORMAT_ONLY_EVENT, replayUrl: 'javascript:alert(1)' }]).success).toBe(false);
  });
});

describe('detail pages', () => {
  it('only events with a detail part get a page', () => {
    const [withDetail, plain] = eventsSchema.parse([FORMAT_ONLY_EVENT, { ...without(FORMAT_ONLY_EVENT, 'detail'), id: 'plain-example' }]);
    expect(eventsWithDetail([withDetail!, plain!]).map((event) => event.id)).toEqual(['format-only-example']);
  });
  it('no events means no pages', () => {
    expect(eventsWithDetail([])).toEqual([]);
  });
});

describe('docs/handbook.md', () => {
  it('has a format-only example that passes the schema, so the guide cannot drift from the rules', () => {
    const handbook = readFileSync(join(root, 'docs/handbook.md'), 'utf8');
    const section = handbook.slice(handbook.indexOf('## 13. Add, change or remove an event'));
    const block = /```json\n([\s\S]*?)\n```/.exec(section)?.[1];
    expect(block, 'section 13 needs a json example').toBeDefined();
    const example = JSON.parse(block as string) as Record<string, unknown>;
    expect(example['id']).toBe('format-only-example');
    expect(eventsSchema.safeParse([example]).success).toBe(true);
    // Every field the schema knows is shown in the example, except replayUrl (it only makes sense after the session).
    const shown = Object.keys(eventSchema.shape).filter((name) => name !== 'replayUrl');
    expect(Object.keys(example).sort()).toEqual(shown.sort());
  });
});

describe('shipped src/data/events.json', () => {
  const raw: unknown = JSON.parse(readFileSync(join(root, 'src/data/events.json'), 'utf8'));

  it('is a list', () => {
    expect(Array.isArray(raw)).toBe(true);
  });

  it('gives every event every required field, as written in the file', () => {
    const missing: string[] = [];
    (raw as Record<string, unknown>[]).forEach((event, index) => {
      for (const field of REQUIRED_EVENT_FIELDS) {
        const value = event[field];
        if (typeof value !== 'string' || value.trim() === '') missing.push(`event ${index + 1} (${String(event['id'] ?? 'no id')}): ${field}`);
      }
    });
    expect(missing, `Missing required fields:\n${missing.join('\n')}`).toEqual([]);
  });

  it('passes the full schema', () => {
    const result = eventsSchema.safeParse(raw);
    expect(result.success, result.success ? '' : result.error.message).toBe(true);
  });

  it('does not contain the format-only example', () => {
    expect(getEvents().some((event) => event.id === FORMAT_ONLY_EVENT.id)).toBe(false);
  });

  it('builds one detail page for each event that has a detail part, and none otherwise', () => {
    const events = getEvents();
    expect(eventsWithDetail(events)).toHaveLength(events.filter((event) => event.detail !== undefined).length);
  });
});
