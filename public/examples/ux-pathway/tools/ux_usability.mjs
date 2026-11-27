/**
 * UX-008 (#91): the usability walkthrough of a flow. Called by ux_pathway.mjs; Node standard library only.
 *
 * For each task in inputs/usability-tasks.json (a scenario, a start state, a goal state, an optional state the task
 * must pass through, and the most clicks the team accepts), it finds the shortest path through the flow and checks:
 *   - the task's states exist and the goal can be reached;
 *   - the shortest path is within the task's step budget;
 *   - every step is a button the user can see on that screen, not a prototype-only link;
 *   - every error the user can hit on the way still leads to the goal, and how many steps that recovery takes. An error
 *     that does not is a failure, unless the task records it as an accepted finding with a decision (acceptedFindings);
 *     an accepted finding that no longer happens fails too.
 *
 * Writes usability/tasks.json (the result), usability/walkthrough.md (the same as a table) and
 * usability/session-sheet.md (a blank sheet for a moderated session with a person). The browser tests replay each
 * path in the clickable prototype at phone, desktop and 320 px widths (e2e/ux-usability.spec.ts).
 *
 * This is a walkthrough of what the design allows, not a usability test: it says nothing about what people do.
 */

function numbered(flow) {
  return flow.transitions.map((t, i) => ({ ...t, n: i + 1 }));
}

/** Shortest path by number of transitions; ties go to the lower transition numbers, so the result is stable. */
export function shortestPath(flow, from, to) {
  if (from === to) return [];
  const edges = numbered(flow);
  const previous = new Map([[from, null]]);
  const queue = [from];
  while (queue.length) {
    const here = queue.shift();
    for (const t of edges.filter((edge) => edge.from === here)) {
      if (previous.has(t.to)) continue;
      previous.set(t.to, t);
      if (t.to === to) {
        const path = [];
        for (let step = t; step; step = previous.get(step.from)) path.unshift(step);
        return path;
      }
      queue.push(t.to);
    }
  }
  return null;
}

function buttonFor(flow, transition) {
  const state = flow.states.find((s) => s.id === transition.from);
  return state?.elements.find((e) => e.type === 'button' && e.to === transition.to) ?? null;
}

function check(id, description, failures) {
  return { id, description, pass: failures.length === 0, failures };
}

/** Walks one task through the flow. Pure. */
export function walkTask(flow, task) {
  const ids = new Set(flow.states.map((s) => s.id));
  const kind = Object.fromEntries(flow.states.map((s) => [s.id, s.kind]));
  const title = Object.fromEntries(flow.states.map((s) => [s.id, s.title]));
  const missing = [task.start, task.goal, ...(task.via ? [task.via] : [])].filter((id) => !ids.has(id));
  const checks = [check('states-exist', 'The task starts, passes and ends at states in the flow.', missing.map((id) => 'no state ' + id))];
  let path = null;
  if (missing.length === 0) {
    if (task.via) {
      const first = shortestPath(flow, task.start, task.via);
      const second = first && shortestPath(flow, task.via, task.goal);
      path = first && second ? [...first, ...second] : null;
    } else {
      path = shortestPath(flow, task.start, task.goal);
    }
  }
  checks.push(check('goal-reachable', 'The goal can be reached from the start' + (task.via ? ' through ' + task.via : '') + '.', missing.length === 0 && !path ? [task.goal] : []));
  const steps = path ? path.map((t) => {
    const button = buttonFor(flow, t);
    return { n: t.n, from: t.from, to: t.to, kind: t.kind, control: button ? button.label : null, variant: button ? button.variant : null, trigger: t.trigger };
  }) : [];
  checks.push(check('within-budget', 'The shortest path takes no more than ' + task.maxSteps + ' steps.', path && path.length > task.maxSteps ? [path.length + ' steps'] : []));
  checks.push(check('steps-are-buttons', 'Every step is a button on the screen, not a link that only the prototype has.', steps.filter((s) => !s.control).map((s) => 'transition ' + s.n)));
  const recoveries = [];
  const stranded = [];
  if (path) {
    const visited = [task.start, ...path.map((t) => t.to)];
    for (const state of new Set(visited)) {
      if (state === task.goal && visited.indexOf(state) === visited.length - 1) continue;
      for (const t of numbered(flow).filter((edge) => edge.from === state && kind[edge.to] === 'error')) {
        const back = shortestPath(flow, t.to, task.goal);
        if (!back) stranded.push(t.to + ' (transition ' + t.n + ')');
        else recoveries.push({ error: t.to, via: t.n, steps: back.length, path: back.map((edge) => edge.n) });
      }
    }
  }
  // A problem the team has seen and decided about is a finding, not a failure; the decision must name the exact item,
  // and an accepted finding that no longer happens fails, so the record cannot go stale.
  const accepted = (task.acceptedFindings ?? []).filter((f) => f.check === 'errors-lead-to-goal');
  const findings = accepted.filter((f) => stranded.includes(f.item)).map((f) => ({ check: f.check, item: f.item, decision: f.decision }));
  const stale = accepted.filter((f) => !stranded.includes(f.item)).map((f) => 'accepted finding no longer happens: ' + f.item);
  checks.push(check('errors-lead-to-goal', 'Every error the user can hit on the way still leads to the goal, or is a finding with a recorded decision.', [...stranded.filter((item) => !accepted.some((f) => f.item === item)), ...stale]));
  return {
    id: task.id,
    scenario: task.scenario,
    observe: task.observe,
    start: task.start,
    startTitle: title[task.start] ?? null,
    goal: task.goal,
    goalTitle: title[task.goal] ?? null,
    ...(task.via ? { via: task.via } : {}),
    maxSteps: task.maxSteps,
    steps,
    stepCount: path ? path.length : null,
    recoveries,
    findings,
    pass: checks.every((c) => c.pass),
    checks,
  };
}

