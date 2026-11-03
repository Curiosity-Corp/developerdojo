# How to edit developerdojo.org

This guide is for people who look after the site: fixing a page, adding a lesson, adding a free course to the
resource list, or starting a new track. **You do not need to be a developer and you do not need to install
anything.** Everything happens in your web browser in GitLab.

Writing rules (plain words, honesty, how to check a link) are in the [style guide](docs/style-guide.md).
The technical field lists are in [docs/content-model.md](docs/content-model.md).

## The idea in one minute

- The site is made of text files. Lessons are `.md` files (Markdown). Free courses are `.yaml` files.
- You never change the live site directly. You make a **branch** (your own copy of the files), change
  files there, and open a **merge request** (MR). An MR is a request to put your change into the real site.
- When you open the MR, GitLab runs **checks** automatically (the *pipeline*). Green means the page builds,
  the links work and the page is accessible. Red means something needs fixing. The page tells you what.
- When the MR is green, you press **Merge**. A few minutes later the change is live at https://developerdojo.org.

## What you need

- A GitLab account that is a member of the **Curiosity-Corp/developerdojo** project with the **Developer**
  role or higher. Ask a Maintainer to add you if the project does not open.
- A web browser. Nothing else.

## Where things live

| You want to change | Folder or file |
| --- | --- |
| A program page (The Way, Developer path, Master Developer, templates, glossary) | `src/content/library/<name>.md` |
| A lesson inside a track | `src/content/library/tracks/<track-name>/<NN>-<lesson-name>.md` |
| A track overview page | `src/content/tracks/<track-name>.md` |
| A free outside course, video or doc | `src/content/resources/<publisher>/<resource-name>.yaml` |
| Events, challenges | `src/data/events.json`, `src/data/challenges.json` |

Do not edit other folders (`src/pages`, `src/components`, `.gitlab-ci.yml`) unless a developer asked you to.

## Step by step: change something

These steps are the same for every kind of change.

1. **Open the project** in GitLab: Curiosity-Corp/developerdojo. Make sure the branch picker (top left) says `master`.
2. **Open the Web IDE.** Press the `.` key on the project page, or click **Edit** and then **Web IDE**.
   You see the file list on the left and an editor on the right.
3. **Open the file** you want to change from the list (or use *New File*, see below).
4. **Edit the text.** For a `.md` file, you can click the **Preview Markdown** button in the top right of the
   editor to see roughly how it will look.
5. **Open Source Control.** Click the branch icon on the left bar (or press `Ctrl+Shift+G`, on a Mac `Cmd+Shift+G`).
   Your changed files are listed.
6. **Write a commit message.** One short line that says what you did, for example
   `Fix a typo in the roadmap standard` or `Add the Kubernetes docs tutorial as a resource`.
7. **Commit to a new branch.** Click the button next to Commit and choose **Create new branch**
   (not "Commit to master"). Give the branch a short name with hyphens, for example `fix-roadmap-typo`.
   Say **yes** when it offers to create a merge request.
