# Site editors: your own branch, dev, demo, and Ziti

This page is for site editors. Site editors are people with the Developer role on this project who change the
site and check their work on the private preview sites before it goes live. It is maintainer documentation in
the repository. The site does not serve it. The design is in
[decision 0002](decisions/0002-demo-and-dev-preview-branches.md).

## The branches

| Branch | Who changes it | Where you see it | How a change gets in |
| --- | --- | --- | --- |
| your own branch, for example `fix-events-page` | you | in the merge request pipeline (checks only) | you push to it |
| `dev` | editors, by merge request | https://dev.developerdojo.org (private) | merge your branch into `dev` |
| `demo` | editors, by merge request | https://demo.developerdojo.org (private) | merge `dev` into `demo` |
| `master` | Maintainers only | https://developerdojo.org (public) | a Maintainer merges `demo` into `master` |

- You cannot push straight to `dev`, `demo` or `master`. Always work on your own branch and open a merge
  request.
- Every push to `dev` or `demo` runs the full checks: build, links, accessibility and the browser tests. The
  preview site updates only when they are green, about 20 to 45 minutes after the merge.
- The everyday steps (make a branch, edit, open a merge request, read the pipeline) are in
  [CONTRIBUTING.md](../CONTRIBUTING.md). When you open the merge request, choose `dev` as the target branch,
  not `master`.

## Get access from a laptop (once)

GitLab and the preview sites are private. You reach them through Ziti, using your own FocusPass address and its
Microsoft sign-in. Nobody sends you a file, a code, a token or a password. If someone asks you for one, stop and
tell a Maintainer.

Before you start, a Maintainer confirms three things for you:

- you have a FocusPass account;
- you are a member of this project;
- you are on the Ziti list for this site.

If you have no FocusPass account yet, you cannot do these steps. Ask for the account first.

**1. Install Ziti Desktop Edge**

- Windows 10 or 11: download it from https://openziti.io/docs/downloads and run the installer. You need
  administrator rights once.
- macOS: install **Ziti Desktop Edge** from the Mac App Store. Allow the VPN configuration and the system
  extension when macOS asks.
- Linux: ask a Maintainer for the Linux steps.

**2. Add your identity**

Open Ziti Desktop Edge from the system tray (Windows) or the menu bar (macOS). Choose **Add Identity**, then
**With URL**, and enter `https://enroll.focuspass.com`.

**3. Sign in**

1. The new identity shows **authenticate**. Click it. If you are asked to pick a provider, pick
   **keycloak-omlabs**.
2. In the browser, choose **Microsoft**, sign in with your FocusPass address, and complete the second step
   (MFA).
3. The browser shows "Authentication successful". In Ziti Desktop Edge, turn the identity **on**.

**4. Check that it works.** Each page asks you to sign in with FocusPass the first time.

1. Open https://git.developerdojo.org and sign in with FocusPass. The first time you do this, GitLab creates
   your account. Then open the Curiosity-Corp/developerdojo project.
2. Open https://demo.developerdojo.org. The site should load.
3. Open https://dev.developerdojo.org. The site should load.

**If something goes wrong**

- "Can't find the server": Ziti Desktop Edge is off or not signed in. Do step 3 again.
- A certificate warning: stop and tell a Maintainer. Never click through it.
- GitLab says the project does not exist: you are not a member yet. Tell a Maintainer.

## What you can and cannot reach

Your Ziti access covers GitLab and the two preview sites of this site, and nothing else. On GitLab you are a
member of this project only, at the Developer role. With that role you can:

- create your own branches;
- open merge requests;
- merge into `dev` and `demo` once the pipeline is green.

You cannot push to or merge into `master`.
