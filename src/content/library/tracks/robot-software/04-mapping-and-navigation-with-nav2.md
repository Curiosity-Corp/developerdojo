---
title: "Mapping and navigation with Nav2"
description: "Let a simulated robot map a room with SLAM, save the map, and drive to goals with Nav2 from a short Python script. Learn the frames, the timing traps and the limits of 2D navigation."
section: "Robot software"
order: 4
track: "robot-software"
level: "core"
duration: "4 hours"
outcomes:
  - "Explain SLAM, a saved map, localisation and the map, odom and base_link frames in plain words"
  - "Build a map of the simulated café and save it as a pair of files"
  - "Send a Nav2 goal from Python and read its feedback and result"
  - "Convert between world coordinates and map coordinates without losing a sign"
  - "Say what 2D navigation in simulation does not prove about a real robot"
resources:
  - "nav2/getting-started"
  - "nav2/navigation-concepts"
  - "nav2/navigating-while-mapping-slam"
  - "nav2/mapping-and-localization"
  - "nav2/simple-commander-api"
  - "slam-toolbox/slam-toolbox"
  - "ros/rep-105-coordinate-frames-for-mobile-platforms"
  - "ros/introducing-tf2"
prerequisites:
  - "tracks/robot-software/03-simulate-a-robot-in-gazebo"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot software track, and the Developer program's habit of turning a goal into measurable steps. **Time:** about four hours. The first mapping run takes several minutes on a CPU.

## 1. Why this matters

"Go to the shelf" is one sentence for a person. For a robot it is four problems: know where I am, know what is around me, plan a path, and follow it without hitting anything. **Nav2** is the ROS 2 software that plans routes and drives a mobile robot. It solves the last three, and it needs a map and a position to start.

Most navigation failures are not in the planner. They are in the assumptions around it: a map that is a little off, a start pose that is wrong, a goal given in the wrong frame, a clock that is out of step. A robot with a wrong idea of where it is will drive confidently into a wall.

For a Product Development Manager (PDM), this lesson gives you words to ask the right questions. Which frame is this goal in? When was the map made? What did the robot believe about its start?

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which places the robot must reach, how close is close enough, and what it must never do | Writing the goal scripts, the launch commands and the conversion helpers | The goals are in the right frame, the result is checked and not assumed, and a failed goal is reported | Safety (people and speed limits), mechanical engineers (real robot size and turning), operations (who remaps when the room changes) |

## 2. Key ideas

### SLAM

**SLAM** means building a map and finding your place on it at the same time. The robot drives around, its range scanner sees walls, and the software stitches the scans into a map while it works out where the robot is. This track uses `slam_toolbox` for that. It makes a 2D map. It cannot see anything above or below the scanner's plane, such as a table top that overhangs.

### The map files

A saved 2D map is two files. A picture, `cafe.pgm`, shows free space, walls and unknown space as shades of grey. A small text file, `cafe.yaml`, says where the picture sits in the world: its resolution in metres per pixel, its origin, and the thresholds that turn grey into free or occupied. The map saver writes both.

### Localisation

Once you have a map, the robot does not need to build one again. It needs to find where it is on it. Nav2 uses **AMCL** for this. AMCL keeps many guesses of the robot's pose and scores each against the scanner's view of the saved map. It needs a good first guess, called the **initial pose**. If that guess is far wrong, the robot may never recover.

### Frames: map, odom and base_link

A **coordinate frame** is a named origin and set of axes used to say where things are. ROS 2 robots use a standard set of frames, from REP 105:

- `base_link` is attached to the robot body.
- `odom` is a frame that follows the wheels' own count. It is smooth, but it drifts over time.
- `map` is the fixed frame of the map. It does not drift, but the robot's pose in it can jump when the localiser corrects itself.

Goals are given in `map`. The software keeps the link between `map`, `odom` and `base_link` up to date. The library behind this is called **tf2**. If a frame is missing or a timestamp is old, tf2 refuses to combine them, and your goal fails with a message about a transform.

### How Nav2 drives

Nav2 splits the job into servers that run as nodes. A **planner** draws a route on a **costmap**, which is a grid that marks where the robot may and may not go. A **controller** turns the route into speed commands. A **behaviour tree** decides what to do when something goes wrong, such as trying a recovery spin. You rarely touch these at the start. You send a goal through an action, as in lesson 2, and read the result.

In ROS 2 Lyrical, Nav2 publishes its speed commands as a stamped twist, `geometry_msgs/msg/TwistStamped`, on `cmd_vel`. Many older tutorials show plain `Twist`. If you write a node that listens to `cmd_vel`, match the type in the version you run.

