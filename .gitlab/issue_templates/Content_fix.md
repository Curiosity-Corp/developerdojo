<!-- Template: fix a word, a sentence, a wrong fact or an out-of-date line on one page. Small fixes: you can also just open the Web IDE and make the MR yourself (CONTRIBUTING.md). -->

## Why this matters
[What is wrong or confusing, and who does it hurt?]

## What to do
- Page (link): [https://developerdojo.org/...]
- File in the repo: [src/content/library/...md]
- Wrong text now: [paste it]
- What it should say: [paste it, or describe it]

## Source material
[Where the right answer comes from, if it is a fact.]

## Acceptance criteria
- [ ] The text is corrected and still reads in plain words.
- [ ] If a fact changed, other pages that repeat it were checked (search the repo for the old words).

## How to check it
Open the page on the live site after the merge and read the line.

## Definition of done (every issue)
- [ ] Merge request (MR) says `Closes #THIS-ISSUE-NUMBER` and its pipeline is fully green (check, test, build, links, e2e).
- [ ] Merged to `master`; the publish job ran and the change is visible on https://developerdojo.org
- [ ] Every external link was opened and works on the day it was added; no made-up courses, people, numbers or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details or real learners' names.
- [ ] Issue closed; follow-up ideas filed as new issues with `status::ready`.

<!-- Do not delete the line below. It sets the labels. Change the type, area or status words only if they are wrong. -->
/label ~"type::content" ~"status::ready" ~"good-first-edit"
