# Change Record

Change Record

Blank template. Chapter 13, section 4.8. Starter file: training/capstone/change-record.md (Change.md).

> SOURCE OF TRUTH: git, not this file The Developer Dojo site and its git repository are the source of truth for this program. Read the matching template page in the Library on the Developer Dojo site. This file is a copy for you to fill in. Do not treat it as the master and do not edit it to change the program. To suggest a change to the program, open a merge request in the program's git repository.

> MAKE YOUR OWN COPY FIRST. In git, the merge request IS the change record: this form is the Change.md template at .gitlab/merge_request_templates/Change.md. Types: standard, normal, emergency (label change::<type>). The risk decision line carries a human name. An agent may not sign it. We fix forward: no revert.

## Summary

One or two plain sentences: what changes and why.

| Summary |
|---|
|  |
|  |

## Change record

| Field | Your answer |
|---|---|
| Type (standard \| normal \| emergency) and label change::<type> |  |
| Service(s) from the catalog (ids) |  |
| Tracker issue (Closes group/repo#N) |  |
| Change owner (human) |  |
| Risk decision made by (human; an agent may not sign this line) |  |

## Risk assessment (normal and emergency)

| Question | Your answer |
|---|---|
| Impact: who and what could be affected |  |
| Likelihood: low, medium or high, because ... |  |
| Blast radius: one user, one tenant, one service, many services |  |
| Data touched, class, migration? yes or no |  |
| Existing data shapes in production (what rows already exist?) |  |
| Dependencies affected (catalogue depends-on) |  |
| Window: date, time zone, why then. User-visible downtime: none or minutes |  |

## Recovery plan (fix forward)

| Question | Your answer |
|---|---|
| If this goes wrong we will (forward-fix steps, who, how long) |  |
| Feature flag or switch to stop harm (not a revert): name and where it is set |  |
| Gate we will add if it fails (test, check or rule) |  |

## How it was checked

| Question | Your answer |
|---|---|
| Tests run, pipeline link |  |
| Staging: same digest as production? (promote the SAME digest, sha256:...) |  |
| Verified in the running service: what you clicked or called |  |
| Licence gate (SERVICE_EXPOSURE internal or external): PASS or FLAG |  |
| Scan result and SBOM link |  |

## After merge

☐  GitOps controller synced and healthy

☐  Monitoring and logs looked at for 15 minutes

☐  Catalog entry, runbook and ADR updated if they changed

☐  Tracker issue closed

## Emergency only: active harm

Only for a leaked secret, data loss in progress or a customer-facing outage. 'The deadline is today' is not an emergency.

| Question | Your answer |
|---|---|
| Harm (leaked secret, data loss, customer-facing outage) |  |
| Incident issue |  |
| Owner told, at what time. Review within 48 hours: yes |  |
| Forward-fix issue to restore the feature |  |

## Capstone sign-off (mentor as change advisory board)

| Field | Your answer |
|---|---|
| Reviewed by (not the author) |  |
| Approved at (date and time UTC) and conditions |  |
