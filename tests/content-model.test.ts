import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { checkContent, type ContentSnapshot } from '../src/lib/content-integrity';
import { librarySchema, resourceSchema, trackSchema } from '../src/lib/schemas';

const root = join(import.meta.dirname, '..');

function list(dir: string, extension: string): string[] {
  return (readdirSync(join(root, dir), { recursive: true, encoding: 'utf8' }) as string[])
    .map((f) => f.split('\\').join('/'))
    .filter((f) => f.endsWith(extension))
    .sort();
}

function frontmatter(file: string): unknown {
  const text = readFileSync(join(root, file), 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) throw new Error(`${file}: no frontmatter block`);
  return parseYaml(match[1] ?? '');
}

describe('content on disk', () => {
  const lessonFiles = list('src/content/library', '.md');
  const trackFiles = list('src/content/tracks', '.md');
  const resourceFiles = list('src/content/resources', '.yaml');

  const lessons = lessonFiles.map((f) => ({
    id: f.replace(/\.md$/, ''),
    data: librarySchema.safeParse(frontmatter(`src/content/library/${f}`)),
    file: f,
  }));
  const resources = resourceFiles.map((f) => ({
    id: f.replace(/\.yaml$/, ''),
    data: resourceSchema.safeParse(parseYaml(readFileSync(join(root, 'src/content/resources', f), 'utf8'))),
    file: f,
  }));
  const tracks = trackFiles.map((f) => ({
    id: f.replace(/\.md$/, ''),
    data: trackSchema.safeParse(frontmatter(`src/content/tracks/${f}`)),
    file: f,
  }));

  it('every lesson has valid frontmatter', () => {
    for (const lesson of lessons) {
      expect(lesson.data.success, `${lesson.file}: ${lesson.data.error?.message ?? ''}`).toBe(true);
    }
  });

  it('every track has valid frontmatter', () => {
    for (const track of tracks) {
      expect(track.data.success, `${track.file}: ${track.data.error?.message ?? ''}`).toBe(true);
    }
  });

  it('every resource is valid and its file path is "<publisher>/<resource>.yaml"', () => {
    for (const resource of resources) {
      expect(resource.data.success, `${resource.file}: ${resource.data.error?.message ?? ''}`).toBe(true);
      expect(resource.id, resource.file).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
    }
  });

  it('every track and resource reference resolves (the same check the build runs)', () => {
    const report = checkContent({
      lessons: lessons.flatMap((lesson) =>
        lesson.data.success
          ? [
              {
                id: lesson.id,
                track: lesson.data.data.track,
                resources: lesson.data.data.resources,
                prerequisites: lesson.data.data.prerequisites,
              },
            ]
          : [],
      ),
      trackIds: tracks.map((track) => track.id),
      resources: resources.flatMap((resource) =>
        resource.data.success ? [{ id: resource.id, url: resource.data.data.url }] : [],
      ),
    });
    expect(report.errors).toEqual([]);
  });
});

