---
title: "Case study: DanHup decision record, catalogue entry and change record"
description: "Templates 6, 7 and 8 shown for DanHup as clearly labelled illustrations: a draft decision record, a catalogue entry and a change record for the first epic, with commentary and no invented facts."
section: "Case study"
order: 5
level: core
duration: "75 min"
outcomes:
  - "See a decision record kept honest: status Proposed, with open fields left open."
  - "See a catalogue entry for a part of the product, with simulated targets marked."
  - "See a change record with a risk decision, a fix-forward recovery plan and a checking section."
  - "Know which facts you must never invent when you fill these templates."
resources:
  - adr/architectural-decision-records
  - spdx/license-list
  - google-sre/embracing-risk
  - backstage/software-catalog
  - atlassian/service-catalog
  - gitlab/merge-requests
prerequisites:
  - case-study-danhup-epics-and-roadmap
  - template-decision-record
  - template-catalogue-entry
  - template-change-record
---

This is page 5, the last page of the DanHup case study. It shows templates 6 ([decision record](/library/template-decision-record)), 7 ([catalogue entry](/library/template-catalogue-entry)) and 8 ([change record](/library/template-change-record)).

**EXAMPLE ONLY, AND ALL OF IT IS ILLUSTRATION.** The source evidence for DanHup contains no decision record, no catalogue entry and no change record. So the pages below are **drafts written to show the format**, built on the first epic from page 4. Nothing here says that DanHup made these decisions. Where a real fact would be needed, for example a licence, a version or a date, the page writes **to be filled from the real file** instead of inventing it.

## Why it matters

Templates 6, 7 and 8 are about trust. A decision record says why a choice was made. A catalogue entry says who owns a part and what it promises. A change record says what could go wrong and how the team would fix it forward. These three are the easiest to fake, and the most harmful when faked. A licence that was never read, an owner who does not exist, a "tested" box that nobody ticked: each one hides a risk. The honest version often looks less polished. That is the point.

## Key ideas

- **Status is part of the truth.** A draft is "Proposed", not "Accepted".
- **Read the file, then write the licence.** Never write it from memory or from an agent's answer.
- **Simulated is a word.** A target nobody measured is marked simulated.
- **A human makes the risk decision.** The change record names a person, not an agent.
- **Recovery means fix forward.** The plan says how to go on, not how to undo.

## Step 1: Template 6, a draft decision record

The first epic needs a simple count of visitors who reach sign-up (milestone E1-M4). The question for the record: should the team use an open-source tool for it, build a small counter, or use none?

| Field | Entry |
|---|---|
| ADR number and short title | ADR-0001: How to count visitors who reach sign-up (illustration) |
| Status | **Proposed.** Nobody has decided. |
| Date | To be filled when decided |
| Deciders (human names) | The DanHup product manager and the engineering owner of the app (roles only; names stay in the private repository) |
| Ladder rung | Not yet chosen. Options: (b) use as it is, (b+) use with configuration, (c) build on, (d) fork, or REJECT |
| Catalogue entity (slug) | The site, once the entry in Step 2 exists |
| GitLab issue and MR links | To be added when the issue exists |

| Section | Entry |
|---|---|
| 1. Context | Epic 1 needs one number: the share of visitors who reach sign-up. MUST: it counts without storing personal data. MUST: the planner can read it without code access. SHOULD: it can be switched off. |
| 2. Alternatives scanned | **Not done yet.** The scan must record a date, where it looked, and three to five candidates, each with the licence id read from its LICENSE file and a fit percentage. Candidates below are placeholders: Candidate A, Candidate B, Candidate C. A fourth option is "build a counter of about one page of code". |
| 3. Licence | **To be filled from the real files.** For each candidate: licence id, the file read, the date, and the usage pattern (run as a separate service, unmodified or not). Do not write a licence from memory. |
| 4. Fit | To be computed with the program's formula once the MUST and SHOULD needs are scored |
| 5. Decision | "We will ..." is left empty until the status changes |
| 6. Tech-debt statement | Needs an owner, the debt in words and numbers, triggers to reopen, and a review date within six months |
| 7. Exit plan | Needs: how we leave, where the data goes, what replaces it, how long it takes |
| 8. Consequences | Needs positive, negative and follow-up issues |

