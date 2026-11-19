---
title: "Mind the sim-to-real gap"
description: "See why a policy that works in simulation can fail on a real machine. Add noise, delay and changing physics to a simulated arm, train with and without randomisation, and test beyond the range you trained on."
section: "Robot learning"
order: 3
track: "robot-learning"
level: "advanced"
duration: "4 to 5 hours"
outcomes:
  - "Name the main ways a simulator differs from a real robot"
  - "Explain domain randomisation, system identification and added noise, and what each costs"
  - "Run an experiment that compares a clean-trained and a randomised-trained policy in shifted worlds"
  - "Test beyond the training range and report a simulated result without claiming a real one"
  - "Say what a simulation cannot prove and who must approve real-robot tests"
resources:
  - "arxiv/domain-randomization-for-transferring-deep-neural-networks"
  - "arxiv/solving-rubiks-cube-with-a-robot-hand"
  - "nvidia/robotics-sim-to-real"
  - "google-deepmind/mujoco-playground"
  - "google-deepmind/mujoco-documentation"
  - "farama/gymnasium-documentation"
prerequisites:
  - "tracks/robot-learning/01-learn-from-demonstrations"
  - "tracks/robot-learning/02-reinforcement-learning-in-mujoco"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot learning track and the Master Developer Product Package, where a robot product must say what its tests did and did not cover. **Time:** about four to five hours, plus training time.

## 1. Why this matters

Simulation is fast, cheap and safe. A policy can fail a million times in a simulator and break nothing. But a simulator is a model of the world, and every model is wrong somewhere. A learned policy is good at finding the places where the model is wrong and using them. It can score well in simulation by relying on a detail that is not true of the real machine.

The **sim-to-real gap** is the difference between how a robot acts in simulation and in the real world. It shows up as broken parts, lost days and, on bigger machines, safety risk. For a product manager the lesson is simple: a simulated result is evidence about the simulator. It becomes evidence about a robot only after tests on that robot, and those tests need a trained supervisor, a safety assessment and approval from your organisation. DeveloperDojo gives you none of that hardware. This lesson trains you to find the gap in simulation, and to word your claims so they do not cross it.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which differences matter for the product, how wide the test shifts are, and what the report may claim | Writing the wrapper and the experiment, running training, tabulating results | That test shifts go beyond the training ranges, that every number is from the raw run, and that no real-world claim slipped in | Safety (real-robot tests need approval), engineering (measuring the real machine), legal (claims about performance) |

## 2. Key ideas

### Where simulation and reality differ

- **Physics.** Mass, friction and joint damping are never exactly as modelled. Damping is how strongly a joint resists motion.
- **Actuators.** Real motors have limits, lag and play in the gears.
- **Sensors.** Real readings carry noise and arrive late.
- **Cameras and light.** Textures, shadows and reflections differ.
- **The unmodelled.** Cables, wear and temperature are rarely in the model at all.

### Three ways to narrow the gap

1. **Make the simulator closer, by system identification.** You record a real robot, then fit the simulator's numbers so its motion matches. MuJoCo's documentation describes `mujoco.sysid`, a toolbox that fits model parameters to recorded hardware trajectories, including body mass, centre of mass, actuator gains and sensor and actuator delays. It needs real recordings, so you can read about it here but not use it without a robot.
2. **Randomise, so the real world looks like one more variation.** **Domain randomisation** is changing the simulator's looks and physics at random during training, so the policy copes with more variety. Tobin and colleagues trained an object detector only on simulated images with random non-realistic textures. Their abstract reports it was accurate to 1.5 cm on a real robot and robust to distractors and partial occlusion. OpenAI's Rubik's cube work went further. Its automatic domain randomisation makes the training worlds harder as the policy improves. The paper reports a policy trained only in simulation that solved a real cube with a robot hand.
3. **Add the faults you expect.** Put noise on the sensors and a delay on the actions during training, so the policy never learns to rely on perfect timing.

### Read the headline numbers with care

The Rubik's cube paper reports 10 real-robot trials. The hand solved a cube needing 15 face rotations 60 per cent of the time and one needing 26 rotations 20 per cent of the time. That is a remarkable result and also a small test, as lesson 5 shows with intervals. The authors needed a large simulated randomisation effort and a purpose-built hand. Do not read it as "randomise and it works".

### Randomisation has a price

Wider ranges make learning harder. The policy must work in every world it is shown, so it may become cautious or less precise in the normal one. Ranges that are too narrow leave the gap open. Choosing them is an engineering judgement, and it should come from measurements of the real machine.

