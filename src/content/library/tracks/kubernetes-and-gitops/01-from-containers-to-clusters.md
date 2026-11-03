---
title: "From containers to clusters"
description: "What Kubernetes is for, its main parts, and the control loop that keeps a system in the state you declared: enough to read a proposal and ask good questions."
section: "Kubernetes and GitOps"
order: 1
track: "kubernetes-and-gitops"
level: "foundation"
duration: "75 min"
outcomes:
  - "Explain why teams use Kubernetes and when a simpler option is better"
  - "Name cluster, node, pod, deployment, service and namespace and say what each does"
  - "Describe the control loop in plain words"
  - "Ask five questions of any proposal to run something on Kubernetes"
prerequisites:
  - "the-way-five-rules"
resources:
  - "kubernetes/kubernetes-overview"
  - "kubernetes/learn-kubernetes-basics"
  - "linux-foundation/introduction-to-kubernetes-lfs158"
  - "youtube-techworld-with-nana/kubernetes-tutorial-for-beginners"
  - "docker/get-started"
updated: 2026-11-03
---

Lesson 1 of the Kubernetes and GitOps track. It supports the Master Developer module on infrastructure. It assumes you know what a container image is (CI/CD lesson 2) and what a cloud region and a managed service are (Cloud platforms lessons 1 and 2).

## 1. Why this matters

Sooner or later an agent will say "I will deploy this to Kubernetes", or a customer will ask whether you "run on Kubernetes". It is easy to nod along. Kubernetes is also easy to over-use: it is powerful, and it brings real cost in learning, security and attention. A product manager who understands it a little can tell when it fits, when it is too much, and when a proposed change is dangerous.

You will not become a cluster administrator here. You will learn the handful of ideas that make every manifest and every GitOps tool readable.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Whether Kubernetes is worth its cost for this product, how much availability is needed, who may change production | Drafting manifests, explaining unfamiliar objects, comparing a managed cluster with simpler options | Reading the proposal with the five questions, asking for the failure story, checking that it matches the cloud design | Operations (who runs it), security (who can reach it), finance (what it costs to keep running), architecture (fit with the rest) |

## 2. Key ideas, explained

### The problem Kubernetes solves

