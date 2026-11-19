---
title: "Statistics for noisy biological data"
description: "Use simulated data with a known answer to see why thousands of tests produce false hits, how replicates and batch design change what you can find, and how to report an effect with its uncertainty."
section: "Bioinformatics"
order: 6
track: "bioinformatics"
level: "core"
duration: "3 hours"
outcomes:
  - "Tell a biological replicate from a technical one, and say why the first one counts"
  - "Control the false discovery rate with the Benjamini-Hochberg method and explain what it promises"
  - "Show with a simulation how replicates change what an experiment can find"
  - "Spot a design where a batch effect cannot be told apart from the result"
  - "Report an effect size with a confidence interval, not only a p-value"
resources:
  - "bioconductor/deseq2-vignette"
  - "ph525x/biomedical-data-science"
  - "galaxy-training-network/training-material"
  - "turing-way/guide-for-reproducible-research"
prerequisites:
  - "tracks/bioinformatics/03-alignment-and-variant-calling"
updated: 2026-11-19
---

**Supports:** the Bioinformatics track, and the Dojo habit of judging evidence before you act on it. **Time:** about three hours.

## 1. Why this matters

A modern experiment measures thousands of things at once: the activity of 20,000 genes, or millions of positions in a genome. If you test every one of them and keep those that look interesting, some will look interesting by chance alone. The more you test, the more of these you collect. Testing many things without adjusting for it is a well-known way to report false findings.

You will also meet a quieter problem. Samples are often processed on different days, by different people, or on different machines. Each of those leaves a mark in the data. If the mark lines up with the thing you are studying, you cannot tell them apart.

An AI agent can run a test over every gene in seconds and hand you a list of hits with p-values. It will not tell you that the experiment was too small to find anything, or that all the treated samples were run on a different day. Those are design questions, and they belong to you.

This lesson uses **simulated data**. You decide which genes really change, so you know the right answer and can see how often an analysis finds it. No real sample is involved.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| How many samples, how they are assigned to runs, and which error rate you accept before the data exist | Writing the simulation, running tests, drafting the plots and the summary | That the design separates groups from batches, and that the report gives effect sizes with uncertainty | A statistician or experienced analyst, the lab lead who knows how samples were handled |

## 2. Key ideas

### Replicates

A **biological replicate** is an independent sample from the same kind of thing: another animal, another culture grown separately, another person. A **technical replicate** is the same sample measured again. Technical replicates tell you about the measuring machine. They tell you nothing about how much real biology varies from one individual to the next. A conclusion about a condition needs biological replicates. Measuring one sample four times gives you four numbers, but one replicate.

### Counts are noisy in a specific way

Sequencing data for gene activity arrive as counts: how many reads landed on each gene. Counts of this kind vary more between replicates than a simple coin-toss model allows, and the extra spread grows with the size of the count. Specialised tools model this with a **negative binomial** distribution, which has a mean and a separate dispersion parameter. The simulation draws its counts that way.

### The p-value and the multiple testing problem

A p-value answers one narrow question: if nothing were going on, how often would data look at least this extreme? A p-value below 0.05 is expected for about 1 in 20 tests where nothing is going on. Test 5,000 such genes and about 250 pass, with no real effect anywhere.

### False discovery rate

The **false discovery rate**, FDR, is the share of the findings you report that you expect to be false. If you report 100 genes at an FDR of 5%, you expect about 5 of them to be false hits. The **Benjamini-Hochberg** method turns a list of p-values into adjusted values, often called q-values. Keep the genes with an adjusted value below 0.05 and you control the FDR at 5%, on average.

Two cautions. FDR says nothing about the real changes you missed. A very strict analysis can have a tiny FDR and still find almost nothing. And the promise is about the long run, so one experiment can land above or below it.

### Power and replicates

**Power** is the chance of finding a change that is really there. With few replicates, the estimate of the spread within a group is poor, and only very large changes stand out. More replicates give more power. No analysis can recover power that the experiment did not collect.

### Batch effects

A **batch effect** is a systematic difference caused by how or when samples were handled: the sequencing run, the day, the person, the kit. If every control sample was run in one batch and every treated sample in another, the batch and the treatment are tangled. No method can separate them afterwards. The fix is in the design: spread each group across batches, so the batch difference falls on both sides. Then you can record the batch and account for it.

