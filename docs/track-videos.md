# Track walk-through videos

A track walk-through is a short screen recording, about two to three minutes, that shows a new learner
around one track: who it is for, what they can do afterwards and which lesson to open first. This page is the
repeatable recipe. The first track is **Product discovery** (#53). Every other track copies it.

## Rules that never change

- **Real people only, with their consent.** Only the person recording speaks or appears. If their name is
  shown, they agreed in writing first. Never use learner footage, learner names or learner work.
- **No invented claims.** The script says only what the track page already says. No numbers, no promises,
  no testimonials.
- **No embeds, no trackers.** The site links to the video as a normal outside link. It does not embed a
  player (README, *Content rules*).
- **Captions and a full transcript.** The video carries captions. The track page carries the full
  transcript, so the video is never the only way to get the content.
- **Show the public site only.** Record https://developerdojo.org in a clean browser profile, with no
  bookmarks bar, no other tabs and no notifications. Never show GitLab, a terminal or any internal screen.

## Steps for one track

1. **Write the script** in `docs/track-videos/<track-id>.md`, at about 300 words. Use the three parts in the
   pilot script: who it is for, what you can do afterwards, the first lesson to open. Copy facts from the
   track page; do not add new ones. Read it aloud once and cut anything that sounds like an advert.
2. **Get a review.** Open an MR with the script. A second person checks it against the track page.
3. **Record.** A real person records the screen and their voice while reading the script, at a normal pace.
   Use the plan at the bottom of the script for what to show on screen.
4. **Caption.** Upload to the CRC video channel. Fix the auto captions by hand until they match the script
   word for word.
5. **Publish the link and transcript.** In the track's markdown file (`src/content/tracks/<track-id>.md`),
   add a section `## Watch the walk-through`. It holds one plain link to the video (no embed) and the full
   transcript under it. Open the link the day you add it.
6. **Check it live.** After the merge, open the track page on developerdojo.org, follow the link and play
   the video with captions on.

## Before the first video

There is no CRC video channel yet. Opening one is a public branding decision for CRC, so it waits for that
decision on #53. The scripts can be written and reviewed now.

## Scripts

- [Product discovery](track-videos/product-discovery.md) (pilot)
