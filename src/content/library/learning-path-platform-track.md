---
title: "Learning path: platform track"
description: "Free documentation for the Master Developer rank: delivery from git, licences, infrastructure as code and service management."
section: "Learning path"
order: 2
---

These items support the [Master Developer](/library/master-developer-overview) pages. Read the official docs for the ideas, then practise in a small project of your own. Hours are estimates. Links were checked when this list was made.

## Week 1

### Platform: IDP and catalog

- [What is Backstage?](https://backstage.io/docs/overview/what-is-backstage) — Backstage (CNCF). Docs, about 0.5 h. Shows the developer-portal idea, so you can say fairly when a portal is worth running.
- [CNCF Cloud Native Landscape](https://landscape.cncf.io/) — CNCF. Reference, about 0.5 h. A map of open source cloud tools. A good place to search for rung (a) of the ladder.
- [Renovate documentation: overview](https://docs.renovatebot.com/) — Renovate (Mend). Docs, about 0.5 h. How a bot proposes dependency and upstream updates.

### GitOps

- [OpenGitOps: the four principles](https://opengitops.dev/) — OpenGitOps (CNCF). Docs, about 0.5 h. The short, vendor-neutral definition of GitOps: declarative, versioned, pulled automatically, continuously reconciled.
- [Argo CD documentation: overview](https://argo-cd.readthedocs.io/en/stable/) — Argo CD project. Docs, about 0.5 h. The official guide to a popular tool that delivers applications from git to a cluster.

### Platform: registry and security

- [Harbor documentation](https://goharbor.io/docs/) — Harbor (CNCF). Docs, about 1 h. How a container registry stores, scans and signs images.
- [DefectDojo documentation](https://docs.defectdojo.com/) — DefectDojo. Docs, about 1 h. How security findings from many scanners are gathered in one place.

## Week 2

### OSS and licences

- [Choose a License](https://choosealicense.com/) — GitHub (choosealicense.com). Reference, about 0.5 h. A plain summary of the common open source licences and what each lets you do.
- [Open Source Initiative: approved licences](https://opensource.org/licenses) — Open Source Initiative. Reference, about 0.5 h. The official list of licences that count as open source. Source-available licences are not on it.
- [SPDX License List](https://spdx.org/licenses/) — SPDX (Linux Foundation). Reference, about 0.5 h. The standard short ids (MIT, Apache-2.0, AGPL-3.0-only) used in decision records and licence checks.
- [Open Source Guides: legal side of open source](https://opensource.guide/legal/) — GitHub Open Source Guides. Article, about 0.5 h. A friendly guide to licences, trademarks and what contributing means.
- [REUSE: licence and copyright information in every file](https://reuse.software/) — FSFE. Docs, about 0.5 h. A simple convention and tool for marking the licence of each file, so a scan can read it.
- [SPDX: what is an SBOM and the specification](https://spdx.dev/) — SPDX (Linux Foundation). Docs, about 1 h. The open standard for the software bill of materials that a pipeline can produce.
- [OpenSSF Scorecard](https://scorecard.dev/) — OpenSSF. Tool, about 0.5 h. An automatic health check of an open source project. A fair input to a scorecard.
- [Trivy documentation](https://trivy.dev/latest/docs/) — Aqua Security (open source). Docs, about 1 h. A scanner for vulnerabilities, licences and bills of materials that a pipeline can use.

## Week 3

### GitOps

- [Argo CD: automated sync policy (prune and selfHeal)](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/) — Argo CD project. Docs, about 0.5 h. Explains the two switches that make git the only way to change a cluster.
- [Argo CD: getting started](https://argo-cd.readthedocs.io/en/stable/getting_started/) — Argo CD project. Docs, about 1.5 h. Walks through an Application from first sync to a diff.
- [External Secrets Operator documentation](https://external-secrets.io/latest/) — External Secrets. Docs, about 1 h. How secrets come from a vault into a cluster, so no secret lives in git.
- [SOPS documentation](https://getsops.io/docs/) — SOPS (CNCF). Docs, about 0.5 h. How a file can be committed encrypted, with only the values hidden.

### IaC

- [Terraform documentation](https://developer.hashicorp.com/terraform/docs) — HashiCorp. Docs, about 1 h. The reference for declaring cloud resources as code.
- [Terraform tutorials (HashiCorp Developer)](https://developer.hashicorp.com/terraform/tutorials) — HashiCorp. Course, about 6 h. Free, hands-on tutorials: state, modules, plan and apply.
- [OpenTofu documentation](https://opentofu.org/docs/) — OpenTofu (Linux Foundation). Docs, about 1 h. The open source fork of Terraform. Same language, open licence.
- [Kustomize: official guide](https://kubectl.docs.kubernetes.io/references/kustomize/) — Kubernetes SIGs. Docs, about 1 h. Base and overlay manifests without templates.
- [Helm documentation](https://helm.sh/docs/) — Helm (CNCF). Docs, about 1.5 h. The package manager for Kubernetes. Know it, because many upstream projects ship charts.

### Patch-forks

- [Renovate: custom regex manager](https://docs.renovatebot.com/modules/manager/regex/) — Renovate (Mend). Docs, about 1 h. How Renovate can read a pin file and open the update merge request.

## Week 4

### ITIL and service management

- [ITIL (AXELOS / PeopleCert): about ITIL 4](https://www.axelos.com/certifications/itil-service-management) — PeopleCert / AXELOS. Docs, about 0.5 h. The owner's overview of the ITIL 4 framework and its practices.
- [GitLab merge trains](https://docs.gitlab.com/ci/pipelines/merge_trains/) — GitLab Docs. Docs, about 0.5 h. How GitLab tests each merge request on top of the queue before it merges. Part of change enablement.
- [GitLab Code Owners](https://docs.gitlab.com/user/project/codeowners/) — GitLab Docs. Docs, about 0.5 h. How an approver rule in git plays the role of a change advisory board.

### SRE and service levels

- [Google SRE book: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) — Google SRE. Article, about 1 h. Free chapter on indicators, objectives and agreements. A base for service level sheets.
- [Google SRE book: Embracing Risk (error budgets)](https://sre.google/sre-book/embracing-risk/) — Google SRE. Article, about 1 h. Why 100 percent is the wrong target, and how an error budget turns reliability into a decision.
- [Google SRE book: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) — Google SRE. Article, about 0.5 h. How to write a blameless review. A base for incident reviews.

### Patch-forks

- [Open Source Guides: how to contribute (upstream PRs)](https://opensource.guide/how-to-contribute/) — GitHub Open Source Guides. Article, about 0.5 h. How to send a patch upstream so a patch set shrinks over time.

### GitOps

- [CloudNativePG documentation](https://cloudnative-pg.io/documentation/current/) — CloudNativePG (CNCF). Docs, about 1 h. How PostgreSQL clusters can be declared, backed up and recovered from git.