### The simple commander

Nav2 includes a Python helper, `nav2_simple_commander`, with a class `BasicNavigator`. It wraps the actions: `setInitialPose`, `waitUntilNav2Active`, `goToPose`, `followWaypoints`, `isTaskComplete`, `getFeedback` and `getResult`. That is all this lesson uses.

### Licences

The packages you use are open source, under different licences. The Nav2 bringup package and the simple commander are Apache-2.0. `slam_toolbox` is LGPL. The Nav2 AMCL package is LGPL-2.1-or-later. You may use all of them to learn and to build. If you ship a product that includes them, the licences ask different things of you, so ask a legal adviser first. We read these from the installed packages' metadata. At the time of writing, the Lyrical packages were Nav2 1.5.2 and `slam_toolbox` 2.10.0.

## 3. Step by step

You need the café world from lesson 3. The robot starts at world position (-3.0, -2.0), in the south-west corner.

### Step 1: Start the simulation with SLAM

```bash
ros2 launch nav2_bringup tb3_simulation_launch.py headless:=True use_rviz:=False slam:=True \
  world:=$PWD/src/cuprunner_sim/worlds/cafe.sdf x_pose:=-3.0 y_pose:=-2.0
```

This starts Gazebo, the robot, Nav2 and `slam_toolbox`. Wait about 25 seconds before the next step. The launch file starts everything in order and some parts need time.

### Step 2: Drive a tour

An empty map is useless, so the robot must see the room. Send it around on a tour of waypoints. Write `src/cuprunner_tasks/cuprunner_tasks/map_tour.py`:

```python
"""Drive a fixed tour around the café while slam_toolbox builds the map."""

import sys

import rclpy
from geometry_msgs.msg import PoseStamped
from nav2_simple_commander.robot_navigator import BasicNavigator, TaskResult

# The robot starts at world (-3.0, -2.0). slam_toolbox puts the map origin at the start pose,
# so a world point (x, y) is the map point (x + 3.0, y + 2.0).
START_WORLD = (-3.0, -2.0)
TOUR_WORLD = [
    (-1.0, -2.3), (2.0, -2.3), (3.3, -2.3), (3.3, 0.0), (3.3, 1.8),
    (1.8, 0.6), (0.0, 0.5), (-0.5, -0.3), (-3.0, 0.0), (-3.0, 2.0), (-3.0, -2.0),
]


def pose_in_map(navigator: BasicNavigator, world_x: float, world_y: float) -> PoseStamped:
    pose = PoseStamped()
    pose.header.frame_id = 'map'
    pose.header.stamp = navigator.get_clock().now().to_msg()
    pose.pose.position.x = world_x - START_WORLD[0]
    pose.pose.position.y = world_y - START_WORLD[1]
    pose.pose.orientation.w = 1.0
    return pose


def main() -> int:
    rclpy.init()
    navigator = BasicNavigator()
    try:
        navigator.waitUntilNav2Active(localizer='slam_toolbox')
        waypoints = [pose_in_map(navigator, x, y) for x, y in TOUR_WORLD]
        navigator.followWaypoints(waypoints)
        last_printed = 0
        while not navigator.isTaskComplete():
            feedback = navigator.getFeedback()
            if feedback is not None and feedback.current_waypoint + 1 != last_printed:
                last_printed = feedback.current_waypoint + 1
                print(f'waypoint {last_printed} of {len(waypoints)}', flush=True)
        result = navigator.getResult()
        print(f'tour result: {result.name}', flush=True)
        return 0 if result == TaskResult.SUCCEEDED else 1
    finally:
        navigator.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    sys.exit(main())
```

Two lines need care. `waitUntilNav2Active(localizer='slam_toolbox')` tells the helper that SLAM, not AMCL, provides the position. And the pose conversion: `slam_toolbox` places the map origin at the robot's start pose, so **map = world + (3, 2)** for this start. If you forget that, every waypoint is off by the start offset. Add the file to `console_scripts` in `setup.py`, build and run it in a second terminal. It should print `waypoint 1 of 11` up to `waypoint 11 of 11`, then `tour result: SUCCEEDED`.

### Step 3: Save the map

```bash
mkdir -p maps
ros2 run nav2_map_server map_saver_cli -f maps/cafe
```

You should see `Map saved successfully`. Check that `maps/cafe.pgm` and `maps/cafe.yaml` exist, and open the picture in any image viewer. The checked map was 162 by 122 cells at 0.05 metres each, about 8.1 by 6.1 metres. A line of `LifecycleNode is not shut down` after the save is a warning from the tool, not an error. Stop the simulation with Ctrl+C.

