---
title: "Reading manifests"
description: "Read a Kubernetes manifest the way you read a pipeline: what runs, how many, with what limits, how health is checked, which settings are secret and who can reach it."
section: "Kubernetes and GitOps"
order: 2
track: "kubernetes-and-gitops"
level: "core"
duration: "90 min"
outcomes:
  - "Read a deployment and a service manifest and say what they do"
  - "Spot missing resource limits, missing health checks and risky settings"
  - "Explain how config and secrets should be kept apart from images"
  - "Direct an agent to write a manifest to a spec and verify it with a checklist"
prerequisites:
  - "the-way-five-rules"
resources:
  - "kubernetes/workloads"
  - "kubernetes/configure-probes"
  - "kubernetes/resource-management-for-pods-and-containers"
  - "kubernetes/secrets"
  - "helm/using-helm"
  - "kubernetes/kubectl-book"
updated: 2026-11-03
---

Lesson 2 of the Kubernetes and GitOps track. It supports the Master Developer delivery spine, stage "deployment". Lesson 1 should come first.

## 1. Why this matters

A **manifest** is a file that declares what you want Kubernetes to run. It is the thing an agent will write, change and propose in a merge request. If you can read one, you can judge what the agent did. If you cannot, you are approving a diff you do not understand, and with infrastructure that is how outages and breaches start.

A manifest is also a very good thing to review, because it is short, structured and has a small set of common faults. This lesson gives you the reading method and the fault list.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| How many copies, how much capacity is reserved, what a healthy service means, what is exposed | Writing and changing manifests, explaining a diff, templating for several environments | Reading with the checklist below, comparing the diff to the spec, checking that nothing secret is in the file | Operations (capacity and health), security (exposure, secrets), finance (what the limits cost), engineering (what "healthy" means in the code) |

## 2. Key ideas, explained

### The shape of every manifest

Every Kubernetes object is a YAML file with the same four top-level parts.

| Part | What it says |
|---|---|
| `apiVersion` and `kind` | What type of object this is (Deployment, Service, and so on) |
| `metadata` | Its name, namespace and labels |
| `spec` | What you want: the desired state |
| `status` | Written by Kubernetes, not by you: the actual state |

