---
title: "DROID Ops for programmes, content and training"
description: "The lighter five-step loop (Design, Research, Optimize, Integrate, Deliver) for training, content and programme work, using the Dojo itself as the example."
section: "Frameworks"
order: 23
track: "frameworks"
level: "core"
duration: "50 min"
outcomes:
  - "Run the five DROID steps on a training, content or programme project"
  - "Explain when to use DROID Ops and when to use the full ANDROID Ops loop"
  - "Write a short brief and a check that lets an agent draft content you can trust"
resources:
  - "atlassian/what-is-agile"
  - "gitlab/docs-description-templates"
  - "gitlab/docs-issue-boards"
  - "agile-manifesto/manifesto"
  - "dora/dora-research-program"
prerequisites:
  - "tracks/frameworks/20-why-a-new-operating-model"
updated: 2026-11-03
---

**Dojo programme link:** this lesson supports Developer weeks 5 and 6 (website, catalogue, demo, final presentation) and the Master Developer work of coaching others. Anyone who will teach, onboard or document a product uses it.

## 1. Why this matters

Not every project is a product feature. Sometimes you must run a training programme for café staff, write a help centre, produce a demo series, or onboard a new team member. The product might ship perfectly, and still fail because nobody understood how to use it.

A Product Development Manager (PDM) is responsible for that outcome. **DROID Ops** is the lighter loop for this kind of work. It has five steps, it fits a small team, and it is easy to run in a git repository. This lesson shows the steps and then uses the Dojo itself as the example.

## 2. Key ideas, explained

### 2.1 What DROID Ops is

**DROID Ops** stands for **D**esign, **R**esearch, **O**ptimize, **I**ntegrate, **D**eliver. The framework text describes it for training programmes, but the pattern works for any content or programme work: documentation, onboarding, workshops, campaigns, internal tools, even a set of prompts and instructions for your AI agents.

In the framework text a "DROID" is a small, focused unit of work with one purpose. It is meant to make **small, significant changes** to a larger project (which the framework calls a STAR; see the Frameworks track hub). You can think of a DROID as one well-defined mission that is launched, checked and finished, and then followed by the next one.

### 2.2 How it relates to ANDROID Ops

| | ANDROID Ops | DROID Ops |
|---|---|---|
| Use for | Products, platforms and systems that are built and run | Programmes, content, training, documentation |
| Steps | Seven focus areas | Five steps |
| Planning | Roadmap, epics, release pipeline | A short plan, a checklist, a review date |
| Release | Full pipeline with security and governance gates | Publish, announce, support |
| Typical length | Continuous | Days to weeks, then repeated |

They connect in two ways. First, a product release **needs** DROID work around it: a guide, a training session, a support script. Second, when a DROID finishes a build and wants it to go live, it hands over to the launch process. The handover is a written, structured request with a clear definition of done. You will see that idea again in [lesson 25](/library/tracks/frameworks/25-launch-sequence-six-stages/).

### 2.3 The five steps

The source text lists steps under each heading. Here they are in plain words with a PDM's reading.

**1. Design.** Decide what you are making and for whom.

- Define the goals and objectives.
- Identify the audience and what they need.
- Draft the content and its structure.
- Create the visual design and the interface.
- Test the design and refine it.

*PDM view:* write the goal as a sentence about a learner or customer: "After this, a barista can process a return without help." Every later step is judged against that sentence.

**2. Research.** Check that the design matches reality.

- Do a needs analysis to find knowledge gaps.
- Look at best practices and industry standards.
- Collect and analyse data.
- Write learning objectives and assessment criteria.
- Evaluate how effective the programme is.

*PDM view:* this step is where you ask "what do people already know and what do the best programmes teach?" It is also where you write how you will **test** the learning. If you cannot test it, you cannot say it worked.

Notice the order. Design comes first, then Research, in DROID Ops as in the ANDROID letters. The loop starts with a design draft and uses research to correct it. The reason is speed: a first draft makes a better question than a blank page. If the audience is completely new to you, do a short Research pass first and then Design. The loop repeats anyway, so the order matters less than doing both.

**3. Optimize.** Improve it using feedback.

- Review and refine based on feedback and evaluation.
- Update content and design to follow changes in standards.
- Add new technology or teaching methods.
- Test the update.
- Evaluate again.

*PDM view:* this is a scheduled step, not a hope. Put a review date in the plan.

**4. Integrate.** Join it to the systems and habits people already use.

- Integrate the programme with existing systems and processes.
- Make an implementation and rollout plan.
- Train the trainers and other stakeholders.
- Monitor the rollout.
- Adjust.

*PDM view:* many programmes fail here. A perfect guide that sits where nobody looks is useless. Put it where people work (in the product, in the repository, in the onboarding list).

**5. Deliver.** Run it and keep supporting it.

- Deliver to the target audience.
- Watch the delivery.
- Provide ongoing support and resources.
- Collect feedback from learners and trainers.
- Use the feedback to improve.

*PDM view:* the last step feeds the first. Feedback becomes the next design.

### 2.4 Training your agents is DROID work too

The same loop applies to the instructions you give your AI agents. A repository file such as `AGENTS.md` (instructions an agent reads at the start of its work) is a small training programme for a reader that never forgets and never gets tired, and that also never asks a question unless you tell it to.

- **Design:** what must the agent always do, never do, and ask about?
- **Research:** read its past mistakes. Where did it misread your standards?
- **Optimize:** edit the instructions after each failure. Keep them short.
- **Integrate:** put the file where the agent starts. Keep it in git. Review changes like code.
- **Deliver:** run the agent on a task and measure.

