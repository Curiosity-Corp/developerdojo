---
title: "When not to trust a model"
description: "Learn how learned robot policies and biological prediction tools fail while looking sure. Read confidence honestly, do a small hazard analysis, write a safety case and set stop conditions."
section: "Safety, reports and review"
order: 1
track: "safety-reports-and-review"
level: "foundation"
duration: "3 hours"
outcomes:
  - "Explain distribution shift, confidence and calibration with one robot example and one biology example"
  - "Read a structure prediction's confidence scores and say which parts you would not rely on"
  - "Run a small hazard analysis and turn it into stop conditions a program and a person can check"
  - "Write a short safety case with a claim, an argument and evidence, and state its limits"
resources:
  - "nist/ai-risk-management-framework"
  - "nist/ai-rmf-generative-ai-profile"
  - "arxiv/concrete-problems-in-ai-safety"
  - "embl-ebi/alphafold-confidence-scores"
  - "mit-psas/stpa-handbook"
  - "university-of-york/amlas"
  - "scsc/goal-structuring-notation"
  - "who/ethics-and-governance-of-ai-for-health"
prerequisites:
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the capstones of [Robot software](/library/tracks/robot-software), [Robot learning](/library/tracks/robot-learning), [Bioinformatics](/library/tracks/bioinformatics) and [Lab automation in code](/library/tracks/lab-automation-in-code). Each one asks for a hazard list, a safety case and stop conditions. **Time:** about three hours.

## 1. Why this matters

A trained model has no sense of its own limits. It gives an answer. The answer looks the same whether the model has seen a thousand similar cases or none. Finding the edge of what a model knows is your job, not the model's.

Two pictures show the risk. A robot that fetches cups has learned in one well-lit room. One afternoon low sun puts glare on the floor. The camera sees something new, and the robot still picks an action and moves. In biology, a tool predicts a protein's shape and returns a tidy 3D model. Part of it is a guess, and the picture looks the same there. A plan built on that part can cost months.

This lesson gives you four tools. You read confidence honestly. You list what could go wrong. You write a **safety case**: a written argument, with evidence, that a system is safe enough to use. And you set **stop conditions**: rules that say when the system must stop or ask a person.

This is awareness, not a safety qualification. Real robot work needs a trained safety officer and a site risk assessment. Real lab work needs a trained supervisor and institutional approval. Here you use simulation and public data.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What harm matters, how much risk is acceptable, which stop conditions apply, who may override | Drafting a hazard list, the safety case text, the guard code and its tests | Every hazard against the real system, every piece of evidence against the real file | Safety engineering, lab supervision, legal, operations, design |

## 2. Key ideas

### Distribution shift

