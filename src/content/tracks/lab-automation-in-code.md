---
title: "Lab automation in code"
description: "Write liquid-handling protocols in Python, check them in a simulator, design experiments, let Bayesian optimisation pick the next one and keep an audit trail. Ends with a closed loop in simulation."
group: "biotechnology"
order: 2
icon: "flask-conical"
level: "core"
skills: [lab-automation, data-analytics, security, git-gitlab, ai-evaluation]
outcomes:
  - "Explain why a risk assessment and trained supervision come before any automation, and why simulation is not a licence to skip them"
  - "Write an Opentrons Python protocol and check it in the simulator before it goes near a robot"
  - "Design an experiment with controls, replicates and a randomised plate layout"
  - "Use Bayesian optimisation to suggest the next batch of experiments, and say when it is the wrong tool"
  - "Keep an audit trail that a stranger can check, and build a closed loop that runs entirely in simulation"
---

## In short

This track is for developers who want code to drive a lab. You will write liquid-handling protocols in Python. You will check every one in a simulator first. You will design an experiment. Then you will let Bayesian optimisation suggest the next one. You will keep an audit trail that a stranger can check. In the capstone you build a closed loop. It mixes three dyes over three rounds. All of it runs on a laptop, in simulation. No real chemistry happens here. Real lab work needs trained people and approval. So the track starts with biosafety. Automation does not remove responsibility. On the agent ladder, you delegate the code. You never delegate the safety call.

### Key words

- **Closed loop:** A cycle where the result of one experiment helps choose the next.
- **Bayesian optimisation:** A method that uses past results to pick the next experiment to try.
- **Audit trail:** A dated record of who did what, kept so others can check it.
- **Biosafety level:** A set of lab controls matched to the risk of the work.
- **Agent ladder:** Four rungs of skill with AI agents: use, delegate, orchestrate and govern. Each rung needs different skills.

A "self-driving lab" sounds like science fiction. Strip away the name and it is a loop that software can run: decide what to try, write the instructions for a liquid-handling robot, run them, read the result, learn, and decide again. Each step is something you can code. Each step is also something that can go wrong without anyone noticing, which is why this track spends as much time on checking and records as on code.

You do not need a robot, and you do not need a lab. You need a laptop. The robot is simulated by the free tools the robot's maker publishes. The plate reader is a small program that stands in for real measurements. **It is not real chemistry**, and the track says so every time it matters.

## Who this track is for

This track is for you if you can read and write a little Python and want to see how software meets a laboratory. You may be a developer who wants to work near biology, a bioinformatician who wants to start earlier in the pipeline, or a product person who will direct agents that write protocol code. You do not need a biology degree. You do need to be willing to read a safety lesson before you write any code, and to treat every real-world step as work for trained people.

## What you will be able to do

By the end of the track you will be able to:

- Say what a risk assessment is, why a risk group alone does not decide the safety measures, and where the official biosafety guidance lives.
- Explain biosecurity and dual use in plain words, and say why gene synthesis screening exists.
- Write a protocol for the Opentrons Flex or OT-2 in Python, using labware, a pipette and the commands `transfer`, `distribute` and `consolidate`.
- Run the protocol in the simulator and read the log to see exactly what the robot would do.
- Plan an experiment: a question, factors and levels, controls, replicates, randomisation and a plate layout that copes with edge effects.
- Use Ax and BoTorch to suggest the next batch of experiments, with noise and a constraint.
- Capture data with metadata, keep a tamper-evident audit log and put your protocols in git.
- Build a closed loop in simulation and show it to a reviewer with a README, three protocols, simulator logs, a progress plot, an audit log and a short report.

## How the six lessons build

1. **[Biosafety basics before you automate](/library/tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate).** Risk groups, biosafety levels, risk assessment, biosecurity and dual use. You write a one-page safety note that every later lesson refers to.
2. **[Liquid-handling protocols in Python](/library/tracks/lab-automation-in-code/02-liquid-handling-protocols-in-python).** You write a protocol for the Opentrons Python Protocol API, simulate it and read the run log.
3. **[Design an experiment](/library/tracks/lab-automation-in-code/03-design-an-experiment).** You turn a question into factors, controls, replicates and a randomised plate layout, and write the design as a file.
4. **[Bayesian optimisation for the next experiment](/library/tracks/lab-automation-in-code/04-bayesian-optimisation-for-the-next-experiment).** You learn the surrogate model and the acquisition function, then ask Ax for a batch.
5. **[Data capture and audit trails](/library/tracks/lab-automation-in-code/05-data-capture-and-audit-trails).** You record runs with metadata, hashes and a hash-chained log, and you meet FAIR, ALCOA+ and 21 CFR Part 11 as awareness.
6. **[Capstone: a closed loop in simulation](/library/tracks/lab-automation-in-code/06-capstone-a-closed-loop-in-simulation).** You join everything into a colour-mixing loop with three dyes and three rounds, and a reviewer checks it against numbered criteria.

