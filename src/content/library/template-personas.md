---
title: "Template: Personas and demographics"
description: "The persona workbook, field by field: a demographics summary, up to three persona tables and an evidence log, with a filled TrailMug example."
section: "Templates"
order: 2
fillable: "template-1-personas-and-demographics"
level: core
duration: "90 min to fill the first persona, then 30 min for each next one"
outcomes:
  - "Fill the demographics summary and mark where each answer came from."
  - "Write a persona table in which every claim has evidence behind it."
  - "Separate the user (who uses) from the customer (who pays)."
  - "Keep an evidence log that a coach can check."
resources:
  - nngroup/personas-make-users-memorable
  - nngroup/user-interviews-101
  - nngroup/interviewing-users
  - ixdf/personas
  - gov-uk/service-manual-user-research
  - gov-uk/find-user-research-participants
prerequisites:
  - templates-overview
  - week-2-know-the-people
---

This is the template for **Week 2: Know the people**. It has four parts: a demographics summary, three persona tables, and an evidence log. You use it to turn real conversations and numbers into a small set of people you can describe, and you keep the proof next to every claim.

## Download the blank template

- Word file (original format): [template-1-personas-and-demographics.docx](/templates/template-1-personas-and-demographics.docx)
- Markdown copy, to keep in git: [template-1-personas-and-demographics.md](/templates/template-1-personas-and-demographics.md)

Make your own copy first. Never type in the original. Put your copy in your planning repository, for example `people/personas.md`, so your coach can see the history.

## Why it matters

A product is built for people, and most teams guess who those people are. A guess is cheap on the first day and expensive after six months, because every screen, every email and every epic is built on it. A persona is a short description of a real group of people. It is not a drawing of one imaginary customer. A good persona changes what you build. A bad persona decorates a slide.

The template forces three habits. First, it asks for **evidence** next to every claim. Second, it separates the **user** from the **customer**, because they are often different people. Third, it ends with the question "What does this persona make me want to change?", so a persona is never only a description. It points at work.

This is also a place where the program's main rule applies in full: **you never ask an AI agent to invent a persona, a quote or a number.** Agents write smooth, believable people. Believable is not the same as true. See [People write epics](/library/people-write-epics) for the reasons.

## Key ideas

- **Persona:** a made-up name for a real group of people. The name is made up. The person behind it is real.
- **User:** the person who uses the product day to day.
- **Customer:** the person or company that pays. Often not the user.
- **Evidence:** an interview, a support message, an analytics number, a sales call, with a date. If you cannot say where it came from, it is a guess.
- **K or G:** a habit from the earlier template version. Mark each line **K** (known from evidence) or **G** (guess). Guesses are allowed. Hidden guesses are not.

## How to fill it: steps

1. **Collect evidence first.** Talk to five people, read thirty support messages, open the analytics. Do this before you open the template. Write each source as one line in the **Evidence log** at the end.
2. **Fill the demographics summary.** It is one table for the whole product. Each row has your answer and where you got it.
3. **Pick three to five groups.** Look for differences in goals, not in age. Two people of the same age with different goals are two personas.
4. **Copy the persona table once per persona.** Fill every row. If you cannot, write "no evidence yet" and add a task to find it.
5. **Link the persona to a journey step.** The row "Which journey step hurts them most" feeds your [journey maps](/library/template-journeys).
6. **Say what you want to change.** The last row is your first draft of a gap. It becomes an epic candidate in Week 3.

## Every field explained

### Demographics summary

| Row | What to write | TrailMug example (fictional) |
|---|---|---|
| Who pays (customer)? | The person or company that pays, in one line | Commuters pay a monthly fee. Cafés receive a share. |
| Who uses (user)? | The person who uses the product | The same commuter. A café worker scans the cup. |
| Typical age range | A range, not an exact age | Commuters 25 to 40. Café workers 18 to 30. |
| Countries and cities | Where they live, in plain words | Two large cities in one country |
| Languages | Languages they read the product in | English and Spanish |
| Job roles | What they do all day | Office workers, café owners, baristas |
| Company size or household type | Size of the company, or who lives together | Cafés with 2 to 10 staff. Single adults. |
| Budget range | What they can pay, low to high | Small monthly fee; owners accept a 10 percent share |
| Device and internet quality | What they hold and how well it connects | Phones, mobile data, good signal in the city |

The third column in the original is **Evidence (where I got it)**. Never leave it empty. "Five interviews in March" is enough.

### Each persona table

