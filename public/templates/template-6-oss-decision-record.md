# OSS Decision Record (ADR)

OSS Decision Record (ADR)

Blank template. Chapter 10, sections 9 and 10. Starter files: training/capstone/adr-template.md and licence-check-record.md.

> SOURCE OF TRUTH: git, not this file The Developer Dojo site and its git repository are the source of truth for this program. Read the matching template page in the Library on the Developer Dojo site. This file is a copy for you to fill in. Do not treat it as the master and do not edit it to change the program. To suggest a change to the program, open a merge request in the program's git repository.

> MAKE YOUR OWN COPY FIRST (use Copy to, or Download). In git, the ADR is a Markdown file docs/adr/0001-<short-title>.md and merges in the same MR that adds the tool. This Word file is a paper form for learning. Write it while you search, not after the merge. A human name signs it. An AI may format text you wrote; it may not decide the rung or the licence.

| Field | Your answer |
|---|---|
| ADR number and short title | ADR-0001: |
| Status | Proposed \| Accepted \| Rejected \| Superseded by ADR-NNNN |
| Date |  |
| Deciders (human names) |  |
| Ladder rung | (b) use as is \| (b+) use with config or plugin \| (c) patch set or fork \| (d) build \| REJECT |
| Catalogue entity (slug) |  |
| GitLab issue and MR links |  |

## 1. Context

What capability do we need? Which epic or issue asks for it? Link your MUST and SHOULD list.

| Context |
|---|
|  |
|  |
|  |

## 2. Alternatives scanned

Search date and where you looked: the catalogue search, GitLab, Harbor, registries, topics, awesome-lists, the CNCF landscape. Three to five candidates. A 'no' sends you to the next candidate.

| Candidate | Licence (SPDX id) | Fit % | Why dropped or chosen |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

## 3. Licence

| Question | Answer |
|---|---|
| SPDX id, file read, and date |  |
| Usage: internal, SaaS or distributed? Separate service or linked? Modified or not? |  |
| Split-licence folders (enterprise, ee) and whether our build includes them |  |
| Gate result: PASS \| FLAG \| EXCEPTION. SERVICE_EXPOSURE: internal \| external |  |
| Licence-check record link. Exception asked for (ADR number) or none |  |

## 4. Fit

fit % = (2 x MUST met + SHOULD met) / (2 x MUST total + SHOULD total) x 100. A MUST counts only if you ran it in a throw-away namespace.

| MUST total | MUST met | SHOULD total | SHOULD met | Fit % |
|---|---|---|---|---|
|  |  |  |  |  |

Unmet MUST needs, and how each is closed (configuration, extension point, upstream pull request, patch, build):

| Unmet MUST need | How it is closed |
|---|---|
|  |  |
|  |  |
|  |  |

## 5. Decision

We will ... Version ... Image: <registry>/<project>/<image>.

| Decision |
|---|
|  |
|  |

## 6. Tech-debt statement

| Field | Your answer |
|---|---|
| Owner (name and team) |  |
| Debt in words and numbers (patches, fork or build scope) |  |
| Triggers to re-open this ADR (numbers, for example patch set above 400 lines) |  |
| Review date (at most 6 months ahead) |  |

Rung (d): write that we accept the FULL maintenance cost.

## 7. Exit plan

How do we leave? Where does the data go? Which tool replaces it? How long does it take?

| Exit plan |
|---|
|  |
|  |
|  |

## 8. Consequences

|  | Your answer |
|---|---|
| Positive |  |
| Negative |  |
| Follow-up work (issues) |  |

## Appendix: licence-check record

Fill one for each candidate you keep. Chapter 10, section 10.

| Item | Your answer |
|---|---|
| Component, version, repository URL and tag |  |
| Checked on, and by whom |  |
| Top-level LICENSE file: summary and path |  |
| Package metadata licence (SPDX id) |  |
| Split licences (enterprise, ee, vendored): list, and does our build include them? |  |
| Tree scan: tool, command and result (ScanCode or ORT, syft and grype, trivy fs --scanners license) |  |
| Dependencies with copyleft or unknown licences, and how we use each |  |
| Usage pattern: internal, SaaS or distributed; separate or linked; modified or not; dual-licence branch |  |
| Obligations: notices, NOTICE file, source offer, patent terms |  |
| Compatibility matrix cell (licence row, usage column, code: OK, OK+N, SRC, LEGAL, NO) |  |
| Result: PASS \| PASS with flag \| EXCEPTION needed (ADR number) \| REJECT, with a two-line reason |  |
| Human who signed (a licence is not an agent decision) |  |
