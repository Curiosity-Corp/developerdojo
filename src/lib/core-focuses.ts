import { z } from 'zod';

/**
 * The Dojo's core focuses (CEO order 2026-11-19, issue #125): robotics and biotechnology.
 * One source for the home page and /library/tracks. Each focus names its tracks by slug; the slugs are
 * stable public URLs (/library/tracks/<slug>) that other sites link to, so never rename one
 * (docs/track-urls.md). tests/core-focuses.test.ts checks that every slug has a track file.
 */
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const focusSchema = z.strictObject({
  id: z.enum(['robotics', 'biotechnology']),
  title: z.string().trim().min(1),
  /** One plain sentence: what a learner can do in this focus. */
  summary: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  tracks: z
    .array(
      z.strictObject({
        slug,
        title: z.string().trim().min(1),
        /** The capstone, said as what the learner builds. */
        capstone: z.string().trim().min(1),
      }),
    )
    .min(1),
});

export type CoreFocus = z.infer<typeof focusSchema>;

export const coreFocuses: readonly CoreFocus[] = z.array(focusSchema).length(2).parse([
  {
    id: 'robotics',
    title: 'Robotics',
    summary: 'Program robots in simulation with ROS 2 and Gazebo, then teach them skills with learned policies.',
    icon: 'bot',
    tracks: [
      {
        slug: 'robot-software',
        title: 'Robot software',
        capstone: 'A simulated mobile robot that maps a room and fetches an object, with a test suite.',
      },
      {
        slug: 'robot-learning',
        title: 'Robot learning',
        capstone: 'A learned policy for one manipulation task, with a written evaluation of where it fails.',
      },
    ],
  },
  {
    id: 'biotechnology',
    title: 'Biotechnology',
    summary: 'Turn raw biological data into results you can defend, and write code that plans and runs lab experiments.',
    icon: 'dna',
    tracks: [
      {
        slug: 'bioinformatics',
        title: 'Bioinformatics',
        capstone: 'A reproducible pipeline that goes from raw sequencing reads to a short report.',
      },
      {
        slug: 'lab-automation-in-code',
        title: 'Lab automation in code',
        capstone: 'A closed loop in simulation that designs, runs and analyses three rounds of an experiment.',
      },
    ],
  },
]);

/** The modules every core-focus track shares: trusting models, writing reports, working with human review. */
export const sharedFocusTrack = { slug: 'safety-reports-and-review', title: 'Safety, reports and review' } as const;

/** Every core-focus track slug, shared modules included, in display order. */
export const coreFocusTrackSlugs: readonly string[] = [
  ...coreFocuses.flatMap((focus) => focus.tracks.map((track) => track.slug)),
  sharedFocusTrack.slug,
];