function cell(value) {
  return String(value).replaceAll('|', '\\|');
}

function walkthroughMd(product, result) {
  const lines = [
    '# ' + product + ': usability walkthrough (UX-008)',
    '',
    'Generated by tools/ux_usability.mjs from inputs/usability-tasks.json and inputs/pocket-invoice-flow.json. Do not edit: change an input and rerun tools/ux_pathway.mjs.',
    '',
    result.pass ? 'Result: all ' + result.tasks.length + ' tasks passed every check.' : 'Result: ' + result.tasks.filter((t) => !t.pass).length + ' of ' + result.tasks.length + ' tasks failed a check.',
    '',
    'For each task: the shortest path the design allows, whether it fits the step budget, whether every step is a visible button, and how far each error on the way is from the goal. The site’s browser tests click the same path in the clickable prototype at 1440 px, 390 px and 320 px.',
    '',
    '| Task | Scenario | From | To | Steps (budget) | Path | Errors on the way | Result |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...result.tasks.map((t) => '| ' + [
      t.id,
      t.scenario,
      t.startTitle ?? t.start,
      t.goalTitle ?? t.goal,
      (t.stepCount ?? 'unreachable') + ' (' + t.maxSteps + ')',
      t.steps.map((s) => s.n + ' ' + (s.control ?? s.trigger)).join(' → ') || 'none',
      [...t.recoveries.map((r) => r.error + ': ' + r.steps + ' back'), ...t.findings.map((f) => f.item + ': no way to the goal (finding)')].join('; ') || 'none',
      t.pass ? 'passed' : 'failed: ' + t.checks.filter((c) => !c.pass).map((c) => c.id).join(', '),
    ].map(cell).join(' | ') + ' |'),
    '',
    '## Findings',
    '',
    ...(result.tasks.some((t) => t.findings.length)
      ? result.tasks.flatMap((t) => t.findings.map((f) => '- ' + t.id + ', ' + f.item + ': ' + f.decision))
      : ['None.']),
    '',
    '## What this does not show',
    '',
    '- What people do. Nobody has done these tasks; no completion rate, time on task or satisfaction score exists for them.',
    '- Whether a participant finds the button. The path says a button exists, not that it is noticed or understood.',
    '- Screen reader, voice control or switch use. The browser tests check keyboard focus and axe rules, not assistive technology with a person.',
    '',
    'To run a moderated session, use session-sheet.md, and read the GOV.UK Service Manual guide to moderated usability testing first.',
    '',
  ];
  return lines.join('\n');
}

function sessionSheetMd(product, result) {
  const lines = [
    '# ' + product + ': moderated usability session sheet',
    '',
    'A blank sheet for one session with one participant, using the clickable prototype. Generated from inputs/usability-tasks.json; print it or copy it, and keep the filled-in copy private.',
    '',
    'Before the session: ask for consent to take notes, say that the design is being tested and not the participant, and record no name, email address or other personal data on this sheet. Read each scenario as written and do not name the button.',
    '',
    '| Task | Scenario (read aloud) | Start screen | Completed? (yes, with help, no) | Steps taken (shortest: n) | What to watch for | Notes |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...result.tasks.map((t) => '| ' + [t.id, t.scenario, t.startTitle ?? t.start, ' ', ' (shortest: ' + (t.stepCount ?? 'n/a') + ')', t.observe, ' '].map(cell).join(' | ') + ' |'),
    '',
    'After the session: list each problem with the task, the screen and what the participant said or did. A problem seen with one participant is a lead to check, not a finding.',
    '',
  ];
  return lines.join('\n');
}

/** Builds the usability files from the flow and the task file. Pure: no file system access. */
export function renderUsability(flow, taskFile) {
  const tasks = taskFile.tasks.map((task) => walkTask(flow, task));
  const ids = taskFile.tasks.map((t) => t.id);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  const result = { product: flow.product.name, tasks, pass: tasks.every((t) => t.pass) && duplicates.length === 0, ...(duplicates.length ? { duplicateTaskIds: duplicates } : {}) };
  const failures = [
    ...duplicates.map((id) => 'usability: task id ' + id + ' is used twice'),
    ...tasks.flatMap((t) => t.checks.filter((c) => !c.pass).map((c) => 'usability ' + t.id + ' ' + c.id + ': ' + c.failures.join(', '))),
  ];
  return {
    files: [
      ['usability/tasks.json', JSON.stringify(result, null, 2) + '\n'],
      ['usability/walkthrough.md', walkthroughMd(flow.product.name, result)],
      ['usability/session-sheet.md', sessionSheetMd(flow.product.name, result)],
    ],
    failures,
  };
}
