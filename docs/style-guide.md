# Content style guide

How we write for developerdojo.org. Read this once before writing a lesson. The step by step for editing
files is in [CONTRIBUTING.md](../CONTRIBUTING.md); the field lists are in [content-model.md](content-model.md).

## Who we write for, and what we train

Developer Dojo is a free training academy run by Curiosity Research Corporation (CRC) and sponsored by Reveltek.
We train the top 0.1%: the **2030 Product Development Manager**. This is not a coding bootcamp.

The 2030 Product Development Manager:

- blends every discipline (strategy, product, design, brand and marketing, finance, operations, security, engineering);
- treats AI agents as the workforce for lower-level work (writing code, tests, docs, research drafts, data
  wrangling, boilerplate, routine operations);
- does the human work: decides what to build and why, frames the problem, writes the specification and the
  acceptance criteria, owns the epics and the roadmap, directs the agents, judges and verifies what comes back,
  manages risk, and ships to real users.

Our readers are juniors, career changers (many reading in their second language), people moving from classic
development to working with agents, mentors and sponsors. The bar is high and the tone is welcoming: ambitious,
demanding, never hype. Clear writing is itself a top skill, so we hold ourselves to it.

Technical lessons teach **enough depth to direct and judge agents**: read a diff, spot a bad design, read a
pipeline, ask the right security question. We do not teach hand-typing code as the goal. Coding courses are
recommended as "literacy to judge agent output".

## Voice and plain words

- Short sentences. One idea each. Prefer 15 words or fewer.
- Active voice: "You write the brief", not "The brief is written".
- Common words: "use" not "utilise", "start" not "initiate", "check" not "validate" (unless the tool says validate).
- Explain every technical term the first time it appears, in a short phrase, and link the
  [glossary](/library/glossary) when the term is there. Do not stack three new terms in one sentence.
- Avoid idioms and jokes that need a culture to understand ("move the needle", "low-hanging fruit").
- Numbers: use digits. Dates: "3 November 2026". Times: say the time zone.
- Warm and direct. Speak to "you". No hype words: "revolutionary", "game-changing", "world-class", "10x".
- No filler openings ("In today's fast-paced world"). Start with why it matters.
- Headings in sentence case ("Write the acceptance criteria"), not Title Case.
- One `##` for each main part. Use `###` only inside a part. Never write a `#` heading in the body.
- Tables only for real comparisons, with few columns and short cells (they must fit a phone).
- Code blocks always say the language: three backticks then `bash`, `yaml`, `markdown`, `ts`.
- Internal links look like `[Roadmap standard](/library/roadmap-standard)`: start with `/library/`, no `.md`.

## How a lesson is built

Every lesson answers four questions for the 2030 Product Development Manager. Say them in the lesson in these
words, so the reader learns to ask them about everything:

1. **What do I decide here?** The human decisions: what, why, for whom, how good is good enough.
2. **What do I delegate to agents, and with what exact brief?** Show the real brief or prompt, ready to adapt.
3. **How do I verify what comes back?** The checks a human runs: read the diff, compare to the acceptance
   criteria, test with a real person, check the numbers.
4. **Which other disciplines are involved?** Who else is in the room: design, finance, operations, security, and so on.

The agent skill is a ladder. A lesson should say where it sits and when the work moves up a rung:

| Rung | What it means |
| --- | --- |
| **Use** | You work with one agent, step by step |
| **Delegate** | You hand a whole task to an agent with a written brief and acceptance criteria |
| **Orchestrate** | You run several agent sessions at once and keep them coordinated |
| **Govern** | You set written policy, hooks and gates (pipelines, merge trains, protected branches) so the work stays safe without you watching every step |

In beginner lessons, name the rung and move on. Do not lecture about the higher rungs. Where a lesson says "delegate
to agents", mention when it becomes orchestration (several sessions) and what policy or gate keeps it safe, and link
the [agent orchestration track](/library/tracks/agent-orchestration) once that track exists.

### The nine parts

Track lessons are 1,500 to 3,000 words. Use these parts, in this order, as `##` headings:

1. **Why this matters.** For a person who owns a product and directs AI agents. Say which Developer week or
   Master Developer module this lesson supports.
2. **Key ideas.** Explain each idea in plain words. A small table or diagram in text helps.
3. **Step by step.** How to do it, numbered.
4. **Worked example with TrailMug.** See below.
5. **Working with AI agents on this.** The four questions above, the ladder rung, a prompt you can adapt, how to
   check the output, and the line on disclosing AI use.
6. **Common mistakes.** What goes wrong and how to avoid it.
7. **Practice.** One exercise with a clear deliverable that goes in the learner's git repository. Mostly:
   "direct an agent to build X, then review and verify it". The learner's specification and review notes are the deliverable.
