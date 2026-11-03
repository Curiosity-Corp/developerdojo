---
title: "Template: Change record"
description: "The Master Developer change record, field by field: summary, risk, fix-forward recovery plan, checks, after-merge list and the emergency section, with a TrailMug example."
section: "Templates"
order: 9
level: advanced
duration: "60 to 90 min for a first record"
outcomes:
  - "Write a change record in which a named human makes the risk decision."
  - "Choose the right change type: standard, normal or emergency."
  - "Plan recovery by fixing forward, with a switch that stops harm, not a revert."
  - "Show how the change was checked, including promoting the same digest."
resources:
  - atlassian/change-management
  - atlassian/incident-management
  - atlassian/itsm
  - google-sre/managing-incidents
  - google-sre/postmortem-culture
  - axelos/itil
  - gitlab/merge-requests
prerequisites:
  - templates-overview
  - template-catalogue-entry
  - deck-15-itil-in-git-change-and-incident
---

The change record is a Master Developer template. It belongs to **Track B, week 4** and to capstone day 4, and it is the heart of Gate 4. It records one change to a running service: what, why, how risky, how to recover and how it was checked.

## Download the blank template

- Word file (original format): [template-8-change-record.docx](/templates/template-8-change-record.docx)
- Markdown copy, to keep in git: [template-8-change-record.md](/templates/template-8-change-record.md)

Make your own copy first. In git, **the merge request is the change record.** This form is the template you paste into the description of the merge request, as a merge request template named Change. You do not keep a second paper record that could disagree with it. That is critical behaviour B5.

## Why it matters

Every outage starts as a change somebody believed was safe. A change record makes the belief visible: who is affected, how likely a problem is, how large the damage could be, how you stop it and how you move forward. It also puts one human name on the risk decision. Software can prepare and check. A person decides, and a person is accountable.

The template also carries the program's rule: **we fix forward.** When a change causes trouble, the repair is a new change that moves forward. We do not roll back shipped work. We keep a switch (a feature flag) that stops the harm while the forward fix is written. Reverting is not on the plan.

## Key ideas

- **Change type:** **standard** (pre-approved, low risk, routine), **normal** (needs a risk assessment and a review) and **emergency** (only for active harm). Label the merge request `change::standard`, `change::normal` or `change::emergency`.
- **Risk decision:** the human sentence "I accept this risk". An agent may not sign it.
- **Blast radius:** how far a problem would spread: one user, one tenant, one service or many services.
- **Fix forward:** repair by a new change. No revert.
- **Feature flag:** a switch that stops harm without a revert. You name it and say where it is set.
- **Gate:** a test, check or rule you add so the same failure cannot pass again.
- **Same digest:** the exact image that ran in staging is the one promoted to production, identified by its sha256 digest.
- **Emergency:** only a leaked secret, data loss in progress or a customer-facing outage. "The deadline is today" is not an emergency.

## How to fill it: steps

1. **Write the summary.** One or two plain sentences: what changes and why.
2. **Fill the change record table.** Type, services from the catalogue, the tracker issue, the change owner and the person who makes the risk decision.
3. **Do the risk assessment** for normal and emergency changes. Seven questions.
4. **Write the recovery plan.** Forward-fix steps, the flag, and the gate you will add if it fails.
5. **Record how it was checked.** Tests, pipeline, staging digest, what you clicked in the running service, licence gate, scan and bill of materials.
6. **After merge,** tick the four boxes.
7. **If it is an emergency,** fill the last section and get a review within 48 hours.
8. **In the capstone,** the mentor acts as the change advisory board and signs.

## Every field explained

### Summary and change record

| Field | What to write | TrailMug example (fictional) |
|---|---|---|
| Summary | One or two sentences | Add a refund status field to the returns service and show it in the app, so a commuter can see where her deposit is. |
| Type and label | standard, normal or emergency, and the label | normal, label change::normal |
| Service(s) from the catalogue (ids) | Catalogue ids | trailmug-svc-returns, trailmug-app |
| Tracker issue | Closes group/repo#N | Closes trailmug/trailmug-planning#14 |
| Change owner (human) | A name | The operations lead (placeholder: Leo) |
| Risk decision made by (human) | A name. Not an agent | The product owner (placeholder: Maya) |

### Risk assessment

| Question | What to write | TrailMug example |
|---|---|---|
| Impact: who and what could be affected | The people and systems | Commuters who return cups; the refund email |
| Likelihood: low, medium or high, because ... | A level and a reason | Medium: a new field changes the refund message format |
| Blast radius | One user, tenant, service or many | One service plus the app screen |
| Data touched, class, migration? | Yes or no, with class | Refund records, confidential; one column added; yes, a migration |
| Existing data shapes in production | What rows already exist | 12,000 refund rows have no status; they default to "unknown" |
| Dependencies affected | Catalogue depends-on | trailmug-pay, trailmug-int-email |
| Window: date, time zone, why then. Downtime | A time and a reason | Tuesday 10:00 UTC, low traffic; no downtime expected |

