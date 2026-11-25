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
 * Writes randori/<round>-first-sitemap.svg, randori/<round>-adapted-sitemap.svg, randori/<round>-adapted-journey.svg,
 * randori/rounds.json and randori/randori.md.
 */

function check(id, description, failures) {
  return { id, description, pass: failures.length === 0, failures };
}

function fields(state) {
  return state.elements.filter((element) => element.type === 'field');
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
    'Each round answers one partner card from the UX-R01 download twice: the first sitemap, drawn before the hidden constraint was revealed, and the adapted one that meets it. Both must pass every structural check of the flow script; the adapted one must pass the check for its constraint, and the first must fail it, or the constraint changed nothing.',
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
    );
  }
  lines.push(
    '## Not checked here',
    '',
    '- Whether a person can use the adapted flow. That is the partner walk in the kata: a moderated test, with notes on where they stopped.',
    '- The two keyboard and reading constraints on the cards (focus order, one action per screen) are about the screens, not the flow, so no flow check can prove them.',
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
    });
  }
  const pass = failures.length === 0;
  files.push(['randori/rounds.json', JSON.stringify({ generator: 'tools/ux_randori.mjs', pass, rounds }, null, 2) + '\n']);
  files.push(['randori/randori.md', markdown(rounds)]);
  return { files, failures, rounds };
}
