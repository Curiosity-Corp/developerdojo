---
title: "ORBITAL: indicators, KPIs and the SDGs"
description: "Choose the numbers that tell you whether a product works. Learn what a KPI is, how to pick a few good ones, how to link a plan to the UN Sustainable Development Goals without overclaiming, and how to check an agent's data work."
section: "Frameworks"
order: 12
track: "frameworks"
level: "core"
duration: "65 min"
outcomes:
  - "Explain the difference between an output, an outcome and an impact, and give an example of each"
  - "Choose three to five indicators with a baseline, a target, a source and an owner"
  - "Link a product to one or two UN Sustainable Development Goals with a real indicator and an honest statement of what you can and cannot claim"
  - "Brief an agent to build a measurement plan, and check it for invented numbers"
resources:
  - "united-nations/sustainable-development-goals"
  - "un-statistics-division/sdg-indicators"
  - "sdg-academy/free-education-for-sustainable-development"
  - "google/measuring-the-user-experience-heart"
  - "atlassian/okr-guide"
  - "green-software-foundation/learn-green-software"
  - "dora/dora-research-program"
prerequisites:
  - "11-orbital-objective-resources-budget"
updated: 2026-11-03
---

This is lesson 12, the second of six about ORBITAL. It supports **Developer weeks 3 and 4** (measure the product, then defend the roadmap) and the Master Developer module on indicators and reporting.

## 1. Why this matters

You wrote an objective with a number in lesson 11. How will you see that number move? The **I** in ORBITAL is for **Indicators**: the measurements that tell you whether the plan is working. The source material says indicators are either key performance indicators (**KPIs**) or the **Sustainable Development Goals** (**SDGs**) of the United Nations, and that a plan should have a way of monitoring them.

Indicators matter more than they first seem to. They decide what everyone pays attention to. A team that is measured on "features shipped" will ship features. A team that is measured on "cups returned" will work on returns. The wrong indicator quietly steers a whole company in the wrong direction.

For the 2030 Product Development Manager (PDM) the indicators are also the **contract with the agents**. An agent can only judge its own work against something you can measure. If your indicator is vague ("make onboarding better"), the agent will produce something that looks good and proves nothing.

## 2. Key ideas, explained

### Output, outcome, impact

Three words are often mixed up. Keep them apart.

| Word | Meaning | Example for a returns feature |
|---|---|---|
| **Output** | Something you produced. | "The returns page is live." |
| **Outcome** | A change in what people do because of it. | "Cafés record 90 of 100 returns on the page, not on paper." |
| **Impact** | A change in the wider world, over a long time. | "Fewer single-use cups are thrown away in the city." |

Outputs are easy to count and tell you little. Outcomes are what a product team can truly influence. Impact is the reason you started, but many things outside your control change it, so be modest in your claims.

A good set of indicators has at least one of each, and gives most weight to outcomes.

### What a KPI is

A **key performance indicator (KPI)** is a number that shows progress toward an objective. "Key" means that it matters; do not track fifty. A KPI is only useful if it has these parts.

| Part | Question | Example |
|---|---|---|
| **Name** | What is it called? | Seven-day return rate |
| **Definition** | Exactly how is it counted? | Cups returned within 7 days of lending, divided by cups lent in the same week |
| **Baseline** | Where are we today? | UNKNOWN until week 4 of the pilot |
| **Target** | What do we aim for, and by when? | 70% by 31 March |
| **Source** | Where does the number come from? | The returns table in the database, counted by a saved query |
| **Owner** | Who reports it? | Maya |
| **Rhythm** | How often? | Weekly |

Most disagreements about numbers are really disagreements about the **definition**. Write the definition once, in git, in one place.

### Leading and lagging

A **lagging** indicator shows a result after it happens (cups returned last month). A **leading** indicator moves earlier and warns you (the number of cafés that have trained staff). Use both: leading ones let you act, lagging ones tell you whether you were right.

### A checklist for choosing: HEART

Google researchers described a handy set of five questions for products, called **HEART**: *Happiness* (do people like it?), *Engagement* (how much do they use it?), *Adoption* (how many new users?), *Retention* (do they come back?) and *Task success* (can they do what they came to do?). You do not need all five. Use them as a menu so that you do not forget a dimension. A link to the paper is in the resources.

### Goals, signals and honest limits

