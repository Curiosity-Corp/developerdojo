---
title: "Learn from demonstrations"
description: "Teach a simulated robot by showing it. Load a public demonstration dataset, read its format, train a small policy to copy it, and see why small mistakes pile up."
section: "Robot learning"
order: 1
track: "robot-learning"
level: "advanced"
duration: "4 to 5 hours"
outcomes:
  - "Explain imitation learning in plain words and say what a demonstration dataset must contain"
  - "Open a public LeRobotDataset, read its metadata and describe each field"
  - "Train a small policy on demonstrations and watch it run on fixed starting positions"
  - "Say why a policy with a low training error can still fail the task, and name two modern methods that reduce the problem"
resources:
  - "hugging-face/lerobot"
  - "hugging-face/lerobot-dataset-v3"
  - "hugging-face/robotics-course"
  - "arxiv/learning-fine-grained-bimanual-manipulation"
  - "arxiv/diffusion-policy"
  - "hugging-face/lerobot-hardware-guide"
prerequisites:
  - "tracks/robot-software/01-linux-and-python-for-robots"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot learning track and the Master Developer Product Package, where a robot product needs evidence that its policy works. **Time:** about four to five hours.

## 1. Why this matters

Writing rules for a robot arm is slow. "Move above the cup, lower by 4 centimetres, close the gripper" works until the cup sits a little differently. A person can show the arm what to do in a minute. If the robot could learn from that, an hour of examples could replace days of rules.

That is **imitation learning**: training a policy to copy actions that people demonstrated. A **policy** is a model that reads what the robot senses and chooses its next action. It is the most direct way to get a learned policy, and it is behind much recent progress in robot manipulation.

It moves your effort. You now own a dataset. Who demonstrated? How many times? Did anyone show how to recover from a slip? A policy can only copy what it was shown. Choosing that data is a product decision, and it stays with you.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which task to teach, who demonstrates, how many demonstrations, which data you may use and what "worked" means | Writing loading, training and plotting scripts; running training; producing videos | The dataset's licence and contents, a held-out check, and what the policy really does on screen | Safety (a policy is not a safety guard), legal (dataset licence), operations (who records data and how often) |

## 2. Key ideas

### Observation, action, policy

At each time step the robot has an **observation**: camera images and joint positions, for example. It sends an **action**: the next target position for its joints or gripper. A policy maps one to the other.

### Behaviour cloning is supervised learning

**Behaviour cloning** is the simplest imitation learning. Each recorded step is an example: "given this observation, the person did this action". You train a model to predict the action. The model holds numbers called weights. Training nudges them to shrink a **loss**: one number for how wrong the predictions are. The nudge direction is the **gradient**. The library does that calculus for you.

### Teleoperation and episodes

A person records demonstrations by **teleoperation**: driving the robot with a leader arm, a gamepad or a mouse. The software saves what the robot senses and does at a fixed rate, such as 10 times a second. One attempt, from start to finish, is an **episode**. One time step in it is a **frame**.

### The LeRobotDataset format

Hugging Face makes **LeRobot**, an open toolkit for robot learning under the Apache 2.0 licence. It defines the **LeRobotDataset** format. The current version is 3.0 and needs `lerobot` 0.4.0 or later. From the official documentation:

| Part | What it holds |
|---|---|
| `data/` Parquet files | Numbers per frame: state, action, timestamps, episode index |
| `videos/` MP4 files | Camera recordings, one stream per camera |
| `meta/info.json` | Field names and shapes, frames per second, version |
| `meta/stats.json` | Mean, spread and range of each field, for scaling |
| `meta/tasks.parquet` | Task sentences, such as "Push the T-shaped block onto the T-shaped target" |
| `meta/episodes/` | Where each episode starts and ends |

Parquet is a compact table format. Datasets load from the Hugging Face Hub, a public site for sharing models and data.

### Compounding errors

The policy trains on states the demonstrator visited, and a demonstrator rarely errs. When the policy makes a small mistake, it lands in a state that is not in the data. With nothing to copy, it makes a bigger mistake. Errors pile up. The ACT paper names this in its abstract: errors in the policy can compound over time.

