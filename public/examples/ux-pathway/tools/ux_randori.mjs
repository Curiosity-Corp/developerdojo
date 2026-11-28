/**
 * UX Randori (UX-R01): checks the worked rounds in inputs/randori-rounds.json. Each round is one partner card, a brief
 * and a hidden constraint, answered twice: the first flow is the sitemap drawn before the constraint was revealed,
 * the adapted flow is the one that meets it. No dependencies: the Node standard library only. Called by ux_pathway.mjs,
 * which passes in its own structural checks and drawing functions, so a round's flow is checked and drawn exactly as
 * the Pocket Invoice flow is.
 *
 * For every round:
 *   - both flows must pass every structural check (reachable, no dead end, errors recover, buttons wired, ...);
 *   - the adapted flow must pass the check for its hidden constraint;
 *   - the first flow must fail that check, or the constraint changed nothing and the card proves nothing;
 *   - what the constraint changed (states and transitions added and removed) is computed, not written by hand.
 *
 * A constraint about the screens (focus order, one action per screen) is checked twice: here from the layout each
 * state declares, and in a browser (e2e/ux-pathway.spec.ts), which walks every generated HTML screen with the Tab key.
 *
 * Writes randori/<round>-first-sitemap.svg, randori/<round>-adapted-sitemap.svg, randori/<round>-adapted-journey.svg,
 * randori/rounds.json and randori/randori.md, and for a screen constraint randori/<round>-first|adapted/<state>.html.
 */

function check(id, description, failures) {
  return { id, description, pass: failures.length === 0, failures };
}

function fields(state) {
  return state.elements.filter((element) => element.type === 'field');
}

/**
 * Where each element sits: its row and column on the screen. A state either places every element (place: { row,
 * col }) or none, and then the elements stack in one column in the order they are listed.
 */
function placed(state) {
  const count = state.elements.filter((element) => element.place).length;
  if (count !== 0 && count !== state.elements.length) throw new Error('ux_randori: state "' + state.id + '" places ' + count + ' of its ' + state.elements.length + ' elements; place all or none');
  return state.elements.map((element, index) => ({ element, index, row: element.place ? element.place.row : index + 1, col: element.place ? element.place.col : 1 }));
}

/** The controls a keyboard reaches: fields and buttons, in the order they are listed (the order of the page's code). */
function controls(state) {
  return placed(state).filter((p) => p.element.type === 'field' || p.element.type === 'button');
}

/** An action is a button whose transition takes effect (commits); a button that only moves to another screen is a link. */
function isAction(flow, state, element) {
  return element.type === 'button' && flow.transitions.some((t) => t.from === state.id && t.to === element.to && t.commits);
}

function controlName(element) {
  return element.label;
}

/**
 * One machine check per hidden constraint on the partner cards. A constraint without a check here is refused, so a
 * new card cannot be published with a check that silently passes. Each check reads flags the flow file declares:
 *   commits      on a transition: the action takes effect (reserve, cancel, borrow)
 *   undo         on a transition: it reverses the last committed action
 *   undoSeconds  on a state: how long its Undo stays available
 *   awaits       on a state: the role that must answer before anything takes effect
 *   actor        on a transition: who causes it, when it is not the user
 *   offline      on a state: what the user sees when the connection drops
 */
