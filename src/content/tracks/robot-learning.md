---
title: "Robot learning"
description: "Teach a simulated robot arm from demonstrations and from trial and error. Learn why simulation lies, meet open vision-language-action models, and test a policy with a failure report you can defend."
group: "robotics"
order: 2
icon: "brain-circuit"
level: "advanced"
skills: [robot-learning, ai-evaluation, data-analytics, open-source]
outcomes:
  - "Train a policy from recorded demonstrations and say why it drifts off course"
  - "Train a policy by reinforcement learning in MuJoCo with fixed seeds and a learning curve"
  - "Explain the sim-to-real gap and the published ways to narrow it, without claiming more than the evidence shows"
  - "Say what open vision-language-action models and datasets can do, what they cost to run and what their licences allow"
  - "Evaluate a policy with fixed seeds, a success rate and a confidence interval, and write a failure report with videos"
---

## In short

This track is for developers who want robots that learn from data. You will teach a simulated arm a task two ways. In one, the arm copies human demonstrations. In the other, it learns by trial and error. You will see why a policy that works in simulation can fail in reality. You will meet open vision-language-action models and read their licences. Then you will test a policy fairly. You run many fixed-seed episodes and report the success rate with its interval. Then you sort the failures. Everything runs in simulation on free software. A laptop is enough, and a free cloud notebook helps. Your capstone is a learned policy with an honest failure report.

### Key words

- **Imitation learning:** Training a policy to copy actions that people demonstrated.
- **Policy:** A model that reads what a robot senses and chooses its next action.
- **Reinforcement learning:** Training a policy by trial and error, guided by a reward score.
- **Sim-to-real gap:** The difference between how a robot acts in simulation and in the real world.
- **Vision-language-action model (VLA):** A large model that reads camera images and text and outputs robot actions.

A robot that follows hand-written rules breaks the moment the world differs from the rules. A learned policy can cope with more variety, but it fails in ways that are harder to predict. Each failure costs time, and on real hardware it can cost safety. This track teaches you to build such policies and, more important, to measure them honestly.

## Who this track is for

This track is for you if you can write a small Python program and want to work on robots that learn. You may be a developer, an engineer who now directs AI agents, or a student of robotics or machine learning. You do not need a robot. You do not need a graphics card.

**What you must know first.**

- The first lesson of the robot-software track, [Linux and Python for robots](/library/tracks/robot-software/01-linux-and-python-for-robots). You need a Linux or macOS terminal, a Python virtual environment and git.
- Basic Python: functions, loops, lists, reading a file, running a script with arguments.

**What maths you need, plainly.**

- Arrays and vectors: a list of numbers, such as the joint angles of an arm. You will add them, scale them and take averages.
- Percentages and fractions, and what an average of many tries means.
- Basic probability: if a coin lands heads 6 times in 10, how sure are you that it is fair? Lesson 5 builds on this idea.
- Reading a graph: what a line that goes up, flattens or wobbles tells you.

You do not need calculus or linear algebra to finish the track. You will use libraries that do the training mathematics for you. The ideas of a gradient (a small step that lowers an error) and a loss (a number for how wrong the model is) are explained in words when they first appear. If you later want to build new methods rather than apply existing ones, study calculus, linear algebra and probability properly. The free machine learning courses listed in the lessons are a good start.

## What you will be able to do

By the end of the track you will be able to:

- Record or load demonstrations in the open LeRobot dataset format and train a policy from them.
- Train a reinforcement learning policy in MuJoCo through Gymnasium with a maintained library, and read its learning curve.
- Say what domain randomisation, system identification, sensor noise and latency are, and which of them a published result actually tested.
- Describe OpenVLA, Octo, openpi, SmolVLA and GR00T accurately: who made them, how they are licensed and what hardware they need.
- Run a fixed-seed evaluation, report a success rate with a 95 per cent interval, and sort failures into a taxonomy.
- Write a failure report that a stranger can check from your repository.

## How the six lessons build

