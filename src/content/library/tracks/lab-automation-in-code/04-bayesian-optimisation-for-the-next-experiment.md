---
title: "Bayesian optimisation for the next experiment"
description: "Learn how a Gaussian process model and an acquisition function choose the next batch of experiments. Use Ax and BoTorch with noise and a constraint, and learn when Bayesian optimisation is the wrong tool."
section: "Lab automation in code"
order: 4
track: "lab-automation-in-code"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Explain a surrogate model, an acquisition function, exploration and exploitation in plain words"
  - "Describe expected improvement and upper confidence bound, and what each one favours"
  - "Run an ask-and-tell loop in Ax with a batch, noisy results and a constraint"
  - "Fit one Bayesian optimisation step by hand in BoTorch and read the model's uncertainty"
  - "List the cases where Bayesian optimisation is the wrong tool"
resources:
  - "ax/getting-started-with-ax"
  - "botorch/botorch"
  - "arxiv/a-tutorial-on-bayesian-optimization"
  - "gaussianprocess/gaussian-processes-for-machine-learning"
  - "arxiv/exploring-benchmarks-for-self-driving-labs-using-color-matching"
prerequisites:
  - "tracks/lab-automation-in-code/03-design-an-experiment"
updated: 2026-11-19
---

**Supports:** this track, and the Developer path (choosing what to try next with a model is a tool, and tools need review). **Time:** about three hours. **Simulation only:** the numbers in this lesson are made up by code.

## 1. Why this matters

Some experiments are cheap. You can run thousands. Others are slow or costly: each one takes a day, or uses a rare reagent. You cannot try every recipe. You need a way to choose the next few well.

**Bayesian optimisation** does this. It fits a model to the results so far, uses the model to judge which untried recipe is most worth testing and proposes it. You run it, add the result and repeat. This is the "learn" step of a closed loop. It is the part people mean when they say "self-driving lab".

It is also a place where plausible-looking output can mislead you. The optimiser always gives an answer. It does not tell you that your measure is bad, your noise is large or your search space leaves out the best recipe. This lesson teaches how it works well enough to challenge it.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The objective, the ranges, the constraints, the batch size, the budget and when to stop | Writing the optimiser code and a plot, from a written brief | That the objective's direction is right, constraints hold in every proposal and the result beats a plain baseline | Statistics and data science (the model and the noise), the bench scientist (are the ranges and constraints real), security (who can change the optimiser) |

## 2. Key ideas

### The problem: a function you can only sample

You have a **black-box function**. You choose a recipe and an experiment returns a number, such as a distance from a target colour. You do not know the formula. Each call is costly. You want the recipe that gives the best number in as few calls as you can.

### A surrogate model

The first piece is a **surrogate model**: a cheap stand-in for the black box, fitted to the data you have. The usual choice is a **Gaussian process** (GP). A GP does not return one number for a new recipe. It returns a prediction and a measure of how unsure it is. Near a recipe you tested, the uncertainty is small. Far from all tests it is large. That second number is what makes Bayesian optimisation different from plain curve fitting.

### An acquisition function

The second piece is an **acquisition function**. It scores every possible recipe by how worth testing it is, using the model's prediction and uncertainty. You then pick the recipe with the best score. Two common ones:

- **Expected improvement (EI)** scores a recipe by how much better than the best result so far you would expect it to be, averaged over what the model believes. It favours points that may beat your best.
- **Upper confidence bound (UCB)** scores a recipe by its predicted value plus a multiple of its uncertainty. (When you minimise, you use the lower bound.) A larger multiple makes the search bolder.

Both handle a trade-off. **Exploitation** means testing near the best recipe you know. **Exploration** means testing where the model is unsure, because the best recipe may be there. A good acquisition function balances the two. You do not get that balance from "always try the current best".

### Batches

A robot plate holds many wells. It would be wasteful to run one recipe at a time. So you ask for a **batch**: several recipes for the next round. The recipes in a batch must differ from each other, or they will repeat the same information. Libraries handle this, for example by asking for the points one at a time while accounting for the ones already chosen. In Ax, you ask for a batch with `get_next_trials`.

### Noise

Real measurements are noisy. A noisy result is not the true value of the recipe. A good model treats the noise as part of the data. It does not chase one lucky reading. You help by measuring the noise: replicates (lesson 3) tell you how large it is.