### Effect size and uncertainty

A tiny p-value can come with a tiny change, if the sample is large. And a large change can come with a wide range of doubt, if the sample is small. Report the **effect size**, here the log2 fold change, where +1 means twice as high. Add a **confidence interval**, a range of values consistent with the data. A reader then sees both how big and how sure.

### What real tools do

The simulation here uses a simple t-test on log counts. That is a simplification. Packages built for counts, such as DESeq2 and edgeR in Bioconductor, model the negative binomial directly and share information between genes to stabilise the estimates. They are the better choice for real work, and the DESeq2 vignette is linked below. The ideas carry over; the exact numbers do not.

## 3. Step by step

You will run two simulations, then a small calculation. Install the packages with `pip install numpy scipy`. The reference runs used Python 3.13, NumPy 2.5.5 and SciPy 1.18.1.

### Step 1: Nothing changes, so every hit is false

Save this as `simulate.py`. It builds 5,000 genes whose counts follow a negative binomial. The first 250 can be made to change by a fixed factor.

```python
"""Simulated count data with a known answer: how many tests fool us, and how many replicates help?"""
import warnings

import numpy as np
from scipy import stats

warnings.filterwarnings("ignore", category=RuntimeWarning)  # SciPy warns when counts are nearly identical

N_GENES = 5000
N_TRUE = 250      # genes that really change
DISPERSION = 0.1  # negative binomial: variance = mean + DISPERSION * mean**2


def experiment(n_per_group: int, fold: float, seed: int) -> tuple[np.ndarray, np.ndarray]:
    """Return raw p-values and Benjamini-Hochberg adjusted p-values for every gene."""
    rng = np.random.default_rng(seed)
    mu = rng.lognormal(mean=5, sigma=1.5, size=N_GENES)
    r = 1 / DISPERSION
    mean = np.repeat(mu[:, None], 2 * n_per_group, axis=1)
    mean[:N_TRUE, n_per_group:] *= fold          # the first N_TRUE genes change by `fold`
    counts = rng.negative_binomial(r, r / (r + mean))

    keep = counts.sum(axis=1) >= 50              # drop genes with almost no reads
    logc = np.log2(counts + 1)
    p = np.ones(N_GENES)
    p[keep] = stats.ttest_ind(logc[keep, :n_per_group], logc[keep, n_per_group:], axis=1).pvalue
    return p, stats.false_discovery_control(p, method="bh")


# 1. Nothing changes anywhere. Every "hit" is a false alarm.
p, q = experiment(n_per_group=4, fold=1, seed=1)
print(f"Nothing changed: {(p < 0.05).sum()} genes have p < 0.05, {(q < 0.05).sum()} pass BH at 5%")

# 2. 250 genes change 4-fold. How many do we find with 2, 3, 4 and 8 replicates per group?
for n in (2, 3, 4, 8):
    _, q = experiment(n_per_group=n, fold=4, seed=1)
    hit = q < 0.05
    print(f"{n} per group: found {hit[:N_TRUE].sum():3d} of {N_TRUE} real changes, {hit[N_TRUE:].sum()} false hits")
```

Run it with `python -I simulate.py`; `-I` stops stray files in the folder from being imported.

### Step 2: Read the output

```text
Nothing changed: 241 genes have p < 0.05, 0 pass BH at 5%
2 per group: found   0 of 250 real changes, 1 false hits
3 per group: found   1 of 250 real changes, 0 false hits
4 per group: found 168 of 250 real changes, 12 false hits
8 per group: found 250 of 250 real changes, 10 false hits
```

### Step 3: Run a batch-effect design

Save this as `batch.py`. Again no gene differs between groups. But a second sequencing run raises 30% of genes two-fold. The only question is how the eight samples are assigned to the two runs.

