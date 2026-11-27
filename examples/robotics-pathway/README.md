# Robotics pathway files

The worked example for the robotics pathway (/katas/robotics-pathway): from an open robot model to a checked pose and
joint solution, in simulation. Everything under `generated/` is computed by `tools/robotics_pathway.py`. The site's
CI reruns the script on every pipeline (job `robotics_pathway`) and fails if any file differs from the published
copy, so these results are not typed by hand.

This is simulation only. No real robot moved, and nothing here is a safety assessment of any robot, cell or
application.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/ur5-default-kinematics.yaml` | The UR5 kinematics file of the Universal Robots ROS 2 Description, byte for byte | BSD-3-Clause (see below and `inputs/ur-description-LICENSE.txt`) |
| `inputs/ur-description-LICENSE.txt` | That repository's licence, byte for byte, served with the file as the licence asks | BSD-3-Clause |
| `scenario/configurations.csv` | Five joint configurations of the arm, in radians. Written by the Dojo | MIT, Developer Dojo |
| `scenario/targets.csv` | Three target poses and the initial guesses the solver starts from. Written by the Dojo | MIT, Developer Dojo |
| `tools/robotics_pathway.py` | The script: reference checks, the model inspection, forward kinematics by three methods, inverse kinematics and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads the two input files at the pinned commit for a maintainer and prints their SHA-256. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | Every value printed in the code library's worked examples, the script's value for each, and the checks against the DH table | MIT, Developer Dojo |
| `generated/inspection.json` | What the description file holds: units, conventions, joint origins, how they map to the DH table, screw axes and home pose (ROB-001) | MIT, Developer Dojo |
| `generated/poses.json`, `generated/poses.csv` | The end-effector pose of each configuration, the agreement of the three methods and the Jacobian determinant (ROB-002) | MIT, Developer Dojo |
| `generated/ik.json` | The joint solution for each target and initial guess, its iterations and its error checked again by the joint chain (ROB-003) | MIT, Developer Dojo |
| `generated/randori/cards.json` | The four Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of every input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **The robot model.** Universal Robots ROS 2 Description, `config/ur5/default_kinematics.yaml` at commit
  `0eb1a861f7772fceb38510d90fa2f98ec668070c`,
  `https://github.com/UniversalRobots/Universal_Robots_ROS2_Description`, downloaded on 2026-11-27: 639 bytes,
  SHA-256 `4559bd027c93ce7c0e2a343d6f71f742fe4a67ea9d7ef67535189f4efbe9c3ac`. The repository's licence, `LICENSE`
  at the same commit (1,459 bytes, SHA-256 `143077f9f6a8de5a99f78c2c2472801fb53cf240277ef661642f079b9acdfff8`), is
  the BSD-3-Clause text and is served beside it. Serving the file does not imply endorsement by Universal Robots.
- **The manufacturer's table.** Universal Robots, "DH parameters for calculations of kinematics and dynamics",
  `https://www.universal-robots.com/articles/ur/application-installation/dh-parameters-for-calculations-of-kinematics-and-dynamics/`
  (read on 2026-11-27). Its UR5 table (a, d and alpha for six joints) is cited for its numbers; the page is not
  copied.
- **The methods and their worked examples.** The code library of the textbook "Modern Robotics: Mechanics,
  Planning, and Control" (Cambridge University Press, 2017), Python package file
  `packages/Python/modern_robotics/core.py` at commit `36f0f1b47118f026ac76f406e1881edaba9389f2`,
  `https://github.com/NxRLab/ModernRobotics`, MIT licence (read on 2026-11-27). Its docstrings print a worked
  example for each function; the script holds the printed numbers and names the function of each. The library is
  not served here and its code is not copied: the script is written independently in the standard library.
- **Units and conventions.** REP 103, "Standard Units of Measure and Coordinate Conventions" (status Active, created
  7 October 2010; `https://www.ros.org/reps/rep-0103.html`, read on 2026-11-27; placed in the public domain): metres
  and radians, right-handed frames, and roll, pitch and yaw about the fixed x, y and z axes.

## Method

- **Inspection.** The description file must be the two-level mapping the script expects (six joint origins, each
  with x, y, z, roll, pitch and yaw, and a calibration hash); anything else stops it. Each origin is a URDF joint
  origin: translate, then rotate R = Rz(yaw) Ry(pitch) Rx(roll); the joint then turns about its own z axis.
- **The DH table.** Six lengths of the file are the UR5 table's d1, a2, a3, d4, d5 and d6 (d5 with its sign
  reversed, because the file puts it on the y axis); the script requires each to be equal.
- **Forward kinematics, three ways.** The file's joint chain; the standard DH product, each joint
  Rz(theta) Tz(d) Tx(a) Rx(alpha); and the product of exponentials T = e^[S1]theta1 ... e^[S6]theta6 M, with each
  screw axis S = (w, -w x q) read from the chain at zero. All three must agree within 1e-9 at every configuration.
  The pose is that of `wrist_3_link` in `base_link_inertia`, which is DH frame 6 in DH frame 0.
- **Inverse kinematics.** Newton-Raphson in the space frame, as the library's `IKinSpace`: theta becomes
  theta + pinv(Js(theta)) Vs, at most 20 steps, until the orientation error is under 0.001 rad and the position
  error under 0.1 mm. Every solution is then checked again with the joint chain, a different method from the one
  that found it. A target the solver cannot reach is reported as no solution, never as the last guess.
- **Reference checks.** Every value printed in the library's worked examples for MatrixExp3, MatrixLog3,
  MatrixExp6, MatrixLog6, TransInv, Adjoint, FKinBody, FKinSpace, JacobianBody, JacobianSpace, IKinBody and IKinSpace
  must round to the printed value, or the script writes nothing.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/robotics_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one. It
first reproduces the published values and exits with an error, writing nothing, if any differs. `diff` prints
nothing when your results match the published ones. Another Python version changes only the `python` field in
`manifest.json`.

## Limits

- Simulation only. No real robot moved. Nothing here is a risk assessment, a safety function or a check against a
  robot safety standard (ISO 10218-1 and ISO 10218-2 are named only: iso.org refused access, so neither their text
  nor their current edition was read, and nothing is checked against them), and no robot cell
  should be planned from it. No robotics safety engineer, controls engineer or integrator has reviewed it.
- Kinematics only: no joint limits, collisions, self-collisions, velocities, dynamics, payload or tool. The pose is
  of the last link, not of any tool point. The URDF's base turn and the flange and `tool0` frames are not in the
  file and are not used.
- The file is the nominal model. A real arm is calibrated, and its own calibration differs from these numbers.
- The inverse kinematics finds one solution near its initial guess. It does not list all eight analytical
  solutions of the UR5, and a different guess can give a different solution or none.
- No learner has run these katas yet.
