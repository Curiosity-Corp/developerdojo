---
title: "Simulate a robot in Gazebo"
description: "Describe a virtual café in a text file, run it headless in Gazebo, put a camera on a simulated robot, bridge the pictures into ROS 2, and write a tested node that finds an orange cup."
section: "Robot software"
order: 3
track: "robot-software"
level: "core"
duration: "4 hours"
outcomes:
  - "Describe a room with walls, furniture and an object in an SDF world file and check it with gz sdf"
  - "Run Gazebo without a screen and read the simulation clock to see how fast it runs"
  - "Add a camera to a simulated robot and bridge its topics into ROS 2 with a config file"
  - "Write and test a colour-and-depth function that turns a camera picture into a 3D point"
  - "Say what a simulation cannot tell you about a real robot"
resources:
  - "gazebo/getting-started-with-gazebo"
  - "gazebo/installing-gazebo-with-ros"
  - "gazebo/use-ros-2-to-interact-with-gazebo"
  - "gazebo/sdf-worlds"
  - "gazebo/building-your-own-robot"
  - "ros/building-a-visual-robot-model-from-scratch"
  - "ros/introducing-tf2"
prerequisites:
  - "tracks/robot-software/02-ros-2-nodes-topics-services-and-actions"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot software track, and the Developer program's habit of testing in a safe place before real use. **Time:** about four hours, mostly waiting for the first builds and runs.

## 1. Why this matters

A real robot is expensive, slow to reset and able to hurt things. A simulated robot resets in a second and can fall off a table a hundred times. Every bug found there did not reach hardware.

But a simulation is a model, and a model is wrong in ways you must name. This lesson teaches you to build one, and to say clearly what it does not prove. That second part is the skill. A run that works in simulation shows that your code is logically sound. It does not show that the real floor, the real light or the real battery will cooperate.

For a Product Development Manager (PDM), the world file is a specification you can read. The room, the objects and the sensor are written down, so anyone can check whether the test was a fair one.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the simulated world must contain to be a fair test, and what it leaves out | Writing the SDF boilerplate, the bridge config and the image-processing code from your table of objects | The world matches your table, the camera sees what you expect, the tests pass, and the limits are written down | Mechanical engineers (real sensor specs and mounting), design (the real room), safety (people and obstacles the sim leaves out) |

## 2. Key ideas

### Gazebo and SDF

**Gazebo** is an open-source simulator that models a robot, its sensors and its world. The version used here is **Gazebo Jetty**, the release the Gazebo project recommends for ROS 2 Lyrical. Gazebo Classic, the old program that people call "Gazebo 11", reached end of life on 31 January 2025, so a tutorial that uses `gazebo` and not `gz sim` is out of date.

A world is described in **SDF**, the Simulation Description Format. It is an XML text file. A world holds **models**; a model holds **links** with a shape for collision and a shape to draw; links can carry **sensors**. The world also lists **systems**, which are plugins that do the work: physics, sensors, scene updates.

### Server and window

Gazebo runs as a **server** that simulates, and an optional **window** that draws. In this track you run only the server, with `gz sim -s -r`: `-s` means server only, `-r` means start running at once. That is how a simulation runs in a pipeline or on a laptop with no graphics. It is also why the lessons work on a CPU. Camera sensors still render, in software, which is slower than on a GPU.

### Real time factor

Simulation has its own clock. The **real time factor** says how fast simulated time runs against the wall clock. A factor of 1.0 means the simulation keeps up. Below 1.0 it is slower than reality. In a checked run of the empty café on a CPU-only laptop-class container, Gazebo reported a factor of 0.9997 with a step of 3 milliseconds. A bigger world or more cameras will lower it. Check the factor whenever a result looks odd.

### Two worlds, one bridge

Gazebo has its own message system. ROS 2 has another. The program `ros_gz_bridge` copies messages between them. You name each topic, the ROS type and the Gazebo type, and the direction. Without the bridge, your Python nodes see nothing.

### What a camera gives you

An `rgbd_camera` gives a colour image, a depth image where each pixel holds a distance in metres, and the camera's **intrinsics**, which say how the lens turns a direction into a pixel. With a pixel and its depth you can compute a 3D point. That is the **pinhole model**, all the maths this lesson needs.