1. **[Learn from demonstrations](/library/tracks/robot-learning/01-learn-from-demonstrations).** You load a public demonstration dataset, read its format, and train a small policy to copy it. You see how small mistakes pile up.
2. **[Reinforcement learning in MuJoCo](/library/tracks/robot-learning/02-reinforcement-learning-in-mujoco).** You train a policy by trial and error with PPO. You learn why seeds, reward design and learning curves matter.
3. **[Mind the sim-to-real gap](/library/tracks/robot-learning/03-mind-the-sim-to-real-gap).** You study what makes simulated results fail on real machines, and you add randomisation and noise to your own simulated task.
4. **[Vision-language-action models and open datasets](/library/tracks/robot-learning/04-vision-language-action-models-and-open-datasets).** You compare the open models and datasets, check licences and hardware needs, and run a small model in simulation if you have a GPU.
5. **[Evaluate a policy and report failures](/library/tracks/robot-learning/05-evaluate-a-policy-and-report-failures).** You write an evaluation protocol, compute an interval and build a failure taxonomy.
6. **[Capstone: a learned manipulation policy](/library/tracks/robot-learning/06-capstone-a-learned-manipulation-policy).** You deliver one learned policy for one simulated task, with rollout videos, an evaluation table and a written failure report.

Each lesson has the same shape: why it matters, key ideas, step by step, a worked example with the fictional product **TrailMug** (reusable cups for cafés), how to work with AI agents, common mistakes, a practice exercise that ends in a file in your own git repository, and a checklist. Each lesson also points to free outside material from the tool makers and from the researchers who wrote the papers.

## What you need

- **A computer.** An ordinary laptop with 8 GB of memory or more, running Linux or macOS. Windows users can work in Windows Subsystem for Linux. You need about 10 GB of free disk.
- **Software.** Python, git, and open-source libraries installed with `pip` or `uv`: LeRobot, Gymnasium, MuJoCo and Stable-Baselines3. Each lesson names what to install and tells you to use the version the official install page names.
- **Free accounts.** A GitLab or GitHub account for your repository. A Hugging Face account is optional: public datasets download without one. A free Google Colab or Kaggle notebook is optional. Free notebook plans change, so check what GPU they offer today.
- **Be honest about the GPU.** Training a policy is the slow step. Without a graphics card, the track works with small policies and short runs, and you will get weaker results. LeRobot's own hardware guide says a machine with only a CPU is not meant for training. With a free cloud GPU you can train the standard LeRobot policies on a small simulated task. The largest vision-language-action models need far more memory than free notebooks give you, and the lesson on them says so. Where a lesson needs a GPU it also gives a path without one.
- **No robot, no lab.** Everything here is simulation and public data. DeveloperDojo does not provide robots or hardware. If you later work on a real robot, you need a trained supervisor, a safety assessment and approval from your organisation.

## Time needed

Plan about 3 to 5 hours per lesson, and 8 to 12 hours for the capstone. Training runs add waiting time that you can use for reading. In all, expect about 30 to 40 hours.

## What the 2030 Product Development Manager does here

You will not write every line of training code. Agents can write scripts, launch runs, draw plots and draft reports. Four jobs stay with you:

- **Choose the task and define success.** "Place a returned cup in the rack" is not a test. "The cup rests in the rack within 200 steps, in at least 9 of 10 fixed starting positions" is.
- **Decide what data you may use.** You check where a dataset came from, its licence and what it leaves out.
- **Judge the evidence.** A single good run is a story. A rate over many fixed episodes, with an interval, is a result. You decide when a result is good enough, and you say what it does not show.
- **Own the claim.** When your report says a policy works, your name is on it. A person watches the videos and checks the numbers.

This is the **delegate** rung of the agent ladder: you hand over whole tasks with a written brief and acceptance criteria, and you check the result. It becomes **orchestrate** when several training runs go at once, and **govern** when a pipeline refuses to publish a result that lacks seeds, a table and videos.

## How it maps to the Dojo

- **[Robot software](/library/tracks/robot-software).** Read it first. That track shows how a robot is built from nodes, simulation and tests. Here you add a learned policy to that picture.
- **[Safety reports and review](/library/tracks/safety-reports-and-review).** Lesson 1 there, [When not to trust a model](/library/tracks/safety-reports-and-review/01-when-not-to-trust-a-model), pairs with lesson 5 here. Lesson 2, [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report), helps with your capstone report.
- **[Research and evidence](/library/tracks/research-and-evidence).** Papers and model cards make claims. That track teaches you to check them.
- **[Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).** The method you use on every agent-written script and plot in this track.
- **[Agent orchestration](/library/tracks/agent-orchestration).** Useful when you run many training jobs and need a written policy for what an agent may launch.
- **[Lab automation in code](/library/tracks/lab-automation-in-code).** The closed loop of "act, measure, decide" in that track is the same loop that a learned policy runs, in a different setting.

## Before you begin

Create a git repository for the track, called `robot-learning`. Each lesson saves a file there. Read [Disclose AI use](/library/disclose-ai-use) first: every file you make with an agent's help carries a short note saying so. New words are in the [glossary](/library/glossary).