You write `spec`. Kubernetes fills `status`. The [Workloads](https://kubernetes.io/docs/concepts/workloads/) documentation explains the main kinds.

### A deployment, read line by line

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: signup
  namespace: trailmug
  labels:
    app: signup
spec:
  replicas: 3
  selector:
    matchLabels:
      app: signup
  template:
    metadata:
      labels:
        app: signup
    spec:
      containers:
        - name: signup
          image: registry.example.org/trailmug/signup@sha256:ab12...
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              memory: "256Mi"
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
          livenessProbe:
            httpGet:
              path: /healthy
              port: 8080
          envFrom:
            - configMapRef:
                name: signup-config
          securityContext:
            runAsNonRoot: true
            allowPrivilegeEscalation: false
```

Reading it, as questions and answers:

- **What runs?** The container image named under `image`. Is it pinned by digest (`@sha256:`) as CI/CD lesson 2 taught, not a floating tag like `latest`?
- **How many?** `replicas: 3`. Three copies. What happens if two nodes fail?
- **How much does it reserve and how much may it use?** `requests` is what the scheduler sets aside, `limits` is the ceiling. The [resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) page explains the units: `100m` means a tenth of a processor core, `Mi` means mebibytes of memory.
- **How is health checked?** `readinessProbe` says when a pod may receive traffic. `livenessProbe` says when a pod is stuck and must be restarted. See [Configure probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).
- **Where do settings come from?** `envFrom` reads a ConfigMap. No settings or secrets are inside the image.
- **Does it run safely?** `runAsNonRoot` and `allowPrivilegeEscalation: false` are the two lines to look for. They limit damage if the software is compromised.

### The service that goes with it

```yaml
apiVersion: v1
kind: Service
metadata:
  name: signup
  namespace: trailmug
spec:
  selector:
    app: signup
  ports:
    - port: 80
      targetPort: 8080
```

The service finds pods whose labels match `app: signup` and sends traffic to the healthy ones. If the labels in the service and the deployment do not match, the service has no pods and the product is silently down. That mismatch is one of the most common simple faults.

The type of service matters for exposure. The default keeps it inside the cluster. A `LoadBalancer` type asks the cloud for a public address. An **Ingress** routes web traffic by name. Always ask: **which of these are reachable from the internet, and should they be?**

### Requests and limits

Without `requests`, the scheduler cannot place pods sensibly. Without memory `limits`, one buggy pod can eat a whole node. With CPU limits too tight, the service slows. A sensible starting point is requests close to typical use, and a memory limit with some headroom. Do not guess; measure (the observability track covers how). The cost link is direct: requests decide how many nodes you need.

### Probes: readiness and liveness

A **readiness probe** answers "can I take traffic now?". A pod that is starting up or temporarily overloaded fails readiness and is taken out of rotation without being killed. A **liveness probe** answers "am I stuck?". If it fails, Kubernetes restarts the pod. Two common faults:

- **No probes at all.** Kubernetes assumes healthy as soon as the process starts, and sends traffic to a pod that is not ready.
- **A liveness probe that checks a dependency**, such as the database. When the database is slow, every pod is declared stuck and restarted together, which makes the outage worse.

### Config and secrets

Keep settings **out of the image** (the Twelve-Factor idea from the Cloud platforms track). Non-sensitive settings go in a **ConfigMap**. Sensitive ones go in a **Secret**. A Secret in Kubernetes is only encoded, not encrypted, by default. Anyone who can read the Secret object can read the value. The [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) page explains the protections to add: restrict who can read them, enable encryption at rest, and prefer an external secret manager.

The absolute rule: **no real secret value appears in a manifest in git.** If an agent writes `password: hunter2`, or a base64 string that decodes to a password, reject the change and rotate the value. Teams use sealed or encrypted secrets, or a controller that pulls from a secret manager, so that the file in git holds only a reference or an encrypted blob.

### Namespaces and labels

Namespaces separate environments or teams. Labels let objects find each other and let you group them for cost and ownership. A manifest with no `namespace` lands in the default one, which is a sign of carelessness. Ask for consistent labels: app name, owner, environment, and the issue that created it.

### Templating: Helm and Kustomize

Writing separate manifests for test and production leads to copy-paste errors. Two tools help. **Helm** packages manifests as a template with values; see [Using Helm](https://helm.sh/docs/intro/using_helm/). **Kustomize** layers small changes over a base, and is described in the [Kubernetes SIG CLI book](https://kubectl.docs.kubernetes.io/). For a reader, the question is the same: what is the final result, and where do the environment differences live? Ask the agent to **render** the final manifests so you can review the actual output, not just the template.

### The review checklist

| Check | Question |
|---|---|
| Image | Pinned by digest, from a source you trust? |
| Replicas | At least two for anything that matters? |
| Resources | Requests and a memory limit set? |
| Probes | Readiness present, liveness careful? |
| Security context | Non-root, no privilege escalation? |
| Config | Settings outside the image? |
| Secrets | No real value in the file? |
| Exposure | Only what must be public is public? |
| Namespace and labels | Present and consistent? |
| Matching | Service selector equals pod labels? |

## 3. Step by step: review a manifest change

1. **Read the spec** the change should satisfy.
2. **Read the file list.** Does it touch only what the spec names?
3. **Apply the checklist** to each changed object.
4. **For a template,** ask for the rendered output and check that.
5. **Check the diff** against the previous version: what changed in image, replicas, limits, exposure?
6. **Look for secrets** by eye and with a scanner.
7. **Verify matching:** labels and selectors.
8. **Ask for a failure story:** "if one node fails, what happens?"
9. **Approve or send back** with specific, checkable comments.

## 4. Worked example: TrailMug

For the partner project mentioned in lesson 1, Maya reviews a merge request that adds a new service. The spec said: "Two copies, reserve a small amount of memory, readiness check, only reachable inside the cluster, no secrets in the file."

She reads the file list: one deployment, one service, one ConfigMap. Good. She applies the checklist.

- **Image:** a tag `1.4`, not a digest. She comments: "Pin by digest, as the pipeline prints it."
- **Replicas:** `1`. The spec said two. Comment.
- **Resources:** requests present, no memory limit. Comment: "Add a memory limit."
- **Probes:** readiness present. Liveness checks `/db-ping`, which queries the database. She comments: "A slow database would restart every pod at once. Use a simple /healthy check."
- **Security context:** missing. Comment.
- **Secrets:** the ConfigMap contains `API_KEY: sk-test-12345`. She stops. The value is invented here, but in real life she would treat it as leaked: ask for removal, rotate the real value, and add a secret scan.
- **Exposure:** the service type is `LoadBalancer`. The spec said inside only. Comment.
- **Matching:** the service selects `app: signup` but pods are labelled `app: sign-up`. The service would have no pods.

Seven comments, each checkable. The agent fixes them, and she re-reads the new diff, not the old one. Two comments need a second round. She approves only when the checklist is clean and the preview shows two ready pods.

## 5. Working with AI agents on this

**What the PDM decides:** copies, capacity, health definition, exposure, which environment gets what.

**Delegate:** writing manifests from a spec, rendering templates, running a linter, explaining a diff line by line.

**Verify:** the checklist; rendered output; a secret scan; a failure story; and a check that the cluster state matches after sync (lesson 3).

**Prompt to write a manifest:**

```text
Write Kubernetes manifests for <service> to this spec: <paste spec>. Rules: pin the
image by digest <digest>, set requests and a memory limit, add readiness and a
simple liveness probe that does not call other services, run as non-root with
no privilege escalation, expose only inside the cluster, put settings in a ConfigMap,
and put no secret values in any file. Add namespace and labels app, owner, issue.
After the files, list each rule and where it is satisfied, and anything you assumed.
```

**Prompt for a review pass (you still review):**

```text
Review these manifests against this checklist: image pinned, replicas, requests and
limits, probes, security context, config outside the image, no secret values,
exposure, namespace and labels, selector matches labels. Output a table of
check, result, file and line. Do not edit anything. Mark what you cannot tell.
```

**Disclose** AI-written manifests in the merge request.

## 6. Common mistakes and how to avoid them

- **Floating image tags.** Fix: digest.
- **One replica for something important.** Fix: at least two, spread.
- **No limits or probes.** Fix: set them, and review.
- **A liveness probe that checks the database.** Fix: simple self-check only.
- **Secrets in manifests.** Fix: external or encrypted secrets, rotate any leak.
- **Public by accident.** Fix: ask about every service type and ingress.
- **Selector and label mismatch.** Fix: check the pair.
- **Reviewing a template instead of the output.** Fix: render.

## 7. Practice

**Deliverable in git:** `specs/k8s-02.md`, `briefs/k8s-02.md`, `reviews/k8s-02.md`, and a merge request with the manifests.

1. Choose a tiny service, or a sample app, for a throwaway cluster.
2. Write a spec with at least eight acceptance criteria from the checklist.
3. Brief an agent to write manifests. Plan first. Do not apply to any cluster yet.
4. Review with the checklist. Write each finding in `reviews/k8s-02.md`.
5. Ask the agent to fix; re-review the new diff.
6. Optional: apply to a throwaway cluster, then break one thing on purpose (a wrong label) and watch what happens.
7. Record the faults the agent made. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I read each object and can say what it does.
- [ ] Image is pinned by digest.
- [ ] Requests, a memory limit and probes are set sensibly.
- [ ] Containers run as non-root.
- [ ] No secret values in any file.
- [ ] Only intended services are exposed.
- [ ] Selectors match labels.
- [ ] I reviewed the rendered output of any template.

## 9. Further learning

Read the Workloads page for the objects, then the probes and resource pages when you review your first real file. The Secrets page is essential before you let anything sensitive near a cluster. Helm and Kustomize pages are for when you manage more than one environment.
