---
title: "Shiftwren example, week 5: brand, website and mockups"
description: "Week 5 filled in for a fictional volunteer-shift service: the name test, a one-page brand sheet, a four-part website outline, three mockups linked to epics and an accessibility check."
section: "Shiftwren example"
order: 5
level: core
duration: "45 min to read, then make your own brand sheet"
outcomes:
  - "See a name chosen with a simple memory test and a one-line reason."
  - "See a one-page brand sheet, with a contrast check that uses real numbers."
  - "See three mockups, each linked to an epic, and one usability test."
prerequisites:
  - shiftwren-week-4-defend-the-roadmap
  - week-5-brand-website-mockups
---

**Fictional example.** Shiftwren, its people, tests and results are made up. Numbers marked "example" are invented. The colour contrast numbers are real arithmetic for the two colours shown. Do not copy this page.

**How this page was made.** An AI agent drafted it and a person at Developer Dojo reviewed it. In the story, the fictional learner **Noor** chose the name, the promise and the design. An agent only checked contrast and spelling and offered headline options.

Compare: [Week 5](/library/week-5-brand-website-mockups), the TrailMug lessons [Name and promise](/library/tracks/brand-website-and-mockups/01-name-and-promise) and [Mockups that link to epics](/library/tracks/brand-website-and-mockups/03-mockups-that-link-to-epics), and the real-product [first case-study page](/library/case-study-danhup-the-product-on-one-page), which finds a landing page still full of template text. Week 5 has no blank workbook. The brand sheet below is the shape to follow.

## Step 1: Choose the name

Noor wrote three candidates. She asked five people (example) which name they remembered a day later.

| Candidate | Easy to say? | Remembered next day | Note |
|---|---|---|---|
| Shiftwren | Yes | 4 of 5 | "Shift" is the job. A wren is a small, tidy bird |
| Coverbird | Yes | 2 of 5 | Sounds like a bird-watching group |
| Rotawise | No | 1 of 5 | "Rota" is not a common word everywhere |

She also searched the web and the domain list. In the story she found no clash for Shiftwren. That is not legal advice. She asks an adviser before launch.

**Why this name:** it is short, easy to say for a second-language speaker, and it names the job.

## Step 2: The brand sheet

| Part | Choice |
|---|---|
| Name | Shiftwren |
| Promise | Shiftwren asks the next person for you. |
| Tone, three words | Warm, plain, calm |
| Colour 1 | Deep teal `#1F4E5F`, for text and buttons |
| Colour 2 | Warm cream `#FFF6E5`, for backgrounds |
| Font | The plain system font on each device. No font download |

Words to use: "ask", "next person", "your list". Words to avoid: "never lose a volunteer again". Shiftwren cannot keep that promise, because people can still say no.

**Contrast check.** Normal text needs at least 4.5 to 1.

| Pair | Ratio |
|---|---|
| Teal text on cream | 8.46 to 1 |
| Cream text on a teal button | 8.46 to 1 |
| Teal text on white | 9.08 to 1 |

## Step 3: The website, version 1

Four parts, kept small. The source lives in git and is published from git on a free static host.

1. **Home.** Headline: "Fill every volunteer shift without the group-chat chase." One line: "When someone cancels, Shiftwren asks the next person on your list." One button: "Ask for a free trial". The page also shows what a volunteer sees, because the Week 2 journey found that gap.
2. **How it works.** Three steps: post your shifts; volunteers confirm with one tap; Shiftwren asks the next person when someone cancels.
3. **Offer.** "Free trial for community pantries. The price after the trial is not decided." No price is invented.
4. **Contact and policies.** Privacy notice, terms and an accessibility statement, linked in the footer.

The form asks only for name, email and pantry name. There are no trackers. Noor wrote every promise herself and checked each one against what the prototype does.

## Step 4: Three mockups, each linked to an epic

| Screen | Who and why | What they do | Epic | Still unknown |
|---|---|---|---|---|
| Coordinator week view | Ines wants to see who is on each shift | Posts a shift, sees who accepted | Epic 1 | How to show a shift nobody has accepted |
| Volunteer confirm page, on a phone | Mei and Ravi | Opens a link, sees day and time, taps one big button | Epic 3 | Whether Mei needs another language |
| "Delete my details" page | Any volunteer | Asks to be removed and sees what happens next | Epic 2 | How long copies stay at providers |

A mockup with no epic is decoration. These three all have one.

## Step 5: Test with one person

Noor showed the home page to one person who runs a school club and had never seen Shiftwren. Noor watched and said nothing. The person stopped at "free trial" and asked, "Free for how long?" Noor changed the button and the offer to "Free while we test it. We will tell you the price before it changes."
## Working with AI agents

An agent checked every colour pair on the page. Brief: "List every colour pair on this page with its contrast ratio. Do not change colours." It also checked spelling and drafted three alternative headlines. Noor chose none of them word for word. She opened the page on a phone to check the result. Her README line: "Contrast and spelling checked by an agent. Headline options drafted by an agent. Name, promise and design chosen by me."

An agent **may not** pick the name, write the promise or decide the design.

## Fill your own brand sheet from this page

Copy the six rows of Step 2 as your headings, then write your own answers. Use Step 3 for the site outline and Step 4 for the mockup notes.

## The 2030 Product Development Manager lens

- **You decide:** the name, the promise and which design to adopt.
- **You delegate:** contrast, spelling and link checks, with the brief above.
- **You verify by:** opening the page on a phone and testing with one person.
- **Disciplines involved:** brand and marketing, design, accessibility, engineering and legal.
- **On the agent ladder:** **use** and **delegate**.

Next: [Shiftwren week 6, catalogue and demo](/library/shiftwren-week-6-catalogue-and-demo).
