---
title: "Biosafety basics before you automate"
description: "Learn what a risk assessment is, why a risk group alone does not decide safety, and what biosecurity and dual use mean. Ends with a safety note that scopes your track work to simulation."
section: "Lab automation in code"
order: 1
track: "lab-automation-in-code"
level: "foundation"
duration: "2 to 3 hours"
outcomes:
  - "Say what a risk assessment is and why a risk group alone does not decide the safety measures"
  - "Explain why automation changes a lab's risks without removing anyone's responsibility"
  - "Explain biosecurity, dual use and gene synthesis screening in plain words"
  - "Name who must approve real lab work, and the official manuals to read"
  - "Write a safety note that limits your track work to simulation and public data"
resources:
  - "who/laboratory-biosafety-manual-4"
  - "who/laboratory-biosafety-manual-4-risk-assessment"
  - "igsc/international-gene-synthesis-consortium"
  - "cornell-university-library/tutorial-evaluating-information"
prerequisites:
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** this track and the Master Developer Product Package (safety and risk). It is also the base for [Safety reports and review](/library/tracks/safety-reports-and-review). **Time:** about two to three hours.

## 1. Why this matters

Code that drives a laboratory has a feature that most code does not. It acts on the physical world, and it repeats. A wrong step in a script costs you a rerun. A wrong step in a protocol for a liquid-handling robot may repeat across a whole plate before anyone looks.

That is why this track starts with safety and not with Python. The rest of the track runs in **simulation**: the Opentrons simulator, a small program that stands in for a plate reader, and public data. Nothing you do in this track touches a real organism or a real reagent. Simulation is also a trap. It is easy to feel that code which runs cleanly on your laptop is code that is safe to run on a robot. It is not.

Three rules hold for the whole track:

1. **Everything here runs in simulation.** No wet-lab instructions appear in these lessons.
2. **Real lab work needs trained supervision and approval.** That means a qualified supervisor and the approval route of the institution that owns the lab.
3. **Automation does not remove responsibility.** A robot has no biosafety training. A person is always responsible for what it does.

A Product Development Manager (PDM) who directs agents that write lab code carries a particular duty. An agent will write a protocol for any liquid you name. It will not stop to ask whether you are allowed to handle it. You must be the one who asks.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What is in scope (simulation only), what is off limits, and who must say yes before anything real happens | Reading the official manuals and drafting a summary or a safety note, from sources you name | Every claim in the note against the official page, and that the note never states a rule you could not find | Biosafety officers and committees, the lab's supervisor, legal and compliance, security |

## 2. Key ideas

### Hazard and risk are not the same

A **hazard** is something that can cause harm, such as a pathogen, a chemical or a spinning instrument part. **Risk** is how likely that harm is and how bad it would be, in the way you actually work. The same hazard can carry a small risk in one procedure and a large one in another. A **risk assessment** is the careful, written look at that difference, done before the work starts.

The WHO Laboratory Biosafety Manual, 4th edition (LBM4), says this directly. It builds on the risk assessment framework of the third edition and calls for an evidence-based and transparent assessment of the risks, so that safety measures match the actual risk. Its risk assessment monograph says a proper risk assessment should always be performed before undertaking any activities.

### Risk groups and biosafety levels

Two older ideas still appear everywhere, so you need to know them.

- A **risk group** sorts an agent (a microbe, say) by how dangerous it is to people and to the community. Older WHO guidance used four groups.
- A **biosafety level** (BSL) is a set of laboratory controls: practices, equipment and facility design. The US manual and many other documents use levels from BSL-1 to BSL-4. Higher levels mean stricter controls.

For years people matched one to the other: this risk group, so that level. LBM4 moves away from that simple match. It asks for a risk assessment of the actual work. It sorts the measures into three kinds: **core requirements**, which are enough for most work; **heightened control measures**, added when the core requirements do not bring the risk down far enough; and **maximum containment measures**, for the small amount of work that needs them. The lesson for you is simple. A label on an agent is the start of an assessment, not the end of it.

### Why automation does not remove responsibility

A robot can feel like a barrier between a person and a hazard. It changes the work. It does not erase it. Think about what still involves people:

- Someone sets up the deck, loads labware and reagents and starts the run.
- Someone clears jams, fixes errors and handles waste and spills.
- Someone cleans and maintains the machine.
- The robot may run for hours with nobody watching.

Each of these is part of the procedure, so each belongs in the risk assessment. A protocol that runs fine in a simulator says nothing about them. The simulator checks that the commands are valid and shows the steps. It cannot show a jam, a spill or a person's hand.

### Biosecurity and dual use

