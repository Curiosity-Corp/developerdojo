---
title: "Map the stakeholders"
description: "List everyone affected by your product, learn what each wants, fears and can decide, and turn the list into a table that tells you who to talk to, how often and in what form."
section: "Stakeholder communication"
order: 1
track: "stakeholder-communication"
level: "core"
duration: "2.5 hours"
outcomes:
  - "List the people and groups who affect or are affected by your product"
  - "Write what each wants, fears and can decide, from evidence"
  - "Choose how and how often to keep each one informed"
  - "Spot the stakeholder you forgot, and the one who can stop you"
resources:
  - "youtube-nngroup/ux-stakeholder-engagement-101"
  - "youtube-nngroup/collaborating-with-stakeholders"
  - "atlassian/project-poster"
  - "atlassian/product-brief"
  - "youtube-atlassian/what-do-product-managers-do"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "week-2-know-the-people"
updated: 2026-11-03
---

**Supports:** Developer, week 4 (Defend the roadmap), Part 2: stakeholders. **Time:** about two and a half hours.

## 1. Why this matters

In week 2 you learned about the people who use your product. Stakeholders are a wider group: anyone affected by the product or able to affect it. That includes people who will never use it. A privacy adviser who must approve your data use is a stakeholder. A sponsor who funds you is a stakeholder. A neighbour café's owner who sees your cups at the next counter is a stakeholder.

Products stall on stakeholders you did not map. A launch waits for a legal review nobody booked. A partner learns about a price change from a customer. A sponsor withdraws support because the first she heard of a delay was the deadline. The map is cheap to make and it prevents most of these.

For a Product Development Manager (PDM) the map is also a delegation tool. It tells you who gets which message and what an agent may draft for you. It tells you which person can say no and when you need to ask them.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Who is on the map, what each one wants and fears, and how you will keep them informed | Turning your interview notes into a first table; finding gaps in the list; drafting a contact schedule | Each cell traces to something someone said or did, not to a guess; the person with the power to stop you is on the list | Finance, legal and privacy, sales and support, engineering, operations, design: each is a stakeholder and also a source of facts |

## 2. Key ideas

### A stakeholder is anyone who affects or is affected

Think in four groups.

| Group | Examples |
|---|---|
| **Use it** | Customers, partners, members, staff |
| **Pay for it or back it** | Sponsors, investors, a mentor, a budget holder |
| **Control it** | Legal, privacy, security, a platform you depend on, a regulator |
| **Build and run it** | Developers, designers, support, operations, and your AI agents' reviewers |

AI agents are not stakeholders. They have no interests. The people who review their work, who are accountable for what they ship and who are affected by the results, are.

### What they want, what they fear, what they can decide

For each stakeholder, three columns matter most.

- **Wants:** the result they hope for.
- **Fears:** what they are worried will go wrong. Fears often explain behaviour better than wants do.
- **Can decide:** what they can approve, block or change.

Add two more: **how you keep them informed** and **how often**.

NN/g's video on stakeholder engagement describes building engagement into a team's regular routines, and its video on collaborating with stakeholders talks about treating them as partners in the work. Both point the same way: bring people in early, not at the end.

### Power and interest, but be careful

A common sketch places stakeholders on a grid by how much power they have and how interested they are. It is a useful first sort: high power and high interest people get close attention, high power but low interest get short and regular updates. Use it with caution, because the grid hides fear and trust. A low-interest person with veto power is a risk, not a footnote.

### Evidence, not guesses

Fill the table from what people said and did. A sponsor's want is what she told you, not what you imagine. Where you do not know, write "guess" and plan to find out. Marking guesses is the same K/G habit you used in discovery.

### One-page alignment

Atlassian's pages on the project poster and the product brief show one-page formats that state the goal, the people and the risks so that everyone shares one picture. You will use a version of these in the next lesson. For now, note that a stakeholder table is the people part of such a page.

### The product manager role

Atlassian's video on what product managers do shows why the role is debated: it sits between disciplines and depends on influence more than authority. This is why the table matters. You will often need things from people you do not manage.

## 3. Step by step

### Step 1: List

Write every person or group who affects or is affected by your product. Use the four groups to jog your memory. Do not filter yet. Aim for ten to fifteen.

### Step 2: Look for who you forgot

For each of these, ask whether they are on the list: someone who can say no, someone who pays, someone who must run or support it, someone harmed if it fails, a regulator, a competitor, a supplier.

### Step 3: Fill the three columns

For each, write wants, fears and can-decide. Mark each cell **K** (you know it from something they said or did) or **G** (guess).

### Step 4: Find the people to ask

For every G in a high-power row, plan one conversation. Ask open questions, listen and update the table.

### Step 5: Choose the form and the rhythm

For each stakeholder, choose how they hear from you (a weekly note, a monthly call, a status page, a one-off review) and how often. Match the form to their time and the stakes.

### Step 6: Mark the gates

Mark any stakeholder whose approval you need before something can happen, such as a launch. Put the date by which you need it. Check lead times: reviews take longer than you think.

### Step 7: Reduce the list

Merge or drop people who will not change a decision and who do not need to know. Keep the table to what you will act on.