8. **Fill in the merge request.** The title can be your commit message. In the description write one or two
   plain sentences about what changed and why. If it finishes a GitLab issue, add the line `Closes #12`
   (use the issue's number). Click **Create merge request**.
9. **Watch the pipeline.** On the MR page, find the **Pipeline** box. Wait until it shows a green tick
   (about 10 minutes). If it shows a red cross, see [When the pipeline is red](#when-the-pipeline-is-red).
10. **Merge.** When the pipeline is green, press **Merge**. If the button says "waiting" or is grey, the
    pipeline is still running; wait.
11. **See it live.** After the merge, a new pipeline runs on `master` and ends with a job called
    `publish_github_pages`. When that job has a green tick (about 10 to 15 minutes in total), open
    https://developerdojo.org and look at your page. If you still see the old text, do a hard refresh
    (`Ctrl+Shift+R`, on a Mac `Cmd+Shift+R`).

> **Preview.** There is no live preview website for an MR. Use the Markdown preview in the Web IDE while you
> write. The green pipeline proves the page builds, its links work and it passes the accessibility checks.
> You can always look at the real page after the merge, and fix forward with another small MR.

If you made a mistake after merging, do not undo it. Make a new small MR that fixes it. We fix forward.

## Add a lesson

Lessons in a track live in `src/content/library/tracks/<track-name>/`. The file name starts with a two-digit
number that sets the reading order: `01-talk-to-customers.md`, `02-write-the-brief.md`.

1. In the Web IDE, right-click the track folder and choose **New File**. Name it `NN-short-name.md`.
2. Paste the template below and fill it in.
3. Write the lesson with the structure in the [style guide](docs/style-guide.md#how-a-lesson-is-built).
4. Commit and open an MR as above.

```markdown
---
title: "Talk to five customers"
description: "How to run short customer interviews and write down what you learned. One or two sentences."
section: "Product discovery"
order: 1
track: "product-discovery"
level: "foundation"
duration: "60 min"
outcomes:
  - "Run a 20 minute interview without leading the answer"
  - "Turn notes into three clear problem statements"
resources:
  - "anthropic/prompt-engineering-interactive-tutorial"
prerequisites:
  - "week-1-see-the-whole-product"
updated: 2026-11-03
---

## Why this matters

Write in plain words. Start with the first heading at level two (`##`). Do not write a `#` heading:
the page title comes from `title` above.
```

Rules for the top part (it is called *frontmatter*, the text between the two `---` lines):

- `section` is the track title, exactly as in the track file. `track` is the track's file name without `.md`.
- `order` is a whole number. Lessons show in track order by this number.
- `resources` are resource ids. An id is the resource file's path without `.yaml`: the file
  `src/content/resources/anthropic/prompt-engineering-interactive-tutorial.yaml` has the id
  `anthropic/prompt-engineering-interactive-tutorial`. The build fails if an id does not exist.
- `prerequisites` are the file names (without `.md`) of pages to read first. A page that does not exist yet is
  quietly left out and the build log shows a warning.
- Put text in quotes when it contains a colon (`:`). Indent the list lines with two spaces and a dash.
- Everything except `title`, `description`, `section` and `order` can be left out.

For a program page (not in a track), put the file in `src/content/library/` and use only the four required fields
(plus any optional ones you want).

## Add a free resource

A *resource* is one course, video, doc or tutorial from another publisher that we recommend. Each one is one
small file. It is stored once and can be used by many lessons.

1. **Check the link yourself** (see [How to check a link](docs/style-guide.md#how-to-check-a-link)). Open it in a
   private window. It must load without a login and must be the thing you describe.
2. **Look in the folder first.** Open `src/content/resources/` and search for the publisher and the title.
   Never make a second file for the same link.
3. **Create the file** `src/content/resources/<publisher>/<short-name>.yaml`. The publisher folder is lowercase
   with hyphens: `anthropic`, `google-cloud`, `microsoft`, `freecodecamp`, `youtube-fireship`. Reuse an existing
   folder when there is one.
4. Paste the template and fill it in.

```yaml
title: "Exact title as the publisher shows it"
provider: "Anthropic"
url: "https://example.com/the-real-link"
cost: "free"
format: "course"
level: "beginner"
duration: "about 2 hours"
skills: [prompt-engineering, ai-agents]
summary: "Two to four sentences. What it covers, and why a Dojo learner should take it and when."
verifiedOn: 2026-11-03
```

The allowed words:

| Field | Allowed values |
| --- | --- |
| `cost` | `free`, `free-audit` (free to learn, paying only for a certificate), `free-tier` (free up to a limit), `paid` |
| `format` | `course`, `video`, `docs`, `tutorial`, `interactive`, `book`, `article`, `certification`, `podcast` |
| `level` | `beginner`, `intermediate`, `advanced` |
| `skills` | one or more of the skill words in [docs/content-model.md](docs/content-model.md#resources) |

`duration` is optional: only write it if the publisher says it. `verifiedOn` is today's date, the day you opened
the link. Use `https://` links only.

5. To show it in a lesson, add its id to that lesson's `resources:` list.

## Add a track

A *track* is a series of lessons on one skill. Create `src/content/tracks/<track-name>.md`:

```markdown
---
title: "Product discovery"
description: "One or two sentences about what this track is for."
group: "product"
order: 1
icon: "search"
level: "foundation"
skills: [product-discovery]
outcomes:
  - "Run customer interviews"
  - "Write a problem statement"
---

## Who this track is for

The body is the track overview, 400 to 900 words in plain words: who it is for, what you will be able to do,
how the lessons build on each other, how it connects to the Developer weeks and Master Developer modules,
and how much time it needs.
```

- `group` is one of `product`, `ai`, `engineering`, `frameworks`.
- `icon` is a name from https://lucide.dev/icons (for example `search`, `git-branch`, `shield-check`).
  If the build says the icon is not in the lucide set, pick another name.
- `level` is `foundation`, `core` or `advanced`.
- Then add lessons to the folder `src/content/library/tracks/<track-name>/`, each with `track: "<track-name>"`.
  The track page lists them in `order`.

## Reading the pipeline

On the MR page, click the pipeline number to see its jobs:

| Job | What it checks |
| --- | --- |
| `check` | The files are well formed (types, templates, frontmatter) |
| `test` | The content rules: every lesson, track and resource is valid and every reference resolves |
| `build` | The whole site builds |
| `links` | Every link inside the site goes somewhere that exists |
| `e2e` | A real browser opens the pages: one title per page, no errors, no sideways scrolling, accessible colours |

Click a red job to read its log. Scroll to the bottom; the first line that explains the problem usually
starts with `Error`, `Content check failed`, or names your file.

## When the pipeline is red

Fix it in the same branch: open the Web IDE on your branch (branch picker, top left), change the file, commit
to the same branch. The pipeline runs again by itself.

| What the log says | What it means | How to fix it |
| --- | --- | --- |
| `Content check failed ... track "x" does not exist` | The lesson's `track:` names a track with no file | Fix the spelling, or create `src/content/tracks/x.md` |
| `Content check failed ... resource "a/b" does not exist` | A `resources:` id has no file | Fix the id, or create `src/content/resources/a/b.yaml` |
| `this lesson is in the folder tracks/x/ so its frontmatter needs track: "x"` | The folder name and the `track:` line disagree | Make `track:` the same as the folder name |
| `same URL as src/content/resources/...` | Two resource files point to the same link | Delete one; add its skills to the other |
| `Invalid enum value` or `Invalid option` naming a file and a field (`cost`, `format`, `level`, `skills`, `group`) | A word is not in the allowed list | Use one of the allowed words (tables above) |
| `Required` or `Invalid input: expected string` naming a field | A needed field is missing or empty | Add it |
| `YAML` or `bad indentation` / `can not read a block mapping` | The top part has a typo: a missing quote, a colon in unquoted text, or wrong spacing | Put the text in double quotes; list lines start with two spaces and `- ` |
| `Icon "x" is not in the lucide set` | The track's `icon` name does not exist | Pick a name from https://lucide.dev/icons |
| `broken link "/library/..."` (job `links`) | A link points to a page that does not exist | Fix the spelling. Internal links look like `/library/people-write-epics` (no `.md`) |
| `test` fails: `links to missing /library/...` | Same as above, found earlier | Same fix |
| `test` fails: `has no internal references` | The page contains a word that must never be public (an internal server or tool name) | Remove it. See the honesty rules in the style guide |
| `e2e` fails with `h1` count 2 | The lesson body starts with a single `#` heading | Change `# Heading` to `## Heading`; the title comes from the frontmatter |
| `e2e` fails with `horizontal overflow` | A table or a long line is too wide for a phone | Make the table narrower (fewer columns, shorter cells) or break the long line |
| `e2e` fails with `color-contrast` or another accessibility rule | Something is hard to read or has no name | Do not use raw HTML with colours; use plain Markdown |
| `e2e` fails with a download or `500 Internal Server Error` when uploading artifacts, but the log says all tests passed | A temporary GitLab problem, not your change | Click **Retry** on the job |
| The log is long and you cannot tell | | Search the log for the word `Error`, or ask in the project; a Maintainer will help the same day |

Still stuck? Do not guess for hours. Write the MR link and the job name in a message to a Maintainer.

## After you merge

- Close the GitLab issue if the work finished it (the line `Closes #N` in the MR does this by itself).
- If you noticed something else to do, open a new issue with the label `status::ready`.
- Every outside link rots over time. If someone reports a dead link, fix the resource file in a small MR (new
  `url` and a new `verifiedOn` date), or delete the file and remove its id from lessons.
