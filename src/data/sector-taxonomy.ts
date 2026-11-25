import { fields } from '../lib/fields';
import { checkSectorTaxonomy, sectorGroupSchema, type SectorGroup } from '../lib/sector-taxonomy';

/**
 * The sector taxonomy plan (#93, docs/sector-packs.md). Every field belongs to exactly one group. nextPack says what
 * a pack would need; it never claims a pack exists. What is delivered is derived from the packs and tracks.
 */
export const sectorGroupInputs = [
  { id: 'digital-ux', name: 'Digital products and UX', fieldIds: ['software', 'ux', 'data', 'cybersecurity'], nextPack: 'A data or security pack needs an openly licensed dataset or system to work on, reference results a script can reproduce, and a reviewer for any real security finding.' },
  { id: 'spatial-media', name: 'Spatial design and media', fieldIds: ['3d', 'media'], nextPack: 'A 3D pack needs openly licensed models or captures whose licence allows changes, and a published method or reference results a script can rerun, as the media pathway does with the EBU loudness test signals.' },
  { id: 'built-environment', name: 'Built environment', fieldIds: ['architecture-bim', 'construction'], nextPack: 'A construction pack needs open schedule or asset data, and the same qualified-review limits as the BIM pathway.' },
  { id: 'industrial-hardware', name: 'Industrial and hardware', fieldIds: ['manufacturing', 'aerospace'], nextPack: 'An aerospace or transport pack needs a public record or published method with worked examples to reproduce, as the manufacturing pathway does with the NIST/SEMATECH e-Handbook, and an engineer named for any real use.' },
  { id: 'robotics', name: 'Robotics and autonomy', fieldIds: ['robotics'], nextPack: 'Simulation only: an open robot model and scenario, with results CI can rerun, and safety review named for anything on real hardware.' },
  { id: 'science-engineering', name: 'Science and engineering', fieldIds: ['science'], nextPack: 'A next pack (laboratory measurement, for example) needs reference data the Dojo may serve; copyrighted reference sets are cited and linked, never served.' },
  { id: 'health-life-sciences', name: 'Health and life sciences', fieldIds: ['health', 'biotechnology'], nextPack: 'Public, non-identifying data only, simulation for any lab work, and a qualified reviewer named for anything near clinical use.' },
  { id: 'business-public-service', name: 'Business and public service', fieldIds: ['finance', 'public-service'], nextPack: 'A public-service pack needs public records or published rules cited by version and jurisdiction, as the finance pathway does with Regulation Z, and a legal reviewer named for real use.' },
  { id: 'energy-agriculture', name: 'Energy, agriculture and natural resources', fieldIds: ['energy', 'agriculture'], nextPack: 'An energy pack needs a public metered or modelled dataset and a published calculation method with worked examples to reproduce.' },
  { id: 'learning-communications', name: 'Learning and communications', fieldIds: ['education'], nextPack: 'Needs an openly licensed curriculum or assessment framework and a way to check learning materials that does not involve real learners’ data.' },
] as const;

const problems = checkSectorTaxonomy(sectorGroupInputs, fields.map((field) => field.id));
if (problems.length > 0) throw new Error('Sector taxonomy check failed (docs/sector-packs.md):\n' + problems.map((problem) => ' - ' + problem).join('\n'));

export const sectorGroups: SectorGroup[] = sectorGroupInputs.map((group) => sectorGroupSchema.parse(group));