## 3. Step by step: run a DROID

1. **Write the goal sentence** and the audience in a file `droid/<name>/plan.md`.
2. **Create an issue** for each of the five steps, with an owner, a date and a short definition of done. Label them with the step name.
3. **Design:** make a one-page outline, a sketch, and the three questions the audience must be able to answer at the end.
4. **Research:** list five sources and three conversations with the audience. Write the test (a quiz, a task, a checklist).
5. **Draft** the content, with agents helping.
6. **Optimize:** test with three people from the audience. Change what confuses them.
7. **Integrate:** place it where people already look. Tell the people who will help others learn it.
8. **Deliver:** publish, announce, and write the date of the first review.
9. **Close the loop:** after the review date, write what you learned in the plan file.

## 4. Worked example: the Dojo itself

Developer Dojo is a free training academy run by Curiosity Research Corporation and sponsored by Reveltek. Here is how it maps to the five steps. Where something is a plan, not a fact, it says so.

| Step | What it means for the Dojo | Where you can see it |
|---|---|---|
| Design | A ladder (Developer, Master Developer, Sensei), a six-week path, a final Product Package, and plain-word pages for juniors and second-language readers. | The Developer path and Master Developer pages in the Library |
| Research | Check each lesson against sources, and link free, checked resources. Write the rubric that says what "good" looks like. | The [product package rubric](/library/product-package-rubric) and each lesson's further learning list |
| Optimize | Fix pages when learners are confused. Run an automated link check and fix rotten links. | The issue tracker, labelled for link rot and for good first edits |
| Integrate | Everything lives in git. Templates are downloadable. Weekly notes and issues use the same labels learners will use in their own work. | The [templates overview](/library/templates-overview) |
| Deliver | Publish the site. Offer live sessions and challenges when they are scheduled. Be clear about what is not yet announced. | The home page, Events and Challenges pages |

The honest empty states on the site are part of Deliver. A page that says "Schedule announced soon" is better than an invented schedule.

### The TrailMug version

Maya wants café staff to handle returns with the new scan. She runs a DROID:

- **Goal:** "After a ten-minute guide, a barista can process a return and fix a failed scan."
- **Design:** a one-page card with three steps and a photo of the screen; a two-minute screen recording.
- **Research:** she watches two baristas, asks which words they use for "return", and writes a three-question test.
- **Optimize:** the first card used the word "redeem". Staff said "return". She changes it.
- **Integrate:** the card is added to the café welcome kit, the support person gets the failed-scan answers, and the link is placed on the counter page.
- **Deliver:** the guide goes to Leo's café first. She asks Leo for feedback after one week.

## 5. Working with AI agents on this

**What the PDM decides:** the goal sentence, the audience, and the test of success.

**What agents can draft:** outlines, first drafts, quiz questions, translations for review, screen text, scripts for a short video, checklists, and plain-language rewrites.

**A brief you can adapt:**

```text
Audience: café baristas, many reading English as a second language.
Goal: after ten minutes they can process a cup return with the scan page
and fix a failed scan.
Write a one-page card: three numbered steps, then a "If it fails" box with
two causes and fixes. Use sentences under 15 words. Do not use the words
"redeem", "token" or "sync". Then write three test questions with answers.
Mark anything you assumed about the screen with [CHECK].
```

**How to check:**

- Test it with real people, not with the agent. Ask one person to follow the card without help, and watch.
- Resolve every [CHECK] mark against the real screen.
- Read the reading level. Short words, short sentences.
- Check every fact against the product.

**Disclose AI use.** Add a line to the document: "Drafted with an AI agent, reviewed by name on date." [Disclose AI use](/library/disclose-ai-use) explains how.

**Other disciplines.** Support and operations know where people get stuck. Marketing knows the words customers use. A designer improves the layout. A PDM brings them in at Research and Optimize, not at the end.

**From delegating to orchestrating.** Agents can draft programme and content material in parallel, for example one session per module. Keep one Commander (a person) who sets the policy, reviews each draft against the DROID Ops steps and decides what is published. See [Agent orchestration](/library/tracks/agent-orchestration/).

## 6. Common mistakes and how to avoid them

- **No goal sentence.** The programme grows and has no edge. Write the sentence first.
- **Skipping the test.** Without a test, nobody knows if people learned. Write it in Research.
- **Treating Integrate as "send an email".** Put the material in the place people work.
- **Doing it once.** A programme that is not reviewed decays. Set the review date.
- **Letting an agent produce 40 pages.** Quantity hides errors. Ask for one page you can test.
- **Using real people's names and photos without consent.** Use placeholders in public material.

## 7. Practice

**Deliverable in git:** a folder `droid/<your-topic>/` with:

1. `plan.md`: the goal sentence, the audience, the five steps with dates, and the review date.
2. `content.md`: a one-page guide or lesson, drafted with an agent if you wish.
3. `test.md`: three questions or tasks with answers.
4. `findings.md`: what three people from the audience did when they tried it, and what you changed.
5. A merge request with the "Agent use" section: your brief, your checks, and what you removed.

## 8. Checklist

- [ ] I wrote the goal as one sentence about the audience.
- [ ] I can say which of the five steps I am in.
- [ ] A test exists, and I ran it with real people.
- [ ] The material is placed where the audience works.
- [ ] A review date is written down.
- [ ] I disclosed AI use.
- [ ] No private data or real names appear in public material.

**Next:** [lesson 24](/library/tracks/frameworks/24-running-android-ops-in-gitlab/) shows how to run all of this in GitLab.
