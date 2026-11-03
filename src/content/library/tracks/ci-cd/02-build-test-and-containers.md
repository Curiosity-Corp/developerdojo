---
title: "Build, test and containers"
description: "Tests as the judge, containers as the unit you ship, and caches and artifacts that keep pipelines fast: enough to direct an agent and spot a weak build."
section: "CI/CD"
order: 2
track: "ci-cd"
level: "core"
duration: "90 min"
outcomes:
  - "Explain the test pyramid and choose what to test first"
  - "Explain what a container image is and why the same image should travel to production"
  - "Read a simple Dockerfile and spot unpinned, bloated or unsafe choices"
  - "Use caches and artifacts correctly, and know the difference"
prerequisites:
  - "the-way-five-rules"
resources:
  - "docker/get-started"
  - "docker/buildkit"
  - "gitlab/caching"
  - "youtube-techworld-with-nana/docker-tutorial-for-beginners"
  - "twelve-factor/the-twelve-factor-app"
  - "gitlab/first-pipeline-tutorial"
updated: 2026-11-03
---

Lesson 2 of the CI/CD track. It supports Developer week 4 and the Master Developer delivery spine, stages "source checks" and "supply chain". Lesson 1 of this track should come first.

## 1. Why this matters

A pipeline is only as good as what it runs. Two things matter most: the **tests** (do they check what you care about?) and the **build** (is what you ship the same thing you tested?). If you direct agents, both need your attention, because an agent can write tests that look fine and prove nothing, and can build an image that works on its machine only.

You do not need to write Dockerfiles from memory. You need to read one, ask the right questions, and insist that the artifact that was tested is the artifact that ships.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What must be tested, the speed budget for a pipeline, what base images are allowed | Writing tests, writing a Dockerfile, tuning caches | Mutation by hand (break the code, see the test fail), reading the Dockerfile, checking image size and tag | Quality (what could go wrong for the customer), security (base image and packages), finance (runner minutes), operations (how it runs) |

## 2. Key ideas, explained

### Tests: the judge

A **test** is code that checks other code. Three common kinds.

| Kind | What it checks | Speed | How many |
|---|---|---|---|
| **Unit test** | One small function | Very fast | Many |
| **Integration test** | Several parts working together, such as the form and the database | Medium | Some |
| **End-to-end (e2e) test** | The whole product through its real interface, like a user | Slow | Few, for the key journeys |

This is often drawn as a pyramid: many unit tests at the base, few e2e tests at the top. If you invert it, your pipeline is slow and brittle.

Good tests fail for the right reason. A test that cannot fail, or fails randomly, is worse than none. A random failure is called a **flaky** test. Treat flaky tests as bugs: fix or delete them. Never let the team learn to ignore red.

### Test what the customer would notice

Ask: what are the three things that would hurt a customer most if they broke? Sign-up. Payment. Returns. Cover those first, with at least one test each. Coverage numbers (the percentage of code that tests touch) are a weak signal. High coverage with weak checks is common, especially with agent-written tests.

### How to judge an agent's tests

Agents love to write many tests quickly. Check:

1. **Does each test assert something specific?** A test that only checks the function runs without an error is nearly empty.
2. **Do the tests fail when the code is wrong?** Break the code on purpose and run them. This simple hand-made "mutation" is the best check there is.
3. **Are existing tests unchanged?** Changing the judge to match the code is a classic problem.
4. **Do tests use fake data only?** Never real customer data.
5. **Are they fast and stable?** Run them three times.

### Containers and images

A **container** is a lightweight, isolated box that holds an application and everything it needs to run: the runtime, libraries, settings. An **image** is the saved, read-only template from which containers start. The promise is "it runs the same everywhere", from your laptop to the pipeline to production. Docker's [Get started guide](https://docs.docker.com/get-started/) and the video [Docker Tutorial for Beginners](https://www.youtube.com/watch?v=3c-iBn73dDE) are good introductions.

A **Dockerfile** is the recipe. A small one:

```dockerfile
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
USER nginx
```

Reading it:

- `FROM node:22-slim` picks a **base image**. Ask: who publishes it? Is the version pinned? Is it small?
- The two `FROM` lines make a **multi-stage build**: the first stage builds the site, the second keeps only the output. The final image is smaller and holds fewer tools for an attacker to use.
- `USER nginx` runs as a normal user, not as root. Ask for this.
- No secrets appear. If you see a password or a key in a Dockerfile, stop.

### Questions to ask of any image

| Question | Why |
|---|---|
| Is the base image pinned to a version (better, to a digest)? | Otherwise "latest" changes under you |
| Is it a small, well-known base? | Less to attack and patch |
| Does it run as a non-root user? | Limits damage if compromised |
| Does the final image contain build tools or source it does not need? | Size and risk |
| Are secrets absent from every layer? | Layers keep history, even if a later line deletes a file |
| Is there a `.dockerignore`? | Keeps `.git`, `.env` and local files out |

### Build once, ship the same thing

A key rule from the Master Developer program: **promote the same image digest** from test to staging to production. A **digest** is a long hash that identifies exactly one image, such as `sha256:ab12...`. Tags like `latest` can point at different images on different days. If you rebuild for production, what you ship is not what you tested. Build once, then move that exact digest through the environments. Lesson 3 covers promotion.

### BuildKit and build speed

**BuildKit** is Docker's modern build engine. It caches layers, builds steps in parallel and can handle secrets without baking them into layers. See the [BuildKit documentation](https://docs.docker.com/build/buildkit/). In the Dojo's world, images are built in the pipeline, not on laptops.

### Cache versus artifact

