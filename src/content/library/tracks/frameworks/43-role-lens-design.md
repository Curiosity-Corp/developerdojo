---
title: "Role lens: design"
description: "How a designer uses DREAM, personas and journeys, the ANDROID Ops Design focus area and accessibility standards to shape what people experience, how agent sessions help draft and check, and how a PDM verifies design work."
section: "Frameworks"
order: 43
track: "frameworks"
level: "core"
duration: "45 min"
outcomes:
  - "Describe the design seat in terms of the shared frameworks and the Design focus area"
  - "Use agent sessions to draft alternatives and run checks while keeping the design decision with a person"
  - "Produce a design brief, accessible mockups and a design review checklist in git"
resources:
  - "w3c/intro-web-accessibility"
  - "web-dev/learn-accessibility"
  - "atlassian/what-is-agile"
  - "anthropic/building-effective-agents"
  - "gitlab/docs-review-apps"
  - "twelve-factor/the-twelve-factor-app"
prerequisites:
  - "tracks/frameworks/40-role-lens-one-shared-language"
updated: 2026-11-03
---

**Dojo programme link:** this lens supports Developer week 5 ([Brand, website and mockups](/library/week-5-brand-website-mockups)) and the Design area of ANDROID Ops.

## 1. Why this matters

Design decides whether a product that works is a product people can use. A correct feature that nobody understands, or that excludes people who use assistive tools, has failed. Design is also where a product's character appears: the words, colours, spacing and feel.

Agent sessions can now produce screens, copy and code for a design in minutes. That makes the designer's judgement more important, not less. Many options are cheap. Choosing the right one, for real people, with evidence, is the skill.

## 2. Key ideas, explained

### 2.1 What the seat owns

| Responsibility | Framework or artefact | File in git |
|---|---|---|
| Understand the people | DREAM (Relate), personas, journeys | `docs/personas.md`, `docs/journeys.md` |
| Say what the design must do | Design brief | `design/brief.md` |
| Shape it | Sketches, mockups, flows | `design/mockups/` |
| Keep it consistent | Design tokens: colours, type, spacing | `design/tokens.json` |
| Make it usable by everyone | Accessibility checks | `design/accessibility.md` |
| Check it with people | Usability sessions | `design/sessions/` |

### 2.2 Design in ANDROID Ops

In ANDROID Ops the **Design** focus area is the work of shaping the solution before and while it is built, in loops with Research. It comes first in both loops (see [lesson 21](/library/tracks/frameworks/21-android-focus-areas-advance-network-design-research/)). It is not a single stage that finishes before development starts. A designer works with sessions and developers in small steps, checking each change against the persona and the journey step it serves.

### 2.3 Accessibility is part of the brief

