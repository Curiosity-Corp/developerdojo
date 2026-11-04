---
title: "Your files, and how you show your work in git"
description: "Where your files live, why you always work in your own copy, how epics live in git and not in documents, and what history a Sensei looks at."
section: "Program guide"
order: 4
level: foundation
duration: "45 min"
outcomes:
  - "Set up your own copy of the blank templates before you type anything."
  - "Explain why the epics live in git and the workbooks are only for thinking."
  - "Name what evidence of your own work the history shows."
  - "Lay out a small planning repository for your product."
resources:
  - git/pro-git
  - gitlab/issues
  - gitlab/merge-requests
  - gitlab/labels
  - gitlab/milestones
  - gitlab/description-templates
prerequisites:
  - program-how-sensei-work
---

All the program materials are public and free: the lessons on this site, the eight [blank templates](/library/templates-overview) with their downloads, the rubrics and the checklists. What you do with them must live somewhere safe, versioned and shareable. That place is **git**.

## Why it matters

The program rule is simple: **if it is not in git, it is not decided, not planned and not done.** Git is also how you prove the work is yours. History shows each change, when it was made, and by whom. A Sensei can read how your thinking grew. A file in a drawer cannot show that.

## Key ideas

- **Blank templates stay blank.** Never type in the original.
- **Make your own copy first.** Save it under your own name, in your own folder or repository.
- **Workbooks are for thinking. Git is the plan.** Your epics go in your planning space as files and issues, not in a document that nobody can diff.
- **Small, frequent saves.** Many small commits tell a better story than one big one.
- **Private by default.** Keep your evidence in a private repository. Share it with your Sensei.

## Make your own copy

1. Download a template from its page, for example the [repository map](/library/template-repository-map).
2. Save it in your own folder with your name and the date in the file name.
3. Better still: use the Markdown copy and put it in your planning repository.
4. Commit it at once with a message such as "Add blank repository map".
5. Fill it in over several commits.

## A small planning repository

| Path | What goes there | Week |
|---|---|---|
| `README.md` | One paragraph about the product, in your words | 1 |
| `map/repository-map.md` | The repository map | 1 |
| `map/integrations-register.md` | The integrations register | 1 |
| `people/personas.md` | Personas with their evidence | 2 |
| `people/journeys.md` | Touch points, user and customer journeys | 2 |
| `epics/01-...md` to `epics/08-...md` | One file per epic | 3 |
| `roadmap.md` | The ordered roadmap with a reason for each position | 3 |
| `notes/weekly-YYYY-MM-DD.md` | Your [weekly note](/library/template-weekly-note), including AI use | every week |
| `decisions/` | Decision records | as needed |

## Epics live in git

Your epics live in your planning space on a git host. With GitLab Free, keep one file per epic and one roadmap file, linked from issues and milestones. If your plan has the paid epics feature, create the epics there too. Either way, the full history is the proof that you wrote them. Teach this with [Planning in GitLab](/library/tracks/git-and-gitlab/03-planning-in-gitlab) and [Your roadmap in git](/library/tracks/roadmapping-and-epics/04-your-roadmap-in-git).

## What the history shows

| What a Sensei sees | What it tells them |
|---|---|
| Many small commits over days | You worked steadily and your thinking changed |
| One huge commit the night before | The work may not be yours, or was rushed |
| Edits in your own style, with corrections | Your own understanding |
| Text that appears whole and polished | A question: did an agent write it? |
| Issues linked to epics | You know how the levels connect |
| Merge request descriptions with AI use noted | Honest practice |

None of this is a trap. A commit history is just a diary. A good diary is boring and honest.

## Steps to start

1. Create a private repository for your product's planning.
2. Add the README paragraph, written by you.
3. Copy the repository map into `map/` and commit.
4. Add a label for each week, and one issue for each week's output.
5. Invite your Sensei with read access.

## Working with AI agents

- **May:** explain a git command, help you write a clear commit message for a change you made, list files that are missing from your planning layout.
- **May not:** fill your workbooks or write epic files. Do not paste secrets into any prompt.
- **A safe brief:** "List the files in my planning repository and compare them with this layout. Report missing paths only."

## Common mistakes

1. **Typing in the blank template.** Copy it first.
2. **Keeping the plan in a document.** The plan is in git.
3. **One big commit at the end.**
4. **Putting private data or secrets in a repository.** Names only, never values.
5. **A public repository for private evidence.** Keep it private.

## Practice

1. Create your planning repository and commit the first three files.
2. Write a commit message that says why, not only what.
3. Look at your own history. Does it tell a true story?

## Checklist

- [ ] My templates are my own copies.
- [ ] My planning repository is private and my Sensei can read it.
- [ ] My epics are files or issues in git, not in a document.
- [ ] My history shows steady work.
- [ ] No secrets are in any file.

## The 2030 Product Development Manager lens

- **You decide:** what goes in the repository and who can see it.
- **You delegate to agents:** layout checks, link checks, formatting, drafts of commit messages for changes you made.
- **A sample brief:** "Check every link in these Markdown files. Report broken ones with file and line. Do not edit."
- **You verify by:** opening three links and reading the last ten commits yourself.
- **Disciplines involved:** product, engineering, documentation and security.
- **On the agent ladder:** git is the shared memory for **use** and **delegate**, and the audit trail for **govern**.

## Further learning

Next: [AI use and disclosure in the program](/library/program-ai-use-and-disclosure). Read [Git is the source of truth](/library/git-is-the-source-of-truth).
