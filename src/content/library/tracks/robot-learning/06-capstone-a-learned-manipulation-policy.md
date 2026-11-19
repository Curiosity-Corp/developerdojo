---
title: "Capstone: a learned manipulation policy"
description: "Deliver one learned policy for one simulated manipulation task, with an evaluation protocol, baselines, rollout videos, an interval-backed results table and a written failure report that a reviewer can reproduce."
section: "Robot learning"
order: 6
track: "robot-learning"
level: "advanced"
duration: "8 to 12 hours"
outcomes:
  - "Deliver a trained policy for one simulated task in a repository that a stranger can rebuild"
  - "Evaluate it with fixed seeds, baselines and a stress test, and report each result with an interval"
  - "Write a failure report from watched videos, with a taxonomy and a list of what the results do not show"
  - "Present the work in a README, a short animation and a written report"
  - "Review a peer's capstone against a rubric and write useful comments"
resources:
  - "hugging-face/lerobot"
  - "hugging-face/lerobot-dataset-v3"
  - "hugging-face/lerobot-hardware-guide"
  - "arxiv/diffusion-policy"
  - "arxiv/learning-fine-grained-bimanual-manipulation"
  - "wikipedia/binomial-proportion-confidence-interval"
  - "arxiv/datasheets-for-datasets"
  - "google/technical-writing"
prerequisites:
  - "tracks/robot-learning/01-learn-from-demonstrations"
  - "tracks/robot-learning/03-mind-the-sim-to-real-gap"
  - "tracks/robot-learning/05-evaluate-a-policy-and-report-failures"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot learning track and the Master Developer Product Package, as the evidence that you can deliver a learned policy and defend what it does. **Time:** about eight to twelve hours, mostly waiting for training.

## 1. Why this matters

This is the piece you can show. A reviewer will not read your notes from five lessons. They will open one repository, read one README, run one command and look at one report. If it is honest, repeatable and clear about its limits, it proves more than a flashy demo.

The capstone tests the habit this track teaches: you decide what success means before you train, you measure against baselines, and you write down what went wrong. A policy that scores zero, honestly reported, can pass. A high score with no baseline, no seeds and no failure report cannot.

Nothing here needs a robot. Everything runs in simulation on public data.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The task, the success rule, the protocol, the budget and what claim the evidence supports | Code, training runs, plots, README and report drafts | Every number against the raw files, the seeds, the failure causes by watching videos, and each claim in the report | Safety (what a failure would cost on hardware), quality (the acceptance criteria), legal (dataset and model terms) |

## 2. Key ideas

### What to build

Deliver **one learned policy for one simulated manipulation task**, evaluated fairly. Choose one path.

- **Path A, laptop CPU.** Start from your lesson 5 folder. The task is PushT, with the public `lerobot/pusht` demonstrations. Change one thing in the small policy and evaluate both versions. Expect a weak policy. That is allowed: the marks are for the evidence, not the score.
- **Path B, one GPU.** Train a standard LeRobot policy, `diffusion` or `act`, on the same data with `lerobot-train`, and evaluate it. You can use a free cloud notebook if it gives you a GPU today. LeRobot's hardware guide says its CPU-only machines are not meant for training these policies. On the CPU of a 28-core desktop, a diffusion policy took about six seconds per step at batch size 8, so a full run is not possible there.

Both paths use the same protocol and report. You may choose another public simulated task if your reviewer agrees in writing first. Do not use data you have no right to use.

### Honest compute

- A GPU makes training faster and opens the larger policies. It does not make your evaluation fairer.
- On a free notebook, sessions end and plans change. Check what it offers today. Save checkpoints often and keep the training command in the README.
- If your policy is weak, say so, and spend your spare hours on the baselines, the stress test and the failure report. The rubric pays for those.

### Acceptance criteria

A reviewer can check each of these. Number them in your README and say where each is met.

