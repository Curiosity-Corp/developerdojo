---
title: "Disclosure and ownership"
description: "Tell people honestly when and how you used AI, handle licences and credit, and keep the epics, roadmap and decisions in human hands."
section: "Working with AI agents"
order: 10
track: "working-with-ai-agents"
level: "advanced"
duration: "60 min"
outcomes:
  - "Write a clear AI-use disclosure for a merge request and for the Product Package"
  - "Explain what you can and cannot claim as your own work"
  - "Check licence and privacy risks in AI-assisted work"
  - "Name the decisions that stay human, and show evidence that you made them"
prerequisites:
  - "the-way-five-rules"
  - "people-write-epics"
  - "disclose-ai-use"
resources:
  - "nist/ai-risk-management-framework"
  - "microsoft/ai-playbook"
  - "anthropic/claudes-constitution"
  - "microsoft/generative-ai-for-beginners"
  - "openai/openai-academy"
updated: 2026-11-03
---

Lesson 10 closes the track. It supports Developer week 6 (the final Product Package, with its "How I used AI" section) and the Master Developer assessment, where you explain your work out loud. It also puts Rule 1 and Rule 5 of [The Way](/library/the-way-five-rules) into daily practice.

## 1. Why this matters

By now you can prompt, give context, run a coding agent, review its work, measure it and keep it safe. One question remains: how do you stand in front of other people and say, truthfully, "this is my work"?

The answer is honesty plus ownership. **Honesty** means you tell people where AI helped. **Ownership** means you can explain every decision and every line, and you carry the responsibility for it.

Using AI is normal and welcome at Developer Dojo. Hiding it is the problem. A reviewer who does not know a draft came from an agent cannot know which parts to check. A customer who does not know an answer came from an AI cannot weigh it properly. A coach who does not know what you wrote cannot teach you. And you will not know yourself what you have actually learned.

There is a second reason. Some decisions cannot be handed over. A product owner who lets a model write the epics ends up with a roadmap that nobody can defend. The Way says it plainly: people write epics and roadmaps; AI never does. This lesson shows what that means in practice, so the rule is not a slogan.

The manager is accountable for what ships. Honest disclosure and clear ownership are how you earn trust from customers, reviewers and your own team.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What stays human (epics, roadmap, priorities), and how AI use is described | Formatting your disclosure notes and tidying records | Reading each statement of the disclosure for truth; explaining your work aloud | Legal (licences, rights), communication (honest claims), leadership (accountability) |

## 2. Key ideas, explained

### What disclosure is

**Disclosure** is a short, honest statement of what AI did in a piece of work. The existing page [Disclose AI use](/library/disclose-ai-use) gives the core habit: say what the AI did, which tool, and what you checked. This lesson extends it.

Good disclosure has four parts:

1. **What the AI did.** "Drafted six unit tests." "Fixed the grammar of my summary." "Wrote a first version of the script."
2. **Which tool.** Name it, so a reviewer can look at its known weaknesses.
3. **What you decided yourself.** The goal, the constraints, the content.
4. **What you checked.** "Ran the tests. Read every line. Compared the numbers with the source."

It should be short, specific and truthful. It is not a confession and it is not a boast.

### Where to disclose

| Place | What to write |
|---|---|
| Merge request description | The four-part block |
| Commit message trailer (optional) | A line such as "AI-assisted: tests drafted by an agent" |
| Weekly note | One or two lines on how you used AI that week |
| Product Package | A "How I used AI" section covering the whole product |
| Your product's website | Where users meet AI output, tell them it is AI |
| Prompt and eval files | Keep them in git. They are evidence of your process. |

### Levels of AI involvement

A useful way to think, and to say clearly:

| Level | Meaning | Example |
|---|---|---|
| **None** | You did it yourself | A paragraph you wrote and edited |
| **Assisted** | AI checked, explained or polished work you made | Spell-check, translation of your own text |
| **Drafted** | AI wrote a first version you then reviewed and changed | A test file, a script |
| **Generated** | AI produced most of it; you reviewed and accepted | A small helper function after careful review |
| **Not allowed** | A human must own it | The epic goal, the roadmap order, the personas |

Be honest about which level applies. If you copied an answer with only a glance, that is not "assisted".

### What you can claim as your own

