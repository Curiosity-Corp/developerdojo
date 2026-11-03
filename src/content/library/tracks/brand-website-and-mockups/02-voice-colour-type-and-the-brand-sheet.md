---
title: "Voice, colour, type and the brand sheet"
description: "Define a tone of voice in three words, pick two colours and one font with contrast checked, write plain copy and put it all on one page that people and agents follow."
section: "Brand, website and mockups"
order: 2
track: "brand-website-and-mockups"
level: "core"
duration: "3 hours"
outcomes:
  - "Describe your tone of voice in three words with examples of what to say and not say"
  - "Choose two colours and one font with contrast and legibility checked"
  - "Write copy in plain words and review copy written by an agent"
  - "Produce a one-page brand sheet that an agent can follow without guessing"
resources:
  - "figma/color-theory"
  - "figma/typography-basics"
  - "gov-uk/writing-for-user-interfaces"
  - "gov-uk/content-design-what-is"
  - "gov-uk/design-system"
  - "w3c/wcag-quickref"
prerequisites:
  - "week-5-brand-website-mockups"
  - "product-package-standard"
updated: 2026-11-03
---

**Supports:** Developer, week 5 (Brand, website and mockups): the one-page brand sheet. **Time:** about three hours.

## 1. Why this matters

The name and promise are the idea. The brand sheet is how the idea looks and sounds everywhere. Without it, every page, email and screen is written by whoever is working that day, and a customer sees a different company each time. With it, ten people, or ten agents, produce work that feels like one product.

The brand sheet matters even more with agents. An agent without a sheet will choose its own tone, colours and wording, and they will be generic and change from session to session. An agent with a precise one-page sheet is much easier to review, because you can check the output against it.

For a Product Development Manager (PDM) the sheet is a specification and a control. It is a specification because it tells builders what to produce. It is a control because it is the standard you review against and the reference a pipeline check can use for contrast and wording.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The tone, the colours, the font, the words you never use and the claims you will not make | Colour contrast calculations; draft copy; trying font pairings in a test page; checking copy against the sheet | Contrast figures from a trusted checker; every claim in the copy is true; the page reads in plain words | Design (identity, layout), marketing (voice), accessibility specialists (contrast, legibility), legal (claims), engineering (font and image weight) |

## 2. Key ideas

### Tone of voice in three words

Pick three words that describe how the product speaks, for example "friendly, plain, practical". For each, add one **do** and one **don't** with a real sentence:

- **Friendly:** do "Hi Maya, your cup is ready." Don't "Dear valued customer."
- **Plain:** do "You pick up a clean cup." Don't "Leverage our circular hospitality solution."
- **Practical:** do "It takes under a minute." Don't "A revolutionary experience."

Examples carry more than adjectives. An agent can follow a "do" and "don't" pair better than the word "friendly".

### Plain words

GOV.UK's guidance on writing for user interfaces covers the words on screens: buttons, labels, error messages and instructions. It favours clear, specific text over clever text. Its content design guidance starts from what the user needs and writes the simplest content that meets it. Use these as a standard for your copy: short sentences, common words, one idea per sentence, the action first.

### Colour

Figma's colour theory guide explains the wheel, harmony, contrast and meaning. Two colours are enough for version one: a **main** colour and an **accent**, plus black or near-black for text and white or near-white for background. Rules:

1. **Contrast comes first.** Text must be readable against its background. The WCAG success criteria set minimum contrast ratios for text, and the W3C's quick reference lists them. Check your pairs with a contrast checker and record the ratios.
2. **Do not rely on colour alone.** Never use only colour to mark an error or a state. Add a word or an icon.
3. **Choose for meaning with care.** Colours mean different things in different places. Ask people from the places you serve.

### Type

Figma's typography guide covers typefaces, hierarchy and pairing. For version one choose **one** font, in two or three weights. Prefer a free, well-supported font with good legibility at small sizes. Set a clear hierarchy: one size for headings, one for body text, one for small print. Keep body text large enough to read on a phone. Check the licence of any font before you use it, and keep the number of font files small, because each one slows the page.

