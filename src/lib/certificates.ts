import type { Certificate } from './schemas';

export const LEVEL_LABELS: Record<Certificate['level'], string> = {
  developer: 'Developer',
  'master-developer': 'Master Developer',
  sensei: 'Sensei',
};

/** Lower-case, strip accents, collapse white space. */
export function normaliseName(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Certificate codes are upper case letters, digits and hyphens. Spaces and case do not matter. */
export function normaliseCode(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

export const MIN_NAME_QUERY = 3;

export interface LookupResult {
  kind: 'empty-query' | 'too-short' | 'found' | 'not-found';
  matches: Certificate[];
}

/**
 * Look a certificate up by its code (exact) or by holder name (whole-word-or-part match, at least
 * three characters). Pure and side-effect free so it runs the same in the browser and in tests.
 */
export function lookupCertificate(registry: readonly Certificate[], query: string): LookupResult {
  const trimmed = query.trim();
  if (trimmed === '') return { kind: 'empty-query', matches: [] };

  const code = normaliseCode(trimmed);
  const byCode = registry.filter((entry) => entry.code === code);
  if (byCode.length > 0) return { kind: 'found', matches: byCode };

  const name = normaliseName(trimmed);
  if (name.length < MIN_NAME_QUERY) return { kind: 'too-short', matches: [] };
  const byName = registry.filter((entry) => normaliseName(entry.holder).includes(name));
  return byName.length > 0 ? { kind: 'found', matches: byName } : { kind: 'not-found', matches: [] };
}
