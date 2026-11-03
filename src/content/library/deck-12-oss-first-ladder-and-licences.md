---
title: "Deck 12: The OSS-first ladder, licences and the decision record"
description: "Four rungs for choosing software, the fit percentage, licence families in plain English, the AGPL trap, and the decision record with its licence check."
section: "Teaching deck"
order: 12
level: advanced
duration: "120 min"
outcomes:
  - "Walk the four rungs of the OSS-first ladder and say when each applies."
  - "Calculate a fit percentage and keep the list of unmet MUST needs."
  - "Place a licence in its family and say what it means in plain English."
  - "Write a decision record (ADR) with a licence check record and a tech-debt statement."
resources:
  - opensource-guide/guides
  - opensource-guide/legal
  - choosealicense/choose-a-license
  - osi/licenses
  - spdx/license-list
  - openssf/scorecard
  - adr/adr-github-io
  - cognitect/documenting-architecture-decisions
prerequisites:
  - deck-11-backstage-and-itsm-role-map
  - oss-first-ladder
  - open-source-licences
---

This lesson covers slides 25, 26 and 27. Slide 25 teaches the four-rung ladder. Slide 26 teaches licence families in plain English. Slide 27 teaches the decision record (ADR) and the licence check. It is Track B chapter 10, and it is the part of the program where a wrong answer has legal as well as technical cost.

## Why it matters

Every time a team picks software, it takes on a cost for years: updates, security fixes, a licence duty. "Free" is not the same as "cheap". A Product Development Manager who can run a clear, written search and decision process protects the product from three problems: building what already exists, adopting what you may not legally use, and being unable to explain a choice later.

## Key ideas

### The ladder: four rungs (slide 25)

Always start at the top. Go down only when the rung above fails, and **write down why**.

| Rung | Name | What you do |
|---|---|---|
| **(a)** | Search first | Look in your own estate first, then the world. Do a licence check. Look at a health score. |
| **(b)** | Perfect match | 100 percent of MUST needs met and the licence passes: use as is, configure it, write a short ADR. |
| **(c)** | About 80 percent | Adopt it, carry a small patch set, let an update bot follow upstream, keep the image in your registry. Write an ADR, name an owner. |
| **(d)** | Nothing fits | Build it. Write an ADR with a tech-debt statement: **we accept the full maintenance cost.** |

Rules around the ladder:

- **Free is not the same as cheap.** Check the licence, the health of the project, and the fit.
- **Fit percentage** = (2 × MUST met + SHOULD met) / (2 × MUST total + SHOULD total). MUST needs count double.
- **Keep the list of unmet MUST needs.** A 95 percent tool with one unmet legal MUST is not a 95 percent tool.
- **Gap-closing order for rung (c):** configuration, extension point, upstream pull request, patch set, fork. Try them in that order.
- **A "no" never ends the search.** It sends you to the next candidate. Only an empty candidate list reaches rung (d).

### Licence rules in plain English (slide 26)

| Family | Examples (SPDX id) | In plain English |
|---|---|---|
| Permissive | MIT, BSD-3-Clause, Apache-2.0 | Keep the notice. Safe for closed products. |
| Weak copyleft | LGPL-3.0, MPL-2.0 | Share your changes to the library or file when you distribute. |
| Strong copyleft | GPL-2.0, GPL-3.0 | Distribute it and the whole program goes under the GPL. |
| Network copyleft | AGPL-3.0 | Modify it and let users use it over a network: offer them the source. |
| Source-available | BUSL-1.1, SSPL-1.0, Elastic-2.0 | Not open source. Use is limited, often no competing service. |
| No licence | no file, or custom text | You have no right to use it. Stop. |

An **SPDX id** is a standard short name for a licence. **Copyleft** means: if you pass the software on, you must pass on your changes under the same rules.

**The AGPL trap for a software-as-a-service company.** If you modify AGPL software and customers use it over the network, you must offer them the source. Check the **usage pattern**: internal, SaaS or distributed; modified or not; separate service or linked.

Facilitator notes add four practical rules:

- **Read the LICENSE file, not the README.**
- The default gate denies AGPL even for internal use. An exception needs an ADR with a human name.
- Code on a public host with no licence file is **not** open source.
- Source-available licences such as BUSL, SSPL, Elastic and FSL are not approved as open source by the Open Source Initiative.

This is practical guidance for learning, not legal advice. When the stakes are high, ask a lawyer.

### The decision record and the licence check (slide 27)

An **ADR** (architecture decision record) is a short document that records one choice. The sections are:

1. Context
2. Alternatives scanned
3. Licence (SPDX id)
4. Fit percent
5. Decision and rung
6. Tech-debt statement
7. Exit plan
8. Consequences

Rules:

- **One ADR per choice**, in `docs/adr/`, merged in the same merge request that adds the tool.
- The **tech-debt statement** names an owner, the debt in numbers, the triggers to re-open the decision, and a review date.
- The **licence-check record** proves you read the file: SPDX id, file read, date, usage pattern, result.
- For rung (d), write that you accept the **full** maintenance cost.

