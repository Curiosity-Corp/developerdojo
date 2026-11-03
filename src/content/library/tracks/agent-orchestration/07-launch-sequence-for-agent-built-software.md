---
title: "Launch Sequence for agent-built software"
description: "The staged gates from commit to customer for software that agents write: one shared pipeline, included by every product, with security, supply-chain, policy and release gates and evidence at each step."
section: "Agent orchestration and policy administration"
order: 7
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Describe the stages from commit to customer, and what each gate protects"
  - "Build one shared pipeline that many products include, pinned to a version"
  - "Run source, secret and dependency checks, and a policy check, on every merge request"
  - "Separate build from release, with a human-approved step where it belongs"
  - "Keep evidence of every gate, and roll out a pipeline change across products safely"
resources:
  - "gitlab/ci-includes"
  - "gitlab/ci-job-rules"
  - "gitlab/sast"
  - "gitlab/secret-detection"
  - "gitlab/merged-results-pipelines"
  - "gitlab/merge-trains"
  - "opengitops/opengitops"
  - "openssf/slsa"
prerequisites:
  - "tracks/agent-orchestration/04-hooks-guards-and-gates"
  - "iac-gitops-and-drift"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration". **Time:** about three hours. **Needs:** your repository from lesson 6 and a GitLab or GitHub project. The pipeline lab runs on free tiers and needs no model.

## 1. Why this matters

When agents write most of the code, the **pipeline is the quality bar**. You cannot read every line. What you can do is require that every change prove itself, on its own merge request, before it can reach a customer. If the proof is the same for every product, you can reason about all of them at once.

The pipeline has a second job in a command chain. The guards from lesson 4 run where the session runs, and a determined mistake can slip past them. The pipeline runs at the shared host, where no session can reach it. It is the last gate, and the one that also protects you from changes **people** make.

We call the whole staged path **Launch Sequence**: source assurance, supply chain, artifact, deployment, governance and go-to-market, each a gate, each leaving evidence. "Done" does not mean the code compiles. It means every stage is green.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| Which gates are mandatory, what blocks a release, who presses the release button | Writing and updating the pipeline, fixing failing jobs, writing the tests the gates need | That a deliberately bad change is stopped, and that evidence is kept | Security (scans, secrets), operations (deployment), compliance (evidence), engineering (tests) |

## 2. Key ideas, explained

### The stages

Each stage answers one question, and a failure stops the line.

| Stage | Question | Typical gate |
|---|---|---|
| **Source assurance** | Does the code do what it should, and is it clean? | Tests, lint, static analysis (SAST), secret detection |
| **Supply chain** | Do we know what we depend on, and is any of it known-bad? | Lockfile install, dependency audit, a record of what went in |
| **Artifact** | Does it build, and is what we ship exactly what we tested? | Build once, keep the output, sign or record it |
| **Governance** | Do our written rules still hold? | A policy check on the policy and org files |
| **Release** | May this reach customers? | Default branch only, every earlier gate green, a person presses the button where the risk calls for it |
| **After release** | Did it work, and do customers know? | Health checks, rollback plan, announcement |

Notice the order: cheap, fast checks first, so a bad change fails in a minute and not in twenty. And notice that **build and release are separate**. Building proves it can be made. Releasing is a decision.

### One pipeline, many products

If each product has its own hand-written pipeline, each drifts. One has secret detection, one forgot. A change to the rules means editing twenty files. The cure is **one shared pipeline** in one project, which each product **includes** instead of copying. GitLab's [`include`](https://docs.gitlab.com/ci/yaml/includes/) keyword does this, and GitHub's [reusable workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows) do the same.

Two details make this safe:

1. **Pin the version.** A product includes the shared pipeline at a tag (`ref: v3`), not at the moving default branch. A change to the shared pipeline is released as a new version, tested on one product first, then rolled out. This is the same discipline as any dependency.
2. **Ownership.** The shared pipeline is a decision domain (lesson 3). One seat owns it. A product Commander may add jobs, but it cannot remove a mandatory gate.

### Pipelines for the right events

A pipeline should run when a **merge request** changes, and on the **default branch** when it merges, and not twice for the same push. GitLab's [job rules](https://docs.gitlab.com/ci/jobs/job_rules/) and `workflow:rules` control this, and the example below shows the usual guard against duplicates. Then the setting from lesson 4, "pipelines must succeed", turns the result into a gate.

