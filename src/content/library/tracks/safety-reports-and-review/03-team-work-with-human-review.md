---
title: "Team work with human review"
description: "Set up the review that stands between a change and the real world. Use a merge request template, a checklist, the two-person rule, decision records and blameless reviews, and decide where AI agents fit."
section: "Safety, reports and review"
order: 3
track: "safety-reports-and-review"
level: "foundation"
duration: "3 hours"
outcomes:
  - "Write a merge request template and review checklist for code that can move hardware or touch a lab"
  - "Define which changes are safety-relevant and apply the two-person rule to them"
  - "Write a decision record and a blameless review"
  - "Set rules so that agents draft and people review, own and sign off"
resources:
  - "google/engineering-practices"
  - "gitlab/merge-request-reviews"
  - "gitlab/description-templates"
  - "gitlab/codeowners"
  - "gitlab/merge-request-approvals"
  - "adr/architectural-decision-records"
  - "google-sre/postmortem-culture"
  - "anthropic/framework-safe-trustworthy-agents"
prerequisites:
  - "tracks/safety-reports-and-review/01-when-not-to-trust-a-model"
  - "tracks/safety-reports-and-review/02-write-a-technical-report"
updated: 2026-11-19
---

**Supports:** the capstones of [Robot software](/library/tracks/robot-software), [Robot learning](/library/tracks/robot-learning), [Bioinformatics](/library/tracks/bioinformatics) and [Lab automation in code](/library/tracks/lab-automation-in-code). Each asks you to show a reviewed merge request. **Time:** about three hours.

## 1. Why this matters

In web software a bad change shows a wrong page. In robot and lab software a bad change can move an arm, open a valve or run the wrong volume. A review is the cheapest place to catch that. It is also the place where a person takes ownership.

AI agents make this more important. An agent can write a hundred lines in a minute. It does not feel the weight of a wrong limit. If nobody reads the diff, the agent's speed becomes your risk. The rule of this lesson is short: **agents draft, people review and own.**

You will build five things. A merge request template, so every change says what it touches. A checklist, so a reviewer knows what to look for. A two-person rule, so no one approves their own safety-relevant change. A decision record, so the reason survives. A blameless review, so failures teach and are not hidden.

This works in simulation, which is where you start. When the same code later meets a real robot or a real lab, the same habits carry over. The real work then also needs a trained supervisor, the site's own rules and institutional approval. Nothing in this lesson replaces them.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which changes are safety-relevant, who reviews, who signs off, what an agent may touch | Drafting the diff, tests and the merge request text; a first-pass review for style and obvious bugs | The diff itself, the tests that ran, the limits that changed, the sign-off | Safety officer or lab supervisor, security, operations, legal |

## 2. Key ideas

### What is different about robot and biology code

A diff in this code has some special hiding places.

- **Numbers that act as limits.** A speed, a force, a distance, a pipette volume, a confidence threshold. A change from 0.8 to 0.3 is one line and a big risk.
- **The stop path.** Any change to the guard, the stop conditions or the hardware interface.
- **The test data.** Changing what you test on can make a model look better without making it better.
- **Notebooks and configuration.** Reviewers skip them. They often hold the real settings.
- **Deleted tests.** Agents sometimes make a test pass by removing it.

### Which changes are safety-relevant

Write a short list in the repository. A change is safety-relevant if it touches any of: a limit, a stop condition, the guard, the code that talks to hardware or lab equipment, the evaluation data, or the instructions an agent follows. Keep the safety-relevant files in a few folders, such as `safety/`, `limits/` and `hardware/`, so a tool can tell when a change touches them.

### The two-person rule

For a safety-relevant change, two different people are involved. The **author** writes it. The **reviewer** reads the diff, runs the checks and approves. The author never approves their own change. For anything that moves real hardware or touches a real lab, a third role signs off: the safety officer or the lab supervisor. The sign-off names a person, the exact version, the evidence and the conditions.

An agent can be the author. It cannot be the reviewer for a change it wrote, and it cannot give the sign-off. A person reads the diff.

### What the tools can enforce

