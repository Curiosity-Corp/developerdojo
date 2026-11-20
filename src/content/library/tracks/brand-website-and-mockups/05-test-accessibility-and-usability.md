---
title: "Test accessibility and usability"
description: "Run basic accessibility checks, test with the keyboard and a screen reader, watch one person use your site without helping, and turn what you see into fixes and a decision log."
section: "Brand, website and mockups"
order: 5
track: "brand-website-and-mockups"
level: "core"
duration: "3 hours"
outcomes:
  - "Run basic accessibility checks against the WCAG success criteria"
  - "Test the site with the keyboard alone and with a screen reader"
  - "Run a short usability test with one person and record what confused her"
  - "Turn findings into prioritised fixes and fix forward"
resources:
  - "w3c/intro-web-accessibility"
  - "w3c/accessibility-principles"
  - "w3c/wcag-quickref"
  - "web-dev/learn-accessibility"
  - "nngroup/usability-101"
  - "gov-uk/moderated-usability-testing"
  - "gov-uk/making-service-accessible"
  - "mozilla-mdn/accessibility-on-the-web"
prerequisites:
  - "week-5-brand-website-mockups"
  - "fix-forward"
updated: 2026-11-03
---

**Supports:** Developer, week 5 (Brand, website and mockups), Exercise 4: test the site with one person. **Time:** about three hours.

## 1. Why this matters

A site that works for you may fail for others. People use screen readers, keyboards, magnifiers, voice control, small phones and slow connections. Some cannot see colour differences. Some read in a second language. A site that fails them excludes customers, risks legal trouble and shows how little care went into the product.

Usability is related but different. A site can be accessible and still confusing. Only watching a real person use it tells you where the confusion is.

For a Product Development Manager (PDM) this lesson is the quality gate on the front of the product. Agents can run automated checks and produce reports. They cannot sit beside a person, notice the hesitation and decide what it means. They also tend to produce pages that look right and fail in ways that tools do not catch. You write the checks, run the human tests and decide what to fix first.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What standard you aim for, who you test with, which findings to fix first and when to ship | Running automated checks; listing findings with page and line; proposing fixes; fixing the ones you approve | You ran the keyboard and screen reader tests; you watched a real person; each fix was re-tested | Accessibility specialists, design (flows, labels), engineering (fixes), legal (obligations), support (what people report), marketing (message) |

## 2. Key ideas

### What accessibility means

The W3C's introduction describes web accessibility as designing and building sites so that people with disabilities can use them, and notes the benefits for everyone: clearer pages, better keyboard use, better results on small screens. The WCAG success criteria are the detailed, testable standard. The W3C's quick reference lets you filter them by level and technology.

State your target: "WCAG 2.2 level AA" is a common one. Check which standard applies in your country and sector, because it may be a legal requirement. This is not legal advice.

### The basics that catch most problems

web.dev's accessibility course and Mozilla's documentation cover the core. A short list for a four-page site:

- **Headings** in order, one main heading per page.
- **Text alternatives** for images that carry meaning, and empty alternatives for decoration.
- **Contrast** of text against background, checked.
- **Keyboard:** every link, button and field can be reached and used with the keyboard alone, with a visible focus outline.
- **Labels:** every form field has a label connected to it, and errors say what to do.
- **Links** say where they go ("Read the privacy notice", not "Click here").
- **Language** of the page is set.
- **Zoom:** the page works at 200 percent zoom and on a small screen.
- **No colour-only meaning.**
- **Motion:** nothing flashes, and moving content can be stopped.

The UK government's page on making a service accessible shows how a team treats accessibility as part of the work rather than a final polish.

### Automated checks find about a part of the problem

Automated tools find some issues: missing alternatives, low contrast, missing labels. They miss many: whether the alternative text makes sense, whether the order of reading is logical, whether a keyboard user gets trapped. Use them as a first pass and never as proof of accessibility.

### Keyboard and screen reader

Two manual tests tell you the most.