You can claim what you can explain, defend and maintain. The test is practical: if the agent were switched off tomorrow, could you explain this work and change it? If yes, it is yours in the sense that matters. If no, then you have borrowed it. Borrowing is allowed for small helper code, but not for the thinking that defines your product.

For a Product Package, a coach will ask you to explain choices without notes. That is not a trap. It is the real test of ownership.

### Decisions that stay human

The Way lists the work AI never does: it does not decide who the customer is, what the product is or is not, which problem comes first, or what the success measure is. Here is how to show that you did that work.

- **Write in your own words first.** Keep your own notes, interview records and drafts in git. The history shows the order of events.
- **Use AI for questions and checks, not answers.** "List the gaps in my epic" is allowed. "Write my epic" is not.
- **Keep the reasons.** For each important decision, write a short decision record: what you chose, the options, and why. See the [decision record template](/library/template-decision-record).
- **Be ready to explain out loud.** If you cannot explain an epic without notes, it is not yet yours.

### Licences, copying and credit

AI can produce text and code that resembles existing material. Three habits protect you:

1. **Check licences of anything you add.** A new dependency has a licence. Code pasted from anywhere has a licence or an owner. See [Open source licences](/library/open-source-licences).
2. **Do not paste others' private work into a tool** unless you have the right and the tool is approved.
3. **Credit people.** If a person's article, design or code shaped your work, name them. AI does not remove that duty.

Rules about who owns AI-generated material differ by country and are still changing. Do not make legal claims about it. If it matters for your product or your employer, ask a qualified person.

### Privacy

Never put personal data into a tool you do not control. If your product uses AI on customer data, say so in plain words on your site, state what is sent and where, and let people ask questions. Lesson 9 covers the technical side.

### Responsible AI frameworks