### Recovery plan (fix forward)

| Question | What to write | TrailMug example |
|---|---|---|
| If this goes wrong we will | Forward-fix steps, who, how long | Hide the status field with the flag; fix the mapping; ship a corrected change within four hours; owner: operations lead |
| Feature flag or switch to stop harm | Name and where it is set | `refund_status_visible`, set in the app settings service |
| Gate we will add if it fails | A test, check or rule | A test that fails if an old row has no status |

### How it was checked

| Question | What to write | TrailMug example |
|---|---|---|
| Tests run, pipeline link | A link | Pipeline link in the merge request |
| Staging: same digest as production? | The sha256 digest | sha256:... promoted unchanged from staging |
| Verified in the running service | What you clicked or called | Returned a test cup; saw the status change in the app |
| Licence gate (internal or external) | PASS or FLAG | PASS |
| Scan result and bill of materials | Link | Scan: no critical findings; software bill of materials attached |

### After merge

- [ ] The GitOps controller synced and shows healthy.
- [ ] I looked at monitoring and logs for 15 minutes.
- [ ] The catalogue entry, runbook and ADR are updated if they changed.
- [ ] The tracker issue is closed.

### Emergency only: active harm

| Question | What to write |
|---|---|
| Harm (leaked secret, data loss, customer-facing outage) | The harm in one sentence |
| Incident issue | A link |
| Owner told, at what time. Review within 48 hours | A time and yes |
| Forward-fix issue to restore the feature | A link |

### Capstone sign-off (mentor as change advisory board)

| Field | What to write |
|---|---|
| Reviewed by (not the author) | The mentor's name |
| Approved at (date and time UTC) and conditions | A time and the conditions |

## A filled example in short

```text
Type: normal (change::normal)
Summary: add a refund status to the returns service and the app.
Services: trailmug-svc-returns, trailmug-app
Risk decision by: named product owner (not an agent)
Impact: commuters returning cups.  Likelihood: medium.  Blast radius: one service.
Data: 12,000 existing rows get status "unknown" by default.
Recovery: set flag refund_status_visible to off, then fix forward within 4 hours.
Gate if it fails: a test that fails when an old row has no status.
Checked: same digest as staging; test cup returned; scan clean.
```

## Working with AI agents

- **May:** format a record you wrote. Collect the pipeline link, the digest and the scan report. Check that every field is filled. Run the tests.
- **May not:** make or sign the risk decision. May not choose "standard" for a risky change. May not revert shipped work.
- **Never:** put a password, key or token into the record.
- **Disclose:** one line in the record, for example "Agent collected the scan link; I read the scan".
- **A safe brief:** "Read this change record. List every field that is empty. Check that the digest in 'How it was checked' equals the digest in the staging deployment. Do not fill or change anything."

## Common mistakes

1. **No named human on the risk decision.** "The team" is not a person.
2. **A revert as the recovery plan.** Write the flag and the forward fix.
3. **A separate paper record.** The merge request is the record. A second record can disagree.
4. **"Emergency" for a deadline.** Emergency needs active harm.
5. **Different digests in staging and production.** Promote the same digest.
6. **Existing data forgotten.** Say what rows already exist.
7. **No gate after a failure.** Every failure ends with a new check.
8. **Skipping the after-merge boxes.** Watch the first 15 minutes.

## Practice

1. Choose a small change in a practice repository. Fill the full record.
2. Write the recovery plan twice: once as a revert, once as flag plus forward fix. Say why the second is better.
3. Pretend the change failed. Write the gate that would have caught it.
4. Ask a mentor to act as the advisory board and sign.

## Checklist

- [ ] The type and the label match.
- [ ] A named human made the risk decision.
- [ ] The risk questions are answered, including existing data.
- [ ] The recovery plan has a flag, a forward fix and a gate.
- [ ] Staging and production use the same digest.
- [ ] I verified in the running service.
- [ ] The four after-merge boxes are ticked.
- [ ] No secret appears in the record.

## The 2030 Product Development Manager lens

- **You decide:** the risk you accept, the window, and when to stop the harm.
- **You delegate to agents:** collecting evidence, running checks, drafting the timeline of an incident from logs after you named the commander.
- **A sample brief:** "Read the merge request and the pipeline. List the checks that ran and their result. Quote the line that shows the digest. Do not approve anything."
- **You verify by:** opening the running service and doing the user action yourself.
- **Disciplines involved:** service management, operations, security, legal (licence gate), engineering and leadership.
- **On the agent ladder:** the record is **govern**. It states the rules a change must pass, and a human is the final gate.

## Further learning

[Deck 15](/library/deck-15-itil-in-git-change-and-incident) teaches change and incident work in git. The [Track B gates](/library/rubric-track-b-gates) show how Gate 4 uses this record, and the [capstone rubric](/library/rubric-capstone) lists the mandatory items. The earlier [catalogue entry template](/library/template-catalogue-entry) feeds the "services" field.
