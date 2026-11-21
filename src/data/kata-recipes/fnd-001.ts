import type { KataMetadataInput } from '../../lib/kata-schema';

/**
 * FND-001: the first operational harness-stack kata (#84). Status: Draft (see docs/kata-taxonomy.md).
 * The maintainer role and the last-verified record are kept on the tracking issue, #84.
 *
 * This file is content and evidence only. It has two parts:
 *   - metadata: a #81 kata record (src/lib/kata-schema.ts), validated with the real registries plus
 *     fnd001Dimensions in tests/fnd-001-record.test.ts;
 *   - recipe: the operational sections #86 renders. #81 has no schema for these yet. The gap is
 *     written up on #81, and this shape is the worked example for that contract.
 *
 * Every number here comes from a file under public/examples/fnd-001/. tests/fnd-001-record.test.ts
 * recomputes the numbers from those files, and e2e/fnd-001-evidence.spec.ts re-runs the browser checks
 * in CI. A comparison is "verified" only when its runs exist and were checked. Every other variant
 * is "proposed" (designed, not run) and has no results.
 */

/** Vocabulary FND-001 adds to the editorial registries (kataDimensions in src/data/kata-catalog.ts). */
export const fnd001Dimensions = {
  outcomes: ['stack-comparison'],
  capabilities: ['compare-stacks'],
  stackRecipes: ['claude-code-print-no-tools'],
} as const;

export const fnd001Metadata = {
  id: 'FND-001',
  title: 'Build a working prototype, then change one stack variable',
  layer: 'foundation',
  professionalReviewRequired: false,
  outcomeIds: ['stack-comparison'],
  artifactTypes: ['prototype', 'comparison-record'],
  capabilityIds: ['verify-evidence', 'compare-stacks'],
  stackRecipeIds: ['assistant-and-browser', 'claude-code-print-no-tools'],
  pathwayIds: ['working-with-ai-agents'],
  constraintIds: ['fictional-data', 'no-personal-data'],
  externalResources: ['anthropic/claude-code-headless', 'anthropic/claude-code-settings', 'anthropic/claude-code-costs', 'anthropic/define-success-criteria', 'anthropic/demystifying-evals', 'w3c/wcag-quickref'],
  standards: [{
    name: 'Web Content Accessibility Guidelines (WCAG)',
    version: '2.2',
    applicability: 'The single-file practice prototype the learner\'s stack produces.',
    reviewScope: 'Only what the checker tests: axe rules tagged WCAG A and AA (serious and critical results), visible keyboard focus and an exposed pressed state. No conformance claim for the prototype or any product.',
    sourceResourceId: 'w3c/wcag-quickref',
  }],
  verificationEvidence: [
    { description: 'Every response is checked by an independent browser checker (scripts/fnd-001/check-pocket-garden.mjs) that never reads the model\'s own checklist. CI re-runs it on the stored responses and fails if a recorded result changes.', method: 'automated-check', standards: ['Web Content Accessibility Guidelines (WCAG)'] },
    { description: 'The learner records harness, model, versions, settings, every check result, time and cost (or "not shown") for each run, before reading the other run.', method: 'self-check' },
    { description: 'A second person reads the learner\'s record and repeats at least two checks on the saved HTML.', method: 'peer-review' },
  ],
  beltCriteria: [
    { stage: 'practice', criterion: 'Runs the smoke test and the baseline, records harness, model and versions (or "not shown"), and scores the saved HTML against every rubric check.' },
    { stage: 'adapt', criterion: 'Changes exactly one variable, keeps the rest as stable as the tools allow, repeats each arm at least three times and names the confounders it could not remove.' },
    { stage: 'demonstrate', criterion: 'Completes the unseen transfer challenge: writes the observable checks before prompting, runs a controlled comparison and reports failures and corrections without overstating the result.' },
  ],
  crossFieldTransfers: ['ux', 'media', '3d', 'architecture-bim', 'data'],
} as const satisfies KataMetadataInput;

/** A recorded run: a file under public/examples/fnd-001/runs/ (without .json). */
type RunId = string;

type CheckDefinition = { id: string; checks: string; failsWhen: string };

