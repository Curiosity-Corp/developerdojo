---
title: "Fix forward"
description: "When something breaks, ship a new fix. Do not undo shipped work to make the problem disappear."
section: "The Way"
order: 5
---

**Rule 4: fix forward.** We do not revert shipped work to make a problem go away.

## What it means

When a release fails, there are two ways to react:

- **Roll back.** Undo the change and pretend it did not happen.
- **Fix forward.** Find the cause and ship a new change that fixes it.

We fix forward.

## Why

- A rollback hides the cause. The same problem comes back later.
- Other work may already depend on the change. Undoing it breaks that work.
- A forward fix gives you a record: what went wrong and what you did.
- It builds a habit of understanding failures instead of fleeing them.

## The steps

1. **Find the root cause.** Not just the symptom.
2. **Write the fix** as a normal change, with a merge request.
3. **Watch the pipeline** until it is green.
4. **Add a gate.** Add a test or a check that would have caught the problem, so it cannot merge again.
5. **Note it in the decision log** if the failure taught you something.

## If several things fail at once

If each fix fails because of the others, ship one combined fix that turns everything green together.

## The one exception

Only active harm justifies taking something out: a leaked secret, data loss in progress, or an outage that hurts customers right now. Even then, the next step is the forward fix that puts the feature back.

"The deadline is today" is not active harm.

## Example

TrailMug launches a new sign-up form. Customers in one country cannot submit it. Maya does not remove the form. She finds that the phone-number check rejects local formats. She fixes the check, adds a test with five phone formats, and ships. The test now guards every future release.

## Key points

- Fix the cause. Do not hide it.
- Add a test or check so the same class of bug cannot merge again.
- Only active harm justifies taking work back out.