**Commentary.**

1. Section 2 and 3 say "not done yet". That is a correct entry for a draft. A record that fills the licence line before anyone opened the file is worse than an empty line, because it looks like evidence.
2. The status is Proposed. The epics page had one decision that blocks work: who may sign up. That is a business decision, not an open-source one, so it belongs in its own short record, not in this one. Keep one decision per record.
3. The deciders are roles here. In your own private repository, write real names.
4. If every candidate is dropped, the record still has value. Status REJECT with the reasons stops the next person from repeating the scan.

## Step 2: Template 7, a catalogue entry

The catalogue entry below describes one part of DanHup that the repository map already shows: the public site. Every field comes from page 2, or says so.

| Field | Entry | Where it comes from |
|---|---|---|
| id | danhup-site | Chosen here, lowercase with hyphens |
| name | DanHup public site | Page 2, repository map row 1 |
| kind | service | The site is a running part of the product |
| owner | **Not named.** The map says the owner is not named. Write a role once someone accepts it. | Page 2 |
| tier | To be decided. Interim tag: tier-N | Nobody has set it |
| lifecycle | active | The landing page is live |
| description | Public landing page "Candidate Placement" with an email capture form. | Page 2 |
| repos | The site repository (group and name to be written from the real path) | Page 2 |
| dependencies | The email-capture service. Later, the app. | Pages 2 and 3 |
| slt.availability | simulated | Not measured |
| slt.latency_p95_ms | simulated | Not measured |
| slt.support_response | To be decided | No support process was found |
| support.contact | **Nobody.** | The integrations register says the email-capture service has no owner |
| support.issue_tracker | The site repository's issue list | Assumed from the repository |
| runbook | None found | NOT FOUND |
| data_classification | Internal, because the form collects email addresses. To be confirmed. | An email address is personal data |
| adrs | ADR-0001 (draft) | Step 1 |
| licences | Not yet | Step 1 |
| links | The site, the repository | Page 2 |
| tags | tier-N, data-internal, marketing | Interim tags |

**Commentary.**

1. Look at the "Where it comes from" column. Every cell has a source, and cells with no source say so. That column is not in the template. Add it when you teach someone else, because it keeps you honest.
2. Three cells say "Nobody" or "NOT FOUND": owner, support contact and runbook. In a real catalogue these are your work list for the quarter.
3. The data class is a guess with a reason. Say **to be confirmed** and name who confirms.
4. The targets are marked **simulated**. A promise nobody can measure is not a service level.

## Step 3: Template 8, a change record

This record describes milestone E1-M3 from page 4: the notify-me form sends a first reply and records the visitor. It is a draft written before the change, which is when a change record is most useful.

| Field | Entry |
|---|---|
| Summary | The notify-me form sends a short first reply and records the visitor in the email-capture service. |
| Type and label | normal, label change::normal |
| Service(s) from the catalogue | danhup-site |
| Tracker issue | To be added when the issue exists |
| Change owner (human) | The marketing owner of the site (role; no one is named yet, which is itself a finding) |
| Risk decision made by (human) | The DanHup product manager (role) |

| Risk question | Entry |
|---|---|
| Impact | Visitors who give their email address; the people who read the replies |
| Likelihood | Medium, because the reply goes to real people and the wording may promise what the app does not do yet (epic 1 risk) |
| Blast radius | One service: the site, plus the email-capture service |
| Data touched | Email addresses, class internal, no migration |
| Existing data shapes in production | Addresses already captured by the form. How many is not known. Count them before the change. |
| Dependencies affected | The email-capture service |
| Window | Outside working hours of the main audience. The exact time is to be chosen. |

