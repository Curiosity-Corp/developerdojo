---
title: "Capstone: a closed loop in simulation"
description: "Build a colour-mixing self-driving lab that runs entirely in simulation. Three dyes, three rounds: a generated protocol, a simulator check, a stand-in plate reader, a Bayesian optimisation step and an audit trail. Includes acceptance criteria and a review rubric."
section: "Lab automation in code"
order: 6
track: "lab-automation-in-code"
level: "advanced"
duration: "6 to 10 hours"
outcomes:
  - "Build a closed loop that designs, writes a protocol, simulates it, reads a stand-in reader, learns and logs"
  - "Check the simulator's volumes against the design before any result is used"
  - "Show a reviewer a README, three protocols with simulator logs, a progress plot, an audit log and a short report"
  - "Compare the loop with a random baseline and say what the result does and does not show"
  - "Review someone else's loop against numbered acceptance criteria and a rubric"
resources:
  - "opentrons/python-api-executing-and-simulating"
  - "ax/getting-started-with-ax"
  - "botorch/botorch"
  - "arxiv/exploring-benchmarks-for-self-driving-labs-using-color-matching"
  - "git/pro-git"
  - "who/laboratory-biosafety-manual-4"
prerequisites:
  - "tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate"
  - "tracks/lab-automation-in-code/02-liquid-handling-protocols-in-python"
  - "tracks/lab-automation-in-code/03-design-an-experiment"
  - "tracks/lab-automation-in-code/04-bayesian-optimisation-for-the-next-experiment"
  - "tracks/lab-automation-in-code/05-data-capture-and-audit-trails"
updated: 2026-11-19
---

**Supports:** the end of this track, the Developer path capstone habits (a repository a stranger can run and check) and the Master Developer Product Package. **Time:** about six to ten hours. **Simulation only.**

## 1. Why this matters

You now have every piece: a safety note, a protocol that simulates, a design, an optimiser and an audit log. A closed loop joins them so that each result becomes the next step, with nobody choosing recipes by hand.

The point is a loop that you and a stranger can both trust, not the colours. A loop whose volumes were never checked, whose reader was never labelled a stand-in and whose log can be edited without a trace has shown nothing.

Read your lesson 1 safety note first. Everything here runs in simulation. **The plate reader is a stand-in, not real chemistry.** Nothing in the result says how real dyes behave. Real lab work needs trained supervision and approval.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The scope (simulation only), the acceptance criteria, three rounds and what the report may claim | The modules, tests, plot and a draft report, one module at a time, from written briefs | Every criterion below, by running the code, and every report sentence against the data | A reviewer or Sensei, statistics (baseline, noise), security (who can change protocols), the lab's supervisor for anything real |

## 2. Key ideas

### The loop

One round does these steps, in this order. Each one writes an entry to the audit log.

1. **Design.** Ask the optimiser for 8 candidate recipes. Add a blank and two reference wells. Place all 11 in the inner wells with a seeded shuffle. Save `design.json`.
2. **Write the protocol.** Generate it from `design.json`. Nobody edits it by hand.
3. **Simulate.** Run `opentrons_simulate` and save the log. A failure stops the loop.
4. **Check.** Rebuild from the log how much of each liquid went into each well. It must equal the design.
5. **Read.** Ask the stand-in reader for a colour per well, correct by the blank and compute the distance to the target.
6. **Learn.** Give the distances back to the optimiser.
7. **Log.** Each step above writes an audit entry. After round three, add a finish entry.

Three rounds of 8 candidates make 24 recipes. Round one is space-filling. The next two use a model.

### The stand-in plate reader

The reader is a Python function. It follows a simplified light-absorption law, the Beer-Lambert law: light through a well is `255 x exp(-A)`, where `A` adds up each dye's absorbance by its share of the well. Cyan absorbs mostly red, magenta green and yellow blue. Each well holds 150 microlitres, and water fills what the dyes do not.

Noise is added on purpose, all seeded: 2 percent pipetting error on each dye, a lamp gain that drifts about 3 percent from plate to plate, 1.5 counts of reading noise and a 6 percent stronger reading in edge wells, as if water had evaporated. These numbers are invented, to make the problem need replicates, a blank and a good layout. They are not measurements.


