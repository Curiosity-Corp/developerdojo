---
title: "Security fundamentals"
description: "Know the threats that matter, keep secrets out of git, trust your dependencies carefully, and set the limits that keep agent work safe."
group: "engineering"
order: 6
icon: "shield-check"
level: "core"
skills: [security, ci-cd, ai-agents]
outcomes:
  - "Name the most common ways software is attacked and ask the questions that find them"
  - "Keep secrets out of git and know what to do when one leaks"
  - "Judge a dependency, a build and a release for supply chain risk"
  - "Set the permissions, gates and review rules that keep agent work safe, and verify them by trying to break them"
---

## In short

This track is for product managers, founders and developers who ship software. Agents may write the code. You will not become a security engineer. You will learn the common attacks and the questions that find them. You will keep secrets out of git. You will know what to do when one leaks. You will judge a dependency before you add it.

You will set limits that keep agent work safe. Then you will test that the limits hold. Agents can be tricked by text they read. A rule in a document is a hope. A rule in a pipeline or a permission is a fact. This track teaches the limits for one agent. The advanced track covers many agents.

### Key words

- **Secret:** A password, key or token. Never kept in git. Only its name is.
- **Supply chain:** Everything that goes into your software: other people's code, tools and build steps.
- **SBOM (software bill of materials):** A list of the parts inside software and their licences.
- **Least privilege:** Give a person or an agent only the access the job needs.
- **OWASP Top 10:** A public list of the most common kinds of weakness in software.
- **Prompt injection:** An instruction hidden in text that an AI agent reads and then follows.

**Security** is the work of making sure software does what you intend and nothing else, even when someone is trying to make it misbehave. It is not a department you hand things to at the end. It is a set of habits that runs through every decision, and for a product manager directing AI agents it comes down to a handful of questions asked at the right moments.

This track gives you **enough depth to direct and judge**. You will not become a security engineer. You will learn what the common attacks are, where secrets and dependencies go wrong, what a sensible build looks like, and how to bound what agents may touch.

## Who this is for

Product managers, founders and developers who ship software, directly or through agents. You should know what a merge request and a pipeline are. If not, start with [Git and GitLab](/library/tracks/git-and-gitlab) and [CI/CD](/library/tracks/ci-cd).

## What you will be able to do

- Name the families of weakness in the OWASP Top 10 and turn each into a question for a review.
- Say where a secret may live and where it may never live, and respond when one leaks.
- Check a dependency before it is added, and read the signals that a release was built the way it claims.
- Describe the risks that come with AI agents themselves, such as being tricked by text they read, and set limits that hold even if the agent is wrong.
- Direct an agent to run a security review and verify that the findings are real.

## The four lessons

1. **Threats and the OWASP Top 10.** Who attacks software, what they try, and the review questions that follow. You learn to read a threat in plain words and to write security acceptance criteria into a spec.
2. **Secrets and identity.** Passwords, keys and tokens: where they live, how they leak, how to find them, and what to do in the first hour after a leak. You also learn why an identity with narrow rights beats a shared key.
3. **Supply chain and dependencies.** Almost all of your product is code that other people wrote. You learn to judge a dependency, to read a software bill of materials, and to see what build provenance and signatures prove and do not prove.
4. **Securing agent work.** The risks that agents add, the limits that contain them, and how to review an agent's security claims. You learn where permissions, protected branches, gates and hooks bound an agent, and where the advanced track picks up.

Each lesson has a table for the product development manager: what you decide, delegate, verify, and which other disciplines own the detail. Each ends with an exercise in which you direct an agent and then verify its work, with your spec, brief and review notes in git.

## Why this matters now

Agents write code fast, read the whole internet, and act with the permissions you give them. That is useful and it changes the risk. Code arrives faster than anyone can read it closely. Agents can pull in dependencies that sound right but do not exist, or that are hostile. They can read an instruction hidden in a web page or an issue comment and follow it. They can leak a key they were handed. None of this is a reason to avoid agents. It is a reason to set the limits first, make them enforceable, and check that they hold.

The skill that carries across all four lessons is the same: **ask what could go wrong, write down the limit, and test that the limit holds.** A rule in a document is a hope. A rule in a pipeline, a permission or a protected branch is a fact.

## How this fits the program

The Master Developer program expects security checks to run on every merge request, secrets to stay out of git, and releases to be traceable to the change that made them. This track gives you the vocabulary to set those rules and the checks to see that they are working. It builds on [CI/CD](/library/tracks/ci-cd), whose last lesson covers securing the pipeline, and on [Infrastructure as code](/library/tracks/infrastructure-as-code), whose last lesson covers judging infrastructure changes.

## Staying within bounds

The lessons use public, free sources: the OWASP projects, OpenSSF, NIST, CISA and the documentation of the tools they mention. They teach general good practice. They are not legal or compliance advice, and they do not claim that following them makes any product certified or compliant with any scheme. When you need that, bring in the people responsible for it.

The lessons also bound agent work in one place after another: permissions, protected branches, required approvals, scanners that must pass, and hooks that stop an action before it happens. How those limits are designed for a whole fleet of agents, with policy written as data, is the subject of the advanced track `/library/tracks/agent-orchestration`. Here you learn the single-agent version, which is the foundation.

## Time and order

Plan about six hours. Lesson 1 stands alone and lesson 4 is best last. With only an hour, read lesson 1 and the checklist in lesson 4.

After this track, continue to `/library/tracks/observability-and-service-management` to learn how to see what your product is doing, so that you find out about a problem before your customers do.