## 3. Step by step

### Step 1: Describe the room

Put the world in `src/cuprunner_sim/worlds/cafe.sdf`. The room is 8 by 6 metres. Give this table to an agent and ask it to write the SDF, or write it by hand. Every pose is in metres, in the world frame.

| Model | Position x, y (m) | Size (m) | Notes |
|---|---|---|---|
| wall_north, wall_south | 0, +3.05 and 0, -3.05 | 8.2 by 0.1 by 1.0 | static |
| wall_east, wall_west | +4.05, 0 and -4.05, 0 | 0.1 by 6.0 by 1.0 | static |
| table_1 | -1.5, 1.0 | 1.2 by 0.8 by 0.75 | static |
| table_2 | 1.0, -1.2 | 1.2 by 0.8 by 0.75 | static |
| counter | 0, 2.55 | 3.0 by 0.6 by 1.0 | static |
| return_shelf | 2.5, 1.5 | 0.4 by 0.4 by 0.3 | static, green |
| cup_001 | 2.5, 1.5, z 0.35 | cylinder, radius 0.04, length 0.10 | **orange**, not static, mass 0.1 kg |

The skeleton of the file is below. It declares the physics step, the four systems and a floor. The agent adds one block per row of the table.

```xml
<?xml version="1.0"?>
<sdf version="1.9">
  <world name="cafe">
    <physics name="3ms" type="ode">
      <max_step_size>0.003</max_step_size>
      <real_time_factor>1</real_time_factor>
    </physics>
    <plugin filename="gz-sim-physics-system" name="gz::sim::systems::Physics"/>
    <plugin filename="gz-sim-user-commands-system" name="gz::sim::systems::UserCommands"/>
    <plugin filename="gz-sim-scene-broadcaster-system" name="gz::sim::systems::SceneBroadcaster"/>
    <plugin filename="gz-sim-sensors-system" name="gz::sim::systems::Sensors">
      <render_engine>ogre2</render_engine>
    </plugin>
    <plugin filename="gz-sim-imu-system" name="gz::sim::systems::Imu"/>
    <model name="cup_001">
      <pose>2.5 1.5 0.35 0 0 0</pose>
      <link name="link">
        <inertial><mass>0.1</mass>
          <inertia><ixx>0.00018</ixx><iyy>0.00018</iyy><izz>0.00008</izz>
            <ixy>0</ixy><ixz>0</ixz><iyz>0</iyz></inertia></inertial>
        <collision name="collision">
          <geometry><cylinder><radius>0.04</radius><length>0.10</length></cylinder></geometry>
        </collision>
        <visual name="visual">
          <geometry><cylinder><radius>0.04</radius><length>0.10</length></cylinder></geometry>
          <material><ambient>1.0 0.45 0.0 1</ambient><diffuse>1.0 0.45 0.0 1</diffuse></material>
        </visual>
      </link>
    </model>
    <!-- floor, light, walls, tables, counter and shelf go here -->
  </world>
</sdf>
```

Remember to add a floor (a plane) and a light. Without a floor, everything falls. Without a light, the camera sees black.

### Step 2: Check it, and read the warnings

```bash
gz sdf -k src/cuprunner_sim/worlds/cafe.sdf
```

A good file prints `Valid.`. Be careful. In a checked run, the tool still printed `Valid.` and exit code 0 for a file with an unknown element; it only printed a warning above. **Read the lines above the verdict.** An agent's SDF with a misspelled tag can be "valid" and wrong.

### Step 3: Run the world with no window

```bash
gz sim -s -r src/cuprunner_sim/worlds/cafe.sdf &
sleep 8
gz topic -l
gz topic -e -t /world/cafe/stats -n 1
```

The topic list includes `/world/cafe/clock` and `/world/cafe/stats`. The stats message shows `sim_time`, `real_time`, `iterations` and `real_time_factor`. Stop the server with `kill %1`. Use `GZ_PARTITION=<name>` to keep two simulations from seeing each other, the way `ROS_DOMAIN_ID` does for ROS.

