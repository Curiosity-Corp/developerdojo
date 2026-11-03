---
title: "ORBITAL: TrailMug in full"
description: "One complete ORBITAL plan for the fictional TrailMug pilot, all seven letters on a page you can copy, plus a review method that tests whether the letters agree with each other."
section: "Frameworks"
order: 15
track: "frameworks"
level: "core"
duration: "60 min"
outcomes:
  - "Read a complete ORBITAL plan and find where its seven parts agree or disagree"
  - "Run a consistency review: objective, budget, indicators, transport, activities and risks against each other"
  - "Use a ready template to write your own ORBITAL in one file, with confidence marks and owners"
  - "Brief an agent to review a plan for gaps and contradictions, and keep the decisions yourself"
resources:
  - "atlassian/product-roadmaps"
  - "atlassian/user-stories"
  - "atlassian/minimum-viable-product"
  - "strategyzer/business-model-canvas"
  - "gitlab/issues"
  - "anthropic/building-effective-agents"
prerequisites:
  - "11-orbital-objective-resources-budget"
  - "12-orbital-indicators-kpis-and-sdgs"
  - "13-orbital-transport-for-software"
  - "14-orbital-activities-and-logistics"
updated: 2026-11-03
---

This is lesson 15, the fifth of six about ORBITAL. It supports **Developer week 4** (defend the roadmap) and the Master Developer capstone work that needs one complete plan.

## 1. Why this matters

Lessons 11 to 14 built the letters one at a time. A plan is not seven separate lists. It is one claim: *if we have these resources and spend this money, and move these things this way, and do these activities, we will reach this objective and we will see it in these numbers.* Each part constrains the others.

Plans usually fail at the joints, not in the parts. The budget pays for twelve cafés and the objective says eight. The indicator needs data that Transport does not collect. A milestone depends on a person who is not in Resources. These mismatches are easy to see when everything is on one page, and invisible when the sections live in different documents.

This lesson gives you the whole plan for the fictional TrailMug pilot in one place, then teaches the review that a Product Development Manager (PDM) does before anyone starts: a **consistency review**. The Dojo's rule applies. You make the claims and the decisions. Agents help to find contradictions.

## 2. Key ideas, explained

### One file, seven letters

A good ORBITAL plan is one markdown file in git, with seven headings, a header (owner, date, status, AI use) and a short list of open questions. Keep it to three or four pages. Keep detail elsewhere (contracts in `docs/api/`, decisions in `decisions/`) and link to it.

### The consistency review

Read the plan across, not down. Ask these questions between the letters.

| Check | Question |
|---|---|
| **O vs B** | Does the money cover the objective in every month, including the late-payment case? |
| **O vs I** | Does each part of the objective have a number in Indicators? |
| **I vs T** | Does Transport collect the data that each indicator needs? |
| **R vs A** | Is every task owner in Resources, with hours? |
| **A vs B** | Does each purchase task appear in the budget? |
| **T vs L** | Does each flow have a failure plan and a risk-register line? |
| **A vs the critical path** | Is every dependency on a partner or a decision written as a task? |
| **L vs everything** | Does every GUESS appear in the risk register? |
| **Confidence** | Is the share of GUESS marks honest? |
| **Reason** | Does the objective still serve the STAR Reach and the portfolio decision? |

A question that returns "no" is a **finding**. Each finding gets an owner and a fix.

### Honest status

Mark every section **draft**, **reviewed** or **approved**, and say by whom. Do not say "approved" if only you have read it. The status is as important as the content.

## 3. Step by step: assemble and review a full ORBITAL

1. **Create `frameworks/orbital.md`** from the template below.
2. **Paste in the seven sections** from your earlier lessons. Keep the text short.
3. **Fill in the header:** owner, date, status per section, AI use.
4. **Run the consistency review** with the ten checks. Write each finding as a line.
5. **Fix findings** by changing the plan, not the evidence. If the budget cannot cover the objective, reduce the objective or find money.
6. **Write the open questions** and name who can answer each.
7. **Ask two people from different disciplines** to read it (finance and operations, or design and marketing). Record what confused them.
8. **Change the status** from draft to reviewed, with names, only when findings are closed.
9. **Open a merge request**, and plan to review the file again at each milestone.

## 4. Worked example: TrailMug in full

**Everything below is invented for teaching.** TrailMug is fictional. The numbers do not describe any real market, price or result. Dates and names are examples.

