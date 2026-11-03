import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  certificatesSchema,
  challengesSchema,
  eventsSchema,
  librarySchema,
} from '../src/lib/schemas';

const root = join(import.meta.dirname, '..');

function readJson(relative: string): unknown {
  return JSON.parse(readFileSync(join(root, relative), 'utf8'));
}

describe('data files', () => {
  it('events.json parses (empty until sessions are announced)', () => {
    expect(eventsSchema.parse(readJson('src/data/events.json'))).toBeInstanceOf(Array);
  });

  it('certificates.json parses and starts as an empty registry', () => {
    expect(certificatesSchema.parse(readJson('src/data/certificates.json'))).toEqual([]);
  });

  it('challenges.json lists the two real ongoing challenges', () => {
    const challenges = challengesSchema.parse(readJson('src/data/challenges.json'));
    expect(challenges.map((c) => c.title)).toEqual(['Build a Real MVP', 'AI Agent Workflow Challenge']);
    expect(challenges.every((c) => c.status === 'ongoing')).toBe(true);
  });
});

describe('library frontmatter', () => {
  it('every entry has valid frontmatter', () => {
    const dir = join(root, 'src/content/library');
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const text = readFileSync(join(dir, file), 'utf8');
      const match = /^---\n([\s\S]*?)\n---/.exec(text);
      expect(match, `${file} has frontmatter`).not.toBeNull();
      const data: Record<string, string | number> = {};
      for (const line of (match?.[1] ?? '').split('\n')) {
        const [key, ...rest] = line.split(':');
        const value = rest.join(':').trim();
        if (key) data[key.trim()] = /^\d+$/.test(value) ? Number(value) : value;
      }
      expect(() => librarySchema.parse(data), file).not.toThrow();
    }
  });

  it('rejects an entry without a description', () => {
    expect(librarySchema.safeParse({ title: 'x', section: 'y', order: 1 }).success).toBe(false);
  });
});

describe('schema rules', () => {
  const event = {
    id: 'build-sprint',
    title: 'Product Build Sprint',
    description: 'A focused build session.',
    start: '2027-02-07T15:00:00+08:00',
    timezone: 'Asia/Manila',
  };

  it('accepts a valid event and defaults the status', () => {
    const [parsed] = eventsSchema.parse([event]);
    expect(parsed?.status).toBe('scheduled');
  });

  it('rejects duplicate event ids and bad dates', () => {
    expect(eventsSchema.safeParse([event, event]).success).toBe(false);
    expect(eventsSchema.safeParse([{ ...event, start: 'next tuesday' }]).success).toBe(false);
  });

  it('rejects duplicate certificate codes', () => {
    const cert = { code: 'DD-000001', holder: 'Example Holder', level: 'developer', issuedOn: '2027-03-01' };
    expect(certificatesSchema.safeParse([cert]).success).toBe(true);
    expect(certificatesSchema.safeParse([cert, cert]).success).toBe(false);
  });

  it('rejects an unknown challenge status', () => {
    const challenge = { id: 'x', title: 'X', summary: 'x', icon: 'layers', status: 'maybe' };
    expect(challengesSchema.safeParse([challenge]).success).toBe(false);
  });
});