Check what your plan includes. At the time of writing, GitLab's documentation says:

- Any user with the Developer role or higher can approve merge requests, and on the Free tier these approvals are optional and do not stop a merge.
- Required approvals and Code Owners are Premium and Ultimate features.
- Merge request description templates are in all tiers, kept in `.gitlab/merge_request_templates/`.

So on a free plan the two-person rule is a working agreement, written in your repository and backed by a check that runs in the pipeline. On a paid plan, you can also require approvals. A check on a description cannot prove that a person really signed off. It makes skipping the step visible. The real control is the person.

### Review checklist

A short list is used. A long one is skipped. Use five questions:

1. Do I understand what this changes, in one sentence?
2. Did any limit, threshold or stop condition change? Is the reason written?
3. Did the tests run in simulation, and did I open the log?
4. Were any tests removed, loosened or skipped?
5. Is the AI use stated, and have I read every line the agent wrote?

Google's public engineering practices say the reviewer should approve a change that improves the overall health of the code, even if it is not perfect. Keep that balance. For safety-relevant files, the bar is higher.

### Decision records

A **decision record** is a short file for one decision: the options, the choice and the reasons, with a day to look again. Write one when you choose a limit, a threshold, a simulator, a model or a way to stop. The [decision record template](/library/template-decision-record) in this library is written for open-source choices, and its fields (context, options, decision, consequences) carry over. The ADR community pages show other forms. Keep each record short and keep it next to the code.

### Blameless reviews

After an incident or a near miss, hold a **blameless review**: a review that asks what failed, not who failed. People report mistakes when they will not be punished. The Google SRE book's chapter on postmortem culture explains the habit. End with a change: a test, a check, a gate or a rule. In robotics, make the system safe first. Then find the cause and fix forward. The [fix forward](/library/fix-forward) rule explains why you do not hide what happened.

### Where agents fit

- **Agents draft.** Code, tests, documentation, first-pass review comments.
- **People review and own.** A person reads every safety-relevant diff and signs off.
- **Least privilege.** An agent gets the access its task needs. No credentials for real hardware or real lab equipment. Only simulation.
- **Untrusted text.** An agent that reads issue text or web pages can be steered by instructions hidden in them. This is called prompt injection. See [Securing agent work](/library/tracks/security-fundamentals/04-securing-agent-work).
- **Label the work.** The merge request says what the agent did.

## 3. Step by step

1. **List safety-relevant files** and move them into a few named folders.
2. **Write `SAFETY-RELEVANT.md`:** the list of what counts, who may review, who signs off.
3. **Write the merge request template** and commit it to the default branch.
4. **Write the review checklist** in the template.
5. **Add the pipeline check** so a safety-relevant change cannot pass without the ticks and a name.
6. **Write the code owners file** if your plan supports it. If not, write the rule in your working agreements.
7. **Write a decision record** for each limit in `limits/`.
8. **Run a test review:** make a safety-relevant change, review it as a different person (or ask a peer), and sign off.
9. **Write a blameless review** for one failure from your lesson 2 report.

### The merge request template

Save as `.gitlab/merge_request_templates/Safety-relevant-change.md`:

```markdown
## What changes, in one sentence

## Safety-relevant?
Yes or no, and why. A yes means every box below must be ticked.

- [ ] No limit, threshold or stop condition changed, or the reason is written in a decision record
- [ ] I ran the stop-condition tests in simulation and linked the log
- [ ] No test was removed, loosened or skipped
- [ ] A second person, who did not write this change, has read the diff

Safety sign-off by:

## AI use
What an agent did, and what I checked.
```

### The pipeline check

GitLab sets `CI_MERGE_REQUEST_DESCRIPTION` in merge request pipelines. It keeps only the first 2,700 characters and sets `CI_MERGE_REQUEST_DESCRIPTION_IS_TRUNCATED` to `true` when it cuts. Save as `scripts/check_signoff.py`:

