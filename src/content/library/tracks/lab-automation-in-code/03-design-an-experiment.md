---
title: "Design an experiment"
description: "Turn a question into factors, levels, controls and replicates. Randomise a plate layout, handle edge effects and blocks, choose between full, fractional and space-filling designs, and see power by simulation."
section: "Lab automation in code"
order: 3
track: "lab-automation-in-code"
level: "core"
duration: "3 hours"
outcomes:
  - "Write an experiment as a question, a response, factors with levels and a stop rule"
  - "Add blanks, reference wells, a centre point and replicates, and say what each one is for"
  - "Randomise a plate layout with a recorded seed and keep the sensitive wells away from the edge"
  - "Say when to use a full factorial, a fractional factorial or a space-filling design"
  - "Explain statistical power in plain words and estimate it by simulation"
resources:
  - "nist/process-improvement"
  - "arxiv/exploring-benchmarks-for-self-driving-labs-using-color-matching"
  - "plos/ten-simple-rules-for-reproducible-computational-research"
  - "turing-way/guide-for-reproducible-research"
prerequisites:
  - "tracks/lab-automation-in-code/02-liquid-handling-protocols-in-python"
updated: 2026-11-19
---

**Supports:** this track, and the Developer path (a test plan is a design: what you vary, what you hold fixed, what you compare to). **Time:** about three hours. **Simulation only:** the data in this lesson is made up by code.

## 1. Why this matters

A fast robot makes it easy to run many experiments. It does not make them good. If the design is poor, the robot gives you a lot of confident, useless numbers, quickly.

A design answers questions before you spend anything. What are you changing? What will you compare it to? How many repeats do you need to tell a real effect from noise? Where on the plate does each sample go, so that the plate itself does not fool you? An agent can fill a plate in seconds and will not ask these questions. You must.

Design also comes before Bayesian optimisation (lesson 4). An optimiser needs a sensible search space, a clear measure of "better" and enough starting points. This lesson builds all three.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The question, what is measured, which factors and ranges, what good enough means and when to stop | Generating the design table, the randomised layout and a plot of it, from a written brief | That controls and replicates are present, the seed is recorded and no condition sits only on the edge | Statistics or data science (design and power), the bench scientist (what ranges are realistic), quality (records) |

## 2. Key ideas

### Start from a question and a response

An experiment answers a question. Write it as one sentence, and name what you will measure.

- **Question:** which mix of three dyes gives the colour closest to a target?
- **Response:** the thing you measure. Here it is the distance between the colour read from a well and the target colour. Smaller is better.
- **Stop rule:** when you stop. For example, after three rounds, or when the distance drops under a set value.

Without a response that you can compute, nothing downstream can work. An optimiser needs a single number to improve.

### Factors and levels

A **factor** is something you change on purpose. A **level** is one value of it. Here the factors are the volumes of cyan, magenta and yellow dye. A factor with two levels (low and high) is the simplest. Three or more levels let you see curves.

Everything you do not vary, you hold fixed and write down: the total volume in each well, the labware, the pipette, the order of steps. These are your **fixed conditions**.

### Controls: what you compare against

A **control** shows what happens when nothing special is done. Without one, you cannot tell an effect from the background. Three controls are worth the wells they take.

- A **blank** has no dye, only water. It shows what the reader returns for nothing. You subtract or divide by it.
- A **reference** is a recipe you run every round, always the same. If its reading drifts between rounds, something other than your factors changed.
- A **centre point** has every factor at the middle of its range. It shows whether the response is a straight line between the low and high levels, or curved.

### Replicates and noise

A **replicate** is a repeat of the same condition. Replicates measure noise. If two wells with the same recipe differ a lot, then a difference of the same size between two recipes means little.

Make your replicates honest. The best are independent: each prepared separately, not one well read twice. Reading the same well twice only tells you about the reader.

### Randomisation

