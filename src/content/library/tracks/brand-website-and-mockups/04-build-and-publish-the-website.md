---
title: "Build and publish the website"
description: "Plan a four-page product site, brief an agent to build it from your brand sheet, publish it from git on a free static host and check it on a phone, on speed and on honesty."
section: "Brand, website and mockups"
order: 4
track: "brand-website-and-mockups"
level: "core"
duration: "3 hours"
outcomes:
  - "Plan a four-page site: home, how it works, price or offer, contact and policies"
  - "Write a brief that lets an agent build the site from your brand sheet without guessing"
  - "Publish from git with a free static host"
  - "Check the site on a phone, on speed and for claims you cannot prove"
resources:
  - "figma/web-design-basics"
  - "web-dev/learn-responsive-design"
  - "web-dev/learn-html"
  - "web-dev/web-vitals"
  - "gitlab/pages"
  - "mozilla-mdn/learn-web-development"
prerequisites:
  - "week-5-brand-website-mockups"
  - "git-is-the-source-of-truth"
updated: 2026-11-03
---

**Supports:** Developer, week 5 (Brand, website and mockups), Part 2: product website. **Time:** about three hours.

## 1. Why this matters

Your website is the front door. A visitor decides within seconds whether she understands what you offer. For a small product, a clear four-page site in plain words is worth more than a large clever one.

Building a simple site is something an agent can do well and quickly, which is why the brief and the checks are the craft. The agent does not know what you can honestly promise, which pages you need for legal reasons or which claims you can back. It will produce a pleasant, generic site with generic claims, unless you tell it exactly what to do and then read every word.

A Product Development Manager (PDM) owns the site's promises and its compliance. The words make promises. The footer carries your privacy notice and terms. The page weight and speed affect people on poor connections. Choosing the pages, writing the words and checking the result are yours.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The pages, the words and promises, what data the site collects, where it is hosted | Building the pages and styles; setting up the publishing pipeline; measuring speed; checking links | Every claim is true; the site works on a phone; no trackers or data you did not choose; policies exist and are linked | Legal and privacy (notices, cookies, claims), marketing (message), design (look), engineering (build, hosting), operations (domain, certificates), finance (costs) |

## 2. Key ideas

### Four pages are enough

Version one has four parts:

1. **Home:** what it is, who it is for, one call to action.
2. **How it works:** three steps.
3. **Price or offer:** even if it says "free pilot".
4. **Contact and policies:** a privacy notice and terms, linked from the footer.

Figma's web design basics guide covers layout, navigation and responsive design, and is a good checklist before you plan. Keep navigation to four items.

### Plain HTML is a fine start

A static site, made of HTML, CSS and a little JavaScript or none, is fast, cheap and easy to host. Mozilla's Learn web development material and web.dev's free HTML course teach the fundamentals. Use semantic HTML (headings in order, lists as lists, buttons as buttons). It is the base for accessibility and good search results, and it is easy for an agent to produce and for you to read.

### Phone first

Most visitors will arrive on a phone. web.dev's responsive design course covers making sites that work across screen sizes. Design the phone layout first, then widen. Test at about 375 px wide, and at a laptop size.

### Speed is a feature

Google's Web Vitals describe measurable aspects of loading, interactivity and visual stability. You do not need to master them. You need to set a simple target and measure it, such as "the home page is under 500 KB and shows its main content within about two seconds on a typical phone connection". Heavy images and many fonts are the usual causes. Keep the number of fonts, scripts and images small.

### Publish from git

GitLab's documentation on GitLab Pages explains how a static site is published straight from a repository, through the pipeline. This keeps the source in git, with history and review, and publishing is a merge, not a manual upload. Keep the site in a repo, for example `site/` in your product repo or a repo of its own. Check the current GitLab documentation for how Pages works on your plan and for how to use a custom domain.

### Privacy and trackers

Do not add analytics, trackers or forms you do not need. Every one is a promise you must keep. If you collect an email, say why, say how long you keep it and link to the notice. If you use cookies beyond the strictly necessary, the rules in your country may require consent. Ask a privacy adviser. This is not legal advice.

### Claims on the page

Every sentence that promises something is a claim. Check each against what the product does today. If a number or a feature is not yet proven, say "pilot" or leave it out. The never-say list from your brand sheet is the standard.

## 3. Step by step

### Step 1: Plan the four pages

For each page, write its purpose, the person it serves, the one thing she should do and the words (from your brand sheet and mockups).

### Step 2: Write the words first

Write the text for every page in a file, before any design. Read it aloud. Cut anything you cannot prove.

### Step 3: Write the privacy notice and terms

Write short, plain versions. State what you collect, why, how long, who can see it and how to ask for deletion. Have an adviser review them before launch.

### Step 4: Set the acceptance checks

Write checks a person can run: "The home page loads on a phone and shows the promise without scrolling." "Every page has a footer with links to the privacy notice and terms." "No requests to third-party trackers." "The page is under 500 KB."

### Step 5: Brief an agent

Give it the words, the brand sheet, the mockups, the checks, the scope and the limits (no external scripts, no trackers, no external fonts unless listed).

### Step 6: Review the merge request

Open the site locally or on the preview. Run every check on a phone. Read every word again.

### Step 7: Publish

Merge. Let the pipeline publish through the static host. Open the live address on a phone.

### Step 8: Measure

Check page weight and loading. Write the numbers in `site/README.md`.

### Step 9: Record

Add decisions to the decision log, such as "no analytics in v1".

## 4. Worked example: TrailMug

TrailMug is fictional. Four pages, one repo `trailmug-web`.

