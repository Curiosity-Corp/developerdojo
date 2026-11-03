<!-- Template: add one lesson to a track. Replace every sentence in [brackets]. Delete the grey comments when you are done. Handbook: docs/handbook.md. -->

## Why this matters
[Who needs this lesson and what can they do afterwards that they could not do before? Name the Developer week or Master Developer module it supports. One or two sentences.]

## What to do
Write the lesson `src/content/library/tracks/[track-name]/[NN]-[lesson-name].md` (1,500 to 3,000 words) using the lesson structure in `docs/style-guide.md`.

- Track: [track name, for example product-discovery]
- Working title: [title]
- The decision the learner makes here: [one sentence]
- What the learner hands to AI agents, and what they must do themselves: [one or two sentences]
- Practice exercise and its deliverable (goes in the learner's git repo): [one sentence]

## Source material
[Links or file names: program documents, framework pages, outside courses. Mark anything internal or private so nobody publishes it.]

## Acceptance criteria
- [ ] The lesson follows the structure in `docs/style-guide.md` and the TrailMug example is consistent with other pages.
- [ ] 3 to 8 outside resources, each a file in `src/content/resources/` and each opened and checked today.
- [ ] Says where it sits on the ladder: use, delegate, orchestrate, govern.
- [ ] AI use is disclosed in the MR description.

## How to check it
Open the lesson on the MR pipeline result or live site: it appears in its track, the table of contents works, every link opens.

## Definition of done (every issue)
- [ ] Merge request (MR) says `Closes #THIS-ISSUE-NUMBER` and its pipeline is fully green (check, test, build, links, e2e).
- [ ] Merged to `master`; the publish job ran and the change is visible on https://developerdojo.org
- [ ] Every external link was opened and works on the day it was added; no made-up courses, people, numbers or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details or real learners' names.
- [ ] Issue closed; follow-up ideas filed as new issues with `status::ready`.

<!-- Do not delete the line below. It sets the labels. Change the type, area or status words only if they are wrong. -->
/label ~"type::content" ~"area::tracks" ~"status::ready"