Where your plan has them, [merged results pipelines](https://docs.gitlab.com/ci/pipelines/merged_results_pipelines/) test the merge request combined with the target branch, and [merge trains](https://docs.gitlab.com/ci/pipelines/merge_trains/) queue merges so each is tested on top of the ones ahead. Those are Premium features; the free-tier substitute is the Chief's discipline from lesson 4: rebase, wait for green, merge one at a time.

### Free-tier realities

A pipeline for an open or small team can be strong with free parts. GitLab's free tier includes [SAST](https://docs.gitlab.com/user/application_security/sast/) and basic [secret detection](https://docs.gitlab.com/user/application_security/secret_detection/). Dependency scanning is a higher tier, so the free substitute is your package manager's own audit (`npm audit`). Say in your pipeline where a gate is a substitute, so no one believes it is stronger than it is. GitHub offers equivalents through Actions, code scanning and dependency review; check which are free for your repository type.

### GitOps: what runs is what git says

Deployment should follow the same rule as everything else: **git is the source of truth**. The desired state of the running system is a file in git, and a controller reconciles reality to it. A person or a session does not change production by hand. The [OpenGitOps principles](https://opengitops.dev/) put it as declarative, versioned, pulled automatically and continuously reconciled. For agents, this has a safety benefit: the only way to change production is a merge request that passed every gate. Our own [IaC and drift lesson](/library/iac-gitops-and-drift) goes deeper.

### Evidence

Each gate should leave something you can show later: test reports, scan results, the build output, the policy check log, and a record of who pressed release. The supply-chain framework [SLSA](https://slsa.dev/) is a useful vocabulary: it describes levels of assurance that an artifact really came from the source and build you think it did. You do not need the top level. You need to know which level you claim, and to keep the records that back it.

### Rolling out a change to the pipeline

Changing a shared pipeline is risky, because it touches every product. The routine: change it in a branch, release it as a **new tag**, point one low-risk product at the new tag, watch it, then move the others, **one at a time**. If it breaks something, fix forward with the next tag. Do not move the tag.

## 3. Step by step: build the shared pipeline

1. **List the gates** you need for every product, in the order of the stages.
2. **Create a project** for the shared pipeline. Make one seat its owner.
3. **Write the pipeline** with the rules for when it runs, the stages and the jobs.
4. **Add substitutes** where a gate needs a higher plan, and label them.
5. **Tag a version.**
6. **Include it** from a product, pinned to the tag.
7. **Break the product on purpose** (a failing test, a fake secret, a bad policy file) and confirm each gate stops it.
8. **Set the release step** to the default branch, manual where the risk calls for it.
9. **Collect the evidence** as job artifacts and reports.
10. **Roll a change out** to one product first.

## 4. Worked example: TrailMug

TrailMug has three Node products. Maya's shared pipeline lives in its own project, owned by `cmd-ops`. Here is the whole file:

```yaml
# One pipeline for every TrailMug product. Products include it; they do not copy it.
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS
      when: never
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

stages: [preflight, source-security, supply-chain, build, policy, release]

default:
  image: node:24-alpine
  interruptible: true

include:
  - template: Jobs/SAST.gitlab-ci.yml
  - template: Jobs/Secret-Detection.gitlab-ci.yml

# Gate 1, source assurance: does the code do what it should, and is it clean?
test:
  stage: preflight
  script:
    - npm ci            # fails if package-lock.json and package.json disagree
    - npm test

sast:
  stage: source-security

secret_detection:
  stage: source-security

# Gate 2, supply chain: free substitute for dependency scanning, which needs a higher plan.
dependency-audit:
  stage: supply-chain
  script:
    - npm ci
    - npm audit --audit-level=high

# Gate 3, artifact: does it build, and is what we ship exactly what we tested?
build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]
    expire_in: 1 week

# Gate 4, governance: do the written policies still hold?
policy-check:
  stage: policy
  image:
    name: openpolicyagent/conftest:v0.71.1
    entrypoint: [""]
  script:
    - conftest test policy/standing-policies.yaml --policy policy --namespace policyformat
    - conftest test org/org-map.yaml --policy policy --namespace orgmap
  rules:
    - exists:
        - policy/standing-policies.yaml

# Gate 5, release: default branch only, after every gate above, and a person presses the button.
pages:
  stage: release
  script:
    - mv dist public
  artifacts:
    paths: [public]
  environment:
    name: production
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
```

Each product then has a tiny `.gitlab-ci.yml`:

```yaml
include:
  - project: trailmug/pipeline
    ref: v1
    file: node-site.yml
```

Three things are visible in this setup. The pipeline begins with the cheapest jobs. The `policy-check` job runs the same Conftest checks as lessons 2 and 3, so the org map and standing policies cannot rot unnoticed. And the release job is **manual on the default branch**: the pipeline has proven the build, and a person (or a Commander with that autonomy level) decides to ship.

On GitHub Actions, the same shape is a reusable workflow in a shared repository, called from each product with `uses: trailmug/pipeline/.github/workflows/node-site.yml@v1` and a required status check on the protected branch.

Maya's first rollout: she changed the audit level from `high` to `moderate`, tagged `v2`, pointed the least important product at it, watched it for two days, and moved the others after. One product failed with a known issue in a dependency. The fix was forward: a new tag with an exception that recorded why and when it would be removed.

## 5. Working with AI agents on this

What to delegate: drafting the pipeline from your gate list, fixing failing jobs, writing the tests a gate needs, and writing the rollout checklist. What you must do yourself: decide which gates are mandatory, what blocks release, who presses the button, and which exceptions are acceptable.

A prompt you can adapt:

```text
Here is my shared pipeline file and my list of mandatory gates. For each gate, say whether
a failing change would really be stopped, quoting the line. Then list three bad changes a
product could make that no gate here would catch. Do not edit the file.
```

Check: try each bad change it names. Run the whole pipeline on a branch with a deliberate failure and see the exact job that stops it.

Disclose: "AI use: pipeline draft and gap list; I decided gates, exceptions and release rules."

**Where this sits on the ladder.** A shared pipeline is a gate that agents cannot talk their way past. It is the strongest piece of rung four.

## 6. Common mistakes and how to avoid them

- **Copying the pipeline into each product.** They drift. Include it.
- **Including the moving default branch.** One change breaks every product. Pin a tag.
- **Treating a substitute as the real thing.** Label it.
- **Building and releasing in one step.** Keep release a decision.
- **Skipping a gate "just this once".** Fix the gate, or write the exception with a date.
- **Letting a product remove a mandatory job.** The shared pipeline is a domain with one owner.
- **No evidence kept.** Keep reports as artifacts.
- **Changing production by hand.** Everything through a merge request.

## 7. Practice: a shared pipeline for two products

**Deliverable:** a shared pipeline project, two small products that include it at a pinned tag, captured results of three deliberate failures, and a rollout note. No model is needed. Use GitLab (free) or the GitHub equivalent.

1. **Create two tiny Node products** with `npm test` and `npm run build` scripts (a one-page site is enough), each with `package-lock.json`.
2. **Create the pipeline project** and save the file above as `node-site.yml`. Lint it with the CI lint tool of your host.
3. **Tag `v1`** and include it from both products, as shown.
4. **Run it** on a merge request in each product. Read each job.
5. **Break it three times**, one at a time, in a branch: make a test fail; commit a made-up access key (the letters `AKIA` followed by sixteen random capitals, which the scanner treats as a key) in a file, then remove it; add an invalid line to `policy/standing-policies.yaml`. Confirm each is stopped by the right job, and capture the job names.
6. **Check the settings** from lesson 4: protected default branch, pipelines must succeed.
7. **Try the release job.** On the default branch, confirm that it waits for a manual press.
8. **Make a change** to the shared pipeline: for instance add `--audit-level=moderate`. Tag `v2`, move one product, watch, then move the other.
9. **Write a one-page rollout note:** what changed, where first, how long, how to roll forward.
10. **Log the decisions** with dates: mandatory gates, who owns the pipeline, who releases.

Commit with a message such as `Add shared pipeline, pinned include and rollout note`.

**Check:** a screenshot or log of three failures stopped by the right jobs, and both products green on `v2`.

**Stretch:** write the GitHub Actions reusable-workflow version and compare how each host expresses the same gates.

## 8. Checklist

- [ ] I can list the stages and the question each answers.
- [ ] One pipeline is included by every product, pinned to a tag.
- [ ] Source, secret, dependency and policy checks run on each merge request.
- [ ] Substitutes for paid features are labelled.
- [ ] Build and release are separate, and release is controlled.
- [ ] A deliberate bad change was stopped by the right job.
- [ ] Evidence is kept as artifacts.
- [ ] A pipeline change was rolled out to one product first.
- [ ] I recorded my AI use.

## 9. Further learning

GitLab's documentation on includes, job rules, SAST, secret detection, merged results pipelines and merge trains covers the mechanics used here. OpenGitOps gives four plain principles for deployment, and SLSA is the free vocabulary for supply-chain assurance. Check each plan's notes before relying on a feature.

**Next:** the capstone. The final lesson in this track (`/library/tracks/agent-orchestration/08-capstone-run-a-small-agent-command-chain/`) puts everything together for TrailMug.
