<!-- Fill in the three parts, tick the boxes that are true, then press Create merge request. -->

## What changed and why
[One or two plain sentences. Which pages or files? What can a visitor do or understand now that they could not before?]

Closes #[issue number]

## Checklist (from the Definition of done)
- [ ] The line `Closes #N` is above, with the real issue number.
- [ ] The pipeline is fully green: `check`, `test`, `build`, `links`, `e2e`. (A red job: read its log and fix in this same branch; see "When the pipeline is red" in `docs/handbook.md`. A `500 Internal Server Error` while uploading or downloading is a temporary server problem: press Retry on the job.)
- [ ] Every outside link was opened today and works. No made-up courses, people, numbers, events or promises.
- [ ] Plain words: a junior or someone reading in their second language can follow it.
- [ ] No internal server names, private client details, real learners' names, passwords or keys.
- [ ] AI help is disclosed below (or "No AI used").
- [ ] I read the changed pages in the Web IDE preview or in the pipeline's output.

## AI use
[No AI used. / Which tool or agent helped, and what part. A person must have read and checked all of it.]

## After the merge
- [ ] The `publish_github_pages` job on `master` finished green and the change shows on https://developerdojo.org (hard refresh: Ctrl+Shift+R).
- [ ] The issue is closed (the `Closes` line does it) and follow-up ideas are new issues with `status::ready`.