1. **Repository.** One git repository. A fresh clone plus the README commands reproduces every number in the report. Versions of Python and each library are listed.
2. **Dataset note.** `DATASET_NOTE.md` gives the source, licence, size, fields and three things the data does not show, copied from the dataset's own page.
3. **Policy.** A trained policy, the exact training command, the seed and the training log. Large weights stay out of git: record where they are and their SHA-256 checksum.
4. **Protocol first.** `PROTOCOL.md` names the task, the success rule, the seed range, the number of episodes, the baselines and the stress test. Git history shows it was committed before the final evaluation.
5. **Fair evaluation.** At least 50 fixed-seed episodes. Report successes out of episodes with a 95 per cent Wilson interval, and mean best coverage or another stated second measure.
6. **Baselines.** A policy that never moves and a random policy, on the same seeds.
7. **Stress test.** At least one change you did not train for, such as noise on the sensor, with its own result and interval.
8. **One change.** A second policy that differs from the first in one stated way (more training, a larger image, action chunks, data augmentation). Both evaluated on the same seeds. If it did not help, say so.
9. **Tests.** Automated tests for your interval code and your failure sorting. Their output is saved in `results/tests.txt` and all pass.
10. **Failure report.** At least 10 failures watched, each with a cause in your own words, grouped into 3 to 5 types with counts, and 3 videos linked.
11. **Show.** An animated GIF or a screen recording under 30 seconds showing at least one best episode and one failure.
12. **Written report.** `REPORT.md` with the lesson 5 headings, a limits section and no claim beyond the evidence.
13. **Disclosure.** A line in the README on how an AI agent helped, and which files it touched.
14. **Peer run.** One other person ran your README in a fresh environment, and their note is in the repository.

### Repository layout

```text
robot-learning-capstone/
  README.md             what, how to run, criteria checklist, versions, AI use
  PROTOCOL.md           committed before the final run
  DATASET_NOTE.md
  REPORT.md             results, baselines, failure taxonomy, limits
  REVIEW.md             the peer's run note and rubric
  requirements.txt      pinned versions
  src/pusht_bc/         code: prepare_data, policy, train, evaluate, stats, summarise
  tests/test_stats.py
  results/
    summary.txt         the table
    tests.txt
    <run>/results.csv, failures.csv, videos/
  media/demo.gif
```

For Path B, add a `commands.md` with the exact `lerobot-train` and `lerobot-eval` commands you ran.

### What to show

The README is the front door: two sentences on what the repository does, the GIF, the results table, the command that reproduces it, then the criteria checklist and the limits. A reviewer should know in 60 seconds what you built, how well it did and how sure you are.

## 3. Step by step

1. **Decide the path and the one change.** Write both in `PROTOCOL.md` before you train anything. For Path A choose one of: more epochs, a larger image than 48 by 48, action chunking (predict the next several actions and run them before looking again), or random shifts of the image as augmentation. Change only one.

2. **Set up the repository.** Copy your `lesson-05/` code into a new repository `robot-learning-capstone`. Create `requirements.txt` from `pip freeze`, trimmed to what you use. Write `DATASET_NOTE.md` from your lesson 1 notes.

3. **Write the protocol.** Reuse your lesson 5 protocol and choose the seed range now. Commit `PROTOCOL.md`, then train.

4. **Train.** For Path A, run `python -m pusht_bc.train` twice with two `--out` paths, once for each version, and keep both logs. Your change to the code is part of the commit history.

   For Path B, this is the shape of the commands. Options change between LeRobot releases, so check `lerobot-train --help` for your installed version, and check the LeRobot documentation. Measure the speed over the first hundred steps, then set `--steps` to fit the time you have.

   ```bash
   lerobot-train \
     --policy.type=diffusion \
     --dataset.repo_id=lerobot/pusht \
     --env.type=pusht \
     --env_eval_freq=0 \
     --policy.push_to_hub=false \
     --policy.device=cuda \
     --batch_size=64 \
     --steps=50000 \
     --output_dir=outputs/dp_pusht \
     --job_name=dp_pusht
   ```

   Then evaluate the saved checkpoint with the same tool. It runs the policy in the PushT simulator, and its own seed, set with `--seed`, decides the starting positions. Write that seed in the protocol.

   ```bash
   lerobot-eval \
     --policy.path=outputs/dp_pusht/checkpoints/last/pretrained_model \
     --env.type=pusht \
     --eval.n_episodes=50 \
     --eval.batch_size=10 \
     --policy.device=cuda
   ```

   For a Hub checkpoint of the same policy, LeRobot 0.7.0 stopped with a message about migrating the processor format when checked for this lesson. Train your own, as above.

5. **Evaluate.** Run the policy, both baselines and the stress test on the same seeds. For Path A, use the lesson 5 commands for each version. Put each `results.csv` in its own folder under `results/`, and run `summarise` to make `results/summary.txt`. Save test output with `python -m pytest -q tests | tee results/tests.txt`.