There is a trap. If you run many recipes with noisy readings, the best of them will look better than it truly is, because some got lucky. This is sometimes called the winner's curse. A fair check is to rerun the winner. Do not report the best reading as the true value.

### Constraints

Some recipes are not allowed. In the colour lab, the three dyes together may not pass 120 microlitres, so that every 150 microlitre well keeps at least 30 microlitres of water. A **constraint** tells the optimiser about this, so it never proposes a recipe you cannot make. Ax lets you write a linear constraint on parameters as a string, such as `"cyan + magenta + yellow <= 120"`. It also supports constraints on the outcome.

### Ax and BoTorch

**BoTorch** is a library for Bayesian optimisation built on PyTorch. It has the models and acquisition functions. **Ax** is a platform from the same project that sits on top of it. Ax handles the experiment: parameters, trials, results, constraints, saving. By default it chooses a method for you. For a few first trials it uses a space-filling sequence, because there is nothing to model yet. After that, it fits a model with BoTorch. Both are open source under the MIT licence.

Use Ax for a real loop. Use BoTorch directly when you want to see or change the model. This lesson shows both.

### When Bayesian optimisation is the wrong tool

- **Runs are cheap.** If you can try every recipe, do that. A grid or a space-filling design is simpler and has no model to doubt.
- **You want to understand, not optimise.** If the question is "which factors matter?", use a factorial design (lesson 3) and read the effects.
- **The noise is larger than the signal.** A model cannot learn from data that is mostly noise. Fix the measurement first.
- **There are very many factors.** Modelling gets harder as the number of factors grows. Reduce them with a screening design first.
- **The measure is wrong.** If "better" is not what you care about, a very good optimiser finds the wrong thing very well.
- **A fast rule or a person already knows the answer.** Do not add a model for its own sake.
- **You need a guarantee.** The method is a guide to what to try. It does not prove that the best recipe is the best possible one.

## 3. Step by step

1. **Write the objective** as one number and say whether smaller or larger is better.
2. **Write the search space:** each factor, its range and its units. Add constraints.
3. **Choose the batch size and the number of rounds.** Each batch must fit on a plate with its controls.
4. **Plan the first batch** as a space-filling design, or let Ax do it.
5. **Ask** for a batch, run it, then **tell** the results back, with the trial index.
6. **Check each batch** against the constraints before you run it.
7. **Track the best so far** and the reference wells in every round.
8. **Stop** at the budget, or when the stop rule from lesson 3 is met.
9. **Compare with a baseline,** such as the same number of random recipes. If the optimiser does no better, say so.
10. **Save the state** and commit the code, the settings and the seed.

## 4. Worked example: three dyes in Ax

This script runs three rounds of eight recipes, using a made-up noisy measure in place of the plate reader. The made-up measure is the distance from a target recipe, plus noise. The real loop in lesson 6 replaces `measure` with the simulated reader.

```python
"""Ask-and-tell with Ax: three dyes, a made-up objective, a cap on total dye."""

import numpy as np
from ax.api.client import Client
from ax.api.configs import RangeParameterConfig

TARGET = {"cyan": 22.0, "magenta": 31.0, "yellow": 14.0}
rng = np.random.default_rng(0)


def measure(p: dict[str, float]) -> float:
    """A made-up noisy distance to a target recipe. Smaller is better."""
    gap = sum((p[d] - TARGET[d]) ** 2 for d in TARGET) ** 0.5
    return float(gap + rng.normal(0.0, 1.0))


client = Client(random_seed=0)
client.configure_experiment(
    parameters=[RangeParameterConfig(name=d, parameter_type="float", bounds=(5, 50)) for d in TARGET],
    parameter_constraints=["cyan + magenta + yellow <= 120"],
    name="toy-colour",
)
client.configure_optimization(objective="-distance")  # Ax maximises, so minimise by negating
client.configure_generation_strategy(
    method="fast", initialization_budget=8, initialize_with_center=False, initialization_random_seed=0
)


def ask_for_batch(size: int) -> dict[int, dict[str, float]]:
    """Ax may return fewer trials than asked for, so ask again for the rest."""
    trials: dict[int, dict[str, float]] = {}
    for _ in range(size):
        trials.update(client.get_next_trials(max_trials=size - len(trials)))
        if len(trials) >= size:
            return trials
    raise RuntimeError(f"Ax gave {len(trials)} trials, wanted {size}")


for round_index in range(3):
    trials = ask_for_batch(8)  # ask: a batch of recipes
    for index, params in trials.items():
        client.complete_trial(trial_index=index, raw_data={"distance": measure(params)})  # tell
    print(f"round {round_index + 1}: {len(trials)} trials")

best, _, trial, _ = client.get_best_parameterization(use_model_predictions=False)
print("best trial", trial, {k: round(v, 1) for k, v in best.items()})
```