**Biosafety** protects people and the environment from biological agents. **Biosecurity** protects the other way round: it guards agents, equipment and know-how against loss, theft or misuse.

**Dual use** means that knowledge, a tool or a method has a good purpose and could also be used to cause harm. Automation and software are dual-use tools. A protocol generator that helps a student mix dyes could, in principle, be pointed at something else. Most work is harmless. The habit to build is to ask, "could this be misused, and who would I tell if I saw that?" Some research is formally called dual use research of concern, and funders and institutions have review rules for it. You do not need to learn those rules for this track. You need to know that they exist and that your institution is where to ask.

### Gene synthesis screening, as a concept

Companies make synthetic DNA to order. That is useful, and it is also an obvious place to put a check. **Synthesis screening** means the provider checks the sequences that customers order, and the customers themselves, against lists of concern. The International Gene Synthesis Consortium (IGSC) describes itself as an industry-led group of gene synthesis companies. Its members apply a common protocol to screen both the sequences of synthetic gene orders and the customers who place them. You do not order DNA in this track. You need only know that the check exists and why.

### Who reviews real work

Real laboratory work sits inside an institution, and the institution decides what is allowed. Many research institutions have a biosafety officer and a biosafety committee that review proposed work. The names, rules and legal duties differ between countries and organisations. So the rule is practical: **ask the biosafety officer or supervisor of the lab you would work in**, and do nothing until they have answered in writing.

### Where to read more

Two official manuals are the standard starting points:

- The WHO *Laboratory Biosafety Manual*, 4th edition, with its monographs, including one on risk assessment.
- *Biosafety in Microbiological and Biomedical Laboratories* (BMBL), 6th edition, published by the US Centers for Disease Control and Prevention in partnership with the National Institutes of Health.

This lesson does not teach what is in them. It teaches you that they exist and that they, not an AI agent and not this lesson, are the source.

## 3. Step by step

Write a safety note for your own work in this track. It is one page and it lives in git.

1. **Say what you will do.** One sentence: "I write and simulate liquid-handling protocols, design experiments and run a software loop. Nothing in this repository is run on real equipment."
2. **List what is simulated.** For example: the robot (the Opentrons simulator), the plate reader (a Python function) and the data (generated by the code).
3. **List what is off limits.** Real organisms, real reagents, real robots, and any protocol that would handle a pathogen or a toxin. Say that no one adapts the repository for those without the steps in step 6.
4. **Name the sources.** Link the WHO manual and its risk assessment monograph. Name the BMBL, 6th edition, and the publisher.
5. **Say what simulation cannot show.** Jams, spills, waste, cleaning, people, hardware faults, the real behaviour of liquids.
6. **Say what real work would need.** A trained supervisor, a risk assessment by the lab, the institution's approval, and the manufacturer's training for the robot. Write "not done" next to each one.
7. **Add a dual-use line.** "If I think this work could be misused, I stop and tell my supervisor or the biosafety officer."
8. **Date it and sign it.** Put your name and the date. Add an AI-disclosure line if an agent helped.

## 4. Worked example: the colour-mixing loop

The capstone of this track is a closed loop that mixes three dyes in simulation. Here is the safety note for it. It is short on purpose.

```markdown
# Safety note: colour-mixing loop

Date: 2026-11-19    Author: (your name)

## Scope
This repository writes protocols for an Opentrons liquid-handling robot,
runs them in the Opentrons simulator, and reads a simulated plate reader.
No protocol in it has been run on real equipment. No real liquid, organism
or reagent is involved.

## What is simulated
- The robot: the Opentrons simulator (`opentrons_simulate`).
- The plate reader: a Python function with seeded noise. It is a stand-in,
  not a measurement of real chemistry.
- All data: generated by the code.

## Off limits
- Running any protocol from this repository on a real robot.
- Adapting it to handle any biological agent or toxin.

## What simulation cannot show
Jams, spills, waste, cleaning, people near the machine, hardware faults and
how real liquids behave.

## What real work would need (none of it done)
- [ ] A trained supervisor in the lab concerned
- [ ] A risk assessment by that lab
- [ ] The institution's approval
- [ ] The robot maker's training

## Sources
- WHO, Laboratory biosafety manual, 4th edition, and its risk assessment monograph
- CDC and NIH, Biosafety in Microbiological and Biomedical Laboratories, 6th edition

## Dual use
If I think this work could be misused, I stop and tell my supervisor.
```

Look at what the note does. It says what the repository is, in words a stranger can check. It lists the gap between the simulation and the real world. It names the people whose approval is missing, and it ticks nothing that is not done. A note like this goes at the top of the capstone repository, and the reviewer reads it first.

