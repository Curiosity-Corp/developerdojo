---
title: "Share it honestly"
description: "Publish your write-up with AI use disclosed, no hype, no private details and no claim you cannot show. Add a human approval step, a small check in your repository and a plan for corrections."
section: "Thought leadership"
order: 3
track: "thought-leadership"
level: "core"
duration: "3 hours"
outcomes:
  - "Disclose AI use in one plain line that says what the agent did and what you checked"
  - "Find and remove hype, vague claims and numbers you cannot trace"
  - "Keep private details, customers and internal names out of public writing"
  - "Set a human approval step and a small automatic check before you publish"
  - "Publish one honest write-up in your own repository and handle a correction without hiding the first version"
resources:
  - "digital-inquiry-group/civic-online-reasoning"
  - "anthropic/reduce-hallucinations"
  - "anthropic/ai-fluency-framework-foundations"
  - "gov-uk/ai-playbook"
  - "github/open-source-guides-best-practices"
  - "mit-ocw/mit-communication-lab"
prerequisites:
  - "tracks/thought-leadership/02-write-a-short-post-from-your-product-package"
  - "disclose-ai-use"
updated: 2026-11-03
---

**Supports:** Developer, week 6 (the Product Package and the AI-use notes) and the Master Developer capstone. **Time:** about three hours.

## 1. Why this matters

Public writing is a promise. Each reader who trusts it takes a small risk on you. If they find one claim you cannot back, they will doubt the others. A public post is stored for a long time and may be copied without your control.

AI makes the risk larger. An agent writes smooth, confident text in seconds. It adds claims you did not make, invents numbers, names and studies, and smooths away the parts where you were unsure. A person who publishes that text without saying how it was made carries all the risk. People accept AI help. They do not accept being misled about it.

This lesson is the last step: sharing what you wrote in lesson 2 in a way you can defend. You disclose AI use, remove hype, protect private details, set a human approval step and write a small rule that keeps the habit true when you are tired. You also plan for the day you find a mistake.

### The four questions for this lesson

1. **What do I decide here?** Whether the post is true enough and safe enough to publish, what the disclosure line says, who must read it first, and how I will fix a mistake.
2. **What do I delegate to agents, and with what exact brief?** A hostile fact-check of the draft against my facts list, a scan for hype and private details, and the wording of a correction note (section 5).
3. **How do I verify what comes back?** I match every flagged item to my claims table, open every source, and read the final text myself and with one other person.
4. **Which other disciplines are involved?** Legal and privacy (people, data, rights to images), security (secrets in screenshots), brand (voice and promises), finance (money claims), support (replies).

**Rung on the agent ladder:** **delegate**, with the first step of **govern**. You hand the checking tasks to an agent with a written brief, and you write down a rule and a small automatic check that make the rule hold without you watching.

## 2. Key ideas

### Disclose AI use in one plain line

Disclosure is short and specific. It says what the agent did, which tool, and what you did yourself. Compare:

- Weak: "Written with AI." (What part? Who checked?)
- Better: "An AI agent drafted the first version from my notes. I wrote the title and opening, checked every claim against my files and edited the final text."

Put the line where the reader cannot miss it, under the title or at the end. Keep the longer record (brief, raw output, review notes) in your repository. The page on [disclosing AI use](/library/disclose-ai-use) gives a fuller template. Disclosure is not an apology. It shows you know what the tools can and cannot do.

### What counts as a claim

A claim is any sentence a reader could check or act on:

- A fact: "two owners told us the swap felt slow".
- A number: a count, a date, a percentage, an amount of money.
- A result: "it works", "it saves time".
- A promise: "we will launch in spring".
- A comparison: "faster than the old way".
- A reference to a source: "a study found".

Opinions are fine when labelled as opinions and backed by your work. Everything else needs evidence you can show.

### The source check, again

In lesson 1 you ran a source check on a number. Do the same for every outside fact left in the post. This habit separates a thought leader from a person who repeats things.

The free curriculum in the resources teaches a method used by fact-checkers: ask who is behind the information, what the evidence is and what other sources say. It teaches you to leave a page and see what others say about its source before you trust it. Use it on every statistic and every AI answer.

Three extra rules for numbers:

- **A repeated number is not a verified number.** If ten sites quote one figure, trace it back to the one that did the counting.
- **Say who was asked.** "Two owners in a trial" is honest. "Most owners" is not, unless you asked most owners.
- **If you cannot open the original, leave the number out.** You can still say the point in words, or show your own evidence.

### Hype and vague words

Hype is a claim with the proof removed. Watch for:

- Big words: "revolutionary", "game-changing", "world-class", "cutting-edge".
- Fake precision: "10x", "zero effort", "100% secure".
- Vague size: "huge", "significant", "many", "most", "soon".
- Borrowed authority: "experts agree", "studies show", "research proves".

For each one, ask: what did I see that makes this true? Write that instead. If you saw nothing, delete the word. Say what the thing cannot do, too. A limit stated plainly makes the rest more believable.

### Do not share what is not yours to share

