---
title: "Evaluate a policy and report failures"
description: "Test a learned policy fairly. Run many fixed-seed episodes, compare against simple baselines, report a success rate with a confidence interval, and sort the failures into a report a stranger can check."
section: "Robot learning"
order: 5
track: "robot-learning"
level: "advanced"
duration: "4 to 5 hours"
outcomes:
  - "Write an evaluation protocol: task, success rule, seeds, number of episodes and baselines"
  - "Compute a success rate with a 95 per cent Wilson interval and say what the interval does and does not cover"
  - "Compare a policy with a do-nothing baseline and a random baseline on the same seeds"
  - "Sort failures into a taxonomy after watching the videos"
  - "Write a failure report that a stranger can reproduce from your repository"
resources:
  - "wikipedia/binomial-proportion-confidence-interval"
  - "arxiv/deep-rl-at-the-edge-of-the-statistical-precipice"
  - "arxiv/deep-reinforcement-learning-that-matters"
  - "hugging-face/lerobot"
  - "libero-project/libero"
  - "arxiv/datasheets-for-datasets"
prerequisites:
  - "tracks/robot-learning/01-learn-from-demonstrations"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot learning track and the Master Developer Product Package, where a robot product needs evidence a reviewer can check. **Time:** about four to five hours.

## 1. Why this matters

A video of a robot succeeding is a story. It may be the one good run in twenty. A product decision needs a number from a fixed test, and a statement of how far that number can be wrong.

Robot learning makes this harder than ordinary software testing. Starting positions vary, training has chance in it, and a policy can look fine on screen and fail half the time.

This lesson gives you a small, honest method: fixed seeds, many episodes, baselines, an interval and a written account of the failures. It pairs with [When not to trust a model](/library/tracks/safety-reports-and-review/01-when-not-to-trust-a-model) in the safety track.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What counts as success, how many episodes, which baselines, and what result is good enough to act on | Writing the evaluation script, running it, tabulating results, drafting the report | The seeds, the success rule, the numbers against the raw file, and the cause of each failure by watching videos | Safety (what a failure costs), quality (acceptance criteria), legal (what the report may claim) |

## 2. Key ideas

### The protocol comes first

Write the test before you see results. A protocol names:

- **The task and the success rule.** "Success" must be something a program can check. In PushT the environment counts success when the block covers 95 per cent or more of the target.
- **The seeds.** A seed fixes the random starting positions, so the same episodes can be run again. Pick the seed range in advance and never drop an unlucky seed.
- **The number of episodes.** More episodes give a narrower interval.
- **The baselines.** Simple policies that set the floor.
- **The stress tests.** Changes you did not train for, such as noisy sensors.

Changing the protocol after you see the results is choosing the result.

### A rate needs an interval

If a policy succeeds in 6 of 10 episodes, its true rate is not exactly 60 per cent. A different set of 10 episodes would give a different count. A **confidence interval** is a range that shows how far a measured rate could be from the true one. The **Wilson score interval** is a standard choice for a success count. The formula is in the practice code, and the Wikipedia article in the resource list explains it. At 95 per cent confidence:

| Result | Interval |
|---|---|
| 0 of 20 | 0% to 16% |
| 6 of 10 | 31% to 83% |
| 2 of 10 | 6% to 51% |
| 9 of 10 | 60% to 98% |
| 40 of 50 | 67% to 89% |

Two things follow. Zero successes in 20 episodes does not show the policy never works. It shows the true rate is probably under 16 per cent. And two policies whose intervals overlap have not been shown to differ in that test. LeRobot's LIBERO page says the same, and `lerobot-eval` prints this interval next to each success rate.

A famous example shows the scale. The OpenAI Rubik's cube paper reports, over 10 real-robot trials, that the hand solved a cube needing 15 face rotations 60 per cent of the time and one needing 26 rotations 20 per cent of the time. The intervals above show how wide such claims are. The result is still remarkable. It is just not precise.

### What the interval does not cover

