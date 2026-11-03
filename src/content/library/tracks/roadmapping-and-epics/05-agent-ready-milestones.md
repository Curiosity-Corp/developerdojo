---
title: "Agent-ready milestones"
description: "Cut your first epic into milestones with acceptance checks a person can test, hand a milestone to an agent with a written brief, review the result and keep a decision log."
section: "Roadmapping and epics"
order: 5
track: "roadmapping-and-epics"
level: "core"
duration: "3 hours"
outcomes:
  - "Cut an epic into three to five milestones that each ship something a person can use"
  - "Write acceptance checks that a person can run without reading code"
  - "Write the brief that hands a milestone to an agent, with limits"
  - "Review agent output against your checks and keep a decision log"
resources:
  - "atlassian/definition-of-done"
  - "atlassian/user-stories"
  - "atlassian/project-dependencies"
  - "gitlab/milestones"
  - "gitlab/merge-requests"
  - "atlassian/epics-stories-initiatives"
prerequisites:
  - "week-3-problems-to-epics"
  - "week-4-defend-the-roadmap"
updated: 2026-11-03
---

**Supports:** Developer, weeks 3 and 4: "cut the first epic into milestones" and "agent-ready work". **Time:** about three hours.

## 1. Why this matters

An epic is too big for an agent. An agent that gets "build the café partner experience" will make hundreds of choices for you, and you will find out which ones only when a café owner is confused. The unit that works is the **milestone**: one to four weeks, one slice that a person can use, with checks written before the work starts.

This is the moment where a Product Development Manager (PDM) earns the title. Four things separate a strong manager from a weak one at this step: how well the work is cut, how clear the checks are, how tight the limits on the agent are, and how honestly the output is judged. Agents are fast. They do not tell you that the slice was cut in the wrong place, or that your check could be passed by a page that does not work.

The rule from earlier still holds. **You write the epic and the milestones.** An agent may break a milestone you wrote into issues, build them and report. It does not decide what the milestones are.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Where to cut, what each slice must prove, the acceptance checks, the limits and whether the result is accepted | Splitting a milestone into issues; building them; running the checks you wrote; a first self-review | You run the checks yourself; the diff stays inside the limits; the decision log is up to date | Engineering (feasibility, review), design (what the person sees), security and privacy (data), operations (running it) |

## 2. Key ideas

### A milestone ships something

A milestone is a slice of the epic that a person can use, even if small. "Database tables" is not a milestone: nobody can use it. "A café owner can fill in the sign-up form and we receive her details" is. This is sometimes called a **vertical slice**: a thin cut through all the parts it needs, from what the person sees to where data is stored.

Atlassian's pages on user stories and on epics, stories and initiatives describe the same idea at story level: a small piece of value from a person's point of view.

### Cut by learning and by risk

Do not cut an epic into front end, back end and design. Cut it into **steps where you learn something**. The first milestone should answer the riskiest question cheaply, as in the two-café trial. Later milestones widen it.

A good set of milestones has three marks: each can be used by a person, each ends with something you can show, and the order puts risk first.

### Acceptance checks

An **acceptance check** is a sentence a person can test without reading code: "A café owner can find the sign-up page from the home page and finish it in under ten minutes without help." Good checks name the person, the action, and a result you can see or count.

Atlassian's page on the definition of done explains the idea of a shared, written standard for finished work. In the Dojo you write two layers:

- **Milestone checks:** specific to this slice (the sentence above).
- **A standing definition of done:** the same for all work (tests pass, no secrets in the repo, the change is documented, AI use is disclosed).

Write checks **before** the agent starts. If you write them afterwards, you will unconsciously write them to fit what was built.

### Dependencies between milestones

Atlassian's guidance on project dependencies applies again, at a smaller scale. Within a milestone, some issues must come first, and between milestones, some steps depend on a decision or a person. Write them down. An agent cannot ask you in the middle of the night what it should do about a missing decision, so it either stops or guesses. You prefer it stops.

### The brief is the interface

The brief you give an agent is the real specification. A strong brief has the same parts every time:

1. **Goal:** one sentence, taken from the milestone.
2. **Context:** links to the epic, the persona and the repo paths that matter.
3. **Acceptance checks:** copied exactly.
4. **In scope and out of scope:** files and areas it may touch, and those it may not.
5. **Limits:** no new dependencies without asking, no changes to secrets or deployment settings, no actions outside the repo.
6. **Output:** a merge request with a description, a list of what changed and a list of what it was unsure about.
7. **Stop rule:** if a check cannot be met or a decision is missing, stop and say so.