```markdown
# TrailMug pilot: ORBITAL (v0.3)

Owner: Maya. Date: 2027-01-10. Status: O reviewed, R reviewed,
B draft, I reviewed, T draft, A draft, L draft.
AI use: layout and sums checked by an agent; all decisions by Maya.
Serves: STAR Reach "cups circulate in one city" and the portfolio
decision GROW for TrailMug core.

## O  Objective
By 31 March, eight partner cafés in one city lend and take back
TrailMug cups, and at least 70 of every 100 cups lent are returned
within seven days. Owner: Maya.
Reason: fewer single-use cups, which is why the cafés joined.
Confidence in the 70% target: GUESS (replace after four weeks of data).

## R  Resources
People: Maya (20 h/week, available); designer (6 h/week, to find);
accountant (one session, to find).
Tools: code hosting and pipeline (available); payment provider, test
mode, behind an adapter (available); agent service (to buy, every
output reviewed).
Equipment: 250 cups, sleeves and lids (to buy).
Partners: washing partner (to find, no price: main risk); eight
pilot cafés (letters of interest).
Skill gap: design -> borrow (part-time designer).

## B  Budget (TM$, invented currency)
Out: Mar 2,390 / Apr 1,240 / May 1,240 (with 15% contingency, reason:
the washing price is unknown).
In: savings 4,000 (secured); café fees 0 / 400 / 800 (hoped for).
Balance at month end: 1,610 / 770 / 330.   Approver: Maya, over TM$200.
Review: monthly with the finance adviser.
Confidence: cups BELIEVED, designer BELIEVED, agent KNOWN,
washing GUESS.

## I  Indicators
1 Cafés active (output): 8 by 31 March. Source: lending table.
2 Seven-day return rate (outcome): 70%. Baseline UNKNOWN.
3 Return recorded correctly (outcome, quality): 98%.
4 Cafés active after 8 weeks (retention): 7 of 8.
5 Single-use cups avoided (estimate, assumption stated): report only.
Rule: if indicator 2 is under 50% for two weeks, call a focus shift.
SDG link (optional, stated with limits): SDG 12, target 12.5 wording
copied from the UN page, dated.

## T  Transport
T1/T2 cups by van, twice a week (partner); T3 return record by API
call (contract in docs/api/returns.yaml); T4 status polled each
minute; T5 deposit refund via the provider adapter; T6 nightly summary
file; T7 releases by reviewed merge request and pipeline.
Personal data: T3 and T5. Specialist check before launch.
Decision record: decisions/0003-poll-not-events.md

## A  Activities
A sign cafés (14 Feb) -> B cup loop (28 Feb) -> C record lending and
returns (14 Mar) -> D learn and decide (31 Mar).
Critical path: washing quote -> A -> B -> C -> D.
Epic: "Customers can join, get a cup and return it at any partner café".
Hidden tasks: accountant session, washing quote (day one), staff
training, provider test.

## L  Logistics
Decisions: washing partner (Maya, consulted: finance adviser, cafés);
deposit (finance adviser recommends, Maya decides); releases (Maya,
after the pipeline passes).
Communication: Friday five-line note; monthly indicator report; text
group for urgent café problems.
Risks: see risks.md (8 risks, each with an early signal and owner).
MEL: weekly indicators; 30-minute retrospective at each milestone;
one-page learning note on 31 March; portfolio review.

## Open questions
1 Who confirms the best industry code for the accountant? (Maya)
2 What is the washing partner's price? (partner, by 7 Feb)
3 Do cafés accept a TM$ 50 monthly fee? (two café owners)
```

**A consistency review of this plan** finds the following. Each is a real kind of finding, and none needs a clever tool.

| Check | Finding | Fix |
|---|---|---|
| O vs B | The budget covers the objective, but only just: if the café fees arrive one month late, the balance falls below zero in May (about -470). | Maya adds a line to Logistics: "ask for the first month's fee in advance". The plan already uses 250 cups, not 400. |
| I vs T | Indicator 3 (recorded correctly) needs the café id on every return. T3 does record it. Good. Indicator 5 needs a loan count per café, but T6's file lists only cups. | Add the loan count to the nightly file contract. |
| R vs A | The task "train staff" is owned by Maya, who is at 20 h/week. Three cafés times three half-days is 18 hours in two weeks. | Move one café's training to a week later, or ask a café owner to train their own staff with a checklist. |
| L vs everything | The GUESS on the washing price is in the risk register. The GUESS on the 70% target is not. | Add a risk: "70% target is too high or too low" with the signal "week 4 data" and the response "reset target, record why". |
| Confidence | Two of four budget lines are GUESS or BELIEVED without a quote. | Fine for a draft, but status stays "draft" until the washing quote arrives. |

