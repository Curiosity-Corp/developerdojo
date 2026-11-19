---
title: "Vision-language-action models and open datasets"
description: "Meet the open models that read images and text and output robot actions. Compare OpenVLA, Octo, openpi, SmolVLA and GR00T, and the public datasets behind them, on licence, size and hardware."
section: "Robot learning"
order: 4
track: "robot-learning"
level: "advanced"
duration: "3 to 4 hours"
outcomes:
  - "Explain what a vision-language-action model is and how it differs from the small policy you trained in lesson 1"
  - "Name five open models and four public datasets, and say what each one is for"
  - "Read a licence label, a model card and a repository readme, and say when the label is not enough"
  - "Work out whether a model can run on the hardware you have, before you download it"
  - "Write a comparison card in git that cites a source for every cell"
resources:
  - "openvla/openvla"
  - "octo-models/octo"
  - "physical-intelligence/openpi"
  - "arxiv/smolvla"
  - "nvidia/isaac-gr00t"
  - "open-x-embodiment/robotic-learning-datasets"
  - "droid-dataset/droid"
  - "libero-project/libero"
prerequisites:
  - "tracks/robot-learning/01-learn-from-demonstrations"
  - "tracks/robot-learning/03-mind-the-sim-to-real-gap"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot learning track and the Master Developer Product Package, where a robot product may build on someone else's model and must know its terms. **Time:** about three to four hours.

## 1. Why this matters

In lesson 1 you trained a tiny policy for one task. A **vision-language-action model** (VLA) is a large model that reads camera images and text and outputs robot actions. You give it a picture of a table and the sentence "put the cup in the rack". It answers with the next motion. Labs train these on large collections of robot recordings, then publish them so others can fine-tune them for a new task or robot.

For a developer this is a buy-or-build call. A published model can save months. It can also arrive with a licence that blocks your use, a memory need that your laptop cannot meet, and training data that looks nothing like your task. The Product Development Manager's job is to find that out before the team spends a week on it.

You cannot run most of these models on a laptop. You can still read their documents, compare them fairly and decide. That is what this lesson trains.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Whether to build on a published model at all, and which one | Reading readmes and model cards, filling a comparison table, writing a Hub metadata script | Every licence and hardware claim against the official page, and who it was tested on | Legal (licences and terms), finance (GPU cost), safety (a large model is still not a safety guard) |

## 2. Key ideas

### What a VLA is made of

A VLA joins three parts. A vision encoder turns camera images into numbers. A language model reads the instruction and those numbers. An action part, or head, turns the result into robot commands. Models differ in the action part. OpenVLA builds on the Llama 2 language model, per its readme. Octo and GR00T N1.7 use diffusion-style heads that remove noise step by step, the idea behind Diffusion Policy in lesson 1.

A **parameter** is one learned number inside the model. More parameters mean more memory.

### Pretraining and fine-tuning

The makers **pretrain** the model on a large mix of robot data, so it learns general habits. You then **fine-tune** it: you train it a little more on your own demonstrations for your own robot and task. Fine-tuning needs a dataset in the right format, and the right camera names and action meaning. A model trained on one robot's action format does not work on another until you adapt it. The openpi readme says so in plain words: its first model was developed for the team's own robots, which differ from common platforms, and they do not expect every attempt to adapt it to succeed.

### The open models, as their own pages state

| Model | Made by | Code licence | Weights | Hardware named by the makers |
|---|---|---|---|---|
| OpenVLA | The OpenVLA project | MIT | The readme says they may inherit limits from Llama 2 and follow the Llama Community License | LoRA fine-tuning of the 7B model on one 80 GB A100, or a GPU with at least about 27 GB; full fine-tuning on a node of 8 A100s |
| Octo | The Octo project | MIT | Octo-Small has 27 million parameters and Octo-Base 93 million, per the readme | The readme gives no memory figure. Check before you run it |
| openpi | Physical Intelligence | Apache 2.0 | Not verified for this lesson. Read the licence of each checkpoint | Inference over 8 GB; LoRA fine-tuning over 22.5 GB; full fine-tuning over 70 GB |
| SmolVLA | Hugging Face, in LeRobot | Apache 2.0 | The `lerobot/smolvla_base` card says Apache 2.0; about 450 million parameters | 20,000 fine-tuning steps take about 4 hours on one A100 per the LeRobot page; a Colab notebook is offered |
| GR00T N1.7 | NVIDIA | Apache 2.0 | NVIDIA Open Model License | Inference needs one GPU with 16 GB or more; fine-tuning 40 GB or more is recommended |