Read the parts that matter.

- **Float parameters.** The volumes are floats. In the full loop they are rounded to 0.1 microlitre before the protocol is written. We tried integer parameters first. Ax rounds them at random, and the same seed then gave different runs. Floats with your own rounding keep the loop repeatable.
- **The minus sign.** Ax maximises. The objective `"-distance"` tells it that a smaller distance is better.
- **The batch loop.** On one run of this script the first model-based request for eight trials returned only one, with a warning that 8 trials were requested but only 1 could be generated. A loop that asks again for the rest gives you a full batch. A script that does not handle this runs a half-empty plate without telling you.
- **The best result.** `use_model_predictions=False` returns the best observed trial. With the seed above the script found a recipe near the target (22, 31, 14), of about (21, 32, 16). That is a property of this made-up measure with this seed. It is not a result about any real chemistry.

The first batch has no model behind it. It is space-filling. From the second batch on, a Gaussian process is fitted and an acquisition function chooses the points. Ax decides which, so check its documentation if you need to know.

### One step by hand in BoTorch

To see the model, use BoTorch directly. Here one dye is varied from 5 to 50 microlitres. There are five results so far: the distance to the target was 80, 45, 20, 30 and 75 at 5, 15, 25, 35 and 50 microlitres.

```python
import torch
from botorch.acquisition import LogExpectedImprovement
from botorch.fit import fit_gpytorch_mll
from botorch.models import SingleTaskGP
from botorch.models.transforms import Normalize, Standardize
from botorch.optim import optimize_acqf
from gpytorch.mlls import ExactMarginalLogLikelihood

torch.manual_seed(0)

x = torch.tensor([[5.0], [15.0], [25.0], [35.0], [50.0]], dtype=torch.double)
distance = torch.tensor([[80.0], [45.0], [20.0], [30.0], [75.0]], dtype=torch.double)
bounds = torch.tensor([[5.0], [50.0]], dtype=torch.double)

# BoTorch maximises, so we model the negative distance.
y = -distance
model = SingleTaskGP(x, y, input_transform=Normalize(d=1, bounds=bounds), outcome_transform=Standardize(m=1))
fit_gpytorch_mll(ExactMarginalLogLikelihood(model.likelihood, model))

acquisition = LogExpectedImprovement(model, best_f=y.max())
candidate, score = optimize_acqf(acquisition, bounds=bounds, q=1, num_restarts=5, raw_samples=20)
print(f"next dye volume to try: {candidate.item():.1f} uL")

with torch.no_grad():
    for v in (10.0, 25.0, 40.0):
        posterior = model.posterior(torch.tensor([[v]], dtype=torch.double))
        mean, sd = -posterior.mean.item(), posterior.variance.sqrt().item()
        print(f"at {v:4.1f} uL: predicted distance {mean:5.1f}, model uncertainty (1 sd) {sd:.1f}")
```

It prints:

```text
next dye volume to try: 27.2 uL
at 10.0 uL: predicted distance  63.6, model uncertainty (1 sd) 1.9
at 25.0 uL: predicted distance  20.2, model uncertainty (1 sd) 1.8
at 40.0 uL: predicted distance  45.2, model uncertainty (1 sd) 2.8
```

Read it. The model puts the best region between 25 and 35, and the next point it picks is 27.2, close to the best result so far and a little towards the better side. The uncertainty is largest at 40, which is the biggest gap between tested points. The `Normalize` and `Standardize` transforms rescale the inputs and outputs, which helps the model fit. `LogExpectedImprovement` is a numerically steadier form of expected improvement. You may see a deprecation warning from PyTorch when you run it. It is not about your code.

Now try changing one result to an outlier and run it again. See how the proposal moves. That tells you how much one noisy reading can steer the search.

## 5. Working with AI agents on this