### Step 8: Save it

Save as `stakeholders/table.md` in the repo. Date it. Plan to update it at least every month.

## 4. Worked example: TrailMug

TrailMug is fictional. The founder's first table (excerpt):

| Stakeholder | Group | Wants | Fears | Can decide | Keeps informed by |
|---|---|---|---|---|---|
| Maya and other commuters | Use | A cup swap that is quick and fair | Being charged for a cup she returned (K: said in interview) | Whether to join and stay | Release notes, support replies |
| Leo and other café owners | Use | Less waste and no extra work for staff | Slower queues at the counter (K) | Whether to take part | Monthly call, shared status page |
| Mentor | Back | Honest progress | A surprise (K) | Whether to keep mentoring | Weekly note |
| Privacy adviser | Control | Lawful use of customer data | Collecting email without a notice (K) | Whether launch may start | Review before launch, booked 3 weeks ahead |
| Part-time designer | Build | Clear work and fair hours | Rework from unclear briefs (G) | What she can deliver per week | Tuesday planning |
| Café supplier | Control | Steady orders | Cups returned damaged (G) | Terms and price | Phone call before changing volume |

**Forgotten stakeholder found.** On the second pass the founder asked, "Who is harmed if the service fails?" She realised that if returns stop working, a café has a box of dirty cups and nowhere to put them. She added "café staff on shift" as a separate row from the owner. Their fear was the smell, the clutter, and being blamed. She had not heard that from Leo.

**Conversations planned.** The two Gs in high-power rows were the supplier's fear and the designer's. She booked two calls, wrote the answers into the table and changed G to K.

**Gate:** the privacy adviser's review. She wrote it into her roadmap with a date three weeks before the planned launch of sign-up.

## 5. Working with AI agents on this

**Delegate:**

- **First table from notes.** "From these interview notes and emails, list every person or group mentioned, with the evidence for what they want and fear. Mark each claim with the source line. Mark anything you inferred as GUESS."
- **Gap finding.** "Here is my stakeholder list. Name types of stakeholder commonly missed in a product like this. Do not add anyone to the table. Give them as questions."
- **A contact calendar** from the rhythm you chose.

**Do yourself:**

- Decide who is on the table.
- Talk to the people behind the Gs.
- Judge fears. They are about people, and you know the context.
- Choose what each person hears.

**A brief you can adapt:**

```text
Below are my notes from conversations with people connected to my
product. Build a table with: stakeholder, group (use, back, control,
build), what they want, what they fear, what they can decide.
For every cell, quote the line from my notes that supports it. If a cell
has no supporting line, write GUESS and do not fill in content.
Then list five kinds of stakeholder a product like this often forgets,
as questions for me. Do not add them to the table.
```

**How to check the output.** Pick five cells and find the quote. Check any cell marked as known that has no quote. Be especially careful with "fears": agents tend to invent plausible fears that nobody voiced.

**Privacy.** Notes from conversations may contain personal details. Share only what the agent needs, and follow your own rules for personal data. Never paste secrets or private contact details into a prompt.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **use** and **delegate**. The table also becomes a policy input later: it says who may be contacted and what an agent may never send without a person reading it. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the upper rungs.

**Disclose.** In the table: "AI use: first draft from my notes. Every cell was checked against its source."

## 6. Common mistakes

- **Only mapping users.** Include those who pay, control and run.
- **Guessing fears.** Ask. Mark guesses.
- **Forgetting the gate.** Someone with a veto and a long lead time.
- **Treating low interest as low risk.** A veto holder who ignores you is a risk.
- **One message for everyone.** Different people need different forms.
- **A table that never changes.** Update monthly.
- **A huge table.** If you will not act on a row, drop it.
- **Letting an agent invent the table.** Insist on sources.

## 7. Practice: build your stakeholder table

**Deliverable:** `stakeholders/table.md` in your git repo, with:

1. At least ten stakeholders across the four groups.
2. For each: wants, fears, can decide, how and how often you keep them informed. Each cell marked K or G.
3. A list of gates with approval dates and lead times.
4. A list of conversations you will have to turn Gs into Ks, with dates.
5. The stakeholder you nearly forgot, and how you found them.
6. Your AI-use line.

Commit with a message such as `Add stakeholder table`.

**Check:** show the table to a person who knows your product. Ask who is missing. Add them and record who suggested them.

**Stretch:** sketch a power and interest grid for your table. Mark anyone whose position on the grid surprised you, and say why.

## 8. Checklist

- [ ] I listed people from all four groups.
- [ ] Each row has wants, fears and can-decide.
- [ ] Each cell is marked known or guess.
- [ ] I planned conversations to turn guesses into facts.
- [ ] I marked every approval gate with a date and a lead time.
- [ ] I chose a form and a rhythm for each person.
- [ ] The table is dated and in git.
- [ ] I recorded my AI use.

## 9. Further learning

NN/g's videos on stakeholder engagement and on collaborating with stakeholders show how to build the relationship into regular work. Atlassian's project poster and product brief pages show one-page formats for sharing the picture, and its video on the product manager role explains why influence matters. In the next lesson you use the table to write the one-pager and the weekly note.