Plates are not uniform. If you put all of recipe A in the left columns and all of recipe B in the right, any difference could be the recipe or the position. **Randomisation** shuffles which well each condition gets, so position effects spread out instead of lining up with one factor. Use a random number generator with a **seed**, write the seed down, and you can reproduce the layout.

### Edge effects and blocks

Outer wells of a plate often behave differently from inner wells. A common reason is that liquid in the outer wells evaporates faster, or is warmer or cooler. This is called an **edge effect**. Two simple moves help: keep your important samples in the inner block, and fill or avoid the outer ring. In this track the inner block is rows B to G and columns 2 to 11.

A **block** is a group of runs that share a nuisance factor you cannot remove, such as a plate or a day. The rule is to put every condition in every block, and compare inside blocks. If an experiment needs two plates, each plate is a block, and each has a blank and a reference.

In the lab-in-simulation of this track, the plate reader we write in lesson 6 adds a small edge effect on purpose, so that a careless layout is punished. That effect is invented. It is a teaching device, not a measurement of real plates.

### Three families of design

| Design | What it is | Strength | Weakness |
|---|---|---|---|
| Full factorial | Every combination of every level | Shows all effects and interactions | Runs grow fast: 2 levels and 3 factors is 8, but 3 levels and 5 factors is 243 |
| Fractional factorial | A chosen part of the full set | Far fewer runs | Some effects are mixed together ("aliased") |
| Space-filling | Points spread evenly over a continuous range | Good for many factors and curved responses | Less simple to read than a table of effects |

A **full factorial** with two levels of three factors has 2 x 2 x 2 = 8 runs. A **half fraction** keeps 4 of them. The price is that you cannot separate every effect. In the half fraction used below, the yellow effect is mixed with the cyan-by-magenta interaction. If one of them looks big, you cannot say which. That is fine for screening many factors cheaply. It is a bad bet when you care about interactions.

**Space-filling designs** (such as Sobol sequences and Latin hypercubes) pick points so that they cover the whole range without gaps or clumps. They suit continuous factors like volumes. They are also how many optimisers choose their first batch. Ax, which you meet in lesson 4, starts this way before it builds a model.

The NIST e-Handbook chapter on process improvement explains these designs with worked examples. Use it when you need to pick one.

### Power in plain words

**Power** is the chance that your experiment will show a real effect if one exists. Low power means a real effect usually goes unseen. More replicates, lower noise or a bigger effect all raise power.

You can estimate power without any algebra. Simulate the experiment many times with a made-up effect and made-up noise, and count how often a standard test finds it. Here is a small simulation. It assumes a true difference of 5 units, noise with a standard deviation of 3, and a t-test at p < 0.05, run 5,000 times for each group size.

```python
import numpy as np
from scipy import stats

rng = np.random.default_rng(1)


def power(effect: float, noise_sd: float, replicates: int, trials: int = 5000) -> float:
    """Share of simulated experiments where a t-test finds a real difference."""
    hits = 0
    for _ in range(trials):
        a = rng.normal(0.0, noise_sd, replicates)
        b = rng.normal(effect, noise_sd, replicates)
        hits += stats.ttest_ind(a, b).pvalue < 0.05
    return hits / trials


for n in (2, 3, 4, 6, 8, 12):
    print(f"{n:2d} replicates per group: power {power(5.0, 3.0, n):.2f}")
```

With the seed above, it prints:

```text
 2 replicates per group: power 0.17
 3 replicates per group: power 0.35
 4 replicates per group: power 0.51
 6 replicates per group: power 0.74
 8 replicates per group: power 0.88
12 replicates per group: power 0.98
```

Read it plainly. With two replicates per group, you would see this real effect about one time in six. With eight, nearly nine times in ten. These numbers belong to this made-up effect and noise. Yours will differ. The habit is what matters: estimate the noise first, then decide how many repeats you need.

## 3. Step by step

