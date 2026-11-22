# Mission playbook: brief, transfer record and retrospective

The mission playbook (#95) is the `/mission-playbook` page. It has four parts, all kept as data in
`src/data/mission-playbook.ts`:

1. **The template.** The mission brief (goal, authorized inputs, real-world constraints, chosen stack, dependencies,
   acceptance criteria, required professional approvals, katas practiced), the transfer record and the
   retrospective. The editable text on the page and `/examples/mission-brief.md` are generated from it
   (`src/data/mission-brief.ts`), so the download and the page never disagree.
2. **The transfer rubric.** It is the assessment map's rubric (#90, `src/data/assessment-map.ts`), not a second
   scale. `rubricCriterionIds` names the map's criteria that assess transfer or domain adaptation (today MD-1 and
   SEN-2), and a result uses the map's own words: Observed, Not yet observed or Unclear.
3. **The routes.** Where a retrospective sends a verified technique improvement or benchmark correction: the Sensei
   contribution worksheets on `/sensei/contribute`.
4. **The worked mission.** One real cross-field transfer with public provenance (see below).

`src/lib/mission-playbook.ts` holds the schema and the rules. The page calls `loadMissionPlaybook`, so bad data fails
the build with one readable message; `tests/mission-playbook.test.ts` runs the same check against the files, and
`e2e/mission-playbook.spec.ts` checks the page in a browser, with and without JavaScript.

This changes no program rule. The rubric stays **proposed** until the program policy review (#80) approves it.

## Rules the check enforces

| Rule | Why |
| --- | --- |
| The brief, transfer and retrospective fields are all present, in order. | #95 names each field. |
| Every transfer criterion is in the assessment map and assesses transfer or domain adaptation. | One scale, not two. |
| Each recorded criterion accounts for every evidence kind the map asks for, as offered or missing, and lists no other kind. | The reviewer sees what exists and what does not. |
| While the map's review pilot is `not-run`, every observation is `null` (shown as Unavailable) and `reviewer` is `null`. | No result is claimed before an independent review. |
| The worked mission's foundations are catalog katas that every adapted sector pack builds on. | A transfer is only claimed where the pathways record it. |
| Each adaptation quotes a review gate from a recipe of that pack, and the role must exist. | The page shows the field's own words, not a paraphrase. |
| Published text has no issue or MR references, hostnames or repository paths. | Public-site rule. |

The page reads each field's capabilities, standards, constraints, stack, inputs and their terms, CI checks,
recorded failures, not-verified lists and professional-review limits from the recipes and `src/data/sector-packs.ts`.
None of them is typed into the playbook, so they cannot drift.

## The worked mission and its provenance

"One check, three fields" reads the site's own UX, BIM and agriculture pathways (#91, #92, #93). All three build on
the foundation katas PRACTICE-001 and PRACTICE-002, and each quotes the same review gate in its own terms: an
assistant's output is kept only once a check it did not write confirms it. Its evidence is public and licensed: Dojo
material under MIT, the buildingSMART sample under CC BY 4.0 and the NOAA record as a US government work, each with
its terms on the pathway page and its outputs recomputed by CI. It uses no client, customer or person material, and
it is labelled as the maintainers' work, not a learner's.

Its independent rubric result (SEN-2) is **unavailable**: the review pilot has not run. When a pilot review of it
happens, record the reviewer's observation per `docs/independent-review-pilot.md` and set the pilot status in the
assessment map; the check then allows a non-null observation.

## Routing a retrospective improvement (#94)

A retrospective that finds a verified technique improvement or benchmark correction is routed to the Sensei
contribution work in #94:

1. Fill the worksheet the route names (`/examples/sensei/kata-improvement.md` or
   `/examples/sensei/benchmark-correction.md`).
2. Open a GitLab issue with the matching template (`Kata_improvement` or `Benchmark_correction`) with the evidence
   (recipe, role, the text as it reads, the proposal). The process is [sensei-contributions.md](sensei-contributions.md).
3. Add the item to `workedMission.retrospective.improvements` (or the learner's own retrospective) with
   `status: 'routed'`. Set it to `applied` when the change is merged with no independent review yet, and to
   `accepted` or `declined` only after a reviewer who is not the author has decided. The contribution log check
   fails when this status and the log's outcome disagree.

The worked mission routed one: UX-005's drafting-assistant review gate said lines are compared "before it goes into
Penpot", but in UX-005 the assistant writes the web page. It was applied through the contribution process (#94,
[contributions/ux-005-review-gate.md](contributions/ux-005-review-gate.md)); its independent review is unavailable, so
its status is `applied`, not `accepted`.

## Limitations

- No learner has used the playbook or run the worked mission, and no independent reviewer has assessed it.
- The worked mission is the maintainers' own pathway work. A learner, client or customer mission needs written
  permission before any of it is published, and none is published here.
- Professional approval is not given or implied: BIM and agriculture need qualified review for real use.