Now see why the "Off limits" list matters. Suppose a colleague says, "Your protocol works in the simulator. Can we run it on our robot on Friday?" The honest answer is "not on my say-so". The colleague needs their lab's risk assessment and supervisor, because dyes and plastics and a real robot bring their own hazards. Your code did not create that decision and cannot make it.

## 5. Working with AI agents on this

**What the PDM decides.** The scope of the work. You set the line: simulation only, with no wet-lab steps. You decide that no agent writes or runs anything for real equipment without a named person's written approval.

**What you delegate, and the exact brief.** You may delegate the reading. This is the **use** rung: you work with one agent, step by step, and you check each step.

```text
Task: draft a one-page safety note for my repository, using the template below.
Sources you may use (open each one and quote from it):
- WHO, Laboratory biosafety manual, 4th edition (the page and the risk
  assessment monograph)
- CDC and NIH, BMBL, 6th edition

Rules:
1. Every statement about biosafety, risk groups or biosafety levels must carry
   a short exact quote and the page it came from.
2. If you cannot open a source, write "not opened". Do not summarise from memory.
3. Do not give laboratory instructions of any kind.
4. Do not tell me a procedure is safe. Say what assessment would be needed
   and who must make it.
5. Never invent a regulation, a committee name or a rule. Write "I did not
   find one".
Output: the note, then a table of every claim, its quote and its source.
```

The rules do not make the agent careful. They make its mistakes easy to find.

**How you verify.** Open the sources and find each quote. Check that nothing in the note is a statement of law or rule that you cannot trace. Check that it contains no laboratory instruction. Search the note for words such as "safe", "approved" and "compliant", and ask whether the evidence supports each one. Use the checklist from [Find and judge sources](/library/tracks/research-and-evidence/02-find-and-judge-sources) for each source.

**Which disciplines are involved.** The biosafety officer and the lab supervisor own the real-lab decision. Legal and compliance know the duties that apply to a regulated site. Security asks who can change the protocols and how you would know. The agent's part is the first draft only.

**Where this sits on the ladder.** This is **use**: one agent, one document, you reading every line. It moves to **govern** when you write the limit into policy. For example, put a line in the repository's `AGENTS.md` such as "Agents write and simulate protocols only. They never run anything on equipment", and add a merge-request check that the safety note exists. Then the limit holds even when you are not watching.

**Disclose.** Add to the note: "A first draft was written by an AI agent from sources I named. I opened each source and checked each quote myself." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Believing that "it simulates" means "it is safe".** A simulator checks commands. It does not assess risk.
- **Treating a risk group or a biosafety level as the whole answer.** It is where the assessment starts.
- **Assuming automation removes the human hazard.** People still load, clear, clean and maintain.
- **Asking an agent whether something is allowed.** An agent does not know your institution's rules. It may sound sure and be wrong.
- **Quoting a rule from memory.** Rules differ by country and institution. Link the source or leave the rule out.
- **Forgetting dual use.** Ask once, early: could this be misused?

## 7. Practice: write your safety note

**Deliverable:** one file in your git repository: `lab/safety-note.md`.

1. Copy the template in the worked example and change it to fit your repository.
2. Open the WHO manual page and its risk assessment monograph. Find and copy one exact sentence about risk assessment into the note, with the page address.
3. Name the BMBL, 6th edition, and its publishers. Do not claim anything that you have not read in it.
4. Brief an agent with the prompt above to draft your note. Compare its draft with yours. Keep a list of every claim that you removed and why.
5. Add the AI-disclosure line.
6. Commit the file with a message such as `docs: add safety note for lab track`.

**Check:** give the note to a friend who has not read this lesson. Ask them: "What would stop someone running this on a real robot?" They should find the answer in the note.

## 8. Checklist

- [ ] My note says that everything runs in simulation.
- [ ] It lists what simulation cannot show.
- [ ] It lists what real work would need, with "not done" beside each item.
- [ ] Every rule in it links to a source I opened.
- [ ] It contains no laboratory instructions.
- [ ] It has a dual-use line and names who I would tell.
- [ ] It names the two official manuals and does not claim more than I read.
- [ ] I recorded my AI use.

## 9. Further learning

Read the WHO *Laboratory Biosafety Manual*, 4th edition, and its risk assessment monograph. They are free to download from the WHO site. The IGSC site explains what synthesis screening is, from the industry's side. The BMBL, 6th edition, is published by the US CDC and NIH. The CDC page for it does not always load for automated tools, so open it in your browser. If you want practice at checking sources, use the Cornell tutorial on evaluating information. Next, in [Liquid-handling protocols in Python](/library/tracks/lab-automation-in-code/02-liquid-handling-protocols-in-python), you write your first protocol and simulate it.