The random draws depend only on the seed, the round and the well, not on the order of calls, so the loop is repeatable. The target colour comes from a recipe that the optimiser is never told. The **distance** is the straight-line distance in red-green-blue space between the blank-corrected reading and the target.

### Generating a protocol

The protocol is a template. The recipes go in as a dictionary of wells and microlitres. One `distribute` per liquid sends it to every well that needs it, with a list of volumes.

```python
for liquid in ["water", "cyan", "magenta", "yellow"]:
    wells = [w for w, mix in RECIPES.items() if mix.get(liquid, 0) > 0]
    if not wells:
        continue
    pipette.distribute(
        volume=[RECIPES[w][liquid] for w in wells],
        source=reservoir[SOURCES[liquid]],
        dest=[plate[w] for w in wells],
    )
```

Volumes are rounded to 0.1 microlitre, and water is 150 minus the dyes. A recipe over 150 raises an error. The rest is the Flex protocol from lesson 2, at API level 2.30.

### Checking the simulator against the design

This step keeps a stand-in reader honest. The reader must not take dye volumes from the design. It takes them from what the simulator says the robot did. Parse the run log: each `Aspirating` line from a reservoir well sets the current liquid, and each `Dispensing` line into a plate well adds a volume to that well.


If the parsed volumes differ from the design in any well, the loop raises an error and does not read. A bug in protocol generation cannot hide behind a good-looking colour.

### Three rounds, and what to expect

In the reference run for this lesson, the best distance after each round was 50.49, 24.07 and 11.66. The best recipe was 23.7 microlitres of cyan, 33.2 of magenta and 16.4 of yellow. The hidden target recipe was 22, 31 and 14. The audit log had 17 entries. Your numbers will differ unless you copy every detail. What must match is the shape: the best distance falls, the constraint holds and the checks pass.

The reference wells in that run read about 37 in round 1, 39 and 42 in round 2 and 44 in round 3. They drift because the lamp gain drifts per plate. A gap of a few counts between two recipes is inside the noise.

### The baseline

One loop run is an anecdote. Compare it with random choice. In the test setup, 300 random campaigns of 24 recipes each, with the same constraint and reader, had a median best distance of 25.2. About 7 percent reached 11.7 or lower. So the loop's 11.66 beats most random campaigns, yet luck could have produced it. One run cannot say more. Do this with your own code and say plainly what you find.

### Honest hardware notes

- **No GPU is needed.** Ax and BoTorch run on the CPU for a problem this small. A GPU helps with large models and many parameters, which this loop does not have.
- **Time.** The loop took about a minute on the test laptop, and in other runs from half a minute to a few minutes. If it is much slower, set `OMP_NUM_THREADS=4`. On one machine the model step took over two minutes without it.
- **Versions.** Install all packages in one command (lesson 2). The reference run used Python 3.12, `opentrons` 10.1.0, `ax-platform` 1.3.1 and BoTorch 0.18.1.
- **A real robot or reader.** Nothing here is ready for real equipment. A real run needs a lab, a supervisor, a risk assessment and approval (lesson 1). That is a different project.

## 3. Step by step

Build in this order. Test and commit after each step.

1. **Set up the repository** with the layout below and the safety note.
2. **Reader** and its tests: repeatable, edge wells read darker, water fills the rest.
3. **Protocol generator,** simulate function and log parser. Test that parsed volumes equal the recipe.
4. **Audit log** from lesson 5, with its tamper tests.
5. **Optimiser setup** from lesson 4, with the constraint and the full-batch loop.
6. **Layout function** with a seeded shuffle of the inner wells.
7. **`run_round` and `main`:** the seven steps in order, three rounds, a start and a finish entry.
8. **Report code,** then the **baseline**.
9. **Run the loop, verify the audit log, anchor the last hash** and commit.
10. **Write the README and the report,** record the screen and ask for a review.

### Repository layout

```text
colour-lab/
  README.md              what it is, how to run it, the stand-in statement, AI disclosure
  SAFETY.md              the safety note from lesson 1
  REPORT.md              the short report
  REVIEW.md              the reviewer's notes (added by the reviewer)
  pyproject.toml
  requirements.txt       pinned versions that you tested
  src/colourlab/
    reader.py            the stand-in plate reader
    protocol.py          protocol template, simulate, log parser
    audit.py             hash-chained log and verify
    loop.py              optimiser setup, layout, run_round, main
    report.py            results.csv, progress.png, summary.json
    baseline.py          random campaigns for comparison
    __main__.py          python -m colourlab
  tests/
    test_colourlab.py    reader, recipe, protocol and log, audit tamper tests
  runs/
    round-01/            design.json  protocol.py  simulator.log  readings.json
    round-02/
    round-03/
    ax_snapshot.json
  audit/audit.jsonl
  report/                results.csv  progress.png  summary.json
  media/                 a short recording or GIF
```