The speaker note gives the working habit: **write the ADR while you search, not after the merge.** The decision, the licence sign-off and the risk line carry a human name. An agent may format your text after you wrote the decision lines.

## A worked example: TrailMug

TrailMug needs a way to send return reminders by email. The Product Development Manager writes MUST and SHOULD needs by hand:

- MUST: open source licence that allows use in a closed product; runs in our own environment; sends from our own domain.
- MUST: works without storing card data.
- SHOULD: a template editor; a delivery report; simple setup.

Search (rung a): first the company's own estate (nothing), then a public landscape search, then three candidates.

| Candidate | Licence | MUST met (of 3) | SHOULD met (of 3) | Fit |
|---|---|---|---|---|
| Tool A | MIT | 3 | 2 | (2×3 + 2) / (2×3 + 3) = 8/9 = 89% |
| Tool B | AGPL-3.0 | 3 | 3 | (6 + 3) / 9 = 100%, but the licence gate denies it for modified use |
| Tool C | Source-available | 2 | 3 | (4 + 3) / 9 = 78%, and not open source |

Tool B's 100 percent is a trap. The licence is network copyleft, and TrailMug would modify it. The decision, with a human name, is: choose Tool A at rung (c) because it meets all MUST needs and 2 of 3 SHOULD needs. The gap (a delivery report) is closed first by configuration, then by an extension point. The ADR records the three scores, the licence check for each, a tech-debt statement with an owner and a review date, and an exit plan: how to move to another sender in one week.

## The 2030 Product Development Manager lens

- **You decide:** the MUST and SHOULD needs, which licence risks are acceptable, which rung applies, and who signs the licence line.
- **You delegate to agents:** candidate search from public sources, reading each licence file and extracting its identifier, checking project health from public data, and formatting the ADR after you wrote the decision lines.
- **The brief you would write:** "For each of these three projects, open the repository, find the LICENSE file, and tell me: the file name, the SPDX id, the exact first line of the licence text, and the date of the last release. Do not summarise. Say 'not found' if the file is absent."
- **You verify by:** opening the licence file for the final candidate yourself, recomputing the fit percentage by hand, and checking that every unmet MUST is on the list.
- **Disciplines involved:** legal (licences), finance (maintenance cost), security (project health), engineering (extension points), operations (running it), strategy (build or reuse).
- **On the agent ladder:** **govern**: the licence gate is a policy enforced in the pipeline, with exceptions only through a decision record that carries a human name. Agents search and format inside that policy.

## Working with AI agents

- **Allowed:** search, read and extract facts; compute a table; format an ADR.
- **Not allowed:** decide the rung, sign the licence line, or write the decision lines.
- **Check licence claims at the source.** Agents sometimes state a licence from memory. Always open the file.
- **Written tests:** no AI.

## Common mistakes

1. **Choosing the tool first and the ladder later.** The ADR becomes a justification.
2. **Reading the README for the licence.** Read the LICENSE file.
3. **Believing a high fit percentage.** Check unmet MUST needs.
4. **Treating "free" as "free of cost".** Maintenance is the real cost.
5. **Forgetting the exit plan.** Every adoption needs a way out.
6. **No human name on the decision.** A decision without an owner cannot be re-opened.
7. **Writing the ADR after the merge.** You will forget the alternatives.

## Practice

1. Choose a tool you use. Write three MUST and three SHOULD needs. Find three candidates and compute the fit percentage by hand.
2. Open the licence file for each candidate. Record the SPDX id, file name, date and usage pattern.
3. Decide the rung. Write the ADR using the template. Add a tech-debt statement with an owner, the debt in numbers, triggers and a review date.
4. Ask an agent to read your ADR for missing sections. Do not let it change your decision lines.
5. Explain the AGPL trap to a friend in one minute.

## Checklist

- [ ] I started at rung (a) and wrote why I went down.
- [ ] I computed the fit percentage and kept the unmet MUST list.
- [ ] I read the LICENSE file for every candidate.
- [ ] The ADR has all eight sections, a human name and an exit plan.
- [ ] The ADR is in the same merge request as the tool.

## For facilitators (speaker notes)

- **Slide 25.** Always start at the top. Go down only when the rung above fails, and write down why. A no never ends the search; it sends you to the next candidate. Only an empty candidate list reaches rung (d). Fit percent: MUST needs count double, and keep the list of unmet MUST needs.
- **Slide 26.** Read the LICENSE file, not the README. The default gate denies AGPL even for internal use, and an exception needs an ADR with a human name. Code on a public host with no licence file is not open source. Source-available licences are not approved open source.
- **Slide 27.** Write the ADR while you search, not after the merge. The decision, the licence sign-off and the risk line carry a human name. An agent may format your text after you wrote the decision lines.

## Where to go next

Continue with [Deck 13: The patch-fork loop](/library/deck-13-patch-fork-loop). The longer pages are [The OSS-first ladder](/library/oss-first-ladder), [Open source licences](/library/open-source-licences) and the [decision record template](/library/template-decision-record).