### Two modern fixes

- **Action chunking.** Predict the next several actions at once and run them before looking again. That means fewer decisions and fewer chances to drift. **ACT** (Action Chunking with Transformers) does this. Its paper reports 80 to 90 per cent success on six hard real-world tasks, each learned from about 10 minutes of demonstrations. Those are the authors' results on their own robot, not a promise for yours.
- **Diffusion policy.** Generate each action by starting from noise and removing it step by step. The paper reports an average gain of 46.9 per cent over earlier methods across 12 tasks from four benchmarks. It copes when several actions are equally good, such as pushing a block left or right of an obstacle. Averaging two good actions can give a bad one.

LeRobot ships both, as `act` and `diffusion`. Its hardware guide gives rough GPU memory needs at batch size 8: about 2 to 6 GB for ACT and 8 to 14 GB for diffusion. It says a CPU-only computer is not meant for training them.

### What imitation learning cannot do

- It cannot beat its demonstrators. Slow or sloppy demonstrations give a slow or sloppy policy.
- It cannot recover from a situation it never saw.
- A low loss is not success. Only running the policy tells you.

## 3. Step by step

The code is small so that it trains on a laptop CPU. It is a teaching baseline, not a good policy. You reuse it in the capstone.

1. **Set up.** Make a folder `lesson-01/` in your `robot-learning` repository and work inside it: every command and path below is relative to that folder. Create a Python 3.12 virtual environment and install LeRobot with the PushT simulator extra. Follow the official [install page](https://huggingface.co/docs/lerobot/installation) for the current command and for `ffmpeg`, which decodes the videos.

   ```bash
   python3.12 -m venv .venv
   source .venv/bin/activate
   pip install "lerobot[pusht]" imageio imageio-ffmpeg
   ```

2. **Look at the data.** PushT is a public benchmark: a round pusher moves a T-shaped block onto a T-shaped target. The dataset `lerobot/pusht` holds human demonstrations of it. Run this and read every line of the output.

   ```python
   from lerobot.datasets.lerobot_dataset import LeRobotDataset

   dataset = LeRobotDataset("lerobot/pusht")
   print(dataset.num_episodes, dataset.num_frames, dataset.fps)
   print(list(dataset.meta.features))
   sample = dataset[0]
   print(sample["observation.image"].shape, sample["observation.state"], sample["action"])
   print(sample["task"])
   ```

   On the day this lesson was checked it printed 206 episodes, 25,650 frames and 10 frames a second. The image is 96 by 96 pixels, the state is the pusher's position and the action is where it moves next. The dataset card on the Hub names the licence: MIT. Copy that into your notes.

3. **Decode the data once.** Reading video at every training step is slow, so this script decodes it once into one NumPy file. Save it as `src/pusht_bc/prepare_data.py`, with an empty `src/pusht_bc/__init__.py` beside it.

   ```python
   """Decode the public lerobot/pusht dataset once and save it as one NumPy file."""
   from pathlib import Path

   import numpy as np
   import torch
   from lerobot.datasets.lerobot_dataset import LeRobotDataset

   OUT = Path("data/pusht.npz")

   dataset = LeRobotDataset("lerobot/pusht")
   loader = torch.utils.data.DataLoader(dataset, batch_size=256, num_workers=4)
   images, states, actions, episodes = [], [], [], []
   for batch in loader:
       images.append((batch["observation.image"] * 255).round().to(torch.uint8).numpy())
       states.append(batch["observation.state"].numpy())
       actions.append(batch["action"].numpy())
       episodes.append(batch["episode_index"].numpy())
   OUT.parent.mkdir(exist_ok=True)
   np.savez_compressed(OUT, image=np.concatenate(images), state=np.concatenate(states),
                       action=np.concatenate(actions), episode=np.concatenate(episodes))
   print(f"saved {OUT}: {dataset.num_frames} frames from {dataset.num_episodes} episodes")
   ```

   ```bash
   PYTHONPATH=src python -m pusht_bc.prepare_data
   ```

4. **Write the policy.** A small convolutional network reads the picture, and the pusher position joins near the end. The output is a small step from the current position, which is easier to learn than an absolute one. Save as `src/pusht_bc/policy.py`.

   ```python
   """A small policy: a picture of the table and the pusher position in, the next pusher target out."""
   import torch
   import torch.nn.functional as F
   from torch import nn

   WORLD = 512.0  # PushT positions run from 0 to 512 in both axes


   def prepare(image_u8: torch.Tensor, position: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
       """Turn a (B, 3, 96, 96) uint8 image into (B, 3, 48, 48) floats, and scale positions to 0..1."""
       image = F.avg_pool2d(image_u8.float() / 255.0, kernel_size=2)
       return image, position.float() / WORLD


   class SmallPolicy(nn.Module):
       def __init__(self) -> None:
           super().__init__()
           self.conv = nn.Sequential(
               nn.Conv2d(3, 16, 5, stride=2), nn.ReLU(),
               nn.Conv2d(16, 32, 3, stride=2), nn.ReLU(),
               nn.Conv2d(32, 64, 3, stride=2), nn.ReLU(),
               nn.AdaptiveAvgPool2d(2), nn.Flatten(),
           )
           self.head = nn.Sequential(nn.Linear(64 * 4 + 2, 128), nn.ReLU(), nn.Linear(128, 2))

       def forward(self, image: torch.Tensor, position: torch.Tensor) -> torch.Tensor:
           # a small step from the current position
           return position + 0.1 * self.head(torch.cat([self.conv(image), position], dim=1))
   ```

5. **Train, with episodes held out.** The model never trains on the last 20 episodes, so their loss shows if it copies unseen demonstrations. Save as `src/pusht_bc/train.py`.

   ```python
   """Train the small policy on the demonstrations in data/pusht.npz."""
   import argparse
   import time
   from pathlib import Path

   import numpy as np
   import torch
   from torch import nn

   from pusht_bc.policy import SmallPolicy, WORLD, prepare


   def main() -> None:
       parser = argparse.ArgumentParser()
       parser.add_argument("--epochs", type=int, default=10)
       parser.add_argument("--seed", type=int, default=0)
       parser.add_argument("--out", type=Path, default=Path("runs/bc_policy.pt"))
       args = parser.parse_args()

       torch.manual_seed(args.seed)
       data = np.load(Path("data/pusht.npz"))
       image = torch.from_numpy(data["image"])  # uint8, (N, 3, 96, 96)
       position = torch.from_numpy(data["state"])  # (N, 2), pixels
       action = torch.from_numpy(data["action"]).float() / WORLD
       episode = data["episode"]

       held_out = torch.from_numpy(episode > episode.max() - 20)  # the last 20 episodes are never trained on
       train_idx = torch.nonzero(~held_out).squeeze(1)
       val_idx = torch.nonzero(held_out).squeeze(1)

       model = SmallPolicy()
       optimiser = torch.optim.AdamW(model.parameters(), lr=1e-3)
       loss_fn = nn.MSELoss()
       started = time.time()
       for epoch in range(1, args.epochs + 1):
           model.train()
           order = train_idx[torch.randperm(len(train_idx))]
           for start in range(0, len(order), 128):
               batch = order[start : start + 128]
               img, pos = prepare(image[batch], position[batch])
               loss = loss_fn(model(img, pos), action[batch])
               optimiser.zero_grad()
               loss.backward()
               optimiser.step()
           model.eval()
           with torch.no_grad():
               img, pos = prepare(image[val_idx], position[val_idx])
               val_loss = loss_fn(model(img, pos), action[val_idx]).item()
           print(f"epoch {epoch} val_loss {val_loss:.5f} elapsed {time.time() - started:.0f}s", flush=True)

       args.out.parent.mkdir(parents=True, exist_ok=True)
       torch.save(model.state_dict(), args.out)


   if __name__ == "__main__":
       main()
   ```

   ```bash
   PYTHONPATH=src python -m pusht_bc.train --epochs 10 | tee train-log.txt
   ```

   On a 28-core desktop CPU, 10 epochs took under a minute; a laptop may need several. The loss is the mean squared error: the average squared gap between predicted and demonstrated positions.

6. **Watch it play.** Run the policy on three fixed seeds. A seed fixes the random starting positions, so anyone can repeat the episodes. Save as `src/pusht_bc/rollout.py`.

   ```python
   """Watch the policy play on fixed seeds and save one video per seed."""
   import sys
   from pathlib import Path

   import gym_pusht  # noqa: F401  registers gym_pusht/PushT-v0
   import gymnasium as gym
   import imageio.v2 as imageio
   import numpy as np
   import torch

   from pusht_bc.policy import SmallPolicy, WORLD, prepare

   SEEDS = [10_000, 10_001, 10_002]
   weights = Path(sys.argv[1] if len(sys.argv) > 1 else "runs/bc_policy.pt")

   policy = SmallPolicy()
   policy.load_state_dict(torch.load(weights, map_location="cpu", weights_only=True))
   policy.eval()
   env = gym.make("gym_pusht/PushT-v0", obs_type="pixels_agent_pos", render_mode="rgb_array")
   Path("videos").mkdir(exist_ok=True)

   for seed in SEEDS:
       obs, _ = env.reset(seed=seed)
       frames, best = [], 0.0
       done = False
       while not done:
           image = torch.from_numpy(obs["pixels"]).permute(2, 0, 1).unsqueeze(0)
           position = torch.from_numpy(obs["agent_pos"]).unsqueeze(0)
           with torch.no_grad():
               action = policy(*prepare(image, position)).squeeze(0).numpy() * WORLD
           obs, _, terminated, truncated, info = env.step(np.clip(action, 0.0, WORLD))
           frames.append(env.render())
           best = max(best, float(info["coverage"]))
           done = terminated or truncated
       imageio.mimsave(f"videos/seed{seed}.mp4", frames, fps=10, macro_block_size=1)
       print(f"seed {seed}: success={info['is_success']} best_coverage={best:.2f} steps={len(frames)}")
   env.close()
   ```

   ```bash
   PYTHONPATH=src python -m pusht_bc.rollout
   ```

   The coverage is how much of the target the block covers. The environment counts success at 95 per cent or more.

7. **Read the result honestly.** Open the videos. Expect a weak policy, with success at or near zero. That is not a bug in your set-up: a tiny network trained for minutes on 206 demonstrations cannot match published methods. The lesson is what you see. Where does the pusher drift, freeze or push the block the wrong way? Write it down. Lesson 5 turns those notes into a failure taxonomy.

## 4. Worked example: TrailMug

TrailMug is fictional. The arm, the rack and every number below are invented for teaching.

The TrailMug team imagines a café robot that takes a returned cup from a tray and places it in a wash rack. They have a simulated arm and no real one. A team member drives the arm with a gamepad and records 50 demonstrations. Before training, they fill in a dataset note:

| Field | Their note (example) |
|---|---|
| Source | One person, in the team's own simulator |
| Licence | Internal use only, not published |
| Size | 50 episodes, about 10 frames per second |
| Inputs | One top camera and the arm's joint positions |
| Variation | The tray never moves; the cup is always upright |
| Missing | No dropped cup, no tilted cup, no retry after a miss |

They train a small policy. The held-out loss is low. On screen the arm reaches the cup, closes its gripper a little late, and the cup slips. The arm then stops, because it never saw a slipped cup. One small error became an unseen state.

The team blames the data, not the model. They record 30 more episodes in which the demonstrator misses on purpose and then recovers, and they move the tray a few centimetres between episodes. They retrain and test the same fixed starting positions as before. That is the Product Development Manager's work: reading a failure as a data problem, choosing what to record next, and comparing before and after on the same test.

## 5. Working with AI agents on this

**What the PDM decides.** The task, who records the demonstrations, what the dataset may contain and when the policy is good enough. You also decide what you will not claim: a policy that copies demonstrations in a simulator says nothing about the real world.

**What you delegate, and the exact brief.** You can hand an agent the job of writing the loading, training and rollout scripts. This is the **delegate** rung: a written brief with acceptance criteria. Adapt this one:

```text
Task: in the folder lesson-01, write a PushT behaviour-cloning baseline for a laptop CPU.
Use the public dataset lerobot/pusht through LeRobotDataset (current lerobot release).
Files under src/pusht_bc/: prepare_data.py, policy.py, train.py, rollout.py.
Rules:
1. Hold out the last 20 episodes. Never train on them. Print their loss each epoch.
2. Take the torch seed from a --seed argument.
3. Run the policy in gym_pusht/PushT-v0 on fixed seeds 10000, 10001 and 10002.
4. Save one MP4 per seed. Print success and best coverage per seed.
5. Nothing may need a GPU. Do not download any other dataset.
6. If unsure of a function name, read the installed package. Do not guess.
Output: the files, the exact commands to run them, and a list of assumptions.
```

**How you verify.** Run it yourself. Check that the licence and episode count in your notes match the dataset page. Read the line that splits the data: an agent can write a loop that looks right but trains on the test episodes. Watch all three videos. Do not ask the same agent whether its result is good.

**Which disciplines are involved.** Safety asks what the robot does when the policy is wrong; a learned policy gives no guarantee. Legal asks whether you may use and share the dataset. Operations plans who records new demonstrations.

**Where this sits on the ladder.** This is **delegate**. It becomes **orchestrate** when several agents train variants at once, and you need one results table. A rule that no run is reported until its held-out check and videos are filed, enforced before a merge, is **governing**.

**Disclose.** Add to your README: "Scripts were drafted by an AI agent from my brief. I read every file, ran every command and watched every video." See [Disclose AI use](/library/disclose-ai-use) and [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Trusting the loss.** A low held-out loss means the model copies well, not that the robot succeeds. Run the simulator.
- **Testing on training data.** Hold out whole episodes. Frames from one episode look alike, so a random split of frames leaks.
- **Never looking at the videos.** Numbers hide how a policy fails. Watch at least three episodes.
- **Skipping the licence.** Write the dataset's licence in your notes.
- **Claiming too much.** A weak baseline on a toy task proves nothing about a real robot.

## 7. Practice: a dataset note and a baseline

**Deliverable:** a folder `lesson-01/` in your own git repository.

1. `dataset-note.md`: for `lerobot/pusht`, its source, licence, episode and frame counts, frames per second, each field in the features list, and three things the data does not show.
2. The four scripts from steps 3 to 6, and a `README.md` with the exact commands, the versions of `lerobot`, `torch` and `gymnasium` (from `pip list`) and the date.
3. `train-log.txt` and the three videos.
4. `observations.md`: one row per video (seed, what the pusher did, how it failed), and a paragraph on what data you would record next and why.
5. One line in the README on how an AI agent helped.

**Check:** ask a classmate or Sensei to run your commands in a fresh environment.

## 8. Checklist

- [ ] I can explain a policy, an episode and behaviour cloning in my own words.
- [ ] I wrote down the dataset's licence, size and fields.
- [ ] I held out whole episodes and checked the code excludes them.
- [ ] I ran the policy on fixed seeds and watched every video.
- [ ] I wrote what failed, not only a number.
- [ ] I wrote what the data does not show.
- [ ] I recorded the library versions and my AI use.

## 9. Further learning

The LeRobot documentation is the main reference, and the dataset page explains the v3.0 layout. The Hugging Face robotics course teaches the same ideas as a course. The ACT and Diffusion Policy papers describe the two methods above; read the abstracts first, and note that the numbers come from the authors' own tasks. The hardware guide shows what a GPU does for training before you rent one. Next, [Reinforcement learning in MuJoCo](/library/tracks/robot-learning/02-reinforcement-learning-in-mujoco) removes the teacher: the robot learns by trial and error.