describe('schemas', () => {
  const lesson = { title: 'T', description: 'D', section: 'S', order: 1 };
  const resource = {
    title: 'Course',
    provider: 'Anthropic',
    url: 'https://example.org/course',
    cost: 'free',
    format: 'course',
    level: 'beginner',
    skills: ['ai-agents'],
    summary: 'Short.',
    verifiedOn: '2026-11-03',
  };

  it('accepts a lesson with only the four required fields', () => {
    expect(librarySchema.safeParse(lesson).success).toBe(true);
  });

  it('accepts every optional lesson field, with a date or a string for updated', () => {
    const full = {
      ...lesson,
      track: 'product-discovery',
      level: 'foundation',
      duration: '45 min',
      outcomes: ['Do the thing'],
      resources: ['anthropic/prompt-engineering-interactive-tutorial'],
      prerequisites: ['week-1-see-the-whole-product'],
    };
    expect(librarySchema.safeParse({ ...full, updated: new Date('2026-11-03') }).success).toBe(true);
    expect(librarySchema.safeParse({ ...full, updated: '2026-11-03' }).success).toBe(true);
  });

  it('rejects bad lesson values', () => {
    expect(librarySchema.safeParse({ ...lesson, level: 'expert' }).success).toBe(false);
    expect(librarySchema.safeParse({ ...lesson, resources: ['no-slash'] }).success).toBe(false);
    expect(librarySchema.safeParse({ ...lesson, track: 'Not A Slug' }).success).toBe(false);
  });

  it('accepts a resource and rejects unknown enums, http links and empty skills', () => {
    expect(resourceSchema.safeParse(resource).success).toBe(true);
    expect(resourceSchema.safeParse({ ...resource, cost: 'cheap' }).success).toBe(false);
    expect(resourceSchema.safeParse({ ...resource, format: 'film' }).success).toBe(false);
    expect(resourceSchema.safeParse({ ...resource, level: 'expert' }).success).toBe(false);
    expect(resourceSchema.safeParse({ ...resource, skills: ['juggling'] }).success).toBe(false);
    expect(resourceSchema.safeParse({ ...resource, skills: [] }).success).toBe(false);
    expect(resourceSchema.safeParse({ ...resource, url: 'http://example.org/x' }).success).toBe(false);
    expect(resourceSchema.safeParse({ ...resource, verifiedOn: 'yesterday' }).success).toBe(false);
  });

  it('accepts a track and rejects an unknown group', () => {
    const track = {
      title: 'Product discovery',
      description: 'D',
      group: 'product',
      order: 1,
      icon: 'search',
      level: 'foundation',
      skills: ['product-discovery'],
      outcomes: ['Interview a customer'],
    };
    expect(trackSchema.safeParse(track).success).toBe(true);
    expect(trackSchema.safeParse({ ...track, group: 'design' }).success).toBe(false);
  });
});

describe('checkContent', () => {
  const base: ContentSnapshot = {
    lessons: [],
    trackIds: ['product-discovery'],
    resources: [{ id: 'anthropic/guide', url: 'https://example.org/guide' }],
  };

  it('passes when everything resolves', () => {
    const report = checkContent({
      ...base,
      lessons: [
        {
          id: 'tracks/product-discovery/01-talk',
          track: 'product-discovery',
          resources: ['anthropic/guide'],
        },
      ],
    });
    expect(report).toEqual({ errors: [], warnings: [] });
  });

  it('names the file and the missing track', () => {
    const { errors } = checkContent({ ...base, lessons: [{ id: 'a', track: 'nope' }] });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('src/content/library/a.md');
    expect(errors[0]).toContain('track "nope" does not exist');
  });

  it('names the file and the missing resource', () => {
    const { errors } = checkContent({ ...base, lessons: [{ id: 'a', resources: ['google/none'] }] });
    expect(errors[0]).toContain('resource "google/none" does not exist');
    expect(errors[0]).toContain('src/content/resources/google/none.yaml');
  });

  it('requires the track field to match the track folder', () => {
    const { errors } = checkContent({ ...base, lessons: [{ id: 'tracks/product-discovery/01-x' }] });
    expect(errors[0]).toContain('track: "product-discovery"');
  });

  it('warns, but does not fail, on a prerequisite that is not written yet', () => {
    const report = checkContent({ ...base, lessons: [{ id: 'a', prerequisites: ['missing'] }] });
    expect(report.errors).toEqual([]);
    expect(report.warnings[0]).toContain('prerequisite "missing"');
  });

  it('rejects two resource files for the same URL', () => {
    const { errors } = checkContent({
      ...base,
      resources: [
        { id: 'anthropic/guide', url: 'https://example.org/guide' },
        { id: 'openai/guide', url: 'https://example.org/guide/#top' },
      ],
    });
    expect(errors[0]).toContain('same URL as src/content/resources/anthropic/guide.yaml');
  });
});
