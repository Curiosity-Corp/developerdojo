---
title: "Sensei handbook 5: privacy and the code of conduct"
description: "How to look after a learner's work, notes and trust: what is private, what you may share, how to use AI tools safely, and how to follow the code of conduct."
section: "Sensei handbook"
order: 5
level: core
duration: "20 min"
outcomes:
  - "Say what is private about a learner's work and what you need permission to share."
  - "Use an AI tool on review material without leaking anything."
  - "Know what to do if you find a secret, see a conduct problem or hear a worry."
resources:
  - owasp/secrets-management-cheat-sheet
  - web-dev/learn-privacy
  - gitlab/handbook-building-trust
prerequisites:
  - sensei-role-and-limits
updated: 2026-11-03
---

## Why this matters

Learners show you unfinished work, honest scores and sometimes personal worries. They do this because they trust you. If that trust breaks once, it is very hard to rebuild. The Dojo also has a public face: a story shared too freely can hurt a real person.

This page is the short rule set. When in doubt, ask ([page 6](/library/sensei-when-to-ask-the-maintainer)).

## Key ideas

### What is private

By default, all of these are private to the learner and to you as their reviewer:

- Their repository, and anything they have not put in public.
- Their scores, your notes and the review sheet.
- What they said about their job, family, health, money or situation.
- Their real name, photo and contact details, unless they chose to publish them.
- Their drafts, including the parts they are not proud of.

The Product Package standard already asks that evidence stays in a private repository. Respect that.

### What you may share, and when

| You want to ... | You need ... |
| --- | --- |
| Show a learner's work in a live build | A clear yes from the learner, in writing, for that session |
| Talk about a review with another Sensei | Remove the name. Share only what the question needs. |
| Ask the Maintainer for help | Use initials or a code, not a full name. Share only what is needed. |
| Mention a learner in public, in a post or in chat | A clear yes in writing. Never a score. |
| Use a learner's work as an example in a lesson | A written yes, and the Maintainer's agreement |

"Yes" must be free. A learner should not feel they have to say yes to the person who scores them. Say that sentence out loud.

### Keep only what you need

- Open the learner's repository for the review, not for browsing.
- Do not copy the work onto your own machine, into a chat or into another tool unless the learner agrees.
- Send your notes to the learner. Keep your own copy private, and delete it when the Dojo no longer needs it. Ask the Maintainer how long that is.

### Using an AI tool on review material

An agent can help you prepare ([page 2](/library/sensei-run-a-30-minute-review)). It is also a place where private text can be stored somewhere you do not control. So:

1. Ask the learner first. Tell them which tool.
2. Share the least you can: file names and short quotes are usually enough.
3. Remove names, emails, links with keys and anything personal before you paste.
4. Never paste a secret, even to ask about it.
5. You open and read every file yourself. The agent does not score and does not write the feedback.
6. Say that you used it, in the note you send the learner.

Brief you can adapt: "These are file names from a learner's repository and a checklist. Say which checklist items have a matching file. Do not score. Do not guess what is inside the files."

### If you find a secret in a learner's work

A password, token or key in a repository is a real risk, even in a private repo.

1. Tell the learner **privately** and kindly. Everyone does this once.
2. Say that deleting the file is **not enough**. The old version stays in the history, so the secret must be replaced (rotated) in the real system. The [OWASP secrets cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) explains why.
3. Do not copy the secret into any message.
4. Tell the Maintainer if the secret belongs to the Dojo or to a third party, or if you are not sure ([page 6](/library/sensei-when-to-ask-the-maintainer)).

## The code of conduct

Read the [code of conduct](/code-of-conduct). It applies to every place the Dojo exists, including your reviews and live builds. As a Sensei you set the tone. Four habits matter most:

1. **Be kind and patient,** especially with people who are new or still learning English.
2. **Give feedback that is specific and useful.** See [page 3](/library/sensei-feedback-sentences).
3. **Be honest about AI.** Say when you used it, and ask learners to do the same.
4. **Protect other people's privacy.** No addresses, emails or private stories without a clear yes.

### If something goes wrong

| What you see | What you do |
| --- | --- |
| A rude or hurtful comment in your session | Pause. Say calmly that it is not how we treat each other. Continue only when it stops. Then report it. |
| Someone is harassed, or you are | Stop the session if needed. Write down what happened (what, where, when, no gossip). Report it. |
| A learner shares something that worries you about their safety | Be kind. Encourage them to contact a local professional or emergency service if they are in danger. Tell the Maintainer. |
| A learner asks you to keep a secret about harassment or danger | Do not promise to keep it. Say what you must pass on, and why. |

You report. You do not decide the outcome. The Dojo team follows the steps on the code of conduct page. To report, use the way on that page. A dedicated conduct address is coming soon. You can stop your own session at any time.

### Visa, work permit and legal questions

Learners sometimes ask. You are not in a position to advise. Say: "I cannot advise on that. Please ask a qualified professional." Do not guess.

## The 2030 Product Development Manager lens

- **You decide:** what a learner has agreed to share, and what is only yours to know.
- **You delegate:** low-risk preparation to an agent, with a brief that forbids guessing and scoring.
- **You verify:** you open every file the agent mentions. You check that nothing private left the room.
- **Other disciplines:** this is security and legal thinking in everyday form: least access, least data, a written yes. A Product Development Manager does the same in a product. Learners may ask how. Tell them.
- **Ladder:** at **govern**, privacy is a written policy with gates. At the Sensei level, it is your habit. Model it.

## Common mistakes

- **Sharing "just a little" in a group chat.** Small things add up.
- **Using real names in examples.** Use TrailMug and made-up people.
- **Asking for access you do not need.** Ask for the least.
- **Promising secrecy you cannot keep.** Promise care, not silence.
- **Forgetting the notes.** Your review notes are private data too.

## Practice

Write a three-line message to the Maintainer about a pretend problem: "A learner's repository has a key in an old file." Use only initials. Say what you saw, what you did, what you need. Then check: does the message contain the key, a real name or a link with a key in it? It must not.

## Checklist

- [ ] I know what is private about a learner's work.
- [ ] I have a written yes before I show or share anything.
- [ ] I use initials or codes when I ask for help.
- [ ] I ask before I put any learner material in an AI tool, and I share the least.
- [ ] I know what to do when I find a secret.
- [ ] I have read the code of conduct and know how to report a problem.
