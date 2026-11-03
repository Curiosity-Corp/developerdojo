<!-- Template: the weekly link check (or you) found links that no longer work. Handbook: "The weekly link check". -->

## Why this matters
Free courses move and disappear. Dead links make the site look abandoned.

## What to do
For each broken link below: open it in a private window. If it works, it was a robot problem, ignore it. If it moved, change `url` and `verifiedOn` in the resource file. If it is gone, find the replacement. If there is none, delete the resource file and remove its id from every lesson that lists it.

| Link | Where it is used (file) | Result today | Action |
| --- | --- | --- | --- |
| [url] | [file] | [works / moved / gone] | [fixed / replaced / removed] |

## Source material
The report of the weekly check: [link to the job, file `link-check-report.md`].

## Acceptance criteria
- [ ] Every link in the table is fixed, replaced or removed.
- [ ] No lesson lists a resource id that no longer exists (the `test` job proves it).

## How to check it
Run the weekly check again (CI/CD > Schedules > play) or wait for Monday: the report is clean.

## Definition of done (every issue)
- [ ] Merge request (MR) says `Closes #THIS-ISSUE-NUMBER` and its pipeline is fully green (check, test, build, links, e2e).
- [ ] Merged to `master`; the publish job ran and the change is visible on https://developerdojo.org
- [ ] Every external link was opened and works on the day it was added; no made-up courses, people, numbers or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details or real learners' names.
- [ ] Issue closed; follow-up ideas filed as new issues with `status::ready`.

<!-- Do not delete the line below. It sets the labels. Change the type, area or status words only if they are wrong. -->
/label ~"type::maintenance" ~"area::resources" ~"link-rot" ~"status::ready"
