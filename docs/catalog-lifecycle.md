# Catalog lifecycle: maintainer workflow

The published catalog is a set of learning starting points, not a promise that a tool is safe, compatible or professionally approved. This workflow assigns responsibilities to roles, not named people. A maintainer taking a review records who actually performed it in the issue or MR; an unassigned review remains unassigned. The [handbook](handbook.md#8-quarterly-and-half-yearly-jobs) explains the existing resource refresh job and MR process.

## What to review

| Material | Responsible role | Cadence and change triggers | Evidence to record |
| --- | --- | --- | --- |
| Resource links, learning claims and terms | Catalog maintainer | Quarterly; also a broken-link report, publisher change or learner report | URL, date opened, title, access and cost, source of any replacement |
| Armory harnesses, models, integrations and skills | Catalog maintainer; security or technical specialist when needed | Quarterly; also a permissions, version, pricing, license, provenance, security or API change | Official or clearly identified community source, versions and scope checked, access and limits; distinguish documentation review from a runtime test |
| Arena comparisons | Benchmark maintainer | Before publication and when versions, pricing or methodology change | Dated configuration, source, method, limitations and reproducible results; retain older results with their dates |
| Kata artifacts and exercises | Kata maintainer | Quarterly and whenever a source, stack or expected output changes | The exact steps and environment actually checked, artifact provenance, failed or untested steps, and available alternative |
| Standards and regulated or safety-critical use | Domain maintainer and qualified reviewer when required | Before publishing a standards claim, on a revision or when intended use changes | Standard and edition, jurisdiction and scope, actual reviewer and decision if review occurred; distinguish practice output from independently approved deliverables |

The role taking responsibility for each item and its next review should be recorded in its tracking issue or MR. If specialist review is needed but unavailable, keep the affected claim unverified and assign or escalate the issue rather than inventing an approval. Coordinate PHANTOMS-dependent changes through issue #64.

The Armory starter registry currently has one shared documentation date. Update that date only after every entry's stated documentation and linked license information have been checked. A partial review belongs in an issue or MR and must not reset the shared date. Use entry-level dates if the registry is later maintained independently per entry.

## States and response

These are descriptions for a maintainer to use in an issue or visible notice; they do not assert an automated check passed.

- **Checked:** cite what was checked, by whom and when, and what was outside the check. A working URL alone does not verify a product's permissions or safety.
- **Review due:** the check is older than its cadence, missing, or a relevant change is reported. Keep the last actual check date and tell learners to consult the source. The Armory registry displays this after 90 days using the visitor's clock; without JavaScript it still shows the date and a reminder. The quarterly `stale_resources` job covers resource YAML files, not the Armory.
- **Unavailable or unsafe to recommend:** a source is gone, access has materially changed, or a significant unresolved concern makes its instructions unsuitable. Clearly explain the limitation, remove or disable unsafe instructions as appropriate, and offer a verified alternative if one exists. Do not represent an unverified substitute as equivalent.

## Handling a change

1. Open or update an issue identifying the affected page, source, discovery date, impact, evidence and responsible role. Do not put credentials, private learner work or sensitive reports into a public issue.
2. Compare the current publisher documentation, version, terms, cost, required permissions and read/write behavior with what the page claims. Inspect executable skill instructions and scripts; a documentation check is not a security audit. For blocked links, record that the source is unverified rather than calling it broken.
3. Decide whether to update, offer an alternative, mark review due or withdraw the recommendation. Preserve working internal routes and local progress; use an honest fallback instead of removing a whole learning path when possible. Escalate professional review where the intended use requires it.
4. Keep the old evidence in the issue, MR history or dated benchmark record, including the former version and date. Explain what changed, what was actually tested and what remains uncertain. Update a verification date only after performing the stated check; do not backdate it or make a blanket claim for unreviewed entries.
5. Submit a branch and MR through the existing checks and review gates. Verify the published notice and links after deployment. Schedule the next review and close the tracking issue only for work actually completed.

### Practice the workflow

Use a reported integration change as a tabletop exercise: select an existing Armory entry, compare its linked permissions documentation with the page, and draft an issue with the source, date, observed difference, impact, proposed fallback and required reviewer. If no change is found, record that outcome instead. This exercise is a rehearsal until a real review and its evidence have been recorded; it is not a security assessment.
