---
title: "Template: Decision record"
description: "A short record of a tool or design decision: what, why, alternatives, licence, exit plan."
section: "Templates"
order: 7
---

A **decision record** (also called an ADR, architecture decision record) explains a choice so that someone can understand it in three months. Save it in the repo as `docs/decisions/0001-short-title.md`. Write it while you search, not after the merge.

```text
# Decision 0001: <short title of the decision>

Status: Proposed | Accepted | Rejected | Superseded by <number>
Date: <YYYY-MM-DD>
Deciders: <human names>
Ladder rung: (b) use as is | (c) patch set or fork | (d) build | REJECT
Links: <issue>, <merge request>

## Context
What capability do we need? Which epic or issue asks for it?
MUST and SHOULD list: <link>

## Alternatives scanned
Search date: <YYYY-MM-DD>. Where I looked: <registries, lists, own estate>

| Candidate | Licence (SPDX) | Fit % | Why dropped or chosen |
|---|---|---|---|
|  |  |  |  |

## Licence
SPDX id: . File read: , on <date>.
Use: internal / service / distributed; separate service / linked; modified or not.
Result: pass / flag / needs legal decision.

## Fit
fit % = (2 x MUST met + SHOULD met) / (2 x MUST total + SHOULD total)
Unmet MUST needs and how each will be closed:

## Decision
We will <decision>. Version <version>.

## Tech-debt statement
- Owner:
- Debt (patches, fork or build scope, in numbers):
- Triggers to re-open this decision (numbers):
- Review date (at most 6 months ahead):
(For rung (d): write "we accept the FULL maintenance cost".)

## Exit plan
How do we leave? Where does the data go? What replaces it? How long?

## Consequences
Positive:
Negative:
Follow-up work:
```

## Licence check record

Keep a short companion note for each candidate:

```text
Candidate:        Version:
SPDX id:          Licence file read:      Date:
Subfolders with other licences:
How we use it:    How we connect it:      Do we modify it:
Result and reasoning:
Checked by (human):
```