```python
"""Simulated batch effect: the same samples, two ways of assigning them to two sequencing runs."""
import warnings

import numpy as np
from scipy import stats

warnings.filterwarnings("ignore", category=RuntimeWarning)  # SciPy warns when counts are nearly identical

N_GENES = 5000
DISPERSION = 0.1
N_PER_GROUP = 4


def false_hits(batch: np.ndarray, seed: int) -> int:
    """Nothing differs between groups. Batch B raises 30% of genes 2-fold. Count genes passing BH at 5%."""
    rng = np.random.default_rng(seed)
    group = np.array([0] * N_PER_GROUP + [1] * N_PER_GROUP)
    mu = rng.lognormal(mean=5, sigma=1.5, size=N_GENES)
    mean = np.repeat(mu[:, None], 2 * N_PER_GROUP, axis=1)
    touched = rng.random(N_GENES) < 0.3
    mean[np.ix_(touched, batch == 1)] *= 2
    r = 1 / DISPERSION
    counts = rng.negative_binomial(r, r / (r + mean))
    logc = np.log2(counts + 1)
    keep = counts.sum(axis=1) >= 50
    p = np.ones(N_GENES)
    p[keep] = stats.ttest_ind(logc[keep][:, group == 0], logc[keep][:, group == 1], axis=1).pvalue
    return int((stats.false_discovery_control(p, method="bh") < 0.05).sum())


confounded = np.array([0, 0, 0, 0, 1, 1, 1, 1])  # all controls in run A, all treated in run B
balanced = np.array([0, 0, 1, 1, 0, 0, 1, 1])    # each group split across both runs
print("Every gene is truly unchanged between groups.")
for seed in (1, 2, 3):
    print(f"seed {seed}: confounded design {false_hits(confounded, seed):4d} false hits, balanced design {false_hits(balanced, seed):4d}")
```

```text
Every gene is truly unchanged between groups.
seed 1: confounded design  124 false hits, balanced design    0
seed 2: confounded design  121 false hits, balanced design    0
seed 3: confounded design   91 false hits, balanced design    0
```

### Step 4: Effect size and a confidence interval

Save this as `interval.py`. It uses eight made-up counts.

```python
"""Effect size with a 95% confidence interval for one gene, from log2 counts."""
import numpy as np
from scipy import stats

control = np.log2(np.array([980, 1210, 1105, 1043]) + 1)
treated = np.log2(np.array([2310, 2050, 2490, 2175]) + 1)

result = stats.ttest_ind(treated, control)
low, high = result.confidence_interval(confidence_level=0.95)
print(f"log2 fold change {treated.mean() - control.mean():.2f}, 95% CI {low:.2f} to {high:.2f}, p = {result.pvalue:.1e}")
```

```text
log2 fold change 1.06, 95% CI 0.84 to 1.27, p = 2.0e-05
```

The change is a little over two-fold, with a plausible range of about 1.8 to 2.4 times. That says more than "p < 0.001".

## 4. Worked example: what the numbers say

**Nothing changed.** With every gene truly the same, 241 of the 5,000 genes still have p below 0.05. That matches the 1-in-20 expectation, which for 5,000 genes is about 250. Reported as they stand, these would be 241 false findings. After Benjamini-Hochberg adjustment, none pass at 5%. This is the job the method does.

**Replicates decide what you can find.** In the same simulation, 250 genes really change 4-fold. With 2 samples per group the analysis finds none of them. With 3 per group it finds 1. With 4 per group it finds 168. With 8 per group it finds all 250. The size of the real change never moved. Only the number of samples did.

**The false hits are not zero.** At 4 per group there are 12 false hits among 180 reported, which is 6.7%. At 8 per group there are 10 among 260, which is 3.8%. The target was 5%. The five seeds tested at 4 per group gave between 4 and 12 false hits, and between 149 and 172 real changes found. At 8 per group the five seeds gave 10 to 21 false hits, and 249 or 250 real changes found. So the realised rate wanders around the target, and the t-test on log counts is only approximate for count data. A single experiment gives you one draw.

**One simulation is a demonstration, not a proof.** The settings (5,000 genes, 250 changed, dispersion 0.1, a 4-fold change) were chosen for the lesson and are not typical of any real experiment. Do not copy the replicate numbers into a study design. Ask a statistician for a proper power calculation.

**The batch.** With all controls in one run and all treated samples in the other, the analysis reports 91 to 124 false hits for data in which no gene differs between groups. Spread the same eight samples across the two runs, and the false hits fall to 0 in all three seeds tested. The data and the test are the same. Only the sample-to-run assignment changed. No analysis done afterwards could have rescued the first design.

**A harmless warning.** SciPy may print a `RuntimeWarning` about precision loss when counts are nearly identical, as for genes with almost no reads. The scripts hide it and drop genes with fewer than 50 total reads. Filtering low counts is standard, but the cut-off is a choice to write down.