```python
import os
import re
import sys

REQUIRED_TICKS = 4  # the template has four boxes that must all be ticked


def check(description: str, truncated: bool) -> list[str]:
    problems = []
    if truncated:
        problems.append("The description is too long to check. Shorten it.")
    ticked = len(re.findall(r"^- \[x\]", description, flags=re.MULTILINE | re.IGNORECASE))
    if ticked < REQUIRED_TICKS:
        problems.append(f"Tick all {REQUIRED_TICKS} checklist boxes ({ticked} ticked).")
    match = re.search(r"^Safety sign-off by:[ \t]*(\S.*)$", description, flags=re.MULTILINE)
    if not match:
        problems.append("Add a line 'Safety sign-off by: <name>'.")
    return problems


if __name__ == "__main__":
    description = os.environ.get("CI_MERGE_REQUEST_DESCRIPTION", "")
    truncated = os.environ.get("CI_MERGE_REQUEST_DESCRIPTION_IS_TRUNCATED") == "true"
    problems = check(description, truncated)
    for problem in problems:
        print(f"sign-off check failed: {problem}")
    sys.exit(1 if problems else 0)
```

Run the job only when a merge request touches the safety folders. In `.gitlab-ci.yml`:

```yaml
signoff-check:
  stage: test
  image: python:3
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        - safety/**/*
        - limits/**/*
        - hardware/**/*
  script:
    - python3 scripts/check_signoff.py
```

Pin the image tag to the Python version your project uses.

### Code owners (paid plans)

```text
[Safety][1] @safety-owner
/safety/
/limits/
/hardware/
```

The section name, the number of approvals in brackets and a default owner come first. `@safety-owner` is a placeholder for a real person or group. The file goes in `CODEOWNERS`, `docs/CODEOWNERS` or `.gitlab/CODEOWNERS`.

## 4. Worked example: two fictional reviews

Both projects are fictional and every number is an example.

**The TrailMug cup robot.** An agent is asked to make the fictional robot faster. It changes `limits/arm.yaml`, raising the arm speed limit from 0.2 to 0.5 (an invented unit), and updates two tests so they pass.

The merge request template makes the reviewer see three facts. A limit changed. Two tests were loosened. No decision record exists. The reviewer rejects the change with three comments: "Why 0.5? Link a decision record." "Restore the two tests; show the stop test passes at 0.5." "A second person and the safety officer must sign off before hardware."

The author, a person, writes a short decision record: the options (0.2, 0.3, 0.5), the choice (0.3), the reason (the stop test only passes up to 0.3 in simulation), and the review date. The tests are restored. The reviewer approves. The safety officer signs off for simulation only, and the sign-off says that no real robot may use the value without a site risk assessment.

**The colour-mixing simulated lab.** An agent proposes changing the confidence threshold in the guard from 0.8 to 0.5 "to reduce interruptions". The checklist asks: did a stop condition change? Yes. The reviewer asks for a decision record. The record shows that with 0.5 the simulated lab ran 6 of 20 mixes that were outside the pipette range in an invented test. The change is declined. Instead the team fixes the model. The record is kept, so the next agent cannot argue the same point from nothing.

**A blameless review** for the fictional glare failure of lesson 2:

- *What happened:* the gripper closed on empty air in 2 of 20 simulated runs.
- *Why the system allowed it:* no check that a cup was in the gripper before the arm moved on.
- *What we changed:* a gripper-contact check, a glare scene in the tests, and a line in the checklist.
- *Who:* nobody is blamed. The review names the gap in the system.

## 5. Working with AI agents on this

**What the PDM decides.** What counts as safety-relevant, who reviews, who signs, and what an agent may touch. This is a policy, and it belongs to you.

**What you delegate, and the exact brief.** Agents are useful as a first reviewer. They are not a replacement for the human one.

```text
Review the diff in this merge request. You are a first-pass reviewer.
A person will review after you and will own the decision.
Do not approve or reject. Report only.
Task 1: list every changed number in limits/, safety/ and hardware/, with
old value, new value and file.
Task 2: list every test added, removed, loosened or skipped.
Task 3: list any change to the guard or the stop conditions.
Task 4: list anything in the diff that you could not understand.
Rules: quote the lines. Do not guess intent. Do not open or run anything
outside the repository. If a section is empty, write "none found".
Output: four numbered lists.
```

