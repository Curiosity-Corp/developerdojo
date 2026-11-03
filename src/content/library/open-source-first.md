---
title: "Open source first"
description: "Look for existing open source before you build, and check the licence every time."
section: "The Way"
order: 4
---

**Rule 3: open source first.** Before you build something, look for a tool that already does the job.

**Open source software** is software whose code you may read, change and run under a public licence. A **licence** is the legal paper that says what you may do with the code.

## Why

1. **Speed.** A mature tool is months or years of work you do not repeat.
2. **Quality.** Many users have found the bugs. Many people have read the code.
3. **Cost over time.** Code you write is code you must maintain for ever. We call this **tech debt**: a promise of future work.

Free is not the same as cheap. Every tool has three risks:

- **Licence.** Can you legally use it the way you plan?
- **Health.** Will it still be alive next year?
- **Fit.** Does it do what your customer needs?

## The four rungs

Start at the top. Go down only when the rung above fails, and write down why.

| Rung | When | What you do |
|---|---|---|
| Search | Always, first | Look for open source with an acceptable licence |
| Use as is | It meets every must-have need and the licence passes | Configure it. Do not change its code. |
| Adopt and patch | It meets most needs and the gaps are small | Use it with a small, tracked set of your own changes |
| Build | Nothing fits | Build it, and write down that you accept the full tech debt |

The full method is in [The OSS-first ladder](/library/oss-first-ladder).

## Two warnings

- **No licence means no permission.** Code on a public site with no licence file is not open source. The author keeps all rights.
- **Open source is not always safe.** Some licences limit commercial use or require you to share your own code. Read before you adopt.

## Write it down

Every choice gets a short **decision record**. It says what you needed, what you compared, what you chose and how you could leave. A template is in [Decision record](/library/template-decision-record).

## Key points

- Search before you build.
- Check the licence, health and fit.
- Record the decision in git.
