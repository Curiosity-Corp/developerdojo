---
title: "Sensei handbook 4: run a live build safely"
description: "How to host a live build in public: say when AI is used, keep secrets and private work off the screen, and know what to do if something leaks."
section: "Sensei handbook"
order: 4
level: core
duration: "30 min"
outcomes:
  - "Prepare a screen and a session so that nothing private can appear."
  - "Open a live build by saying how AI will be used, and show the brief and the checks on screen."
  - "Act quickly and calmly if a secret or a private detail appears."
resources:
  - owasp/secrets-management-cheat-sheet
  - gitlab/ci-secrets
  - gitlab/merge-request-reviews
prerequisites:
  - sensei-role-and-limits
  - disclose-ai-use
updated: 2026-11-03
---

## Why this matters

A live build is the Dojo's front window. People watch a real product being built, with real decisions. It teaches a great deal. It is also the place where a password, a private message or a learner's work can end up in front of many people, and a shown secret cannot be taken back.

Plan for safety first. Then the session can be open, relaxed and useful.

The Dojo's live schedule is not announced yet. This page describes how to host when sessions run, on whatever tool the Dojo team asks you to use.

## Key ideas

### What a live build shows

A live build is a Sensei building something on screen and explaining each choice. For the 2030 Product Development Manager, the interesting part is **not the typing**. It is these four things:

1. **The decision.** What are we building, for whom and why? Say it aloud before any agent starts.
2. **The brief.** Put the written brief to the agent on screen. Read it out.
3. **The check.** When the agent's work comes back, read the diff or run the test in front of the audience. Say what you look for.
4. **The other disciplines.** Name when a design, money, operations or security question comes up, and who would answer it in a real team.

### What must never appear on screen

- Passwords, tokens, keys, recovery codes, private certificates.
- The contents of any file that holds settings for your own accounts or machines.
- Email addresses, phone numbers, home addresses or photos of people.
- Messages from other people, other tabs, notifications.
- A learner's private repository or review notes.
- Internal server names or addresses. Describe the idea instead.
- Anything about money, jobs or certificates that sounds like a promise.

### Disclose AI use, out loud and in writing

Rule 5 of The Way: [disclose AI use](/library/disclose-ai-use). Say it in the first minute: "I will use an AI agent for the code. I decide what we build. I read what it writes." Put the same line in the session description. At the end, say what the agent did and what you checked.

## Step by step

### Before the session (the day before)

1. **Choose the product.** Use TrailMug (the example product) or another product that is yours to show. Never a learner's private work, unless the learner has said yes in writing for this session.
2. **Write the plan in one page.** The goal, the decision you will make, the brief you will give, the check you will run, and how you will stop on time.
3. **Rehearse once** with fake data.
4. **Use a clean setup.** A separate user profile or browser profile with nothing signed in except what you need. No password manager open.
5. **Turn notifications off** for the whole system, not only for the browser.
6. **Share one window, not the whole screen.** If the tool only offers the whole screen, close everything else first.
7. **Use fake data and throw-away accounts.** If the build needs a key, use a key made for the session with the smallest permissions, and delete it after.
8. **Keep secrets out of the files you open.** Do not open files that hold keys, even for a second. The [OWASP secrets cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) lists the habits.
9. **Check how the session is recorded or shared**, and say so at the start if it is. Ask the Dojo team if you do not know.

### Five minutes before

1. Read the [code of conduct](/code-of-conduct) again. You are responsible for the tone of your own session.
2. Close every window you do not need. Check the taskbar and the browser tabs.
3. Look at your shared window as a stranger would. What can they read?
4. Have this page and the Maintainer's contact route open on a **second device**, not on the shared screen.

### During the session

1. **Welcome** and the AI line. Say the plan and the time.
2. **State the decision** before you start.
3. **Show the brief.** Give it to the agent. Read it out.
4. **Narrate the work** in short, plain sentences. Many people watch in a second language. Do not use idioms.
5. **Verify in public.** Read the diff. Run the test. If something is wrong, say so and fix forward: make a new change, do not hide the mistake.
6. **Say when you do not know.** "I do not know. Here is how I would find out."
7. **Do not merge unreviewed work.** A person reads it first, even in a demo.
8. **Stop on time.** End with the summary: what we decided, what the agent did, what we checked.

### If something private appears

1. **Stop sharing the screen at once.** Say, "I am pausing. Something should not be on screen."
2. **Do not scroll back to look.**
3. **If it was a secret,** treat it as lost. Replace it (rotate it) in the real system. Deleting a message is not enough.
4. **Tell the Maintainer right away** ([page 6](/library/sensei-when-to-ask-the-maintainer)). Say what appeared and for how long. Do not paste the secret again.
5. **Say it honestly to the audience** if they saw it. No drama. "A key showed for a few seconds. I have replaced it."
6. If a recording exists, ask the Dojo team how to handle it before it is shared.

### After the session

1. Delete throw-away keys and accounts.
2. Write a short note: what we built, what the agent did, what we checked, what we would do differently.
3. Do not post screenshots that show people or chat names.

## Worked example with TrailMug

A Sensei hosts a session: "Add a deposit field to the TrailMug returns form." The decision: a deposit field is needed because cafés want to know a cup will come back. The brief to the agent says what the field is, what it must not store (no card numbers), and the checks: the form still works with an empty field, and no secret appears in any file. The Sensei reads the diff aloud, finds that the agent stored a test key in a settings file, deletes the key, and says so. The note at the end says: "The agent wrote the form change. I wrote the brief and the checks. I found and removed a test key."

## Working with AI agents on this

- **Rung:** a live build is usually **delegate**: one task, one brief. If you show several agents at once, that is **orchestrate**. Say what keeps it safe: the checks and a person who merges.
- **A brief you can adapt:** "Add one field to the returns form. Do not touch other files. Do not store card data. Do not put keys in any file. List every file you changed."
- **Check the result:** read the list of changed files first. If a file is not on your list, ask why.
- **Disclose:** the AI line at the start, and the note at the end.

## Common mistakes

- **Sharing the whole screen** with a chat window open.
- **Showing a settings file "just to explain it".** Explain with a made-up example instead.
- **Typing a real token to "show it works".** Use a throw-away one, and delete it after.
- **Hiding an agent's mistake.** The mistake is the lesson. Fix it forward in view.
- **Going over time.** A tired host makes unsafe choices.

## Practice

Write a one-page plan for a 30 minute live build of a tiny change to TrailMug. Include the AI line, the decision, the brief, the check, and a "what if a secret appears" paragraph. Give it to another Sensei or to the Maintainer for a read before you host.

## Checklist

- [ ] The product is mine to show, or the owner said yes in writing.
- [ ] Fake data and throw-away keys only.
- [ ] Notifications off, clean profile, one shared window.
- [ ] I will say the AI line in the first minute and write it in the description.
- [ ] The brief and the check will be on screen.
- [ ] I know the five steps if something private appears.
- [ ] I have the Maintainer's contact route on a second device.