Maya changes the plan, not the evidence. She does not mark the budget as reviewed until the quote arrives. Two readers, a café owner and a finance friend, find that the word "Transport" confuses the café owner (he thinks it means the van only), and the finance friend asks for the cost of the vans. Maya adds the cost note to T1 and one sentence defining Transport.

## 5. Working with AI agents on this

| | For the whole ORBITAL |
|---|---|
| **What the PDM decides** | Every claim in the plan. Which findings to accept. Which parts to cut. When a section moves from draft to reviewed. |
| **What agents do** | Assemble the file from your sections. Run the ten checks and list findings with the line that proves each. Recompute sums. Look for undefined words. Draft the open-questions list. Draft the risk lines for GUESS marks. |
| **How the PDM verifies** | For each finding, find the lines in the plan yourself. Reject findings that do not point to a line. Recompute the budget once by hand. |
| **Who else is involved** | Finance, operations, design or marketing as reviewers. The sponsor, who must understand it. |

A brief you can adapt:

```text
Context: frameworks/orbital.md (read only).
Task: run a consistency review with these checks: O vs B, O vs I,
I vs T, R vs A, A vs B, T vs L, critical path vs partner or decision
tasks, every GUESS appears in the risk register, objective vs the
STAR Reach in frameworks/star.md.
For each finding return: the check, the exact lines (quote them), why
they disagree, and a suggested question for me. Do not suggest changes
to any number. Do not add tasks or risks yourself; list them as
CANDIDATES for me to accept.
If a check passes, say "PASS" and quote the two lines you compared.
```

The last line matters. An agent that says "looks fine" has told you nothing. An agent that quotes the two lines it compared has shown its work, and you can check it.

A plan this size is a good first exercise for **orchestration**. You could run one session per check, each reading the same file and writing a findings file in its own folder, and a final session that merges the lists for you to review. The shared file is the single source of truth. Gates and policy decide who may change it. The agent orchestration track covers that setup.

## 6. Common mistakes and how to avoid them

- **Seven documents instead of one.** Keep one file, with links to detail.
- **A plan with no status.** Mark every section draft, reviewed or approved, and by whom.
- **Fixing the evidence.** If the numbers do not work, change the plan.
- **Reviewing only your own work.** Ask two people from other disciplines.
- **Treating the template as the plan.** A filled-in template with guesses is a start, not a finished plan.
- **No open questions.** Every real plan has some. List them with an owner.
- **Letting an agent say "looks good".** Demand quotes and PASS lines.
- **Never updating it.** Review the plan at each milestone and record changes in git.

## 7. Practice

**Goal:** write and review a complete one-file ORBITAL for your product, or for TrailMug.

1. Create `frameworks/orbital.md` using the structure in the example. Include a header with owner, date, status per section and `AI use:`.
2. Fill in all seven sections from your work in lessons 11 to 14. Keep it to four pages.
3. Run the ten consistency checks by hand. Write at least five findings, each with the lines it refers to.
4. Fix the plan, or write the finding as an open question with an owner.
5. Run the review brief with an agent. Compare its findings with yours. List what it found that you missed and what it got wrong.
6. Ask two people from different disciplines to read the file. Record the words that confused them, and fix those words.
7. Set the statuses honestly. Commit and open a merge request.

**Deliverable:** one `frameworks/orbital.md` with all seven letters, honest statuses, at least five consistency findings with fixes or owners, an agent-review comparison and two human review notes.

## 8. Checklist

- [ ] All seven letters are in one file with a header.
- [ ] Each section has a status and a confidence mark on its key numbers.
- [ ] I ran all ten consistency checks and wrote down the findings.
- [ ] Every GUESS has a line in the risk register.
- [ ] The budget covers the objective in each month.
- [ ] Two people outside my discipline read the plan.
- [ ] The agent's review quoted lines as evidence, and I verified them.
- [ ] I decided every change myself.