Some things never go in a public post:

- Passwords, keys, tokens and anything that gives access.
- Internal server names, addresses, repository paths and the layout of private systems. Describe the idea instead.
- Names, photos, emails or stories of real customers, learners, partners or staff, unless you have asked and they agreed in writing.
- Screenshots that show any of the above, even in a corner.
- Text, images or video you do not have the right to use.
- Promises about jobs, pay, certificates or money.

When unsure, leave it out and ask a person. A missing paragraph costs nothing. A leaked one cannot be taken back.

### A human approves, always

An agent prepares and a person publishes. Before the post goes out, a named person must read it. That can be you, after a night's sleep and with the claims table open. Better still, a second person: a coach, a peer or a mentor, asking "Where could this mislead someone?" This is a small rule of governance. Write it down so you cannot skip it in a hurry.

### A small automatic check

A written rule is better with a check that does not depend on your memory. Your repository can fail a change when something is missing, for example a script that looks for the disclosure line and a list of hype words and stops the merge if it finds a problem. You can brief an agent to write it, then read and test it yourself. The check does not make a post true. It catches lazy mistakes so your attention goes to the real ones.

### Corrections: fix forward

You will make mistakes. Do not edit one away in silence. Fix forward: change the text, add a short dated note saying what was wrong and what changed, and keep the earlier version in git history. Thank the person who found it. A visible correction shows you can be trusted when the truth is awkward.

### Replies

Public writing invites replies: kind, wrong and rude. Decide your rules before you publish. Answer questions plainly, say "I do not know" when you do not, do not argue with people who only want to argue, and never share private details in a reply. The open source guide on running a project has advice on setting expectations and saying no kindly.

## 3. Step by step

### Step 1: Start from the draft and its claims table

Make sure the table has no unsupported row.

### Step 2: Run the source check on every outside fact

Use the log from lesson 1. Remove any number you cannot trace to an original you opened.

### Step 3: Run the hype and vague-word scan

Search the post for the words in section 2. Replace each with what you saw, or delete it.

### Step 4: Run the privacy scan

Check names, images, links and text for private details. Open every screenshot at full size. Look for anything that resembles an address, a key or an internal name.

### Step 5: Add the disclosure line

Write one plain line: what the agent did, which tool, what you did yourself and what you checked. Put it where the reader sees it.

### Step 6: Run the hostile check with an agent

Use the brief in section 5. Act on each flag or write why you reject it.

### Step 7: Ask a second person to read it

Give them the post and the claims table. Ask where it could mislead.

### Step 8: Set up the small check

Add a rule to your README: who must approve a post and what the automatic check looks for. Add the check itself.

### Step 9: Wait a night, then publish

Re-read it the next morning. Merge the post into your main branch and let your page host build it, if you use one. Open the published page on a phone and check it as a reader would.

### Step 10: Write your correction plan

Add a `corrections.md` file with one line: "Corrections are listed here with the date, what was wrong and what changed." It is empty on day one.

## 4. Worked example: TrailMug

TrailMug is fictional. The details below are invented to show the method.

The founder has her post "A cup swap scheme is won or lost at the counter" and a claims table with no unsupported rows. Now she prepares to publish it.

**Source check.** The post has no outside facts. She notes that in her log.

**Hype scan.** She finds "a real game-changer for busy counters" and replaces it with "Both owners said the morning rush was their main worry." She changes "soon" to "we plan to test with counter staff in the week of 23 November".

**Privacy scan.** A screenshot of her admin page shows a café's name in the corner. She swaps it for a mock-up with a fake café, and says so under the image.

**Disclosure line.** "An AI agent drafted a first version from my notes. I wrote the title and the opening, checked every claim against my files and edited the final text. The brief and the raw draft are in the repository."

**Hostile check.** The agent flags one sentence: "Owners said the swap felt slow." In her notes, one owner said "a bit awkward", not "slow". She changes the sentence to quote the owner's own word, with consent.

**Second reader.** Her mentor asks: "You say you tested the swap yourself. Did you time it?" She had not. She changes "slower" to "felt slower" and adds "I did not time it".

**Publication.** She waits a night, merges the post and checks the page and links on her phone.

**A correction, two weeks later.** A reader reports a broken link to the trial notes. She fixes it in a new commit, adds "Correction, 17 November 2026: the link to the trial notes was broken. It is fixed." to the post, notes it in `corrections.md` and thanks the reader.

## 5. Working with AI agents on this

**What I decide:** whether it is true and safe enough to publish, the disclosure, who reads it first, and the correction when needed. The agent does not decide any of these.

**What I delegate, with an exact brief.** Paste the post, the claims table and the facts list after the brief:

