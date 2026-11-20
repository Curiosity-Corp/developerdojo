# Stable track URLs: robotics and biotechnology

Robotics and biotechnology are the Dojo's core focuses (issue #125, CEO order of 19 November 2026). Other sites link
to these tracks: Ignite Curiosity, curiositycorp.org, the Dream Wave scholar sites, INSTAR Lab and US Fellows.
So the URLs below are a promise. **Do not rename or move them.**

## The URLs

| Track | URL | Capstone a learner can show |
| --- | --- | --- |
| Robot software | https://developerdojo.org/library/tracks/robot-software/ | A simulated mobile robot that maps a room and fetches an object, with a test suite |
| Robot learning | https://developerdojo.org/library/tracks/robot-learning/ | A learned policy for one manipulation task, with a written evaluation of where it fails |
| Bioinformatics | https://developerdojo.org/library/tracks/bioinformatics/ | A reproducible pipeline from raw reads to a short report |
| Lab automation in code | https://developerdojo.org/library/tracks/lab-automation-in-code/ | A closed loop in simulation that designs, runs and analyses three rounds |
| Safety, reports and review (shared modules) | https://developerdojo.org/library/tracks/safety-reports-and-review/ | Used by every capstone above |

Group pages: the four tracks lead [/library/tracks/](https://developerdojo.org/library/tracks/) under "Core focuses",
and the home page has a "Core focuses" section with the same links.

Lesson URLs follow the usual form `/library/tracks/<track>/<NN>-<lesson-slug>/` (see
[content-model.md](content-model.md)). Link other sites to the **track** URL, not to a lesson: lessons may be split
or reordered as the tracks grow, tracks may not.

## Where the list lives in code

- `src/lib/core-focuses.ts` names the two focuses and their track slugs. The home page and `/library/tracks` read it.
- `tests/core-focuses.test.ts` fails if a listed slug has no track file, or if a track in a core group is missing
  from the list.
- `e2e/core-focus-tracks.spec.ts` checks that the home page and the track index link every track above, and that each
  track page lists its capstone lesson.

## If a track really must change

1. Keep the old URL working: leave the track file where it is and change its content, never its file name.
2. If a track is split, the old slug stays as the overview of the new tracks.
3. Tell the sites that link here: open a note on the issue that tracks the link (#125 lists them).