Treat the table as a map and not as a promise. These pages change. You will check each cell yourself. Octo and SmolVLA are the small ones. A larger model is not better by default: the evidence for your robot and task counts.

### Licences: three layers

A model has at least three licences to read.

1. **The code.** Usually permissive, such as MIT or Apache 2.0.
2. **The weights.** The trained numbers. Their licence can be stricter than the code's. NVIDIA names a separate Open Model License for GR00T's weights. OpenVLA's readme warns about the Llama licence.
3. **The training data.** Models learn from datasets that carry their own terms.

The Hub's licence label is a short tag. For GR00T N1.7 it says `other`, which means "go and read the licence". For OpenVLA the label on the Hub says `mit`, while the code repository's readme says the weights follow the Llama Community License. When two sources disagree, use the stricter one until you have read both. This lesson does not give legal advice. For a product, ask a lawyer.

### The open datasets

| Dataset | What it is | What the sources say |
|---|---|---|
| Open X-Embodiment | A pooled collection of robot datasets from many labs | The abstract reports 22 robot types and 160,266 tasks. Each source dataset has its own terms: check them |
| DROID | Robot manipulation recorded in many real scenes | The abstract reports 76,000 trajectories, 350 hours, 564 scenes and 50 collectors over 12 months. The abstract says 84 tasks. The website figure differs, so this lesson quotes only the abstract |
| LIBERO | A simulated benchmark of manipulation tasks | The readme says 130 tasks in four suites, code under MIT and data under CC BY 4.0. LeRobot's page says it needs Linux |
| lerobot/pusht | The small simulated task from lesson 1 | MIT label on the Hub |

Open X-Embodiment and DROID record real robots. LIBERO is a simulator, so you can evaluate a policy with no hardware.

### What these models cannot do for you

- They do not know your robot. Action meaning, cameras and speed differ.
- A published success rate comes from the authors' set-up, not yours. Lesson 5 shows how to measure your own.
- They are not a safety layer, and real hardware needs a trained supervisor.
- Open does not mean unrestricted. Read the terms.

## 3. Step by step

You need no GPU for steps 1 to 4. Step 5 is optional and needs one.

1. **Make a card for each model and dataset.** In your `robot-learning` repository, create `lesson-04/` and a file `comparison.md`. For each of the five models and four datasets above, create a row with these columns: maker, task it was tested on, code licence, weights licence, data licence, hardware needed, source URL and the date you read it. Fill each cell from the official page. Write `not verified` where you could not find it. An empty cell is better than a guess.

2. **Read the sources.** Open the readme or model card for each row. Use the project pages in the resource list. Note any sentence that limits use, such as a non-commercial clause, a gated download or a "research only" note.