Accessibility means people with different abilities, tools, languages and connections can use the product. The W3C's [Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/) explains the range of needs, and Google's free course [Learn Accessibility](https://web.dev/learn/accessibility) teaches the practical techniques: meaningful structure, text alternatives, keyboard use, colour contrast, focus and forms.

Write accessibility into every design issue as acceptance criteria, for example: "All controls reachable by keyboard; text contrast meets the target in the brief; every image has a text alternative or is marked decorative; error messages say what to do." Test with a keyboard and a screen reader at least once per feature. Automated tools find some problems, not all.

Do not claim a product is "accessible" or "compliant" without a proper audit. Say what you tested and what you did not.

### 2.4 Tokens and systems

A **design token** is a named value (a colour, a size) stored once and used everywhere. Keeping tokens in a file in git lets people and sessions use the same values, makes theme changes safe, and makes review easy: a change to `color.primary` shows in one diff. A small design system (tokens, a few components, writing rules) is more valuable to a small team than many screens.

### 2.5 Words are design

Labels, error messages, empty states and help text are design. Plain words, in the same terms the persona uses, remove more friction than any visual polish. Test words with a real person: ask them what a button will do before they press it.

### 2.6 Review apps and real preview

A **review app** gives each merge request a live preview (see GitLab's [review apps](https://docs.gitlab.com/ci/review_apps/)). A designer can open the preview of a session's work, check it against the mockup and comment in the merge request. This closes the gap between design and build.

## 3. Step by step

1. **Read the persona and the journey step** the epic serves.
2. **Write a design brief** (one page): who, goal, constraints (accessibility, brand, devices), measure, what is out of scope.
3. **Sketch three options** quickly (paper or tool). Agents may help you draft more.
4. **Choose one** with a reason; write it down.
5. **Make the mockup** with tokens and real content, not placeholder text.
6. **Write acceptance criteria**, including accessibility.
7. **Hand off** as an issue with the mockup and tokens linked, and the stop rule: "if the mockup is unclear, stop and ask."
8. **Review the preview** of the build against the mockup and criteria.
9. **Test with two or three people**; write what changed.

## 4. Worked example: TrailMug

The designer for TrailMug (a part-time contractor) designs the café finder.

- **Brief:** Nina, regular customer, on a phone, often outdoors in bright light; needs the nearest open café in under 15 seconds; must work with large text and a screen reader.
- **Options:** a map-first screen, a list-first screen, and a hybrid. She chose list-first with a small map, because the persona thinks "which is closest?" and lists are easier to read aloud and navigate by keyboard.
- **Tokens:** a high-contrast colour pair tested against the target, a minimum tap size, a type scale.
- **Acceptance (extract):** Given a user with large text, when the finder opens, then no content is cut off and the first three results are visible without scrolling horizontally.
- **Hand-off issue:** the mockup, the tokens file and "If a state is missing from the mockup (no location permission, no cafés nearby, offline), stop and write BLOCKED.md listing the states."

The session missed the "no location permission" state. The stop rule worked: it wrote the note, the designer added the state, and the build continued. In the review app she found that the focus order skipped the "open now" filter; she wrote a comment and the session fixed it in the same merge request.

## 5. Working with AI agents on this

**What the designer decides.** What the product should feel like; which option; whether the mockup meets the person's need; whether the build matches; what is good enough.

**What is delegated, with the exact brief.**

```text
Read design/brief.md and docs/personas.md. Draft three layout alternatives
for the café finder as simple HTML files in design/options/, using only
the tokens in design/tokens.json. For each, add a short note: who it
suits and one risk. Do not pick one. Do not use placeholder text; use the
sample data in data/sample-cafes.json.
```

```text
Open the review app for merge request !N. List every interactive control,
whether it can be reached and used by keyboard alone, the focus order,
and any text with low contrast against the tokens. Report what you tested
and what you could not test. Do not change code.
```

```text
Read all user-facing strings in src/. List any that use words not in
docs/glossary.md or that read above a plain-language level, with a
suggested plain version. Do not edit files.
```

**How to verify.** Use the product with the keyboard and with large text yourself. Check the contrast values with a tool. Read the string list and accept or reject each suggestion.

**Disciplines involved.** Product (the epic), engineering (feasibility), marketing (brand voice), operations (support questions about confusing screens), finance (cost of a heavy asset or font).

**Ladder.** Designers mostly **use** and **delegate**: draft options, run checks. At orchestration level, one session can draft options while another audits the preview; policy keeps both inside their scope. See [Agent orchestration](/library/tracks/agent-orchestration/).

**Do not** let a session decide the design by shipping its first output. A draft that looks polished feels finished; it is not.

## 6. Common mistakes and how to avoid them

- **Choosing from one option.** Look at three.
- **Accessibility at the end.** Put it in the brief and the acceptance.
- **Placeholder text in mockups.** Use real words and data.
- **Missing states** (loading, empty, error, offline). List them.
- **Claiming compliance.** State what you tested.
- **Tokens ignored.** Review diffs for hard-coded values.
- **Polished drafts mistaken for decisions.** Decide deliberately.
- **No test with real people.** Two or three sessions find most big problems.

## 7. Practice

**Deliverable in git:** a branch `design-lens`:

1. `design/brief.md` for one epic.
2. Three options in `design/options/`, and a chosen option with a written reason.
3. `design/tokens.json` with colours, type and spacing.
4. `design/accessibility.md`: criteria and the result of a keyboard test and a screen reader test.
5. One hand-off issue with a stop rule, and a note on what the build got wrong.
6. `design/sessions/`: notes from two people who tried it.
7. A merge request listing the agent briefs, what you checked, and any states that were missing.

## 8. Review checklist

- [ ] The brief names a persona and a journey step.
- [ ] Three options were considered and one was chosen with a reason.
- [ ] Tokens are in git and used.
- [ ] All states are covered (loading, empty, error, offline, no permission).
- [ ] Accessibility criteria are in the issue and were tested.
- [ ] Words are plain and match the glossary.
- [ ] Two real people tried it.
- [ ] No claim of compliance beyond what was tested.

**Next:** the [marketing lens](/library/tracks/frameworks/44-role-lens-marketing/) takes what you built to the people who need it.