Each lesson has the same shape: why it matters, key ideas, step by step, a worked example, how to work with AI agents, common mistakes, a practice exercise that ends in a file in your git repository, and a checklist. The worked example is the colour-mixing loop, built up one piece at a time.

## What you need

- **A laptop.** No GPU is needed. The capstone loop ran on an ordinary computer in between about half a minute and a few minutes, depending on the machine. If a free cloud notebook is all you have, it can run the same Python, but the track was tested on a Linux laptop only.
- **Python.** The code was tested with Python 3.12. Use a virtual environment and install the Opentrons and Ax packages in one command, so the installer picks versions that work together. Lesson 2 explains why.
- **Free software only.** The `opentrons` Python package, Ax, BoTorch, matplotlib, pytest and git. No account is needed to run any of them.
- **A git repository** for your own work. Every practice ends with a file in it.
- **No robot, no reagents, no lab.** If you later get access to a real robot, that is a separate step with its own training and approval. Lesson 1 says what that involves.

## Time needed

Plan about two to three hours for each of lessons 1 to 5. The capstone is the longest. Plan six to ten hours, because you build, test, run and write it up. These are honest estimates for a learner who can already write Python. Add time if you are new to it.

## What the 2030 Product Development Manager does here

Four jobs stay with you:

- **Decide what is worth trying, and what is off limits.** You choose the question and the design. You also decide what no agent may do, such as touching real equipment or real organisms.
- **Decide what counts as a good result.** A score that improves is not the same as a result you can trust. You set the criteria before you run.
- **Verify the record.** You read the simulator log, check the audit trail and say what the stand-in reader cannot show.
- **Own the safety call.** An agent can write a protocol. It cannot carry responsibility for what happens when someone runs it.

Agents are fast at protocol code, at design tables and at plots. They also make quiet mistakes: a wrong labware name, an API call from another version, a plot that does not match the data. So each lesson names the check you run before you trust the output. On the agent ladder this track sits at **delegate**: a written brief, an acceptance test and your review. The capstone shows what would raise it to **orchestrate** (several agents at once) and **govern** (a merge gate that refuses a change without a simulator run and an intact audit log).

Other disciplines care too. Safety and biosafety officers own the real-lab rules. Legal and compliance decide what records a regulated lab must keep. Data and statistics people check the design. Security asks who can change a protocol and how you would know.

## How it maps to the Dojo

- **Bioinformatics track.** This track and [Bioinformatics](/library/tracks/bioinformatics) are two ends of one pipeline. Here you plan and run experiments. There you read and analyse the sequence data that comes out.
- **Robot software track.** A liquid-handling robot is a robot. [Robot software](/library/tracks/robot-software) covers simulation, logging and testing for robots in general, which are the same habits used here.
- **Robot learning track.** Bayesian optimisation and reinforcement learning both learn from trial and error. [Robot learning](/library/tracks/robot-learning) shows the other approach and the sim-to-real gap.
- **Safety, reports and review.** [Safety reports and review](/library/tracks/safety-reports-and-review) teaches when not to trust a model and how to write the report the capstone needs.
- **Research and evidence.** [Find and judge sources](/library/tracks/research-and-evidence/02-find-and-judge-sources) is how you check every claim in a safety note.
- **Security fundamentals.** The audit trail in lesson 5 uses the same ideas as [Securing agent work](/library/tracks/security-fundamentals/04-securing-agent-work): who did what, and can you prove it.
- **Git and GitLab.** Protocols are code. Use the habits from [Branches and merge requests](/library/tracks/git-and-gitlab/02-branches-and-merge-requests).

## Before you begin

Create an empty git repository for this track. Make a folder called `lab/`. Every exercise saves a file there. Read [Disclose AI use](/library/disclose-ai-use) first: every file you make with an agent's help carries a short note saying so.
