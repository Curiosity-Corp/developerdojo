<!-- Template: something on the live site is broken (layout, a button, a page that does not open, search, a pipeline that keeps failing). Do not paste passwords or keys. -->

## Why this matters
[What breaks for a visitor or for the person maintaining the site?]

## What to do
Find the cause and fix it in an MR. If it is a pipeline problem, see "When the pipeline is red" in `docs/handbook.md` first.

- Page or job where it happens: [link]
- What you did: [steps, one per line]
- What you expected: [text]
- What happened instead: [text, and a screenshot if you can]
- Device and browser: [for example iPhone Safari, Windows Chrome]

## Source material
[Link to the failed job log, a screenshot, or the file you think is involved.]

## Acceptance criteria
- [ ] The problem no longer happens on the steps above, on desktop and on a phone.
- [ ] A check was added if one was missing (a test, a pipeline rule), so it cannot come back unnoticed.

## How to check it
Repeat the steps above on the live site after the merge.

## Definition of done (every issue)
- [ ] Merge request (MR) says `Closes #THIS-ISSUE-NUMBER` and its pipeline is fully green (check, test, build, links, e2e).
- [ ] Merged to `master`; the publish job ran and the change is visible on https://developerdojo.org
- [ ] Every external link was opened and works on the day it was added; no made-up courses, people, numbers or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details or real learners' names.
- [ ] Issue closed; follow-up ideas filed as new issues with `status::ready`.

<!-- Do not delete the line below. It sets the labels. Change the type, area or status words only if they are wrong. -->
/label ~"type::bug" ~"status::ready"
