<!-- Template: add one free outside course, video or doc. Many resources in one issue are fine: list them all. Handbook: docs/handbook.md. -->

## Why this matters
[Which lesson or skill does this help, and why is it better than what we already list?]

## What to do
Add one file per resource: `src/content/resources/[publisher]/[short-name].yaml` (see "Add a free resource" in `CONTRIBUTING.md`). First search `src/content/resources/` so there is never a second file for the same link.

- Title exactly as the publisher shows it: [title]
- Link: [https://...]
- Cost: [free | free-audit | free-tier | paid]
- Lesson(s) that should list it: [lesson names]

## Source material
[Where you found it: a publisher page, a recommendation, a lesson that needs it.]

## Acceptance criteria
- [ ] The link opens without a login in a private window and is the thing described.
- [ ] No second file for the same link.
- [ ] `verifiedOn` is the day it was opened; `cost` is honest.
- [ ] Listed in the `resources:` of at least one lesson, or a lesson issue is filed for it.

## How to check it
Open `/library/resources/` and find it; open it from the lesson page.

## Definition of done (every issue)
- [ ] Merge request (MR) says `Closes #THIS-ISSUE-NUMBER` and its pipeline is fully green (check, test, build, links, e2e).
- [ ] Merged to `master`; the publish job ran and the change is visible on https://developerdojo.org
- [ ] Every external link was opened and works on the day it was added; no made-up courses, people, numbers or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details or real learners' names.
- [ ] Issue closed; follow-up ideas filed as new issues with `status::ready`.

<!-- Do not delete the line below. It sets the labels. Change the type, area or status words only if they are wrong. -->
/label ~"type::content" ~"area::resources" ~"status::ready" ~"good-first-edit"
