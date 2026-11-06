# Pocket Dojo offline pack

Pocket Dojo is an opt-in, self-contained practice page at `/offline/pocket.html`. Saving the pack registers `/offline/sw.js` with scope `/offline/`; it does not control the rest of the site. The worker caches only that page and serves it on later visits, including offline. It does not cache the full library or make an AI assistant available offline.

The pack's checkboxes and notes use the local storage key `dojo-pocket-progress-v1`. The learner can export or clear this pack's progress inside the pack. Removing the offline cache and unregistering its worker deliberately leaves notes and other Dojo progress intact. Browser storage may be blocked or cleared by the user, browser, or operating system.

When changing the pack or worker, change the cache name consistently in `public/offline/sw.js` and `src/pages/katas/pocket-dojo.astro`. The worker removes older `dojo-pocket-` caches when the new version activates. Do not change or delete the local progress key without an explicit migration. GitLab CI exercises the save, offline navigation and reload path; also review behavior on real supported devices before promising broader offline coverage.
