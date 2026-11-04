---
title: "Talk to customers"
description: "Recruit the right people, run five short interviews that ask about the past, and capture evidence you can trust without leaking anyone's private details."
section: "Product discovery"
order: 2
track: "product-discovery"
level: "foundation"
duration: "2 hours plus the interviews"
outcomes:
  - "Recruit five people who really have the problem, not five friends"
  - "Ask questions about past behaviour instead of opinions about the future"
  - "Take notes that separate what was said, what you saw and what you guess"
  - "Store interview evidence in git safely and respectfully"
resources:
  - "nngroup/interviewing-users"
  - "nngroup/user-interviews-101"
  - "youtube-nngroup/five-user-interview-mistakes"
  - "atlassian/customer-interview"
  - "gov-uk/start-by-learning-user-needs"
  - "gov-uk/find-user-research-participants"
  - "nngroup/why-5-users"
prerequisites:
  - "week-1-see-the-whole-product"
updated: 2026-11-03
quiz:
  - question: "Which question is best to ask in a customer interview?"
    options:
      - "Would you pay for this?"
      - "Do you like reusable cups?"
      - "Tell me about the last time you bought coffee on your way to work."
      - "What features do you want?"
    answer: "Tell me about the last time you bought coffee on your way to work."
    why: "People are poor at predicting their own behaviour. A question about the past gets a story, and stories contain facts."
  - question: "How many interviews does the Dojo ask for in week 1?"
    options:
      - "One"
      - "Five"
      - "Fifteen"
      - "One hundred"
    answer: "Five"
    why: "Fewer than five gives you stories, and more than about eight usually repeat themselves. Five gives you patterns to check later, not statistics."
  - question: "A teammate asks an agent to simulate five customers and calls the answers evidence. What does the lesson say?"
    options:
      - "That is fine if the model is a strong one."
      - "That is a rehearsal, not research."
      - "That is fine if you add one real quote."
      - "That is a fast way to finish the five interviews."
    answer: "That is a rehearsal, not research."
    why: "A model produces the most likely thing a customer might say, which is what you already believe plus polite averages."
  - question: "How should you name the people in your interview notes in git?"
    options:
      - "Use a code such as C1 and keep the key that links codes to people in a private place."
      - "Use first names only."
      - "Use full names so you can find people later."
      - "Use their email addresses."
    answer: "Use a code such as C1 and keep the key that links codes to people in a private place."
    why: "Keep names out of git. The key that links codes to people must not be in the repository."
---

**Supports:** Developer, week 1 (you book the interviews) and week 2 (you hold them and write personas). **Time:** about two hours to prepare, then five conversations of 30 minutes each.

## 1. Why this matters

You cannot see your customer from your desk. You can guess, and an AI agent can guess very fluently, but a guess is not evidence. The only way to learn what people really do, worry about and pay for is to talk to them.

For a Product Development Manager (PDM) this is not a soft skill. It is how you decide where millions of dollars of agent-built work should go. An agent will build a feature in an afternoon. Whether that feature matters depends on a fact that exists only in a customer's head. If you skip the conversation, you are directing a very fast workforce with a blindfold on.

There is a second reason. Interviews give you **words**. The phrases customers use are the phrases you put on your website, in your emails and in your epic titles. A manager who has heard twenty customers say "I hate carrying a dirty cup in my bag" writes better than any language model asked to "write copy for a reusable cup".

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Who to talk to, what to ask, what the answers mean | Drafting a first list of questions; tidying your own notes; scheduling emails you approve | Notes match what was said; no private details leak; patterns are real, not one loud voice | Design research, sales, support, privacy and legal |

## 2. Key ideas

### Ask about the past, not the future

People are poor at predicting their own behaviour. "Would you use an app that…?" gets a polite yes. "Tell me about the last time you bought coffee on your way to work" gets a story, and stories contain facts: where, when, what went wrong, what they did instead.

| Weak question | Why it fails | Strong question |
|---|---|---|
| "Would you pay for this?" | Free to say yes | "Have you ever paid for something to solve this? What was it?" |
| "Do you like reusable cups?" | Leading; invites a nice answer | "What do you do with your cup when it is empty?" |
| "How important is sustainability to you?" | Abstract; everybody says "very" | "Tell me about the last time you chose one product over another for environmental reasons." |
| "What features do you want?" | People describe solutions they cannot design | "What is the hardest part of doing this today?" |

### Behaviour beats opinion

What people **do** is stronger evidence than what they **say**. A person who tells you she cares about waste but throws away two cups a day is telling you two things. Both matter. Keep both in your notes and mark which is which.

### Five is a start, not a proof

For finding the biggest problems, small groups work well. Researchers at NN/g have long argued that small, repeated rounds beat one big study, because the first few people reveal most of the major problems and you can fix and try again. The Dojo asks for **five interviews** in week 1: fewer than that gives you stories, and more than about eight usually repeat themselves. Five does not give you statistics. It gives you patterns to check later.

