---
title: "Write a technical report"
description: "Turn your evidence into a report a stranger can check. Use a fixed structure, show honest figures, write about failures, add a model card and a datasheet, and say how to repeat your results."
section: "Safety, reports and review"
order: 2
track: "safety-reports-and-review"
level: "foundation"
duration: "3 hours"
outcomes:
  - "Write a report with a question, method, setup, results, limitations, a reproducibility statement and data and code availability"
  - "Make figures and tables that show uncertainty and do not mislead"
  - "Write about failures in a way that helps the next reader"
  - "Write a model card and a dataset datasheet, and disclose AI use"
resources:
  - "arxiv/model-cards-for-model-reporting"
  - "arxiv/datasheets-for-datasets"
  - "turing-way/guide-for-reproducible-research"
  - "plos/ten-simple-rules-for-reproducible-computational-research"
  - "google/technical-writing"
  - "write-the-docs/software-documentation-guide"
prerequisites:
  - "tracks/safety-reports-and-review/01-when-not-to-trust-a-model"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the capstones of [Robot software](/library/tracks/robot-software), [Robot learning](/library/tracks/robot-learning), [Bioinformatics](/library/tracks/bioinformatics) and [Lab automation in code](/library/tracks/lab-automation-in-code). Each asks for a written report. **Time:** about three hours.

## 1. Why this matters

A result that nobody can check is a rumour. A report is how your work leaves your laptop. Another person reads it, decides whether to rely on it, and may build on it or stop building because of it. If your report hides a failure, that person pays for it later.

Robotics and biology both have a trap here. A robot demo shows the one run that went well. A bioinformatics result shows the one threshold that gave a clean picture. In both cases the honest report says how often it worked, under what conditions, and what happened when it did not.

A good report also saves you. In six months you will not remember which version of the data you used. The report, kept in git next to the code, does.

For the 2030 Product Development Manager the report is the main proof. You decide what the report claims. Agents can draft text, tables and plots. You check each number against the real run and you put your name on it.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The question, what the evidence supports, what to say about failures, who may reuse the data | Drafting prose, formatting tables, producing plots from your result files | Every number against the result files, every claim against the evidence, that the repeat instructions work | Domain experts, safety, legal (data licences, privacy), the people who will use the result |

## 2. Key ideas

### The structure

Use the same headings every time. Readers learn where to look.

| Part | The question it answers |
|---|---|
| Question | What did we want to know, and why does a decision depend on it? |
| Method | What did we do, in enough detail to repeat it? |
| Setup | What software, versions, data, hardware or simulator, and settings? |
| Results | What happened? Numbers first, with uncertainty |
| Limitations | Where does this not hold? What did we not test? |
| Reproducibility statement | How can someone repeat this, and what result should they see? |
| Data and code availability | Where are the data and code, under what licence? |

Put a short summary at the top: the question, the answer and the biggest limit, in four or five sentences. Many readers stop there.

### Results with uncertainty

A single number from a few runs is weak. "18 of 20 runs succeeded" is not "90% reliable". With 20 runs, the true rate could be well above or below 90%. Give an interval. The Wilson score interval is a simple choice for a success count. Say how many runs you made, say how you chose them, and say what you excluded and why.

### Figures that do not mislead

- Start bar charts at zero. A cut axis makes a small gap look large.
- Show spread: an interval, or every run as a dot. Never only a mean.
- Use the same scale when you compare two plots side by side.
- Label every axis with units. Say what n is.
- Do not drop the bad runs. If you removed one, say which and why.
- Say whether a result is from simulation or from real hardware. Put it in the caption.
- Do not rely on colour alone. Use shapes or labels too, so that colour-blind readers can read it.

### Writing about failures

A failure section is the most useful part of a report on a robot or a model. Write it as a table: what happened, how often, under what conditions, what you think caused it, and what you changed or did not change. Group failures by cause, not by date. Say which failures you have not explained. "We do not know why" is a fine and honest sentence.

Do not soften. "Occasionally the robot was less accurate" says nothing. "In 4 of 20 simulated runs the gripper closed on empty air when the cup was in glare" says everything.

### Model cards and datasheets

Two documents travel with a model and with data.

A **model card** is a short note on what a model is for and where it fails. Mitchell and colleagues proposed it in the paper "Model Cards for Model Reporting" at the FAT* conference in 2019. The paper's sections are: model details, intended use, factors, metrics, evaluation data, training data, quantitative analyses, ethical considerations, and caveats and recommendations. Intended use also says what the model is not for.

