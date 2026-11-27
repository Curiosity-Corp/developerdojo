# Sector packs: adding a sector pathway

A sector pack is one field's pathway: a short run of specialization katas on real files, ending in a Randori, with
results that CI computes and a plain list of what was checked and what was not (#93). The UX pathway (#91), the BIM
pathway (#92), the agriculture pathway (#93), the science pathway (#93), the finance pathway (#93), the manufacturing pathway (#93), the media pathway (#93), the education pathway (#93) and the health pathway (#93) are the nine packs today. This guide is the
template for the next one. The kata contract and the taxonomy rules are in [kata-metadata.md](kata-metadata.md) and
[kata-taxonomy.md](kata-taxonomy.md); this page does not repeat them.

A pack adds a field's practice. It never copies a foundation: every pack kata builds on the shared foundation katas
(`PRACTICE-001` and `PRACTICE-002` today) and the build rejects a pack kata that builds on none of them.

## The parts of a pack

| Part | Where | UX | BIM | Agriculture | Science | Finance | Manufacturing | Media | Education | Health |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pack record | `src/data/sector-packs.ts` | `ux` | `bim` | `agriculture` | `science` | `finance` | `manufacturing` | `media` | `education` | `health` |
| Pathway page | `src/pages/katas/<field>-pathway.astro` | `ux-pathway` | `bim-pathway` | `agriculture-pathway` | `science-pathway` | `finance-pathway` | `manufacturing-pathway` | `media-pathway` | `education-pathway` | `health-pathway` |
| Recipe pages (practice katas) | `src/content/kata-recipes/<prefix>-00N-*.yaml` | UX-001 to UX-009 | BIM-001 to BIM-008 | AGR-001 to AGR-003 | SCI-001 to SCI-003 | FIN-001 to FIN-003 | MFG-001 to MFG-003 | MED-001 to MED-003 | EDU-001 to EDU-003 | HLT-001 to HLT-003 |
| Randori | `src/content/kata-recipes/<prefix>-r01-randori.yaml` | UX-R01 | BIM-R01, and the specialist BIM-R02 | AGR-R01 | SCI-R01 | FIN-R01 | MFG-R01 | MED-R01 | EDU-R01 | HLT-R01 |
| Inputs, script, outputs, README | `public/examples/<field>-pathway/` | Penpot file and tokens | buildingSMART IFC, IDS, coordination brief, review gates | NOAA weather record | NASA GISTEMP record | Regulation Z, 12 CFR 1026.22 (eCFR) | NIST/SEMATECH e-Handbook lithography record (LITHOGRA.DAT rows) | NASA Artemis II launch recording (WAV); ITU-R BS.1770-5 and EBU Tech 3341 test signals | Wikibooks textbook page (HTML); W3C ACT test cases; IANA Language Subtag Registry | CDC BMI-for-age data files (2000 and 2022 extended growth charts); fictional children |
| CI check | `.gitlab-ci.yml` | `ux_pathway`, `test`, `e2e` | `bim_pathway` | `agriculture_pathway` | `science_pathway` | `finance_pathway` | `manufacturing_pathway` | `media_pathway` | `education_pathway` | `health_pathway` |
| Verified / not verified | pack record, rendered by `src/components/SectorPackEvidence.astro` | section 05 | section 06 | section 06 | section 06 | section 05 | section 05 | section 05 | section 05 | section 05 |
| Armory | `armoryStackRecipes` (and entries) in `src/data/armory.ts` | `penpot-and-browser` | `ifcopenshell-and-python` | `python-standard-library` | `python-standard-library` | `python-standard-library` | `python-standard-library` | `python-standard-library` | `python-standard-library` | `python-standard-library` |
| Gallery entry | `src/data/gallery.ts` | `pocket-invoice-penpot-file` | `bim-pathway-edited-model` | `agriculture-irrigation-estimate` | `science-trend-with-uncertainty` | `finance-apr-and-schedule` | `manufacturing-control-limits-and-variation` | `media-loudness-and-normalisation` | `education-accessibility-report` | `health-bmi-for-age-scores` |
| Directory card | `src/data/kata-directory.ts` | yes | yes | yes | yes | yes | yes | yes | yes | yes |
| External resources | `src/content/resources/<publisher>/*.yaml` | Penpot docs | buildingSMART, IfcOpenShell | NOAA, FAO | NASA, BIPM (GUM), NIST | CFPB (Regulation Z) | NIST (e-Handbook) | ITU (BS.1770), EBU (R 128, Tech 3341), NASA | W3C (WCAG 2.2, ACT rules), IANA, Wikibooks | CDC (growth chart data files, BMI categories) |
| Tests | `tests/<field>-pathway.test.ts`, `e2e/<field>-pathway.spec.ts` | yes | yes | yes | yes | yes | yes | yes | yes | yes |

## The pack record

`sectorPackSchema` in `src/lib/sector-pack.ts` is the contract. The fields that matter most:

- `kataIds` are the practice katas in order; `randoriKataId` is the Randori and must end in `-R01`, `-R02` and so on.
  `specialistRandoriKataIds` (optional) lists further Randori for specialists, for example one that changes a
  requirement, an exchange format or a tool; each is checked like the main Randori.
- `inputs` lists every outside file: its site path, an `https` source, its terms and its SHA-256. A pack with no outside
  input says so with `{ none: '...' }` and why.
- `checks` names each CI job, what it runs and the files it writes. A check whose `runs` is a script under
  `public/` must be rerun by that job and diffed against the published `generated/` folder.
- `verified` says what a check did, never that anything is compliant, certified or approved (the schema rejects those
  words). A line may point at an evidence file. `{placeholders}` are filled from numbers the page reads from CI
  output, so no number is typed twice.
- `notVerified` lists what nobody checked, including "no learner has run these katas yet" until one has.
- `ontology` defines the field's terms once (at least three, each in plain words); `procedures` names the field's
  own procedures with the pack katas that practise them. Every practice kata practises at least one procedure.
- `professionalReview.required` must equal `professionalReviewRequired` on every pack kata; `limit` says in plain
  words that nothing was professionally reviewed or approved, and who a real project needs.
- `professionalReview.reviewers` names each kind of qualified reviewer a real use needs, what they would check and
  where that stands: `none-available`, `requested`, `in-review` or `reviewed`. Only `reviewed` carries an `evidence`
  path, the written review, and it must exist. Today every reviewer of every pack is `none-available`; the site
  says so in the pack's review table.
- `trackingIssue` is for maintainers and is never shown on the site.

## The field template

The pack record and its recipes together make the field template every pathway page shows (rendered after the
evidence lists by `src/components/SectorPackEvidence.astro`). The pack holds what belongs to the field; the recipes
hold what belongs to a kata, and `packTemplate` in `src/lib/sector-pack.ts` collects it, so nothing is typed twice.

| Template part | Source |
| --- | --- |
| Ontology (terms of the field) | pack `ontology` |
| Native artifacts and tools | recipe `artifactTypes`; pack `armory` |
| Domain procedures | pack `procedures` |
| Scoped, versioned standards | recipe `standards` (name, version, applicability, review scope) |
| Examples and evidence | pack `inputs`, `checks`, `verified`, `notVerified`; recipe `verificationEvidence` |
| Qualified-review needs and state | pack `professionalReview` |
| Belt criteria | recipe `beltCriteria` |
| Shared foundations | pack `foundationKataIds`, recipe `foundationKataIds` |

## The sector plan

`src/data/sector-taxonomy.ts` places every field of `src/lib/fields.ts` in one of ten groups: digital products and
UX; spatial design and media; built environment; industrial and hardware; robotics; science and engineering; health
and life sciences; business and public service; energy, agriculture and natural resources; learning and
communications. Each group records what its next pack needs. A group in the plan is not a course: what is delivered
is derived from the packs (a pack counts for the group of its first field) and the fields' tracks
(`sectorCoverage` in `src/lib/sector-taxonomy.ts`), and `/fields#sector-plan` shows the two apart. A new field
must join a group, or the build fails.

## What the build enforces

`assertSectorPacks`, called from `src/lib/kata-recipe-content.ts`, fails the build when:

- a pack, pathway or kata belongs to two packs, or a field is not in `src/lib/fields.ts`;
- the pathway page does not exist, or a pack foundation is not a foundation kata;
- a pack kata has no recipe, is not a specialization, is a fixture, does not list the pack's first field in
  `domainIds`, builds on none of the pack foundations, uses none of the pack stack recipes, or disagrees with the pack
  about professional review;
- a stack recipe or Armory entry is not in the Armory, or a gallery entry is missing, taught by a kata outside the
  pack, or not listed under the pack field;
- the README, an input or a check output is missing under `public/` or sits outside the pack's examples folder, or an
  evidence path does not exist;
- a `{placeholder}` in a verified line has no value on the page (`fillEvidence`).

`tests/sector-packs.test.ts` adds what the build cannot see: each input's SHA-256 matches the file served, each check
job exists in `.gitlab-ci.yml` and diffs the script's output, and `pages` and `publish_github_pages` wait for every
pack check job.

## Checklist: add a sector pathway

1. **Pick real inputs.** Use a file whose licence or legal status lets the Dojo serve it: an open licence (CC BY,
   CC0, MIT) or a public-domain government work. Record the source URL, the terms as the publisher states them and
   the date you opened them. Serve it unchanged and record its SHA-256. Never use client, personal or invented "real"
   data. Check the file itself for personal data too: a header that names a person or an email address rules it out.
   A record the publisher revises (GISTEMP changes monthly) is pinned by its hash, with a maintainer-only fetch script
   that CI never runs. A source under copyright (the GUM, or NIST's Statistical Reference Datasets under the SRD Act)
   is cited and linked, and its published numbers may serve as reference checks, but its files and text are not
   served.
2. **Find reference values.** Prefer a method the publisher documents with worked examples, so the script can
   reproduce published numbers before it computes anything new, and refuse to write results if one differs.
3. **Write the script.** Put it in `public/examples/<field>-pathway/tools/`. Pin every dependency by hash, or use
   only the standard library. Write `generated/` deterministically, with a manifest of versions and input hashes.
   Report a missing measurement as unavailable (null), never as zero.
4. **Add the CI job.** Copy `ux_pathway` (Node, no packages), `agriculture_pathway` (Python, no packages) or `bim_pathway` (pinned packages): rerun the script
   and `diff -r` its output against `generated/`. Add the job to the `needs` of `pages` and
   `publish_github_pages`. Generate the published files with the same Python minor version as the CI image.
5. **Add vocabulary and the stack.** New outcomes, artifacts and the stack recipe go in `kataDimensions`
   (`src/data/kata-catalog.ts`); the stack recipe also goes in `armoryStackRecipes`. Add resource records for every
   source a recipe cites.
6. **Write the recipes.** One per practice kata and one Randori, `status: draft`, with
   `professionalReviewRequired` set honestly, the pack field in `domainIds`, the shared foundations, and checks whose
   evidence is a generated file. Mark a check `not-run` until someone runs it.
7. **Write the pathway page.** Read every number from `generated/`. Render the evidence section with
   `<SectorPackEvidence pack="<id>" eyebrow="NN / What is checked" facts={...} />`. Credit every source. No person,
   client, host, node, repository path or issue link on the page.
8. **Add the gallery entry and the directory card**, then the pack record in `src/data/sector-packs.ts`, with its
   terms, procedures and reviewers. Record each reviewer as `none-available` until a qualified person has actually
   agreed to review; never contact anyone outside the maintainers from the site.
9. **Test.** `tests/<field>-pathway.test.ts` pins the numbers the recipes quote; `e2e/<field>-pathway.spec.ts`
   checks the page and that every file it offers is served; add the page and its widest recipe to the reflow routes
   in `e2e/qa.spec.ts`; update the gallery counts in `e2e/gallery.spec.ts`.
10. **Lock and validate.** `npm run taxonomy:lock`, then `npx vitest run`. CI runs the build, the pack job and the
    browser tests; never build locally.

## Limits every pack states

A pack teaches a practice on a sample. It never says a real project, building, field or product passed anything.
Where the field is regulated or safety-critical, `professionalReviewRequired` is true and the limit names the kind of
qualified person a real case needs. Unmeasured values are labelled unavailable, and estimates are called estimates.