### A design system, in small

GOV.UK's Design System is an open collection of tested components, patterns and guidance. You do not need one that size, but the idea helps: write your choices once, then reuse them. Your brand sheet is a design system in one page: colours, type, spacing, tone and a few components such as the button style.

### One page

Put it on one page, in git, as `brand/brand-sheet.md`. Parts:

1. **Name and promise.**
2. **Tone:** three words, with a do and a don't each.
3. **Words we use and words we never use.** Include banned claims.
4. **Colours:** two, with hex values and the contrast ratio of each text pair.
5. **Font:** one, with weights and sizes for heading, body and small print.
6. **Components:** the style of buttons and links, in one line each.
7. **Image rules:** what pictures we use, and the text alternative rule.
8. **Owner and date.**

## 3. Step by step

### Step 1: Gather what you know

Read your name decision and your personas. Write three words you would want Maya and Leo to use to describe how the product talks.

### Step 2: Write the do and don't pairs

For each word, write one real sentence of each kind.

### Step 3: List banned words and claims

Write the words you will not use ("revolutionary", "eco-friendly" unless proven) and the claims you cannot back.

### Step 4: Choose two colours

Pick a main and an accent. Test the text pairs for contrast with a trusted checker. Record the ratios and the pass or fail against the WCAG criteria.

### Step 5: Choose one font

Pick a free font with a licence you have read. Set sizes for heading, body and small print. Test it on a phone-sized screen.

### Step 6: Write components in one line each

Buttons, links, error messages. For example: "Buttons: main colour, white text, a verb on every button, never 'Click here'."

### Step 7: Write one real piece of copy

Write the home page headline and a short paragraph under the sheet's rules. Read it aloud.

### Step 8: Test on a reader

Show the sheet and the copy to one person. Ask: "Does this sound like one voice? Which sentence does not fit?"

### Step 9: Save and date

Commit `brand/brand-sheet.md`. Record the contrast ratios and their source.

## 4. Worked example: TrailMug

TrailMug is fictional. The brand sheet (excerpt):

```markdown
# TrailMug brand sheet (2026-11-10)

**Name.** TrailMug. **Promise.** Swap a used cup for a clean one at a
partner café in under a minute. (Pilot until the café trial confirms the
time.)

**Tone.** Friendly, plain, practical.
- Friendly. Do: "Hi Maya, your cup is ready." Don't: "Dear valued customer."
- Plain. Do: "You pick up a clean cup." Don't: "Our circular hospitality
  solution."
- Practical. Do: "It takes under a minute." Don't: "A revolutionary
  experience."

**Never say.** Revolutionary, eco-friendly, zero waste, best, secure,
instant. (We cannot prove them yet.)

**Colours.** Main: deep green #1F5C4A. Accent: warm orange #E07A1F.
Text: #1A1A1A on #FFFFFF.
- #1A1A1A on #FFFFFF: ratio about 17:1, passes.
- White on #1F5C4A: ratio about 7.8:1, passes.
- White on #E07A1F: ratio about 3.0:1, FAILS for body text. Use orange
  only for large shapes and never for text on white.

**Font.** One free sans-serif, regular and bold. Headings 32 px, body
18 px, small print 14 px.

**Components.** Buttons: green, white text, a verb ("Join", "Find a
café"). Links: underlined green. Errors: red text with an icon and words
that say what to do.

**Images.** Real cafés and cups, never stock smiles. Every image has a
text alternative.

**Owner.** Founder.
```

**What testing found.** The founder first liked white text on the orange. Her contrast check showed about 3.0:1, below the usual minimum for body text. She kept orange for shapes and used the dark green for text on buttons. The agent's first copy draft of the home page said "revolutionary sustainable cup swap experience". She struck all three words because they were on her never-say list, and wrote "Swap a used cup for a clean one at a partner café in under a minute."