The interval covers which episodes you drew. It does not cover **training chance**: another training seed gives a different policy. Train more than once and report each run. The "Deep Reinforcement Learning That Matters" and "Statistical Precipice" papers explain why single runs and point estimates mislead. Nor does the interval cover a world you did not test.

### Baselines

A **baseline** is a trivial policy you must beat. Two are cheap:

- **Still:** the robot never moves, which sends its action to its own current position.
- **Random:** uniform random targets.

A learned policy that does not beat these has not learned the task. Some starts are nearly solved already, so a baseline also shows how much of your score is free.

### A second number, and a taxonomy

When success is rare, a continuous measure helps. In PushT, **coverage** is the fraction of the target the block covers. Report the best coverage per episode and its mean next to the success rate. They do not replace it.

A **failure taxonomy** is a list of named failure types with a count for each. A program can make a first sort by number. Only a person watching the video can say why. Typical causes: never touched the block, pushed the wrong side, froze, timed out near the goal.

## 3. Step by step

Work in `lesson-05/`, a copy of your lesson 1 folder with its `src/pusht_bc/` modules and the trained `runs/bc_policy.pt`. Add these files. They run on a laptop CPU.

1. **Compute the interval.** Save as `src/pusht_bc/stats.py`.

   ```python
   """Success rate with a 95 per cent Wilson score interval."""
   from math import sqrt


   def wilson_interval(successes: int, trials: int, z: float = 1.96) -> tuple[float, float]:
       """Return the lower and upper end of the interval for a success rate."""
       if trials <= 0:
           raise ValueError("trials must be positive")
       if not 0 <= successes <= trials:
           raise ValueError("successes must be between 0 and trials")
       p = successes / trials
       denominator = 1 + z**2 / trials
       centre = (p + z**2 / (2 * trials)) / denominator
       half = z * sqrt(p * (1 - p) / trials + z**2 / (4 * trials**2)) / denominator
       return max(0.0, centre - half), min(1.0, centre + half)
   ```

