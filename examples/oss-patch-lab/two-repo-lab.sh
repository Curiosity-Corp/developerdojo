#!/bin/sh
# Dojo-authored disposable practice. Inspect before running. Requires Git and Node.js.
# Run from the folder containing app.mjs and feature.patch, using a shell with mktemp.
set -eu
fixture_dir=$(pwd)
practice_dir=$(mktemp -d "${TMPDIR:-/tmp}/dojo-oss-lab.XXXXXXXX")
trap 'rm -rf "$practice_dir"' EXIT HUP INT TERM

git init -q "$practice_dir/upstream"
cp "$fixture_dir/app.mjs" "$practice_dir/upstream/app.mjs"
git -C "$practice_dir/upstream" add app.mjs
git -C "$practice_dir/upstream" -c user.name='Dojo Practice' -c user.email='dojo@example.invalid' commit -qm 'Practice upstream'

git init -q "$practice_dir/custom"
cp "$fixture_dir/feature.patch" "$practice_dir/custom/feature.patch"
git -C "$practice_dir/custom" add feature.patch
git -C "$practice_dir/custom" -c user.name='Dojo Practice' -c user.email='dojo@example.invalid' commit -qm 'Practice independent patch'

git init -q "$practice_dir/composition"
# Allow local file URLs for these two commands only; do not change global Git settings.
git -C "$practice_dir/composition" -c protocol.file.allow=always submodule add -q "$practice_dir/upstream" vendor/upstream
git -C "$practice_dir/composition" -c protocol.file.allow=always submodule add -q "$practice_dir/custom" vendor/custom
git -C "$practice_dir/composition" -c user.name='Dojo Practice' -c user.email='dojo@example.invalid' commit -qm 'Pin both practice repositories'
printf '%s\n' 'Before:'
node "$practice_dir/composition/vendor/upstream/app.mjs"
cd "$practice_dir/composition/vendor/upstream"
git apply --check ../custom/feature.patch
git apply ../custom/feature.patch
printf '%s\n' 'After:'
node app.mjs
printf '%s\n' 'Practice repositories are removed when this script exits.'
