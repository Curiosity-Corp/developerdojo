/**
 * Vocabulary used only by FIXTURE kata records (#81, #86): the synthetic sector fixtures in
 * tests/fixtures/kata-sectors.ts and the fixture recipe pages in src/content/kata-recipes/fixture-*.yaml.
 *
 * It lives in src/ because the site renders a few fixtures as labelled examples of the recipe template.
 * A real (non-fixture) kata may not use an ID that exists only here: src/lib/kata-recipes.ts rejects it.
 * To use one of these IDs in a real kata, add it to kataDimensions in src/data/kata-catalog.ts first.
 */

/**
 * Stack recipes the fixtures name. `candidate` marks an integration nobody has run for the Dojo: it
 * names a documented product interface and nothing more. `practice` marks a local or simulated setup
 * that existing Dojo material already teaches.
 */
export const fixtureStackRecipes = [
  { id: 'browser-prototype', status: 'practice', note: 'HTML prototype in a browser' },
  { id: 'penpot-design-file', status: 'practice', note: 'Penpot prototype file (penpot/prototyping)' },
  { id: 'figma-mcp-candidate', status: 'candidate', note: 'Figma design context through an MCP server; not run for the Dojo' },
  { id: 'ifcopenshell-python', status: 'practice', note: 'Python reading an IFC file, as /katas/inspect-ifc' },
  { id: 'speckle-candidate', status: 'candidate', note: 'Speckle model exchange; not run for the Dojo' },
  { id: 'opentrons-simulate', status: 'practice', note: 'opentrons_simulate on a protocol, as the lab-automation-in-code track' },
  { id: 'elabftw-candidate', status: 'candidate', note: 'eLabFTW API for an electronic lab notebook; not run for the Dojo' },
  { id: 'nextflow-local', status: 'practice', note: 'Nextflow pipeline on a laptop, as the bioinformatics track' },
  { id: 'galaxy-candidate', status: 'candidate', note: 'Galaxy workflow on a public server; not run for the Dojo' },
  { id: 'ros2-gazebo-sim', status: 'practice', note: 'ROS 2 with Gazebo in simulation, as the robot-software track' },
  { id: 'moveit-sim', status: 'practice', note: 'MoveIt Task Constructor in simulation, as the robot-software track' },
  { id: 'spreadsheet-and-assistant', status: 'practice', note: 'Spreadsheet plus an AI assistant, as /katas/data-rescue' },
  { id: 'python-pandas', status: 'practice', note: 'Python and pandas in a notebook' },
  { id: 'quickbooks-sandbox-candidate', status: 'candidate', note: 'QuickBooks Online sandbox through its OAuth API; not run for the Dojo' },
] as const;

/** A field added as reference data only: nothing in src/lib/fields.ts changes for it. */
export const newField = { id: 'maritime', name: 'Maritime and ports', examples: 'Vessel schedules, port calls, cargo records and berth planning.' };

/** Fixture vocabulary, added the same way an editor extends kataDimensions in src/data/kata-catalog.ts. */
export const fixtureDimensions = {
  outcomes: ['acceptance-brief', 'stack-comparison', 'source-clearance', 'usable-onboarding', 'usability-evidence', 'quantity-takeoff',
    'traceable-batch-record', 'variant-report', 'cell-cycle-evidence', 'field-data-report', 'reconciled-ledger', 'port-call-check'],
  artifacts: ['acceptance-brief', 'comparison-matrix', 'provenance-record', 'interactive-prototype', 'usability-findings', 'quantity-schedule',
    'batch-record', 'pipeline-report', 'simulation-log', 'cleaned-dataset', 'reconciliation-report', 'schedule-check'],
  capabilities: ['define-acceptance', 'compare-stacks', 'check-provenance', 'test-usability', 'automate-protocol', 'build-pipeline',
    'simulate-robot', 'reconcile-records'],
  constraints: ['simulation-only', 'public-reference-data-only', 'keyboard-only'],
} as const;