## 5. Working with AI agents on this

**Delegate:**

- **Contrast calculations.** "Compute the WCAG contrast ratio for each of these colour pairs and say pass or fail for normal text and for large text. Show the formula you used."
- **Draft copy** from the sheet. "Write a home page headline and two sentences using only this tone and avoiding these words."
- **A brand check.** "Compare this page's text with the brand sheet. List any banned word, any claim not backed by the promise and any sentence over 20 words."
- **Font trials.** "Build a test page with these three fonts at heading, body and small sizes. Use free fonts only and give each font's licence."
- **Formatting** the sheet.

**Do yourself:**

- Choose the three words and write the do and don't examples.
- Choose the colours and font.
- Decide the banned list.
- Read all copy aloud.
- Decide whether a claim is true.

**A brief you can adapt:**

```text
Read brand/brand-sheet.md. Write the home page headline and two
supporting sentences for TrailMug in that tone. Rules: no word on the
"never say" list, no claim that is not in the promise, sentences under
18 words. Give three options. After the options, list any word in them
that I should check as a possible overclaim.
```

**How to check the output.** Run the banned-word list by search, not by eye. Check each claim against the product as it is today. Compare contrast figures with a trusted checker, as agents sometimes give wrong numbers with great confidence.

**A trap.** Agents mimic the tone of the examples you give them. If your "do" examples are weak, every page will be weak. Spend time on three excellent examples.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate** and begins **govern**. The brand sheet is written policy that every agent reads. A check in the pipeline that fails on a banned word or a low contrast ratio is a gate that keeps the policy true without you watching. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

**Disclose.** In the brand sheet footer: "AI use: contrast arithmetic and draft copy. The tone, colours, font, banned list and claims are mine."

## 6. Common mistakes

- **Adjectives only.** Without do and don't examples, agents guess.
- **Colour pairs never checked.** Pretty is not readable.
- **Colour as the only signal.** Add words or icons.
- **Too many fonts and weights.** Slow and noisy.
- **Unchecked font licences.**
- **A banned list nobody enforces.** Search for the words.
- **Letting an agent invent the tone.**
- **A sheet longer than one page.** Nobody follows it.
- **Claims not backed by the product.**

## 7. Practice: write the brand sheet

**Deliverable:** `brand/brand-sheet.md` in your git repo, one page, with:

1. Name and promise.
2. Three tone words with a do and a don't each.
3. A never-say list with reasons.
4. Two colours with hex values and contrast ratios for each text pair, and how you checked them.
5. One font, its licence, and sizes for heading, body and small print.
6. One line each for buttons, links and errors.
7. Image rules.
8. Owner, date and your AI-use line.

Also add `brand/home-copy.md`: your home page headline and two sentences, written under the sheet.

Commit with a message such as `Add brand sheet and home page copy`.

**Check:** give the sheet to a friend. Ask her to write one sentence for a "Contact us" button in your voice. If it sounds like your product, the sheet works.

**Stretch:** have an agent write the same copy twice: once with only the three tone words, and once with the do and don't examples. Record the difference.

## 8. Checklist

- [ ] Three tone words, each with a real do and don't.
- [ ] A never-say list.
- [ ] Two colours, contrast checked and recorded.
- [ ] Colour is never the only signal.
- [ ] One font with a checked licence and set sizes.
- [ ] Buttons, links and errors described in one line each.
- [ ] The sheet fits on one page and is in git.
- [ ] Copy reads aloud in plain words.
- [ ] I recorded my AI use.

## 9. Further learning

Figma's guides to colour theory and typography explain the basics, and the W3C's WCAG quick reference lists the contrast rules in detail. GOV.UK's guidance on writing for user interfaces and on content design is a model of plain writing, and its Design System shows how a full set of choices can be written once and reused. In the next lesson you draw the mockups.