Be careful with **vanity numbers**: numbers that look good and teach you nothing, such as total sign-ups with no activity. Ask of every indicator: *what decision will this number change?* If none, delete it.

Also be careful that a measure does not become a target that people game. If you reward "cups lent", staff may lend cups to anyone. Pair it with a quality measure, such as returns.

### The SDGs

The **Sustainable Development Goals (SDGs)** are 17 goals adopted by all United Nations member states in 2015, for example Goal 12 "Responsible consumption and production" and Goal 13 "Climate action". Each goal has **targets**, and each target has one or more official **indicators**, listed by the UN Statistics Division with a code such as 12.5.1. The SDG list is useful because it is a shared language that funders, governments and partners recognise.

Linking a product to an SDG is easy to do badly. Three rules keep it honest.

1. **Choose one or two goals at most.** The ones your product truly affects.
2. **Use the official wording and code of a target or indicator.** Copy it from the UN page and link to it. Do not paraphrase it into something bigger.
3. **State what you can and cannot claim.** Your product does not "achieve" a goal. It might contribute to a measurable part of it, in a place, for a group, over a period. Say exactly that.

The reverse mistake is also common: adding SDG logos to a page to look good. A reader who knows the SDGs will notice quickly. The UN indicators are a good place to find a *method* for measuring, even if you only measure a small local piece.

## 3. Step by step: build the indicator set

1. **Copy the objective from lesson 11.** The indicators serve it.
2. **List what could change** because of your product, in three groups: outputs, outcomes and impact.
3. **Choose three to five indicators.** At least one outcome. At most one vanity-prone number. Use HEART as a menu.
4. **Write each as a card** with name, definition, baseline, target, source, owner and rhythm. Write UNKNOWN where the baseline is missing.
5. **Check every definition** with the question "could two people count this differently?" If yes, tighten it.
6. **Find one measurement risk** for each indicator: a way it could mislead or be gamed. Add a paired indicator if needed.
7. **Choose the SDG link** (optional, only if it is true). Find the goal and target at the UN site, copy the indicator code and wording, and write the claim you can honestly make and the claim you cannot.
8. **Decide what you will do** if an indicator misses its target twice: this is a trigger for a focus shift (lesson 10) or for a plan change.
9. **Put the indicator definitions in git** in `frameworks/orbital.md` (or `measures/`), and open a merge request.
10. **Set the reporting rhythm** and say who reads the report.

## 4. Worked example: TrailMug

**All numbers are invented for teaching.** They show the method.

TrailMug's objective: *"By 31 March, eight partner cafés lend and take back TrailMug cups, and at least 70 of every 100 cups lent are returned within seven days."* Maya designs her indicators.

| Indicator | Type | Definition | Baseline | Target | Source | Rhythm |
|---|---|---|---|---|---|---|
| Cafés active | Output | Cafés that lent at least 10 cups in the last 7 days | 0 | 8 by 31 March | lending table | Weekly |
| Seven-day return rate | Outcome | Cups returned within 7 days of lending, divided by cups lent that week | UNKNOWN (first data in week 4) | 70% | returns table | Weekly |
| Return recorded correctly | Outcome (quality) | Returns recorded with a valid café id, divided by all returns | UNKNOWN | 98% | returns table | Weekly |
| Café still active after 8 weeks | Outcome (retention) | Cafés still lending in week 8 divided by cafés that started | 0 | 7 of 8 | lending table | Monthly |
| Single-use cups avoided (estimate) | Impact | Returned loans, counted as one avoided single-use cup each, with the assumption stated | 0 | Report only, no target | calculated | Monthly |

She marks the last one as an **estimate with a stated assumption** (each loan replaces one single-use cup), because she cannot prove that a customer would otherwise have used a disposable cup. A paired indicator guards the first one: "cafés active" could be gamed by lending cups to staff, so the "return rate" sits next to it.

**The SDG link.** Maya looks at Goal 12, "Responsible consumption and production". She opens the UN Statistics Division's list of indicators and reads the targets, including one about substantially reducing waste generation. She notes that the official indicators measure national and regional waste, not one startup's cups. Her written claim:

> *We can say:* TrailMug counts how many single-use cups its partner cafés avoid, which is a small local contribution to the waste-reduction direction of SDG 12 (target 12.5). *We cannot say:* that TrailMug achieves SDG 12, or that the national indicator moved because of us.

She cites the target number and the page, with the date she read it. A funder who knows the SDGs will find that sentence respectable, because it is exact.

