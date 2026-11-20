---
title: "Reinforcement learning in MuJoCo"
description: "Train a simulated two-joint arm by trial and error. Inspect the environment, train with several seeds, read learning curves, and watch a badly weighted reward produce a policy that does nothing."
section: "Robot learning"
order: 2
track: "robot-learning"
level: "advanced"
duration: "4 to 5 hours"
outcomes:
  - "Explain reinforcement learning with the words state, action, reward and return"
  - "Inspect an environment before training and check its settings in the installed code"
  - "Train a PPO policy with several seeds and read the learning curves"
  - "Show how a reward weight changes behaviour, and spot a policy that games its reward"
  - "Compare a trained policy with a random baseline on fixed test episodes"
resources:
  - "stable-baselines3/documentation"
  - "farama/gymnasium-documentation"
  - "google-deepmind/mujoco-documentation"
  - "openai/spinning-up"
  - "google-deepmind/mujoco-playground"
  - "arxiv/deep-reinforcement-learning-that-matters"
prerequisites:
  - "tracks/robot-learning/01-learn-from-demonstrations"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot learning track and the Master Developer Product Package, where a product must say what its machine was rewarded for. **Time:** about four to five hours, mostly waiting for training runs.

## 1. Why this matters

In lesson 1 a person showed the robot what to do. In **reinforcement learning** (RL) nobody shows it. The robot tries things, a score called the **reward** says how well each step went, and the learning method changes the policy to earn more reward over time. The policy sees the **state** (what the sensors report), picks an **action** (what the motors do) and collects reward. The **return** is the reward added up over an episode.

For a product manager, RL moves the work from collecting demonstrations to writing the reward. That is a design decision with real consequences. The policy will do whatever earns the most reward, which is not always what you meant. A reward that pays for speed may produce a machine that is fast and rough. A reward that charges too much for effort may produce a machine that does nothing at all. You will see the second case in this lesson.

Everything here runs in simulation on a laptop CPU. The maths is one idea: the return is the sum of the rewards, and the learning method tries to raise its average.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the robot is rewarded for, which behaviours the reward must not allow, and what a good result means | Writing training and evaluation scripts, running seeds, plotting curves | That the settings you think you used are the ones in the installed code, that results come from several seeds, and that the policy beats a random baseline | Safety (what a fast or forceful policy would mean on a real machine), engineering (what the real actuators can do), legal (claims about performance) |

## 2. Key ideas

### The loop

An **environment** gives the policy a state. The policy returns an action. The environment moves one step and returns a new state, a reward and two flags: `terminated` when the task ends by itself and `truncated` when a time limit cuts it off. One run from reset to the end is an **episode**. Gymnasium defines this interface. MuJoCo is the physics engine that computes each step.

### PPO in plain words

**PPO** (Proximal Policy Optimization) is a widely used RL method. It collects some experience, then updates the policy a little, and keeps each update small so that learning does not jump off a cliff. You do not need the equations to use it. Stable-Baselines3 provides a tested implementation.

### The environment: Reacher

Reacher is a two-joint arm in a plane. Each joint takes a torque between -1 and 1. The goal is to put the fingertip on a target dot. The observation has 10 numbers. An episode lasts 50 steps and never ends early, so it always finishes by the time limit. Each step's reward has two parts: minus the distance from fingertip to target, and minus the squared size of the action, which is an **effort** penalty. Each part has a weight.

### Seeds and learning curves

A **seed** fixes the random numbers a run uses. Two runs with different seeds can learn differently, so one run proves little. The paper "Deep Reinforcement Learning that Matters" is about this: random seeds, benchmark non-determinism and reporting choices can change a study's conclusions. So you train several seeds and plot a **learning curve** for each: return against environment steps. A curve shows speed and stability. A single final number hides both.

### The reward is the specification

The reward weights are the specification, written as numbers. Change a weight and you change the task. After training you must score the policy on something that does not depend on the weight you trained with. Here that is the final fingertip distance, measured on the same 100 starting positions for every policy.

### Read the code, not only the docs

Settings in a docs page can differ from the code you installed. For Reacher-v5 in Gymnasium 1.4.0, the documentation text gives the default effort weight as 0.1. The installed code gives 1. I found this by checking, after training my first set of runs on 0.1. Always look at what your installed version does, and write down the version.

## 3. Step by step