## 4. Worked example: acceptance criteria

A reviewer must be able to check each of these. The list is the heart of the capstone.

1. **Runs from a clean clone.** After one install command, `python -m colourlab` runs three rounds and exits with code 0.
2. **Layout.** Each round has 8 candidates, one blank and two reference wells, all in the inner wells (rows B to G, columns 2 to 11), placed by a seeded shuffle.
3. **Generated protocols.** Each round's protocol is written by code, declares `robotType` and `apiLevel` in `requirements` only, and simulates with exit code 0. The three protocols and three simulator logs are in `runs/`.
4. **Simulator check.** For every well in every round, the volumes parsed from the simulator log equal the design. A test proves that a mismatch raises an error.
5. **Stand-in reader.** The reader is seeded, the same seed gives the same readings and the README and the report say it is a stand-in.
6. **Optimiser.** It uses float parameters, the constraint and the minus-sign objective. A test shows that every proposal obeys the bounds and the constraint, and that short batches are handled.
7. **Audit log.** A start entry, then design, protocol, simulated, read and learned entries for each round, then a finish entry. `verify` returns no problems. Tests show that an edited entry, an edited file and a deleted file are each reported. The last hash is in the report and committed.
8. **Results.** `results.csv`, `progress.png` and `summary.json` are produced by code. The plot shows each candidate and the best so far, with labelled axes.
9. **Baseline and noise.** The report compares the loop with random campaigns and uses the reference wells to say how large the noise is.
10. **Tests pass.** `pytest` passes on a clean clone.
11. **Honest claims.** The README and report say what the work does not show. They claim no real chemistry, real equipment or regulatory compliance.
12. **Safety and disclosure.** `SAFETY.md` exists and matches lesson 1. The README discloses AI use.

### What to show

- **A README** that lets a stranger run the loop in five minutes, with the test results, date and versions.
- **A short screen recording or GIF** of the loop running in a terminal. Any screen recorder will do.
- **The three protocols and simulator logs,** the progress plot, `results.csv`, the audit log and the output of `verify`.
- **A one-page report.** Use the structure in [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report): the question, the method, the result, the limits and what you would do next. Add the baseline comparison and the reference-well noise. State the last audit hash.

### The review rubric

| Criterion | Meets the bar | Needs work |
|---|---|---|
| Reproducible | Clean clone runs, tests pass, same seed gives same results | Fails to run, or results change |
| Checked | Simulator volumes are compared with the design, with a test | The reader trusts the design |
| Honest | Stand-in stated; no claim beyond the data | Claims of real chemistry, equipment or compliance |
| Recorded | Audit log verifies; tamper tests fail when they should | Missing steps, or only good-case tests |
| Judged | Baseline and noise in the report; no overclaim | One run presented as proof |
| Clear | A stranger can follow README, report and plot | Hard to follow, unlabelled plot |
| Safe | Safety note, nothing for hardware, AI use disclosed | Missing note, or hardware code |

Score each row. The first three rows and the last must meet the bar to pass.

## 5. Working with AI agents on this

**What the PDM decides.** The scope, the acceptance criteria, what the report may claim and which parts the agent may write. Write briefs module by module. Never hand over "build the whole lab".

**What you delegate, and the exact brief.** One module at a time, at the **delegate** rung. Here is the brief for the loop module.

```text
Task: write src/colourlab/loop.py for the project in README.md.
reader.py, protocol.py and audit.py exist with passing tests. Do not change them.

run_round(client, log, round_index, root) must, in order: design (8 Ax
candidates, a blank, 2 references, inner wells, seeded shuffle), write the
protocol, simulate, parse the simulator log, compare with the design, read,
complete the Ax trials, and write one audit entry per step.

Rules:
1. Float parameters 5 to 50 uL, constraint cyan + magenta + yellow <= 120,
   objective "-distance". Loop until Ax returns a full batch.
2. The reader takes volumes from the parsed simulator log, never from the
   design. If any well differs from the design, raise an error.
3. Write no code that talks to real equipment.
4. Use only functions in the installed ax-platform. Print its version.
5. Do not claim the result is optimal.
Output: loop.py and a test for the mismatch error.
```