2. **Write the evaluation script.** It runs a chosen policy on a range of fixed seeds and writes one row per episode. The `still` and `random` baselines need no weights. `--position-noise` adds Gaussian noise to the pusher position the policy reads, a stress test for lesson 3's idea. Save as `src/pusht_bc/evaluate.py`.

   ```python
   """Run a policy on fixed seeds. Write one row per episode and a few videos."""
   import argparse
   import csv
   from pathlib import Path

   import gym_pusht  # noqa: F401  registers gym_pusht/PushT-v0
   import gymnasium as gym
   import imageio.v2 as imageio
   import numpy as np
   import torch

   from pusht_bc.policy import SmallPolicy, WORLD, prepare


   class Chooser:
       """Pick the next action. 'bc' is the trained policy; 'still' and 'random' are baselines."""

       def __init__(self, kind: str, weights: Path, noise: float) -> None:
           self.kind, self.noise = kind, noise
           self.rng = np.random.default_rng(0)
           self.policy = SmallPolicy()
           if kind == "bc":
               self.policy.load_state_dict(torch.load(weights, map_location="cpu", weights_only=True))
           self.policy.eval()

       def __call__(self, obs: dict[str, np.ndarray]) -> np.ndarray:
           position = obs["agent_pos"].astype(np.float32)
           if self.kind == "still":
               return position
           if self.kind == "random":
               return self.rng.uniform(0.0, WORLD, size=2).astype(np.float32)
           position = position + self.rng.normal(0.0, self.noise, size=2).astype(np.float32)
           image = torch.from_numpy(obs["pixels"]).permute(2, 0, 1).unsqueeze(0)
           with torch.no_grad():
               action = self.policy(*prepare(image, torch.from_numpy(position).unsqueeze(0)))
           return np.clip(action.squeeze(0).numpy() * WORLD, 0.0, WORLD)


   def run_episode(env: gym.Env, choose: Chooser, seed: int, frames: list | None) -> dict:
       obs, _ = env.reset(seed=seed)
       best, steps = 0.0, 0
       while True:
           obs, _, terminated, truncated, info = env.step(choose(obs))
           steps += 1
           best = max(best, float(info["coverage"]))
           if frames is not None:
               frames.append(env.render())
           if terminated or truncated:
               return {"seed": seed, "success": int(info["is_success"]), "steps": steps, "best_coverage": round(best, 3)}


   def main() -> None:
       parser = argparse.ArgumentParser(description=__doc__)
       parser.add_argument("--policy", choices=["bc", "still", "random"], default="bc")
       parser.add_argument("--weights", type=Path, default=Path("runs/bc_policy.pt"))
       parser.add_argument("--episodes", type=int, default=50)
       parser.add_argument("--first-seed", type=int, default=10_000)
       parser.add_argument("--position-noise", type=float, default=0.0, help="pixels")
       parser.add_argument("--videos", type=int, default=3, help="record the first N episodes")
       parser.add_argument("--out-dir", type=Path, required=True)
       args = parser.parse_args()

       choose = Chooser(args.policy, args.weights, args.position_noise)
       env = gym.make("gym_pusht/PushT-v0", obs_type="pixels_agent_pos", render_mode="rgb_array")
       (args.out_dir / "videos").mkdir(parents=True, exist_ok=True)
       rows = []
       for i in range(args.episodes):
           seed = args.first_seed + i
           frames = [] if i < args.videos else None
           rows.append(run_episode(env, choose, seed, frames))
           if frames:
               imageio.mimsave(args.out_dir / "videos" / f"seed{seed}.mp4", frames, fps=10, macro_block_size=1)
       env.close()
       with (args.out_dir / "results.csv").open("w", newline="") as handle:
           writer = csv.DictWriter(handle, fieldnames=["seed", "success", "steps", "best_coverage"])
           writer.writeheader()
           writer.writerows(rows)
       print(f"wrote {len(rows)} episodes to {args.out_dir / 'results.csv'}")


   if __name__ == "__main__":
       main()
   ```

3. **Summarise.** This reads any number of result files and prints one row each: success, interval, mean coverage and a first sort of failures. It also writes `failures.csv` with an empty column for the cause you will fill in after watching. Save as `src/pusht_bc/summarise.py`.

   ```python
   """Turn results.csv files into one table: success rate, 95% interval, mean coverage and failure bins."""
   import csv
   import sys
   from collections import Counter
   from pathlib import Path

   from pusht_bc.stats import wilson_interval


   def failure_bin(row: dict[str, str]) -> str:
       """A first sort by number. A person must still watch the video and decide the cause."""
       if int(row["success"]):
           return "success"
       coverage = float(row["best_coverage"])
       if coverage < 0.05:
           return "no progress"
       return "partial" if coverage < 0.5 else "near miss"


   def main() -> None:
       print("run".ljust(20) + "success   95% interval   mean coverage   failure bins")
       for name in sys.argv[1:]:
           path = Path(name)
           with path.open() as handle:
               rows = list(csv.DictReader(handle))
           wins = sum(int(r["success"]) for r in rows)
           low, high = wilson_interval(wins, len(rows))
           mean = sum(float(r["best_coverage"]) for r in rows) / len(rows)
           bins = Counter(failure_bin(r) for r in rows)
           print(f"{path.parent.name:20}{wins:>3}/{len(rows):<5}{low:>7.0%} to {high:<5.0%}{mean:>12.2f}      {dict(bins)}")
           with (path.parent / "failures.csv").open("w", newline="") as out:
               writer = csv.writer(out)
               writer.writerow(["seed", "bin", "cause_after_watching_video"])
               writer.writerows([r["seed"], failure_bin(r), ""] for r in rows if not int(r["success"]))


   if __name__ == "__main__":
       main()
   ```