1. **Keyboard only.** Put the mouse away. Use Tab, Shift+Tab, Enter and Space to do the main task. Can you see where you are? Can you reach everything? Can you get out of everything?
2. **Screen reader.** Use a free screen reader (your operating system's built-in one) for five minutes on the home page and the sign-up. Do the headings, links and labels make sense when read aloud?

If you have never used a screen reader, it feels slow and strange. That is the point. Learn the basic commands from the screen reader's own documentation first.

### Usability in five parts

NN/g's introduction defines usability by five qualities: **learnability** (how easily people do tasks the first time), **efficiency** (how quickly they do them after learning), **memorability** (how easily they use it again after a break), **errors** (how many and how serious, and how easily they recover) and **satisfaction** (how pleasant it is). Use them as your vocabulary when you write findings.

### A short usability test

GOV.UK's page on moderated usability testing describes how a researcher sits with a participant and watches them try tasks. You can do a small version:

1. Pick one person who has not seen the site, and who is like your user.
2. Give her one task in the person's words: "You run a café. Find out whether you can join."
3. **Watch silently.** Do not help. Do not explain. If she asks a question, say "What would you do if I were not here?"
4. Ask her to think aloud.
5. Write what she does and says, word for word where you can. Mark where she hesitates, goes the wrong way or gives up.
6. At the end, ask what she thought it was and what she would do next.

NN/g's evidence suggests that a few participants reveal most of the major problems, and that repeating small tests is better than one big one. Even one person shows you things you cannot see yourself.

### Prioritise findings

Sort each finding by **severity**: blocks the main task (fix now), slows or confuses (fix soon), or is cosmetic (note it). Fix blockers before anything new is built. Fix forward: publish the fix, add the check that would have caught it and write a decision-log line.

### Include people who use assistive technology

If you can, include someone who uses a screen reader or other assistive technology in a test, paid fairly for her time. Her experience is the real test. Do not claim "fully accessible". Say what you checked and what you know you have not yet fixed.

## 3. Step by step

### Step 1: State your target

Write the standard and level you aim for, and what you know about legal requirements. Note that you will review it.

### Step 2: Run an automated pass

Use a free accessibility checker in the browser. Record every finding with page and element.

### Step 3: Test with the keyboard

Do the home page and sign-up with the keyboard only. Record where focus is invisible, lost or trapped.

### Step 4: Test with a screen reader

Do five minutes on the home page. Record what is confusing, missing or wrong.

### Step 5: Check zoom and the phone

Zoom to 200 percent. Open the site at 375 px width. Record what breaks.

### Step 6: Run the usability test

One person, one task, silent. Take notes.

### Step 7: Sort the findings

List all findings with the source (tool, keyboard, screen reader, person), severity and a proposed fix.

### Step 8: Fix and re-test

Fix the blockers. Re-run the same test that found each one. Add a check to the pipeline where you can.

### Step 9: Record

Write the decision log lines, the remaining known issues and the date. Say plainly what you did and did not test.

## 4. Worked example: TrailMug

TrailMug is fictional. The four-page site is live.

**Target:** WCAG 2.2 level AA as an aim, with the known gaps listed. She wrote "I will ask an adviser which rules apply to me before the public launch."

**Automated pass.** The tool flagged two images without alternatives and one form field without a label. She fixed them.

**Keyboard test.** On the sign-up form, the focus outline was invisible on the green button because it was the same green. She added a clear outline in the accent colour with a dark border.

**Screen reader test.** The page read "link, click here" twice. She changed both links to say where they go.

**Zoom and phone.** At 200 percent the waiting-list form overflowed on a small phone. She fixed the layout.

**Usability test.** She asked a café owner, Leo's real counterpart, to "find out whether you can join with your café". She said nothing for six minutes. Notes:

> 0:20 Reads the headline aloud: "Swap a used cup for a clean one." Says: "OK, so it's for customers."
> 1:10 Scrolls. Hesitates at the footer. Says: "Where do I sign up as a café?"
> 2:30 Clicks "Find a partner café". Looks puzzled. "I'm a café, not a customer."
> 4:10 Finds "Contact". Writes an email address down.
> End. What is it? "A cup swap for customers. I think there's a café thing somewhere."

**Findings.**

| Finding | Source | Severity | Fix |
|---|---|---|---|
| Café owners cannot find how to join | Person | Blocks main task | Add "For cafés" to the navigation and a second button on the home page |
| Focus outline invisible on green button | Keyboard | Blocks keyboard users | Visible outline |
| "Click here" links | Screen reader | Confuses | Rewrite links |
| Form overflow at zoom | Zoom | Confuses | Layout fix |

**Fix forward.** She shipped the fixes in a week, added a pipeline check for missing alternatives and labels, and wrote in the decision log: "Added 'For cafés' to the navigation after a café owner could not find how to join. Check added. Known gap: not yet tested with a screen reader user."

**Honest statement on the site.** "We aim for WCAG 2.2 AA. We have tested with the keyboard, a screen reader and one café owner. We know of gaps and list them here. Tell us if something does not work for you."

## 5. Working with AI agents on this

**Delegate:**

- **Automated checks and a findings list.** "Run an accessibility checker on every page of the built site. List each finding with page, element and the WCAG criterion."
- **Link text scan.** "List every link whose text is 'click here', 'here' or 'read more'."
- **Proposed fixes** for findings you approve.
- **Applying approved fixes** and re-running the same checks.
- **Pipeline checks.** "Add a step that fails the build if any image lacks an alternative text attribute or any field lacks a label."
- **Notes tidying.** "Format my test notes into a table with time, action and quote. Do not interpret."

**Do yourself:**

- Choose the standard.
- Run the keyboard and screen reader tests.
- Run the usability test and watch.
- Judge severity.
- Decide when to ship.

**A brief you can adapt:**

```text
Run an automated accessibility check on every page in public/. Output a
table: page, element, issue, WCAG criterion, and a one-line proposed fix.
Do not change any file. Then list every link whose visible text is not
descriptive on its own, and every image whose text alternative is empty or
longer than 150 characters.
Say clearly at the end what automated checks cannot tell us.
```

**How to check the output.** Spot-check three findings by hand. Check at least one claimed pass. Never accept "no issues found" as proof the site is accessible.

**Never** let an agent role-play the usability participant and call it a test. An agent is not a person using your site, and its answer is a fluent guess.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson spans **delegate** and **govern**. Automated checks in the pipeline are a gate that runs on every change. The human tests are the gate no tool replaces, and the decision log records what was found and fixed. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the upper rungs.

**Disclose.** In `site/accessibility.md`: "AI use: automated check reports and fixes I approved. The keyboard, screen reader and usability tests were run by me."

## 6. Common mistakes

- **Trusting an automated score.** Tools miss many problems.
- **Never using the keyboard or a screen reader.**
- **Helping the test participant.** Watch silently.
- **Testing with friends who know the product.**
- **Using an agent as the test participant.**
- **Claiming "fully accessible".** Say what you tested and what is known to fail.
- **Fixing cosmetic issues before blockers.**
- **Rolling back a launched page to hide a problem.** Fix forward and add the check.
- **No record.** Without notes you will argue from memory.

## 7. Practice: test and fix

**Deliverable:** in your git repo:

1. `site/accessibility.md`: your target, the automated findings, the keyboard test, the screen reader test and the zoom and phone test, with dates.
2. `site/usability-test.md`: the task, the participant's description (no name), your notes with times and quotes, and her closing answer.
3. A findings table with source, severity and fix, and the status of each.
4. At least one new pipeline check that would have caught a finding.
5. Decision-log lines for each change and for the known gaps.
6. A short, honest accessibility statement for the site.
7. Your AI-use line.

Commit with a message such as `Add accessibility and usability test results and fixes`.

**Check:** retest the main task with the keyboard and with a second participant after your fixes. Record whether the blocker is gone.

**Stretch:** invite someone who uses a screen reader daily to try the main task, and pay her for her time. Record what you learned that no tool showed.

## 8. Checklist

- [ ] I stated a standard and checked what applies where I operate.
- [ ] I ran an automated pass and recorded the findings.
- [ ] I tested with the keyboard only.
- [ ] I tested with a screen reader.
- [ ] I checked zoom and a small phone.
- [ ] I watched one person silently and wrote word-for-word notes.
- [ ] Findings are sorted by severity, and blockers are fixed first.
- [ ] A pipeline check now guards against one of the findings.
- [ ] The site's accessibility statement is honest.
- [ ] I recorded my AI use.

## 9. Further learning

The W3C's introduction to web accessibility and its WCAG quick reference are the standard sources. web.dev's accessibility course and Mozilla's accessibility documentation cover the practical side. NN/g's usability introduction gives the vocabulary, and the UK government's guidance on moderated usability testing and on making a service accessible shows how a public team does both as part of normal work. Once your site, mockups and brand are tested, you are ready to bring the whole product together in the catalogue, the demo and the package.
