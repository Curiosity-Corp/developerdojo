import { kataDimensions } from './kata-catalog';
import type { GalleryEntryInput } from '../lib/gallery';

/**
 * Gallery records (#87): finished artifacts that exist, with provenance and a dated check. Validated by
 * resolveGallery (src/lib/gallery.ts) at build time and in tests/gallery.test.ts. docs/gallery.md is the
 * editing guide. Add an entry only once its check has actually been done; until then the outcome and its
 * fields show an honest empty state on /gallery.
 */

/** Reader-facing labels for every outcome in the kata vocabulary, in the order /gallery lists them. */
export const galleryOutcomeLabels: Record<string, string> = {
  'stack-comparison': 'Compare two AI stacks fairly',
  'design-journey': 'Design and prototype a user journey',
  'read-model': 'Read evidence from a building model',
  'read-property-sets': 'Read the property sets of a building model',
  'check-information-requirements': 'Check a model against information requirements',
  'revise-and-revalidate-model': 'Change a building model and check it again',
  'export-and-check-mesh': 'Build a 3D mesh from a building model and check its shape',
  'trace-quantities': 'Trace quantities to the model objects they come from',
  'inspect-3d': 'Inspect a 3D scene',
  'compare-instructions': 'Compare two instructions',
  'inspect-source': 'Check a source before trusting it',
  'estimate-energy': 'Estimate energy use',
  'customize-software': 'Customize open-source software',
  'clean-data': 'Rescue and report on messy data',
  'map-user-flow': 'Map a product flow with its error states',
  'connect-wireframes': 'Wire low-fidelity screens into a prototype',
  'define-design-tokens': 'Define design tokens',
  'build-components': 'Build a component library from tokens',
  'implement-and-qa-screens': 'Build screens and check their accessibility',
  'inspect-weather-record': 'Inspect a daily weather record',
  'estimate-reference-et': 'Estimate reference evapotranspiration',
  'estimate-irrigation-need': 'Estimate a crop’s irrigation need',
};

/** The outcome vocabulary the gallery browses. */
export const galleryOutcomeIds: readonly string[] = kataDimensions.outcomes;

const QUARTERLY = '2027-02-20';