```text
You are a hostile fact-checker. Below are a draft post, my facts list and
my claims table. Do NOT rewrite the post.
Do four things and label them 1 to 4:
1. UNSUPPORTED. Every sentence that states a fact, number, result,
   promise or comparison that is not in my facts list. Quote the sentence.
2. HYPE. Every word or phrase that is hype, vague size, fake precision or
   borrowed authority. Quote it.
3. PRIVATE. Anything that looks like a real person's name, a customer, an
   address, a key, an internal system name or a promise about jobs, pay
   or money. Quote it.
4. MISSING LIMITS. Places where the post sounds more certain than my
   facts allow, or hides something that does not work yet.
Rules: use only what is in the text I gave you. Do not invent facts or
sources. If you are not sure, say "not sure". Do not give an overall
verdict on whether the post is good.
```

Other tasks you can hand over: ask an agent to write a short script that checks every post for the disclosure line and a list of hype words (then read the script and test it on a good and a bad file); ask it to draft the wording of a correction note from facts you give.

**How I verify what comes back.**

- I compare each flag with my claims table. A flag I did not already have is a gap in my table.
- I open every source myself. An agent saying "this is supported" is not evidence.
- I treat an empty list as suspicious and scan the post myself too.
- I test the automatic check on a file that should fail and one that should pass.
- A second person reads the final text before it goes out.

**Which disciplines are involved.** Legal and privacy decide what may be said about people, data and images. Security checks screenshots and links. Brand checks voice and promise. Finance checks money claims. Support prepares for replies. I ask each to read the post when it touches their area.

**Disclose.** The line goes in the post. The brief, raw output and review notes go in the repository. See [Disclose AI use](/library/disclose-ai-use).

**Where this sits on the ladder.** You are on **delegate**, taking the first step toward **govern**. Here is a small, real example of a governing rule: *a post may be merged only if a named person other than the drafting agent has approved the merge request, the post contains an "AI use" line, and the automatic check has passed.* A tiny check might look like this:

```bash
# Fail if a post has no AI-use line, or contains a banned hype word.
for f in thought-leadership/posts/*.md; do
  grep -qi "AI use:" "$f" || { echo "No AI-use line in $f"; exit 1; }
  if grep -qiE "game-changing|revolutionary|world-class|cutting-edge" "$f"; then
    echo "Hype word in $f"; exit 1
  fi
done
```

Several agent sessions at once, for example one drafting, one checking claims and one scanning for private details, would be **orchestration**. The same gate would still decide what may be published. The rule does not change as the number of agents grows.

## 6. Common mistakes

- **A vague disclosure.** "AI helped" tells the reader nothing. Say what it did and what you checked.
- **A number you cannot trace.** If you cannot open the original, drop it.
- **Saying "most" when you asked two.** Say how many you asked.
- **Trusting the agent's fact-check.** It can miss things. You check.
- **A screenshot with a private detail.** Check the edges and the tabs.
- **Naming a customer who did not agree.** Do not.
- **Editing a mistake away in silence.** Fix forward with a dated note.
- **Arguing in the replies.** Answer questions. Ignore people who want a fight.
- **A check you never tested.** Run it on a file that should fail.

## 7. Practice: publish one honest write-up

**Deliverable:** one published write-up and its evidence in your own repository. Use the post from lesson 2.

1. **The published post** in `thought-leadership/posts/<date>-<short-title>.md`, merged into your main branch (and shown on a page if you use a page host). It includes the disclosure line near the top or at the end. It covers one part of your Product Package and links to the files it comes from.
2. `claims.md`: the final claims table with no unsupported row.
3. `source-log.md`: the source check for every outside fact, or "none used".
4. `checks.md`: the results of your hype, privacy and hostile checks, and your verdict on each flag.
5. `approval.md`: who read it before publication, the date and what they changed. A person other than the agent. A coach, mentor or peer.
6. `corrections.md`: empty, with the one-line rule.
7. A short README rule: who must approve a post and what the automatic check looks for. Add the check itself if you can.

Commit with a message such as `Publish first post with claims table and disclosure`. In the merge request description, write what changed, what you verified and how you used AI.

**Check:** open the published page on a phone, in a private window. Read it as a stranger. Click every link. Ask: could anything here mislead someone?

**Stretch:** ask a person outside your team to tell you what they think the post claims, and compare it with what you meant. Write two lines on any difference.

## 8. Checklist

- [ ] Every claim has evidence in my claims table.
- [ ] Every number links to its original source, or there are no numbers.
- [ ] I removed hype words and vague words, and I said what does not work yet.
- [ ] No private names, keys, internal names, customer details or unlicensed material.
- [ ] Every image is checked and uses fake data.
- [ ] The disclosure line says what the agent did and what I checked.
- [ ] A person other than the agent read the post and approved it.
- [ ] The small check exists and I tested it on a good and a bad file.
- [ ] I waited a night, then published and opened the live page.
- [ ] I have a correction file and a plan to fix forward.

## 9. Further learning

The free civic reasoning lessons teach the habit of checking who is behind a claim and what the evidence is. The Anthropic pages show how to make an agent less likely to state what it does not know, and how to work with AI while keeping the judgement yourself. The UK Government playbook is long, so read only its principles on knowing what AI cannot do and keeping meaningful human control, and compare them with your own rules. The open source guide and the MIT guides help with expectations, replies and presenting evidence. When you finish, ask which part of your Product Package you would write about next.