export const CONSTRAINT_CHECKS = {
  'undo-30s': {
    description: 'Every action that takes effect leads to a state that offers Undo for at least 30 seconds.',
    run(flow, { byId, out, commits }) {
      const failures = [];
      if (commits.length === 0) failures.push('no transition is marked commits, so nothing could be undone');
      for (const t of commits) {
        const target = byId[t.to];
        if (!target) continue;
        if (!(target.undoSeconds >= 30)) failures.push(t.from + ' > ' + t.to + ': ' + t.to + ' offers no Undo for 30 seconds');
        if (!out(t.to).some((u) => u.undo)) failures.push(t.from + ' > ' + t.to + ': no Undo transition leaves ' + t.to);
      }
      return failures;
    },
  },
  'second-person-approval': {
    description: 'Every action that takes effect waits for a second person, who can approve or decline, and the approved state is entered only after that wait.',
    run(flow, { byId, out, commits }) {
      const failures = [];
      if (commits.length === 0) failures.push('no transition is marked commits, so nothing waits for approval');
      for (const t of commits) {
        const target = byId[t.to];
        if (!target) continue;
        if (!target.awaits) { failures.push(t.from + ' > ' + t.to + ': takes effect at once; no state waits for a second person'); continue; }
        const answers = out(t.to).filter((u) => u.actor === target.awaits && byId[u.to]);
        const approve = answers.filter((u) => byId[u.to].kind === 'success');
        const decline = answers.filter((u) => byId[u.to].kind !== 'success');
        if (approve.length === 0) failures.push(t.to + ': the ' + target.awaits + ' has no way to approve');
        if (decline.length === 0) failures.push(t.to + ': the ' + target.awaits + ' has no way to decline');
        for (const a of approve) {
          for (const into of flow.transitions.filter((u) => u.to === a.to && !(byId[u.from] && byId[u.from].awaits))) {
            failures.push(a.to + ': entered from ' + into.from + ' without approval');
          }
        }
      }
      return failures;
    },
  },
  'keyboard-focus-one-action': {
    description: 'On every screen, focus moves through the controls in the order a reader meets them (top to bottom, then left to right), and no screen has more than one action (a control that takes effect). Checked here from the layout of each state, and in a browser, which walks every screen with the Tab key.',
    screens: true,
    run(flow, { commits }) {
      const failures = [];
      if (commits.length === 0) failures.push('no transition is marked commits, so no screen has an action');
      for (const state of flow.states) {
        const listed = controls(state);
        const read = [...listed].sort((a, b) => a.row - b.row || a.col - b.col || a.index - b.index);
        if (listed.some((p, i) => p !== read[i])) failures.push(state.id + ': focus goes ' + listed.map((p) => controlName(p.element)).join(', ') + '; reading goes ' + read.map((p) => controlName(p.element)).join(', '));
        const actions = state.elements.filter((element) => isAction(flow, state, element));
        if (actions.length > 1) failures.push(state.id + ': ' + actions.length + ' actions (' + actions.map(controlName).join(', ') + ')');
      }
      return failures;
    },
  },
  // The unseen round's card (inputs/randori-unseen.json). No worked round uses it, so no answer to it is published.
  'review-before-commit': {
    description: 'Every action that takes effect starts from a review screen that has no field of its own and shows a summary, including every value typed on the screen that leads to it; the review screen has a way back that does not take effect, and every screen with fields that it goes back to still holds every value.',
    run(flow, { byId, out, commits }) {
      const failures = [];
      if (commits.length === 0) failures.push('no transition is marked commits, so nothing could be reviewed first');
      for (const t of commits) {
        const review = byId[t.from];
        if (!review) continue;
        const label = t.from + ' > ' + t.to;
        if (fields(review).length > 0) { failures.push(label + ': takes effect from ' + t.from + ', a screen with fields, not from a review screen'); continue; }
        const shown = review.elements.filter((element) => element.type === 'summary').flatMap((element) => element.rows.map((row) => String(row[1])));
        if (shown.length === 0) { failures.push(label + ': ' + t.from + ' shows no summary of the choices'); continue; }
        const feeders = flow.transitions.filter((u) => u.to === review.id && !u.commits && byId[u.from] && byId[u.from].kind !== 'error' && fields(byId[u.from]).length > 0).map((u) => byId[u.from]);
        for (const feeder of feeders) {
          for (const field of fields(feeder)) {
            if (!shown.some((value) => value.includes(String(field.value ?? '')) && String(field.value ?? '') !== '')) failures.push(label + ': ' + t.from + ' does not show "' + field.label + '" from ' + feeder.id);
          }
        }
        const back = out(review.id).filter((u) => !u.commits && byId[u.to] && byId[u.to].kind !== 'error');
        if (back.length === 0) { failures.push(t.from + ': no way back without it taking effect'); continue; }
        for (const u of back) {
          const lost = fields(byId[u.to]).filter((field) => field.value === undefined || String(field.value) === '');
          if (lost.length) failures.push(t.from + ' > ' + u.to + ': going back empties ' + lost.map((field) => '"' + field.label + '"').join(', '));
        }
      }
      return failures;
    },
  },
  'offline-keeps-input': {
    description: 'Every state with a field has an offline state that keeps each field and its value, with a way back or on once the connection returns.',
    run(flow, { byId, out }) {
      const failures = [];
      const typed = flow.states.filter((state) => !state.offline && fields(state).length > 0);
      if (typed.length === 0) failures.push('no state has a field, so nothing typed could be lost');
      for (const state of typed) {
        const onward = new Set(out(state.id).filter((t) => t.kind === 'forward' || t.kind === 'branch').map((t) => t.to));
        const offline = out(state.id).map((t) => byId[t.to]).filter((target) => target && target.offline);
        if (offline.length === 0) { failures.push(state.id + ': no offline state; what was typed would be lost'); continue; }
        const keeps = offline.filter((o) => fields(state).every((f) => fields(o).some((g) => g.label === f.label && g.value === f.value)));
        if (keeps.length === 0) { failures.push(state.id + ': the offline state drops a field or its value'); continue; }
        if (!keeps.some((o) => out(o.id).some((t) => t.to === state.id || onward.has(t.to)))) failures.push(state.id + ': the offline state has no way back to it or on from it');
      }
      return failures;
    },
  },
};