8. **Checklist.** Markdown task list: `- [ ] I wrote the acceptance criteria`.
9. **Further learning.** Not written by hand. It is built from the `resources` list in the frontmatter (3 to 8
   verified resources). You may also link a resource inside the text where it helps.

Program pages (The Way, weekly pages, standards, templates) are as long as the source needs.

### The TrailMug example

The running example product is **TrailMug**: reusable cups for cafes. It is fictional. Keep every new example
consistent with the pages that already use it (search the site for "TrailMug" before you invent details).
Never present TrailMug numbers as real. Use clearly invented, round, labelled-as-example numbers, or no numbers.

### People write epics and roadmaps

This is Rule 1 of The Way. People write epics and roadmaps; AI never does. In lessons, an agent may draft
research, summarise interviews, check a draft against a standard, or build from an approved issue. A human decides
and owns the epic, the roadmap and the acceptance criteria.

GitLab.com Free has no epics and no scoped labels. Teach issues, milestones and labels for the free plan, and
mention epics as the paid feature where it helps.

### Disclose AI use

When a piece of work was drafted with AI, say so. In practice lessons teach this habit with a short line in the
work's README or MR description, for example: "Drafted with an AI agent from my brief; I reviewed and edited every
section." Read [Disclose AI use](/library/disclose-ai-use). The site follows its own rule: pages written with AI
help are reviewed by a person before they are merged.

## Honesty rules

These are not optional. The site is public.

- No made-up events, dates, viewer counts, testimonials, statistics or people. If you do not have a real
  source, leave the number out.
- No real staff or real learners' names or photos. Use placeholder people.
- CRC's 501(c)(3) application is **pending**. Never write that CRC is approved, tax-exempt or that donations are
  deductible. Never claim accreditation.
- Sensei rewards: show points and tiers; say rewards are being finalised. No dollar amounts, no "cash" promises.
- No internal hostnames, internal repository paths, service accounts, cluster details, tool configurations or
  secrets. If you are not sure whether something is internal, leave it out and ask a Maintainer.
- Never invent a course, a certificate, a duration or a price. Use the exact title the publisher shows.
- Say what a tool cannot do. Do not hide limits.
- Rewrite source material in your own words. Do not copy long passages from other sites.
- Empty states are honest: "Schedule announced soon", not a fake calendar.

The test suite blocks a list of internal words on every library page. If it fails, remove the word; do not ask
for the rule to be loosened.

## Choosing outside material

Prefer, in this order: official publishers (Anthropic, OpenAI, Google, Microsoft, AWS, GitLab, CNCF and Linux
Foundation), universities (Harvard CS50, MIT OCW), freeCodeCamp, Kaggle, DeepLearning.AI, and long-lived
reputable educators. Favour material on product strategy and management, systems thinking, AI agents and
evaluation, decision-making, design, business and finance basics, leadership and communication. Coding courses
count as literacy for judging agent output, not as the main goal.

### Cost labels

| Label | Use it when |
| --- | --- |
| `free` | The whole thing is free and needs no payment to finish |
| `free-audit` | You can learn it all free; a certificate or graded work costs money |
| `free-tier` | Free up to a limit (time, usage or features), then paid |
| `paid` | You must pay to use it. Only include it when nothing free comes close, and say why in the summary |

If the price is unclear, do not guess: pick a clearer resource or leave the label off the claim in your text.

### How to check a link

Do this on the day you add the link. Links break; a checked link is the promise we make.

1. Open the link in a **private window**, signed out. It must load the page you describe, without a login.
2. Read the page title and the first screen. Does it match the title, publisher and level you wrote?
3. Find the price and the duration if the publisher states them. Copy the **exact title** from the page.
4. If the link redirects somewhere else, use the final address.
5. For a **YouTube** video or playlist, open it and also check
   `https://www.youtube.com/oembed?url=<the video link>&format=json` in your browser: it must show a title and the
   channel name. Use that exact title and channel. Prefer official channels.
6. Write today's date in `verifiedOn`.

Some sites block automatic checkers. That is why a person opens the link. If you cannot open it, do not add it.

Developers can run the same check from a terminal:
`curl -sL -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0' URL` should print `200`.

A scheduled job checks every resource link on a timer and opens a `link-rot` issue when one breaks. Fix those
in a small MR: new `url` and new `verifiedOn`, or remove the resource.

## Before you open the MR: a short checklist

- [ ] The lesson answers the four questions, and names the agent-skill rung.
- [ ] Plain words; each new term explained once.
- [ ] No `#` heading in the body; the first heading is `##`.
- [ ] 3 to 8 verified resources, each opened today.
- [ ] TrailMug used consistently, with no real-looking numbers.
- [ ] No invented people, dates, statistics, prices or promises. CRC status stated as pending where mentioned.
- [ ] No internal names. Disclosed that AI helped, where relevant.
- [ ] The MR description says what changed and ends with `Closes #N` if it finishes an issue.
