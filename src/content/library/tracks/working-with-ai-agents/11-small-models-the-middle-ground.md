---
title: "Small models: the middle ground between scripts and LLMs"
description: "Scripts are too dumb for some jobs, and large language models are often too expensive and too heavy. Learn the ladder of model sizes in between, how to pick the right rung, and how to run small models on your own hardware."
section: "Working with AI agents"
order: 11
track: "working-with-ai-agents"
level: "advanced"
duration: "90 min"
outcomes:
  - "Name the six rungs from a rule to a large LLM, and give one job that fits each"
  - "Pick a rung using volume, latency, cost per call, error cost and how much the input varies"
  - "Measure two rungs on the same task and compare accuracy, speed and cost with real numbers"
  - "Run a small language model on a CPU, and explain how a slice of a GPU is shared"
  - "State the licence of every model you choose before you use it"
prerequisites:
  - "tracks/working-with-ai-agents/08-evals-and-testing-ai-work"
  - "open-source-licences"
resources:
  - "google/ml-problem-framing"
  - "google/rules-of-machine-learning"
  - "kaggle/intro-to-machine-learning"
  - "hugging-face/llm-course"
  - "openai/working-with-evals"
updated: 2026-11-20
---

Lesson 11 is an extra lesson after the core track. It supports the Master Developer module on orchestrating AI agents, where you decide which model does each job and what it costs. It builds on [lesson 8, Evals and testing AI work](/library/tracks/working-with-ai-agents/08-evals-and-testing-ai-work), because you cannot choose a model without measuring it.

## 1. Why this matters

Here is the problem in one sentence. Scripts are too dumb, and large language models are often too expensive and too heavy. A script breaks the first time a customer writes "cancel pls" instead of "cancel". A large model understands that message, but you pay for every call, you wait for every answer, and you send your data to someone else's computer.

There is a middle ground, and most teams skip it. Between a rule and a large model sit **small models**: classical machine learning, compact text encoders, embedding models, and small language models that run on an ordinary computer. They are cheaper, faster and private, and for many jobs they are just as accurate.

This is a product decision, not only an engineering one. The model you pick sets the cost of every action a user takes, how long they wait, and where their data goes. Researchers at NVIDIA make the same argument for agents in [Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153). Most calls inside an agent system do a few narrow tasks again and again, so a small model is often the better fit.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which rung each job uses, the accuracy bar, the cost limit and where data may go | Building and timing the baseline for each rung, writing the runner script | Reading the eval results, re-running the numbers, checking every licence | Finance (cost per call), security and privacy (where data goes), operations (who runs the model) |

## 2. Key ideas, explained

### The ladder

Start at the bottom. Climb one rung only when the rung below fails your eval.