export const galleryEntries: GalleryEntryInput[] = [
  {
    id: 'fnd-001-stack-comparison',
    title: 'One prototype brief, three stacks, twelve checked runs',
    summary: 'The FND-001 comparison record. The same prototype brief went to an AI coding assistant with one variable changed at a time (the instruction, then the model). An independent browser checker scored every response, and failed runs were corrected and checked again.',
    form: 'native',
    artifact: {
      format: 'Run records (JSON), the prompts sent, the HTML of every run and the check results',
      files: [
        { label: 'Read the evidence notes', href: '/examples/fnd-001/README.md' },
        { label: 'Every check result (JSON)', href: '/examples/fnd-001/results.json' },
        { label: 'Open one checked run', href: '/examples/fnd-001/runs/model-r1.html' },
      ],
    },
    provenance: {
      creator: 'Developer Dojo maintainers',
      madeWith: 'Claude Code 2.1.329 in print mode with claude-sonnet-5-5 and claude-haiku-5-5, no tools and no inherited configuration. The runner and checker scripts are published with the site source.',
      source: 'Prompt A from the "Make a clickable prototype" kata. Nine first runs and three corrections, all on 2026-11-20.',
      rights: 'Dojo material under the MIT licence. The model responses are kept unedited as evidence.',
      rightsHref: '/examples/pocket-garden-license.txt',
      created: '2026-11-20',
    },
    verification: {
      method: 'automated-check',
      date: '2026-11-20',
      checked: 'Every pipeline re-runs the browser checker on all twelve stored responses and the reference, and fails if any recorded result changes. The counts, times and costs in the record are recomputed from the run files. Negative controls show the checker fails broken files.',
      notChecked: 'Three runs per arm on one task, one date and one harness version: observations to repeat, not a benchmark. Costs are list prices reported by the tool, not an invoice. The harness comparison is a separate record with its own runs; the skill, tool and delegation comparisons were designed but not run.',
      evidenceHref: '/examples/fnd-001/README.md',
      nextCheck: QUARTERLY,
    },
    outcomeIds: ['stack-comparison'],
    fieldIds: ['software'],
    kataId: 'FND-001',
    exercise: { title: 'Make a clickable prototype', href: '/katas/first-prototype' },
  },
  {
    id: 'pocket-garden-prototype',
    title: 'Pocket Garden, a working single-file prototype',
    summary: 'A small responsive web app with plant filters and a planted toggle, built from a one-prompt brief. It is the reference result the prototype and journey katas aim for.',
    form: 'native',
    artifact: {
      format: 'Single-file HTML with inline CSS and JavaScript',
      files: [{ label: 'Open the prototype', href: '/examples/pocket-garden.html' }],
    },
    provenance: {
      creator: 'Developer Dojo maintainers',
      madeWith: 'Made with AI assistance for the kata. The harness and model that made it were not recorded.',
      source: 'The brief on the "Make a clickable prototype" kata. The plant data is fictional.',
      rights: 'MIT licence.',
      rightsHref: '/examples/pocket-garden-license.txt',
      created: '2026-11-06',
    },
    verification: {
      method: 'automated-check',
      date: '2026-11-20',
      checked: 'Passes all 14 FND-001 checks: the three filters, the planted toggle and its pressed state, reset on reload, visible keyboard focus, no sideways scroll at 390 px, no serious axe WCAG A or AA violation and no network request. Every pipeline re-runs the checker on it.',
      notChecked: 'Only what the checks list: no full WCAG conformance review and no usability testing with people. It does not show that an assistant will reproduce it exactly.',
      evidenceHref: '/examples/fnd-001/results.json',
      nextCheck: QUARTERLY,
    },
    outcomeIds: ['design-journey'],
    fieldIds: ['ux', 'software'],
    kataId: 'PRACTICE-003',
    exercise: { title: 'Make a clickable prototype', href: '/katas/first-prototype' },
  },
  {
    id: 'ifc-wall-quantity-trace',
    title: 'A wall area traced to a real IFC model',
    summary: 'An evidence table that takes one wall face from a public buildingSMART IFC4 sample to a 5 m² practice estimate. It cites the model entity behind every number and lists what stays unknown.',
    form: 'native',
    artifact: {
      format: 'CSV evidence table',
      files: [{ label: 'Open the evidence table (CSV)', href: '/examples/ifc-quantity-evidence.csv' }],
    },
    provenance: {
      creator: 'Developer Dojo maintainers',
      madeWith: 'Worked from the model geometry for the kata. Whether AI assistance was used was not recorded.',
      source: 'The buildingSMART "wall with opening and window" IFC4 sample, pinned to one commit of its certification datasets.',
      rights: 'The table is Dojo material under the MIT licence. The source model is © buildingSMART International under CC BY 4.0.',
      rightsHref: 'https://github.com/buildingSMART/Certification-datasets/blob/80d976a9b193a26a8e928c3e79bff67af1de68a8/LICENSE',
      created: '2026-11-08',
    },
    verification: {
      method: 'automated-check',
      date: '2026-11-20',
      checked: 'Every pipeline checks that the table is served with its estimate row (6 m² − 1 m² = 5 m²) and that the kata page shows the same arithmetic. The pinned source file and its licence were opened on the check date.',
      notChecked: 'A hand-worked practice estimate under stated assumptions. It is not a stored IFC quantity, a takeoff or a cost estimate, and no qualified professional has reviewed it. The wall fire rating in the model is an empty label.',
      evidenceHref: '/katas/ifc-quantity-trace',
      nextCheck: QUARTERLY,
    },
    outcomeIds: ['read-model'],
    fieldIds: ['architecture-bim', 'construction'],
    kataId: 'PRACTICE-004',
    exercise: { title: 'Trace a wall quantity to the model', href: '/katas/ifc-quantity-trace' },
  },
  {
    id: 'bim-pathway-edited-model',
    title: 'An IFC model changed and checked again against IDS',
    summary: 'The BIM-004 worked example. A buildingSMART IFC4 sample fails one of six practice IDS requirements; a scoped IfcOpenShell edit fills the missing wall property, keeps all 24 GlobalIds, and the IDS, schema and geometry checks are rerun on the copy and reported separately.',
    form: 'native',
    artifact: {
      format: 'IFC4 model (edited copy), IDS 1.0 requirements and the check results as JSON',
      files: [
        { label: 'Download the edited model (IFC)', href: '/examples/bim-pathway/generated/wall-with-opening-and-window.edited.ifc' },
        { label: 'Read the check summary', href: '/examples/bim-pathway/generated/summary.md' },
        { label: 'Open the practice requirements (IDS)', href: '/examples/bim-pathway/practice-requirements.ids' },
      ],
    },
    provenance: {
      creator: 'Developer Dojo maintainers (edit, requirements and checks); buildingSMART International (source model)',
      madeWith: 'IfcOpenShell 0.9.0.post1 and IfcTester 0.9.0 on Python 3.12, run by the pathway script published next to the model.',
      source: 'The buildingSMART "wall with opening and window" IFC4 sample, pinned to one commit of its certification datasets.',
      rights: 'The edited model is an adaptation of © buildingSMART International under CC BY 4.0. The requirements, script and results are Dojo material under the MIT licence.',
      rightsHref: '/examples/bim-pathway/LICENSE-buildingSMART.txt',
      created: '2026-11-21',
    },
    verification: {
      method: 'automated-check',
      date: '2026-11-21',
      checked: 'Every pipeline installs the pinned packages by hash, rebuilds the edited model and reruns every check, and fails if any output differs from the published files. Original: 5 of 6 IDS requirements pass. Edited: 6 of 6, no schema issues with EXPRESS rules off, and all three shapes build.',
      notChecked: 'Practice requirements on a three-element test file: nothing about a real building. "REI 60" is a placeholder, not a fire rating. No EXPRESS where-rules, no authoring tool or viewer, no learner and no professional review.',
      evidenceHref: '/katas/bim-pathway',
      nextCheck: QUARTERLY,
    },
    outcomeIds: ['revise-and-revalidate-model'],
    fieldIds: ['architecture-bim', 'construction'],
    kataId: 'BIM-004',
    exercise: { title: 'Follow the BIM pathway', href: '/katas/bim-pathway' },
  },
  {
    id: 'reconstructed-3d-office',
    title: 'An office reconstructed as an interactive 3D scene',
    summary: 'An editable Three.js office built from a room capture with an AI coding agent, with dollhouse, wireframe and walk-around views. It lives with its creator; the Dojo links to it.',
    form: 'preview',
    artifact: {
      format: 'Interactive Three.js scene in the creator’s web viewer',
      files: [
        { label: 'Open the creator’s viewer', href: 'https://wesbos.github.io/3d-model-anything/' },
        { label: 'Read the creator’s source', href: 'https://github.com/wesbos/3d-model-anything' },
      ],
    },
    provenance: {
      creator: 'Wes Bos',
      madeWith: 'Built by the creator with an AI coding agent, as the creator’s walkthrough describes.',
      source: 'The creator’s public repository and walkthrough. The original scans and photos are not published.',
      rights: 'Source code under MIT. The office measurement data and images are under the creator’s demo asset terms: viewing and study are allowed, redistribution as standalone assets is not.',
      rightsHref: 'https://github.com/wesbos/3d-model-anything/blob/31b2dc9da3fb541e501f2f0936e55b32afb70ee8/ASSETS-LICENSE.md',
      created: '2026-10-21',
    },
    verification: {
      method: 'source-check',
      date: '2026-11-20',
      checked: 'The viewer, the repository and the asset terms at a pinned commit answered on the check date, and the terms were read.',
      notChecked: 'The Dojo did not rebuild the scene. The published example has no original scans, so its accuracy against the real room cannot be checked.',
      nextCheck: QUARTERLY,
    },
    outcomeIds: ['inspect-3d'],
    fieldIds: ['3d'],
    kataId: 'PRACTICE-008',
    exercise: { title: 'Explore a 3D room', href: '/katas/scan-a-room' },
  },
  {
    id: 'pocket-invoice-penpot-file',
    title: 'Pocket Invoice, an editable Penpot file from sitemap to high fidelity',
    summary: 'A Penpot file for an invented invoicing app: a sitemap with every error state, wired low- and high-fidelity screens for all 11 states, design tokens and 8 components. A working page built from the same flow and tokens sits next to it.',
    form: 'native',
    artifact: {
      format: 'Penpot file (.penpot, a ZIP of JSON) and a design token file (JSON)',
      files: [
        { label: 'Download the Penpot file', href: '/examples/ux-pathway/pocket-invoice.penpot' },
        { label: 'Download the design tokens (JSON)', href: '/examples/ux-pathway/pocket-invoice-tokens.json' },
        { label: 'Use the working page', href: '/examples/pocket-invoice/' },
      ],
    },
    provenance: {
      creator: 'Developer Dojo maintainers',
      madeWith: 'Generated from the Pocket Invoice flow and token file with Penpot\'s official library, @penpot/library 1.3.0, by a script written with an AI coding assistant. The generator is published with the site source.',
      source: 'An invented product and fictional data. The error summary follows the GOV.UK Design System pattern (Open Government Licence v3.0); no GOV.UK text or code is copied.',
      rights: 'Dojo material under the MIT licence.',
      rightsHref: '/examples/ux-pathway/README.md',
      created: '2026-11-20',
    },
    verification: {
      method: 'automated-check',
      date: '2026-11-20',
      checked: 'Imported into a self-hosted Penpot 2.18.7: 4 pages, 11 state boards per wireframe page, 8 components, 16 colours, 5 typographies and all 54 tokens, and a 22-click View mode walk of both prototypes reached all 19 transitions. Every pipeline rebuilds the file and fails if it differs from the published copy or loses a board, an interaction or a token.',
      notChecked: 'Penpot cloud, editing by a person, export to other formats, and writing through a plugin or the MCP server. No usability sessions have been run.',
      evidenceHref: '/examples/ux-pathway/penpot-import-check.json',
      nextCheck: '2027-05-20',
    },
    outcomeIds: ['connect-wireframes'],
    fieldIds: ['ux'],
    kataId: 'UX-002',
    exercise: { title: 'Draw low-fidelity screens and wire the flow', href: '/katas/ux-002-low-fidelity' },
  },
  {
    id: 'agriculture-irrigation-estimate',
    title: 'A maize irrigation estimate from a real weather record',
    summary: 'The AGR-003 worked example. A year of NOAA daily weather from a California station becomes FAO-56 reference evapotranspiration and a maize crop water and irrigation estimate, after the script reproduces FAO’s own worked examples.',
    form: 'native',
    artifact: {
      format: 'Monthly irrigation estimate (JSON), daily reference evapotranspiration (CSV) and a one-page summary (Markdown)',
      files: [
        { label: 'Read the results summary', href: '/examples/agriculture-pathway/generated/summary.md' },
        { label: 'Download the irrigation estimate (JSON)', href: '/examples/agriculture-pathway/generated/irrigation.json' },
        { label: 'Download the daily evapotranspiration (CSV)', href: '/examples/agriculture-pathway/generated/et0-daily.csv' },
      ],
    },
    provenance: {
      creator: 'Developer Dojo maintainers (script and results); US National Weather Service via NOAA NCEI (weather record)',
      madeWith: 'A Python 3.12 script with no packages, published next to the results, using the equations of FAO Irrigation and Drainage Paper 56.',
      source: 'The 2023 GHCN-Daily record of the Fresno Yosemite International station (USW00093193), as NOAA’s data service returned it.',
      rights: 'The weather record is a US federal government work, not under copyright in the US. The script and results are Dojo material under the MIT licence.',
      rightsHref: '/examples/agriculture-pathway/README.md',
      created: '2026-11-21',
    },
    verification: {
      method: 'automated-check',
      date: '2026-11-21',
      checked: 'Every pipeline reruns the script, which first reproduces 13 published values from FAO’s worked examples, and fails if any output differs from the published files.',
      notChecked: 'Humidity, radiation and wind are estimated from temperature, not measured. FAO table crop values, not adjusted for this site. No real field, soil or irrigation system, no learner and no agronomist or irrigation engineer review.',
      evidenceHref: '/katas/agriculture-pathway',
      nextCheck: QUARTERLY,
    },
    outcomeIds: ['estimate-irrigation-need'],
    fieldIds: ['agriculture'],
    kataId: 'AGR-003',
    exercise: { title: 'Follow the agriculture pathway', href: '/katas/agriculture-pathway' },
  },
];