Work reaches your repo as a **merge request**, so a person can read it before anything is merged. GitLab's merge request documentation explains the flow.

### Review the output like a sceptic

An agent's summary says the work is done. Your review asks: is it? Run each acceptance check yourself, on the real running thing. Read the list of files changed and compare it with the scope. Look for things that passed because the check was weak. Check that nothing outside scope was touched.

### The decision log

Every time you accept, change or reject something, write one line in `roadmap/decisions.md`: the date, the decision, the reason and who made it. Fix forward: if a mistake ships, the log records the forward fix, not a deletion. The log is how a new team member, or a future you, understands why the product is the way it is.

## 3. Step by step

### Step 1: Pick the epic

Take the first epic from your order.

### Step 2: Name the riskiest question

Write one sentence: "The thing I least know is…". The first milestone should answer it.

### Step 3: Cut three to five milestones

Each must be usable by a person, end with something you can show and take one to four weeks. Order with the riskiest learning first. Write a title for each as an outcome.

### Step 4: Write acceptance checks

For each milestone, write three to six checks. Each names a person, an action and a visible result. Remove any check that needs someone to read code.

### Step 5: Write the dependencies

For each milestone, write what must exist before it can start: another milestone, a decision, a person, an account.

### Step 6: Write the standing definition of done

A list of five to eight items that apply to every milestone.

### Step 7: Write the brief for milestone one

Use the seven parts above. Keep scope tight. Name files and folders where you can.

### Step 8: Hand it over and wait

Give the brief to an agent in the repo. Do not interrupt it with new requirements. If you change the requirement, rewrite the brief and start again.

### Step 9: Review

Run the checks yourself. Read the merge request. List what you accept, what you send back and what you decide differently. Give feedback as precise changes, not as a general complaint.

### Step 10: Record

Write the decision log lines. Update the milestone and the board. Close the milestone only when every check is passed by a person.

## 4. Worked example: TrailMug

TrailMug is fictional. The first epic is "Café owners can join, run returns and see results". The founder's riskiest question: "Will a café owner do the sign-up without a phone call?"

**Milestones:**

| # | Milestone | Weeks | What it proves |
|---|---|---|---|
| 1 | Two-café trial | 2 | Two cafés will accept returns for a month and tell us what is hard |
| 2 | Café sign-up page | 3 | An owner can join alone |
| 3 | Returns scan and count | 3 | Staff can log a returned cup in under 10 seconds |
| 4 | Monthly café report | 2 | An owner sees what TrailMug brought her |

**Milestone 2 checks:**

1. A café owner can find the sign-up page from the home page and finish it in under ten minutes without help.
2. After she submits, we receive her café name, address and contact within one minute.
3. She receives a confirmation that says what happens next and when.
4. The page works on a phone.
5. The page states what data we keep and why, and links to the privacy notice.

**Dependencies:** the privacy notice (epic 1, milestone 1) must be live. The decision on how cafés are paid must be made by 2026-12-10.

**Standing definition of done:** tests pass; no secrets or personal data in the repo; change described in the merge request; the check list is run by a person; AI use is noted; the decision log is updated.

**The brief:**

```text
Goal: build the café sign-up page for TrailMug (milestone "Café sign-up
page", epic #2).
Context: read roadmap/epics/2.md and roadmap/personas/leo.md. Work in the
repo trailmug-web, under src/pages/partners/ and src/components/partners/.
Acceptance checks (copy exactly): [the five checks above]
In scope: the sign-up page, its form, the confirmation page and their tests.
Out of scope: payment, the café dashboard, the home page, any deployment
or secret settings.
Limits: add no new dependencies without asking. Make no network calls
except to the existing form endpoint. Do not touch files outside the paths
above.
Output: open a merge request. Its description lists the files changed,
how to run each check, and anything you were unsure about.
Stop rule: if a check cannot be met, or a decision is missing (for example
how cafés are paid), stop and write what you need in the merge request.
```

**What the review found.** The agent's merge request passed its own tests. When the founder ran check 1 on her phone, the form needed pinching and zooming, so check 4 failed. She wrote this in the merge request as a precise change: "The submit button is below the fold on a 375 px wide screen and the postcode field is cut off. Fix and re-run check 4." She also noticed that the agent had added a small analytics library, which broke the limit. She asked for its removal and logged it:

> 2026-12-03. Rejected added analytics library in the sign-up page: out of scope and adds a third-party data flow. Decision: founder. Forward fix requested in the same merge request.