### Step 4: Navigate on the saved map

Restart the simulation with the saved map instead of SLAM. Use the robot with the camera from lesson 3.

```bash
ros2 launch nav2_bringup tb3_simulation_launch.py headless:=True use_rviz:=False \
  map:=$PWD/maps/cafe.yaml \
  world:=$PWD/src/cuprunner_sim/worlds/cafe.sdf \
  robot_sdf:=$PWD/src/cuprunner_sim/urdf/cuprunner.sdf.xacro \
  x_pose:=-3.0 y_pose:=-2.0
```

Wait about 15 seconds, then run a goal script. `go_to.py` sets the initial pose, sends one goal and prints progress only when the distance changes:

```python
"""Send one Nav2 goal in the map frame: go_to.py X Y YAW  (metres, metres, radians)."""

import math
import sys

import rclpy
from geometry_msgs.msg import PoseStamped
from nav2_simple_commander.robot_navigator import BasicNavigator, TaskResult

START = (0.0, 0.0, 0.0)  # the robot's pose in the map when the map was built


def make_pose(navigator: BasicNavigator, x: float, y: float, yaw: float) -> PoseStamped:
    """Build a PoseStamped in the map frame. x and y are metres, yaw is radians."""
    pose = PoseStamped()
    pose.header.frame_id = 'map'
    pose.header.stamp = navigator.get_clock().now().to_msg()
    pose.pose.position.x = x
    pose.pose.position.y = y
    pose.pose.orientation.z = math.sin(yaw / 2.0)
    pose.pose.orientation.w = math.cos(yaw / 2.0)
    return pose


def main() -> int:
    if len(sys.argv) != 4:
        print('usage: go_to.py X Y YAW', file=sys.stderr)
        return 2
    x, y, yaw = (float(value) for value in sys.argv[1:4])
    rclpy.init()
    navigator = BasicNavigator()
    try:
        navigator.setInitialPose(make_pose(navigator, *START))
        navigator.waitUntilNav2Active()
        navigator.goToPose(make_pose(navigator, x, y, yaw))
        last_printed = None
        while not navigator.isTaskComplete():
            feedback = navigator.getFeedback()
            if feedback is not None:
                remaining = round(feedback.distance_remaining, 1)
                if remaining != last_printed:
                    last_printed = remaining
                    print(f'distance remaining: {remaining:.1f} m', flush=True)
        result = navigator.getResult()
        print(f'result: {result.name}', flush=True)
        return 0 if result == TaskResult.SUCCEEDED else 1
    finally:
        navigator.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    sys.exit(main())
```

Run `ros2 run cuprunner_tasks go_to 4.9 3.5 0.0` after adding the entry point. That point is about 0.6 metres in front of the return shelf, in map coordinates. The script exits 0 on success and 1 on any other result, so a pipeline can use it.

The robot's pose at the start is `(0, 0, 0)` in the map, because the map was built starting from there. If you start the robot somewhere else, the initial pose must change too.

### Step 5: Two timing traps

- **Start the goal script soon after the launch.** The Nav2 startup waits for an initial pose. In our runs, when the initial pose arrived more than about a minute and a half late, bringup failed. Starting the script 15 to 25 seconds after the launch worked.
- **Wait for Nav2 to be active.** `waitUntilNav2Active` blocks until the lifecycle nodes are up. Without it, the first goal is sent into nothing.

## 4. Worked example: TrailMug

TrailMug is fictional, and so is CupRunner. The numbers are invented.

The founder wants CupRunner to reach the return shelf. She writes the mission first: "Reach a point 0.6 metres in front of the return shelf, facing it. Report failure rather than retry for ever." Then she asks an agent for a goal script.

The agent's first version sets the goal in `odom`, not `map`. It also hard-codes a world coordinate, with no sign of the map offset. On a first test the robot drives off in a plausible direction and stops at a wall. The result says `FAILED`, and the script prints `SUCCEEDED` anyway, because the agent never read the result. She finds both faults by reading the code against her checks: **which frame is the goal in**, and **did the script read the result**.

She rewrites the brief with the frame and the result check spelled out. The next version passes. She keeps the failed run's log in `docs/` as a record of what the first answer did wrong.

## 5. Working with AI agents on this

**What the PDM decides.** The goals, the frame they are in, how close is close enough, and what happens on failure. Also the speed and the limits, which later come from safety.

**What you delegate, and the exact brief.** The goal scripts, the tour and the coordinate conversion. Adapt this:

```text
Write a Python script for ROS 2 Lyrical using nav2_simple_commander.
It takes X Y YAW on the command line (metres, metres, radians), builds a
PoseStamped in the "map" frame, sets the initial pose to (0, 0, 0), waits
until Nav2 is active, sends goToPose, prints the remaining distance only
when it changes, and exits 0 only if getResult() is SUCCEEDED.
Rules: type hints; clean up in finally; exit code 2 on bad arguments;
no hard-coded world coordinates.
After the code, list anything about Nav2 in Lyrical you were unsure of,
for example topic types or launch arguments.
```

**How you verify.** Run it with a goal you can reach and one you cannot. A point outside the room, such as `9.0 2.0 0.0`, printed `FAILED` and exited 1 in our runs. The reachable goal must print `SUCCEEDED` and exit 0. Do not use a point on a wall as your failing case: Nav2 accepts a goal near free space, and ours printed `SUCCEEDED`. That word means "close enough", not "exactly there". Read the frame in every pose. Check the exit code with `echo $?`. Open the map picture yourself and check that the walls are where the world file puts them. Watch for old API habits: an agent trained on older releases may use `Twist` where Lyrical uses `TwistStamped`, or a launch argument that has since changed.

**Which disciplines are involved.** Safety decides how fast the robot may move near people and what it does when blocked. Mechanical engineers know the robot's real turning circle and the clearance it needs. Operations decides who remaps the room when furniture moves. Design knows where the real shelf and counter will be.

**Where this sits on the ladder.** You **delegate** a bounded script with acceptance criteria and check the result. Running the tour and a navigation test at the same time on one machine needs separate domains and is the start of **orchestrating**.

**Disclose.** "AI use: first draft of the goal scripts by an agent; I specified the frame and the result check and ran the failing case." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Goals in the wrong frame.** Use `map` for goals. A goal in `odom` drifts away from the map.
- **Mixing world and map coordinates.** For this start, map = world + (3, 2). Write the conversion once, in one function, with a test.
- **Not reading the result.** A script that prints "done" after any outcome is a liar. Check `SUCCEEDED`.
- **A wrong initial pose.** AMCL cannot recover from a start that is far wrong. Set it from the map origin.
- **Starting the script too late.** Bringup waits for the initial pose and can fail.
- **Using a plain `Twist` listener.** Lyrical publishes `TwistStamped` on `cmd_vel`.
- **Using the old map.** If the room changes, remap and commit the new files with a note.
- **Trusting a tidy map.** A good-looking map from a simulation says little about a real floor with glass and clutter.

## 7. Practice: map the café and reach two goals

**Deliverable:** these files in your repository.

1. `maps/cafe.pgm` and `maps/cafe.yaml`, built by you.
2. `src/cuprunner_tasks/cuprunner_tasks/map_tour.py` and `go_to.py`, with entry points.
3. A small pure function and test for the world-to-map conversion, so it has a test of its own.
4. `docs/nav-evidence.md`: the commands you ran, the printed progress for two goals (4.9, 3.5, 0.0 and 3.0, 3.8, 1.5708) and their exit codes, plus one goal that fails on purpose and what it printed.
5. `docs/nav-limits.md`: five lines on what this does not prove.
6. `docs/agent-review.md`: the brief, the faults you found, and what you changed.

Add one change of your own: a third goal, or a check that prints the final distance to the goal.

**Check:** a reviewer can see two `SUCCEEDED` runs, one failure, and a map they can open, and can tell which frame every number is in.

## 8. Checklist

- [ ] I can explain SLAM, the map files, localisation and the three frames in my own words.
- [ ] The map files exist, and the picture shows the walls where the world has them.
- [ ] Every goal is in the `map` frame.
- [ ] The conversion between world and map is in one tested function.
- [ ] Each script exits 0 only on success.
- [ ] I recorded one failed goal and what it printed.
- [ ] I wrote what the simulation does not show.
- [ ] My AI-use line is in the README.

## 9. Further learning

The Nav2 getting-started page walks through the simulation you used here, and the navigation concepts page explains planners, controllers and behaviour trees. The pages on navigating while mapping and on mapping and localisation show the SLAM and AMCL setups in detail. The simple commander page lists every call in `BasicNavigator`. The `slam_toolbox` repository describes the mapper and its limits. REP 105 is the short standard behind `map`, `odom` and `base_link`, and the tf2 introduction explains how frames are combined. Next, in [Manipulation with MoveIt 2](/library/tracks/robot-software/05-manipulation-with-moveit-2), you plan the motion of an arm.