### Step 4: Give the robot a camera

The Nav2 project ships a small simulated robot, a TurtleBot 3 Waffle model, with its simulation files in `nav2_minimal_tb3_sim` under the Apache 2.0 licence. You copy its model file and change one sensor.

```bash
mkdir -p src/cuprunner_sim/urdf
cp /opt/ros/lyrical/share/nav2_minimal_tb3_sim/urdf/gz_waffle.sdf.xacro \
   src/cuprunner_sim/urdf/cuprunner.sdf.xacro
```

In the copy, change the model name from `turtlebot3_waffle` to `cuprunner`. Then replace the whole `<sensor name="intel_realsense_r200_depth" type="depth">` block with a combined colour and depth camera:

```xml
<sensor name="rgbd_camera" type="rgbd_camera">
  <always_on>true</always_on>
  <update_rate>10</update_rate>
  <topic>$(arg namespace)/camera</topic>
  <frame_id>camera_rgb_optical_frame</frame_id>
  <pose>0.064 -0.047 0.107 0 0 0</pose>
  <camera>
    <horizontal_fov>1.047</horizontal_fov>
    <image><width>320</width><height>240</height><format>R8G8B8</format></image>
    <clip><near>0.05</near><far>5.0</far></clip>
  </camera>
</sensor>
```

The picture is small on purpose, to keep a CPU run quick. This is a model of a camera, not a real product.

### Step 5: Start the robot and the bridge

The Nav2 package has a launch file that starts Gazebo, spawns the robot and starts Nav2. You use it for the simulation now and for navigation in the next lesson.

```bash
ros2 launch nav2_bringup tb3_simulation_launch.py headless:=True use_rviz:=False \
  world:=$PWD/src/cuprunner_sim/worlds/cafe.sdf \
  robot_sdf:=$PWD/src/cuprunner_sim/urdf/cuprunner.sdf.xacro \
  x_pose:=0.5 y_pose:=1.5
```

The robot starts at (0.5, 1.5) facing +x, so the cup is about two metres ahead. Next, the bridge config `src/cuprunner_sim/config/camera_bridge.yaml`:

```yaml
- topic_name: "camera/image"
  ros_type_name: "sensor_msgs/msg/Image"
  gz_type_name: "gz.msgs.Image"
  direction: GZ_TO_ROS

- topic_name: "camera/depth_image"
  ros_type_name: "sensor_msgs/msg/Image"
  gz_type_name: "gz.msgs.Image"
  direction: GZ_TO_ROS

- topic_name: "camera/camera_info"
  ros_type_name: "sensor_msgs/msg/CameraInfo"
  gz_type_name: "gz.msgs.CameraInfo"
  direction: GZ_TO_ROS
```

Start it in a second terminal:

```bash
ros2 run ros_gz_bridge parameter_bridge --ros-args -p config_file:=$PWD/src/cuprunner_sim/config/camera_bridge.yaml
```

Check with `ros2 topic hz /camera/image`. In a checked run it reported an average rate of about 10.0 Hz, matching the update rate in the sensor.

### Step 6: Find the cup in the picture

Put the image maths in a pure module, so you can test it with no simulator. `cuprunner_tasks/vision.py`:

```python
"""Find an orange cup in a camera image and turn the pixel into a 3D point."""

from __future__ import annotations

import numpy as np


def orange_mask(rgb: np.ndarray) -> np.ndarray:
    """Return a boolean mask of orange pixels in an H x W x 3 uint8 RGB image."""
    if rgb.ndim != 3 or rgb.shape[2] != 3:
        raise ValueError(f'expected an H x W x 3 image, got shape {rgb.shape}')
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    # Lighting changes the brightness, so test the colour balance, not exact values.
    return (r > 60) & (r - g > 20) & (g - b > 20)


def find_blob(rgb: np.ndarray, min_pixels: int = 20) -> tuple[float, float, int] | None:
    """Return (u, v, pixel_count) for the centre of the orange pixels, or None."""
    ys, xs = np.nonzero(orange_mask(rgb))
    if xs.size < min_pixels:
        return None
    return float(xs.mean()), float(ys.mean()), int(xs.size)


def pixel_to_point(
    u: float, v: float, depth_m: float, k: list[float]
) -> tuple[float, float, float]:
    """Pinhole model: pixel (u, v) at depth_m metres to (x, y, z) in the camera optical frame.

    k is the row-major 3x3 intrinsic matrix from sensor_msgs/CameraInfo.
    The optical frame has x right, y down and z forward.
    """
    if depth_m <= 0.0 or not np.isfinite(depth_m):
        raise ValueError(f'depth must be a positive number of metres, got {depth_m}')
    fx, cx, fy, cy = k[0], k[2], k[4], k[5]
    return (u - cx) * depth_m / fx, (v - cy) * depth_m / fy, depth_m
```