3. **Read licence labels from the Hub with code.** The Hub exposes each repository's metadata. This script prints the licence label and the parameter count for any list of models and datasets, and says so when it cannot read one. Save it as `lesson-04/model_card.py`. It needs `huggingface_hub`, which LeRobot already installs.

   ```python
   """Read licence labels and parameter counts from the Hugging Face Hub, so a table cites a source."""
   import sys

   from huggingface_hub import HfApi
   from huggingface_hub.utils import HfHubHTTPError

   api = HfApi()


   def describe(kind: str, repo_id: str) -> str:
       try:
           info = api.model_info(repo_id) if kind == "model" else api.dataset_info(repo_id)
       except HfHubHTTPError as error:
           return f"{kind:8} {repo_id}: could not read ({str(error).splitlines()[0]})"
       card = info.card_data.to_dict() if info.card_data else {}
       licence = card.get("license", "none stated")
       size = ""
       if kind == "model" and info.safetensors:
           size = f", {info.safetensors.total / 1e6:.0f}M parameters"
       return f"{kind:8} {repo_id}: licence label {licence}{size}, last modified {info.last_modified:%Y-%m-%d}"


   for argument in sys.argv[1:]:
       kind, repo_id = argument.split(":", 1)
       print(describe(kind, repo_id))
   ```

   ```bash
   python lesson-04/model_card.py model:openvla/openvla-7b model:rail-berkeley/octo-small-1.5 \
     model:lerobot/smolvla_base model:nvidia/GR00T-N1.7-3B dataset:lerobot/pusht dataset:lerobot/libero
   ```

   On the day this lesson was checked, the labels read `mit` for OpenVLA and Octo, `apache-2.0` for SmolVLA, `other` for GR00T, `mit` for PushT and `apache-2.0` for the LeRobot copy of LIBERO. The parameter counts were about 7.5 billion, 450 million and 3.1 billion for the three that report them. Your run may differ because repositories change. Paste the output into `comparison.md` with the date.

   The `lerobot/libero` label differs from the original LIBERO readme, which says CC BY 4.0 for the data. A re-upload can carry its own label. Write both and say which you rely on.

4. **Decide, with a reason, for one imagined project.** TrailMug's arm (see the worked example) is a single arm with one top camera. For your own invented project, pick the model you would try first and write three lines: what hardware it needs, what its licence allows, and what the data it was trained on does not cover. The smallest model that can do the job is a valid answer.

