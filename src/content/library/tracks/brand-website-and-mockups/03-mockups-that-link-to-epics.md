---
title: "Mockups that link to epics"
description: "Choose the three screens that matter, draw them as wireframes then mockups, tie each to a person and an epic, and write what you still do not know before anyone builds them."
section: "Brand, website and mockups"
order: 3
track: "brand-website-and-mockups"
level: "core"
duration: "3 hours"
outcomes:
  - "Tell a wireframe, a mockup and a prototype apart and choose the right one"
  - "Pick the three screens that matter most in the next version, with reasons"
  - "Draw each screen and tie it to a person, an epic and a list of unknowns"
  - "Turn a mockup into acceptance checks an agent can build against"
resources:
  - "figma/prototype-and-wireframe"
  - "youtube-nngroup/prototypes-vs-wireframes"
  - "gov-uk/making-prototypes"
  - "youtube-figma/figma-design-for-beginners-overview"
  - "youtube-grow-with-google/storyboarding-to-drawing-wireframes"
  - "figma/learn-get-started"
prerequisites:
  - "week-5-brand-website-mockups"
  - "week-3-problems-to-epics"
updated: 2026-11-03
---

**Supports:** Developer, week 5 (Brand, website and mockups), Part 3: mockups of the next version. **Time:** about three hours.

## 1. Why this matters

It is much cheaper to change a drawing than a finished screen. Mockups let you find out, before any building, whether a person understands what you plan, and let you agree with others what "the sign-up page" means. They are also a very good instruction for agents. A clear picture with labels and checks leaves much less room for guessing than a paragraph of description.

A mockup without a purpose is decoration. The Dojo rule is that every mockup links to an epic and to a person. If it does not, it is not yet worth drawing.

A Product Development Manager (PDM) uses mockups at the point where strategy meets what people see. The choices of which screens to draw, what each one must let a person do and what you still do not know are strategic. Agents can generate attractive screens in seconds, which makes the discipline more important: pretty and wrong is easier than ever to produce.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which screens matter, what each must let a person do, what is in and out, and what remains unknown | Producing layout options; drawing in a tool or as simple HTML; checking labels against the brand sheet | Each mockup traces to a person and an epic; a real person can say what to do on it; unknowns are written | Design (layout, flow), engineering (what is feasible), marketing (words), accessibility (contrast, targets), support (what confuses people) |

## 2. Key ideas

### Wireframe, mockup, prototype

These words are used loosely. Figma's guides and NN/g's video on prototypes versus wireframes describe the difference. A working distinction:

| Kind | What it is | Use it to |
|---|---|---|
| **Wireframe** | A plain layout of boxes, labels and flow, with no colour or style | Agree structure and content before looking at style |
| **Mockup** | A wireframe with the brand applied: real words, colours, type and images | See what it will look like and check the words |
| **Prototype** | A mockup you can click through | Test a flow with a person before building |

Start with wireframes. If people cannot understand the layout in grey boxes, colour will not rescue it.

### Pick three screens

Do not draw everything. Pick the three screens that matter most in the next version. Use these tests:

1. **Where does the epic succeed or fail?** The screen where the person makes the key choice.
2. **Where did the journey break?** The step from your journey map where people got stuck.
3. **Where is the risk or unknown?** The screen where you are least sure.

Write why each was chosen.

### A mockup is a claim

Each mockup says: "A person like X can do Y on this screen." Write that sentence on the page. Beside it, write the epic, the persona and the journey step it belongs to. Add what is **still unknown**: "We do not yet know whether cafés want to upload a logo."

### Prototypes test; they do not prove

GOV.UK's page on making prototypes explains why teams build prototypes: to test ideas with users before building the real thing. A prototype that a person can click, with real words, shows you where she hesitates. It does not show that she will come back, or pay. Say that when you report.

### Sketch first, tool second

Paper is fast and cheap. The Google UX video on drawing wireframes from storyboards shows how a story of a person's steps becomes screens. Learn the flow on paper, then move to a tool. Figma has a free way to get started (check the current plan details on its site), and a short beginner video shows the basics. A mockup can also be simple HTML with grey boxes.

### Mockup to checks

A mockup is not yet a specification. Turn each into three to six acceptance checks, such as "Leo sees the 'Join' button without scrolling on a 375 px wide screen." Add the brand sheet as the style standard. This is what you give an agent: the picture, the checks, the sheet and the scope.

## 3. Step by step

### Step 1: Gather inputs

Collect your epics, personas, journey maps and brand sheet. Highlight the journey breaks that the next version should fix.

### Step 2: Choose three screens

Use the three tests. Write why for each.

### Step 3: Write the claim

For each screen, write "A (person) can (do something) on this screen", the epic, the journey step and the unknowns.

### Step 4: Sketch on paper

Draw each screen in five minutes. Draw the flow between them with arrows. Add labels in real words, not "Lorem ipsum".

### Step 5: Test the sketch

Show the sketches to one person. Say nothing. Ask: "What would you do here?" Write what she says.

### Step 6: Draw the wireframes

Redraw in a tool or simple HTML. Fix what the test found. Keep it grey.

### Step 7: Apply the brand

Create the mockup with the colours, type, buttons and words from the brand sheet. Check the contrast.

### Step 8: Write the checks

Three to six acceptance checks per screen.

### Step 9: Save and link

Save in `design/mockups/` with an index file linking each to its epic. Commit the images, with text alternatives written in the index.