There is a comment in `orange_mask` that came from a real failure. The first version tested for bright orange, and the cup in the simulation renders darker than its colour value, so the test found nothing. The fix was to test the balance between red, green and blue, which survives a change of brightness. A test now guards it.

`test/test_vision.py`:

```python
import numpy as np
import pytest

from cuprunner_tasks.vision import find_blob, pixel_to_point

K = [277.0, 0.0, 160.0, 0.0, 277.0, 120.0, 0.0, 0.0, 1.0]


def test_finds_a_dim_orange_cup():
    image = np.full((240, 320, 3), 100, dtype=np.uint8)
    image[95:105, 140:150] = (100, 68, 0)
    u, v, count = find_blob(image)
    assert count == 100
    assert (u, v) == pytest.approx((144.5, 99.5))


def test_grey_and_green_are_not_orange():
    image = np.full((240, 320, 3), 100, dtype=np.uint8)
    image[100:150, 110:180] = (30, 80, 60)
    assert find_blob(image) is None


def test_centre_pixel_is_straight_ahead():
    assert pixel_to_point(160.0, 120.0, 2.0, K) == (0.0, 0.0, 2.0)
```

The node `cup_finder.py` subscribes to `camera/image`, `camera/depth_image` and `camera/camera_info`, reads the depth at the blob centre, and publishes a `PointStamped` on `cup/point`. Keep it thin: it checks the encodings (`rgb8` and `32FC1`), calls the two functions above, and warns if the depth is not a usable number. Use the same `main` and shutdown handling as lesson 2. In the checked run, the finder published a point with `frame_id: camera_rgb_optical_frame` and `z` of about 1.83 metres for a cup roughly two metres away. The point is in the **camera optical frame**, where x is right, y is down and z is forward. Lesson 4 explains why that matters.

## 4. Worked example: TrailMug

TrailMug is fictional, and so is CupRunner. The numbers are invented for teaching.

The founder wants to know if a small robot could ever find a returned cup on a shelf. She has no robot. She writes the table above: the room, the shelf, an orange cup, and a simple camera. The table says in a line at the top: "the real café is not measured".

The agent writes the SDF. She runs `gz sdf -k` and reads above the verdict: one warning for a tag the agent invented. She removes it. She runs the world headless and reads the real time factor, then adds the robot and the bridge and watches the camera topic reach 10 Hz.

The first test of the finder fails. The cup is in the picture, but the blob count is zero. She saves the picture, looks at it, reads the pixel values and sees that the cup renders dim. She writes the failing case as a test, then asks the agent to fix the rule so the test passes. The test stays in the repository.

In her README she writes the limit: "This shows that the finder works on a clean, well-lit, orange cup in an empty room. It does not show that it works on a real cup, in real light, on a cluttered shelf."

## 5. Working with AI agents on this

**What the PDM decides.** What the world must contain, and what it leaves out. Which sensor and what picture size. The honest limit statement.

**What you delegate, and the exact brief.** The SDF file, the bridge config, the vision functions and their tests. These are tedious and checkable, which makes them good for an agent. Adapt this:

```text
Write an SDF 1.9 world file for Gazebo Jetty (gz sim, not Gazebo Classic).
World name: cafe. Physics step 0.003 s. Systems: Physics, UserCommands,
SceneBroadcaster, Sensors (ogre2) and Imu. Add a floor and a light.
Models, in metres in the world frame: <paste your table here>.
Rules: every model has collision and visual geometry, the cup has an
inertial block, colours are the ones in the table, use only elements that exist
in SDF 1.9. After the file, list any element or plugin name you are unsure of.
```

