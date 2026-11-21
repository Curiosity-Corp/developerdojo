import type { JourneyInput } from '../lib/journeys';

/**
 * Optional journeys from Ignite Curiosity's core-focus programs to Developer Dojo practice (#83).
 * Ignite Curiosity owns its programs and pages; each journey keeps only the page URL and the day it was read.
 * Every Dojo reference is a stable identifier checked at build time (src/lib/journeys.ts).
 * The Ignite text paraphrases each step of the program page named in ignite.url, as read on ignite.checkedOn.
 * Re-read the page and update checkedOn whenever you change a journey. The guide is docs/journeys.md.
 */
export const igniteJourneys: readonly JourneyInput[] = [
  {
    id: 'robotics',
    title: 'From a robotics club to robot software',
    summary: 'Ignite Curiosity\'s robotics club path has you build a robot, program it and take it into a challenge. This journey shows the Dojo practice that fits each of its steps. Everything here runs in simulation, and you start wherever you like.',
    fieldIds: ['robotics'],
    ignite: {
      program: 'Robotics club path',
      url: 'https://ignitecuriosity.org/spark/robotics.html',
      status: 'Ignite Curiosity describes the robotics club path as an offering it is preparing.',
      checkedOn: '2026-11-21',
      linksToTracks: ['robot-software', 'robot-learning'],
    },
    steps: [
      {
        spark: 'seek',
        ignite: 'Pick one job a robot could do beside people, and write down what it must do and what it must never do.',
        dojo: 'Turn that job into a one-page brief with an AI assistant, then check every line of it yourself.',
        refs: [{ kind: 'kata-route', route: '/katas/spark-ideas' }],
      },
      {
        spark: 'play',
        ignite: 'Build a simple robot, or one in a simulator, and try its motors, wheels and sensors one at a time.',
        dojo: 'Plan a simulated robot scene and the checks you will run on it, then set up the tools the robot software track uses.',
        refs: [
          { kind: 'kata-route', route: '/katas/industry-workshops', anchor: 'robotics' },
          { kind: 'track', slug: 'robot-software' },
        ],
      },
      {
        spark: 'apply',
        ignite: 'Write the code that lets the robot sense and react, until it finishes its task three times in a row and stops whenever something blocks its path.',
        dojo: 'Program a simulated robot with ROS 2 and Gazebo, with tests. The track ends in a capstone: a simulated robot that maps a room and fetches an object.',
        refs: [{ kind: 'track', slug: 'robot-software' }],
      },
      {
        spark: 'research',
        ignite: 'Take the robot into a challenge, find where it failed and why, and write a short report on what worked, what failed and what you changed.',
        dojo: 'Write a technical report that states its limits, and check a report\'s claims against the evidence. To go further, teach a robot one task with a learned policy and write down where it fails.',
        refs: [
          { kind: 'track', slug: 'safety-reports-and-review' },
          { kind: 'kata-route', route: '/katas/error-clinic' },
          { kind: 'track', slug: 'robot-learning' },
        ],
      },
      {
        spark: 'know',
        ignite: 'Show a newer club member how your robot works and help them get theirs moving.',
        dojo: 'Plan a short peer learning session, ask for feedback and record what happened.',
        refs: [{ kind: 'kata-route', route: '/katas/lead-a-learning-session' }],
      },
    ],
    foundations: [{ kind: 'kata', id: 'PRACTICE-001' }, { kind: 'kata', id: 'PRACTICE-002' }],
  },
  {
    id: 'biotechnology',
    title: 'From a biodesign challenge to biological data',
    summary: 'Ignite Curiosity\'s biodesign challenge path has you pose a problem, design an answer and present it. This journey shows the Dojo practice that fits each of its steps. Everything here uses public data or a simulator, and you start wherever you like.',
    fieldIds: ['biotechnology', 'health'],
    ignite: {
      program: 'Biodesign challenge path',
      url: 'https://ignitecuriosity.org/spark/biotechnology.html',
      status: 'Ignite Curiosity describes the biodesign challenge path as an offering it is preparing.',
      checkedOn: '2026-11-21',
      linksToTracks: ['bioinformatics', 'lab-automation-in-code'],
    },
    steps: [
      {
        spark: 'seek',
        ignite: 'Find a real problem near you that biology might help with, and write a one-paragraph statement of who it hurts.',
        dojo: 'Shape the problem into a one-page brief with an AI assistant, then check every line of it yourself.',
        refs: [{ kind: 'kata-route', route: '/katas/spark-ideas' }],
      },
      {
        spark: 'play',
        ignite: 'Find three examples of living things that deal with a problem like yours, each with the source you found it in.',
        dojo: 'Practise tracing a claim back to its evidence, so every example you collect names a source you have checked.',
        refs: [{ kind: 'kata-route', route: '/katas/research-and-compare' }],
      },
      {
        spark: 'apply',
        ignite: 'Sketch your design and how it would work, or explore public biological data on a computer, and have a mentor review the design sheet.',
        dojo: 'Read and analyse biological data with code, ending in a reproducible pipeline from raw reads to a short report. New to data? Clean a messy dataset first.',
        refs: [
          { kind: 'track', slug: 'bioinformatics' },
          { kind: 'kata', id: 'PRACTICE-007' },
        ],
      },
      {
        spark: 'research',
        ignite: 'Ask what could go wrong for people, for other living things and for the place it would be used, and change the design until each risk has an answer.',
        dojo: 'Start lab automation in code with its biosafety lesson, then plan experiments in a simulator. Write a report that states its limits and goes through human review.',
        refs: [
          { kind: 'track', slug: 'lab-automation-in-code' },
          { kind: 'track', slug: 'safety-reports-and-review' },
        ],
      },
      {
        spark: 'know',
        ignite: 'Present your design, answer the questions it raises, and help a newer challenger pose their first problem.',
        dojo: 'Plan a short peer learning session, ask for feedback and record what happened.',
        refs: [{ kind: 'kata-route', route: '/katas/lead-a-learning-session' }],
      },
    ],
    foundations: [{ kind: 'kata', id: 'PRACTICE-001' }, { kind: 'kata', id: 'PRACTICE-002' }],
  },
];
