import { checkSectorPacks, sectorPackSchema, type SectorPack, type SectorPackInput } from '../lib/sector-pack';

/**
 * Sector packs (#93): one record per sector pathway. docs/sector-packs.md is the guide and the checklist for adding
 * one. The build validates every record against the recipes, pages, gallery, Armory and files
 * (src/lib/kata-recipe-content.ts); tests/sector-packs.test.ts also checks the CI jobs and the input hashes.
 *
 * Verified lines say what a check did. {placeholders} are filled from numbers the pathway page reads from the CI
 * output, so no number here is typed by hand.
 */
export const sectorPackInputs: SectorPackInput[] = [
  {
    id: 'ux',
    title: 'SaaS UX: from sitemap to a tested screen',
    fieldIds: ['ux'],
    pathway: '/katas/ux-pathway',
    kataIds: ['UX-001', 'UX-002', 'UX-003', 'UX-004', 'UX-005'],
    randoriKataId: 'UX-R01',
    foundationKataIds: ['PRACTICE-001', 'PRACTICE-002'],
    examples: { dir: '/examples/ux-pathway', readme: '/examples/ux-pathway/README.md' },
    inputs: { none: 'Pocket Invoice is invented for practice. Its flow file, contrast pairs, tokens, Penpot file, drawings and screenshots are Dojo material under the MIT licence, generated from src/data.' },
    checks: [
      { name: 'The Penpot file is rebuilt from the flow and tokens, and every token colour pair meets its contrast ratio', ciJob: 'test', runs: 'tests/pocket-invoice.test.ts', outputs: ['/examples/ux-pathway/pocket-invoice.penpot', '/examples/ux-pathway/pocket-invoice-tokens.json'] },
      { name: 'The working example is driven through every state with axe, reflow and focus checks, and the clickable prototype through every transition', ciJob: 'e2e', runs: 'e2e/ux-pathway.spec.ts', outputs: ['/examples/ux-pathway/qa-report.md'] },
      {
        name: 'The flow file is redrawn as a sitemap, a one-canvas journey and one low-fidelity screen per state, and rechecked for reachability, dead ends, error recovery, dialogs, button wiring and token contrast',
        ciJob: 'ux_pathway',
        runs: 'public/examples/ux-pathway/tools/ux_pathway.mjs',
        outputs: ['/examples/ux-pathway/generated/sitemap.svg', '/examples/ux-pathway/generated/journey.svg', '/examples/ux-pathway/generated/flow-checks.json', '/examples/ux-pathway/generated/manifest.json', '/examples/ux-pathway/generated/summary.md'],
      },
      {
        name: 'The same script draws the style guide, the component sheet and every state at 390 px and 1440 px in high fidelity from the tokens and the brand file (tools/ux_hifi.mjs), and audits each drawing for token use, text and boundary contrast, control size and component coverage',
        ciJob: 'ux_pathway',
        runs: 'public/examples/ux-pathway/tools/ux_pathway.mjs',
        outputs: ['/examples/ux-pathway/generated/style-guide.svg', '/examples/ux-pathway/generated/components.svg', '/examples/ux-pathway/generated/journey-high.svg', '/examples/ux-pathway/generated/fidelity-report.json', '/examples/ux-pathway/generated/fidelity-report.md'],
      },
    ],
    verified: [
      { text: 'The .penpot file imports into a self-hosted Penpot 2.18.7 with 4 pages, 11 state boards on each wireframe page, 8 components, 16 colours, 5 typographies and all {tokenCount} tokens.', evidence: '/examples/ux-pathway/penpot-import-check.json' },
      'In Penpot View mode, a scripted browser clicked through all {transitionCount} transitions on both the low- and high-fidelity pages without an error.',
      'The file is generated from the same flow and tokens as the working example; the site’s tests rebuild it on every pipeline and fail if it differs from the published copy.',
      'Every text and control colour in the tokens meets its contrast ratio (4.5:1 for text, 3:1 for borders and focus), computed on every pipeline.',
      { text: 'The working example is driven through every state in the site’s browser tests, with axe checks for WCAG A and AA, reflow at 320 px, and keyboard and dialog focus.', evidence: '/examples/ux-pathway/qa-report.md' },
      { text: 'On every pipeline, CI reruns the flow script, redraws the sitemap, the journey and all {stateCount} low-fidelity screens as SVG, reruns its {flowCheckCount} checks ({flowChecksPassed} passed, {contrastPairCount} colour pairs among them), and fails if any file differs from the ones on this page.', evidence: '/examples/ux-pathway/generated/summary.md' },
      'The site’s browser tests click through all {transitionCount} transitions of the clickable prototype in low and in high fidelity, including the dialog, Escape and the browser’s Back button, with axe checks for WCAG A and AA, and check that its high-fidelity colours are the token values.',
      { text: 'On every pipeline, CI redraws the style guide, the component sheet ({componentCount} components) and {hifiScreenCount} high-fidelity screens, and audits all {hifiDrawingCount} drawings: {hifiDrawingsPassed} passed; lowest text contrast {minTextContrast}:1, lowest control boundary {minControlContrast}:1.', evidence: '/examples/ux-pathway/generated/fidelity-report.md' },
      'The site’s browser tests measure every line of text in the high-fidelity screens against the room it was laid out for, in the font the CI browser renders.',
    ],
    notVerified: [
      'Penpot cloud (penpot.app): the file was checked on a self-hosted instance only.',
      'Editing by a person: the checks open and click the file; nobody has redesigned it in Penpot yet.',
      'Export from Penpot to SVG, PDF or PNG.',
      'Opening the SVG drawings in Penpot or Figma: both vendors document SVG as a way to move designs between tools, but nobody has tried it with these files.',
      'A pixel comparison of the high-fidelity screens with Penpot or with the working page: unavailable, no such check exists yet.',
      'Text width in the brand font, Source Sans Pro: the CI browser has no copy of it, so the text-fit check measures a substitute font.',
      'Colour-vision simulation and a review by a designer: unavailable.',
      'Writing to Penpot through a plugin or the MCP server. Browser tests do not prove native write access.',
      'Figma: the file is Penpot-only and was not tried in Figma.',
      'Use by real learners or by people who use assistive technology: no usability sessions have been run.',
    ],
    professionalReview: { required: false, limit: 'Not required for this invented practice product, and none was done. The automated checks are not an accessibility audit, and nothing here is a conformance statement for a real product.' },
    armory: { stackRecipeIds: ['penpot-and-browser'], entryIds: [] },
    galleryEntryIds: ['pocket-invoice-penpot-file'],
    sourcesCheckedOn: '2026-11-21',
    trackingIssue: 91,
  },
  {
    id: 'bim',
    title: 'Architecture and BIM: from an IFC file to checked information',
    fieldIds: ['architecture-bim', 'construction'],
    pathway: '/katas/bim-pathway',
    kataIds: ['BIM-001', 'BIM-002', 'BIM-003', 'BIM-004', 'BIM-005', 'BIM-006', 'BIM-007', 'BIM-008'],
    randoriKataId: 'BIM-R01',
    specialistRandoriKataIds: ['BIM-R02'],
    foundationKataIds: ['PRACTICE-001', 'PRACTICE-002'],
    examples: { dir: '/examples/bim-pathway', readme: '/examples/bim-pathway/README.md' },
    inputs: [
      {
        name: 'wall-with-opening-and-window.ifc (IFC4)',
        path: '/examples/bim-pathway/wall-with-opening-and-window.ifc',
        source: 'https://github.com/buildingSMART/Certification-datasets/blob/80d976a9b193a26a8e928c3e79bff67af1de68a8/IFC%204.0.2.1%20%28IFC%204%20ADD2%20TC1%29/ISO%20Spec%20-%20ReferenceView_V1.2/wall-with-opening-and-window.ifc',
        terms: 'CC BY 4.0, © buildingSMART International Ltd.',
        sha256: '73b0e45d931d5dc13bfee5fdc7bd80f796526445458b2de74c4168d209097832',
      },
    ],
    checks: [
      {
        name: 'Inspection, property sets, IDS, schema and geometry on the original and the edited copy, the 3D mesh and its checks, the traced quantities and their cross-checks, the Randori cards, the coordination model with its clashes and BCF issue register, the planned model with its sequence and unpriced cost plan, the specialist Randori cards and the review package',
        ciJob: 'bim_pathway',
        runs: 'public/examples/bim-pathway/tools/bim_pathway.py',
        outputs: [
          '/examples/bim-pathway/generated/manifest.json',
          '/examples/bim-pathway/generated/summary.md',
          '/examples/bim-pathway/generated/wall-with-opening-and-window.edited.ifc',
          '/examples/bim-pathway/generated/mesh/wall-with-opening-and-window.obj',
          '/examples/bim-pathway/generated/mesh/mesh-checks.json',
          '/examples/bim-pathway/generated/quantities/quantities.csv',
          '/examples/bim-pathway/generated/quantities/quantities.json',
          '/examples/bim-pathway/generated/coordination/wall-with-opening-and-window.coordination.ifc',
          '/examples/bim-pathway/generated/coordination/clashes.json',
          '/examples/bim-pathway/generated/coordination/issues.bcf',
          '/examples/bim-pathway/generated/coordination/bcf-check.json',
          '/examples/bim-pathway/generated/planning/wall-with-opening-and-window.planned.ifc',
          '/examples/bim-pathway/generated/planning/schedule.json',
          '/examples/bim-pathway/generated/planning/cost-plan.json',
          '/examples/bim-pathway/generated/randori-coordination/cards.json',
          '/examples/bim-pathway/generated/review/review-package.json',
        ],
      },
    ],
    verified: [
      'The model is the pinned buildingSMART file, unchanged (SHA-256 {modelSha}…, checked by the site’s tests).',
      'Both IDS files open with XML schema validation on, as IDS 1.0.',
      { text: 'On every pipeline, CI installs the pinned packages by hash, reruns the inspection, property, IDS, schema and geometry checks on the original and the edited copy and the Randori cards, rebuilds the edited file, and fails if any output differs from the files on this page.', evidence: '/examples/bim-pathway/generated/summary.md' },
      { text: 'The edit changes one property and keeps every GlobalId.', evidence: '/examples/bim-pathway/generated/change.json' },
      { text: 'The {meshObjects} meshes in the OBJ are closed and consistently oriented, and each enclosed volume equals the volume IfcOpenShell reports, computed from the triangles alone.', evidence: '/examples/bim-pathway/generated/mesh/mesh-checks.json' },
      { text: 'A practice duct added to the edited copy clashes with the wall; IfcOpenShell’s clash tree and box arithmetic on the built shapes agree on every pair, and the script writes nothing if they do not.', evidence: '/examples/bim-pathway/generated/coordination/clashes.json' },
      { text: 'The issue register is written as BCF 3.0; every XML part is valid against buildingSMART’s official BCF-XML schema files, kept unchanged and proven by git blob id, and bcf-client reads the file back with every selected GlobalId found in the model.', evidence: '/examples/bim-pathway/generated/coordination/bcf-check.json' },
      { text: 'The planned IFC copy holds four tasks, each element assigned to the task that builds it, and finish-to-start dependencies each derived from a model relationship or an open issue; it is read back and matches what was written.', evidence: '/examples/bim-pathway/generated/planning/schedule.json' },
      { text: 'Every cost line cites a traced quantity, an element count or an open issue; no line is priced.', evidence: '/examples/bim-pathway/generated/planning/cost-plan.json' },
      { text: 'Each of the {quantityRows} quantities names its source entities, GlobalIds, unit, method and assumption; {crossChecks} cross-checks between the IFC parameters and the built geometry agree, and the script writes nothing if one does not.', evidence: '/examples/bim-pathway/generated/quantities/quantities.json' },
    ],
    notVerified: [
      'Any real building, design value or project requirement. The requirements are invented for practice, and the sample is a test file.',
      'EXPRESS where-rules and buildingSMART’s own validation service: the schema check ran with EXPRESS rules off.',
      'Coordination on a real, federated multi-discipline model: the only clash is with one practice duct added on purpose, and the box route holds only because every element is box-shaped.',
      'That any tool other than bcf-client reads the BCF files the same way: no BCF viewer or coordination tool was tested.',
      'Cost, procurement or construction quantities: the cost plan is unpriced, no unit rates are applied and no measurement rules of a contract are followed.',
      'A construction programme: the sequence has no durations, calendars or resources, and no scheduling tool was tested.',
      'Any review gate in the review package: none has been reviewed, and nothing is construction ready.',
      'Tolerances, structural behaviour or constructability of any shape.',
      'Viewing the OBJ in a 3D viewer: the mesh was checked from its triangles, not looked at.',
      'Opening the files in a BIM authoring tool or a web IFC viewer, and round trips through other tools.',
      'Use by real learners: no learner has run these katas yet.',
    ],
    professionalReview: { required: true, limit: 'None. Nothing here has professional, regulatory or construction approval of any kind, and a real project needs the qualified reviewers its contract and jurisdiction name.' },
    armory: { stackRecipeIds: ['ifcopenshell-and-python'], entryIds: ['ifcopenshell', 'ifctester'] },
    galleryEntryIds: ['bim-pathway-edited-model'],
    sourcesCheckedOn: '2026-11-21',
    trackingIssue: 92,
  },
  {
    id: 'agriculture',
    title: 'Agriculture: from a weather record to a checked irrigation estimate',
    fieldIds: ['agriculture'],
    pathway: '/katas/agriculture-pathway',
    kataIds: ['AGR-001', 'AGR-002', 'AGR-003'],
    randoriKataId: 'AGR-R01',
    foundationKataIds: ['PRACTICE-001', 'PRACTICE-002'],
    examples: { dir: '/examples/agriculture-pathway', readme: '/examples/agriculture-pathway/README.md' },
    inputs: [
      {
        name: 'Daily weather record, Fresno Yosemite International (GHCN-Daily USW00093193), 2023',
        path: '/examples/agriculture-pathway/inputs/noaa-ghcnd-USW00093193-2023.csv',
        source: 'https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&stations=USW00093193&startDate=2023-01-01&endDate=2023-12-31&dataTypes=PRCP,TMAX,TMIN&units=metric&format=csv&includeStationLocation=1&includeAttributes=true',
        terms: 'A US National Weather Service record from NOAA NCEI GHCN-Daily; works of the US federal government are not under copyright in the US (17 U.S.C. 105). NCEI asks for a citation and gives no warranty.',
        sha256: 'abde499065220574370762a23f9acc7a60b76c0951a02da95b770bc003b3b9a7',
      },
    ],
    checks: [
      {
        name: 'FAO worked examples, the record inspection, daily and monthly reference evapotranspiration, the maize irrigation estimate and the Randori cards',
        ciJob: 'agriculture_pathway',
        runs: 'public/examples/agriculture-pathway/tools/agri_pathway.py',
        outputs: [
          '/examples/agriculture-pathway/generated/reference-checks.json',
          '/examples/agriculture-pathway/generated/inspection.json',
          '/examples/agriculture-pathway/generated/et0-daily.csv',
          '/examples/agriculture-pathway/generated/et0-monthly.json',
          '/examples/agriculture-pathway/generated/irrigation.json',
          '/examples/agriculture-pathway/generated/randori/cards.json',
          '/examples/agriculture-pathway/generated/manifest.json',
          '/examples/agriculture-pathway/generated/summary.md',
        ],
      },
    ],
    verified: [
      'The weather record is the file NOAA’s data service returned for the query on this page, unchanged (SHA-256 {recordSha}…, checked by the site’s tests).',
      { text: 'The script reproduces {referenceChecks} published values from FAO’s own worked examples (FAO-56 Examples 8 and 18, and the effective-rainfall answers in FAO Training Manual 3) and refuses to write any result if one differs.', evidence: '/examples/agriculture-pathway/generated/reference-checks.json' },
      { text: 'The record has {days} days, {missing} missing temperature or rain values and {qualityFlags} quality flags, as the inspection counts them.', evidence: '/examples/agriculture-pathway/generated/inspection.json' },
      { text: 'On every pipeline, CI reruns the script with Python 3.12 and fails if any output differs from the files on this page.', evidence: '/examples/agriculture-pathway/generated/summary.md' },
    ],
    notVerified: [
      'Measured evapotranspiration. Humidity, radiation and wind are estimated from temperature as FAO-56 describes for missing data; no station that measures them was compared.',
      'Any real field, soil, irrigation system or crop. The crop coefficients and stage lengths are FAO’s general table values, not adjusted for this climate, and nothing here was grown.',
      'Soil water balance, irrigation efficiency, leaching, salinity and rainfall runoff: the estimate is the net crop water need only.',
      'Whether the station record is homogeneous: NOAA says GHCN-Daily is not homogenized and was not managed to climate-monitoring standards.',
      'Use by real learners: no learner has run these katas yet.',
    ],
    professionalReview: { required: true, limit: 'None. Nothing here is an irrigation recommendation or has been reviewed by an agronomist, irrigation engineer or water authority; real water use needs the qualified people and local rules that apply to it.' },
    armory: { stackRecipeIds: ['python-standard-library'], entryIds: [] },
    galleryEntryIds: ['agriculture-irrigation-estimate'],
    sourcesCheckedOn: '2026-11-21',
    trackingIssue: 93,
  },
  {
    id: 'science',
    title: 'Science and research: from a published record to a result with its uncertainty',
    fieldIds: ['science'],
    pathway: '/katas/science-pathway',
    kataIds: ['SCI-001', 'SCI-002', 'SCI-003'],
    randoriKataId: 'SCI-R01',
    foundationKataIds: ['PRACTICE-001', 'PRACTICE-002'],
    examples: { dir: '/examples/science-pathway', readme: '/examples/science-pathway/README.md' },
    inputs: [
      {
        name: 'GISTEMP v4 global land-ocean temperature anomalies (GLB.Ts+dSST.csv), NASA GISS',
        path: '/examples/science-pathway/inputs/gistemp-v4-global-land-ocean.csv',
        source: 'https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv',
        terms: 'NASA material, generally not subject to copyright in the US (17 U.S.C. 105). Cited as GISS asks, with NASA credited as the source and no NASA endorsement implied. GISS revises the record monthly; this copy is pinned by its hash.',
        sha256: 'a7b1939db2e7e484c798e925e0f07f8184356c52ac0e7ce264adcd0f25e81253',
      },
    ],
    checks: [
      {
        name: 'The GUM worked examples (Annex H.2 and H.3), the record inspection, the uncertainty budget, the least-squares line and the Randori cards',
        ciJob: 'science_pathway',
        runs: 'public/examples/science-pathway/tools/science_pathway.py',
        outputs: [
          '/examples/science-pathway/generated/reference-checks.json',
          '/examples/science-pathway/generated/inspection.json',
          '/examples/science-pathway/generated/uncertainty-budget.json',
          '/examples/science-pathway/generated/uncertainty-budget.csv',
          '/examples/science-pathway/generated/trend.json',
          '/examples/science-pathway/generated/trend-residuals.csv',
          '/examples/science-pathway/generated/randori/cards.json',
          '/examples/science-pathway/generated/manifest.json',
          '/examples/science-pathway/generated/summary.md',
        ],
      },
    ],
    verified: [
      'The temperature record is the file NASA served on the date retrieved, unchanged (SHA-256 {recordSha}…, checked by the site’s tests).',
      { text: 'The script reproduces {referenceChecks} published values from the GUM’s worked examples (Annex H.2, Tables H.2 to H.5, and Annex H.3, Table H.6) and refuses to write any result if one differs.', evidence: '/examples/science-pathway/generated/reference-checks.json' },
      { text: 'The record has {years} years and {missingCells} unavailable cells, each read as unavailable and never as zero; in {sameAtTwoDecimals} of {yearsCompared} complete years the published annual mean equals the mean of its months at two decimals.', evidence: '/examples/science-pathway/generated/inspection.json' },
      { text: 'On every pipeline, CI reruns the script with Python 3.12 and fails if any output differs from the files on this page.', evidence: '/examples/science-pathway/generated/summary.md' },
    ],
    notVerified: [
      'The uncertainty of the record itself. GISS evaluates it separately; this pathway neither reproduces nor checks it.',
      'Whether the residuals of the line are independent. Their lag-1 autocorrelation is reported (0.19 for the annual fit, 0.61 for the monthly one on Randori card B), but no test is run and no autocorrelation-corrected uncertainty is computed.',
      'Any real measurement, instrument or calibration. The GUM’s Annex H data are illustrative, and nothing here is a calibration certificate or a statement of traceability.',
      'GISTEMP’s own method: the station and sea-surface processing behind the record is not rerun.',
      'Use by real learners: no learner has run these katas yet.',
    ],
    professionalReview: { required: true, limit: 'None. No metrologist, statistician or climate scientist has reviewed this pathway; a real measurement result, calibration or published finding needs the qualified reviewers its laboratory, journal or accreditation body names.' },
    armory: { stackRecipeIds: ['python-standard-library'], entryIds: [] },
    galleryEntryIds: ['science-trend-with-uncertainty'],
    sourcesCheckedOn: '2026-11-21',
    trackingIssue: 93,
  },
];

/** The packs, validated for shape. Cross-references are checked by the build and the tests. */
export const sectorPacks: SectorPack[] = sectorPackInputs.map((input) => sectorPackSchema.parse(input));

export function sectorPack(id: string): SectorPack {
  const pack = sectorPacks.find((candidate) => candidate.id === id);
  if (!pack) throw new Error('No sector pack ' + id + ' in src/data/sector-packs.ts');
  return pack;
}

export { checkSectorPacks };
