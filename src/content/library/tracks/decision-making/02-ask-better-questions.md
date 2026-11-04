---
title: "Ask better questions"
description: "Map the people behind a decision, sort what you know from what you only believe, and turn the gaps into questions with an owner and a date, so you learn enough to decide and then stop."
section: "Decision-making"
order: 2
track: "decision-making"
level: "core"
duration: "2.5 hours"
outcomes:
  - "Map who decides, who advises, who is affected and who can block a decision"
  - "Sort every statement into known, believed, not known and not yet imagined"
  - "Write questions about the past that can show you are wrong"
  - "Run a short pre-mortem to find the questions nobody asked"
  - "Decide when you know enough to move on, and write down what you still do not know"
resources:
  - "nngroup/user-interviews-101"
  - "youtube-nngroup/collaborating-with-stakeholders"
  - "youtube-nngroup/ux-stakeholder-engagement-101"
  - "atlassian/pre-mortem"
  - "farnam-street/inversion"
  - "farnam-street/circle-of-competence"
  - "meadows/systems-thinking-resources"
prerequisites:
  - "tracks/decision-making/01-frame-the-problem"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics) and week 4 (Defend the roadmap). **Time:** about 2.5 hours, plus the conversations.

## 1. Why this matters

You have a problem statement and a decision with an owner and a date. Now comes the part most people skip or do badly: finding out what you do not know.

There are two ways to fail here. The first is to decide too early: you trust your own picture, you choose, and a week later someone says "but did you know that..." and the choice falls apart. The second is to ask forever, and the deadline passes with no decision. Both have the same cure: a short, written plan for learning, with an end.

In the 2030 team, agents can answer thousands of questions in a minute. That makes the **choice of question** the scarce skill of the Product Development Manager (PDM). An agent answers what you ask. Ask the wrong question and you get a fluent answer to the wrong thing.

### The four questions for this lesson

1. **What do I decide here?** Who must be heard, which questions matter, which assumptions I test, and when I know enough.
2. **What do I delegate to agents, and with what exact brief?** Listing hidden assumptions, drafting questions and playing a hostile reviewer (section 5).
3. **How do I verify what comes back?** I keep only what I can check, and I take the questions to real people.
4. **Which other disciplines are involved?** Finance, operations, legal, design and support each know something about this decision that I do not.

**Rung on the agent ladder:** **use**, moving toward **delegate**. Handing an agent a whole task with a written brief, such as "list every assumption in my notes", is the delegate rung.

## 2. Key ideas

### Four kinds of knowledge

Before you ask anything, sort what you have. Every statement in your head about the decision falls into one of four boxes.

| Box | Meaning | What to do |
| --- | --- | --- |
| Known | I have evidence I can show | Write the source |
| Believed | I think it is true, but have not checked | Mark it as an assumption |
| Not known | I know I do not know | Write it as a question |
| Not yet imagined | I do not know that I do not know | Find it through other people |

You can do the first three alone. The fourth is the dangerous one, because you cannot list it. You find it through other people, a pre-mortem (below) and by turning the problem upside down.

The test for "known" is simple. Can you point to something a stranger could check: a note, a rule, a record, a number with a source? If not, it is "believed".

### Who is in the decision

A decision touches more people than the one who decides. Write down four groups.

- **Decider.** One person who makes the choice. This is usually you.
- **Advisers.** People who know things you do not, and whose view you want before the choice. They have a voice but no vote.
- **Affected.** People whose daily work or life changes because of the choice. They are often not in the room.
- **Blockers.** People who can stop the choice later: someone who signs the contract, owns a rule or controls a budget.

The affected and the blockers are the two groups people forget. A choice can be logical, and wrong, because the person who has to carry it out was never asked. The NN/g videos in the further learning list show stakeholders working as partners during the work, not as an audience at the end. The [glossary](/library/glossary) defines a **stakeholder** as any person or group affected by the product or able to affect it.

### What makes a question good

A good question has four marks.

1. **It is open.** "How do you handle the lunchtime rush today?" works better than "Is the lunchtime rush a problem?"
2. **It is about the past.** People predict their own behaviour badly and report what they did fairly well. "Tell me about the last time a customer asked for a cup swap" gives you evidence. "Would you use a swap service?" gives you politeness.
3. **It can show you are wrong.** Before asking, say what answer would make you change your mind. If no answer could, you are not asking; you are decorating.
4. **It has an owner.** Someone is responsible for getting the answer, and by when. A question with no owner does not get answered.

The NN/g guide to user interviews explains what interviews can and cannot tell you.

### Assumptions that carry the weight

Only some assumptions matter to this decision. For each believed statement ask two things: if it is false, does my choice change, and how little do I know about it? Test first the ones where both answers are "a lot".

### Turn it upside down

**Inversion** is a simple habit: instead of asking "how will this succeed?", ask "how could this fail?" The Farnam Street article in the list explains it.