| Page | Purpose | Action |
|---|---|---|
| Home | Say the promise and who it is for | "Find a partner café" |
| How it works | Three steps: find a café, return a cup, pick up a clean one | "Find a partner café" |
| Offer | "Free pilot in three cafés" | "Join the waiting list" |
| Contact and policies | Contact, privacy notice, terms | Link in footer on every page |

**Words first.** The founder wrote all text in `site/content.md`. She struck "eco-friendly" and "instant" (never-say list) and added "pilot" next to the one-minute claim.

**Checks.**

1. On a 375 px wide phone, the home page shows the promise and the main button without scrolling.
2. Every page has a footer with links to the privacy notice and terms.
3. The site makes no request to a third party.
4. The home page is under 500 KB.
5. Every image has a text alternative.
6. The waiting-list form asks only for an email, says why and links to the notice.

**The brief to the agent** (excerpt):

```text
Build the TrailMug site in site/ as plain HTML and CSS, from
site/content.md (the words, do not change them), brand/brand-sheet.md and
design/mockups/. Four pages. No JavaScript unless a check requires it.
No trackers, no third-party requests, no web fonts except the one in
the brand sheet, self-hosted. Semantic HTML. Phone first.
Add a GitLab Pages job to the pipeline that publishes site/.
Acceptance checks: [the six above]. Do not touch files outside site/
and the pipeline file. Output: a merge request listing how to run each
check. If a check cannot be met, stop and say why.
```

**Review.** The agent's merge request passed its own tests. On her phone, check 1 failed: a large hero image pushed the button below the fold. The page was also 1.4 MB because of that image. She sent back: "Compress the hero to under 150 KB and move the button above it." It also used a font from an external service, which broke the limit "no third-party requests". She asked for it to be self-hosted.

**After publishing.** She measured: home page 190 KB, main content visible in under two seconds on a mid-range phone on mobile data (her own test). She wrote the numbers and the date in `site/README.md` and added "no analytics in v1" to the decision log.

## 5. Working with AI agents on this

**Delegate:**

- **Building** the four pages from your words and sheet.
- **Pipeline setup** for publishing.
- **Link and size checks.** "List every link and every file over 100 KB in the built site."
- **A claims scan.** "List every sentence on these pages that makes a promise or states a number, with the file and line."
- **A third-party scan.** "List every external request the site makes."

**Do yourself:**

- Choose the pages and write the words.
- Write the policies with an adviser.
- Decide what data the site collects.
- Run the checks on a real phone.
- Approve publishing.

**A brief you can adapt (claims scan):**

```text
Read the built site in public/. For every sentence that promises a
result or states a number, list: the page, the sentence, and whether the
same wording appears in site/content.md. Flag any sentence that is not
in content.md. Also list every external URL requested by any page.
Report facts only; do not edit files.
```

**How to check the output.** Open the site on a phone and a laptop. Read every page aloud. Check page weight in the browser's network panel. Look for invented testimonials, numbers, logos and "as seen in" claims, which agents sometimes add.

**Never** let an agent invent testimonials, customer logos, statistics or awards. If it appears, delete it and tighten the brief.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate** and reaches **govern**. The checks for third-party requests, page weight and links can run in the pipeline on every change, so the rules hold when nobody is looking. A protected main branch and a required merge request mean nothing is published without a person's approval. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

**Disclose.** On the site, in the footer or the about text, say plainly that AI tools helped build the site, and that a person wrote and checked the content. Record the same in `site/README.md`.

## 6. Common mistakes

- **Designing before writing.** Write the words first.
- **Too many pages.** Four are enough.
- **Heavy images and many fonts.** Measure the page.
- **Trackers added "just in case".** Each is a promise.
- **No privacy notice or terms.** Link them in the footer.
- **Claims you cannot prove.** Use the never-say list.
- **Agent-invented testimonials or logos.** Delete them.
- **Testing only on a laptop.** Test on a phone.
- **Publishing by hand.** Publish from git through the pipeline.
- **Skipping the adviser** on notices.

## 7. Practice: build and publish

**Deliverable:** in your git repo:

1. `site/content.md`: the words for four pages, plus the privacy notice and terms.
2. The built site in `site/`, published through a free static host from the pipeline, with the live address in `site/README.md`.
3. `site/checks.md`: your acceptance checks, with pass or fail, who ran them and when.
4. Page weight and loading numbers with the date.
5. A list of every external request the site makes (ideally none).
6. Decision-log lines for choices such as "no analytics".
7. Your AI-use line, also on the site.

Commit with a message such as `Add four-page site and publish pipeline`.

**Check:** open the live site on a phone you do not normally use. Ask a person to find the privacy notice and tell you what the product is in one sentence.

**Stretch:** set a pipeline step that fails if any page is over your size limit or if the site makes an external request.

## 8. Checklist

- [ ] Four pages with a clear purpose and one action each.
- [ ] The words were written, read aloud and checked before design.
- [ ] Privacy notice and terms exist and are linked in the footer.
- [ ] No trackers or external requests unless chosen and recorded.
- [ ] The site works on a 375 px phone.
- [ ] Page weight and loading are measured and recorded.
- [ ] No invented testimonials, logos or numbers.
- [ ] The site is published from git through the pipeline.
- [ ] AI use is disclosed on the site.
- [ ] I recorded my AI use.

## 9. Further learning

Figma's web design basics, web.dev's free courses on HTML and responsive design and Mozilla's Learn web development material cover the building blocks. Google's Web Vitals explain how to measure speed, and GitLab's documentation on Pages shows how to publish from git. In the final lesson you test the site for accessibility and watch a real person use it.