**What the PDM decides.** The objective and its direction, the search space and constraints, the batch size, the budget and the baseline the optimiser must beat.

**What you delegate, and the exact brief.** You may delegate the code and its plots. This is the **delegate** rung: a written brief, acceptance criteria and your review.

```text
Task: write opt.py that runs 3 rounds of Bayesian optimisation with Ax
(ax-platform, Client API) for three parameters: cyan, magenta, yellow,
each a float in [5, 50] uL, with the constraint cyan + magenta + yellow <= 120.
Objective: minimise `distance`. Batch size 8.

Rules:
1. Use only functions that exist in the installed version of Ax. Print
   `ax.__version__` and give the docs page for every function you call.
2. Minimise by passing "-distance" as the objective. Say why.
3. Ax may return fewer trials than requested. Loop until you have 8.
4. Use a seed. Print it.
5. Verify every proposal satisfies the constraint and fail loudly if not.
6. Compare with 24 random recipes under the same constraint and report both
   best values.
7. Do not claim the result is optimal.
Output: opt.py, a test, and the printed comparison.
```

**How you verify.** Check the sign: does the best trial have the smallest distance, not the largest? Check that every proposal obeys the constraint, in the file, not in the agent's report. Run it twice with the same seed and compare. Read the comparison with random recipes. If the optimiser is not clearly better, say so. Look up each Ax function in the docs, because agents often use the older interface of a library.

**Which disciplines are involved.** Statistics and data science judge the model, the noise and the baseline. The bench scientist says whether the ranges and constraints are real. Security asks who may change the optimiser's settings in a loop that drives equipment.

**Where this sits on the ladder.** This is **delegate**. It becomes **orchestrate** when several optimisers run on several experiments. It becomes **govern** when a gate in the pipeline refuses a proposal that breaks a constraint or a budget, whatever the agent wrote.

**Disclose.** Add to the README: "The optimiser code was drafted by an AI agent from my brief. I checked the sign, the constraint and the comparison with random recipes myself." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Minimising the wrong way.** Ax and BoTorch maximise. Negate a distance.
- **Trusting the best reading.** With noise, the best result is partly luck. Rerun the winner.
- **No baseline.** Without random recipes for comparison, you cannot tell if the model helped.
- **Ignoring a short batch.** Ask again until the batch is full.
- **Constraints only in the report.** Check them in code, for every proposal.
- **No seed, no record.** Save the seed and the settings.
- **Optimising a bad measure.** Check the objective first.

## 7. Practice: an optimiser with a baseline

**Deliverable:** `lab/optimise/opt.py`, a test and `lab/optimise/NOTES.md` in your git repository.

1. Adapt the Ax script to your own made-up measure and three factors. Keep a constraint and a seed.
2. Add a loop for a random baseline with the same number of recipes and the same constraint.
3. Write a test that checks, for every proposal, the bounds and the constraint, and that two runs with the same seed give the same batches.
4. Run both and put the best value of each in `NOTES.md`. Say in two sentences whether the optimiser beat the baseline, and what the noise level means for your answer.
5. Run the BoTorch example, change one result to an outlier and describe in the notes how the next point moves.
6. Commit with a message such as `feat: add Ax optimiser with random baseline`.

**Check:** add a column "true value without noise" to your made-up measure and compare it with the best reading. Is the winner's reading too good?

## 8. Checklist

- [ ] The objective is one number, and I know which direction is better.
- [ ] Parameter ranges, units and constraints are written in code.
- [ ] Every proposal is checked against the constraints before it runs.
- [ ] The batch is full, and a short batch is handled.
- [ ] A seed and the settings are saved.
- [ ] I compared against random recipes.
- [ ] I reran or doubted the best reading.
- [ ] I can say when Bayesian optimisation would be the wrong tool.
- [ ] I recorded my AI use.

## 9. Further learning

The Ax "Getting started" tutorial shows the Client interface used here. BoTorch's site has tutorials on the models and acquisition functions. Peter Frazier's "A Tutorial on Bayesian Optimization" is a free and readable introduction that includes noise, batches and constraints. The book "Gaussian Processes for Machine Learning" is free to download and is the deep reference. The colour-matching paper shows why colour mixing is used as a test for self-driving labs. Next, in [Data capture and audit trails](/library/tracks/lab-automation-in-code/05-data-capture-and-audit-trails), you make every run checkable.