### Test beyond the training range

A policy trained with damping between 0.5 and 2 times the normal value will do well at 1.5 times. That tells you little. Test at values outside the range as well, and report in-range and beyond-range results separately. That is how you learn where the policy stops working.

### What simulation cannot tell you

It cannot tell you that a real robot will succeed, that it will be safe, or that it will last. A simulated result says what happened in a simulator under stated shifts. Write it that way.

## 3. Step by step

Everything runs on a laptop CPU in simulation. Training is the slow step: each run is a million steps. Work in a folder `lesson-03/` with the libraries from lesson 2 installed.

1. **Write the shift wrapper.** A Gymnasium wrapper changes what an environment does without editing it. This one adds sensor noise, delays the action by a number of steps, and rescales every joint's damping at each reset. Save as `lesson-03/shift.py`.

   ```python
   """A wrapper that makes the simulator disagree with itself, as the real world would."""
   import gymnasium as gym
   import numpy as np


   class Shifted(gym.Wrapper):
       """Noisy sensors, a late action, and joint damping that changes at every reset."""

       def __init__(self, env: gym.Env, noise: float = 0.0, delay: int = 0,
                    damping: tuple[float, float] = (1.0, 1.0), seed: int = 0) -> None:
           super().__init__(env)
           self.noise, self.delay, self.damping = noise, delay, damping
           self.rng = np.random.default_rng(seed)
           self.nominal = env.unwrapped.model.dof_damping.copy()  # joint damping as shipped
           self.pending: list[np.ndarray] = []

       def reset(self, **kwargs):
           # A new damping factor every episode: the world is slightly different each time.
           self.env.unwrapped.model.dof_damping[:] = self.nominal * self.rng.uniform(*self.damping)
           self.pending = [np.zeros(self.action_space.shape, dtype=np.float32)] * self.delay
           obs, info = self.env.reset(**kwargs)
           return self._sense(obs), info

       def step(self, action):
           self.pending.append(action)
           obs, reward, terminated, truncated, info = self.env.step(self.pending.pop(0))
           return self._sense(obs), reward, terminated, truncated, info

       def _sense(self, obs: np.ndarray) -> np.ndarray:
           return obs + self.rng.normal(0.0, self.noise, obs.shape)
   ```

2. **Train two kinds of policy.** The clean policy trains in the normal simulator. The randomised policy trains with noise of 0.01, a one-step action delay and damping drawn between 0.5 and 2 times normal. Save as `lesson-03/train.py`.

   ```python
   """Train PPO on Reacher-v5, with or without randomisation, and save the model."""
   import argparse
   from pathlib import Path

   from stable_baselines3 import PPO
   from stable_baselines3.common.env_util import make_vec_env

   from shift import Shifted

   parser = argparse.ArgumentParser()
   parser.add_argument("--seed", type=int, required=True)
   parser.add_argument("--randomise", action="store_true")
   parser.add_argument("--steps", type=int, default=1_000_000)
   args = parser.parse_args()

   # Randomisation ranges used in training. The tests in compare.py go beyond some of them on purpose.
   train_shift = {"noise": 0.01, "delay": 1, "damping": (0.5, 2.0)} if args.randomise else {}
   name = f"{'randomised' if args.randomise else 'clean'}-seed{args.seed}"
   env = make_vec_env("Reacher-v5", n_envs=4, seed=args.seed, wrapper_class=Shifted,
                      wrapper_kwargs={"seed": args.seed, **train_shift})
   model = PPO("MlpPolicy", env, seed=args.seed, device="cpu")
   model.learn(total_timesteps=args.steps)
   Path("models").mkdir(exist_ok=True)
   model.save(f"models/{name}")
   print(f"saved models/{name}.zip")
   ```

