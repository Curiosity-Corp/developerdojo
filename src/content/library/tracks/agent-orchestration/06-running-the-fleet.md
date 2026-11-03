---
title: "Running the fleet"
description: "Read what many agent sessions did from one page: briefings, a scorecard that shows blind spots, escalation rules, cost control and a decision queue that protects the human."
section: "Agent orchestration and policy administration"
order: 6
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Write a briefing that a busy person can read in two minutes and trust"
  - "Build a scorecard that ranks worst first and treats a missing measure as a blind spot, never a pass"
  - "Define what each tier escalates, and keep the human's decision queue short"
  - "Watch cost and usage, and set budgets that act as brakes"
  - "Compare declared autonomy with measured behaviour"
resources:
  - "google/sre-book-embracing-risk"
  - "google/sre-book-postmortem-culture"
  - "google/sre-book-monitoring-distributed-systems"
  - "anthropic/claude-code-costs"
  - "anthropic/claude-code-monitoring-usage"
  - "anthropic/demystifying-evals-for-ai-agents"
  - "dora/dora-research"
  - "deeplearning-ai/evaluating-ai-agents"
prerequisites:
  - "tracks/agent-orchestration/05-delegation-briefs-and-the-autonomy-ladder"
  - "tracks/working-with-ai-agents/08-evals-and-testing-ai-work"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration". **Time:** about three hours. **Needs:** your repository from lesson 5. The scorecard lab runs with plain Python and no model.

## 1. Why this matters

By now you can run many sessions inside rules. A new problem arrives the day they all run: **you cannot read everything they did.** If your only view is the chat of each session, you are back to a span of one. If your only view is "all green", you are trusting a summary.

Running a fleet is mostly about **what reaches you, in what form.** A good fleet gives the person a short, honest page: what changed, what is wrong, what was not measured, and the few decisions only a person can take. The rest is handled below, inside the rules, and left on the record for anyone who wants to look.

This is the same discipline site reliability teams use. You do not watch every server. You choose a few signals that matter, alert on the ones that need a person, and learn from every incident without blaming a person.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| Which measures matter, what escalates, the budgets, how much risk is acceptable | Collecting measures, grading, writing the briefing, drafting decisions for the queue | That the briefing shows blind spots, and that measured behaviour matches declared autonomy | Finance (cost), operations (deploy health), security (findings), product (priorities) |

## 2. Key ideas, explained

### The briefing

A **briefing** is a short, regular summary from one tier to the next. A Commander briefs its Chief, the Chief briefs the Admiral, the Admiral briefs the person. Each level shrinks the one below, so the top is one page.

A useful briefing has a fixed order, so the reader learns where to look:

1. **The one sentence:** the state of the whole fleet.
2. **Worst first:** the product or area in the worst state, and why.
3. **Blind spots:** what was *not* measured.
4. **What changed:** merged work, with links to the evidence.
5. **Decisions for you:** the queue, with a recommendation on each.

Two habits make briefings trustworthy. Every claim links to evidence, such as a pipeline, a diff or a test run. And the briefing says what it does **not** know.

### Scorecards and blind spots

A **scorecard** grades each product against a short list of measures. The key design choice is how to treat a measure that has no value. If the deploy health check did not run, the value is *unknown*. A weak scorecard shows unknown as green, because nothing is red. A good scorecard shows it as a **blind spot**, ranked worse than a pass.

The grades, from worst to best:

| Grade | Meaning |
|---|---|
| **FAIL** | A blocking measure is false: the product needs attention now |
| **BLIND SPOT** | A measure is missing: you cannot say it is fine |
| **WARN** | A non-blocking measure is false |
| **PASS** | Everything measured, everything fine |