1. **Write the question, the response and the stop rule** on one page.
2. **List the factors,** their units, their ranges and the levels. Add any constraint, such as a maximum total volume.
3. **List the fixed conditions:** total volume, labware, pipette, order of steps.
4. **Choose a design family.** Few factors and a wish to see interactions: full factorial. Many factors and a wish to screen: fractional. Continuous ranges and an optimiser to follow: space-filling.
5. **Add controls:** a blank, a reference run in replicate and a centre point.
6. **Choose the number of replicates.** If you can estimate the noise, simulate power. If you cannot, say "noise not yet known" and plan to measure it first.
7. **Lay out the plate.** Decide the blocks. Shuffle the runs over the inner wells with a seed. Record the seed.
8. **Save the design as a file** and commit it, before the run.
9. **Review.** Ask: could any difference I see come from position, plate or day, rather than from the factor?

## 4. Worked example: the colour-mixing design

The capstone question is: which mix of cyan, magenta and yellow dye gets closest to a target colour? The response is the distance from a target, read from a simulated plate reader. Each well holds 150 microlitres in total, so water makes up whatever the three dyes do not.

Here is a small seeded design script. It builds the full factorial, the half fraction, a centre point, a blank and two reference replicates, then randomises them over the inner wells.

```python
"""A small, seeded experiment design for one 96-well plate."""

import itertools
import random

# Three dyes, two levels each (uL): a full factorial has 2 x 2 x 2 = 8 runs.
LEVELS = {"cyan": (10, 40), "magenta": (10, 40), "yellow": (10, 40)}
full = [dict(zip(LEVELS, combo)) for combo in itertools.product(*LEVELS.values())]

# Half fraction: keep runs where the sign product is +1 (yellow = cyan x magenta).
sign = {10: -1, 40: +1}
half = [r for r in full if sign[r["cyan"]] * sign[r["magenta"]] * sign[r["yellow"]] == +1]

centre = {"cyan": 25, "magenta": 25, "yellow": 25}
runs = (
    [{"name": f"full-{i}", **r} for i, r in enumerate(full)]
    + [{"name": "centre", **centre}]
    + [{"name": "blank", "cyan": 0, "magenta": 0, "yellow": 0}]
    + [{"name": f"reference-{i}", **centre} for i in (1, 2)]
)

# Shuffle which well each run goes to, inside rows B-G and columns 2-11.
inner = [f"{row}{col}" for row in "BCDEFG" for col in range(2, 12)]
wells = random.Random(42).sample(inner, len(runs))
layout = dict(zip(wells, runs))

if __name__ == "__main__":
    print(f"full factorial: {len(full)} runs, half fraction: {len(half)} runs")
    for well, run in sorted(layout.items()):
        print(well, run["name"], run["cyan"], run["magenta"], run["yellow"])
```

It prints `full factorial: 8 runs, half fraction: 4 runs`, then twelve lines, one per well. For example `B8 blank 0 0 0` and `F5 reference-1 25 25 25`. No run sits in rows A or H or in columns 1 or 12. The reference and the centre point share one recipe on purpose. If the three readings differ, that spread is your first look at the noise.

Now ask what the design can and cannot show. The full factorial can tell you which dye matters most and whether two dyes interact. The half fraction would save four wells but would mix the yellow effect with the cyan-by-magenta one. The design has two levels, so it cannot show a curve. The centre point can only hint at one.

For the capstone we choose differently, because we will let an optimiser pick the recipes. Each round has 8 recipes in the inner block, plus a blank and two references. The first round's 8 come from a space-filling sequence over 5 to 50 microlitres per dye, with the total of the three dyes capped at 120. After that, the optimiser chooses. The design file records the layout of each round with its seed. You will see this in lesson 6.

## 5. Working with AI agents on this

**What the PDM decides.** The question, the response, the ranges, the stop rule and the acceptable noise. An agent cannot know what good enough means for your decision.

**What you delegate, and the exact brief.** You may delegate the design table, the layout script and a plot. This is the **delegate** rung: a written brief, acceptance criteria and your review.

