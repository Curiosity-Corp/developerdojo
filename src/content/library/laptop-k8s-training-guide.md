---
title: Laptop Kubernetes training guide
description: Run your app on your own laptop the same way it runs in production, using GitOps, containerd and local Kubernetes.
section: Platform
order: 1
---

*The closest one-to-one match to a real production setup: minimal but correct.*

### Goal

Enable any engineer to run their app **the same way it will run in a production cluster**, using GitOps, containerd workflows, and local Kubernetes.

---

## Install these tools (laptop)

| Tool                                  | Purpose                           |
| ------------------------------------- | --------------------------------- |
| **Rancher Desktop** (containerd mode) | Local Kubernetes runtime (k3s)    |
| **kubectl**                           | Manage the cluster                |
| **Helm**                              | Deployment packaging / templating |
| **Git**                               | Version control                   |
| **Visual Studio Code** (or JetBrains) | Editor, YAML plugins recommended  |

**Cluster config**

* Enable **containerd**
* Enable **Traefik ingress**
* Create a **local-path** storage class if it is not the default

---

## Cluster services to deploy

| Component               | Why                            |
| ----------------------- | ------------------------------ |
| **cert-manager**        | TLS automation                 |
| **Traefik**             | Ingress + local DNS routing    |
| **Gitea**               | Local Git for the GitOps flow  |
| **Harbor** (no scanner) | Local image registry           |
| **Flux**                | Sync the cluster from Git      |
| **Kaniko Job template** | In-cluster builds (dev parity) |

---

## Dev workflow (hands-on)

1. Clone a service repo locally.
2. Write a **Deployment**, **Service**, and **Ingress** YAML.
3. Push the code to **Gitea**.
4. Flux syncs the configs and the app appears in the cluster.
5. Trigger Kaniko: the image builds, is pushed, and the deployment updates.
6. Test the app through the Traefik ingress URL.
7. Debug with `kubectl logs` and `kubectl describe`.

You are now working in the same execution model as a real production environment.

---

## What this teaches

| Skill              | Why it matters                   |
| ------------------ | -------------------------------- |
| Kubernetes basics  | Most modern services run here    |
| GitOps discipline  | No manual drift                  |
| OCI-native builds  | No Docker daemon assumptions     |
| TLS + ingress      | Every production service uses it |
| Registry workflows | Promotion + traceability         |
| YAML deployments   | You must speak the platform      |

---

## Completion criteria

You can:

- Deploy your app through GitOps.
- Route traffic through Ingress + TLS.
- Build images inside Kubernetes and push them to Harbor.
- Understand namespaces, PVCs, events, and rollout status.
- Debug failed deployments without searching for an hour.

At that point you are **DevOps compatible** and can work confidently on a production platform.

---

## Final philosophy

> **Build on your laptop, run in the cluster, no special casing.**
> If it works here, it will work in production.