3. **Write the test worlds.** Each saved model is scored in six worlds on the same 100 starting positions. "In range" sits inside the randomised training ranges. The four "beyond" worlds sit outside them. Save as `lesson-03/compare.py`.

   ```python
   """Score every saved model in several test worlds, then print the mean of each group."""
   import sys
   from collections import defaultdict
   from pathlib import Path

   import gymnasium as gym
   import numpy as np
   from stable_baselines3 import PPO

   from shift import Shifted

   WORLDS = {
       "nominal": {},
       "in range": {"noise": 0.01, "delay": 1, "damping": (2.0, 2.0)},
       "noise 0.05": {"noise": 0.05},
       "delay 3": {"delay": 3},
       "damping x8": {"damping": (8.0, 8.0)},
       "all beyond": {"noise": 0.05, "delay": 3, "damping": (8.0, 8.0)},
   }


   def mean_final_distance(model: PPO, shift: dict) -> float:
       env = Shifted(gym.make("Reacher-v5"), seed=7, **shift)
       finals = []
       for seed in range(1000, 1100):  # the same 100 starting positions in every world
           obs, _ = env.reset(seed=seed)
           done = False
           while not done:
               obs, _, terminated, truncated, info = env.step(model.predict(obs, deterministic=True)[0])
               done = terminated or truncated
           finals.append(-info["reward_dist"])
       return float(np.mean(finals))


   def row(name: str, values: list[float]) -> str:
       return name.ljust(24) + "".join(f"{v:.3f} m".rjust(13) for v in values)


   print("model".ljust(24) + "".join(name.rjust(13) for name in WORLDS))
   groups: dict[str, list[list[float]]] = defaultdict(list)
   for path in sys.argv[1:]:
       name = Path(path).stem
       scores = [mean_final_distance(PPO.load(path), shift) for shift in WORLDS.values()]
       groups[name.split("-")[0]].append(scores)
       print(row(name, scores))
   for group, rows in groups.items():
       print(row(f"MEAN {group} ({len(rows)})", list(np.mean(rows, axis=0))))
   ```

4. **Train and compare.** Run four seeds of each kind in parallel. Setting one thread per process keeps them from fighting over cores. Training took roughly five to ten minutes with eight runs at once on a 28-core desktop. A laptop will take longer, so start it and do something else.

   ```bash
   export OMP_NUM_THREADS=1
   for s in 0 1 2 3; do
     python train.py --seed $s &
     python train.py --seed $s --randomise &
   done
   wait
   python compare.py models/clean-seed?.zip models/randomised-seed?.zip | tee results.txt
   ```

5. **Read the table.** These are my results on one machine, with Gymnasium 1.4.0, MuJoCo 4.0.1 and Stable-Baselines3 2.9.2. Each cell is the mean final distance to the target over 100 episodes. The last two rows average four seeds. Random actions score about 0.16 to 0.18 m on this task, for scale.

   | World | Clean, mean of 4 seeds | Randomised, mean of 4 seeds |
   |---|---|---|
   | nominal (no shift) | 0.057 m | 0.070 m |
   | in range (noise 0.01, delay 1, damping x2) | 0.056 m | 0.069 m |
   | noise 0.05 (beyond range) | 0.059 m | 0.073 m |
   | delay 3 (beyond range) | 0.094 m | 0.081 m |
   | damping x8 (beyond range) | 0.073 m | 0.086 m |
   | all three beyond range | 0.074 m | 0.089 m |

   What the table does and does not say:

   - **Randomisation cost some precision in the normal world.** The randomised policies averaged 0.070 m against 0.057 m, which is the price of the wider training.
   - **Sensor noise of 0.05 hardly mattered** to either kind. A shift that does not matter is a useful result too.
   - **A delay of three steps hurt the clean policies most**, from 0.057 to 0.094 m. The randomised policies went from 0.070 to 0.081 m. This is the one world where randomisation clearly helped.
   - **Heavy damping did not favour the randomised policies.** The clean policies stayed ahead at 0.073 m against 0.086 m, and one randomised seed was the worst of all eight at 0.119 m.
   - **The seeds vary a lot.** Randomised nominal scores run from 0.057 to 0.089 m between seeds, as wide as the gap between the groups. Four seeds are enough to see that, and not enough to rank the methods.

   So in this experiment randomisation bought robustness to one kind of shift, cost accuracy elsewhere, and did not make the policy safe against everything. A different arm, ranges or training length could give another answer.

6. **Write the result as an observation.** In `results.md`, paste the table and write three to five sentences that say what happened in this experiment and nothing more. State the seeds, the shifts and the number of episodes. Add one sentence that begins "This does not show".

## 4. Worked example: TrailMug

TrailMug is fictional. The arm, the sensor and every number below are invented for teaching.

The TrailMug team's simulated arm places a returned cup in a wash rack. In simulation it succeeds in 46 of 50 episodes. An engineer notes three differences that matter for the real arm: its camera reports cup position about two frames late, its elbow joint is stiffer when cold, and its gripper pads are slicker when wet.

The team does not run the real arm. It adds a two-frame delay, joint stiffness between 0.8 and 1.5 times normal, and lower pad friction to the simulator. It trains a second policy and tests both in worlds beyond those ranges: three frames of delay, stiffness 2 times normal and friction at half the lowest training value.

