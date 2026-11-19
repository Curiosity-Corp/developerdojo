---
title: "Capstone: map a room and fetch an object"
description: "Put the track together: a simulated café robot maps a room, finds an orange cup with its camera, runs a fetch action and brings the cup to the counter, with tests, a recording, a report and a review."
section: "Robot software"
order: 7
track: "robot-software"
level: "advanced"
duration: "1 day"
outcomes:
  - "Build and run a complete simulated robot mission from a repository that a stranger can clone"
  - "Show evidence for every acceptance criterion: test results, a mission report, pictures and a recording"
  - "Write a short report that states results with units and says what the simulation does not prove"
  - "Direct an AI agent with written briefs, verify its output, and disclose its use"
  - "Review another learner's robot project with a rubric and give feedback they can act on"
resources:
  - "nav2/simple-commander-api"
  - "nav2/navigation-concepts"
  - "gazebo/sdf-worlds"
  - "ros/writing-an-action-server-and-client-python"
  - "ros/writing-basic-integration-tests-with-launch-testing"
  - "ros/recording-and-playing-back-data"
  - "moveit/pick-and-place-with-moveit-task-constructor"
prerequisites:
  - "tracks/robot-software/04-mapping-and-navigation-with-nav2"
  - "tracks/robot-software/06-test-and-log-robot-software"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot software track, the Master Developer Product Package, and the [capstone rubric](/library/rubric-capstone). **Time:** about one day, plus review time.

## 1. Why this matters

The earlier lessons each taught one part. A robot is the parts working together, and most faults live in the joins: a goal in the wrong frame, a topic with the wrong name, a test that misses the join.

It is also where you practise the PDM's real job. You write the mission and the acceptance criteria. Agents write much of the code. You collect evidence, say what it does not show, and another person checks your claim.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The mission, the acceptance criteria, what evidence is enough, and which limits you state | The mission script, tests, helper scripts and the first draft of the report | Every criterion against the evidence, a clean run from a fresh clone, and every claim in the report | Safety and review (a second person signs off), mechanical engineers (the real arm and gripper), operations (who runs it again), legal (licences) |

## 2. Key ideas

### What you build

You build a mission for the fictional **CupRunner** robot in a simulated café. TrailMug is fictional. There is no real robot, café or customer, and every number in the example is invented.

The mission has four steps, in order:

1. **Drive to the cup.** From the start pose, go to a point 0.6 metres in front of the return shelf, facing it.
2. **See the cup.** The camera must find the orange cup and report its distance, which must be between 0.3 and 1.5 metres.
3. **Fetch the cup.** Call the `fetch_cup` action with the cup's id. It must succeed.
4. **Drive to the counter.** Go to the drop point in front of the counter.

The mission writes a JSON report with the result and time of each step.

### What is simulated and what is not

Be exact about this, in the repository and in your report. The simulated robot is a wheeled base with a range scanner and a camera. It has **no arm**. The fetch step is therefore a **simulated grasp**: the action server reports its stages, but nothing is lifted. What the capstone proves is mapping, navigation, perception, the action contract, testing and reporting. It does **not** prove grasping.

Lesson 5 gave you the arm side separately: a model arm, planning only. You may cite it as supporting evidence, but it is not part of this mission. A full pick and place, described in the MoveIt Task Constructor documentation, needs a robot model with an arm, a gripper and a controller, and is beyond this track.

### Free software and the machine

Everything runs on free open-source software, in the container from lesson 1, headless, with no GPU. In a checked run on one machine, the mission took about 39 seconds after Nav2 had started. Building the container and the first mapping run take longer. A GPU helps with a live Gazebo window, a bigger world or a faster camera. Without one, use the headless run and the camera frames described below. If your laptop cannot cope, a free hosted Linux environment with containers can work. Check its disk space and memory first.

## 3. Step by step

### The repository layout

Use the repository from lessons 1 to 6. At the end it looks like this:

```text
robot-software-practice/
  Dockerfile
  README.md              how to build, run and test, in exact commands
  REPORT.md              the written report
  .gitignore             build/ install/ log/ *.mcap *.db3
  .gitlab-ci.yml         the pipeline sketch from lesson 6
  maps/                  cafe.yaml and cafe.pgm, built by you
  scripts/               run_mission.sh, save_frames.py, frames_to_gif.py
  docs/                  contract.md, sim-limits.md, test-evidence.md
  docs/briefs/           every brief you gave an agent, and a review note for each
  evidence/              mission_report.json, a GIF or recording, bag summary
  src/cuprunner_interfaces/   FetchCup.action
  src/cuprunner_sim/          worlds/, urdf/, config/
  src/cuprunner_tasks/        nodes, vision, frames, launch, test/
```

### The mission constants

Write these in the mission script and in the report. They are in the **map** frame, in metres and radians, for a robot that started at world (-3.0, -2.0).

```python
START = (0.0, 0.0, 0.0)             # where the robot was when the map was built
CUP_STANDOFF = (4.9, 3.5, 0.0)      # 0.6 m in front of the return shelf, facing it
COUNTER_DROP = (3.0, 3.8, 1.5708)   # in front of the counter, facing it (pi / 2)
SEE_CUP_RANGE_M = (0.3, 1.5)        # the camera must see the cup this far away
```

Because map = world + (3, 2), the cup at world (2.5, 1.5) is at (5.5, 3.5) on the map. Check this arithmetic yourself.

### The report format

`fetch_mission` writes a file with this shape. Every step has a name, a result and the time since the mission started. The see step also records the distance.

```json
{
  "steps": [
    {"step": "drive to the cup", "ok": true, "seconds": 24.5},
    {"step": "see the cup", "ok": true, "seconds": 24.5, "distance_m": 0.43},
    {"step": "fetch the cup (simulated grasp)", "ok": true, "seconds": 26.6},
    {"step": "drive to the counter", "ok": true, "seconds": 37.1}
  ],
  "success": true
}
```

These numbers are from one checked run, as an example. Yours will differ. The script must exit 0 only if every step is `ok`.

### How to run it

A small script starts the simulation, the bridge, the cup finder, the fetch server and the camera frame saver, then runs the mission. It waits a fixed time after the launch because Nav2 needs the initial pose soon after it starts.

```bash
#!/usr/bin/env bash
set -uo pipefail
export ROS_DOMAIN_ID="${ROS_DOMAIN_ID:-61}" GZ_PARTITION="${GZ_PARTITION:-capstone}"
source /opt/ros/lyrical/setup.bash
source install/setup.bash
SIM="$PWD/src/cuprunner_sim"
mkdir -p log evidence/frames
trap 'kill $(jobs -p) 2>/dev/null' EXIT

ros2 launch nav2_bringup tb3_simulation_launch.py headless:=True use_rviz:=False \
  map:="$PWD/maps/cafe.yaml" world:="$SIM/worlds/cafe.sdf" \
  robot_sdf:="$SIM/urdf/cuprunner.sdf.xacro" x_pose:=-3.0 y_pose:=-2.0 > log/sim.log 2>&1 &
sleep 12
ros2 run ros_gz_bridge parameter_bridge --ros-args \
  -p config_file:="$SIM/config/camera_bridge.yaml" > log/bridge.log 2>&1 &
ros2 run cuprunner_tasks cup_finder > log/finder.log 2>&1 &
ros2 run cuprunner_tasks fetch_server > log/fetch_server.log 2>&1 &
python3 scripts/save_frames.py evidence/frames 2.0 > log/frames.log 2>&1 &
sleep 5
ros2 run cuprunner_tasks fetch_mission
```

`save_frames.py` is a small node that saves the camera picture to a PNG file every two seconds. `frames_to_gif.py` joins the PNGs into one GIF with the Pillow library (`python3-pil` in Ubuntu). Both are short enough to write with an agent in a few minutes. Brief the agent from the lesson 3 pattern.

### What to build, in order

1. Build the container, build the workspace and run `colcon test`. All green before you start the mission.
2. Make sure `maps/cafe.yaml` and `maps/cafe.pgm` are your own, from lesson 4.
3. Write `fetch_mission.py` with a `BasicNavigator`, the four steps and the report. Write the `see` step so that it waits on the `cup/point` topic, with a deadline, and returns the `z` distance.
4. Write `scripts/run_mission.sh`. Run it. Read the report.
5. Write the extra tests listed in the criteria.
6. Collect the evidence, write the report and the limits, and ask for a review.

## 4. Worked example: TrailMug

TrailMug is fictional. The numbers here are invented.