A container (see CI/CD lesson 2) runs one piece of software. A real product needs many containers, several copies of each for safety, spread across more than one machine, restarted when they fail, updated without downtime, and connected to each other. Doing that by hand is slow and error-prone. **Kubernetes** automates it. The official [Kubernetes overview](https://kubernetes.io/docs/concepts/overview/) describes it as a platform for managing containerised workloads, with automatic rollout and rollback, self-healing, scaling and service discovery.

### The parts, in one table

| Part | Plain words | Analogy |
|---|---|---|
| **Cluster** | The whole system: a set of machines managed together | The whole restaurant |
| **Node** | One machine (real or virtual) in the cluster that runs your containers | A kitchen station |
| **Control plane** | The brain that decides what runs where and watches that it stays true | The head chef and the order board |
| **Pod** | The smallest unit: one or more containers that run together on one node | One plate being prepared |
| **Deployment** | A rule: "keep three copies of this pod running, and update them safely" | A standing order |
| **Service** | A stable address that sends traffic to whichever pods are healthy | The pass where plates go out |
| **Ingress** | A rule that lets outside traffic reach a service, such as by web address | The front door |
| **Namespace** | A named section of the cluster, used to separate teams or environments | A section of the restaurant |
| **ConfigMap, Secret** | Settings, and sensitive settings, kept apart from the image | The recipe card, and the safe |

The tutorial [Learn Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) walks through creating a cluster, deploying an app, exposing it, scaling and updating it, in the browser or on a laptop.

### Pods are disposable

A pod is not a pet. Pods are created, deleted and replaced all the time, and each new pod gets a new address. That is why you do not send traffic to a pod directly. You send it to a **service**, which keeps track of the current healthy pods. It is also why anything you need to keep, such as customer records, must live outside the pod, in a database or storage that is designed to persist. A frequent agent mistake is to store data on a pod's own disk.

### The control loop: declare, compare, correct

This is the idea to remember. You do not tell Kubernetes what to do step by step. You **declare the state you want**: "three copies of sign-up, version 1.4". Kubernetes continuously compares **desired state** with **actual state**. If one pod crashes, actual is two and desired is three, so it starts another. If you change the version, it replaces pods one at a time. This repeat-forever loop is what "self-healing" means.

Two consequences matter to you.

1. **The description is the product.** What you declared decides what runs. If the description is wrong, Kubernetes will faithfully maintain the wrong thing. So the description needs review, as code does.
2. **A manual change to the live system fights the loop.** If someone edits a live setting by hand, the system may keep it, or revert it, depending on what manages it. Either way, the written description and reality no longer agree. That mismatch is called **drift**, and lesson 3 makes it the central problem.

### Managed or self-run

You can run Kubernetes yourself or buy it as a managed service from a cloud provider. A managed service runs the control plane for you and handles upgrades of the brain, though you still own your workloads, your settings, who has access, and the nodes in some models. For a small team the managed service is almost always the right choice. Running your own control plane is a job for specialists.

### When not to use Kubernetes

Kubernetes is not a goal. Compare it with simpler options from the Cloud platforms track: a platform service that runs your code, a serverless function, a managed container service. These need less knowledge and fewer people. Kubernetes starts to pay for itself when you have many services, need fine control over how they run and connect, have a team that can operate it, or must avoid being tied to one provider's platform service. A single small website does not need it. Ask: **what would we lose by using the simpler option?** If the honest answer is "nothing yet", choose the simpler option and revisit later.

### What it costs you

- **Learning.** The vocabulary is large.
- **Operations.** Clusters need upgrades, monitoring, and someone on call.
- **Security surface.** More moving parts, more places to misconfigure. The Kubernetes [security checklist](https://kubernetes.io/docs/concepts/security/security-checklist/) is long for a reason; lesson 4 covers the basics.
- **Money.** A cluster runs, and bills, whether or not it is busy.

### Five questions for any proposal

1. **Why Kubernetes, rather than something simpler?**
2. **Managed or self-run, and by whom?**
3. **How many copies of each service, and what happens when a node fails?**
4. **Where does the data live, and is it outside the pods?**
5. **Who can change what runs, and how is each change reviewed?**

The fifth question is where GitOps comes in.

## 3. Step by step: read a proposal

1. **Get the proposal** from an agent in plain words: components, copies, data, access.
2. **Underline each Kubernetes word** you do not know. Ask the agent to define each in one line.
3. **Draw the picture:** which pods, which services, what faces the internet.
4. **Check the data:** is anything important stored on a pod?
5. **Check the copies:** for each service, how many, and spread over how many zones?
6. **Ask the simpler-option question** and write the answer.
7. **Ask who may change production,** and by what route.
8. **Write the decision** and what would change your mind.
9. **Record it** in a decision record in git.

## 4. Worked example: TrailMug

TrailMug has a static site and a sign-up function. An agent, asked for "a robust deployment", proposes a managed Kubernetes cluster with three nodes, a deployment per service, an ingress, and a separate namespace for staging. Maya applies the five questions.

**Why Kubernetes?** The agent answers "scalability and portability". Maya asks what scale she needs: forty café owners for the first six months. She asks what the simpler option would be: a platform service plus a serverless function, as designed in Cloud platforms lesson 2. The agent admits it would work for now. Maya writes the decision: "Not Kubernetes yet. Revisit when we have more than five services, or a customer needs something the platform service cannot do." The decision record names the review date.

Then she runs the exercise as a learning task on a throwaway local cluster, with the agent explaining each object, because in six months she may need the knowledge, and because a later partner project already runs on Kubernetes. In her notes, the pod-and-service model makes sense after she watches a pod get deleted and replaced in seconds. She also sees that the sign-up data the agent put on the pod's own disk vanished when the pod was deleted. She records that as the reason data lives in a managed database.

The lesson is that understanding Kubernetes made her better at saying no, and at reading the proposal she did accept for the partner project.

## 5. Working with AI agents on this

**What the PDM decides:** whether Kubernetes fits, managed or not, availability needed, who can change production.

**Delegate:** explaining objects, drafting a proposal, comparing options, drawing the picture in text, setting up a throwaway practice cluster.

**Verify:** apply the five questions; delete a pod in a practice cluster and watch it return; check that no data lives on a pod; ask for the simpler option every time.

**Prompt to test whether Kubernetes fits:**

```text
We need to run <describe the product parts and expected users>. Compare three
options: (1) a platform service or serverless, (2) a managed container service,
(3) managed Kubernetes. For each: what we must learn and operate, the failure
story when one machine fails, rough cost drivers (no prices), and the point at
which the next option up becomes worth it. Recommend one for now and say what
would change the recommendation. State assumptions.
```

**Prompt to explain a manifest to a manager:**

```text
Explain this Kubernetes file to a product manager in plain words, object by object:
what it creates, how many copies, what it exposes to the internet, where data
would go, and what could go wrong. Do not change the file. Mark anything you are
unsure about.
<paste manifest>
```

**Disclose** AI help on any design in the merge request that holds the decision.

## 6. Common mistakes and how to avoid them

- **Using Kubernetes because it is fashionable.** Fix: ask for the simpler option and what you lose.
- **Storing data on a pod.** Fix: managed database or persistent storage.
- **Running your own control plane.** Fix: managed service.
- **Treating pods as permanent.** Fix: talk to services, expect replacement.
- **Not knowing who can change production.** Fix: question five, answered in writing.
- **Believing "self-healing" covers everything.** Fix: it restarts what it was told to keep; it does not fix a wrong description.
- **Practising on a shared or production cluster.** Fix: a throwaway cluster only.

## 7. Practice

**Deliverable in git:** `specs/k8s-01.md`, `briefs/k8s-01.md`, `reviews/k8s-01.md`, and `decisions/D-kubernetes-fit.md`.

1. Pick a product of your own, or TrailMug, and describe its parts and expected users in a short note.
2. Write a spec for a three-option comparison with at least five acceptance criteria: assumptions stated, failure story per option, cost drivers without prices, a recommendation, and a "what would change it" line.
3. Brief an agent to produce it. Plan first.
4. Verify with the five questions. Record each answer in `reviews/k8s-01.md`.
5. Optional hands-on: on a throwaway local cluster, deploy a sample app, delete a pod and watch it return. Note what happened. Use no real data.
6. Record one place the agent was too confident.
7. Write the decision record with a review date. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I can say what a pod, deployment and service are.
- [ ] I can describe declare, compare, correct.
- [ ] I asked for the simpler option and wrote the answer.
- [ ] No important data lives on a pod.
- [ ] I know who can change production, and how.
- [ ] My decision has a review date.

## 9. Further learning

Start with the Kubernetes overview and then the interactive basics tutorial. The free Linux Foundation course gives a structured version, and the long video is a good companion if you like to watch a whole build. Docker's guide is useful if containers still feel new. After this lesson, move to reading manifests.