A **pre-mortem** is the team version. You imagine the decision has been made, months have passed and it has failed. Everyone writes down what went wrong. The Atlassian guide gives a format: silent writing, grouping, voting on the biggest threats, and one action for each with an owner and a date. It works because it gives people permission to say the unwelcome thing.

### Know the edge of what you understand

Some decisions need knowledge you do not have: hygiene law, tax, a technical design. Saying so is not a weakness; pretending is. The **circle of competence**, in the Farnam Street article, is the edge of what you really understand. Ask an expert at the edge. This matters more when an agent answers for you, because it talks confidently about every subject, including those where you cannot tell whether it is right.

### Systems: the same question has a ripple

A change in one place moves other places. When you ask "who is affected?", also ask "what will they do in response?" You need the habit of asking what else moves. The systems thinking page in the list is a good doorway.

## 3. Step by step

### Step 1: Copy your problem statement to a new file

Open `decisions/0001-<short-title>/questions.md` and paste your problem statement and decision question at the top. Everything below must serve them.

### Step 2: Map the people

Make a table: person or group, role, what they know that I do not, and how I will reach them. Aim for six to ten rows. If everyone is an adviser, you are missing the affected and the blockers.

### Step 3: Sort what you know

Write every statement you hold about the decision in the four boxes. Be stern with "known": each line needs a source. Most of it moves to "believed". That is progress.

### Step 4: Pick the assumptions that matter

From "believed", score each line from 1 to 5 for "how much my choice changes if this is false", and from 1 to 5 for "how little I know". Multiply. Keep the top five.

### Step 5: Write the questions

For each top assumption and each "not known" line, write a question. Check it against the four marks. Add the person you will ask and a date.

### Step 6: Run a short pre-mortem or inversion

Alone or with two colleagues, imagine the decision has failed three months from now. Write down five reasons. For each one, ask whether it is already on your list. If not, add a question.

### Step 7: Ask, and write down what you hear

Have the conversations. Write each answer next to its question with the date and the person. Move statements between the four boxes as evidence arrives.

### Step 8: Decide when to stop

Stop when the next answer could not change the choice, or when learning more costs more than being wrong and the choice is easy to undo, or when the deadline has come. Write one line saying which. Then list what you still do not know, so the record is honest.

## 4. Worked example: TrailMug

TrailMug is fictional; every detail below is invented for the example.

The founder's decision, from lesson 1: "How do partner cafés get rewarded for washing and handing out TrailMug cups, in time to start the two-café trial?"

**Step 2, the people:**

| Who | Role | Knows what I do not | How I reach them |
| --- | --- | --- | --- |
| The founder | Decider | Her own budget limits | Self |
| Two trial café owners | Affected, advisers | What they want back; what hurts at lunchtime | Visit during a quiet hour |
| Café counter staff | Affected | How long a swap really takes | Ask the owners, then watch one lunchtime |
| Local food-safety office | Blocker | Rules on washing and storing cups | Written question to the office |
| A part-time accountant | Adviser | What each reward option costs | Ask for a short call |

**Step 3, sorting the statements:**

| Box | Statements |
| --- | --- |
| Known | Two owners asked "what is in it for us?" (conversation notes) |
| Believed | Cafés want money. Washing takes about a minute per cup. Cafés would rather be paid per swap than monthly. |
| Not known | What the food-safety rules say about washing for another business. What the cafés do with spare counter space. |
| Not yet imagined | (to be found) |

**Step 4, assumptions that matter:** "Cafés want money" scores 5 and 4 (high effect, little evidence), so 20. "Washing takes a minute" scores 3 and 4, so 12. "Per swap rather than monthly" scores 4 and 5, so 20.

**Step 5, the questions:**

| Question | Who | By | What would change my mind |
| --- | --- | --- | --- |
| "Tell me about the last time you took on extra work for another business. What made it worth it?" | Both owners | Day 4 | If they say "only when someone asked nicely", money is not the main driver |
| "Walk me through the lunch rush today. Where does a stranger's cup fit?" | Counter staff | Day 6 | If it does not fit at all, a reward will not fix it |
| "What do the rules say about washing a cup that belongs to another business?" | Food-safety office | Day 7 | A rule that forbids it ends this option for all cafés |

**Step 6, the pre-mortem.** Three months later, the trial failed. Why? One reason on her list: "a café washed a cup badly and a member got ill." It is not on her question list. It adds a question for the food-safety office about standards and one for the accountant about insurance. She had not thought of insurance at all. That is the fourth box in action.

**Step 7, what she hears.** One owner says money is not the point: "I would like more customers coming in at quiet hours." The other wants a monthly amount "so I know what I am getting". So "cafés want money" moves from believed to a split answer. The accountant adds a worry: a reward per swap could push cafés to promote swaps at peak time.

**Step 8, stopping.** She stops after six conversations and one written answer. She writes: "I stop because both owners gave different answers, and a third conversation would not change the options I must compare. Still not known: how often a swap really happens in a week; whether the food-safety office reads the rule the same way in writing."

