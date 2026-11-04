---
title: "Template: Open source decision record (ADR)"
description: "The Master Developer decision record, field by field: context, alternatives, licence, fit, decision, tech debt, exit plan, consequences and the licence-check record."
section: "Templates"
order: 7
fillable: "template-6-oss-decision-record"
level: advanced
duration: "2 to 3 hours for a first record"
outcomes:
  - "Write an architecture decision record before the tool is adopted, not after."
  - "Choose a rung of the open-source-first ladder and explain it."
  - "Work out a fit percentage with the formula and list unmet MUST needs."
  - "Fill a licence-check record from the licence file, with a human name signing it."
resources:
  - adr/architectural-decision-records
  - choosealicense/choose-a-license
  - spdx/license-list
  - osi/licenses
  - opensource-guide/legal
  - reuse/reuse-software
prerequisites:
  - templates-overview
  - deck-12-oss-first-ladder-and-licences
---

The decision record is a Master Developer template. It belongs to **Track B, week 2** (the open-source-first ladder) and to the capstone, where it is **ADR 0001**. It records why you chose a tool, what you checked, what it costs you later and how you would leave.

## Download the blank template

- Word file (original format): [template-6-oss-decision-record.docx](/templates/template-6-oss-decision-record.docx)
- Markdown copy, to keep in git: [template-6-oss-decision-record.md](/templates/template-6-oss-decision-record.md)

Make your own copy first. In git, the record is a Markdown file, `docs/adr/0001-<short-title>.md`, and it merges in the same merge request that adds the tool. The Word file is a paper form for learning. Write it **while you search**, not after the merge. A human name signs it.

## Why it matters

Tools outlive the people who chose them. Months later someone asks, "Why do we use this?" and no one remembers. A decision record keeps the reason, the alternatives you rejected, the licence you read and the price you accepted. It also protects you in two ways. It stops the habit of choosing first and justifying later. And it forces you to read the licence file before adopting, which is a critical behaviour in the program (B4).

The template follows a ladder: use the tool as it is, use it with configuration or a plugin, patch or fork it, or build it yourself. Each step up costs more to maintain. The record makes that cost visible and puts a name on it.

## Key ideas

- **ADR:** architecture decision record. One short document per significant decision.
- **Ladder rung:** (b) use as is, (b+) use with config or a plugin, (c) patch set or fork, (d) build, or REJECT.
- **SPDX id:** a standard short name for a licence, for example MIT or Apache-2.0.
- **Fit percent:** a score of how well a candidate meets your needs. The formula is below.
- **MUST and SHOULD needs:** MUST means the tool is useless without it. SHOULD means nice to have.
- **Tech-debt statement:** what you will have to keep doing, who does it, and when you reopen the decision.
- **Exit plan:** how you leave, where the data goes and what replaces the tool.
- **Licence gate:** PASS, FLAG or EXCEPTION, depending on how you use the code (internal, SaaS or distributed).

## How to fill it: steps

1. **Write the needs first.** List your MUST and SHOULD needs before you look at any tool. Link them in the Context section.
2. **Scan alternatives.** Find three to five candidates. Search the catalogue, git hosts, container registries, topics, awesome lists and the CNCF landscape. Write the search date.
3. **Read the licence files.** Do not trust a web page or a badge. Open the file in the repository, read it and note the SPDX id and the date.
4. **Compute fit.** Use the formula. A MUST counts only if you ran it in a throw-away namespace.
5. **Choose a rung.** Say which one and why.
6. **Write the decision.** One or two sentences: "We will use ... version ..."
7. **Write the tech-debt statement and the exit plan.**
8. **Write consequences.** Positive, negative, and follow-up issues.
9. **Fill a licence-check record for each candidate you keep.**
10. **Sign.** A human name. An agent may not sign.

The fit formula:

```text
fit % = (2 x MUST met + SHOULD met) / (2 x MUST total + SHOULD total) x 100
```

Worked example: 4 MUST needs and 5 SHOULD needs. A tool meets 3 MUST and 4 SHOULD. Fit = (2 x 3 + 4) / (2 x 4 + 5) x 100 = 10 / 13 x 100 = 76.9 percent. The unmet MUST need must be listed, with a plan to close it.

## Every field explained

### Header table

| Field | What to write | TrailMug example (fictional) |
|---|---|---|
| ADR number and short title | A number and a name | ADR-0001: Email sending service |
| Status | Proposed, Accepted, Rejected or Superseded by ADR-NNNN | Accepted |
| Date | Decision date | 2027-02-03 |
| Deciders (human names) | Real names, in your private repository | Maya (product), Leo (operations) as placeholders |
| Ladder rung | (b), (b+), (c), (d) or REJECT | (b+) use with configuration |
| Catalogue entity (slug) | The id in your catalogue | trailmug-int-email |
| GitLab issue and MR links | Links | issue and merge request URLs |

### The eight sections