The founder writes the mission and the criteria before she asks an agent for code. She asks it to write `fetch_mission.py` from the four steps and the constants. The first version drives, then calls the fetch action, and reports success. It never checks that the camera saw the cup. She reads her criterion 6: "the see step records a distance". The script has no see step. She sends it back with the step named, the topic and the range.

The second version passes on the first run. She wants to know why a run might fail, so she moves the robot start to a wrong place on purpose. The mission reports `drive to the cup: FAILED` and exits 1, and the later steps do not run. That log goes into the evidence folder as the failure case.

She writes the report. It states the four results with their times, shows the GIF of the camera, and says: "The grasp is simulated. The map is from a perfect simulated scanner in an empty room. A real café with glass, people and clutter is not tested." She asks a classmate to review it.

## 5. Working with AI agents on this

**What the PDM decides.** The mission, every acceptance criterion, what evidence is enough, what limits to state, and whether to accept the reviewer's findings.

**What you delegate, and the exact brief.** The mission script, helper scripts and the draft of the report. Keep each brief in `docs/briefs/` with your review note. Adapt this one:

```text
Write fetch_mission.py for ROS 2 Lyrical, Python, using nav2_simple_commander.
Four steps in order, each with a name, ok flag and seconds since start:
1. drive to CUP_STANDOFF (map frame) with goToPose, check SUCCEEDED;
2. see the cup: wait up to 10 s for a PointStamped on cup/point, ok only if
   its z is between 0.3 and 1.5 metres, record distance_m;
3. fetch: send a FetchCup goal for "cup_001" to the fetch_cup action, ok only
   if the result success is true; say in the step name that the grasp is simulated;
4. drive to COUNTER_DROP.
Stop at the first failed step. Write mission_report.json with all steps and a
success flag. Exit 0 only if every step is ok.
Rules: type hints, clean shutdown in finally, no hard-coded sleeps for
synchronisation, constants at the top. After the code, list anything you were unsure of.
```

**How you verify.** Go criterion by criterion. Run the mission from a clean clone, in a fresh container, using only the README. Read the report JSON and compare each result with what you saw. Break something on purpose and check the mission fails the right step. Read every line that sets a frame, a unit or a timeout. Do not accept a report that an agent wrote: check each number against the file it came from.

**Which disciplines are involved.** Safety and review: a second person must be able to say what you did not show, which is why the report has a limits section. Mechanical engineers would own the real arm, gripper and robot. Operations asks who reruns this. Legal asks which licences apply if the work ships. Security asks what is in the image and the logs. See [Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report) and [Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review) for the report and the review habits.

**Where this sits on the ladder.** You **delegate** whole pieces with a written brief and acceptance criteria, and you review the results. Running several agents at once, each with its own brief, is **orchestrating**. The pipeline, the review and the rule that nothing merges without evidence are **governing**.

**Disclose.** Add an AI-use section to the README and the report: which files an agent drafted, what you wrote yourself, and what you checked. See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Claiming a grasp.** The fetch is simulated. Say so in the step name, the README and the report.
- **A report with no units.** Every number needs metres, seconds or radians.
- **No failure case.** One passing run is not evidence of anything. Show a run that fails.
- **Success printed before the result is read.** The script must check each step.
- **A stale map.** If you change the world, remap and commit the new files.
- **A recording that shows nothing.** A headless run has no window. Use the camera frames, or a screen recording from a machine with a display.
- **An unreviewed report.** An agent's report is a draft until you check each figure.

## 7. Practice: the capstone deliverable

**Deliverable:** a git repository that meets the acceptance criteria below.

### Acceptance criteria

A reviewer can check each of these. Number them in your `README.md` and point to the evidence for each.