4. **Test the tester.** A wrong interval is worse than none. Save as `tests/test_stats.py` and run `pip install pytest` and `PYTHONPATH=src python -m pytest -q tests`.

   ```python
   import pytest

   from pusht_bc.stats import wilson_interval
   from pusht_bc.summarise import failure_bin


   def test_no_successes_still_has_an_upper_limit() -> None:
       low, high = wilson_interval(0, 20)
       assert low == 0.0
       assert high == pytest.approx(0.161, abs=0.001)


   def test_nine_of_ten_matches_the_lerobot_documentation() -> None:
       low, high = wilson_interval(9, 10)
       assert (round(low, 2), round(high, 2)) == (0.60, 0.98)


   def test_bad_input_is_refused() -> None:
       with pytest.raises(ValueError):
           wilson_interval(3, 0)


   def test_failure_bins() -> None:
       assert failure_bin({"success": "0", "best_coverage": "0.01"}) == "no progress"
       assert failure_bin({"success": "0", "best_coverage": "0.8"}) == "near miss"
   ```

5. **Run the protocol.** The protocol: PushT, seeds 10,000 to 10,049, 50 episodes, success as the environment defines it, baselines `still` and `random`, one stress test with 10 pixels of position noise. Write it in `PROTOCOL.md` first, then run.

   ```bash
   export PYTHONPATH=src
   python -m pusht_bc.evaluate --policy bc --out-dir results/bc
   python -m pusht_bc.evaluate --policy bc --position-noise 10 --out-dir results/bc-noise10
   python -m pusht_bc.evaluate --policy still --out-dir results/still
   python -m pusht_bc.evaluate --policy random --out-dir results/random
   python -m pusht_bc.summarise results/bc/results.csv results/bc-noise10/results.csv results/still/results.csv results/random/results.csv | tee results/summary.txt
   ```

   On the day this lesson was checked, the lesson 1 policy trained for 10 epochs scored 0 of 50, interval 0% to 7%, with mean best coverage 0.08. Noise scored 0 of 50 and 0.10. The `still` baseline scored 0 of 50 and 0.06, and `random` 0 of 50 and 0.08. Your numbers will differ a little.

   The policy is not shown to be better than doing nothing or acting randomly. The one episode in every run in the "near miss" bin is seed 10,000, whose start already covers more than half of the target. Even the `still` baseline gets it. Without the baseline you would have counted it as learning.

6. **Watch and label.** Open `results/bc/failures.csv` and watch the three videos. Fill the last column with a cause in your own words, and group the causes into 3 to 5 types. To see any other seed, re-run it with `--first-seed` set to that seed, `--episodes 1` and `--videos 1`.

7. **Write the report.** Save as `REPORT.md` with these headings: Protocol, Results table, Baselines, Failure taxonomy with counts, Three example videos, What this does not show, How to reproduce, Versions, AI use.

## 4. Worked example: TrailMug

TrailMug is fictional. Every number below is invented for teaching.

The TrailMug team trained a policy to place a returned cup in a wash rack in simulation. Two team members each report a result:

- Version A, trained on 50 demonstrations: 31 successes in 50 fixed episodes.
- Version B, trained on 80 demonstrations that include tilted cups: 22 successes in 50 fixed episodes on tilted-cup starts, and 36 in 50 on upright starts.

A glance suggests A is better. The intervals say otherwise. A: 62 per cent, interval 48% to 74%. B on the tilted starts: 44 per cent, interval 31% to 58%. They overlap, and the tests were on different starts anyway. The product manager does not choose a winner. They ask for both versions on the same 50 tilted-cup seeds, plus the `still` and `random` baselines, and rewrite the protocol first.

The failures sort into a taxonomy: 40 per cent slipped on lifting, 35 per cent missed the rack slot, 25 per cent timed out near the goal. That tells the team what to record next, which a single percentage cannot.

## 5. Working with AI agents on this

**What the PDM decides.** The success rule, the seeds, the sample size and the baselines. You decide what result would make you change the product and what result would make you stop. Decide these before the agent runs anything.

**What you delegate, and the exact brief.** An agent can write the script, run it and draft the report. This is the **delegate** rung. Adapt this brief:

