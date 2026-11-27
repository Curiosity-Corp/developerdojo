# 0002: Demo and dev preview branches

- **Status:** Accepted (site side). The GitLab settings, the second project and the hosts are declared by
  FocusApiary/infrastructure and FocusApiary/ziti, which own them.
- **Date:** 2026-11-27.
- **Issue:** #132 (CEO order: site editors get edit access on demo and dev branches, their own branches, and
  Ziti access to this site only).
- **AI disclosure:** an AI agent wrote this record.

## Context

Until now the site had one long-lived branch, `master`. Its pipeline publishes the built site to GitHub Pages at
developerdojo.org, and it also deployed the same build to this project's GitLab Pages as an internal preview.

Site editors now need two places to see their work before it reaches production:

- `demo`, served at `demo.developerdojo.org`;
- `dev`, served at `dev.developerdojo.org`.

Both are private. The fleet already serves `demo.<domain>` for its other marketing sites. That pattern is
FocusApiary/infrastructure `sites/junior-branding-sites.yaml`:

- the project's GitLab Pages, built from its `demo` branch, get a custom domain;
- an internal gateway route serves that domain;
- GitLab Pages access control (FocusPass sign-in) and a Ziti service keep it private.

Two facts shape the dev host:

1. GitLab Pages serves one site root per project. A second branch can only be a parallel deployment under a
   path prefix (`/dev/`).
2. This site's links are root-relative: about 430 `href="/..."` in `src/`, plus fetches of `/search-index` and
   `/pagefind`. A build served under `/dev/` would send every link back to the demo site. Making every link
   base-aware is a large change with no other benefit. Rewriting links after the build would be a hack.

## Decision

1. **Branches.**
   - `demo` and `dev` are long-lived branches, created from `master`.
   - Work flows from an editor's own branch to `dev`, then to `demo`, then to `master`. Merge requests are the
     normal path.
   - `master` stays Maintainers only.
   - FocusApiary/infrastructure `gitlab-branch-protection` declares the protection for `demo` and `dev`: push
     and merge Developers. The CEO order asks that editors at the Developer role can push and land changes
     there. Protection still stops force pushes and deletion, and CI still gates every deploy.
2. **Gates.** A push to `demo` or `dev` runs the same gates as `master`: check, test, the pathway jobs, build,
   e2e and links.
3. **Demo deploy.**
   - The `pages` job deploys the `demo` build to this project's GitLab Pages, which is `demo.developerdojo.org`.
   - `master` no longer deploys to GitLab Pages. Production is GitHub Pages, and the old internal preview had
     no reader that the demo host does not serve better.
4. **Dev deploy.**
   - `dev` deploys to a separate pages-only project, `Curiosity-Corp/developerdojo-dev`, and that project's
     Pages are `dev.developerdojo.org`.
   - The project holds no source. Its CI configuration file setting points to
     `.gitlab/ci/dev-pages.gitlab-ci.yml@Curiosity-Corp/developerdojo`, so the whole dev path is reviewed here.
   - The `dev_pages` job in this pipeline triggers that project once the gates pass.
   - The downstream `pages` job takes the `dev` build artifact with `needs:project` and the CI job token. No
     credential is stored anywhere.
5. **Deploys run only on protected pushes.**
   - Both deploy jobs run only while the branch is protected (`$CI_COMMIT_REF_PROTECTED`), the same rule as
     `master`.
   - Until FocusApiary/infrastructure applies the protection, `demo` and `dev` pipelines run the gates and
     deploy nothing.

## What FocusApiary/infrastructure and FocusApiary/ziti declare

The site needs the following from the repositories that own them. Each item goes through their own MRs:

- Protection of `demo` and `dev`: push and merge Developers, no force push.
- `Curiosity-Corp/developerdojo` in `sites/junior-branding-sites.yaml` with `domain: developerdojo.org` and
  `main_branch: master`. This gives `demo.developerdojo.org` from this project's Pages.
- The project `Curiosity-Corp/developerdojo-dev`, set up as follows:
  - initialised with a `main` branch;
  - Pages private (project members only);
  - CI configuration path `.gitlab/ci/dev-pages.gitlab-ci.yml@Curiosity-Corp/developerdojo`;
  - the same members as this project, at Reporter, so that they can open the private Pages;
  - on the CI job token allowlist of `Curiosity-Corp/developerdojo`.
- `dev.developerdojo.org` as that project's Pages custom domain, with the same gateway route and certificate
  as the demo hosts.
- The Ziti service for both hosts (`site-demo-developerdojo`), dialled by this site's editors.

## Consequences

- The public site still releases only from `master`. A bad `demo` or `dev` build never reaches developerdojo.org.
- Every preview push costs a full pipeline. The previews show what CI checked, not a raw build.
- `dev_pages` fails if `Curiosity-Corp/developerdojo-dev` does not exist when `dev` is first protected. So the
  project and the protection must be applied together.
- The canonical URLs in the preview builds still point to developerdojo.org, because `site` in
  `astro.config.mjs` is not changed. The previews are private, so search engines never see them.
