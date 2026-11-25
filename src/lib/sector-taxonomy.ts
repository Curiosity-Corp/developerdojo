import { z } from 'zod';
import { dimensionId } from './kata-schema';

/**
 * The sector taxonomy plan (#93): ten groups that together hold every field in src/lib/fields.ts, so a new
 * sector pack always has a place to go. A group in the plan is not a course. Coverage is derived, never typed:
 * a group has a sector pathway only when a pack in src/data/sector-packs.ts starts from one of its fields, and
 * a related track only when one of its fields links one. Records: src/data/sector-taxonomy.ts.
 */

const text = z.string().trim().min(1);

export const sectorGroupSchema = z.strictObject({
  id: dimensionId,
  name: text,
  fieldIds: z.array(dimensionId).min(1),
  /** What a first or next pack in this group needs before it can be published. A plan, not a promise. */
  nextPack: text,
});

export type SectorGroup = z.output<typeof sectorGroupSchema>;

/** Every problem with the plan: a field in no group or in two, or a group naming a field that does not exist. */
export function checkSectorTaxonomy(input: unknown, fieldIds: readonly string[]): string[] {
  const parsed = z.array(sectorGroupSchema).min(1).safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => 'src/data/sector-taxonomy.ts ' + issue.path.join('.') + ': ' + issue.message);
  const problems: string[] = [];
  const owner = new Map<string, string>();
  const groupIds = new Set<string>();
  for (const group of parsed.data) {
    if (groupIds.has(group.id)) problems.push('group ' + group.id + ' is listed twice');
    groupIds.add(group.id);
    for (const field of group.fieldIds) {
      if (!fieldIds.includes(field)) problems.push(group.id + ': field ' + field + ' is not in src/lib/fields.ts');
      const previous = owner.get(field);
      if (previous) problems.push(group.id + ': field ' + field + ' is already in the ' + previous + ' group');
      owner.set(field, group.id);
    }
  }
  for (const field of fieldIds) if (!owner.has(field)) problems.push('field ' + field + ' is in no sector group; add it to one in src/data/sector-taxonomy.ts');
  return problems;
}

export type Coverage = 'sector-pathway' | 'track' | 'planned';

export const COVERAGE_LABELS: Record<Coverage, string> = {
  'sector-pathway': 'Sector pathway available',
  track: 'Related track only, no sector pathway yet',
  planned: 'In the plan only, no course yet',
};

export interface GroupCoverage {
  group: SectorGroup;
  fields: readonly { id: string; name: string }[];
  pathways: readonly { packId: string; title: string; href: string }[];
  tracks: readonly { fieldName: string; href: string }[];
  coverage: Coverage;
}

/** Each group with what is actually delivered for it, kept apart from what the plan lists. */
export function sectorCoverage(
  groups: readonly SectorGroup[],
  fields: readonly { id: string; name: string; trackHref?: string | undefined }[],
  packs: readonly { id: string; title: string; pathway: string; fieldIds: readonly string[] }[],
): GroupCoverage[] {
  return groups.map((group) => {
    const groupFields = fields.filter((field) => group.fieldIds.includes(field.id));
    const pathways = packs.filter((pack) => group.fieldIds.includes(pack.fieldIds[0] ?? '')).map((pack) => ({ packId: pack.id, title: pack.title, href: pack.pathway }));
    const tracks = groupFields.flatMap((field) => (field.trackHref ? [{ fieldName: field.name, href: field.trackHref }] : []));
    const coverage: Coverage = pathways.length > 0 ? 'sector-pathway' : tracks.length > 0 ? 'track' : 'planned';
    return { group, fields: groupFields.map(({ id, name }) => ({ id, name })), pathways, tracks, coverage };
  });
}
