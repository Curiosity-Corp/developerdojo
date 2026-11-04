---
title: "Run a team of people and agents"
description: "Decide who does which work, write briefs and checks for agents, review their output at a pace you can keep, and keep accountability with a named person."
section: "Leading people and agents"
order: 3
track: "leading-people-and-agents"
level: "core"
duration: "3 hours"
outcomes:
  - "Sort work into what people do, what agents do and what needs both"
  - "Write a brief with written checks and give every piece of work one human owner"
  - "Set a review pace that matches what you can really check"
  - "Write a one-page agent policy: what agents may do alone, what needs a person and what is never allowed"
  - "Run a blame-free look back when agent work goes wrong, and fix forward"
resources:
  - "anthropic/ai-fluency-framework-foundations"
  - "anthropic/define-success-criteria"
  - "atlassian/definition-of-done"
  - "atlassian/blameless-postmortem"
  - "atlassian/team-health-monitor"
  - "atlassian/ai-agents-in-project-management"
  - "nist/ai-rmf-playbook"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "disclose-ai-use"
  - "fix-forward"
updated: 2026-11-03
---

**Supports:** Developer, weeks 5 and 6 (demo and package), and the Master Developer review. **Time:** about three hours. **Rung on the agent ladder:** **delegate**, with the first steps into **orchestrate** and **govern**.

## 1. Why this matters

A team that includes agents looks like a normal team from far away. Up close it is different. The agents do not tell you that they are confused. They do not remember yesterday unless you wrote it down. They work fast and sound sure when they are wrong.

So running a mixed team is about three things you already know how to do, done more carefully: say clearly what you want, check the work against a written test and keep one person answerable for the result.

The third one is the heart of this lesson. You can hand a task to an agent. You cannot hand over the responsibility. If a wrong claim goes to a customer, "the agent wrote it" is not an answer. The person who owned the work, and the person who reviewed it, answer. That is why every piece of work in a mixed team has a named human owner.

A Product Development Manager (PDM) does this job because nobody else sees the whole team. Agents can draft, build, check and summarise. They cannot decide how much risk is acceptable, who should be told or when to stop. Those are yours.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Who does which work; what each agent may do alone; what needs a person; what "done" means; how much review the team can really carry | Drafts, code from an approved issue, tests, summaries, routine checks, reminders, keeping logs tidy | Each result against the written checks; the log shows who owned and who reviewed; the pace of review matches the number of open tasks | Security and privacy (data agents may touch), operations (who is on call), finance (cost of agent use), engineering and design (judgement on quality), legal (promises and disclosure) |

## 2. Key ideas, explained

### Two kinds of worker

People and agents are different, and good leaders plan for the difference. This simple comparison holds today and will change as tools change.

| | People | Agents |
|---|---|---|
| Speed on routine work | Steady | Very fast |
| Questions | Often ask, or push back | Rarely ask; usually pick a reading and go |
| Memory between days | Yes | Only what is written in files or notes |
| Judgement on risk and people | Can be strong | Weak; may sound sure and be wrong |
| Accountability | Can be held to account | Cannot |
| Needs from you | Direction, feedback, care, fair load | Brief, limits, checks, rules |

You lead people with trust and conversation. You lead agents with written words and tests. Do not confuse them.

### Accountability stays with a person

Write the rule at the top of your team page: **every piece of work has a human owner, and an agent is never the owner.** The owner is the person who agreed to the brief and who answers if the result is wrong. A second person, or the same person on a second look, is the reviewer. For small work, the owner and the reviewer can be the same person. For risky work, they should differ.

This is not about blame. It is about knowing who to ask and who can change the process.

### Four habits for delegating

Anthropic's free course on AI fluency describes four habits for working with AI: **delegation** (decide what work to hand over, and what to keep), **description** (say clearly what you want), **discernment** (judge what comes back) and **diligence** (take responsibility for the result and for how it was made). They map onto this lesson: sort the work, write the brief, review against written checks, and keep the owner, the log and the policy.

### What goes in a brief

A brief is a short written task for an agent. The lesson on [specs and acceptance criteria](/library/tracks/working-with-ai-agents/04-specs-and-acceptance-criteria/) covers it in depth. For a team, keep seven parts:

1. **Goal.** What this task is for, in one sentence.
2. **Context.** The files, pages and decisions to use. Say which to ignore.
3. **Limits.** What the agent must not touch or do.
4. **Checks.** The written tests that say the work is done. If you cannot write a check, the task is not ready.
5. **Form.** What the result looks like and where it goes.
6. **When to stop.** What the agent does if it is stuck or finds something unexpected: stop and report, not guess.
7. **Owner.** The person who is accountable.

Anthropic's page on defining success criteria is a useful guide to the fourth part. Atlassian's definition of done shows how a team keeps one shared list of what "finished" means. Put the team's definition of done in the repository and refer to it in every brief.

### Review is the limit

You can start agent tasks faster than you can check them. The checking is the slow part, and it protects you. A simple rule: **do not start more work than you can review this week.** Unreviewed work is a risk, not an asset.

Match the depth of review to the risk:

| Risk | Example | Review |
|---|---|---|
| Low | Fixing a typo in an internal note | Skim; a spot check each week |
| Medium | A draft that a person will edit | Read in full; compare to the brief |
| High | Anything customers, money, data or security touch | Read every line; test with a real person; a second reviewer |

When you run several agent sessions at the same time, you have moved from **delegate** to **orchestrate**. The review limit does not go away. It becomes the main design question: who checks each session, and how do you see what is waiting?

### Gates and policy keep it safe

At some point you cannot watch every step. Then you rely on written rules and automatic checks: the **govern** rung. In practice this is a one-page **agent policy** and some gates that the tools enforce, such as a rule that nothing joins the main branch without a person's approval and passing tests.

The NIST AI Risk Management Framework playbook, from the US standards body, gives suggested actions for governing AI systems, including setting roles and who answers for what. It is long and written for organisations, so take what fits a small team.

A one-page agent policy has four short lists:

- **Agents may do alone:** low-risk work inside a written brief.
- **Agents may do with a person's approval:** anything that changes the product, or the main branch.
- **Agents may never do:** write the roadmap or the epics, send messages to customers or partners, handle secrets or personal data without rules, make promises, give feedback to a person.
- **Everyone must do:** record AI use, report surprises, stop when in doubt.

### Learn from failure without blame

Some agent work will be wrong, and some of it will get past you. Run a short look back. Atlassian's guide to the blameless postmortem is written for incidents, but the method fits: write what happened, the effect and the cause, then ask which part of the process allowed it. Was the brief unclear? Was the check missing? Was the review too fast? Fix that part, then [fix forward](/library/fix-forward). Do not blame the person or the agent. The process can learn. A blamed agent cannot.

### Look after the people

Agents change people's work. People may worry about their place, and they may be asked to review far more output than before, which is tiring. Three habits help:

- **Talk about it openly.** Say which tasks agents will do and why. Say what stays human, and what you value in people's work: judgement, care, relationships.
- **Share the credit and the load.** Reviewing agent work is real work, so count it. Do not let it become an unseen extra.
- **Be clear about data.** Tell people which tools see which information. Do not use agent tools to watch staff in ways you would not explain to them.

A regular check-up helps. Atlassian's Team Health Monitor rates a team against eight traits and picks three to improve. Run a version every quarter and add one question: "Is the work with agents helping us or tiring us?"

## 3. Step by step: set up the mixed team

### Step 1: List the next two weeks of work

Use the issues you already have.

### Step 2: Sort it

Mark each item **person**, **agent** or **both**. Use risk and judgement, not convenience. Anything with customers, money, personal data, security or people's feelings leans to a person or both.

### Step 3: Name the owner

One human owner next to every item, including agent items. If you are alone, the owner is you.

### Step 4: Write the brief and the checks

For each agent item, write the seven parts. Each check must be runnable by a person or a test. "Looks good" is not a check.

### Step 5: Count your review capacity

How many tasks can you review this week, at the depth the risk needs? Start no more than that.

### Step 6: Write the agent policy

Four lists on one page. Show it to the team and ask what is missing.

### Step 7: Keep a short work log

One line per task: date, owner, what the agent did, what was checked, the decision. It is how you disclose AI use.

### Step 8: Review weekly

Spend 20 minutes on three questions: what worked, what went wrong and which rule or brief changes.

### Step 9: Check the team every quarter

Run a short health check, and act on one thing.

## 4. Worked example: TrailMug

TrailMug is fictional. The team is invented: the founder, Ana (designer, part time), Sam (support, part time) and agents that work from briefs.

**The sorted list (excerpt):**

| Work | Who does it | Owner | Check |
|---|---|---|---|
| Interview summary for 6 cafés | Agent drafts; Sam checks against recordings | Founder | Every claim traces to a quote |
| Return tracker page | Agent builds from approved issue | Founder | Issue checks pass; Sam tries it |
| Café sign wording | Ana drafts; agent suggests variants | Ana | Founder approves; a café owner reads it |
| Letter to a café about a delay | Founder writes; agent checks tone | Founder | Founder reads and sends |
| Feedback to Ana on the late sign | Founder | Founder | Not delegated |

**The brief for the return tracker (excerpt):**

> **Goal:** a page where a café records each returned cup in under 10 seconds.
> **Context:** issue 7, the style sheet and the privacy note. Ignore everything else.
> **Limits:** do not add accounts or store customer names. Do not change any other page.
> **Checks:** the five checks in issue 7, plus the team's definition of done.
> **Form:** one merge request with a short note of what changed.
> **If stuck:** stop and write the question in the merge request. Do not guess.
> **Owner:** the founder.

**Review capacity.** The founder wrote: "I can review about four medium tasks and one high-risk task a week." She started three agent tasks, not six.

**A failure and the look back.** An agent's summary of the interviews said that "all six cafés wanted a loyalty scheme". Only two had. The founder caught it because she checked each claim against a quote. The look back, in her words:

> **What happened:** a summary claimed all six cafés wanted loyalty points. Two did. No effect: caught before the sponsor note.
> **Cause:** the brief said "summarise themes" and did not say "every claim needs a quote". The review was a skim.
> **Changes:** summary briefs now require a quote and a café name for every claim. Summaries are medium risk, read in full.

Nobody was blamed.

**Agent policy (excerpt):**

> **Agents may never:** write the roadmap or epics; send a message to a café; make a promise to anyone; touch accounts or secrets; give feedback about a person.

**Team check-up.** Sam said that reviewing agent drafts felt like extra work with no credit. The founder counted it as real work on the board, and moved one of Sam's routine tasks to an agent.

## 5. Working with AI agents on this

**Delegate:**

- **Drafting briefs.** "From this issue, draft a seven-part brief. Mark any part you cannot fill from the issue as 'missing'. Do not invent a check."
- **Checking briefs.** "Read this brief as the agent that will do the work. List every question you would need answered."
- **First-pass review.** "Compare this merge request with the checks. For each, write pass, fail or cannot tell, with the evidence."

**Do yourself:**

- Decide who owns what, and what agents may never do.
- Judge the risk and the depth of review, and do the final review of high-risk work.
- Hold the conversations about workload and fairness.
- Decide whether a failure needs a new rule, a new check or a different worker.

**A brief you can adapt:**

```text
You are reviewing agent work for the team lead. Inputs: the brief
(brief.md), the team's definition of done (done.md) and the merge
request. For each check in the brief and in done.md, answer: pass,
fail or cannot tell. Give the evidence: a file name, a line or a test
result. Then list anything the agent changed that the brief did not
ask for, and any claim in the text that has no source. Do not edit
files. Do not say the work is "good". Report evidence only.
```

**How to check the output.** An agent's first-pass review is a help, not a verdict. Open the evidence it names and run the feature. For high-risk work, read every line yourself. If it passes something that is later found wrong, fix the brief.

**Where this sits on the ladder.** This lesson is mainly **delegate**: a whole task with a brief, checks and an owner. Counting your review capacity is the step towards **orchestrate**: running several agent sessions needs a plan for who checks what and when. The agent policy and the gates (approvals before changes join the main branch, tests that must pass) are **govern**. They keep the work safe when you cannot watch every step. Climb one rung at a time: a team that cannot review one agent well cannot review five.

**Disclose.** Keep the work log and say, wherever the result goes, which parts an agent drafted and which a person reviewed. See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **No named owner.** "The team" or "the agent" owns it, so nobody does.
- **Briefs with no checks.** Neither the agent nor you can tell when it is done.
- **Starting more work than you can review.** Unreviewed output piles up and slips through.
- **Blaming the agent or the person.** Look at the brief, the check and the review. Fix the brief, or the mistake returns.
- **Using agent tools to watch people in secret.** It breaks trust.

## 7. Practice: the mixed team page

**Deliverable:** in your git repository, in a folder `team/`:

1. `work-sort.md`: a table of at least eight real or realistic work items for the next two weeks, with who does it, the owner, the risk and the check.
2. `brief-example.md`: one full seven-part brief for an agent task, and the result you got when you ran it (or a realistic result, labelled).
3. `review-log.md`: at least three log lines (date, owner, what the agent did, what was checked, result, decision) and one case where your review found something wrong.
4. `agent-policy.md`: one page with four lists: may do alone, may do with approval, may never do, everyone must do.
5. `look-back.md`: a blame-free look back on one real or realistic failure: what happened, effect, cause in the process, what changes.
6. `capacity.md`: how many reviews you can do per week, by risk, and how many tasks you will start.
7. Your AI-use line.

Commit with a message such as `Add mixed team page, agent policy and review log`.

**Check:** ask a colleague to read `agent-policy.md` and `work-sort.md`. Ask: "If an agent wants to send an email to a customer, what happens?" They should be able to answer from the pages.

**Stretch:** ask each person: "Is the work with agents helping or tiring you?" Act on one answer.

## 8. Checklist

- [ ] Every piece of work has a named human owner.
- [ ] Each agent task has a brief with goal, context, limits, checks, form, a stop rule and an owner.
- [ ] Every check can be run by a person or a test.
- [ ] I know how many reviews I can really do, and I stay within it.
- [ ] Review depth matches risk.
- [ ] The agent policy is one page and the team has seen it.
- [ ] Agents never write the roadmap, send external messages or give feedback to a person.
- [ ] I keep a work log and disclose AI use.
- [ ] I run blame-free look backs and fix the brief or the rule.
- [ ] I counted review as work, and checked how the team feels.

## 9. Further learning

Anthropic's free AI Fluency course gives you the four habits of delegation, description, discernment and diligence. Its page on success criteria helps you write checks, and Atlassian's definition of done shows how a team keeps one shared list of what finished means. Atlassian's blameless postmortem guide and Team Health Monitor give you formats for looking back and checking the team. The Atlassian article on AI agents in project management is a vendor view, so read it critically and compare it with the rules in this lesson. NIST's playbook is long, and you only need the parts about roles and accountability. When you can run one agent well, you will be ready to climb further: more sessions at once, and stronger written rules and gates.