**How you verify.** Read the diff yourself. The agent's list is a map, and it can miss things. Check that every changed limit has a decision record. Open the test log. Confirm that the reviewer and the author are different people. Read [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output) for more habits.

**Which disciplines are involved.** The safety officer or lab supervisor signs off. Security checks what the agent can access. Operations needs to know a limit changed. Legal checks whether the work needs approval.

**Where this sits on the ladder.** This lesson is mostly **governing**: you write the policy, the template and the gate so safety holds without you watching every change. When several agents open merge requests at once, you **orchestrate**: each agent works on its own branch, and each safety-relevant request still needs its own human review. Do not let the number of requests exceed the number of reviews you can really do.

**Disclose.** Every merge request has an "AI use" section. Example: "An agent drafted the change and the tests from my brief. I read every line and ran the stop tests."

## 6. Common mistakes

- **Approving your own change.** The rule is two people. On a free plan nothing stops you, so the rule must live in your habits.
- **A template nobody reads.** Keep it to four boxes. Tick only what you did.
- **Trusting a check that proves nothing.** The pipeline check cannot prove a person signed off. Read the name.
- **Letting an agent review its own work.** It will find it fine.
- **Rubber-stamping.** A reviewer who approves 20 requests an hour is not reading. Limit the queue.
- **Reviewing the code and not the numbers.** The limit is the risk.
- **Blaming a person.** A review that names a culprit teaches people to hide.
- **Giving an agent real access.** Simulation only until a person with authority says otherwise.
- **No decision record for a limit.** The reason is lost, and the next agent changes it.

## 7. Practice: a reviewed safety-relevant change

**Deliverable:** these files in your git repository.

1. `SAFETY-RELEVANT.md`: what counts, who reviews, who signs off.
2. `.gitlab/merge_request_templates/Safety-relevant-change.md`: your template.
3. `scripts/check_signoff.py`, a test for it (`scripts/test_check_signoff.py`, run with `python3 -m unittest discover -s scripts`), and the `.gitlab-ci.yml` job. If you use another git host, write the equivalent check or a written rule.
4. `limits/example.yaml` with two limits, and `reviews/decisions/0001-<limit>.md`: a decision record for one of them.
5. A real merge request, or a saved copy of its text in `reviews/mr-0001.md`: a change to a limit with the template filled in, two different people (a peer or a Sensei is fine), and an AI use section.
6. `reviews/blameless-0001.md`: a blameless review of one failure, with a change at the end.
7. `reviews/ai-use.md`: the brief you used for the first-pass review and what it missed.

**Check:** ask a peer to try to merge a limit change that skips the template. What stops them, and what does not?

## 8. Checklist

- [ ] The repository says which changes are safety-relevant.
- [ ] The safety-relevant files are in named folders.
- [ ] The merge request template has four boxes and a sign-off line.
- [ ] A different person from the author reviewed the change.
- [ ] No agent approved a change it wrote, and no agent has real hardware or lab access.
- [ ] Every limit has a decision record.
- [ ] I know which parts of the rule my plan enforces and which are habit.
- [ ] My blameless review ends with a test, a check, a gate or a rule.
- [ ] Every merge request says what the agent did and what I checked.
- [ ] I noted that real hardware and real lab work need a trained supervisor and approval.

## 9. Further learning

Google's engineering practices explain what a reviewer looks for. The GitLab pages show how reviews, templates, code owners and approvals work, and what each plan includes. The ADR pages show other forms of decision record. The Google SRE chapter explains blameless reviews. The Anthropic article on safe and trustworthy agents describes why people should keep control of important decisions. You now have the three pieces the four tracks need: a way to doubt a model, a way to report, and a way to review. Return to the track you are building: [Robot software](/library/tracks/robot-software), [Robot learning](/library/tracks/robot-learning), [Bioinformatics](/library/tracks/bioinformatics) or [Lab automation in code](/library/tracks/lab-automation-in-code).