export function checkConstraint(flow, constraintId) {
  const rule = CONSTRAINT_CHECKS[constraintId];
  if (!rule) throw new Error('ux_randori: no check for the hidden constraint "' + constraintId + '"; add one to CONSTRAINT_CHECKS');
  const byId = Object.fromEntries(flow.states.map((state) => [state.id, state]));
  const out = (id) => flow.transitions.filter((t) => t.from === id);
  const commits = flow.transitions.filter((t) => t.commits);
  return check(constraintId, rule.description, rule.run(flow, { byId, out, commits }));
}

/** What the constraint changed: states and transitions added and removed, by id and by from > to. */
export function diffFlows(first, adapted) {
  const ids = (flow) => flow.states.map((state) => state.id);
  const edges = (flow) => flow.transitions.map((t) => t.from + ' > ' + t.to);
  const minus = (a, b) => a.filter((x) => !b.includes(x));
  return {
    statesAdded: minus(ids(adapted), ids(first)),
    statesRemoved: minus(ids(first), ids(adapted)),
    transitionsAdded: minus(edges(adapted), edges(first)),
    transitionsRemoved: minus(edges(first), edges(adapted)),
  };
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const SCREEN_CSS = [
  'body { margin: 0; font: 1rem/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #1b1f24; background: #fff; }',
  '.note { margin: 0; padding: 0.5rem 1rem; background: #f1f3f5; color: #3d4752; font-size: 0.875rem; }',
  'main { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 9rem); gap: 0.75rem 1rem; align-items: start; max-width: 36rem; margin: 1.5rem auto; padding: 0 1rem; }',
  'h1 { margin: 0; font-size: 1.5rem; } p { margin: 0; }',
  'label { display: grid; gap: 0.25rem; font-weight: 600; } input { font: inherit; padding: 0.5rem; border: 1px solid #5c6670; border-radius: 4px; }',
  'form { margin: 0; } button { font: inherit; font-weight: 700; padding: 0.625rem 1rem; border-radius: 4px; border: 2px solid #1a4fd6; width: 100%; }',
  'button.primary { background: #1a4fd6; color: #fff; } button.secondary { background: #fff; color: #1a4fd6; }',
  'a { color: #1a4fd6; } a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid #b3261e; outline-offset: 2px; }',
].join('\n');

/**
 * One state as a plain HTML page, for the browser check of a screen constraint. Elements are written in the order
 * they are listed, which is the order focus follows, and placed in a two-column grid where the state says, which is
 * the order a reader follows. An action is a submit button; a button that only moves on is a link.
 */
export function screenHtml(flow, state, roundId, which) {
  const when = { first: 'first version, before the constraint', adapted: 'adapted version, after the constraint' };
  const body = placed(state).map(({ element, row, col }) => {
    const where = element.place ? ' style="grid-row: ' + row + '; grid-column: ' + col + ';"' : ' style="grid-column: 1 / -1;"';
    const name = ' data-control="' + esc(element.label || element.text || '') + '"';
    if (element.type === 'heading') return '<h1' + where + '>' + esc(element.text) + '</h1>';
    if (element.type === 'text') return '<p' + where + '>' + esc(element.text) + '</p>';
    if (element.type === 'field') return '<label' + where + '>' + esc(element.label) + ' <input name="' + esc(element.label) + '" value="' + esc(element.value || '') + '"' + name + '></label>';
    if (element.type === 'button' && isAction(flow, state, element)) return '<form action="' + esc(element.to) + '.html" method="get"' + where + '><button type="submit" class="' + esc(element.variant) + '"' + name + '>' + esc(element.label) + '</button></form>';
    if (element.type === 'button') return '<p' + where + '><a href="' + esc(element.to) + '.html"' + name + '>' + esc(element.label) + '</a></p>';
    throw new Error('ux_randori: state "' + state.id + '" has an element of unknown type "' + element.type + '"');
  });
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>' + esc(state.title) + ': Randori round ' + esc(roundId) + ', ' + when[which] + '</title>',
    '<style>',
    SCREEN_CSS,
    '</style>',
    '</head>',
    '<body data-round="' + esc(roundId) + '" data-version="' + which + '" data-state="' + esc(state.id) + '">',
    '<p class="note">Worked UX Randori round ' + esc(roundId) + ', ' + when[which] + '. A wireframe screen for the keyboard check, not a working app.</p>',
    '<main>',
    ...body,
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function summarise(flow, structure, constraint) {
  return {
    states: flow.states.length,
    transitions: flow.transitions.length,
    structure: { pass: structure.every((c) => c.pass), failed: structure.filter((c) => !c.pass).map((c) => ({ id: c.id, failures: c.failures })) },
    constraint: { pass: constraint.pass, failures: constraint.failures },
  };
}

function roundFailures(round, first, adapted) {
  const failures = [];
  const label = 'randori round ' + round.id;
  for (const [which, result] of [['first', first], ['adapted', adapted]]) {
    for (const c of result.structure.failed) failures.push(label + ', ' + which + ' flow, ' + c.id + ': ' + c.failures.join(', '));
  }
  if (!adapted.constraint.pass) failures.push(label + ', adapted flow misses the constraint: ' + adapted.constraint.failures.join('; '));
  if (first.constraint.pass) failures.push(label + ': the first flow already meets "' + round.constraint.id + '", so the hidden constraint changed nothing');
  return failures;
}

function list(items) {
  return items.length ? items.join(', ') : 'none';
}

function markdown(rounds) {
  const lines = [
    '# UX Randori: worked rounds',
    '',
    'Generated by tools/ux_randori.mjs (called by tools/ux_pathway.mjs) from inputs/randori-rounds.json. Do not edit: change the input and rerun the script.',
    '',
    'Each round answers a partner card from the UX-R01 download (the screen round plays the two screen cards together) twice: the first sitemap, drawn before the hidden constraint was revealed, and the adapted one that meets it. Both must pass every structural check of the flow script; the adapted one must pass the check for its constraint, and the first must fail it, or the constraint changed nothing.',
    '',
    '**Not unseen for the authors.** The maintainers who wrote the cards also wrote these answers, so the constraint was never hidden from them. No partner has walked these flows. Use the rounds after your own session, to compare, not as a model to copy first.',
    '',
    '| Round | Brief | Hidden constraint | First sitemap | Adapted sitemap |',
    '| --- | --- | --- | --- | --- |',
    ...rounds.map((r) => '| ' + r.id + ' | ' + r.brief + ' | ' + r.constraint.text + ' | ' + r.first.states + ' states, ' + r.first.transitions + ' transitions; constraint ' + (r.first.constraint.pass ? 'met' : 'missed (' + r.first.constraint.failures.length + ')') + ' | ' + r.adapted.states + ' states, ' + r.adapted.transitions + ' transitions; constraint ' + (r.adapted.constraint.pass ? 'met' : 'missed') + ' |'),
    '',
  ];
  for (const r of rounds) {
    lines.push(
      '## Round ' + r.id + ': ' + r.constraint.text,
      '',
      '**Brief:** ' + r.brief,
      '',
      '**What the constraint changed (in the author’s words):** ' + r.changed,
      '',
      '**Check:** ' + r.constraintCheck,
      '',
      'Before the constraint, the check found:',
      '',
      ...r.first.constraint.failures.map((f) => '- ' + f),
      '',
      'After: ' + (r.adapted.constraint.pass ? 'no problems.' : r.adapted.constraint.failures.join('; ')),
      '',
      '| Change, computed from the two flows | Items |',
      '| --- | --- |',
      '| States added | ' + list(r.diff.statesAdded) + ' |',
      '| States removed | ' + list(r.diff.statesRemoved) + ' |',
      '| Transitions added | ' + list(r.diff.transitionsAdded) + ' |',
      '| Transitions removed | ' + list(r.diff.transitionsRemoved) + ' |',
      '',
      'Structural checks: first flow ' + (r.first.structure.pass ? 'passed all' : 'failed some') + ', adapted flow ' + (r.adapted.structure.pass ? 'passed all' : 'failed some') + '.',
      '',
      'Drawings: ' + r.files.join(', ') + '.',
      '',
      ...(r.screens.first.length ? ['Screens, walked with the Tab key in a browser on every pipeline: ' + r.screens.first.concat(r.screens.adapted).join(', ') + '.', ''] : []),
    );
  }
  lines.push(
    '## Not checked here',
    '',
    '- Whether a person can use the adapted flow. That is the partner walk in the kata: a moderated test, with notes on where they stopped.',
    '- Whether a screen reader announces the screens well, or whether a reader of English as a second language understands the words. The screen check proves focus order and the number of actions, not that.',
    '- Whether the 30-second Undo, the approval or the offline copy work in software. These are flows and wireframes, not a working app.',
    '',
  );
  return lines.join('\n');
}

/**
 * Builds every Randori output from the parsed rounds file. Pure: no file system access.
 * `draw` holds checkStructure, sitemapSvg and journeySvg from ux_pathway.mjs.
 */
export function renderRandori(input, draw) {
  if (!input || !Array.isArray(input.rounds) || input.rounds.length === 0) throw new Error('ux_randori: the rounds file has no rounds');
  const files = [];
  const failures = [];
  const rounds = [];
  for (const round of input.rounds) {
    if (!round.id || !round.first || !round.adapted || !round.constraint) throw new Error('ux_randori: every round needs an id, a constraint, a first and an adapted flow');
    const results = {};
    for (const which of ['first', 'adapted']) {
      const flow = round[which];
      results[which] = summarise(flow, draw.checkStructure(flow), checkConstraint(flow, round.constraint.id));
    }
    const when = { first: 'before the constraint', adapted: 'after the constraint' };
    const names = [];
    for (const which of ['first', 'adapted']) {
      const flow = round[which];
      const titled = { ...flow, product: { ...flow.product, name: 'Randori ' + round.id + ', ' + when[which] + ': ' + flow.product.name } };
      names.push('randori/' + round.id + '-' + which + '-sitemap.svg');
      files.push([names[names.length - 1], draw.sitemapSvg(titled)]);
    }
    names.push('randori/' + round.id + '-adapted-journey.svg');
    files.push([names[names.length - 1], draw.journeySvg(round.adapted)]);
    const screens = { first: [], adapted: [] };
    if (CONSTRAINT_CHECKS[round.constraint.id].screens) {
      for (const which of ['first', 'adapted']) {
        const flow = round[which];
        const order = [flow.start, ...flow.states.map((state) => state.id).filter((id) => id !== flow.start)];
        for (const id of order) {
          const name = 'randori/' + round.id + '-' + which + '/' + id + '.html';
          screens[which].push(name);
          files.push([name, screenHtml(flow, flow.states.find((state) => state.id === id), round.id, which)]);
        }
      }
    }
    failures.push(...roundFailures(round, results.first, results.adapted));
    rounds.push({
      id: round.id,
      brief: round.brief,
      constraint: round.constraint,
      constraintCheck: CONSTRAINT_CHECKS[round.constraint.id].description,
      changed: round.changed,
      first: results.first,
      adapted: results.adapted,
      diff: diffFlows(round.first, round.adapted),
      files: names,
      screens,
    });
  }
  const pass = failures.length === 0;
  files.push(['randori/rounds.json', JSON.stringify({ generator: 'tools/ux_randori.mjs', pass, rounds }, null, 2) + '\n']);
  files.push(['randori/randori.md', markdown(rounds)]);
  return { files, failures, rounds };
}
