#!/bin/sh
# Dojo-authored practice: inspect before running. Requires Git, Node.js, tar and a POSIX shell.
# Run in the folder containing app.mjs and feature.patch. No network or Renovate is used.
set -eu
fixture_dir=$(pwd)
practice_dir=$(mktemp -d "${TMPDIR:-/tmp}/dojo-upgrade-lab.XXXXXXXX")
trap 'rm -rf "$practice_dir"' EXIT

commit_all() {
  git -C "$1" add .
  git -C "$1" -c user.name='Dojo Practice' -c user.email='dojo@example.invalid' commit -qm "$2"
}

git init -q "$practice_dir/upstream"
cp "$fixture_dir/app.mjs" "$practice_dir/upstream/app.mjs"
commit_all "$practice_dir/upstream" 'Practice upstream v1'
git init -q "$practice_dir/custom"
cp "$fixture_dir/feature.patch" "$practice_dir/custom/feature.patch"
commit_all "$practice_dir/custom" 'Practice independently authored patch'
git init -q "$practice_dir/composition"
# Allow local file transport only for this practice, not in global configuration.
git -C "$practice_dir/composition" -c protocol.file.allow=always submodule add -q "$practice_dir/upstream" vendor/upstream
git -C "$practice_dir/composition" -c protocol.file.allow=always submodule add -q "$practice_dir/custom" vendor/custom
commit_all "$practice_dir/composition" 'Pin both practice repositories'

# Export the exact pinned tree into a fresh build directory, not the submodule worktree.
prepare_build() {
  revision_name=$1
  build_dir="$practice_dir/build-$revision_name"
  mkdir "$build_dir"
  git -C "$practice_dir/composition/vendor/upstream" archive --format=tar --output "$practice_dir/$revision_name.tar" HEAD
  tar -xf "$practice_dir/$revision_name.tar" -C "$build_dir"
}
apply_patch() {
  git -C "$build_dir" apply --check "$practice_dir/composition/vendor/custom/feature.patch"
  git -C "$build_dir" apply "$practice_dir/composition/vendor/custom/feature.patch"
}
advance_upstream_pin() {
  new_commit=$(git -C "$practice_dir/upstream" rev-parse HEAD)
  git -C "$practice_dir/composition/vendor/upstream" -c protocol.file.allow=always fetch -q origin "$new_commit"
  git -C "$practice_dir/composition/vendor/upstream" checkout -q --detach "$new_commit"
  commit_all "$practice_dir/composition" "$1"
}

prepare_build v1
apply_patch
cp "$build_dir/app.mjs" "$practice_dir/last-good.mjs"
printf 'v1 ready: '
node "$practice_dir/last-good.mjs"

# A compatible upstream change can be repinned and built with the same patch.
printf '%s\n' 'A compatible upstream change in a separate file.' > "$practice_dir/upstream/UPSTREAM-NOTES.txt"
commit_all "$practice_dir/upstream" 'Practice compatible upstream v2'
advance_upstream_pin 'Update the upstream pin to v2'
prepare_build v2
test -f "$build_dir/UPSTREAM-NOTES.txt"
apply_patch
cp "$build_dir/app.mjs" "$practice_dir/last-good.mjs"
printf 'v2 ready: '
node "$practice_dir/last-good.mjs"
printf '%s\n' 'v2 includes the new upstream note.'

# A conflicting upstream change must stop publication. Leave the last good artifact alone.
sed "s/Hello from upstream/Changed upstream/" "$practice_dir/upstream/app.mjs" > "$practice_dir/changed-app.mjs"
mv "$practice_dir/changed-app.mjs" "$practice_dir/upstream/app.mjs"
commit_all "$practice_dir/upstream" 'Practice conflicting upstream v3'
advance_upstream_pin 'Propose the upstream pin v3'
prepare_build v3
if git -C "$build_dir" apply --check "$practice_dir/composition/vendor/custom/feature.patch" >/dev/null 2>&1; then
  printf '%s\n' 'Unexpected: the conflicting patch passed. Stop and investigate.' >&2
  exit 1
fi
printf '%s\n' 'v3 blocked: the patch no longer applies; do not publish.'
printf 'Previous good artifact: '
node "$practice_dir/last-good.mjs"
printf '%s\n' 'Temporary practice repositories and artifacts are removed on exit.'