```text
Task: write a Python script, design.py, that builds a plate design.
Question: which volumes of cyan, magenta and yellow give the colour closest
to a target? Response: distance to target (smaller is better).
Factors: cyan, magenta, yellow, 10 uL and 40 uL (two levels).
Plate: 96 wells. Use only rows B-G, columns 2-11 (the inner block).

Rules:
1. Full factorial of the three factors, plus one centre point at 25 uL,
   one blank (all zero) and two replicates of the centre recipe.
2. Randomise the wells with random.Random(seed). Take the seed as an argument
   and print it.
3. Write the layout to design.csv with the columns well, name, cyan, magenta,
   yellow, and write a short design-notes.md that says what the design
   cannot show.
4. Do not claim any result. Do not invent statistics.
5. Add a test that checks: no run is in an edge well, every well is unique,
   the blank and both references are present.
Output: the script, the test, the notes.
```

**How you verify.** Run it twice with the same seed and check that the layout is identical. Run it with another seed and check that it changes. Count the runs: 8 + 1 + 1 + 2 = 12. Look for an edge well in the CSV. Read the notes and cross out any claim the data cannot support. Ask what is missing: a second block, a noise estimate.

**Which disciplines are involved.** A statistician or data scientist would check the design and the power. A bench scientist would say which ranges are realistic. A quality person would want the design file committed before the run, so that nobody can say it was chosen after seeing the data.

**Where this sits on the ladder.** This is **delegate**. It becomes **orchestrate** when several agents design several experiments at once. It becomes **govern** when a pipeline check refuses a design with no blank, no replicates or no recorded seed.

**Disclose.** Add to `design-notes.md`: "The script was drafted by an AI agent from my brief. I checked the layout, the seed and the controls myself." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **No controls.** Without a blank and a reference, a change in the numbers has no meaning.
- **Replicates that are not independent.** Reading one well three times measures the reader, not the process.
- **No randomisation, or a seed that was not saved.** You cannot reproduce the layout.
- **Putting important samples on the edge.** Keep them in the inner block.
- **Choosing the design after seeing the data.** Commit the design first.
- **Treating a fractional design as a full one.** Know which effects are mixed.
- **Believing an invented power number.** A power estimate is only as good as the noise it assumes.

## 7. Practice: a design file for your own question

**Deliverable:** a folder in your git repository, `lab/design/`, with a script, a layout, notes and a test.

1. Write your own question about three factors and one measurable response, even if it is the colour problem. Put it at the top of `lab/design/design-notes.md`.
2. Write `lab/design/design.py` so that it takes a seed and writes `lab/design/design.csv`, with controls and replicates.
3. Write a test, `lab/design/test_design.py`, for the checks in the brief.
4. Run the power simulation with an effect and a noise you choose. Paste the table into the notes and say, in two sentences, how many replicates you would plan and why.
5. In the notes, list three things your design cannot show.
6. Commit with a message such as `feat: add seeded plate design and test`.

**Check:** hand the notes to a friend. Ask them to find where the controls are and which wells are on the edge.

## 8. Checklist

- [ ] The question, response and stop rule are written down.
- [ ] Every factor has units, a range and levels.
- [ ] The design has a blank, a reference in replicate and a centre point.
- [ ] I chose a design family and know which effects it mixes together.
- [ ] The layout is randomised with a saved seed.
- [ ] No important sample is in an edge well.
- [ ] The design file is committed before any run.
- [ ] The notes say what the design cannot show.
- [ ] I recorded my AI use.

## 9. Further learning

The NIST e-Handbook chapter on process improvement is the best free reference for factorial, fractional and screening designs. The colour-matching paper on self-driving labs shows why colour mixing is a recognised test case. The Turing Way and the PLOS "Ten simple rules" help you make a design reproducible. Next, in [Bayesian optimisation for the next experiment](/library/tracks/lab-automation-in-code/04-bayesian-optimisation-for-the-next-experiment), you let a model choose the next batch.