**How you verify.** Run `gz sdf -k` and read the warnings, not only the verdict. Run the server and read `real_time_factor`. Compare the world to your table, row by row: positions, sizes, colours. For the finder, run the unit tests, then look at a saved camera image yourself and check the node's point against the geometry: the cup is about two metres from the robot, so a result of 20 metres is a bug. Be wary of any filename or plugin name you cannot find in the Gazebo docs.

**Which disciplines are involved.** Mechanical and electrical engineers know the real camera: its field of view, noise and mounting. Design knows what a real café looks like. Safety asks what is missing from the world: people, glass, reflections. Operations asks what the simulation costs to run in a pipeline.

**Where this sits on the ladder.** You **delegate** the boilerplate and **use** an agent step by step on the finder, where you read each failure. When you run several simulations at once, each needs its own `GZ_PARTITION` and `ROS_DOMAIN_ID`, and that is the first sign of **orchestrating**.

**Disclose.** Add a line: "AI use: first draft of the SDF and the finder by an agent; I wrote the object table, checked the world against it and wrote the failing test." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Using Gazebo Classic instructions.** Classic is end of life. The command is `gz sim`, not `gazebo`.
- **Believing `Valid.`.** The checker passes some unknown elements with a warning. Read the output above it.
- **No floor or no light.** Objects fall forever, or the camera sees black.
- **Forgetting the bridge.** The topic exists in Gazebo but not in ROS 2. Run `gz topic -l` and `ros2 topic list` to see which side is missing.
- **Testing exact colour values.** Lighting changes brightness. Test colour balance and keep a dim-cup test.
- **Treating a simulation pass as proof.** It proves the logic, not the real world.

## 7. Practice: a world, a camera and a finder with tests

**Deliverable:** these files in your repository.

1. `src/cuprunner_sim/worlds/cafe.sdf`, `src/cuprunner_sim/urdf/cuprunner.sdf.xacro` and `src/cuprunner_sim/config/camera_bridge.yaml`.
2. `src/cuprunner_tasks/cuprunner_tasks/vision.py`, `cup_finder.py` and `test/test_vision.py`, with all tests passing.
3. `docs/sim-evidence.md`: the `gz sdf -k` output, the real time factor you measured, the camera rate and one cup point from `ros2 topic echo --once /cup/point`.
4. `docs/sim-limits.md`: five lines on what this simulation does not prove.
5. `docs/agent-review.md`: the brief, what the agent got wrong or doubted, and what you changed.

Add one change of your own: move the cup to the other end of the shelf, or change its colour to a second colour and add a test that the finder rejects the old one.

**Check:** a reviewer can read `docs/sim-limits.md` and the evidence file without running anything, and can still tell what was and was not shown.

## 8. Checklist

- [ ] The world file matches my table, row by row.
- [ ] I read the warnings from `gz sdf -k`, not just the verdict.
- [ ] I ran the server headless and recorded the real time factor.
- [ ] The camera topics appear in ROS 2 and the image rate is about the sensor rate.
- [ ] The finder has unit tests, including a dim cup and a non-orange object.
- [ ] The cup point is about the distance I expect.
- [ ] I wrote what the simulation does not prove.
- [ ] My AI-use line is in the README.

## 9. Further learning

The Gazebo getting-started pages explain worlds, models and the `gz` commands. The page on installing Gazebo with ROS names which Gazebo release pairs with which ROS 2 release, so check this track's pairing there. The page on using ROS 2 with Gazebo explains the bridge. The SDF worlds page lists the elements for a world file, and the page on building your own robot shows how a model is made from links and joints. The ROS 2 tutorial on a visual robot model shows the same idea in URDF, and the tf2 introduction explains the frames behind the camera point. Next, in [Mapping and navigation with Nav2](/library/tracks/robot-software/04-mapping-and-navigation-with-nav2), the robot builds a map and drives to goals.