A **datasheet** describes a dataset. Gebru and colleagues proposed it in "Datasheets for Datasets", published in Communications of the ACM in 2021. The paper groups its questions as motivation, composition, collection process, preprocessing, cleaning and labelling, uses, distribution and maintenance.

You do not have to copy every question. You have to answer the ones that matter for your model or data, and say plainly when you do not know.

### A reproducibility statement

This is a short section that says how to get the same result. It has five things: the environment (language and library versions, or a container image), the data version, the random seeds, the exact commands, and the result to expect with a tolerance. The Turing Way and the PLOS article "Ten Simple Rules for Reproducible Computational Research" give longer lists. The PLOS rules include tracking how each result was made, using version control and sharing scripts and results.

Simulations make this easier than real labs. Fix the seed and the version, and the run should repeat. If it does not, that is a finding.

### Disclose AI use

Add one section, "How AI was used". Say what the agent did, which tool, and what you checked. See [Disclose AI use](/library/disclose-ai-use).

## 3. Step by step

1. **Write the question and the decision first.** One paragraph. If you cannot, you are not ready to write.
2. **Collect your evidence into files.** Raw results in `results/`, plots made by a script, nothing pasted by hand.
3. **Write the method and setup.** Include versions and seeds. Copy them from the real environment, not from memory.
4. **Make the results table.** Put counts and intervals, not only percentages.
5. **Make the figures from a script.** One command regenerates all of them.
6. **Write the failure table.** Include every failure you saw.
7. **Write the limitations.** List the conditions you did not test.
8. **Write the reproducibility statement,** then follow it yourself in a fresh folder. Fix what breaks.
9. **Write the model card and the datasheet** for any model and data you made or used.
10. **Write the summary last,** then the AI use section.

### Code: an interval for a success count

This uses only the Python standard library. `z=1.96` gives a 95% interval.

```python
import math

def wilson_interval(successes, trials, z=1.96):
    """Wilson score interval for a success rate."""
    if trials <= 0 or not 0 <= successes <= trials:
        raise ValueError("need 0 <= successes <= trials and trials > 0")
    p = successes / trials
    denom = 1 + z**2 / trials
    centre = (p + z**2 / (2 * trials)) / denom
    half = z * math.sqrt(p * (1 - p) / trials + z**2 / (4 * trials**2)) / denom
    return max(0.0, centre - half), min(1.0, centre + half)

low, high = wilson_interval(18, 20)
print(f"18 of 20 succeeded: 95% interval {low:.2f} to {high:.2f}")
```

The output is `18 of 20 succeeded: 95% interval 0.70 to 0.97`. Twenty runs cannot tell 70% from 97%. Say so in the report.

### A report skeleton

```markdown
# Report: <title>

Summary: <question, answer, biggest limit, in 4 to 5 sentences>

## Question
## Method
## Setup
## Results
## Failures
## Limitations
## Reproducibility statement
## Data and code availability
## Model card (or link) and datasheet (or link)
## How AI was used
```

## 4. Worked example: two fictional reports

Both projects are fictional and every number is an example, not a measurement.

**The TrailMug cup robot.** The report is about the cup-finding model of the fictional robot, tested in simulation.

*Question:* Does the cup-finding model find an empty cup on a simulated café table often enough that the robot can try a grasp? The decision: whether to move on to a bigger set of simulated scenes.

*Results:* In 20 simulated fetches, 18 succeeded. The 95% interval is 0.70 to 0.97, so the report does not say "90% reliable". It says what 20 runs can and cannot tell.

*Failures:*

| What happened | How often | Condition | Cause (guess) | Change |
|---|---|---|---|---|
| Gripper closed on empty air | 2 of 20 | Glare on table | Vision model missed the cup | None yet; add glare scenes |
| Two cups on one table | Not tested | All scenes had one cup | Not applicable | Listed as a limit |

*Limitations:* simulation only, one café layout, one cup shape, no people in the scene. The report says it makes no claim about a real robot.

*Reproducibility statement:* names the simulator version, the seed list, the command that runs all 20 scenes, and the expected output, including that the interval in the table should be reproduced exactly with the same seeds.

*Model card:* intended use is finding cups in simulated café scenes. Not for use near people. Evaluation data is the 20 scenes, which the report calls too few to say more.

**The colour-mixing simulated lab.** The report compares two ways to choose the next dye mix: random choice and a model that learns from past runs. Both are fictional examples.

*Question:* Does the model reach a target colour in fewer simulated runs than random choice?

