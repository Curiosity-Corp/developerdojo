<!-- Template: add a new skill track. Handbook: docs/handbook.md. -->

## Why this matters
[Which skill does a 2030 Product Development Manager need that no track covers yet? Who is the track for?]

## What to do
Create the track overview `src/content/tracks/[track-name].md` (400 to 900 words) and the first lessons in `src/content/library/tracks/[track-name]/`.

- Track name and slug: [Title] / [slug-with-hyphens]
- Group: [product | ai | engineering | frameworks]
- Level: [foundation | core | advanced]
- Lessons planned (title and one line each): [list]
- Icon (a name from https://lucide.dev/icons): [name]

## Source material
[Links or file names. Mark anything internal or private so nobody publishes it.]

## Acceptance criteria
- [ ] Track overview says who it is for, what you can do afterwards, how the lessons build, how it maps to the Developer weeks and Master Developer modules, and how long it takes.
- [ ] At least [3] lessons are written, each with 3 to 8 checked outside resources.
- [ ] The track shows on `/library/` with its lessons in order.

## How to check it
Open `/library/tracks/[track-name]/` on the live site: the overview and every lesson are listed in order.

## Definition of done (every issue)
- [ ] Merge request (MR) says `Closes #THIS-ISSUE-NUMBER` and its pipeline is fully green (check, test, build, links, e2e).
- [ ] Merged to `master`; the publish job ran and the change is visible on https://developerdojo.org
- [ ] Every external link was opened and works on the day it was added; no made-up courses, people, numbers or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details or real learners' names.
- [ ] Issue closed; follow-up ideas filed as new issues with `status::ready`.

<!-- Do not delete the line below. It sets the labels. Change the type, area or status words only if they are wrong. -->
/label ~"type::content" ~"area::tracks" ~"status::ready"