| Field | What to write | TrailMug example |
|---|---|---|
| Name (made up, but the person is real) | A first name and one word that fits | Maya, the daily commuter |
| User, customer, or both? | Say which. If both, say so | Both. She uses the cup and pays herself. |
| Role, age range, location, language | Four short facts | Office worker, 25 to 35, large city, English and Spanish |
| Education and tech comfort | How well she handles apps | University degree, comfortable with apps |
| Goal: what they want to get done | One sentence, her words | Carry less waste without carrying a dirty cup |
| Fears and frustrations | Two or three | Hidden fees, cups that are not clean |
| How they find the product | The real path | A friend at work, then a café poster |
| What they pay or give (money, time, data) | Money, time and data | A small monthly fee, 30 seconds per return, her location |
| Tools they already use | What she uses today | A plain cup she forgets, a transit app |
| A real quote (and where it came from) | A quote you heard or read, with the source | "I want to do the right thing, but I always forget the cup at home." (interview 3) |
| Evidence: interview, message, analytics link, date | List of sources with dates | 5 interviews (March), 30-person survey, support inbox export |
| Which journey step hurts them most | One step | "Return a cup" in the app: the café map is slow |
| What this persona makes me want to change | One honest sentence | Make the café finder fast, and show the deposit rule before sign-up |

### Evidence log

| Column | What to write |
|---|---|
| Date | The day you collected it |
| Source (person or system) | Initials or a role (not a full name of a private person), or the system name |
| What I learned | One plain sentence |
| Persona it supports | The persona name |

## A filled example in short

Here is Maya, with five of her thirteen rows, as you might commit them.

```text
Persona: Maya, the daily commuter
User or customer: both
Goal: carry less waste without carrying a dirty cup
Fear: hidden fees (interviews 1, 2, 4)
Quote: "I want to do the right thing, but I always forget the cup at home." (interview 3, March)
Hurts most: returning a cup, because the café map takes 8 seconds to load (analytics, April)
Change I want: a fast café finder; deposit rule shown before sign-up
```

The second persona is Leo, the café owner. He is the **customer** for the café side of the product, and his goals are different: more visitors, less work at the till, a clear monthly report. A worked example of two personas, one a user and one a customer, shows you why the template asks "user, customer, or both?".

## Working with AI agents

- **May:** explain a word you do not know ("What is a persona?"). Check your spelling and grammar after you finish writing. Summarise a long interview transcript so you can read the original faster.
- **May not:** invent personas, journey steps, quotes or numbers. May not fill in your table for you.
- **Disclose:** write one line in your weekly note: "Used an AI tool to summarise interview 4. I read the original."
- **A safe brief to an agent:** "Here is my persona file. For each row, tell me whether it has a source in the evidence log. Do not edit the file and do not suggest new content."

## Common mistakes

1. **Personas made from memory.** Every persona needs a real conversation behind it.
2. **Personas that are job titles.** "Marketing manager" is not a persona. A goal and a fear make a persona.
3. **Mixing the user and the customer.** If the person who pays never uses the product, write two personas.
4. **Real names and private details in git.** Use a made-up name. Keep raw notes in a private place and put only a clean summary in the repository.
5. **No evidence log.** A quote with no date and no source cannot be defended.
6. **Eight personas.** More than five means you have not chosen. Pick the groups that change your decisions.
7. **Stopping at description.** Without the last row, nothing changes in your plan.

## Practice

1. Interview three people this week. Write each in the evidence log within an hour.
2. Fill the demographics summary. Mark every row you cannot support as a guess, and plan one action to turn it into evidence.
3. Write one persona table. Ask a classmate to find the weakest claim. Fix it.
4. Look at your repository map and find one repository that serves your persona's most painful step.

## Checklist

- [ ] I made my own copy and put it in git.
- [ ] The demographics summary has evidence in every row, or says "guess".
- [ ] I have three to five personas, each with at least two sources.
- [ ] Every quote has a source and a date.
- [ ] The user and the customer are separate where they differ.
- [ ] Each persona names one journey step that hurts.
- [ ] No real private names or details are in the repository.

## The 2030 Product Development Manager lens

- **You decide:** who the product is for, which groups matter, and what each group's pain is.
- **You delegate to agents:** transcribing and summarising interviews, finding repeated words in support messages, checking that each row has a source.
- **A sample brief:** "Read the evidence log and the persona file. List every claim in the persona file that has no matching row in the evidence log. Do not rewrite anything."
- **You verify by:** reading the original interview notes for any quote the agent summarised.
- **Disciplines involved:** research, design, marketing, sales, support and data analysis.
- **On the agent ladder:** this is **use**. Agents help you collect and check. The people in the persona are yours to describe.

## Further learning

Read [Deck 6](/library/deck-06-personas-touch-points-journeys) for the teaching behind this template, and [Week 2: Know the people](/library/week-2-know-the-people) for the weekly plan. The resources listed on this page are free to read. When your persona file is ready, continue with the [touch points and journeys template](/library/template-journeys).