*Results:* five seeds each. Show every seed as a dot, with the median marked, not a single average bar. Say that five seeds is small. If the model wins on four seeds and loses on one, say so. Do not pick the best seed.

*Datasheet:* the simulator generates the data. Motivation, composition and collection are short: the report says the data is simulated, lists the settings, and says it must not be treated as lab measurements. Under uses, it says "practice in a simulator; not evidence about real dyes".

**A bioinformatics report** would use the same shape. The failure table lists regions of a predicted structure with low confidence. The reproducibility statement names the database release or file, the tool versions and the commands. Lesson 1 shows how to read the confidence scores.

## 5. Working with AI agents on this

**What the PDM decides.** The question, what the evidence supports, how much to say about failures, and what goes public.

**What you delegate, and the exact brief.** Agents write clean prose and tables. They also smooth over awkward facts and invent numbers.

```text
Draft the Results and Failures sections of a technical report from the
files in results/ (listed below). Use only numbers that appear in those
files. Quote each number with the file it came from.
Rules: do not round up. Do not drop any failed run. Give counts as "x of n"
and add the interval from wilson_interval. If a number is missing, write
"MISSING: <what>". Do not explain causes unless I give you one; write
"cause unknown" instead. Do not describe real hardware or real lab work.
Output: Markdown with one results table and one failure table.
```

**How you verify.** Recompute every number from the result files. Run the plot script yourself. Check that every failed run in the logs appears in the failure table. Read the draft for soft words: "mostly", "generally", "usually". Replace each with a count. Then follow the reproducibility statement in a clean folder.

**Which disciplines are involved.** Domain experts check the claims. Legal checks the licences of data and code. Safety checks that limits are stated. A communications person helps if the report goes outside the team.

**Where this sits on the ladder.** You **delegate** the drafting with a brief; your checks are the acceptance criteria. When several agents draft several sections at once, you **orchestrate**, and one agent should own the numbers so they stay the same. A pipeline step that regenerates the figures and fails if a result file changed is **governing**: it keeps the report honest without you watching.

**Disclose.** End the report with the AI use section. Example: "An AI agent drafted the Results and Failures sections from files in `results/`. I recomputed every number and removed one sentence that claimed a cause I had not tested."

## 6. Common mistakes

- **Percent with no count.** "90%" hides that n was 10.
- **Only the good run.** Show all runs or say how you chose.
- **Failures in an appendix nobody reads.** Put them in the main text.
- **A cut axis.** A bar chart that starts at 80 exaggerates.
- **No limits.** "Works" means "works under these conditions". Name them.
- **Not testing the repeat instructions.** Follow them in a fresh folder.
- **Mixing simulation and real.** Label every figure.
- **Letting an agent write the causes.** It will give a smooth reason that you did not test.
- **A model card that only says good things.** Intended use must include what the model is not for.

## 7. Practice: a report in git

**Deliverable:** these files in `reports/<your-project>/` in your git repository.

1. `report.md`: a report using the skeleton, 800 to 1,500 words. Use your lesson 1 project or one of the two worked examples. Include a results table with counts and intervals, and a failure table with at least three rows (real or labelled as examples).
2. `figures.py` and the figure files it creates. One command makes all figures.
3. `model-card.md` for one model, using the nine section names above. Or `datasheet.md` for one dataset, using the seven groups above.
4. `REPRODUCE.md`: environment, data version, seeds, commands, expected output. Follow it in a fresh folder and note what you had to fix.
5. `ai-use.md`: your brief, what the agent drafted, and what you changed.

Use invented numbers labelled "example", or a public dataset that you name with its licence. Commit the results files before the report, so history shows the report followed the evidence.

**Check:** ask a friend to follow `REPRODUCE.md` without help. Note where they get stuck.

## 8. Checklist

- [ ] The report has all seven parts, and a summary on top.
- [ ] Every result shows a count and an interval or every run.
- [ ] No figure has a cut axis or hidden runs.
- [ ] Each figure says simulation or real.
- [ ] The failure table lists every failure I saw.
- [ ] The limitations name what I did not test.
- [ ] A model card or datasheet says what the model or data is not for.
- [ ] I followed the reproducibility statement in a clean folder.
- [ ] I recomputed every number an agent gave me.
- [ ] I disclosed AI use.

## 9. Further learning

The model card and datasheet papers are short and written for practitioners. Read the sections on contents and use them as templates. The Turing Way chapter and the PLOS article give practical rules for repeatable work. The Google technical writing courses and the Write the Docs guide teach the plain, short style a report needs. Next, in [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review), you set up the review that stands between a change and the real world.