## 5. Working with AI agents on this

**What the PDM decides.** The error rate you accept, how many biological replicates you can afford, how samples are assigned to runs, and what counts as a result worth acting on. An agent will happily use whatever you give it, and it does not know the lab's constraints.

**What you delegate, and the exact brief.**

```text
Write simulate.py and batch.py for my repository, using numpy 2.5.5 and
scipy 1.18.1.
simulate.py: 5,000 genes, negative binomial counts with dispersion 0.1, 250
genes changed 4-fold. Run 2, 3, 4 and 8 samples per group. For each, print
how many real changes and how many false hits pass Benjamini-Hochberg at 5%
(scipy.stats.false_discovery_control). Also run one case where nothing
changes. Use fixed seeds and numpy default_rng.
batch.py: nothing differs between groups; a second run raises 30% of genes
2-fold. Compare a design where each group is in a different run to one where
each group is split across both runs. Print the false hits for three seeds.
Rules: do not tune any setting to make the result look better. State in the
script header that a t-test on log counts is a simplification of DESeq2 or
edgeR. No other libraries. Run with python -I.
Output: the two scripts, their printed output, and a half-page README that
says what each result does and does not show.
```

**How you verify.** Run both scripts yourself and compare your output with the agent's. Change a seed and see whether the story holds. Check that the README does not say the simulation shows how many replicates a real experiment needs. Ask the agent why it chose each setting.

**Which disciplines are involved.** A statistician reviews the design and the choice of method. The lab lead knows how samples are actually handled, so they can tell you which batches exist. If any samples came from people, privacy and ethics rules apply.

**Where this sits on the ladder.** This is a **delegate** task: a bounded piece of work with a written brief and checks you can run. The design decision, the replicate count and the error rate stay with you. For reading evidence more broadly, see [Research and evidence](/library/tracks/research-and-evidence).

**Disclose.** Add to the README: "AI use: scripts and first-draft README by an agent from my brief; I ran both scripts, changed the seeds, and edited every claim." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Treating a technical replicate as a biological one.** Four measurements of one sample are one replicate.
- **Reporting raw p-values for thousands of tests.** Adjust for multiple testing, and say which method.
- **Reading FDR as the share of real changes you caught.** It is the expected share of false hits among your reports.
- **Running every control in one batch and every treated sample in another.** The batch cannot be separated from the effect.
- **Reporting only p-values.** Give the log2 fold change and its interval.
- **Assuming a result with 2 or 3 samples per group means "no change".** It may only mean the experiment was too small to see one.

## 7. Practice: a design memo from simulation

**Deliverable:** a folder `06-statistics/` in your own git repository.

1. `simulate.py`, `batch.py` and `interval.py`, run with `python -I`, and a `results.txt` holding the printed output of all three.
2. Change at least one setting in `simulate.py`, for example the dispersion to 0.3 or the fold change to 2. Save the new output as `results-changed.txt`, and write two sentences on what moved.
3. `MEMO.md`, one page for a lab lead who plans a two-group experiment. It must say: how many biological replicates per group you would ask for and why (referring to your own simulation, with its limits), how you would assign samples to runs, which error rate you chose and what it means, and what you would report beside each p-value.
4. `README.md` with the AI-use line, and the statement that the simulation is not a power calculation.

**Check:** a newcomer should see from the memo why all controls must not sit in one run.

## 8. Checklist

- [ ] I can tell biological from technical replicates.
- [ ] I ran `simulate.py` and `batch.py` and got the same output as the lesson.
- [ ] I changed a setting and wrote what moved.
- [ ] I can say what FDR promises, and what it does not.
- [ ] My memo says how samples are assigned to runs.
- [ ] I report an effect size with an interval.
- [ ] I said the simulation is not a power calculation.
- [ ] The README has my AI-use line.

## 9. Further learning

The DESeq2 vignette in Bioconductor shows how real count data are modelled and tested. The PH525x book is a free online text on statistics for genomics, with chapters on replicates, batch effects and multiple testing. The Galaxy Training Network has tutorials that run in a web browser, which helps if your laptop cannot run containers. The Turing Way guide to reproducible research covers how to record a design and its analysis so someone else can repeat it. Next, the [capstone](/library/tracks/bioinformatics/07-capstone-raw-reads-to-a-report) puts the whole track together.