1. **Rebuilds from a clean clone.** `docker build`, `colcon build` and `colcon test` run from the README commands alone, with no manual step.
2. **Tests pass.** `colcon test-result --verbose` shows no failures, and at least ten tests. At least one is a `launch_pytest` test of a real node.
3. **Tests can fail.** `docs/test-evidence.md` shows at least two tests failing against deliberately broken code, then passing.
4. **The map is yours.** `maps/cafe.yaml` and `maps/cafe.pgm` exist, and the picture shows the four walls and the furniture outline.
5. **The world matches the table.** `cafe.sdf` has every object from the lesson 3 table, and `gz sdf -k` shows no unresolved warnings.
6. **The mission succeeds.** `scripts/run_mission.sh` exits 0 and writes a report in which all four steps are `ok`.
7. **The camera saw the cup.** The report has `distance_m` between 0.3 and 1.5 for the see step.
8. **The action honours its contract.** Evidence shows an empty `cup_id` rejected and a goal cancelled midway, with the printed result.
9. **A failure is shown.** `evidence/` holds the log of a run that fails on purpose and exits 1.
10. **A picture of the run.** `evidence/` has a GIF made from camera frames, or a short screen recording from a machine with a display. State which.
11. **The report is honest.** `REPORT.md` is one to two pages, gives every result with units, names the commands to reproduce it, and has a limits section that says the grasp is simulated and lists at least four other things the simulation does not show.
12. **AI use is disclosed and checked.** The README names the files an agent drafted, `docs/briefs/` has each brief and a review note, and each note says what you checked.
13. **The repository is clean.** No `build/`, `install/`, `log/` or bag files are tracked, and the repository is under 20 MB.

### The review rubric

A reviewer scores each row. "Not yet" means the learner revises. "Meets" is a pass. "Strong" is optional.

| Row | Not yet | Meets | Strong |
|---|---|---|---|
| Reproducible | The reviewer cannot run it from the README | Runs from a clean clone with the README commands | Also runs in the pipeline sketch, with notes on what it skips |
| Evidence | Claims with no file to back them | Each criterion points to a file or output | The evidence includes a failure and its explanation |
| Tests | Tests only check constants, or none can fail | Tests cover the behaviours and were seen to fail | Tests cover each layer of the pyramid with a stated reason |
| Contracts and frames | Units or frames are unclear | Every goal says its frame, every number its unit | A tested conversion and a written contract |
| Honest limits | Claims a grasp or a real-world result | States the grasp is simulated and names the limits | Limits are specific and tied to what a real test would need |
| Agent use | No briefs, or output accepted unread | Briefs saved, each reviewed, disclosure present | Briefs state failure checks, and the review notes show real faults found |
| Report | Hard to follow or has no numbers | Clear, with numbers and units, in two pages | A reader could decide from it alone |

### How a Sensei or peer reviews it

The review follows the [Sensei review sheet](/library/sensei-review-sheet) and the habits in [How Sensei work](/library/program-how-sensei-work). A peer can use the same steps.

1. **Read first, run second.** Read the README and the report. Note any claim that has no evidence.
2. **Run it from scratch.** Clone the repository into a clean folder, follow the README exactly, and note every point where you had to guess.
3. **Tick the criteria.** Go through the thirteen. For each, write "met", "not met" or "cannot tell", and the evidence.
4. **Probe.** Ask for one change, such as moving the cup or changing a threshold, and see whether the tests and the report still hold.
5. **Score the rubric** and write three comments: one thing done well, one thing that must change, one question.
6. **Say what you did not check.** A review that lists its limits is worth more than a clean tick.

A reviewer who is not sure whether a result is real asks the learner to show a run, rather than assuming. A review does not replace a safety review for real hardware.

## 8. Checklist

- [ ] The repository builds, tests and runs from the README, in a fresh container.
- [ ] The mission exits 0, and I kept the report and a failing run.
- [ ] The see step shows a distance between 0.3 and 1.5 metres.
- [ ] The fetch step is labelled a simulated grasp everywhere.
- [ ] My tests include at least one that I saw fail on purpose.
- [ ] The report gives numbers with units, and has a limits section.
- [ ] Every agent brief and its review note is in `docs/briefs/`.
- [ ] No large files, bags or build output are in git.
- [ ] A second person reviewed it with the rubric.
- [ ] My AI-use line is in the README and the report.

## 9. Further learning

The Nav2 simple commander page lists the calls the mission uses, and the navigation concepts page explains the planner and controller. The Gazebo SDF worlds page covers the world file. The ROS 2 tutorials on action servers and on launch testing are the base for the fetch action and the launch test, and the data recording tutorial shows how to keep a bag. For the arm side, the MoveIt Task Constructor pick-and-place tutorial is the next step. The [capstone rubric](/library/rubric-capstone) shows how capstones are judged across the Dojo. When you are ready for learned behaviour, read [Robot learning](/library/tracks/robot-learning), and keep the review habits from this lesson.