6. **Watch and write the failures.** Watch at least 10 failure videos. Fill `failures.csv` and group the causes.

7. **Make the GIF.** This script joins MP4 files into one GIF. It keeps every second frame so the file stays small.

   ```python
   import sys
   from pathlib import Path

   import imageio.v2 as imageio

   out, *videos = sys.argv[1:]
   frames = []
   for video in videos:
       reader = imageio.get_reader(video)
       frames.extend(frame for i, frame in enumerate(reader) if i % 2 == 0)
       reader.close()
   imageio.mimsave(out, frames, duration=100, loop=0)  # milliseconds per frame
   print(f"wrote {out}: {len(frames)} frames, {Path(out).stat().st_size / 1e6:.1f} MB")
   ```

   ```bash
   python make_gif.py media/demo.gif results/best/videos/seed10000.mp4 results/best/videos/seed10001.mp4
   ```

   Do not cut frames to hide a failure. Say in the README which seeds are shown.

8. **Write the report and README.** Follow lesson 5's headings. Open with the numbers, then the baselines, then the failures, then the limits. Run the README commands in a clean folder yourself before anyone else does.

9. **Get a peer run.** Ask a peer or a Sensei to follow the review steps below, and keep their note as `REVIEW.md`.

## 4. Worked example: TrailMug

TrailMug is fictional. The arm, the rack and every number below are invented for teaching.

The TrailMug team's capstone is their simulated arm that places a returned cup in a wash rack. Their protocol reads, in short: "Simulated task: the cup starts upright or tilted at one of 50 fixed positions. Success: the cup rests in the rack slot within 200 steps. Baselines: arm never moves, arm moves at random. Stress: 1 centimetre of noise on the camera position. Seeds 1 to 50."

Their results table, with made-up numbers, reads:

| Run | Successes | 95% interval |
|---|---|---|
| Arm never moves | 0 of 50 | 0% to 7% |
| Random arm | 1 of 50 | 0% to 10% |
| Version A, 50 demonstrations | 31 of 50 | 48% to 74% |
| Version B, 80 demonstrations including tilted cups | 36 of 50 | 58% to 83% |
| Version B, camera noise | 27 of 50 | 40% to 67% |

B scored 5 more successes than A, but the intervals overlap heavily, so the team writes "B is not shown to be better than A in this test". The taxonomy covers B's 14 failures: 6 slipped on lifting, 5 missed the slot, 3 timed out. The GIF shows one slip, one miss and one success.

The limits section says: simulation only, one task, one training run per version, no real-world claim. That is what a reviewer most wants to find.

## 5. Working with AI agents on this

**What the PDM decides.** The task, the protocol, the one change, the claims the report may make and the point at which you stop training. You also decide the budget: how many GPU hours a trial may use.

**What you delegate, and the exact brief.** An agent can build the repository, run the evaluation, write tests and draft the README and report. This is the **delegate** rung. It becomes **orchestrate** when several agents train variants at once while you hold the results table. Adapt this brief:

```text
Task: build the robot-learning capstone repository from my lesson-05 folder.
Task and protocol: see PROTOCOL.md. It is fixed. Do not edit it. Do not change seeds.
Deliver: the criteria checklist in README.md, results/summary.txt, results/tests.txt, failures.csv files, media/demo.gif and a draft REPORT.md.
Rules:
1. Every number in README.md and REPORT.md must come from a file under results/. Cite the file.
2. Report successes out of episodes with a 95% Wilson interval. Never a bare percentage.
3. Never re-run an evaluation to get a better number. If a run fails, report it and tell me.
4. Leave the failure-cause column blank. I will fill it after I watch the videos.
5. No claim about real robots. No word "works" without the number beside it.
6. Mark anything you could not verify as "unknown".
7. Do not download any data other than lerobot/pusht.
Output: a list of files you changed, the commands you ran with their output, and a list of assumptions.
```

**How you verify.** Recompute two numbers from the raw CSV. Check the seeds against the protocol. Check in git history that `PROTOCOL.md` came first. Watch the videos the report cites. Read the report against the table: agents make prose warmer than the numbers. Strike every claim with no number behind it.

**Which disciplines are involved.** Safety reads the taxonomy for failures that would be dangerous on hardware. Quality owns the acceptance criteria. Legal checks the dataset terms.