The clean policy drops from 46 to 21 of 50 in the shifted worlds. The randomised policy drops from 41 to 33 of 50. The product manager reads this carefully. The randomised policy starts lower and degrades less, which is the price and the gain, and it is one run of each kind. The result is for the simulator. Its report says so, lists the three differences as untested on the real arm, and names the real-arm test as a separate piece of work for a trained supervisor.

## 5. Working with AI agents on this

**What the PDM decides.** Which real-world differences matter for the product, how far beyond the training range to test, and which sentences the report may contain. You decide that no sentence will say a simulated result holds on a real robot.

**What you delegate, and the exact brief.** An agent can write the wrapper, the training script and the comparison. This is the **delegate** rung. Adapt this brief:

```text
Task: in lesson-03, build a sim-to-real experiment for Gymnasium Reacher-v5 with Stable-Baselines3 PPO.
Files: shift.py (a Gymnasium wrapper), train.py, compare.py.
The wrapper adds Gaussian observation noise, an action delay in steps, and a damping scale drawn uniformly per episode.
Rules:
1. Train clean and randomised policies on seeds 0 to 3. Train for 1,000,000 steps. Do not change the steps to get a better result.
2. Randomised training ranges: noise 0.01, delay 1, damping 0.5 to 2.0 times normal.
3. Test worlds must include shifts inside and beyond those ranges. Use the same 100 start seeds in every world.
4. Print one row per model and the mean of each group.
5. Report the table exactly as printed. Do not select seeds.
6. State findings as observations of this experiment. Do not write that randomisation "works" or that the result transfers to a real robot.
Output: the files, the commands, the printed table and a list of assumptions.
```

**How you verify.** Read the wrapper. Check that damping is changed on the model that the environment uses, and that the test shifts differ from the training ones. Re-run one model through `compare.py` and see the same row. Check the prose for any claim about real robots.

**Which disciplines are involved.** Safety reviews any plan for a real-robot test. Engineering measures the real machine, which is what lets you choose ranges honestly. Legal checks what the product may claim.

**Where this sits on the ladder.** This is **delegate**. Many randomisation ranges and many seeds is a job for **orchestrate**: several runs at once and one table. A pipeline that refuses to publish a sim-to-real result without a beyond-range test and a "does not show" section is **govern**.

**Disclose.** Add to your README: "The wrapper and scripts were drafted by an AI agent. I read the wrapper, re-ran the comparison and wrote the conclusions." See [Disclose AI use](/library/disclose-ai-use) and [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Testing only inside the training range.** That is a test of what you already taught.
- **Randomising everything, widely.** Learning gets hard and the policy turns cautious.
- **Randomising by guesswork.** Ranges should come from measurements of the real machine.
- **One seed per kind.** One training run can be lucky or unlucky. Use several and show each.
- **Writing "transfers to the real robot".** You tested a simulator.
- **Forgetting that some gaps are not randomisable.** Wear and unmodelled parts are not in the model to vary.

## 7. Practice: a sim-to-real experiment

**Deliverable:** a folder `lesson-03/` in your own git repository.

1. `shift.py`, `train.py`, `compare.py` and the exact commands in a `README.md`, with library versions.
2. `results.txt`: the printed table.
3. `results.md`: three to five observation sentences, the seeds and shifts, and a sentence that begins "This does not show".
4. `differences.md`: a list of five ways a real arm would differ from the simulator, and for each whether you could randomise it, measure it or only avoid claiming it.
5. One line in the README on how an AI agent helped.

**Check:** ask a classmate or Sensei to find any sentence in `results.md` that claims more than the table shows.

## 8. Checklist

- [ ] I can name five ways a simulator differs from a real robot.
- [ ] I can explain system identification and domain randomisation in my own words.
- [ ] I trained more than one seed of each kind.
- [ ] I tested both inside and beyond the training ranges.
- [ ] I reported results as observations of the simulator.
- [ ] I wrote a "this does not show" sentence.
- [ ] I recorded versions and my AI use.

## 9. Further learning

The domain randomisation paper by Tobin and colleagues and the OpenAI Rubik's cube paper are the two best-known studies. Read the abstracts first and the sections on evaluation next. NVIDIA's learning module introduces the gap, though it has no hands-on activity. MuJoCo's documentation describes the system identification toolbox, and the MuJoCo Playground site shows a suite of environments and workflows from simulation to hardware. The Gymnasium documentation explains wrappers, which you used here. Next, [Vision-language-action models and open datasets](/library/tracks/robot-learning/04-vision-language-action-models-and-open-datasets) looks at large models that are trained on real robot data.
