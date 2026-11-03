#!/usr/bin/env bash
# Publish the BUILT site (dist/) to GitHub Curiosity-Corp/developerdojo branch gh-pages.
# Never publishes the source tree. Authenticates as the focusapiary-mirror-sync GitHub App
# (short-lived installation token); the private key never leaves CI variables.
set -euo pipefail

: "${GITHUB_APP_ID:?GITHUB_APP_ID must be a protected CI variable}"
: "${GITHUB_APP_INSTALLATION_ID:?GITHUB_APP_INSTALLATION_ID must be a protected CI variable}"
: "${GITHUB_APP_PRIVATE_KEY_B64:?GITHUB_APP_PRIVATE_KEY_B64 must be a protected, masked CI variable}"
: "${GITHUB_PAGES_REPOSITORY:?}"
: "${CI_COMMIT_SHA:?}"
dist="${CI_PROJECT_DIR:?}/dist"
branch="gh-pages"

[ "${CI_COMMIT_REF_PROTECTED:-}" = "true" ] || { echo "Refusing to publish from an unprotected ref." >&2; exit 1; }
[ -f "$dist/index.html" ] || { echo "dist/index.html missing: build artifact not present." >&2; exit 1; }
[ "$(cat "$dist/CNAME")" = "developerdojo.org" ] || { echo "dist/CNAME must be developerdojo.org." >&2; exit 1; }
[ -f "$dist/.nojekyll" ] || { echo "dist/.nojekyll missing." >&2; exit 1; }
if find "$dist" -type l -print -quit | grep -q .; then echo "Refusing an artifact containing symlinks." >&2; exit 1; fi

key="$(mktemp)"; chmod 600 "$key"
printf '%s' "$GITHUB_APP_PRIVATE_KEY_B64" | base64 --decode > "$key"
b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
now="$(date +%s)"
header="$(printf '%s' '{"alg":"RS256","typ":"JWT"}' | b64url)"
payload="$(printf '{"iat":%s,"exp":%s,"iss":%s}' "$((now - 60))" "$((now + 540))" "$GITHUB_APP_ID" | b64url)"
signature="$(printf '%s' "$header.$payload" | openssl dgst -sha256 -sign "$key" | b64url)"
rm -f "$key"
token="$(curl --fail --silent --show-error --request POST \
  --header 'Accept: application/vnd.github+json' \
  --header "Authorization: Bearer $header.$payload.$signature" \
  --header 'X-GitHub-Api-Version: 2022-11-28' \
  "https://api.github.com/app/installations/$GITHUB_APP_INSTALLATION_ID/access_tokens" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const t=JSON.parse(s).token;if(!t)process.exit(1);process.stdout.write(t)})')"
test -n "$token"

askpass="$(mktemp)"
cat > "$askpass" <<'ASK'
#!/bin/sh
case "$1" in
  *Username*) printf '%s\n' x-access-token ;;
  *) printf '%s\n' "$GITHUB_TOKEN" ;;
esac
ASK
chmod 700 "$askpass"
export GIT_ASKPASS="$askpass" GIT_TERMINAL_PROMPT=0 GITHUB_TOKEN="$token"

work="$(mktemp -d)"
url="https://github.com/${GITHUB_PAGES_REPOSITORY}.git"
git init --quiet "$work"
git -C "$work" remote add origin "$url"
if git -C "$work" ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
  git -C "$work" fetch --quiet --depth=1 origin "$branch"
  git -C "$work" checkout --quiet -B "$branch" FETCH_HEAD
  git -C "$work" rm -r -q --ignore-unmatch .
else
  git -C "$work" checkout --quiet --orphan "$branch"
fi
cp -a "$dist"/. "$work"/
mkdir -p "$work/.github/workflows"
cp "$CI_PROJECT_DIR/.gitlab/ci/gh-pages-workflow.yml" "$work/.github/workflows/pages.yml"
git -C "$work" add -A
if git -C "$work" diff --cached --quiet && git -C "$work" rev-parse --verify -q HEAD >/dev/null; then
  echo "gh-pages already matches this build; nothing to publish."
  exit 0
fi
git -C "$work" -c user.name='Developer Dojo release' -c user.email='release@developerdojo.org' \
  commit --quiet -m "Publish built site from ${CI_COMMIT_SHA}" -m "Source: https://${CI_SERVER_HOST}/${CI_PROJECT_PATH}/-/commit/${CI_COMMIT_SHA} (pipeline ${CI_PIPELINE_ID})"
# Plain push (fast-forward only): fails if gh-pages changed underneath us, never force-updates.
git -C "$work" push origin "HEAD:refs/heads/$branch"
echo "Published $(git -C "$work" rev-parse --short HEAD) to ${GITHUB_PAGES_REPOSITORY}:${branch}"