**Decision rule.** If the return rate is below 50% for two weeks in a row, Maya will call a focus shift on returns (lesson 10). She wrote that rule in the plan before the data existed, so she cannot talk herself out of it later.

## 5. Working with AI agents on this

| | For Indicators |
|---|---|
| **What the PDM decides** | Which indicators exist, their definitions, the targets, which SDG (if any) and what to claim. What happens when a number misses. |
| **What agents do** | Draft indicator cards from your objective. Write the saved queries for the numbers. Build a first report from a data extract. Look for ways each indicator could mislead. Find the official SDG target wording and codes. |
| **How the PDM verifies** | Run each query by hand on a small sample and compare. Check every SDG code and wording against the UN page. Check that no target, baseline or percentage appeared that you did not provide. |
| **Who else is involved** | Finance (revenue and cost indicators), operations (service levels), data or analytics colleagues, marketing (adoption), the funder or partner who will read the report. |

A brief you can adapt:

```text
Context: frameworks/orbital.md, sections Objective and Indicators (read only).
Task: for each indicator card, do three things.
1. Check the definition. List any way two people could count it
   differently.
2. Write the saved query (SQL) against the schema in docs/db/schema.md.
   Do not run it against production data. Test it on tests/fixtures/.
3. Write one way the number could mislead or be gamed, and suggest a
   paired indicator.
Rules: do not invent baselines or targets; write UNKNOWN. Do not add
indicators. Do not make claims about the SDGs: for each SDG idea,
return only the official target code, the official wording copied from
the UN page, and the link. Return markdown. Questions for me go under
OPEN QUESTIONS.
```

Agents are good at **mechanical analysis** and at imagining how a number could mislead. They are poor judges of what your customers value. They also like to make a report look complete. Insist on UNKNOWN.

When several agents are involved (for example one for queries, one for the dashboard and one for a data-quality check), you are **orchestrating**. Keep the measurement definitions in one file that all sessions read, and add a **gate**: a check in the pipeline that runs the saved queries on test data and fails if an output changes. The [agent orchestration track](/library/tracks/agent-orchestration/) explains gates and policy in more depth.

Disclose AI use in the header of the measurement plan.

## 6. Common mistakes and how to avoid them

- **Too many indicators.** Five that you read beat twenty that you do not.
- **Only outputs.** "Features shipped" says nothing about customers.
- **No baseline.** Without a starting point a target is only a wish. Write UNKNOWN and plan how to find out.
- **Vague definitions.** Write the definition so that two people get the same number.
- **Vanity numbers.** Ask what decision the number changes.
- **Gaming.** Pair a quantity with a quality measure.
- **Overclaiming SDGs.** Use the official code and wording, and state limits.
- **Logo decoration.** If you cannot name the indicator you will measure, do not mention the goal.
- **Invented impact.** An estimate with a stated assumption is honest. A precise number with no source is not.
- **Reports no one reads.** Name the reader and the rhythm.

## 7. Practice

**Goal:** write a measurement plan for your product, or for TrailMug.

1. In `frameworks/orbital.md` add an **Indicators** section.
2. Write three to five indicator cards with name, definition, baseline (or UNKNOWN), target, source, owner and rhythm. At least one is an outcome.
3. For each, write one way it could mislead or be gamed. Add a paired indicator where needed.
4. Write one decision rule: "If X misses its target for Y weeks, I will do Z".
5. Optional: choose one SDG target. Open the UN indicators list. Copy the target code and exact wording, link to it, and write what you can and cannot claim.
6. Brief an agent with the brief above. In an `AI use:` line, record what you kept, what you changed and one thing it got wrong.
7. Ask someone from outside your discipline to read the definitions and tell you one that they would count differently.
8. Open a merge request.

**Deliverable:** an Indicators section in git with cards, a decision rule, an optional SDG claim with its limits, an `AI use:` line and one outside review comment.

## 8. Checklist

- [ ] I have three to five indicators and at least one is an outcome.
- [ ] Each indicator has a definition that two people would count the same way.
- [ ] Each has a baseline or UNKNOWN, a target, a source, an owner and a rhythm.
- [ ] I wrote how each could mislead or be gamed.
- [ ] I wrote a decision rule for a missed target.
- [ ] If I used an SDG, I copied the official target code and wording and wrote what I cannot claim.
- [ ] I checked every number an agent produced against its source.