You need Python 3.12 and a fresh virtual environment. In the lesson run, the installed versions were Gymnasium 1.4.0, MuJoCo 4.0.1 and Stable-Baselines3 2.9.2. Make a folder `lesson-02/`.

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install "gymnasium[mujoco]" stable-baselines3 imageio imageio-ffmpeg pandas matplotlib
```

1. **Inspect the environment first.** Save as `lesson-02/inspect_env.py` and run it.

   ```python
   """Look at an environment before training on it."""
   import gymnasium as gym
   import mujoco

   env = gym.make("Reacher-v5")
   print("observation space:", env.observation_space)
   print("action space:", env.action_space)
   print("episode limit:", env.spec.max_episode_steps, "steps")
   print("reward control weight in the installed code:", env.unwrapped._reward_control_weight)
   print("MuJoCo version:", mujoco.__version__)

   obs, info = env.reset(seed=0)
   terminated = truncated = False
   steps = 0
   while not (terminated or truncated):
       obs, reward, terminated, truncated, info = env.step(env.action_space.sample())
       steps += 1
   print("random episode ended after", steps, "steps; terminated:", terminated, "truncated:", truncated)
   print("last reward:", round(reward, 3), "info:", {k: round(float(v), 3) for k, v in info.items()})
   ```

   You should see a 10-number observation, an action of 2 numbers between -1 and 1, a limit of 50 steps and a control weight of 1. The random episode ends by truncation. The `info` dictionary splits the reward into `reward_dist` and `reward_ctrl`, which lets you score distance alone.

2. **Write the training script.** It takes a seed and a control weight, and logs every episode with Stable-Baselines3's Monitor logger, which writes one CSV per environment. Save as `lesson-02/train.py`.

   ```python
   """Train PPO on Reacher-v5 with one seed. Save the model and the learning-curve logs."""
   import argparse
   from pathlib import Path

   from stable_baselines3 import PPO
   from stable_baselines3.common.env_util import make_vec_env

   parser = argparse.ArgumentParser()
   parser.add_argument("--seed", type=int, required=True)
   parser.add_argument("--steps", type=int, default=1_000_000)
   parser.add_argument("--control-weight", type=float, default=1.0, help="Reacher-v5 default is 1.0")
   args = parser.parse_args()

   run_dir = Path("runs") / f"control{args.control_weight}-seed{args.seed}"
   run_dir.mkdir(parents=True, exist_ok=True)

   env = make_vec_env(
       "Reacher-v5",
       n_envs=4,
       seed=args.seed,
       env_kwargs={"reward_control_weight": args.control_weight},
       monitor_dir=str(run_dir),  # one monitor.csv per environment: the learning-curve data
   )
   model = PPO("MlpPolicy", env, seed=args.seed, device="cpu")
   model.learn(total_timesteps=args.steps)
   model.save(run_dir / "model")
   print(f"saved {run_dir / 'model.zip'}")
   ```

3. **Train three seeds at the default weight.** On a 28-core desktop, running nine of these at once, a one-million-step run took about five minutes. A laptop will take longer. One thread per process stops them fighting over cores.

   ```bash
   export OMP_NUM_THREADS=1
   for s in 0 1 2; do python train.py --seed $s & done
   wait
   ```

4. **Write the evaluation script.** It scores each saved policy on 100 fixed starting positions, deterministically. It also scores a **random baseline**, a policy that picks random actions. It measures the final distance, and the effort per step, so you can see how hard the arm worked. Save as `lesson-02/evaluate.py`.

   ```python
   """Score saved models on 100 fixed episodes: final distance to the target, and how hard the arm worked."""
   import sys

   import gymnasium as gym
   import numpy as np
   from stable_baselines3 import PPO

   env = gym.make("Reacher-v5")  # default reward weights, so every model is scored the same way
   for path in sys.argv[1:]:
       model = None if path == "random" else PPO.load(path)
       finals, effort = [], []
       for seed in range(1000, 1100):
           obs, _ = env.reset(seed=seed)
           done = False
           while not done:
               action = env.action_space.sample() if model is None else model.predict(obs, deterministic=True)[0]
               effort.append(float(np.sum(np.square(action))))  # torque effort for this step
               obs, _, terminated, truncated, info = env.step(action)
               done = terminated or truncated
           finals.append(-info["reward_dist"])  # reward_dist is minus the distance, in metres
       print(f"{path}: final distance {np.mean(finals):.3f} m (worst {np.max(finals):.3f}), effort per step {np.mean(effort):.2f}")
   ```

   Run it with `python evaluate.py random runs/control1.0-seed0/model runs/control1.0-seed1/model runs/control1.0-seed2/model`. The random baseline draws unseeded actions, so it moves a little between runs. In my runs it came out between 0.158 and 0.178 m.

5. **Plot the learning curves.** Save as `lesson-02/plot.py`, and run `python plot.py "control1.0-seed*"`. The pattern is passed in quotes so that Python, not the shell, expands it.

   ```python
   """Plot one learning curve per seed from the Monitor logs."""
   import sys
   from pathlib import Path

   import matplotlib
   import numpy as np
   import pandas as pd

   matplotlib.use("Agg")
   import matplotlib.pyplot as plt

   fig, ax = plt.subplots(figsize=(6, 4))
   for seed_dir in sorted(Path("runs").glob(sys.argv[1])):
       parts = [pd.read_csv(f, skiprows=1) for f in sorted(seed_dir.glob("*.monitor.csv"))]
       episodes = pd.concat(parts).sort_values("t")  # r = return, l = length, t = wall-clock seconds
       steps = np.cumsum(episodes["l"].to_numpy())
       smooth = episodes["r"].rolling(50, min_periods=1).mean()
       ax.plot(steps, smooth, label=seed_dir.name)
   ax.set_xlabel("environment steps")
   ax.set_ylabel("episode return (mean of last 50)")
   ax.legend()
   fig.tight_layout()
   fig.savefig("learning-curves.png", dpi=120)
   print("saved learning-curves.png")
   ```

6. **Watch it.** Numbers hide odd behaviour, so record a video. Save as `lesson-02/watch.py` and run `python watch.py runs/control1.0-seed2/model`.

   ```python
   """Record a video of a trained policy on fixed seeds."""
   import sys

   import gymnasium as gym
   import imageio.v2 as imageio
   from stable_baselines3 import PPO

   model = PPO.load(sys.argv[1])
   env = gym.make("Reacher-v5", render_mode="rgb_array")
   frames = []
   for seed in (100, 101, 102):
       obs, _ = env.reset(seed=seed)
       done = False
       while not done:
           action, _ = model.predict(obs, deterministic=True)
           obs, _, terminated, truncated, _ = env.step(action)
           frames.append(env.render())
           done = terminated or truncated
   imageio.mimsave("reacher.mp4", frames, fps=25, macro_block_size=1)
   print(f"saved reacher.mp4 with {len(frames)} frames")
   ```

   If rendering fails on a machine with no display, set `MUJOCO_GL=egl` and try again. If it still fails, skip the video and say so in your report.

7. **Change the reward weight.** Train control weights 0.1 and 10 as well, seeds 0 to 2 each. You can add weight 0 with one seed.

   ```bash
   for s in 0 1 2; do
     python train.py --seed $s --control-weight 0.1 &
     python train.py --seed $s --control-weight 10.0 &
   done
   wait
   python evaluate.py random runs/control*/model
   ```

   Each policy is still scored with the default weights, so the table compares like with like.

### What I measured

These are my results on one machine with the versions above. They are observations from this experiment, not general facts about RL.

| Reward weight on effort | Seeds | Final distance to target (mean over 100 episodes) | Effort per step |
|---|---|---|---|
| random actions | none | 0.158 to 0.178 m across runs | about 0.66 |
| 1 (the installed default) | 0, 1, 2 | 0.052, 0.058, 0.051 m | 0.01 |
| 0.1 | 0, 1, 2 | 0.125, 0.137, 0.091 m | 0.65, 0.04, 0.18 |
| 0 (one seed) | 0 | 0.132 m | 1.29 |
| 10 | 0, 1, 2 | 0.211, 0.199, 0.204 m | 0.00 |

What to take from it:

- **Learning is clear and consistent at weight 1.** The three curves start near a return of -60, climb steeply over the first 200,000 steps and flatten. By one million steps the smoothed returns were -5.4, -6.3 and -5.2. The seeds agree closely, which is what you want to see.
- **Weight 10 produced a policy that does nothing.** Its effort is zero and its final distance is worse than random actions. Moving costs more than reaching saves, so the best the policy found was to stand still. It is not broken. It did exactly what the reward asked. Returns for different weights are on different scales, which is why scoring on distance matters.
- **Weight 0.1, the value the docs page gave, did worse than weight 1.** All three seeds ended farther from the target, and the three seeds behave differently from one another: one still uses heavy torques, another barely any. I did not test why. Do not read this as "less penalty is worse". It is what happened in these runs.
- **Weight 0 gave a high-effort policy** (1.29 per step) that ended 0.132 m from the target. One seed is only a hint.

A policy that learns can still be poor: 0.2 m is no better than random. The random baseline tells you which.

## 4. Worked example: TrailMug

TrailMug is fictional. The arm, the reward and every number below are invented for teaching.

The TrailMug team wants a simulated arm to put a returned cup in a wash rack. They write the reward as: minus the distance from cup to rack, minus 5 times the squared torque, plus a bonus when the cup lands. They train three seeds for 500,000 steps and score them on 50 fixed cups.

The first run gives 3 of 50 cups in the rack. A video shows the arm hanging still at the start. The product manager asks one question: what did the torque penalty cost compared to the distance reward? An engineer works it out. Reaching the rack saves about 1 point per step, and moving at all costs about 3. The policy had learned that doing nothing is the best deal.

The fix is a decision, not a hack. The team lowers the torque weight to 0.5, because a real wash arm may use more effort than the first guess, and re-trains. Now 29 of 50 cups land. The report states the weights, three seeds, 50 fixed cups, the random baseline (0 of 50) and a line that simulated cups say nothing about the real arm.

## 5. Working with AI agents on this

**What the PDM decides.** What the robot is rewarded for, what must never be rewarded, and what counts as a pass. You choose a measure of success that is independent of the reward weights.

**What you delegate, and the exact brief.** An agent can write the scripts and run the seeds. This is the **delegate** rung. Adapt this brief:

```text
Task: in lesson-02, train PPO on Gymnasium Reacher-v5 and report the results.
Files: inspect_env.py, train.py, evaluate.py, plot.py, watch.py.
Rules:
1. Print the installed versions of Python, Gymnasium, MuJoCo and Stable-Baselines3 first. Read the reward weights from the installed code, not from the docs page.
2. Train seeds 0, 1 and 2 for 1,000,000 steps at the default weight, then the same seeds at control weights 0.1 and 10.
3. Score every policy on episodes with seeds 1000 to 1099 with the default weights. Report final distance and effort per step. Include a random baseline.
4. Plot a learning curve per seed. Do not average the seeds away.
5. Report the table exactly as printed. Do not drop seeds that look bad.
6. Say which results are observations from these runs and which are general claims. Make no general claim.
Output: the files, the commands, the printed table, the plot, and a list of assumptions and anything that failed.
```

**How you verify.** Run `inspect_env.py` yourself and see the same weight. Re-run one policy through `evaluate.py` and match its row. Open the learning-curve image and check there is one line per seed. Watch the video. Check that every sentence in the report is about these runs.

**Which disciplines are involved.** Safety reviews any reward that favours speed or force before anyone considers hardware. Engineering matches effort units to real actuators. Legal checks what the product may say.

**Where this sits on the ladder.** This is **delegate**. Several seeds and several weights at once is **orchestrate**. A check that blocks a report without a random baseline and several seeds is **govern**.

**Disclose.** Add to your README: "An AI agent drafted the training scripts. I ran the environment check myself, re-ran one evaluation and wrote the conclusions." See [Disclose AI use](/library/disclose-ai-use) and [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Trusting a docs page over the installed code.** Check the value in the version you run.
- **One seed.** One curve can be lucky.
- **Scoring on the training reward.** Weights change the scale. Score on something independent.
- **No baseline.** Without random actions you cannot tell 0.2 m from progress.
- **Reading only the final number.** The curve shows speed and stability, and a video shows behaviour a number hides.
- **Treating a reward as a wish.** The policy optimises what you wrote, not what you meant.

## 7. Practice: a reward-weight study

**Deliverable:** a folder `lesson-02/` in your own git repository.

1. The five scripts, and a `README.md` with the commands and library versions.
2. `results.txt`: the printed evaluation table for the random baseline and each policy.
3. `learning-curves.png` for the default weight.
4. `reacher.mp4`, or a line saying why you skipped it.
5. `findings.md`: five to eight sentences about what happened in your runs. Include one case where the reward produced behaviour you did not want, and what you would change in the reward.
6. One line in the README on how an AI agent helped.

**Check:** ask a classmate or Sensei to find any sentence in `findings.md` that claims more than your runs show.

## 8. Checklist

- [ ] I can explain state, action, reward and return.
- [ ] I inspected the environment and read the weights from the installed code.
- [ ] I trained at least three seeds and plotted a curve for each.
- [ ] I scored every policy on the same fixed episodes, with a random baseline.
- [ ] I changed the reward weight and watched the behaviour change.
- [ ] I recorded the versions I used.
- [ ] I wrote what an AI agent did and what I checked.

## 9. Further learning

The Spinning Up introduction is the gentlest start on the ideas, and its PPO page explains the method used here. The Stable-Baselines3 documentation covers the library. The Gymnasium documentation describes the environment interface and the Reacher page. The MuJoCo documentation explains the physics engine. MuJoCo Playground shows what large-batch training on a GPU looks like for a bigger set of environments. "Deep Reinforcement Learning that Matters" is the paper to read before you trust any single learning curve. Next, [Mind the sim-to-real gap](/library/tracks/robot-learning/03-mind-the-sim-to-real-gap) asks what happens when the simulator is not the world.