## 4. Worked example: TrailMug

TrailMug is fictional. Three screens for the next version.

| # | Screen | Why chosen | Epic |
|---|---|---|---|
| 1 | Café sign-up | The point where cafés join or leave; journey break "owner unsure what is involved" | Café owners can join, run returns and see results |
| 2 | Log a returned cup (staff phone) | The riskiest unknown: can staff do it in 10 seconds? | Same |
| 3 | Café monthly report | Where a café sees what TrailMug brought her | Same |

**Claim for screen 2:** "Café staff like Sam, on shift, can log a returned cup in under 10 seconds on a phone."

**Unknowns:** whether staff will have a free hand; whether the café wifi is reliable; whether a scan or a tap is faster.

**Sketch test.** She showed a paper sketch to a café worker, saying nothing. The worker tried to tap the cup count instead of the "Log" button, because the count looked tappable. She changed the design: a big single "Log a cup" button and a count that was clearly just a number.

**Mockup index (excerpt):**

```markdown
# Mockups: next version

## 2. Log a returned cup
Image: design/mockups/02-log-cup.png
Text alternative: A phone screen with the café name at the top, a large
green button labelled "Log a cup", and below it, "Today: 14 cups".
Person: Sam, café staff. Epic: #2 Café owners can join, run returns and
see results. Journey step: "Return a cup".
Unknown: scan or tap; wifi in the café.
Checks:
1. On a 375 px wide phone, the "Log a cup" button is visible without
   scrolling.
2. A first-time user logs a cup in under 10 seconds without help.
3. The button text is white on #1F5C4A.
4. The count updates within one second.
5. If the phone is offline, a message says what to do.
```

**What she gave the agent:** the mockup image, the checks, the brand sheet and the scope for building. She did not give it permission to change the layout.

## 5. Working with AI agents on this

**Delegate:**

- **Layout options.** "Produce three wireframe options for this screen as plain HTML with grey boxes. Same content, different layouts."
- **From sketch to HTML.** "Turn this sketch into a grey-box HTML wireframe. Use only the labels I give. Do not add features."
- **Brand application.** "Apply brand/brand-sheet.md to this wireframe. Do not change layout or words."
- **A checks draft.** "Write acceptance checks a non-technical person could run for this screen."
- **Consistency check.** "Compare the labels in all three mockups with the brand sheet and list any difference."

**Do yourself:**

- Choose the three screens.
- Write the claim and the unknowns.
- Run the sketch test with a person.
- Decide the layout and the words.
- Decide the checks.

**A brief you can adapt:**

```text
Build design/mockups/02-log-cup.html as a grey-box wireframe for the
screen described in design/mockups/index.md (section 2).
Use only the labels, the layout notes and the checks given there.
Do not add features, images or animation. Use semantic HTML. Make it
work at 375 px width. No external fonts or scripts.
Output the file and a list of anything in the description you found
ambiguous.
```

**How to check the output.** Open it on a phone. Compare with your sketch. Look for added buttons, invented words and style choices that you did not give. Run the checks.

**A trap.** Agents produce screens that look finished and persuasive. People then judge the polish, not the idea. Keep early tests grey, or tell testers explicitly that the screen is a rough idea.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate**. A mockup, its checks and the brand sheet form a complete brief. If several agents build screens at once, you are orchestrating, and shared elements such as buttons and labels must come from one source. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

**Disclose.** In `design/mockups/index.md`: "AI use: wireframe options and brand application. The screens, claims, unknowns and checks are mine."

## 6. Common mistakes

- **Drawing everything.** Three screens, chosen with reasons.
- **Mockups with no epic or person.** Decoration.
- **Style before structure.** Start grey.
- **Lorem ipsum.** Use real words.
- **Treating a prototype test as proof.** It shows hesitation, not demand.
- **No unknowns written.** You will build on guesses.
- **Letting an agent invent features.** Give it labels and scope.
- **Polished screens shown as final.** People judge the polish.
- **No text alternative for the images.** Write one for each.

## 7. Practice: draw three screens

**Deliverable:** in `design/mockups/` in your git repo:

1. `index.md`: for each of three screens: the reason it was chosen, the claim, the person, the epic, the journey step, the unknowns, the image, its text alternative and three to six acceptance checks.
2. Paper sketches (photographs) and the wireframe and mockup for each screen.
3. `sketch-test.md`: what one person did and said when she saw the sketches, and what you changed.
4. Your AI-use line.

Commit with a message such as `Add three mockups linked to epics`.

**Check:** give the mockup and the checks to a person who knows nothing about the product. Ask her what each screen is for. If she cannot say, redraw it.

**Stretch:** make the flow clickable in a free tool and watch one person use it. Record where she hesitated.

## 8. Checklist

- [ ] I chose three screens and wrote why.
- [ ] Each mockup names a person, an epic and a journey step.
- [ ] Unknowns are written.
- [ ] I tested the sketch with a person.
- [ ] Structure was drawn before style.
- [ ] The brand sheet is applied, with contrast checked.
- [ ] Each screen has three to six acceptance checks.
- [ ] Each image has a text alternative.
- [ ] I recorded my AI use.

## 9. Further learning

Figma's guides to wireframes and prototypes and NN/g's short video on prototypes versus wireframes explain the vocabulary. GOV.UK's page on making prototypes shows why teams test before building. A Google UX video on storyboards and wireframes and Figma's beginner overview help with the drawing. In the next lesson you build and publish the website.
