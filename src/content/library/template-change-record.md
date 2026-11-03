---
title: "Template: Change record"
description: "A merge request template that records the reason, risk, recovery plan and checks for a change."
section: "Templates"
order: 9
---

Save as a merge request template in your repo (for example `.gitlab/merge_request_templates/Change.md`). The merge request becomes the change record. See [Service management in git](/library/itil-in-git).

```text
## Summary
<One or two plain sentences: what changes and why.>

## Change record
- Type: standard | normal | emergency   (add a label change-<type>)
- Service(s) from the catalogue (ids): <id>
- Tracker issue: Closes #<n>
- Change owner (human): <name>
- Risk decision made by (human): <name>     (an agent may not sign this line)

## Risk assessment (normal and emergency)
- Impact: <who and what could be affected>
- Likelihood: low | medium | high, because <reason>
- Blast radius: one user | one tenant | one service | many services
- Data touched / class: <class>, migration? yes/no
- Existing data shapes in production: <answer>
- Dependencies affected: <list>
- Window: <date, time zone, why then>; user-visible downtime: none | <minutes>

## Recovery plan (fix forward)
- If this goes wrong we will: <forward fix steps, who, how long>
- Switch to stop harm (not a revert): <name and where it is set>
- Gate we will add if it fails: <test, check or rule>

## How it was checked
- Tests and pipeline link: <link>
- Staging: same image digest as production? <digest>
- Verified in the running service: <what you clicked or called>
- Licence check: <pass / flag>
- Scan results and bill of materials: <link>

## After merge
- [ ] Delivery from git finished and healthy
- [ ] Watched logs and monitoring for 15 minutes
- [ ] Catalogue entry, runbook and decision record updated
- [ ] Tracker issue closed

## Emergency only: active harm
- Harm: leaked secret | data loss in progress | customer-facing outage
- Incident issue: #
- Told: <owner> at <time>. Review within 48 hours: yes
- Forward-fix issue to restore the feature: #

## AI use
- Tool and what it did:
- What I checked myself:

## Review
- Reviewed by (not the author): <name>
- Approved at: <date, time>   Conditions: <text>
```

## Incident review (blameless)

```text
Incident: <title>   Date:   Lead:
What happened (timeline):
Impact (who, how long):
Root cause:
What went well:
What we change (each with an owner and a date):
Gate we added:
```