**How you verify.** Run it yourself. Then break it: change a volume in a protocol and check that the loop stops. Edit a line of the audit log and check that `verify` complains. Find the evidence file for each claim in the README and report. Check the sign of the objective and the constraint on every proposal.

**Which disciplines are involved.** A statistician checks the baseline and the noise. A reviewer or Sensei checks the criteria. Security asks who can change a protocol. The lab's supervisor decides if anything here ever goes near real equipment. Until then, the answer is no.

**Where this sits on the ladder.** One module at a time is **delegate**. Several agents writing modules in parallel is **orchestrate**: write the interfaces first and make the tests the contract. **Govern** is a pipeline that, on every merge request, installs from a clean checkout, runs the tests and the loop, verifies the audit log and refuses the merge if anything fails.

**Disclose.** Add to the README: "Parts of this code and report were drafted by AI agents from my briefs. I ran the loop and the tests, broke the checks on purpose and verified every claim against the data." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Reading the design instead of the simulator log.** A bug in the protocol then never shows.
- **Calling the reader real.** It is a stand-in. Say so in the README and report.
- **One run as proof.** Use a baseline and the noise from the reference wells.
- **Short batches.** Ax may give fewer than 8. Loop until full.
- **Editing a generated protocol by hand.** Change the generator and generate again.
- **Claims beyond the data.** "Optimal", "secure", "validated" and "compliant" need evidence you do not have.

## 7. Practice: build, show and be reviewed

**Deliverable:** the complete repository `colour-lab/` in your git repository, with `REPORT.md`, the README, the media and a passing test run.

1. Build the loop in the order of the step list. Commit after each step.
2. Check every acceptance criterion yourself and write the result of each in `REPORT.md`.
3. Add the baseline comparison and a short screen capture in `media/`.
4. Ask a Sensei or a peer to review it (next section) and keep their notes in `REVIEW.md`.
5. Fix what the review found. Commit with a message such as `feat: closed-loop colour lab in simulation`.

**Check:** can someone who has not seen the track run your README in five minutes?

### How a Sensei or peer reviews it

The reviewer works from a fresh clone and does not rely on the author's word.

1. **Read `SAFETY.md` and the README.** Check the stand-in statement and the AI disclosure.
2. **Install in a clean environment** with one command. Note the versions.
3. **Run the tests,** then the loop. Time it.
4. **Verify the audit log.** Then edit one line in a copy and confirm that `verify` reports it.
5. **Check the simulator step:** change one volume in a copy of a generated protocol and confirm that the loop stops.
6. **Walk the twelve criteria,** each with its evidence file.
7. **Read the report against the data.** Does each claim follow from `results.csv`, the plot and the baseline?
8. **Score the rubric** and write `REVIEW.md`: what meets the bar, what needs work, one thing done well, and any AI help used.

A failed criterion is reported with how to see it. The author fixes it and asks again. See [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review).

## 8. Checklist

- [ ] `SAFETY.md` exists, and everything runs in simulation.
- [ ] The README says the reader is a stand-in.
- [ ] Three generated protocols simulate, and the logs are saved.
- [ ] Simulator volumes are checked against the design in every well.
- [ ] Every proposal obeys the constraint, and a short batch is handled.
- [ ] The audit log verifies, tamper tests fail when they should and the last hash is in the report.
- [ ] The report has the random baseline and the noise.
- [ ] Tests pass on a clean clone.
- [ ] A reviewer wrote `REVIEW.md`.
- [ ] I recorded my AI use.

## 9. Further learning

The Opentrons page on executing and simulating lists the simulator's options. The Ax tutorial and the BoTorch site go deeper on the optimiser. The colour-matching paper describes a robotic version of this task, so you can see what a real setup adds. Reread the WHO manual and its risk assessment monograph before you ever think about a real run. Then try [Bioinformatics](/library/tracks/bioinformatics), [Robot software](/library/tracks/robot-software) and [Safety reports and review](/library/tracks/safety-reports-and-review).