| Section | What to write | TrailMug example |
|---|---|---|
| 1. Context | The capability needed, the epic or issue that asks, link to MUST and SHOULD | Send refund and welcome emails. Needs: MUST delivery reports, MUST templates, SHOULD multiple languages |
| 2. Alternatives scanned | Search date, where you looked, three to five candidates with SPDX id, fit percent and why dropped or chosen | Three senders: A (MIT, 82 percent, chosen), B (network copyleft licence, 90 percent, dropped for licence), C (Apache-2.0, 61 percent) |
| 3. Licence | SPDX id, file read, date; usage pattern; split-licence folders; gate result; link to the record | A: MIT, LICENSE read on 2027-02-01, used internally as a separate service, unmodified, gate PASS |
| 4. Fit | The numbers in the formula and a table of unmet MUST needs | 3 of 4 MUST, 4 of 5 SHOULD, 76.9 percent; unmet MUST: bounce reports, closed with a plugin |
| 5. Decision | "We will..." with version and image reference | We will run A version 2.4 as a separate service from our own registry |
| 6. Tech-debt statement | Owner, debt in words and numbers, triggers to reopen, review date within six months | Owner: operations lead. One plugin of 120 lines. Reopen if the plugin passes 400 lines. Review in six months. |
| 7. Exit plan | How we leave, where data goes, what replaces it, how long | Export templates as files; send through the provider's API instead; one week |
| 8. Consequences | Positive, negative, follow-up issues | Positive: no per-email fee. Negative: we run it. Follow-up: add bounce alert (issue) |

For rung (d), write that you accept the **full** maintenance cost.

### Licence-check record (appendix)

| Item | What to write |
|---|---|
| Component, version, repository URL and tag | Exactly what you checked |
| Checked on, and by whom | Date and a name |
| Top-level LICENSE file: summary and path | One sentence and the path |
| Package metadata licence (SPDX id) | The id from the package file |
| Split licences (enterprise, ee, vendored) | List folders with another licence, and whether your build includes them |
| Tree scan: tool, command and result | The scanner you ran and what it said |
| Dependencies with copyleft or unknown licences | List each and how you use it |
| Usage pattern | Internal, SaaS or distributed; separate or linked; modified or not |
| Obligations | Notices, NOTICE file, source offer, patent terms |
| Compatibility matrix cell | Row licence, column usage, code OK, OK plus notice, SRC, LEGAL or NO |
| Result | PASS, PASS with flag, EXCEPTION needed (ADR number) or REJECT, with a two-line reason |
| Human who signed | A name. A licence is not an agent decision. |

## A filled example in short

```text
ADR-0001: Email sending service
Status: Accepted    Rung: (b+) use with configuration
Context: refund and welcome emails (epic E1). MUST: delivery reports, templates.
Alternatives: A (MIT, 82 percent), B (AGPL-3.0, 90 percent), C (Apache-2.0, 61 percent)
Licence: B is dropped. Its network copyleft licence would require us to offer our
  source if users interact with it over the network. A passes.
Decision: run A 2.4 as a separate internal service.
Tech debt: one plugin, 120 lines. Reopen above 400 lines. Review 2027-08.
Exit: export templates; use the provider API; about one week.
Signed: licence checked and signed by a named person (placeholder: Leo)
```

Note the trap in this example. The highest-scoring tool (B) is rejected because of its licence. That is exactly the lesson of Gate 2.

## Working with AI agents

- **May:** format text you wrote. Explain a licence term. Run a licence scan and report its output. Summarise a long README so you read the original faster.
- **May not:** decide the rung, decide the licence result, compute your fit for you, or sign. A licence is not an agent decision.
- **Never:** write the ADR after the choice and pretend it came first.
- **Disclose:** one line per use in your repository.
- **A safe brief:** "Run a licence scan on this repository and list each licence found with the file path. Do not interpret the results."

## Common mistakes

1. **Writing the record after the choice.** It becomes a story, not a decision.
2. **"MIT, I think."** Open the file and write the path and date.
3. **No unmet MUST list.** A fit number with no list hides the real problem.
4. **A draft ADR left in "Draft".** A pass needs status Accepted.
5. **Ignoring split-licence folders.** Enterprise folders may have another licence.
6. **No exit plan.** If you cannot leave, you are locked in.
7. **"Approved by the team".** A person signs. Use a name.
8. **Counting a MUST you never ran.** A MUST counts only if you ran it in a throw-away namespace.

## Practice

1. Pick a tool you would like to use. Write five MUST and SHOULD needs, then find three candidates.
2. Open each licence file and note the SPDX id. Write the date.
3. Compute the fit for each with the formula. Write the unmet MUST needs.
4. Write a short ADR for the best candidate. Add an exit plan that a stranger could follow.

## Checklist

- [ ] MUST and SHOULD needs were written before I looked at tools.
- [ ] Three to five candidates, each with an SPDX id and a fit percent.
- [ ] The licence file was read and dated for each kept candidate.
- [ ] Unmet MUST needs are listed with a plan.
- [ ] One rung is chosen and explained.
- [ ] The tech-debt statement has an owner, triggers and a review date.
- [ ] The exit plan names the replacement and the time.
- [ ] Status is Accepted and a human name signs.

## The 2030 Product Development Manager lens

- **You decide:** the needs, the rung, the licence result, the debt you accept and who signs.
- **You delegate to agents:** running scans, collecting version and licence data, drafting a table of candidates from your written needs, checking every section is filled.
- **A sample brief:** "Read this ADR. For each of the eight sections, say whether it is filled. For the licence section, check that each SPDX id matches the file path I listed. Do not change anything."
- **You verify by:** opening the licence file for the tool you chose and reading it yourself.
- **Disciplines involved:** engineering, legal, finance (the cost of debt), security and operations.
- **On the agent ladder:** the record is **govern**. It writes down a rule that agents then work inside: which tool, which version, which licence.

## Further learning

[Deck 12](/library/deck-12-oss-first-ladder-and-licences) teaches the ladder and licences. [Deck 13](/library/deck-13-patch-fork-loop) covers the patch-fork loop for rung (c). The [Track B gates](/library/rubric-track-b-gates) and the [capstone rubric](/library/rubric-capstone) show how the record is scored (mandatory items M3, M4 and M8).