### The right people

Friends and family are the easiest to find and the least useful. They want to be kind. Aim for people who:

- **Have the problem now**, not "would probably have it".
- **Tried to solve it** in some way (even with a workaround).
- **Do not know you well**, or at least have no reason to flatter you.

Include different kinds of people. If your product has a user and a customer who are not the same (a café owner who accepts cups and a commuter who uses them), interview **both**, and keep their notes separate.

### Privacy and respect

You are asking people for their time and their stories. Treat them well:

- **Ask permission** before you take notes, and say what you will do with them.
- **Never record** without a clear yes.
- **Keep names out of git.** Use a code such as `C1`, `C2`, `P1`. Keep the key that links codes to people in a private place, not in the repo.
- **Leave out private details** such as health, money or home address, unless they are essential and the person agreed.
- **Offer to delete** their notes on request.

These habits are the core of ethical research, and they protect you, too.

## 3. Step by step

### Step 1: Turn your unknowns into questions

Open the assumption list from the last lesson. For each of your three riskiest assumptions, write the learning goal in plain words: "Learn whether commuters have already paid to solve the dirty-cup problem." Interview questions serve these goals. If a question serves no goal, drop it.

### Step 2: Find five people

Write the profile in one line: "Adult who buys coffee on the way to work at least four times a week." Then find people through:

- Places they already are: a café queue, a local community group, an online forum where the topic is discussed (follow the group's rules).
- People you know who can introduce you to people you do not know. "Who do you know who commutes every day?"
- Short, honest invitations: who you are, what you want to learn, how long it takes, what you will do with the notes.

Book all five before you start. Some will cancel, so invite seven.

The UK government service manual has plain, practical advice on finding and recruiting participants. It is worth ten minutes.

### Step 3: Prepare a one-page guide

Use this shape for a 30-minute talk:

1. **Welcome (3 minutes).** Say thanks, explain why, ask permission to take notes, and say there are no wrong answers.
2. **Context (5 minutes).** "Tell me about yourself and your day." Easy questions first.
3. **The last time (12 minutes).** "Tell me about the last time you…" Follow the story with "What happened next?" and "How did that feel?"
4. **Money and alternatives (5 minutes).** "What do you use today? Have you paid for something to fix this?"
5. **Close (5 minutes).** "What should I have asked and did not? May I contact you again?"

The Dojo [week 2 page](/library/week-2-know-the-people) has a twelve-question script you can adapt.

### Step 4: Hold the conversation

- **Listen about 80 percent of the time.** Silence is a tool. After they finish, wait three seconds. They often add the real answer.
- **Probe, do not lead.** Say "Tell me more about that" instead of "So you hated it?"
- **Ask for examples.** "Can you remember a specific time?" turns a general claim into a fact.
- **Do not defend your idea.** If someone says it sounds pointless, say "Thank you, tell me why." You are there to learn, not to sell.
- **Pay attention to language.** Write down the exact phrases people use, in quotation marks.

If English is your second language, you can use a short card with your questions, speak slowly and ask people to repeat. Clear and simple beats fancy.

### Step 5: Write it up within an hour

While your memory is fresh, write a notes file for each interview. Use three headings:

- **Said:** what the person said, with exact quotes in quotation marks.
- **Saw:** what you observed (hesitation, a workaround on screen, a cup in the bag).
- **My guesses:** what you think it means. Label every item as a guess.

Mixing the three is the most common way notes become useless later.

### Step 6: Compare across people

After each interview, add a line to a simple table: person code, how they solve the problem today, what they paid for, what annoys them most. Patterns show up after the third or fourth row. The next lesson shows how to turn this table into a decision.

## 4. Worked example: TrailMug

The TrailMug founder (fictional) needs to test two assumptions: commuters will pay to avoid carrying a dirty cup, and cafés will accept returned cups.

**Profile for commuters:** "Buys coffee on the way to work at least four days a week and owns a reusable cup." She finds three by asking a train-station café owner to introduce regulars, and two through a local cycling group.

**Profile for café owners:** "Owns or manages a café with at least 50 cups a day." She finds three through a neighbourhood business group.

**Questions that earned their place:**

- "Tell me about the last time you took your own cup. What happened to it afterwards?"
- "What did you do the last time you forgot it?"
- "Have you ever paid for a gadget or service to make this easier?"
- For cafés: "Walk me through what happens when a customer brings their own cup. What slows you down?"

**What one note file looked like (illustrative):**

```text
Interview C3, commuter, 2026-11-04, 28 minutes. Consent to notes: yes.
SAID
- "I stopped bringing the cup because it leaks in my bag."
- "I paid 30 pounds for an insulated one and still left it at home."
SAW
- Hesitated before the word "pay"; looked at the ceiling.
MY GUESSES (guess)
- The pain is carrying, not buying. Subscription may fit better than a sale.
```

**What changed.** After five commuter conversations, three had bought a reusable cup and stopped using it within a month. The reason was the same: a used cup is dirty and awkward. That strengthened the idea. But two of the three café owners said they would not accept cups from strangers because of hygiene rules, and one said the counter is too busy for swaps at lunch. That is a deadly assumption, and the founder found it in a week, for free. Her next step was a conversation with a local food-safety adviser, not a design sprint.

## 5. Working with AI agents on this

**Delegate:**

- **A first draft of the guide.** "Here are my three learning goals. Draft 15 open questions about past behaviour. Do not include leading questions." Then cut, reorder and rewrite them in your voice.
- **Cleaning your own notes.** After you write notes by hand, an agent can fix spelling or put them in a consistent table. Give it only the notes you are allowed to share, without names.
- **Finding public sources** on the people you will interview, such as the rules that apply to cafés in your city, with links for you to read.
- **Writing the invitation email** for you to edit.

**Do yourself:**

- Choose who to interview, and hold every interview.
- Take the notes in your own words.
- Decide what the answers mean.

**Never** ask an agent to "simulate five customers" and call the answers evidence. A model produces the most likely thing a customer might say, which is what you already believe plus polite averages. Some teams use simulated users to rehearse their questions. That is a rehearsal, not research. The Dojo rule: no invented personas, no invented quotes, no invented journey steps.

**A brief you can adapt:**

```text
I am preparing customer interviews for a product. My learning goals are:
1) ... 2) ... 3) ...
Draft 15 open questions that ask about past behaviour ("tell me about the
last time..."). Do not ask about future intentions, and do not ask
questions with yes or no answers. For each question, state which learning
goal it serves. Flag any question that could be read as leading.
```

**How to check the output.** Test every question: Can it be answered yes or no? Does it suggest the answer? Does it ask about the future? Rewrite or delete it. Then speak the list aloud. If a question sounds odd in your mouth, it will sound odd to the person.

**Privacy check.** Before you paste notes into any AI tool, remove names, employers and any detail that could identify someone. Check the tool's data rules. If you are not sure, do not paste.

**Disclose.** In `discovery/interviews/README.md` write which parts, if any, an agent helped with.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **use**, with a little **delegate**. Drafting a script or tidying notes is a small task with a clear brief. If you ever run several agents over many interview notes, you are orchestrating, and the rule that every claim links to a quote becomes a gate you check. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the two upper rungs.

## 6. Common mistakes

- **Pitching instead of listening.** If you talk more than a fifth of the time, you are selling.
- **Asking "would you".** Replace it with "have you" and "tell me about the last time".
- **Interviewing only friendly people.** Include at least two who are not convinced.
- **Skipping the writing.** After a day you will remember what confirmed your idea and forget what did not.
- **Putting names in git.** Use codes, and keep the key private.
- **Treating five answers as a statistic.** "Four out of five" is a pattern, not a percentage of the market.
- **Interviewing only the user.** If another person pays or decides, talk to that person too.
- **Stopping at the first confirming answer.** One enthusiastic person can mislead you. Look for the third and fourth.

## 7. Practice: five interviews, five note files

**Deliverable:** a folder `discovery/interviews/` in your git repo containing:

1. `guide.md`: your one-page interview guide, with the learning goals at the top.
2. `C1.md` to `C5.md` (or the codes you choose): one notes file per interview, each with the **Said / Saw / My guesses** headings and a consent line.
3. `summary-table.md`: one row per person with how they solve the problem today, what they have paid for and their top frustration.
4. `README.md`: who you spoke to (by code and profile, not by name), what an agent helped with, and what you would ask differently next time.

If you cannot finish five interviews yet, commit what you have and write how many are booked. Honest partial work beats a complete set that was invented.

**Self-test:** reread each notes file and highlight every sentence that is your guess. If more than a third is highlighted, the notes lean too much on interpretation. Go back and add exact quotes.

## 8. Checklist

- [ ] I wrote my learning goals before I wrote my questions.
- [ ] My participants really have the problem.
- [ ] Every question asks about the past or about specific behaviour.
- [ ] I asked permission, and recorded nothing without a yes.
- [ ] My notes separate Said, Saw and My guesses.
- [ ] No names or private details are in git.
- [ ] I interviewed both the user and the customer where they differ.
- [ ] I did not use an AI to invent people or answers, and I wrote down how I did use AI.

## 9. Further learning

Start with the NN/g article "Interviewing Users" and the five-minute video on common interview mistakes. Then read the UK service manual page on finding participants before you send your invitations. If you want a model of a professional interview plan, the Atlassian Team Playbook play on customer interviews gives you steps and questions. In the next lesson you will draw the whole product, so that what you learned from people can be tied to the parts of the product that serve them.