The rule to keep: **null is never a pass.** Sort worst first, so the reader sees the bad news first and does not have to hunt for it. Keep the measures few. Google's SRE book on [monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/) argues for a small set of signals that tell you whether users are hurt, rather than a wall of charts. For software delivery, the [DORA research](https://dora.dev/research/) offers well-tested measures: how often you deploy, how long a change takes, how often changes fail, and how fast you recover.

### Escalation: what moves up, what stays

Not everything should reach the person. The rule: **a tier escalates only what it cannot decide inside its rules.** A Session that hits a guard corrects itself and carries on. A Commander settles overlaps between its sessions. A Chief settles overlaps between Commanders and decides merge order. The Admiral decides policy changes and budgets. The person gets what is on the human-only list: money, public face, real data deletion, signed filings, physical steps.

Write the escalation rules down, so everyone knows. For each tier: what it handles, what it must report and what it must hand up. If a question is arriving at the person that a tier could have decided, that is a defect in the rules: fix the rule, so the question stops coming.

### The decision queue

The **decision queue** is the person's inbox of decisions, and it should be the only one. Each item is a decision that really belongs to the person, written so it can be answered in one minute:

- the question, in one sentence,
- the options, at most three,
- the recommendation, with the reason,
- what happens if nobody answers, and by when,
- a link to the evidence.

Keep the queue **short and sorted by the cost of delay**. Never send a list of approvals for routine matters. If the person must tick forty boxes, they will stop reading them. And **decide for the person what the person does not need to decide**: when the options are technical, pick, record, and move on. The queue is for the irreversible decisions.

### Cost is a control, not a report

Lesson 2 gave every seat a budget. In the fleet those budgets must **act**. Claude Code's [cost documentation](https://code.claude.com/docs/en/costs) and [usage monitoring](https://code.claude.com/docs/en/monitoring-usage) describe what you can measure, and each headless run reports its cost and turns. Add them up per Commander per day and compare with the budget in your org map. A seat that spends faster than its output justifies is either stuck or wandering, and the right response is to stop it and read its draft, not to raise the limit. Remember also what Anthropic reports in its [multi-agent write-up](https://www.anthropic.com/engineering/multi-agent-research-system): many agents multiply token use, so budgets are what make parallelism affordable.

### Declared versus measured

You wrote an autonomy level for each seat in lesson 5. That is the **declared** level. The **measured** level is what the seat actually did: did its reports match its diffs, how often did guards fire, how many of its merges needed a repair? Compare the two every week. When measured is better than declared, the seat has earned more room. When measured is worse, move it down, find out why, and write a retrospective. Anthropic's article on [demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) is a good guide to turning "did it do well?" into repeatable checks.

### Blameless learning

When something goes wrong, the question is not "which agent failed?" but **"what in our system allowed this, and what gate stops it next time?"** Google's [postmortem culture](https://sre.google/sre-book/postmortem-culture/) chapter describes this blameless habit. It fits agents well: an agent cannot be shamed, and shaming a person only hides the next incident. The retrospective output is always the same: one or more new checks, recorded as decisions.

## 3. Step by step: build the fleet view

1. **Choose three to six measures** per product that tell you if users are safe and delivery is healthy. Mark each as blocking or not.
2. **Decide how each is collected** by a script, not by hand: pipeline status, deploy health check, age of the oldest merge request, open findings.
3. **Write the scorecard rules:** FAIL, BLIND SPOT, WARN, PASS; null is a blind spot.
4. **Write the briefing template** with the fixed order.
5. **Write the escalation rules** for each tier.
6. **Create the decision queue** with the item format above.
7. **Add budgets to the briefing:** spent versus allowed, per seat.
8. **Add declared versus measured** for each seat.
9. **Run the briefing on a schedule**, and read it.

## 4. Worked example: TrailMug

Maya's measures, in `briefings/measures.json`:

```json
{
  "date": "2026-11-03",
  "measures": [
    { "id": "main_green",    "blocking": true,  "label": "Default branch pipeline is green" },
    { "id": "deploy_healthy","blocking": true,  "label": "Latest deploy is healthy" },
    { "id": "mr_waiting",    "blocking": false, "label": "No merge request waiting more than 3 days" },
    { "id": "no_open_high",  "blocking": false, "label": "No open high-severity finding" }
  ],
  "products": [
    { "id": "trailmug-site", "priority": 1, "values": { "main_green": true,  "deploy_healthy": true,  "mr_waiting": true,  "no_open_high": true } },
    { "id": "trailmug-app",  "priority": 2, "values": { "main_green": false, "deploy_healthy": true,  "mr_waiting": false, "no_open_high": true } },
    { "id": "trailmug-ops",  "priority": 3, "values": { "main_green": true,  "deploy_healthy": null,  "mr_waiting": true,  "no_open_high": true } }
  ]
}
```

And the script that grades them, `scripts/scorecard.py`:

```python
#!/usr/bin/env python3
"""Rank products worst first. A measure that is missing (null) is a blind spot, never a pass.

Usage: python3 scripts/scorecard.py briefings/measures.json
"""
import json
import sys
from pathlib import Path

ORDER = {"FAIL": 0, "BLIND SPOT": 1, "WARN": 2, "PASS": 3}


def grade(product: dict, measures: list[dict]) -> tuple[str, list[str]]:
    failed_blocking, blind, failed_other = [], [], []
    for m in measures:
        value = product["values"].get(m["id"])
        if value is None:
            blind.append(m["label"])
        elif value is False and m["blocking"]:
            failed_blocking.append(m["label"])
        elif value is False:
            failed_other.append(m["label"])
    if failed_blocking:
        return "FAIL", failed_blocking + failed_other
    if blind:
        return "BLIND SPOT", [f"not measured: {label}" for label in blind]
    if failed_other:
        return "WARN", failed_other
    return "PASS", []


def main(path: str) -> int:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    rows = []
    for product in data["products"]:
        status, reasons = grade(product, data["measures"])
        rows.append((ORDER[status], product["priority"], product["id"], status, reasons))
    print(f"TrailMug scorecard, {data['date']} (worst first)")
    for _, _, product_id, status, reasons in sorted(rows):
        print(f"- {status:<10} {product_id}" + (": " + "; ".join(reasons) if reasons else ""))
    return 1 if any(r[3] == "FAIL" for r in rows) else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
```

Running it prints:

```text
TrailMug scorecard, 2026-11-03 (worst first)
- FAIL       trailmug-app: Default branch pipeline is green; No merge request waiting more than 3 days
- BLIND SPOT trailmug-ops: not measured: Latest deploy is healthy
- PASS       trailmug-site
```

The site is Maya's top priority and it passes, but the page leads with the app, because ranking is by grade first and priority second. Operations is not "fine". Its deploy check did not run, and the scorecard says so. The exit code is 1 when anything fails, so a pipeline can stop or notify on it.

The Chief's briefing for the day:

> **Fleet: one product failing, one blind spot, one healthy.** Worst: the app's default branch is red since the merge of draft 12 (link). `cmd-app` is fixing forward; expected green by noon. Blind spot: operations has no deploy health check, so we cannot say its deploys are healthy; `cmd-ops` will add one this week. Merged: 4 changes (links). Spend: 21 of 30 dollars. **Decisions for you:** one. Approve a 10 dollar daily budget increase for `cmd-site`? Recommendation: no. Its output does not justify it; raise the website budget only if sign-up info pages slip.

Note the decision: a money change, kept for the person, with a recommendation and the cost of each answer. Everything else in the briefing was handled inside the rules.

## 5. Working with AI agents on this

What to delegate: collecting measures, running the scorecard, drafting the briefing and the decision-queue items, summarising cost by seat, and proposing a retrospective. What you must do yourself: pick the measures, set the budgets, answer the queue, and decide when a seat moves on the autonomy ladder.

A prompt you can adapt:

```text
Here are today's scorecard and the last three merged draft merge requests. Write the
briefing in this order: one sentence, worst first, blind spots, what changed, decisions
for me. Link or name the evidence for every claim. If a number is not in the input,
write "not measured". Do not reassure me.
```

Check: for every claim in the briefing, find the evidence. Any claim without a source is deleted. Ask: did it show a blind spot as a pass? Did it make a decision that was mine?

Disclose: "AI use: briefing drafted from scorecard output; I answered the queue."

**Where this sits on the ladder.** This lesson is rung three and four together. Running many sessions is rung three. The briefing and scorecard are how governance is *verified*, which is the other half of rung four.

## 6. Common mistakes and how to avoid them

- **Counting a missing measure as green.** Null is a blind spot.
- **Too many measures.** Few signals, each tied to a decision.
- **A briefing with no evidence links.** It is a story, not a report.
- **Queueing routine approvals.** The person's queue is for irreversible decisions only.
- **Raising a budget when a seat is stuck.** Read its work first.
- **Blaming an agent.** Ask which gate was missing.
- **Declared autonomy that nobody measures.** It is a wish.

## 7. Practice: a scorecard, a briefing and a queue

**Deliverable:** `briefings/measures.json`, `scripts/scorecard.py`, a first briefing, `decisions/queue.md`, and a one-page escalation and autonomy note. No model is needed except for step 5.

1. **Save the JSON and script** above in your repository, and run `python3 scripts/scorecard.py briefings/measures.json`. Compare with the output shown.
2. **Change the data.** Set the site's `main_green` to `false` and confirm it moves to the top and the exit code is 1 (`echo $?`). Set a value to `null` and confirm it becomes a blind spot.
3. **Replace the sample data with real measures** for your own project, even if you collect them by hand at first.
4. **Write `decisions/queue.md`** with two or three real decisions in the item format: question, options, recommendation, deadline, evidence.
5. **Draft a briefing** in the fixed order (use an agent if you like, with the prompt above). Verify every claim.
6. **Write the escalation rules** in `README.md`: what each tier handles, reports and hands up. Check that nothing on your human-only list is handled below the person.
7. **Compare declared and measured autonomy** for each seat from lesson 5: what the seat may do, and what it did. Note the evidence.
8. **Add cost.** From the result files of your lesson 5 runs, add each seat's cost and turns, and compare with its budget.
9. **Run a blameless retrospective** on one thing that went wrong in the course so far. Write the gate you added.

Commit with a message such as `Add scorecard, briefing, decision queue and escalation rules`.

**Check:** the scorecard output, one briefing in which every claim has evidence, and a queue of at most three items, each answerable in a minute.

**Stretch:** make the scorecard fail a pipeline job when it returns exit code 1, and publish its output as a job artifact.

## 8. Checklist

- [ ] A briefing can be read in two minutes and every claim has evidence.
- [ ] The scorecard ranks worst first and shows blind spots.
- [ ] I tested null, false and true values.
- [ ] Escalation rules are written for each tier.
- [ ] The decision queue holds only irreversible decisions, each with a recommendation.
- [ ] Budgets are compared with real spend.
- [ ] Declared and measured autonomy are compared.
- [ ] A retrospective ended with a new gate.
- [ ] I recorded my AI use.

## 9. Further learning

The three chapters of Google's SRE book on embracing risk, monitoring distributed systems and postmortem culture give the discipline behind this lesson, free to read online. DORA's research covers the delivery measures. Anthropic's documentation on Claude Code costs and usage monitoring covers what you can measure, and its article on evaluating agents, together with the DeepLearning.AI course on evaluating AI agents, covers how to check quality in a repeatable way.

**Next:** Launch Sequence for agent-built software. The next lesson in this track (`/library/tracks/agent-orchestration/07-launch-sequence-for-agent-built-software/`) builds the pipeline gates from commit to customer.