These two are often confused. See the [GitLab caching documentation](https://docs.gitlab.com/ci/caching/).

| | Cache | Artifact |
|---|---|---|
| Purpose | Speed: reuse downloaded dependencies between runs | Results: pass files from one job to the next, or keep them |
| Guaranteed? | No. It may be missing. | Yes, within the pipeline |
| Example | The `node_modules` download | The built `dist/` folder |

Never rely on a cache for correctness. A pipeline must work with an empty cache, only slower.

### Config in the environment

The Twelve-Factor App ([12factor.net](https://12factor.net/)) gives a set of rules for apps that run well in containers. Two matter here: keep **configuration in the environment**, not in the image, and treat **logs as a stream** to standard output. The same image can then run with different settings in test and production.

## 3. Step by step: add tests and a container build

1. **List the three journeys** a customer cares about most.
2. **Write a spec** for tests that cover them. Include "break it on purpose and the test fails".
3. **Direct an agent** to write the tests on a branch, plan first.
4. **Verify the tests.** Read them. Break the code on purpose. Run three times.
5. **Add the test job** to the pipeline (lesson 1).
6. **Write the image spec:** base image rules, non-root, multi-stage, no secrets, a `.dockerignore`.
7. **Direct an agent** to write the Dockerfile and a pipeline job that builds the image.
8. **Verify the Dockerfile** with the question table.
9. **Check size and tag.** Is the image tagged with the commit and recorded by digest?
10. **Add caching** if the pipeline is slow. Confirm it works with an empty cache.
11. **Merge** after review.

## 4. Worked example: TrailMug

Maya's top three journeys: sign-up, returns request and the subscription page. She writes a spec: "One test per journey. Each test asserts a visible result. If I remove the phone check, the sign-up test fails." She briefs an agent. The agent writes five tests. She reads them. One test for the returns journey only checks that the page loads: nothing about the form. She comments: "Assert that the returns form shows an error when the order number is empty." The agent fixes it.

Then she breaks the phone check by commenting out one line. Two tests fail. She restores it. All pass. Three runs: stable.

For the container, she writes: "Multi-stage. Base: official Node 22 slim for build, official nginx alpine for serve, both pinned to a version. Run as a non-root user. No secrets. Add `.dockerignore` for `.git` and `.env*`." The agent produces a Dockerfile like the one above. Maya checks the table. The base image tag was `latest` in the first draft, so she asks for a pinned version. The agent also copied the whole repository, including a test fixtures folder, into the final image. She asks it to copy only `dist/`.

The pipeline job builds the image with BuildKit and tags it with the commit id. Maya checks the job log to see that the image digest is printed. She writes it into the merge request. The pipeline now takes four minutes. She adds a cache for the dependency download and sees it drop to two. She runs once with the cache cleared to confirm it still passes.

## 5. Working with AI agents on this

**What the PDM decides:** the journeys that must be protected, the rules for base images, the time budget.

**Delegate:** writing tests, the Dockerfile, the build job, the cache configuration, explaining a failing build.

**Verify:** break the code and watch the test fail; read the Dockerfile with the question table; empty the cache and rerun; read the image digest.

**Prompt for tests:**

```text
Write tests for the three journeys below, one per journey, using <test tool>.
Each test must assert a specific visible result and must fail if the feature
breaks. Do not edit existing tests. Use fake data from test/fixtures only.
After writing, list for each test what would make it fail.
Journeys: <list>
```

**Prompt for a Dockerfile:**

```text
Write a multi-stage Dockerfile for this project. Pin both base images to a
specific version, run as a non-root user, copy only the build output into the
final image, and include no secrets. Also write a .dockerignore. Then list,
as a table, each choice and why you made it, and anything you assumed.
```

**Disclose** AI-written tests and build files in the merge request, and say which break-it-on-purpose checks you ran.

## 6. Common mistakes and how to avoid them

- **Tests that cannot fail.** Fix: break the code on purpose.
- **Editing tests to pass.** Fix: existing tests change only with a human reason.
- **Flaky tests ignored.** Fix: treat as bugs.
- **`latest` tags.** Fix: pin versions, record digests.
- **Secrets in image layers.** Fix: never; use run-time config and secret managers.
- **Running as root.** Fix: non-root user.
- **Relying on cache for correctness.** Fix: test with an empty cache.
- **Rebuilding for production.** Fix: build once, promote the digest.

## 7. Practice

**Deliverable in git:** `specs/ci-02.md`, `briefs/ci-02.md`, `reviews/ci-02.md`, plus a merge request with tests and a Dockerfile.

1. In your practice repository, list your three most important journeys.
2. Write a spec for tests and a Dockerfile, each with at least five acceptance criteria including break-it-on-purpose.
3. Brief an agent for each. Plan first.
4. Verify tests by breaking the code and running three times. Verify the Dockerfile with the question table. Record each answer in `reviews/ci-02.md`.
5. Record at least one thing you made the agent change, and why.
6. Run the pipeline once with an empty cache.
7. Open a merge request with a disclosure block and the image digest in the description.

## 8. Checklist

- [ ] The three key journeys each have a test.
- [ ] Each test failed when I broke the code.
- [ ] Existing tests were not changed to pass.
- [ ] The Dockerfile uses pinned bases, non-root, multi-stage, no secrets.
- [ ] A `.dockerignore` keeps `.git` and `.env*` out.
- [ ] The pipeline passes with an empty cache.
- [ ] The image is identified by digest.

## 9. Further learning

Start with Docker's own guide, then the video if you like to see it done. The BuildKit page is for later, when you tune builds. Read the Twelve-Factor App for design rules, and the GitLab caching page before you touch caches. The first pipeline tutorial gives hands-on practice with jobs and artifacts.