Organisations publish frameworks that make these habits formal. The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) asks organisations to govern, map, measure and manage AI risk. Microsoft's [AI playbook](https://learn.microsoft.com/en-us/ai/playbook/) and the responsible AI lessons in [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners) give practical guidance. Anthropic's published [constitution for Claude](https://www.anthropic.com/news/claudes-constitution) shows how one company describes the values it aims for. Reading across sources shows what they share: be honest, keep people accountable and be careful with harm.

### Being honest about limits

A good disclosure also says what you did not check. "I did not test this on a phone" is a strong sentence. It shows care, and it tells the reviewer where to look.

## 3. Step by step: disclose and own a piece of work

1. **Before you start,** decide which level of AI involvement fits the task. Check it is not a "not allowed" task.
2. **Keep your own notes first.** Write the goal and constraints yourself, in git.
3. **Save the prompts** that mattered, in a `prompts/` or `ai-log/` folder.
4. **While you work,** note what the AI did and what you changed.
5. **Review** (lesson 7) and **measure** (lesson 8) where it matters.
6. **Write the disclosure block** in the merge request. Four lines.
7. **Check licence and privacy:** new dependencies, pasted text, personal data.
8. **Prepare to explain.** Say it aloud once, without notes. If you get stuck, go back to the work until you can.
9. **Record decisions** that matter in a short decision record.
10. **Update your "How I used AI" notes** weekly. At the end of the program they become a section of your Product Package.

## 4. Worked example: TrailMug

Maya is preparing the Product Package for TrailMug. She keeps a file `docs/how-i-used-ai.md`, updated each week. An extract:

```text
How I used AI on TrailMug

Not allowed, done by me
- Customer discovery: I interviewed five café owners (invented for practice). My notes are in discovery/.
- Epics and roadmap: written by me in roadmap/. History in git shows drafts before any AI use.
- Priorities: decision record DR-004 explains why returns come before payments.

Assisted
- Spelling and grammar of the website copy (tool: assistant X). I accepted about half the suggestions.
- Translation check of the Spanish sign-up page, reviewed by a native speaker friend.

Drafted, reviewed by me
- Issue 14 phone check and six tests (coding agent, branch issue-14-phone-check).
  I decided which formats are valid. I read every line and ran the tests.
  I rejected the first attempt because it added a library that did not exist.
- Summaries of call notes (prompt in prompts/call-summary.md, eval in evals/call-summary/).
  Known limit: two cases invent numbers. A person checks every summary.

Generated, small
- A script that checks catalogue files have an owner. I reviewed it, and it has tests.

What I did not check
- The website copy was not read by a customer yet.
```

When her coach asks "Why returns before payments?" she answers from memory, with the decision record open as backup. She explains one of the agent-written tests line by line. She also explains why she rejected the first fix. The coach does not need to ask "Did you do this yourself?" because the file already says what she did and what she did not.

One merge request description:

```text
Closes #21

What changed: catalogue check script now flags missing owners.
AI use: coding agent drafted the script and tests on branch issue-21-owner-check.
I decided: what counts as an owner (a named person or role, not a team alias).
I checked: ran tests and lint, read all 63 lines, ran it on the real catalogue.
Not checked: behaviour on a catalogue with more than 200 entries.
```

## 5. Working with AI agents on this

**Delegate:** formatting your disclosure, tidying your decision records, asking an agent to turn your weekly notes into the draft of the "How I used AI" section. You provide the facts.

**Keep:** the facts about what you and the AI did. An agent does not know what you did when you were not typing in its window. If you let it write the disclosure from its own memory, it may flatter or forget. Also keep the decisions: epics, roadmap, personas, priorities and the reasons.

**Prompt you can adapt:**

```text
Here are my notes about what I did this week and where I used AI: <paste>.
Reformat them into the four-part disclosure block (what AI did, which tool,
what I decided, what I checked, plus what I did not check).
Do not add anything that is not in my notes. If something is unclear, ask me.
```

**Never use AI to:** write your epic, set your roadmap order, invent personas or interview quotes, write your reflection as if it were yours, or fill in assessments. See [People write epics](/library/people-write-epics).

**How to check:** read the disclosure and ask, "Is every statement true? Is anything missing?"

**Disclose to users too:** if your product shows AI output, label it, say where a person can help, and give a way to report a problem.

## 6. Common mistakes and how to avoid them

- **Hiding AI use.** Fix: say it. Honest use is welcome.
- **Vague disclosure.** "Used AI" tells nobody anything. Fix: four parts.
- **Over-claiming.** Calling generated work "mine" when you cannot explain it. Fix: use the level table.
- **Under-claiming.** Burying your real decisions. Fix: record your reasons.
- **Letting AI write the disclosure from nothing.** Fix: you provide the facts.
- **Ignoring licences** for added code. Fix: check every dependency and snippet.
- **Putting personal data into tools.** Fix: invent data.
- **Delegating the epic.** Fix: write it yourself. Ask AI to find gaps.

## 7. Practice

**Deliverable:** `docs/how-i-used-ai.md` in your own repository, plus one merge request with a complete disclosure block.

1. Create the file with the headings: Not allowed (done by me), Assisted, Drafted and reviewed, Generated and small, What I did not check.
2. Fill it from your own earlier practice files in this track (`ai-log/`, `prompts/`, `evals/`). Be specific and truthful.
3. Write one decision record for a real decision of yours, in your own words, with the options and why.
4. Explain that decision out loud to a partner or mentor with no notes. Write down one question they asked that you could not answer, and how you will fix that.
5. Write the disclosure block for your last merge request, with a "Not checked" line.
6. Commit everything in a merge request with its own disclosure block.

## 8. Checklist

- [ ] My disclosure says what the AI did, which tool, what I decided, what I checked, what I did not check.
- [ ] I can explain every decision and every line I claim, without notes.
- [ ] I wrote my epics, roadmap and priorities myself, and the history shows it.
- [ ] I checked licences and privacy for new code, text and data.
- [ ] I credited people whose work shaped mine.
- [ ] My products label AI output for users.
- [ ] `docs/how-i-used-ai.md` is committed and current.

## 9. Further learning

Review the organisation-level guidance from NIST and Microsoft to see how professional teams formalise these habits, and try the responsible AI lessons in Generative AI for Beginners. OpenAI Academy has material on using AI responsibly at work, and its content changes, so check the current catalogue. Most of all, keep your disclosure file up to date. It will be the most honest and useful evidence of how you learned to work with agents.

## Where to go next

You now have the first two rungs of the ladder: using an agent well, and delegating whole tasks with a spec, a brief, verification and honest disclosure. The next two rungs are orchestrating many sessions and governing them with written policy, hooks and gates. They are taught in the advanced track Agent orchestration. Start there when you are running more agents than you can personally watch. If you work with one repository, pair it with [Git and GitLab](/library/tracks/git-and-gitlab) and [CI/CD](/library/tracks/ci-cd), which show the protected branches and pipeline gates that keep agent work inside bounds.
