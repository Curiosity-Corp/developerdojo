---
title: "Catalogue governance and the completion checklist"
description: "The rules that keep the four catalogues true over time: one owner, review dates, change records, facts versus proposals, no secrets, and the eight-point completion checklist."
section: "Catalogue framework"
order: 6
level: core
duration: "45 min"
outcomes:
  - "Apply the nine governance rules to your catalogues."
  - "Separate confirmed facts, decisions, proposals and items to validate."
  - "Record a material change with owner, reason and affected sections."
  - "Use the completion checklist to decide whether a catalogue is finished."
resources:
  - atlassian/change-management
  - atlassian/itsm
  - gitlab/codeowners
  - gitlab/merge-requests
  - owasp/secrets-management-cheat-sheet
  - google-sre/embracing-risk
prerequisites:
  - catalogue-framework-overview
---

A catalogue that was true last quarter and nobody maintained is worse than none. It looks like knowledge and it misleads. **Governance** is the small set of rules that keeps the [four layers](/library/catalogue-framework-overview) true, owned and reviewed.

## Why it matters

Catalogues fail slowly. A service is renamed, an owner leaves, an integration is switched off, and the page still says the old thing. Three months later an agent or a new colleague builds on it. Governance makes the failure visible early: every catalogue has an owner, a version and a next review date.

## The nine rules

| # | Rule | In practice | TrailMug example |
|---|---|---|---|
| 1 | One current Master Catalogue per product | One file in git, one path | `catalogue/master.md` in the planning repository |
| 2 | Lower catalogues name their product and link to Master | Metadata header with a link | ORBITAL page links to master.md |
| 3 | Each catalogue has an owner and a review rhythm | Owner, version, last updated, next review | Owner: product manager. Review every quarter. |
| 4 | Separate facts, decisions, proposals and items to validate | Four labels in the text | "Fact:", "Decision:", "Proposal:", "To validate:" |
| 5 | Do not call a plan operational until verified | Use PLANNED until evidence | The returns service stays PLANNED until it answers in production |
| 6 | Record material changes | Date, decision owner, reason, affected sections | Change note at the bottom of the page |
| 7 | Keep high levels short | Link runbooks and procedures | The row links the runbook, not its text |
| 8 | Never store secrets | Names only | `EMAIL_API_KEY` is named; its value is not |
| 9 | Report status with measures | Deliverables, evidence, blockers, owner, expected date | "ORBITAL: 7 of 7 elements done; blocker: budget owner; owner Maya; due 2027-04-15" |

## Facts, decisions, proposals, validation

Use four plain labels so a reader knows what to trust.

| Label | Meaning | Example |
|---|---|---|
| Fact | Verified, with evidence | "The site is live. Opened 2027-03-02." |
| Decision | Approved by a named owner, with date | "Use sender A. Decided by operations lead on 2027-02-03." |
| Proposal | Suggested, not approved | "Proposal: move refunds to a weekly batch." |
| To validate | A claim nobody has checked | "To validate: the CRM mirror is off." |

## Recording a material change

A change is **material** if it changes what exists, what it promises, who owns it, or what an agent may do.

| Field | Example |
|---|---|
| Date | 2027-03-18 |
| Decision owner | Product manager (placeholder: Maya) |
| What changed | Returns service moved from PLANNED to FOUND |
| Why | It answered a test request in production |
| Affected sections | Master row 3, ANDROID deployment record, Tech reliability |

Link the [change record](/library/template-change-record) when the change touched production.

## The completion checklist

A product catalogue is ready for review when all eight points are true.

- [ ] The Master Catalogue inventories repositories, services, addresses, types, purposes, dependencies, owners, access and findings.
- [ ] Entries are FOUND, NOT FOUND or PLANNED, with evidence or search scope recorded.
- [ ] ORBITAL defines all seven elements and connects the objective to measurable indicators.
- [ ] ANDROID covers all seven stages and names the relevant integrations, agents and deployment environments.
- [ ] Tech documents the shared foundation and the product-specific flavour.
- [ ] All catalogues are cross-linked, versioned, owned and reviewed.
- [ ] Proposals and assumptions are clearly separate from verified implementation.
- [ ] Credentials and secrets live only in an approved secret store.

## Steps to apply governance

1. Put the four pages in git, reviewed by merge request like code.
2. Add the [metadata header](/library/catalogue-metadata-and-fields) to each page.
3. Name an owner. Use a [CODEOWNERS file](https://docs.gitlab.com/ee/user/project/codeowners/) if your host supports it.
4. Put the next review date in a calendar, not only in the page.
5. At each review, mark every item Fact, Decision, Proposal or To validate.
6. Run the checklist. Record the result in the change note.
7. Search every page for secrets before merging.

## Working with AI agents

- **May:** find pages past their review date, find terms that differ between layers, search for patterns that look like keys, draft change notes.
- **May not:** set a status to FOUND or Approved, change an owner, or merge a catalogue change on its own.
- **Disclose:** record which parts an agent drafted.
- **A safe brief:** "Search these four pages for text that looks like a password, key or token. Report file and line only. Do not print the value."

## Common mistakes

1. **No review date.**
2. **An owner who is a team of ten.** Name one accountable person.
3. **Facts and proposals mixed in one sentence.**
4. **Changing a page without a change note.**
5. **A secret pasted "just for now".**
6. **A checklist ticked without opening the evidence.**

## Practice

1. Add owner, version and next review to your Master page.
2. Label ten sentences from your catalogue Fact, Decision, Proposal or To validate.
3. Write a change note for the last real change you made.
4. Run the checklist on your own work and list what blocks approval.

## The 2030 Product Development Manager lens

- **You decide:** the review rhythm, who owns what, and when a layer is approved.
- **You delegate to agents:** overdue-review reports, secret scans, cross-layer consistency checks, drafts of change notes.
- **A sample brief:** "List every catalogue page whose Next review date is in the past. Give path and date. Do not edit."
- **You verify by:** reading the evidence behind two ticked checklist items.
- **Disciplines involved:** operations, security, compliance, product and finance.
- **On the agent ladder:** this page is **govern**. It is the written rulebook that lets you **delegate** and **orchestrate** without losing accountability.

## Further learning

Next: [metadata and fields, explained](/library/catalogue-metadata-and-fields). Then see all nine rules applied in the [full TrailMug example](/library/catalogue-trailmug-full-example).