type ComparisonRow =
  | {
      status: 'verified';
      variable: string;
      change: string;
      heldConstant: string;
      confounders: string[];
      runs: { control: RunId[]; variant: RunId[] };
      result: { control: ArmResult; variant: ArmResult };
      reading: string;
    }
  | {
      status: 'proposed';
      variable: string;
      change: string;
      heldConstant: string;
      confounders: string[];
      whyNotRun: string;
    };

type ArmResult = { runsPassingAll: number; runs: number; checksPassed: number; checksAttempted: number; meanSeconds: number; costUsd: number };

export const fnd001Recipe = {
  outcome: {
    summary: 'A working single-file web prototype (Pocket Garden), built by an AI assistant from a fixed brief, plus a comparison record showing what changed when exactly one stack variable changed.',
    finishedArtifact: { href: '/examples/pocket-garden.html', description: 'The Dojo\'s working reference. It passes all 14 checks below (public/examples/fnd-001/results.json, "reference").' },
    provenance: 'The reference and the brief come from the Dojo\'s "Make a clickable prototype" kata (/katas/first-prototype, added 2026-11-06 in commit 4ba0772) and the stack workbench (/katas/stack-workbench, !124). The reference was made with AI assistance; the harness and model that made it were not recorded. It is a target, not a result of the comparison below.',
  },
  sourceExercise: {
    title: 'Make a clickable prototype (Pocket Garden)',
    href: '/katas/first-prototype',
    rightsAndTerms: 'Brief and reference are part of this repository, under its MIT License (LICENSE; copy at /examples/pocket-garden-license.txt). The plant data is fictional. Running the comparison needs your own access to an assistant: provider accounts, usage limits and terms apply, and none are granted by the Dojo.',
  },
  brief: {
    inputs: ['The task brief (prompt A, /examples/fnd-001/prompts/A.txt). It is the same text as prompt A on /katas/stack-workbench.', 'No files, data or context beyond the prompt.'],
    constraints: ['One HTML file with inline CSS and JavaScript; no external libraries, images, fonts, network requests or server.', 'Fictional data only; no personal data in prompts or records.', 'The assistant may not read or change files or run commands.'],
    artifacts: ['The complete HTML in one code block.', 'A short checklist from the assistant (not used as evidence).', 'The learner\'s comparison record.'],
  },
  baselineStack: {
    harness: 'Claude Code 2.1.329, print mode (claude -p)',
    model: 'claude-sonnet-5-5, effort high',
    instructions: 'Prompt A only. The default Claude Code system prompt; no CLAUDE.md, memory, settings files, output style or appended system prompt (--setting-sources "").',
    context: 'A fresh, empty working folder per run; no saved session (--no-session-persistence). The CLI still adds its own environment notes, such as the date and the signed-in account.',
    skillsAndIntegrations: 'None. No MCP servers (--strict-mcp-config) and no built-in tools (--tools ""), so the model cannot read files, run code or test its answer.',
    permissions: 'No tools, so no file, shell or network access for the model. The process environment is cleared except HOME, PATH and CLAUDE_CONFIG_DIR (scripts/fnd-001/run-comparison.sh).',
    cost: 'Measured per run by the CLI (total_cost_usd), at list prices ("costBasis": "list"). A subscription or enterprise plan bills differently; this is not an invoice.',
  },
  stackRationale: {
    why: 'Print mode with no tools and no inherited configuration is the smallest stack a learner can rebuild exactly. It removes the hidden variables (memory, skills, MCP servers, project instructions) that make two chat sessions hard to compare.',
    alternatives: [
      'Phone or browser chat app (the starting path on /katas/stack-workbench): easiest to reach, but versions, hidden settings and cost are usually not shown.',
      'Interactive CLI session with tools: the agent could open and test its own file, which changes what is being compared (see the proposed MCP/CLI row).',
      'Another trusted CLI harness: valid, but do not mix harnesses inside one comparison.',
    ],
  },
  agentRoles: {
    roles: [
      { role: 'Builder', who: 'One assistant session per run', responsibility: 'Writes the complete HTML from the prompt.' },
      { role: 'Checker', who: 'scripts/fnd-001/check-pocket-garden.mjs (deterministic, no model)', responsibility: 'Loads the HTML in Chromium and runs the 14 checks. It never reads the builder\'s checklist.' },
      { role: 'Reviewer', who: 'The learner (and optionally a peer)', responsibility: 'Reads the results, decides whether a difference is real and records confounders.' },
    ],
    reviewGates: ['No result counts until the checker has run on the saved HTML.', 'A failure goes back to a fresh builder session with the checker\'s observations, and the corrected file is checked again.'],
    dependencies: 'The checker depends only on the saved HTML. The builder never sees the checker\'s code or another arm\'s output.',
  },
  setup: {
    phone: 'Open any assistant you can use. Start a fresh chat, paste prompt A, save the complete answer and paste the HTML into the preview on /katas/stack-workbench. Record versions and cost as "not shown" if the app hides them.',
    cli: [
      'Install Claude Code from the official quickstart (https://code.claude.com/docs/en/quickstart) and sign in. Check your plan and the cost guidance first.',
      'Install jq and Node.js 22 or later, clone this repository and run npm ci (installs the Playwright and axe versions the checker uses; then npx playwright install chromium).',
      'Run scripts/fnd-001/run-comparison.sh, then node scripts/fnd-001/check-pocket-garden.mjs, then scripts/fnd-001/run-comparison.sh --correct and the checker again.',
    ],
    smokeTest: [
      'claude --version prints a version.',
      'REPS=1 scripts/fnd-001/run-comparison.sh writes runs/baseline-r1.json, runs/instructions-r1.json and runs/model-r1.json with "isError": false. Delete the shipped runs first, or use a copy of the folder.',
      'node scripts/fnd-001/check-pocket-garden.mjs prints "reference: 14/14". If the reference does not pass, fix your checker setup before reading any run.',
    ],
  },
  prompts: [
    { id: 'A', name: 'Task brief (baseline)', href: '/examples/fnd-001/prompts/A.txt' },
    { id: 'B', name: 'Task brief plus a self-review request (instructions variant)', href: '/examples/fnd-001/prompts/B.txt' },
    { id: 'correction', name: 'Correction prompt: the run\'s own HTML plus the checker\'s observations', href: '/examples/fnd-001/prompts/correction-baseline-r2.txt' },
  ],
  execution: {
    runner: 'scripts/fnd-001/run-comparison.sh',
    date: '2026-11-20',
    design: 'Three arms, three repetitions each. Repetition r of every arm started at the same moment, so time of day and service load fell on all arms alike. Each run was a new process in a new empty folder.',
    handoffs: 'Builder output (runs/<run>.json) goes to the checker, which saves the extracted HTML (runs/<run>.html) and results.json. Failed runs go to one correction round (runs/<run>-fix.json), which is checked again.',
  },
  rubric: [
    { id: 'single-html-block', checks: 'The response holds exactly one complete HTML code block.', failsWhen: 'No block, or several.' },
    { id: 'no-external-requests', checks: 'No request leaves the page at load, and the file has no network code or remote asset.', failsWhen: 'Any request, or fetch/XHR/remote src or href in the file.' },
    { id: 'three-cards', checks: 'Basil, Sunflower and Mint are visible on load.', failsWhen: 'A plant is missing or hidden.' },
    { id: 'sun-filter', checks: '"Loves sun" shows Basil and Sunflower only.', failsWhen: 'Mint shows, a sun plant hides, or the control is missing.' },
    { id: 'shade-filter', checks: '"Likes shade" shows Mint only.', failsWhen: 'A sun plant shows, Mint hides, or the control is missing.' },
    { id: 'all-filter', checks: '"All plants" shows all three again.', failsWhen: 'Any plant stays hidden.' },
    { id: 'toggle-both-ways', checks: 'A "Mark as planted" button becomes "Planted" and switches back.', failsWhen: 'The label does not change both ways.' },
    { id: 'pressed-state', checks: 'The plant button exposes its state to assistive technology (aria-pressed true, then false).', failsWhen: 'No aria-pressed, or it does not follow the state.' },
    { id: 'reload-resets', checks: 'After a reload, all three buttons say "Mark as planted" again.', failsWhen: 'A choice survives the reload.' },
    { id: 'reset-note', checks: 'The page tells the user that choices reset on reload.', failsWhen: 'No visible note.' },
    { id: 'visible-keyboard-focus', checks: 'The first button reached with Tab has a visible outline or focus shadow.', failsWhen: 'No visible focus style.' },
    { id: 'no-horizontal-scroll-390', checks: 'At a 390 px wide viewport the page does not scroll sideways.', failsWhen: 'The page is wider than the viewport.' },
    { id: 'axe-serious', checks: 'axe finds no serious or critical WCAG A/AA rule violation.', failsWhen: 'Any serious or critical violation.' },
    { id: 'no-test-claim', checks: 'The prose outside the code does not claim the assistant ran or tested the file (heuristic; read the matches).', failsWhen: 'An unqualified "I tested", "I ran" or "I verified".' },
  ] satisfies CheckDefinition[],
  comparisonMatrix: [
    {
      status: 'verified',
      variable: 'Instructions',
      change: 'Prompt B: prompt A plus a request to compare the draft against the brief and list uncertainty.',
      heldConstant: 'Harness, version, model, effort, flags, empty context, no tools, start time.',
      confounders: ['Sampling: the same prompt gives different files on each run.', 'Three runs per arm cannot detect a small effect.', 'The self-review is unobservable: we see only the final file.'],
      runs: { control: ['baseline-r1', 'baseline-r2', 'baseline-r3'], variant: ['instructions-r1', 'instructions-r2', 'instructions-r3'] },
      result: {
        control: { runsPassingAll: 2, runs: 3, checksPassed: 41, checksAttempted: 42, meanSeconds: 29.1, costUsd: 0.166 },
        variant: { runsPassingAll: 1, runs: 3, checksPassed: 40, checksAttempted: 42, meanSeconds: 30.7, costUsd: 0.1649 },
      },
      reading: 'No improvement was seen. Every failure in both arms was the same check (pressed-state). One failure out of three runs against two out of three is well within run-to-run variation, so this does not show that self-review makes results worse either.',
    },
    {
      status: 'verified',
      variable: 'Model',
      change: 'claude-haiku-5-5 instead of claude-sonnet-5-5, with prompt A.',
      heldConstant: 'Harness, version, prompt A, effort, flags, empty context, no tools, start time.',
      confounders: ['Sampling, as above.', 'Effort "high" may not mean the same amount of reasoning on both models.', 'The rubric tests a small, well-known task; it says nothing about harder work.'],
      runs: { control: ['baseline-r1', 'baseline-r2', 'baseline-r3'], variant: ['model-r1', 'model-r2', 'model-r3'] },
      result: {
        control: { runsPassingAll: 2, runs: 3, checksPassed: 41, checksAttempted: 42, meanSeconds: 29.1, costUsd: 0.166 },
        variant: { runsPassingAll: 3, runs: 3, checksPassed: 42, checksAttempted: 42, meanSeconds: 29.9, costUsd: 0.0142 },
      },
      reading: 'On this task and rubric the smaller model did as well (3 of 3 runs passed every check) at about a twelfth of the list cost, in about the same time. It wrote more output tokens (mean 8,164 against 4,545). Three runs on one small task are not a benchmark.',
    },
    {
      status: 'proposed',
      variable: 'Harness',
      change: 'Same prompt and model in another harness: a phone or browser chat app, or another CLI.',
      heldConstant: 'Prompt A, model where the app lets you choose it, fresh session, no attachments.',
      confounders: ['Apps add their own system prompts, memory and tools, often hidden.', 'Model version and cost are often not shown.'],
      whyNotRun: 'Not run for the Dojo: a chat app run cannot be recorded with versions and cost the way the CLI run is. Learners can run it with the phone path and record "not shown" honestly.',
    },
    {
      status: 'proposed',
      variable: 'A reviewed skill',
      change: 'Add one reviewed skill, for example an accessibility checklist for toggle buttons, to the baseline session.',
      heldConstant: 'Harness, model, prompt A, flags otherwise unchanged.',
      confounders: ['The skill must be reviewed and pinned by version; an unreviewed skill is untrusted context.', 'A skill targeted at the known failure (pressed-state) would overfit this rubric; test it on the transfer challenge too.'],
      whyNotRun: 'Not run: no skill has been reviewed for the Dojo yet.',
    },
    {
      status: 'proposed',
      variable: 'An authorized tool (MCP server, CLI, API or plugin)',
      change: 'Let the builder open its own file in a browser, for example with an authorized Playwright MCP server, before answering.',
      heldConstant: 'Harness, model, prompt A, empty context; only the tool permission changes.',
      confounders: ['The agent then tests its own work, which can mask the independent check; keep the checker separate.', 'More turns, time and cost: measure them.', 'Needs an explicit, reviewed permission set.'],
      whyNotRun: 'Not run: no browser tool has been authorized and reviewed for this exercise.',
    },
    {
      status: 'proposed',
      variable: 'Single agent against specialist delegation',
      change: 'A builder agent and a separate reviewer agent that reads the brief and the file and sends back findings once.',
      heldConstant: 'Harness, model and prompt A for the builder.',
      confounders: ['Delegation adds a correction round; compare it with a single agent that gets one correction round too (see the corrections below).', 'Justify the specialist: on a three-card page the extra role may cost more than it finds.'],
      whyNotRun: 'Not run for this record. /katas/delegate-and-review teaches the pattern by hand.',
    },
  ] satisfies ComparisonRow[],
  failuresAndCorrections: {
    failures: 'Three of nine runs (baseline-r2, instructions-r1, instructions-r3) failed one check, pressed-state: the plant buttons changed their label but exposed no aria-pressed. The filter buttons in the same files did use aria-pressed. No other check failed in any run.',
    corrections: 'Each failed file went to one fresh session with its HTML and the checker\'s observation (runs/<run>-fix.json). All three corrected files passed all 14 checks. The three corrections cost $0.1582 together, at list prices.',
    note: 'The brief asks for both a changing label and a pressed state. The WAI-ARIA Authoring Practices button pattern (https://www.w3.org/WAI/ARIA/apg/patterns/button/) advises that a toggle button\'s label should not change when its state changes, so the brief itself is a reasonable thing to question in the reflection.',
  },
  measurements: {
    time: 'Wall-clock duration of each CLI process (durationMs), 26.5 s to 34.7 s per first run, 14.4 s to 16.5 s per correction.',
    cost: 'All 12 runs together: $0.5033 at list prices, as reported by the CLI. Billing on a subscription differs and was not measured.',
    uncertainty: 'Three repetitions per arm, one task, one date and one harness version. Read the differences as observations to repeat, not as effects.',
  },
  transferChallenge: {
    status: 'proposed',
    brief: 'Unseen challenge: a one-file "Tool Library" page lists five shared tools (two power tools, three hand tools), filters by type, and lets the user mark a tool "Borrowed" and back. A borrowed tool shows who has it, using a name typed into a field that must have a visible label.',
    task: 'Before prompting, write your own observable checks (at least eight), then adapt the checker or check by hand. Compare one variable you have not changed before, three runs per arm, and record failures and corrections.',
    notes: 'Not run by the Dojo. It changes the data, adds a form field and an extra state, so a stack tuned to Pocket Garden can fail it.',
  },
  crossDomainIllustrations: [
    { context: 'Visual or document', example: 'Generate a one-page event poster from a fixed brief and check, with written criteria, the text, contrast ratio and print size; change only the model.', status: 'proposed' },
    { context: '3D or BIM', example: 'Ask an assistant to list the walls and their types from the buildingSMART sample IFC file used on /katas/inspect-ifc, check the list against the file, and change only the instructions.', status: 'proposed' },
    { context: 'Software', example: 'This record: a single-file web prototype with a browser checker.', status: 'verified' },
  ],
  maintenance: {
    reviewWhen: ['Claude Code changes major version or its print-mode flags change.', 'A model named here is retired or renamed.', 'A rubric check stops passing on the reference file.', 'A learner reports a different result from the smoke test.'],
    staleCaveats: 'Model behaviour, prices and CLI flags change. These results are from 2026-11-20 with Claude Code 2.1.329; re-run before relying on them.',
  },
} as const;