**Where this sits on the ladder.** You work at **delegate**. A pipeline that refuses to publish a report without a protocol, results files, tests and a peer note is **govern**. See [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report) and [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review).

**Disclose.** Add to your README: "An AI agent drafted code and text from my brief. I ran every command, recomputed results from the raw files, watched the failure videos and wrote the failure causes." See [Disclose AI use](/library/disclose-ai-use) and [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Changing the protocol after you see the results.** Commit it first, and the history proves it.
- **Reporting only the better version.** Report both.
- **Skipping the baselines.** A score without them means nothing.
- **Tuning on the test seeds.** Keep evaluation seeds apart from anything used to train or tune.
- **A GIF made of the best moments only.** Show a failure too.
- **Big claims from a small test.** Fifty episodes with an interval show what they show. Say no more.
- **A README nobody can run.** Run it yourself in a clean folder.
- **Committing large weights.** Record a checksum and a location.

## 7. Practice: the capstone, with a rubric

**Deliverable:** the repository `robot-learning-capstone` in your own git hosting, with every item in the layout above.

### Rubric

A reviewer scores each row from 0 to 4. A pass is 24 or more of 32, with no zero on rows 1, 2 or 7.

| # | What is scored | 0 | 2 | 4 |
|---|---|---|---|---|
| 1 | Reproducibility | Cannot be run | Runs with fixes | Fresh clone reproduces every number |
| 2 | Protocol and seeds | None | Written after results | Committed first, seeds fixed and kept |
| 3 | Statistics | Bare percentages | Interval for some runs | Every run has successes out of episodes and an interval |
| 4 | Baselines and stress test | None | Baselines only | Both baselines and a stress test, same seeds |
| 5 | One change, compared | None | Compared on different seeds | Compared on the same seeds, result stated even if no gain |
| 6 | Failure analysis | Counts only | Causes without videos | At least 10 watched failures, 3 to 5 types, 3 videos |
| 7 | Honesty of claims | Claims beyond the evidence | Some overreach | Every claim backed by a number, and a limits section |
| 8 | Presentation | No GIF, weak README | One of the two good | Clear README, GIF with a failure, tidy report |

The score does not depend on the success rate. A policy with 0 of 50, shown honestly with its baselines, can earn full marks.

### How a Sensei or peer reviews

The review takes about an hour. Follow these steps, in order.

1. **Fresh run.** Clone the repository into an empty folder. Follow the README exactly. Note every command that failed or needed a fix.
2. **History.** Check in git that `PROTOCOL.md` is older than the final results.
3. **Recompute.** Pick one row of the table. Count successes in its `results.csv` and compute the interval with the repository's own code. It must match.
4. **Watch.** Watch two failure videos the author did not cite. Do you agree with the author's cause for each?
5. **Claims.** Read the report. Mark every claim that has no number or file behind it.
6. **Score and write.** Fill the rubric. Write three comments: one strength, one risk and one question the author must answer. Save them as `REVIEW.md` in the author's repository, with your name and the date, and say whether the run reproduced.

## 8. Checklist

- [ ] I chose a path and one change before training.
- [ ] `PROTOCOL.md` was committed before the final evaluation.
- [ ] I evaluated on at least 50 fixed seeds with baselines and a stress test.
- [ ] Every result has successes out of episodes and a 95 per cent interval.
- [ ] Tests for the interval and the failure sort pass, and their output is saved.
- [ ] I watched at least 10 failures and wrote the causes.
- [ ] The GIF shows a failure as well as a success.
- [ ] The report has a limits section and no claim beyond the evidence.
- [ ] A peer reproduced my README in a fresh environment.
- [ ] I disclosed how an AI agent helped.

## 9. Further learning

The LeRobot documentation and dataset page are the reference for both paths, and its hardware guide tells you what a GPU is for. The Diffusion Policy and ACT papers explain the methods behind the policies. The Wikipedia article on the binomial proportion confidence interval and the datasheet paper support your statistics and dataset note. Google's technical writing course helps with the report. When you are done, go back to the [Robot learning track](/library/tracks/robot-learning) overview and pick your next step: the [Robot software](/library/tracks/robot-software) track for the system a policy runs inside, or [Safety reports and review](/library/tracks/safety-reports-and-review) for the habits that keep a learned system honest.