A model works best on inputs like its training data. **Distribution shift** means the real world drifts away from that data. An input unlike anything in training is called out-of-distribution. The 2016 paper [Concrete Problems in AI Safety](https://arxiv.org/abs/1606.06565) lists distributional shift among its five problems, next to safe exploration, side effects, reward hacking and scalable supervision.

| Field | Shift | What the model may do |
|---|---|---|
| Robot | New light, a new cup, a camera knocked a few degrees | Pick a confident, wrong action |
| Robot | Real motors differ from the simulator | Move too fast or miss |
| Biology | A protein family unlike the training data | Return a clean model that is a guess |
| Biology | A new instrument changes the noise | Give normal-looking scores that are not |

The danger is the silence: the model rarely says "this is new to me".

### Confidence is not correctness

A score is **calibrated** if, among cases where the model says 90%, it is right about 90% of the time. [On Calibration of Modern Neural Networks](https://arxiv.org/abs/1706.04599) (Guo and colleagues, 2017) found that modern deep networks are often badly calibrated. A model can be sure and wrong. You test this with a table: group answers by stated confidence and count how often each group was right.

### A biology example: structure confidence

The AlphaFold Protein Structure Database (EMBL-EBI with DeepMind) gives two measures. Its 2022 paper by Varadi and colleagues describes them.

- **pLDDT** is a score from 0 to 100 for each residue, one building block of the chain. At 90 or above, confidence is very high. From 70 up to 90, confident. From 50 up to 70, low. Below 50, very low. Very low scores correlate with intrinsic disorder: regions with no fixed shape.
- **PAE**, predicted aligned error, says how far off the relative position of two parts may be. When it is high between two domains, the paper says users should not read biological meaning into how the domains sit.

A model can be right inside each domain and wrong about how they fit. Check both scores. A prediction is not a measurement.

### Failure modes of learned robot policies

A **policy** is the software that picks the next action from what the robot senses. Learned policies fail in ways that are easy to miss:

- **Unseen scenes:** the glare, the new cup, a person standing oddly.
- **Compounding errors:** one small wrong move leaves the robot in a state it never saw. The next move is worse.
- **Reward hacking:** the robot finds a trick that scores well and does not do the job.
- **Simulation gap:** it worked in simulation and fails on hardware. See [Mind the sim-to-real gap](/library/tracks/robot-learning/03-mind-the-sim-to-real-gap).

### Hazard analysis in plain words

A **hazard analysis** is a structured search for what could go wrong and who could be hurt. Two methods help.

**FMEA, failure modes and effects analysis.** List each part. For each, write how it could fail, what happens, how bad it is and how you would notice. Fix the worst rows first.

**STPA, system-theoretic process analysis.** Look at control actions: commands one part sends another, such as "drive forward". The STPA Handbook by Nancy Leveson and John Thomas names four ways a control action can be unsafe. It is not given when needed. It is given when it should not be. It comes too early, too late or in the wrong order. Or it lasts too long or stops too soon. A learned policy is a good case: nothing is broken and the action is still wrong.

### Safety cases and stop conditions

A safety case has three parts. The **claim** says what is true: "The robot does not touch a person." The **argument** says why: "A separate sensor cuts arm power when a person is near." The **evidence** backs each step: a test log, a simulation run, a review record. Goal Structuring Notation (GSN) draws this as a tree. The University of York's AMLAS guidance gives patterns for the learned part. A plain Markdown file works too, if every claim links to evidence and the limits are stated.

A **stop condition** says when to stop or hand over to a person. Good ones do not depend on the model being right, fail safe, can be tested, and name who restarts. Human oversight means a person can see the system, stop it, and has the facts to judge. It does not mean clicking "OK" on every step. That is rubber-stamping.

### Frameworks and standards, by name

| Name | What it is | Cost |
|---|---|---|
| NIST AI Risk Management Framework (AI RMF 1.0, NIST AI 100-1), 26 January 2023 | A voluntary US framework with four functions: Govern, Map, Measure, Manage. NIST says it is being revised | Free |
| NIST AI 600-1, Generative Artificial Intelligence Profile, 26 July 2024 | A companion listing risks tied to generative AI | Free |
| ISO 10218-1:2025, Robotics, Safety requirements, Part 1: Industrial robots | Requirements for the robot | Paid |
| ISO 10218-2:2025, Robotics, Safety requirements, Part 2: Industrial robot applications and robot cells | Requirements for the application and cell | Paid |
| ISO/TS 15066:2016, Robots and robotic devices, Collaborative robots | A specification for robots sharing space with people | Paid |
| WHO, Ethics and governance of artificial intelligence for health, 28 June 2021 | Guidance with six consensus principles | Free |
| WHO, Laboratory biosafety manual, 4th edition, 21 December 2020 | Safe work in laboratories | Free |

ISO standards are sold by ISO and national bodies. This lesson names them and does not teach them. ISO's page for Part 2 says it complements ISO/TS 15066, which ISO lists as published and due for revision. Which text applies to a robot is a question for the site's safety officer. These documents give vocabulary and questions, not a certificate.

## 3. Step by step

1. **Write the system in one sentence,** with its limits: "simulation only", "public data only".
2. **List what it can touch:** people, hardware, data, samples, other systems.
3. **Do a small FMEA.** One row per part. Columns: how it fails, effect, how bad (1 to 5, your own scale), how you would notice.
4. **Ask three STPA questions per command:** what if it is not sent, sent when it should not be, sent too early, too late or too long?
5. **Name each model's out-of-distribution inputs** and what it would do then.
6. **Measure calibration** on a test set the model did not train on.
7. **Write stop conditions:** trigger, action, who restarts. Keep the check outside the model.
8. **Write the safety case:** one top claim, two to four sub-claims, each linked to evidence.
9. **State the limits,** then commit and ask someone to break it.

### Code: a calibration table

```python
def calibration_table(confidences, correct, bins=5):
    if len(confidences) != len(correct):
        raise ValueError("confidences and correct must have the same length")
    rows = []
    for b in range(bins):
        low, high = b / bins, (b + 1) / bins
        last = b == bins - 1
        picked = [(c, ok) for c, ok in zip(confidences, correct)
                  if (low <= c < high) or (last and c == 1.0)]
        if picked:
            avg_conf = sum(c for c, _ in picked) / len(picked)
            accuracy = sum(1 for _, ok in picked if ok) / len(picked)
            rows.append((low, high, len(picked), avg_conf, accuracy))
    return rows
```

Each row is `(low, high, count, average confidence, accuracy)`. A big gap between the last two numbers is a warning. Small bins are noisy.

### Code: a guard that does not ask the model

```python
import math
from dataclasses import dataclass

@dataclass(frozen=True)
class Verdict:
    action: str  # "proceed", "ask-a-person" or "stop"
    reason: str

def guard(value, training_min, training_max, confidence, min_confidence=0.8):
    if confidence is None or math.isnan(confidence):
        return Verdict("stop", "no confidence value")
    if not (training_min <= value <= training_max):
        return Verdict("stop", f"input {value} is outside the range seen in training")
    if confidence < min_confidence:
        return Verdict("ask-a-person", f"confidence {confidence:.2f} is below {min_confidence}")
    return Verdict("proceed", "inside range and confident")
```

A range check is crude and catches only the simplest shift. A missing confidence value stops the system, because a check that cannot run must not pass.

### Code: how much of a prediction is low confidence

The 2022 database paper says AlphaFold DB stores pLDDT in the B-factor field of its model files. In PDB text format that is columns 61 to 66 of each `ATOM` line.

```python
def low_confidence_fraction(pdb_text, threshold=70.0):
    scores = [float(line[60:66]) for line in pdb_text.splitlines()
              if line.startswith("ATOM") and line[12:16].strip() == "CA"]
    if not scores:
        raise ValueError("no C-alpha atoms found; is this a PDB file?")
    return sum(1 for s in scores if s < threshold) / len(scores), len(scores)
```

It is a screening number. It does not replace the PAE plot.

## 4. Worked example: two fictional systems

Both systems are fictional. Every number is an example.

**The TrailMug cup robot** is a fictional mobile robot in a fictional café. It drives to a table, picks up an empty reusable cup and returns it to a washing station. A learned vision model finds the cups. A short FMEA, on an invented scale:

| Part | How it fails | Effect | Bad (1-5) | How we notice |
|---|---|---|---|---|
| Vision model | Glare hides a cup, or a hand looks like a cup | Arm reaches toward a person | 5 | Hand-in-zone sensor, not the model |
| Drive base | Brakes late on a wet floor | Bumps a chair | 3 | Speed limit, bump sensor |
| Arm | Grips too hard | Cup breaks | 2 | Force limit |

STPA question on "reach toward the cup": it is provided when it should not be, because a hand is near. The top claim: *the arm does not move when a person is in the safe zone.* The argument: a separate sensor, not the vision model, cuts arm power. The evidence: a simulation that puts a person in the zone in 100 scripted runs, with the log in the repository. The limit: this covers the simulated sensor only. A real sensor needs its own tests and a safety officer.

**The colour-mixing simulated lab** is a fictional self-driving lab in simulation. A model suggests the next dye mix to match a target colour. A simulated liquid handler runs it. Here the hazards are wasted runs, false conclusions and habits that would be unsafe in a real lab. The model suggests a volume above the simulated pipette's maximum. The calibration table shows it is overconfident on dark colours. The stop conditions: stop if a volume is out of range, ask a person if confidence is below 0.8, and stop after 20 runs with no improvement. The `guard` function covers the first two. A real lab would add a trained supervisor and institutional approval. See the [biosafety lesson](/library/tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate).

**A biology report.** Say you run `low_confidence_fraction` on a public predicted structure and 40% of residues are below 70. Your report must not say "the protein folds like this". It must say which regions are low confidence and what you did not conclude.

## 5. Working with AI agents on this

**What the PDM decides.** The harm to avoid, the acceptable risk, the stop conditions, who may override. An agent cannot own a risk. A person does.

**What you delegate, and the exact brief.** Agents draft lists fast and do not know your real system.

```text
Help me draft a hazard list for a simulated robot or lab project.
Decide nothing. I will check every row.
System and parts: (pasted below).
Task 1: for each part, a row: how it fails, effect, severity 1 to 5, how
it would be noticed.
Task 2: for each command the model sends, answer: what if it is not sent,
sent when it should not be, sent too early, too late or too long?
Task 3: list inputs that would be out-of-distribution for each model.
Rules: mark every row "draft, unverified". Name no standard, clause or
statistic. Write "unsure" when unsure. Add no part that is not in my list.
Output: two Markdown tables and one bullet list.
```

**How you verify.** Read each row against the real system. Delete rows about parts that do not exist. Ask a colleague what was missed. Run the calibration code yourself. Open every log an agent mentions. A claim with no file to point at is an opinion.

**Which disciplines are involved.** Safety engineers and lab supervisors own the real rules. Legal says which standards apply. Operations asks who restarts. Design asks how a person is told the system is unsure.

**Where this sits on the ladder.** You **delegate** drafting with a written brief; your checks are the acceptance criteria. Several agents on several subsystems is **orchestrating**. A written rule that no hardware change merges without a named reviewer is **governing**. Lesson 3 builds it.

**Disclose.** Add: "Drafted with an AI agent from my brief; I checked every row." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Trusting the score.** 0.95 is not a 95% chance. Build the table.
- **Putting the check inside the model.** If the model is wrong, so is the check.
- **Checking only failed parts.** A learned system can be unsafe with nothing broken.
- **Reading the picture, not the scores.** A 3D model looks smooth where it is a guess.
- **No evidence links, no stated limits.** A claim with no file is a wish. "Safe" means safe under named conditions.
- **Letting an agent quote standards.** Agents invent clause numbers. Open the real document.

## 7. Practice: a hazard list, a guard and a safety case

**Deliverable:** these files in `safety/` in your git repository.

1. `system.md`: your system in one sentence and its parts. Use a worked example or your own project from one of the four tracks.
2. `hazards.md`: an FMEA table with six or more rows, and STPA questions for two commands.
3. `guard.py` and `test_guard.py`: the guard, and tests for proceed, ask-a-person, stop on range and stop on missing confidence. Direct an agent to write the tests. Run `python3 -m unittest`.
4. `calibration.md`: a calibration table. Use invented numbers labelled as an example, or a named public dataset.
5. `stop-conditions.md`: four or more, each with trigger, action and who restarts.
6. `safety-case.md`: one top claim, two to four sub-claims, the argument, evidence links and a "Limits" section.
7. `ai-use.md`: your brief, what the agent drafted, what you changed.

Commit in this order. Then ask a friend to find a sub-claim with no evidence.

## 8. Checklist

- [ ] I wrote the system in one sentence, with its limits.
- [ ] My hazard table covers parts, commands and model failure modes.
- [ ] I measured calibration, or said that I could not.
- [ ] Every stop condition has a trigger, an action and an owner.
- [ ] No stop condition depends on the model being right.
- [ ] Each claim links to a file I opened.
- [ ] The safety case ends with its limits.
- [ ] I named standards only after opening the real document, and said which are paid.
- [ ] I noted that real robot or lab work needs a trained supervisor and approval.
- [ ] I disclosed the AI use and what I changed.

## 9. Further learning

The NIST pages give shared words for AI risk. "Concrete Problems in AI Safety" is a short account of how learned systems go wrong. The EMBL-EBI tutorial shows how to read AlphaFold's confidence scores. The STPA Handbook, AMLAS and Goal Structuring Notation pages show how careful teams find hazards and build a safety case. The WHO guidance shows how a public body frames oversight of AI in health. Next, in [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report), you turn your evidence into a report others can check.
