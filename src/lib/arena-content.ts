import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { fields } from './fields';
import { resolveArenaRecords, type ArenaContext, type ArenaRecordFile, type ResolvedArenaRecord } from './arena-records';

/**
 * Loads the Arena records (#89) from src/content/arena/<slug>.yaml and validates them against their
 * published evidence. Used by the pages and by tests/arena-records.test.ts, so an invalid record or a
 * record that no longer matches its run files fails both `astro build` and `npm test`.
 * Paths are read from the project root (the working directory of astro build and vitest).
 */

const sources = import.meta.glob<string>('../content/arena/*.yaml', { query: '?raw', import: 'default', eager: true });

export function arenaRecordFiles(): ArenaRecordFile[] {
  return Object.entries(sources).map(([path, raw]) => {
    const slug = path.slice(path.lastIndexOf('/') + 1, -'.yaml'.length);
    try {
      return { slug, data: parseYaml(raw) as unknown };
    } catch (error) {
      throw new Error(`src/content/arena/${slug}.yaml is not valid YAML: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

/** Reads evidence and checks links against public/ and src/pages/ under `root`. */
export function arenaFileContext(root: string, today: string): ArenaContext {
  const publicFile = (sitePath: string) => join(root, 'public', sitePath);
  return {
    fields: fields.map((field) => field.id),
    today,
    readJson(sitePath) {
      const path = publicFile(sitePath);
      if (!existsSync(path)) return undefined;
      try {
        return JSON.parse(readFileSync(path, 'utf8')) as unknown;
      } catch (error) {
        throw new Error(`${sitePath} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    exists(sitePath) {
      const clean = sitePath.replace(/[#?].*$/, '').replace(/\/$/, '');
      const pages = join(root, 'src/pages', clean);
      return [publicFile(clean), `${pages}.astro`, join(pages, 'index.astro'), `${pages}.ts`].some((path) => existsSync(path));
    },
  };
}

let cached: ResolvedArenaRecord[] | undefined;

/** Every Arena record, validated once per build. */
export function loadArenaRecords(): ResolvedArenaRecord[] {
  cached ??= resolveArenaRecords(arenaRecordFiles(), arenaFileContext(process.cwd(), new Date().toISOString().slice(0, 10)));
  return cached;
}