| Recovery question | Entry |
|---|---|
| If this goes wrong we will | Turn off the reply, correct the wording, and send a corrected message within a day. Do not delete the captured addresses. Owner: the marketing owner. |
| Feature flag or switch to stop harm | A single setting that disables the automatic reply. Name and place to be written when it exists. |
| Gate we will add if it fails | A check that the reply text matches the approved copy |

| Checking question | Entry |
|---|---|
| Tests run, pipeline link | To be added after the pipeline runs |
| Staging: same digest as production? | Not applicable if the site is static. Say so, and record the commit id instead. |
| Verified in the running service | Fill the form with a test address and read the reply |

**Commentary.**

1. The risk decision names a **role**, not an agent. An agent may help draft the table. A person decides whether the risk is acceptable.
2. The recovery plan never says "roll back". It says turn the reply off, correct, and send a corrected message. That is the fix-forward habit in practice.
3. "Existing data shapes in production: not known, count them first" is a good sign. The author saw what was missing.
4. The last section is empty on purpose. A change record is finished after the check, not before.

## Step 4: What these three pages share

| Template | The question it forces | The fact you must never invent |
|---|---|---|
| 6 Decision record | Why this choice, and how do we leave it? | The licence, the version, the fit numbers |
| 7 Catalogue entry | Who owns this and what does it promise? | The owner, the targets, the runbook |
| 8 Change record | What could go wrong and who accepted that? | The tests run, the digest, the verification |

## Working with AI agents

- **May:** read a LICENSE file you point it to and quote the first lines. Check that every path in your entry exists. Draft the tables of a change record from an issue you wrote.
- **May not:** choose the licence from memory, name an owner, mark a test as passed, or make the risk decision.
- **Disclose:** one line in the record, for example "An agent quoted the licence file. I read it too."
- **A safe brief:** "Open the LICENSE file of this repository at this tag. Quote its first ten lines and the file path. Do not summarise and do not add anything."

## Common mistakes

1. **Accepting a draft too early.** Keep the status honest.
2. **Writing the licence from memory.**
3. **Listing a team as the owner.** Name one accountable role.
4. **Presenting simulated targets as measured.**
5. **A recovery plan that only says "roll back".**
6. **Filling the checking section before the check.**

## Practice

1. List three cells of the change record that you could not fill today in your own product, and say what you would do to fill each.
2. Write the one-sentence status of your next decision record: Proposed, and why.
3. Add the "Where it comes from" column to your own catalogue entry.
4. Find one catalogue field in Step 2 that you would not trust and say what evidence would change your mind.

## Checklist

- [ ] My decision record has an honest status.
- [ ] Every licence was read from a real file, with the date.
- [ ] My catalogue entry marks simulated targets as simulated.
- [ ] Every owner is a role or a person, never a team of ten.
- [ ] My change record names a human who made the risk decision.
- [ ] My recovery plan goes forward.

## The 2030 Product Development Manager lens

- **You decide:** the status, the owner, the risk and whether a licence is acceptable.
- **You delegate to agents:** quoting licence files, checking that paths in a catalogue entry exist, drafting a change record from an issue you wrote.
- **A sample brief:** "For each path in this catalogue entry, say whether the file exists in the repository. Report missing ones. Do not create files."
- **You verify by:** opening the licence file yourself for every record you sign.
- **Disciplines involved:** legal awareness, operations, engineering, security and product.
- **On the agent ladder:** these three templates sit at **delegate with checks**. They are also where **govern** starts, because someone must own the rules.

## Further learning

Return to [page 1 of the case study](/library/case-study-danhup-the-product-on-one-page) and compare it to your own work. Then read [Week 4](/library/week-4-defend-the-roadmap) for how to defend a roadmap, and the [templates overview](/library/templates-overview) for the blank versions.