The founder had written the checks first. That is why the failures were visible.

## 5. Working with AI agents on this

This lesson is the one where agents do the most work, so your limits matter most.

**Delegate:**

- **Splitting a milestone into issues**, from your milestone text and checks. You review the list and delete what is not needed.
- **Building** the issues in the repo, under the brief.
- **Running the tests** and reporting results.
- **A first review.** "Compare the diff with the scope in the brief. List any file outside it, any new dependency and any place a check might pass for the wrong reason."
- **Drafting the decision log line** from your words. You approve and sign.

**Do yourself:**

- Choose the cut and the order of milestones.
- Write the acceptance checks and the limits.
- Run the checks on the real running thing.
- Decide to accept, change or reject.
- Close the milestone.

**A brief for the first review (use after the build):**

```text
Here is the merge request and the brief it came from. Do not change any
code. List:
1. Files changed that are outside the stated scope.
2. New dependencies or network calls.
3. For each acceptance check, how it could pass without the thing really
   working for a person.
4. Anything in the description that does not match the diff.
Output four short lists.
```

**How to check an agent that says "done".** Treat the claim as a hypothesis. Run the checks. Look at the real page on a real phone. Read the diff. If the agent wrote the tests, ask whether the tests would fail if the feature were broken: break it on purpose and run them.

**Several agents at once.** Parallel agents can work on different milestones only when their scopes do not overlap. Write the paths in each brief and check that no path appears twice. Two agents that rename the same field differently create a bug no single test catches. Write the shared names (fields, routes, labels) in one place and point both briefs to it.

**Disclose.** The merge request description and `roadmap/decisions.md` state which parts the agent built and which checks you ran.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson covers the climb from **delegate** to **orchestrate**. One brief to one agent is delegation. Several briefs at once, with separate paths and shared names, is orchestration. The standing definition of done, the limits in each brief and your review are the policy and the gate that keep it safe: nothing merges until a person has run the checks. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the two upper rungs.

## 6. Common mistakes

- **Cutting by layer.** "Database", "API", "screens" are not milestones. Cut by what a person can use.
- **Checks that need reading code.** A check a person cannot run is not a check.
- **Writing checks after the build.** You will write what was built.
- **A vague brief.** "Build the sign-up" produces guesses. Name scope and limits.
- **No stop rule.** Without one, an agent invents answers to missing decisions.
- **Trusting "done".** Run the checks yourself.
- **Accepting out-of-scope changes because they look useful.** The limits are the point.
- **No decision log.** In three months nobody will know why.
- **Rolling back when a problem appears.** Fix forward and log the fix.

## 7. Practice: cut the first epic and hand it over

**Deliverable:** a folder `roadmap/epic-1/` in your git repo with:

1. `riskiest-question.md`: one sentence.
2. `milestones.md`: three to five milestones with titles, weeks, what each proves, checks (three to six each) and dependencies.
3. `definition-of-done.md`: five to eight standing items.
4. `brief-milestone-1.md`: the full brief in the seven-part form.
5. `review.md`: after an agent builds milestone one, your review: checks run, results, what you accepted, what you sent back.
6. `roadmap/decisions.md`: at least three dated decision lines.
7. Your AI-use line.

Commit with a message such as `Cut epic 1 into milestones and brief milestone 1`.

**Check:** give your checks to a friend with no technical background. Ask her to say, for each, how she would test it. If she cannot, rewrite the check.

**Stretch:** hand milestone two to a second agent at the same time as milestone one. Write the shared names in one file first. Record what collided and how you would prevent it.

## 8. Checklist

- [ ] Each milestone ships something a person can use.
- [ ] The riskiest question is answered by the first milestone.
- [ ] Each check names a person, an action and a visible result.
- [ ] Checks were written before the build.
- [ ] A standing definition of done exists.
- [ ] The brief has goal, context, checks, scope, limits, output and a stop rule.
- [ ] I ran the checks myself on the real thing.
- [ ] I read the diff against the scope.
- [ ] The decision log has dated entries.
- [ ] I recorded my AI use.

## 9. Further learning

Atlassian's pages on the definition of done and on user stories give common language for finished work and small slices. Its guidance on project dependencies helps you spot what blocks a milestone, and its page on epics, stories and initiatives shows how the levels fit. GitLab's documentation on milestones and merge requests shows how the work and its review are tracked. Next in the product group, the [stakeholder communication track](/library/tracks/stakeholder-communication/) shows how to defend what you built to the people who pay for it.
