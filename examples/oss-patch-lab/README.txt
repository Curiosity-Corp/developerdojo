Developer Dojo patch lab: illustrative, Dojo-authored files, not Mattermost.
The practice files are provided under the repository's MIT license in LICENSE.txt.

Download app.mjs and feature.patch into a new empty folder. You need Git and Node.js.
Run node app.mjs to see the base result. Then run:

git apply --check feature.patch && git apply feature.patch && node app.mjs

The patched result is: Hello from upstream + locally owned feature
Run the exercise in a disposable folder. It does not install Mattermost or run Renovate.
Windows PowerShell 5 users: see the separate commands on the kata page.
Review licenses, dependencies, permissions, compatibility, and test results before using actual software.

Optional upgrade practice: download upgrade-loop.sh into the same folder. Review it,
then run sh upgrade-loop.sh with Git, Node.js, tar and mktemp installed. It uses local
practice repositories, tests one compatible and one conflicting update, and runs the
previous good practice artifact. It does not contact a server, run Renovate or deploy.