```text
Task: evaluate the policy in runs/bc_policy.pt on PushT and draft REPORT.md.
Protocol (fixed, do not change): gym_pusht/PushT-v0, seeds 10000 to 10049, 50 episodes.
Success is the environment's is_success. Record the best coverage per episode.
Run baselines "still" and "random" on the same seeds, and one stress test with position noise of 10 pixels.
Rules:
1. Report successes out of episodes and a 95% Wilson interval. No bare percentages.
2. Never remove, replace or re-run a seed because of its result.
3. Write tests for the interval function. Run them and paste the output.
4. Put the raw results.csv for every run in the repository.
5. Describe failures only from the videos and data you have. Mark any cause you did not see as "unknown".
6. Do not claim the policy "works", "learned" or "generalises". State what the numbers show.
Output: files, exact commands, test output and a list of assumptions.
```

**How you verify.** Recompute the success count from `results.csv` yourself. Check the seed range in the file. Watch every video the report cites. A poor result tempts an agent to re-run, soften the words or drop a seed. Rules 2 and 6 block that, and your reading checks it. Do not ask the agent that wrote the report whether it is good.

**Which disciplines are involved.** Safety reads the taxonomy for failures that would be dangerous on hardware. Quality turns the protocol into acceptance criteria. Legal checks what the report may say about a product.

**Where this sits on the ladder.** This is **delegate**, moving toward **govern**. A rule that a results file, an interval and videos must exist before a report merges is a check a pipeline can run. See [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review).

**Disclose.** Add to your README: "The evaluation scripts and the first draft of the report came from an AI agent. I re-counted the results, watched the videos and wrote the failure causes." See [Disclose AI use](/library/disclose-ai-use) and [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Reporting a bare percentage.** Say "6 of 10, 31% to 83%".
- **Too few episodes.** Ten episodes cannot tell two policies apart unless they differ a lot.
- **Choosing seeds afterwards.** Dropping bad seeds is cheating, even by accident.
- **No baseline.** A score means nothing until you know what doing nothing scores.
- **Testing only what you trained on.** Add one change you did not train for.
- **Counting one training run.** Another run may differ. Train more than once when you can.
- **Guessing causes.** Write a cause only after you watch the video.

## 7. Practice: an evaluation and a failure report

**Deliverable:** a folder `lesson-05/` in your own git repository.

1. `PROTOCOL.md`, committed before the first evaluation run.
2. The three scripts and the tests, with the test output.
3. `results/` with one `results.csv` per run, `summary.txt`, and the videos of at least three failures.
4. `failures.csv` with your cause for each failure you watched.
5. `REPORT.md` with the headings in step 7: an interval for every run, the baselines, a taxonomy, and what the results do not show.
6. One line in the README on how an AI agent helped.

**Check:** ask a classmate or Sensei to run your commands in a fresh environment and compare `summary.txt`.

## 8. Checklist

- [ ] I wrote the protocol before I ran anything.
- [ ] I used fixed seeds and kept every one of them.
- [ ] I reported successes out of episodes with a 95 per cent interval.
- [ ] I ran a still baseline and a random baseline on the same seeds.
- [ ] I ran at least one stress test.
- [ ] I tested the interval code.
- [ ] I watched the failure videos before I wrote any cause.
- [ ] I wrote what the report does not show.
- [ ] I recorded versions and my AI use.

## 9. Further learning

The Wikipedia article on the binomial proportion confidence interval explains the Wilson interval and its rivals. "Deep Reinforcement Learning That Matters" and "Deep Reinforcement Learning at the Edge of the Statistical Precipice" show how often published results hide chance, and what to report instead. LeRobot's documentation covers `lerobot-eval`, and the LIBERO project page defines a simulated benchmark you can evaluate on. The datasheet paper is a model for writing down what your data holds. Next, [Capstone: a learned manipulation policy](/library/tracks/robot-learning/06-capstone-a-learned-manipulation-policy) puts all of this into one delivered project.