5. **Optional, with a GPU: evaluate a published checkpoint in simulation.** LeRobot ships LIBERO support on Linux. Follow the [LeRobot LIBERO page](https://huggingface.co/docs/lerobot/libero) for the install step, which is `pip install -e ".[libero]"` from a source checkout of LeRobot, and set the rendering backend for a headless machine. Then evaluate a small number of episodes on one suite. The command below follows that page. Check it against the current page before you run it, because options change.

   ```bash
   export MUJOCO_GL=egl
   lerobot-eval \
     --policy.path=lerobot/smolvla_libero \
     --env.type=libero \
     --env.task=libero_object \
     --eval.batch_size=1 \
     --eval.n_episodes=3
   ```

   The LeRobot page says `lerobot-eval` prints a 95 per cent Wilson interval next to each success rate. Three episodes is far too few to say anything. It only proves your set-up runs. Notebook plans change, so check what a free one offers today. The `lerobot/smolvla_libero` checkpoint on the Hub shows an Apache 2.0 label. Read its card before you use it.

   Without a GPU, skip this step. Your `comparison.md` already meets the lesson.

## 4. Worked example: TrailMug

TrailMug is fictional. The arm and every number below are invented for teaching.

The TrailMug team has a simulated arm that places a returned cup in a wash rack. Their lesson 1 policy, trained on 80 demonstrations, fails when the cup is tilted. A teammate suggests: "Just use a big VLA." The product manager asks for a comparison card first.

The card shows three things. The largest model needs a GPU with more memory than anyone on the team has, so each run means renting a machine. One model's weights come with a licence that the team's lawyer has not read. And none of the models was trained on this arm: its action format differs, so adapting it is a project in itself.

The team decides on a smaller step. They will fine-tune the smallest model that fits a rented GPU, on the 80 demonstrations plus 40 with tilted cups, and test it on fixed starting positions in the simulator. They write down what would make them stop: if the fine-tuned model does not beat the lesson 1 policy on the same test, they keep the small policy.

The PDM did not pick a model for its fame. They read the terms, counted the hardware and set a test that can say no.

## 5. Working with AI agents on this

**What the PDM decides.** Whether the project may use a published model, which licence terms are acceptable, and what budget a trial may spend on GPUs. You also decide which claims in the comparison card are allowed to stand.

**What you delegate, and the exact brief.** An agent can read readmes, fill the table and run the metadata script. This is the **delegate** rung. Adapt this brief:

```text
Task: fill lesson-04/comparison.md for five open robot models and four datasets.
Models: OpenVLA, Octo, openpi, SmolVLA, GR00T N1.7. Datasets: Open X-Embodiment, DROID, LIBERO, lerobot/pusht.
Columns: maker, task tested on, code licence, weights licence, data licence, hardware needed, source URL, date read.
Rules:
1. Use only official pages: the project readme, the Hugging Face model or dataset card, or the paper abstract.
2. Copy numbers exactly. Do not round or convert them.
3. If a cell cannot be found on an official page, write "not verified". Do not infer it from a similar model.
4. Where the Hub label and the readme disagree, write both and quote the sentence.
5. Run lesson-04/model_card.py and paste its output. Do not edit that output.
6. Do not run any model. Do not download weights.
Output: the table, a list of every "not verified" cell, and a list of every disagreement between sources.
```

**How you verify.** Open the source URL in at least five cells yourself and compare it with the table. Agents fill gaps with plausible numbers, and a model that read many readmes will blend them. Check every licence cell and every hardware cell. Ask for the quoted sentence behind any figure that looks surprising.

**Which disciplines are involved.** Legal reads the licence cells. Finance prices the GPU hours. Safety asks what the robot does when a large model is wrong. Operations asks who updates the card when a model is replaced.

**Where this sits on the ladder.** This is **delegate**. When many cards must be kept current, it moves toward **orchestrate**: an agent re-checks each source on a schedule, and a person reviews each change. A pipeline that refuses to publish a card with an unsourced cell is **governing**.

**Disclose.** Add to your README: "The comparison table was drafted by an AI agent. I checked each licence and hardware cell against its source." See [Disclose AI use](/library/disclose-ai-use) and [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Reading only the label.** `mit` on a model page can sit beside a stricter note in the readme. `other` tells you nothing until you read the licence.
- **Mixing up code and weights.** A code licence does not give you the weights' terms.
- **Copying a headline result.** A success rate on the authors' robot says little about yours.
- **Ignoring memory.** A model that does not fit your GPU is not an option.
- **Trusting an agent's table.** Models fill gaps. A cell without a source is a guess.
- **Assuming a model fits your robot.** Cameras, action meaning and control rate must match.

## 7. Practice: a comparison card

**Deliverable:** a folder `lesson-04/` in your own git repository.

1. `comparison.md`: the table from step 1, every cell with a source URL and the date read, and `not verified` where needed.
2. `model_card.py` and its pasted output.
3. `decision.md`: one imagined project, the model you would try first and three reasons, written as a short note a manager could read.
4. `disagreements.md`: each place where two sources differ, with both quotes.
5. If you ran step 5: the full command and the printed result, with a note that three episodes is only a set-up check.
6. One line in the README on how an AI agent helped.

**Check:** ask a classmate or Sensei to pick three cells at random and check them against the sources.

## 8. Checklist

- [ ] I can explain a vision-language-action model in two sentences.
- [ ] I filled every cell from an official page, or wrote `not verified`.
- [ ] I separated the code, weights and data licences.
- [ ] I checked the hardware need before choosing a model.
- [ ] I noted where two sources disagree.
- [ ] I did not copy a published success rate as if it were mine.
- [ ] I recorded the date I read each source and my AI use.

## 9. Further learning

The OpenVLA, Octo, openpi and GR00T repositories are the primary sources for what each model is and needs, and their licence sections are short. The SmolVLA paper explains why a small model can be useful, and the LeRobot pages show how to fine-tune it. The Open X-Embodiment, DROID and LIBERO project pages describe the data and how it was collected. Read their abstracts and licence notes before you plan a run. Next, [Evaluate a policy and report failures](/library/tracks/robot-learning/05-evaluate-a-policy-and-report-failures) shows how to measure any of these policies fairly.