Her file shows who she asked, what she heard and what remains open.

## 5. Working with AI agents on this

The agent can help you ask. It cannot ask for you, because the answers are in people. It drafts, widens and attacks.

**What I decide:** which people to ask, which questions to keep, which assumptions to test, what counts as enough, when to stop.

**What I delegate, with an exact brief.** Paste your problem statement, your decision question and your four-box notes after this text:

```text
You are helping me prepare to decide. Below are my problem statement, my
decision question and my notes, sorted into known, believed and not known.
I wrote all of it. Do not change it. Do not recommend an option.
Do these four tasks and label each one:
1. ASSUMPTIONS. List assumptions hidden in my statements that I did not
   write in the "believed" box. Quote the sentence each one comes from.
2. PEOPLE. List kinds of people who are affected by this decision or could
   block it, and who are missing from my list. Say why each one matters.
3. QUESTIONS. For each of my "not known" items, write two open questions
   about the past, not about the future. Say what answer would show my
   assumption is false.
4. PRE-MORTEM. Imagine this decision failed three months from now. Give
   six different reasons, with the least obvious first.
Rules: use only my text and general knowledge. Mark anything you are not
sure about with "not sure". Do not invent facts, rules, laws or numbers about
my product, my place or my customers. Answer as numbered lists.
```

**How I verify what comes back.** I read each list against my notes and cross out anything generic. I check every claim about rules, laws or numbers against an official source, since a model can state them confidently and be wrong. I show the "missing people" list to someone who knows the place or industry. I test one question on a friend, because a question that reads well may fail in conversation. I run my own pre-mortem too and compare. The agent cannot know what the owner said or whether the food-safety office reads a rule strictly. Only a conversation or a written reply can.

**Disciplines involved.** I ask finance what each option costs, operations what the busy day looks like, legal or safety what rules apply, design what the person will see and support what they will have to explain. The brief gives me kinds of people, not names. I must find the actual people.

**Disclose.** Add to the file: "AI use: drafted assumptions, missing stakeholders, questions and a pre-mortem from my notes on 3 November 2026. I rejected the items marked in the review section." See [Disclose AI use](/library/disclose-ai-use).

**Where this sits on the ladder.** Handing the agent four tasks with one written brief is the **delegate** rung: a bounded result that you check. Running one session per stakeholder group is orchestration, and then the sessions need one shared file of definitions. A written rule such as "no claim about a rule or law goes into the file without a source I opened" is a first piece of policy, and your check is the gate. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

## 6. Common mistakes

- **Asking leading questions.** "Don't you think paying per swap is fair?" gets a yes. Ask what happened last time.
- **Asking about the future.** "Would you join?" tells you how polite people are.
- **Only asking friendly people.** Find someone who might say no.
- **Forgetting the blockers.** The person who can stop you later should hear about it now.
- **Letting the agent answer for the people.** It can guess what an owner might say, and be wrong in ways you cannot see.
- **Asking without an end.** Give questions an owner, a date and a stopping rule.
- **Changing the answers to fit.** Write what you heard, not what you hoped.
- **Skipping what you do not understand.** Outside your circle of competence, ask someone who knows.

## 7. Practice: a question file for your decision

**Deliverable:** one file in your product's git repository: `decisions/0001-<short-title>/questions.md`. Use the decision you framed in lesson 1.

The file must contain:

1. Your problem statement and decision question, copied to the top.
2. A people table with at least six rows, each marked decider, adviser, affected or blocker. At least one affected person and one blocker.
3. Your four-box sort, with a source for every "known" line.
4. The top five assumptions with their scores.
5. At least six questions, each with a person, a date and "what would change my mind".
6. A pre-mortem list of at least five ways the decision could fail.
7. The answers you collected, with date and person, and a final "I stop because..." line.
8. A list of what you still do not know.
9. An AI-use line.

Commit with a clear message, for example `Add stakeholder map and questions for decision 0001`.

**Stretch:** run the agent brief in section 5. Save the answer in `decisions/0001-<short-title>/review-notes-questions.md`, and mark each item "kept", "rejected" or "checked", with a reason. Count how many items you had already written yourself.

## 8. Checklist

- [ ] My problem statement and decision question are at the top of the file.
- [ ] I listed deciders, advisers, affected people and blockers.
- [ ] Every "known" line has a source a stranger could check.
- [ ] I scored my assumptions and kept the top five.
- [ ] Each question is open, about the past, able to show me wrong and has an owner and a date.
- [ ] I ran a pre-mortem or an inversion and added what it found.
- [ ] I wrote down what I heard, not what I hoped to hear.
- [ ] I wrote why I stopped asking and what I still do not know.
- [ ] Facts about rules or numbers have a source I opened.
- [ ] I recorded any AI use in the file.

## 9. Further learning

If you have time for two resources, read the NN/g guide to user interviews before you have your conversations, then run the Atlassian pre-mortem with two colleagues on your own decision. The next lesson takes what you learned and uses it to compare options and write down the trade-off.