| Rung | What it is | Good for | Example (licence) |
|---|---|---|---|
| 1. A rule or SQL | Code you write by hand | Fixed logic: "overdue after 14 days" | Your own code |
| 2. Classical machine learning | Models trained on your own table or text data | Scoring, forecasting, simple text labels | [scikit-learn](https://scikit-learn.org) (BSD-3-Clause) |
| 3. BERT-class encoders | Small models that read text and output a label | Classification, intent, named entities | [DistilBERT](https://huggingface.co/distilbert/distilbert-base-uncased) (Apache-2.0), [ModernBERT](https://huggingface.co/answerdotai/ModernBERT-base) (Apache-2.0) |
| 4. Embeddings and rerankers | Models that turn text into numbers, so similar texts sit close together | Search, matching, routing, duplicate detection | [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) (Apache-2.0), [bge-reranker-base](https://huggingface.co/BAAI/bge-reranker-base) (MIT) |
| 5. Small language models | Language models of about 1 to 8 billion parameters, run on your own hardware | Pulling fields out of messy text, short rewrites, simple tool calls | [Qwen3-1.7B](https://huggingface.co/Qwen/Qwen3-1.7B) (Apache-2.0), [Phi-4-mini-instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct) (MIT) |
| 6. A large LLM | A hosted frontier model behind an API | Open-ended reasoning, long writing, rare and unusual cases | Claude, Gemini and similar (commercial terms of service) |

A **parameter** is one number the model learned during training. More parameters usually means more skill, more memory and slower answers.

An **encoder** reads text and produces a label or a vector. It does not write text. That is why it is fast. An **embedding** is a list of numbers that stands for the meaning of a text. A **reranker** takes a short list of search results and puts the best ones first.

### What the small rungs can do: public numbers

You do not have to take this on trust. Each figure below comes from the paper or page linked.

- **Encoders are small and fast.** The [DistilBERT paper](https://arxiv.org/abs/1910.01108) reports a model 40% smaller than BERT that keeps 97% of its language understanding and runs 60% faster.
- **Encoders are still improving.** [ModernBERT](https://arxiv.org/abs/2412.13663) reads up to 8,192 tokens at once. Its authors report state-of-the-art results across many classification and retrieval tasks, and call it the most speed- and memory-efficient encoder they tested.
- **Embedding models trade quality for speed.** The [Sentence Transformers model list](https://sbert.net/docs/sentence_transformer/pretrained_models.html) says all-MiniLM-L6-v2 is 5 times faster than its best general model and still gives good quality. The [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) compares hundreds of embedding models on public tasks.
- **Few labels can be enough.** [SetFit](https://arxiv.org/abs/2209.11055) trains a text classifier from a handful of labelled examples per class. Its authors report accuracy comparable to prompt-based methods that need billion-parameter models, while training an order of magnitude faster.
- **Small language models are capable.** The [Phi-3 technical report](https://arxiv.org/abs/2404.14219) describes a 3.8-billion-parameter model that scores 69% on the MMLU knowledge benchmark. Its authors say it rivals much larger models such as Mixtral 8x7B and GPT-3.5, and it is small enough to run on a phone.

A benchmark is someone else's test, on someone else's data. Use it to make a shortlist, then measure on your own task. Lesson 8 shows how.

### Licences are part of the choice

Every model has a licence, and they differ even inside one family. Read the licence file of the exact model and size you download.

- **Apache-2.0 or MIT:** use, change and ship, keeping the notice. Examples: Qwen3 from 0.6B to 8B, Mistral-7B-Instruct-v0.3, all-MiniLM-L6-v2, ModernBERT, DistilBERT (Apache-2.0); Phi-4-mini-instruct, bge-small-en-v1.5, bge-reranker-base (MIT).
- **Custom licences with conditions:** [Llama 3.2](https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/LICENSE) uses the Llama 3.2 Community License. It asks you to show "Built with Llama" when you ship it, and a service with more than 700 million monthly users needs a separate licence from Meta. Gemma uses the [Gemma Terms of Use](https://gemma.ai/resources/terms/). Neither is an OSI-approved open source licence.
- **One family, two licences:** Qwen2.5-1.5B-Instruct is Apache-2.0, but [Qwen2.5-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-3B-Instruct/blob/main/LICENSE) uses the Qwen Research License. Check the size you actually use.

The [open source licences page](/library/open-source-licences) explains the families and how to record a licence check.

## 3. Step by step: pick the rung

Answer five questions for the job. Write the answers down before you test anything.

| Question | Points down the ladder | Points up the ladder |
|---|---|---|
| **Volume:** how many calls a day? | Millions | A few dozen |
| **Latency:** how long can the user wait? | Milliseconds | Seconds or minutes |
| **Cost per call:** what can one call cost? | A tiny fraction of a cent | Cents are fine |
| **Error cost:** what does one wrong answer cost? | Low, or a person checks every answer anyway | High, and only a strong model gets it right |
| **Input variety:** how often does the input change shape? | Fixed fields, a fixed set of labels | Free text, new kinds of request every week |

Then:

1. **Write the eval first.** Collect real examples with the correct answer, as in lesson 8.
2. **Build the lowest rung that could work.** Usually a rule or a classical model. Measure accuracy and speed.
3. **Write down the gap.** Which cases fail, and why?
4. **Climb one rung.** Measure again on the same eval.
5. **Stop at the first rung that passes your bar.** A higher rung costs more on every call, forever.
6. **Keep a fallback.** Send the cases the small model is unsure about to the next rung up, or to a person.
7. **Record the decision** with the numbers, the date, the model name and its licence.

Step 6 is how most real systems end up: a cheap model handles the common cases, and a larger model or a person handles the rest.

## 4. Worked examples

### A measured comparison you can run

This example sorts forum posts into four topics: graphics, hockey, medicine and space. It uses the public [20 Newsgroups dataset](https://scikit-learn.org/stable/datasets/real_world.html#the-20-newsgroups-text-dataset), which scikit-learn downloads for you. It runs the same task on three rungs and prints accuracy and speed.

Install the libraries. We tested with Python 3.12.

```bash
python -m venv .venv && . .venv/bin/activate
pip install scikit-learn sentence-transformers requests
```

Save this as `data.py`. The other scripts import it.

```python
from sklearn.datasets import fetch_20newsgroups

# Four topics from a public text dataset, with e-mail headers, signatures and quotes removed.
CATS = ["comp.graphics", "rec.sport.hockey", "sci.med", "sci.space"]
STRIP = ("headers", "footers", "quotes")

train = fetch_20newsgroups(subset="train", categories=CATS, remove=STRIP)
test = fetch_20newsgroups(subset="test", categories=CATS, remove=STRIP)
```

**Rung 2: classical machine learning.** TF-IDF counts how important each word is in a post. Logistic regression then learns which words point to which topic. Save as `rung2_tfidf.py`:

```python
from time import perf_counter

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.pipeline import make_pipeline

from data import test, train

model = make_pipeline(TfidfVectorizer(sublinear_tf=True, min_df=2), LogisticRegression(max_iter=1000))

start = perf_counter()
model.fit(train.data, train.target)
trained = perf_counter()
predicted = model.predict(test.data)
done = perf_counter()

print(f"trained on {len(train.data)} posts in {trained - start:.1f} s")
print(f"accuracy {accuracy_score(test.target, predicted):.3f} on {len(test.data)} posts")
print(f"{(done - trained) / len(test.data) * 1000:.2f} ms per post")
```

**Rung 4: embeddings.** The same classifier, but each post is first turned into an embedding by all-MiniLM-L6-v2. Save as `rung4_embed.py`:

```python
from time import perf_counter

from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

from data import test, train

encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2", device="cpu")

start = perf_counter()
train_vectors = encoder.encode(train.data, batch_size=64)
test_vectors = encoder.encode(test.data, batch_size=64)
encoded = perf_counter()

classifier = LogisticRegression(max_iter=1000).fit(train_vectors, train.target)
predicted = classifier.predict(test_vectors)

posts = len(train.data) + len(test.data)
print(f"embedded {posts} posts in {encoded - start:.1f} s ({(encoded - start) / posts * 1000:.2f} ms per post)")
print(f"accuracy {accuracy_score(test.target, predicted):.3f} on {len(test.data)} posts")
```

**Rung 5: a small language model, with no training at all.** Qwen3-1.7B reads each post and picks a topic. A JSON schema forces the answer to be one of the four labels. This needs the llama.cpp server running; section 6 shows how. Save as `rung5_slm.py`:

```python
import json
from time import perf_counter

import requests
from sklearn.metrics import accuracy_score

from data import test

URL = "http://127.0.0.1:8080/v1/chat/completions"  # llama-server on this machine
LABELS = ["graphics", "hockey", "medicine", "space"]  # same order as CATS
SAMPLE = 200

schema = {
    "type": "object",
    "properties": {"topic": {"type": "string", "enum": LABELS}},
    "required": ["topic"],
}


def classify(post: str) -> str:
    response = requests.post(URL, timeout=120, json={
        "messages": [
            {"role": "system", "content": "Classify the forum post. Topics: " + ", ".join(LABELS) + "."},
            {"role": "user", "content": post[:2000]},
        ],
        "temperature": 0,
        "response_format": {"type": "json_schema", "json_schema": {"schema": schema}},
        "chat_template_kwargs": {"enable_thinking": False},
    })
    response.raise_for_status()
    return json.loads(response.json()["choices"][0]["message"]["content"])["topic"]


posts, truth = test.data[:SAMPLE], test.target[:SAMPLE]
start = perf_counter()
predicted = [LABELS.index(classify(post)) for post in posts]
seconds = perf_counter() - start

print(f"accuracy {accuracy_score(truth, predicted):.3f} on {SAMPLE} posts")
print(f"{seconds / SAMPLE * 1000:.0f} ms per post")
```

**What we measured.** We ran all three on 20 November 2026 on one desktop computer: an Intel Core i7-14700 CPU, no GPU, and other work running at the same time. Your numbers will differ. Run the scripts and compare.

| Rung | Accuracy, all 1,578 test posts | Accuracy, first 200 posts | Time per post |
|---|---|---|---|
| 2. TF-IDF and logistic regression | 0.879 | 0.865 | 0.12 ms (batch) |
| 4. all-MiniLM-L6-v2 embeddings and logistic regression | 0.907 | 0.885 | 17.5 ms |
| 5. Qwen3-1.7B, 8-bit, no examples given | not run | 0.690 | 2,452 ms |

Training the TF-IDF model on 2,371 posts took 14.1 seconds. The small language model ran only on the first 200 test posts, because it is slow on a CPU. The middle column compares all three rungs on the same posts.

**How to read this.** For a fixed set of labels with labelled examples, the cheaper rungs won. They were more accurate, and between about 140 and about 20,000 times faster. The language model saw no examples, so this is not a fair fight for it. That is the point: when you have labelled data and the labels do not change, train a small classifier. A language model earns its place when the labels change every week, when you have no labelled data, or when the job is to write or extract text rather than pick a label.

**What it costs at volume.** At the measured speeds, one million posts take about 2 minutes of CPU on rung 2, about 5 hours on rung 4, and about 680 hours on rung 5 on this one machine. Compare a hosted model. On 20 November 2026, [Anthropic's pricing page](https://platform.claude.com/docs/en/about-claude/pricing) listed Claude Haiku 4.5 at $1 per million input tokens and $5 per million output tokens. Suppose each call sends about 600 tokens and gets about 10 back (an assumption for this example, not a measurement). That is about $0.00065 a call, or about $650 per million posts. The formula is the useful part:

```text
cost per call = input tokens x input price + output tokens x output price
```

### TrailMug: one product, every rung

TrailMug lends reusable cups to cafés. Maya, the product owner, lists the jobs where software makes a decision, and picks a rung for each. All details are invented for the example.

| Job | Rung | Why |
|---|---|---|
| Flag cups not returned after 14 days | 1. SQL | The rule is fixed and exact |
| Forecast how many cups each café needs next week | 2. Classical time-series model | Numbers in a table, with a weekly pattern |
| Route support messages into five queues | 3. Encoder classifier | Fixed labels, many messages, must be instant |
| Find the right help article for a question | 4. Embeddings, then a reranker | Matching meaning, not exact words |
| Read a free-text order e-mail and pull out café, cup count and date | 5. Small language model with a JSON schema | The wording changes every time, the output is a fixed shape |
| Draft a reply to an unusual complaint | 6. Large LLM, and a person approves | Rare, open-ended, and an error hurts the relationship |

Maya does not trust her table yet. For each job she writes a small eval, measures the rung she picked and the rung below it, and keeps the cheaper one if it passes. The order e-mail job also gets a fallback: when the small model returns an empty field, the e-mail goes to a person.

## 5. Working with AI agents on this

**What do I decide here?** The accuracy bar for each job, the cost limit per call, where data may go, and which licences are acceptable. These are product decisions.

**What do I delegate to agents, and with what exact brief?** Building and timing the rungs is good agent work. This lesson sits on the **Delegate** rung: one agent, one written brief, and you check the result. A brief you can adapt:

```text
Task: compare rungs for the job "<job in one sentence>".
Data: <path to the eval set> (inputs and correct answers; do not change it).
Build and run, on CPU only:
  1. a rule or classical model baseline (scikit-learn),
  2. an embedding model with a logistic regression head,
  3. a small language model of 1 to 8B parameters via llama.cpp, with a JSON schema.
For each, report accuracy on the full eval set, time per item, the exact model name,
its licence as stated in the model's licence file, and the command you ran.
Do not use a hosted API. Do not invent numbers: if a run fails, show the error.
```

**How do I verify what comes back?** Re-run at least one script yourself and check that the numbers match. Open the licence file of every model named. Read ten of the wrong answers from each rung, so you know how each one fails. Check that every rung used the same eval set.

**Which other disciplines are involved?** Finance checks the cost per call at your real volume. Security and privacy check where the data goes: a model on your own machine keeps it there, a hosted API does not. Operations decides who runs and updates the model. When several agents each test a different rung at once, you are at the **Orchestrate** rung; a shared eval set in git keeps them comparable.

**Disclose AI use.** Say in the MR which numbers an agent produced and which you re-ran yourself. See [Disclose AI use](/library/disclose-ai-use).

## 6. Running small models on your own hardware

### On a CPU

Rungs 1 to 4 run well on any modern CPU. You saw the times above.

For rung 5, [llama.cpp](https://github.com/ggml-org/llama.cpp) (MIT) runs language models on a CPU. It uses **GGUF** files, a format for quantised models. **Quantisation** stores each parameter in fewer bits, for example 8 or 4 instead of 16. The file gets smaller and faster, and quality drops a little. A rough guide to memory: parameters times bytes per parameter. Qwen3-1.7B at 8 bits is a 1.70 GiB file.

Download a release for your system from the [llama.cpp releases page](https://github.com/ggml-org/llama.cpp/releases), then fetch a model and start the server:

```bash
curl -L -o Qwen3-1.7B-Q8_0.gguf \
  https://huggingface.co/Qwen/Qwen3-1.7B-GGUF/resolve/main/Qwen3-1.7B-Q8_0.gguf
./llama-server -m Qwen3-1.7B-Q8_0.gguf --host 127.0.0.1 --port 8080 -c 4096 -t 20
```

The `-t` option sets how many CPU threads to use; match it to your cores. The [server](https://github.com/ggml-org/llama.cpp/tree/master/tools/server) offers an OpenAI-compatible chat API, a shape many hosted providers and tools use, so code written for a hosted model often needs only a new URL. The `rung5_slm.py` script above talks to it.

To measure raw speed, llama.cpp ships a benchmark tool:

```bash
./llama-bench -m Qwen3-1.7B-Q8_0.gguf -t 20 -p 512 -n 128
```

On the same desktop CPU, with 20 threads, it read prompts at about 147 tokens a second and wrote at about 13.7 tokens a second. Reading is fast and writing is slow, so a small model is quickest on jobs with a long input and a short answer, like picking a label or filling a few fields.

[Ollama](https://ollama.com) (MIT) wraps llama.cpp in a simpler tool, if you prefer one command to download and run a model.

### On a slice of a GPU

A GPU makes rungs 3 to 5 much faster, but a whole data-centre GPU is often far more than one small model needs. You can share it.

- **Multi-Instance GPU (MIG).** On supported NVIDIA GPUs, starting with the Ampere generation, the [MIG user guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/introduction.html) describes splitting one GPU into up to seven separate instances. Each has its own memory and compute.
- **Time-slicing.** Several workloads take turns on one GPU. There is no memory isolation, so one workload can starve another. NVIDIA's [GPU sharing guide](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html) covers both options on Kubernetes.
- **Kubernetes.** A pod asks for a GPU, or a MIG slice, as a resource. See [Schedule GPUs](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/).

A small encoder or a 1 to 2 billion parameter model fits easily in one slice. Measure first; a CPU may be enough.

## 7. Common mistakes and how to avoid them

- **Starting at the top.** Teams call a large LLM for a job a SQL query could do. Fix: start at rung 1 and climb only on evidence.
- **Choosing from a leaderboard.** A public score is not your data. Fix: shortlist from benchmarks, decide on your own eval.
- **Ignoring volume.** A cost that looks tiny per call grows with every user. Fix: multiply by your real daily volume before you decide.
- **Comparing on different data.** Two rungs tested on different examples tell you nothing. Fix: one eval set, in git, for every rung.
- **Assuming the licence.** Licences change between sizes and versions of one family. Fix: open the licence file of the exact model you download.
- **No fallback.** A small model will be wrong sometimes. Fix: route unsure or empty answers to a bigger model or a person.
- **Letting the model think out loud when you need a label.** Some models write long reasoning before they answer, which is slow. Fix: turn reasoning off when the job is simple, as `rung5_slm.py` does, and force a short answer with a schema.

## 8. Practice

**Deliverable:** a folder `model-choice/<job-name>/` in your git repository.

1. Pick one job in your product where software makes a decision about text or data.
2. Write the five answers from section 3 (volume, latency, cost per call, error cost, input variety).
3. Build an eval of at least 50 examples with correct answers. Use invented or cleaned data.
4. Brief an agent with the prompt in section 5, adapted to your job.
5. Re-run one rung yourself and check that the numbers match.
6. Write a decision record: the rung you chose, the numbers, each model's licence and the date.
7. Commit it in a merge request with a line on how you used AI.

## 9. Checklist

- [ ] I wrote the five answers before testing anything.
- [ ] I measured at least two rungs on the same eval set.
- [ ] I started at the lowest rung that could work.
- [ ] I checked every model's licence in its own licence file.
- [ ] I multiplied the cost per call by my real volume.
- [ ] My system has a fallback for unsure answers.
- [ ] My decision record has the numbers, the date and the licences.

## 10. Further learning

Google's course on problem framing helps you decide whether a job needs machine learning at all. Its Rules of Machine Learning say to start simple and measure. Kaggle's free introduction builds the classical rung by hand, and the Hugging Face course covers encoders and language models. The OpenAI evals guide helps you build the eval set that drives every choice in this lesson.

This lesson was drafted with an AI agent from a written brief. The measurements in sections 4 and 6 were run as described, on the date given, and every other figure links to its source.
