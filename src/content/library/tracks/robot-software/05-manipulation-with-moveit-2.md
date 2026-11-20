---
title: "Manipulation with MoveIt 2"
description: "Plan the motion of a simulated robot arm with MoveIt 2 and its Python API, add a collision box to the planning scene, and learn to read why a plan fails. Planning only, with no controllers."
section: "Robot software"
order: 5
track: "robot-software"
level: "advanced"
duration: "4 hours"
outcomes:
  - "Explain a planning group, a pose goal, a planning scene and a trajectory in plain words"
  - "Plan an arm motion to a pose goal with moveit_py and read the number of points in the path"
  - "Add a collision object to the planning scene and show how it changes the result"
  - "Check MoveIt documentation against the installed version before trusting a code sample"
  - "Say what planning alone proves, and what it leaves for controllers, grasping and real hardware"
resources:
  - "moveit/getting-started"
  - "moveit/concepts"
  - "moveit/motion-planning-python-api"
  - "moveit/planning-scene"
  - "moveit/moveit-setup-assistant"
  - "moveit/pick-and-place-with-moveit-task-constructor"
  - "ros/introducing-tf2"
prerequisites:
  - "tracks/robot-software/04-mapping-and-navigation-with-nav2"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot software track, and the Developer program's habit of checking a plan before you act on it. **Time:** about four hours.

## 1. Why this matters

Driving on a floor is a problem in two dimensions. An arm is a problem in six or seven. Each joint can turn, and the arm's links can hit the table, the shelf, the robot and themselves. "Move the hand to the cup" is easy to say. Finding a path of joint angles that does it without a collision is a search problem, and sometimes there is no answer.

**MoveIt 2** is the ROS 2 software that plans arm motions and avoids collisions. It does not move an arm by itself. It makes a plan, which is a list of joint positions with times. Something else, a controller, must carry the plan out.

For a Product Development Manager (PDM) this lesson is about a refusal. A planner that says "no path" is doing its job. You must be able to read why, and decide whether the answer is to change the goal, the scene or the robot.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the arm must reach, what it must never touch, and how long a plan may take | Writing the planning script, the scene setup and the tests | The goal is in the right frame, a blocked goal is refused, and no result is called a "grasp" | Mechanical and electrical engineers (the real arm, gripper and controllers), safety (speed, force, people nearby), operations (who tunes it) |

## 2. Key ideas

### Honest scope first

The simulated robot from lessons 3 and 4 has **no arm**. So this lesson uses a standard model arm, the Panda, from the MoveIt example files. It is a simulated model. DeveloperDojo does not own an arm or any hardware. You will plan motions for the model, headless, with no simulator and no controllers. That teaches the planning ideas you would use on any arm. It does not teach grasping, and it does not move anything.

### Joints, links and the robot description

An arm is a chain of **links** joined by **joints**. Its shape is described in a **URDF**, an XML file that describes a robot's links, joints and shape. MoveIt adds a second file, the **SRDF**, which names the parts you plan for: a **planning group** such as `panda_arm`, and named poses such as `ready`.

### Pose goals and kinematics

A **pose goal** says where a link must end up: a position and an orientation, in a named frame. The planner must find joint angles that put the link there. That is **inverse kinematics**. It may have no answer, because the pose is out of reach or in collision. A **frame** is again the key: a pose of `(0.35, 0.2, 0.5)` means nothing until you say which frame.

### The planning scene

The **planning scene** is MoveIt's picture of the world: the robot's current joint state plus the objects it must not hit. You add a box, a sphere or a mesh as a **collision object**. A real system would update it from sensors. Here you add objects in code.

### Planners and trajectories

A planner searches for a path. The default family here is **OMPL**, which uses random sampling, so two runs may give two different paths, and the search can fail within its time limit. The result is a **trajectory**: a list of points, each with joint positions and a time. Planning ends there. **Execution** sends the trajectory to controllers, which is not part of this lesson.

### Versions and documentation

At the time of writing, the Lyrical apt packages we checked were MoveIt 2.15.2. The MoveIt documentation tracks the Rolling development branch, and its Getting Started page recommends a different ROS 2 release from Lyrical. So **check every sample against the installed packages** before you trust it. The Python API, `moveit_py`, is a **separate package** from `ros-lyrical-moveit`. Without it, `import moveit` fails. The Dockerfile in lesson 1 installs it.

### Licences

We read them from the installed packages. `moveit_core` is BSD-3-Clause, `moveit_py` is BSD, and the Panda example configuration is BSD. These are permissive licences. Check the full text if you plan to ship something.

### What comes next

For a real pick and place, MoveIt has a framework called **MoveIt Task Constructor** that chains stages: approach, grasp, lift, place. It is a separate package, and it needs a robot with an arm, a gripper and controllers. It is the next step and it is not covered here.

## 3. Step by step

All commands run in the container from lesson 1.

### Step 1: Check the install

```bash
ros2 pkg prefix moveit_py
ros2 pkg prefix moveit_resources_panda_moveit_config
```

Both should print a path under `/opt/ros/lyrical`. If the first fails, the `ros-lyrical-moveit-py` package is missing.

### Step 2: Give MoveIt a robot state and a frame

A planner needs to know where the arm is now. A running robot publishes joint states and a transform. We have no robot, so we publish stand-ins: a joint state for the arm in its "ready" pose, and a fixed transform from `world` to the arm base. The joint state must carry a **timestamp**, which `header: auto` supplies.

```bash
export ROS_DOMAIN_ID=51
ros2 topic pub -r 20 /joint_states sensor_msgs/msg/JointState \
  "{header: auto, name: [panda_joint1, panda_joint2, panda_joint3, panda_joint4, panda_joint5, panda_joint6, panda_joint7, panda_finger_joint1, panda_finger_joint2], position: [0.0, -0.785, 0.0, -2.356, 0.0, 1.571, 0.785, 0.035, 0.035]}" &
ros2 run tf2_ros static_transform_publisher --frame-id world --child-frame-id panda_link0 &
```

Without a timestamped joint state, in a checked run, MoveIt failed on start with `Unable to configure planning scene monitor`. That message does not name the cause. The cause is a missing or untimed joint state.

### Step 3: Write the planning script

`src/cuprunner_arm/plan_panda.py` builds the MoveIt configuration, plans to a pose, adds a box at the goal and plans again. Read the config block carefully: the keys come from the Python API of the installed version.

```python
"""Plan a Panda arm motion with moveit_py. Planning only: no controllers, no execution."""

import sys

import rclpy
from geometry_msgs.msg import Pose, PoseStamped
from moveit.planning import MoveItPy
from moveit_configs_utils import MoveItConfigsBuilder
from moveit_msgs.msg import CollisionObject
from shape_msgs.msg import SolidPrimitive


def build_config() -> dict:
    moveit_config = (
        MoveItConfigsBuilder('moveit_resources_panda')
        .robot_description(file_path='config/panda.urdf.xacro')
        .robot_description_semantic(file_path='config/panda.srdf')
        .robot_description_kinematics(file_path='config/kinematics.yaml')
        .trajectory_execution(file_path='config/moveit_controllers.yaml')
        .planning_pipelines(pipelines=['ompl'])
        .to_moveit_configs()
    )
    config = moveit_config.to_dict()
    config['planning_scene_monitor_options'] = {
        'name': 'planning_scene_monitor',
        'robot_description': 'robot_description',
        'joint_state_topic': '/joint_states',
        'attached_collision_object_topic': '/moveit_cpp/planning_scene_monitor',
        'publish_planning_scene_topic': '/moveit_cpp/publish_planning_scene',
        'monitored_planning_scene_topic': '/moveit_cpp/monitored_planning_scene',
        'wait_for_initial_state_timeout': 10.0,
    }
    config['planning_pipelines'] = {'pipeline_names': ['ompl']}
    config['plan_request_params'] = {
        'planning_attempts': 1,
        'planning_pipeline': 'ompl',
        'planner_id': 'RRTConnectkConfigDefault',
        'planning_time': 2.0,
        'max_velocity_scaling_factor': 1.0,
        'max_acceleration_scaling_factor': 1.0,
    }
    return config


def main() -> int:
    rclpy.init()
    robot = MoveItPy(node_name='moveit_py', config_dict=build_config())
    arm = robot.get_planning_component('panda_arm')
    try:
        arm.set_start_state(configuration_name='ready')
        goal = PoseStamped()
        goal.header.frame_id = 'panda_link0'
        goal.pose.position.x = 0.35
        goal.pose.position.y = 0.2
        goal.pose.position.z = 0.5
        goal.pose.orientation.x = 1.0
        arm.set_goal_state(pose_stamped_msg=goal, pose_link='panda_hand')
        result = arm.plan()
        if not result:
            print('planning FAILED', flush=True)
            return 1
        points = result.trajectory.get_robot_trajectory_msg().joint_trajectory.points
        print(f'planned a path with {len(points)} points', flush=True)

        # Put a box on the goal and plan again: the planner must refuse or go round.
        box = CollisionObject()
        box.header.frame_id = 'panda_link0'
        box.id = 'cup_blocker'
        box.primitives.append(SolidPrimitive(type=SolidPrimitive.BOX, dimensions=[0.1, 0.1, 0.1]))
        box_pose = Pose()
        box_pose.position.x, box_pose.position.y, box_pose.position.z = 0.35, 0.2, 0.5
        box_pose.orientation.w = 1.0
        box.primitive_poses.append(box_pose)
        box.operation = CollisionObject.ADD
        with robot.get_planning_scene_monitor().read_write() as scene:
            scene.apply_collision_object(box)
            scene.current_state.update()
        arm.set_start_state(configuration_name='ready')
        arm.set_goal_state(pose_stamped_msg=goal, pose_link='panda_hand')
        blocked = arm.plan()
        print(f'with the box on the goal: {"planned" if blocked else "no plan"}', flush=True)
        return 0
    finally:
        robot.shutdown()
        rclpy.try_shutdown()


if __name__ == '__main__':
    sys.exit(main())
```

### Step 4: Run it and read the result

```bash
python3 src/cuprunner_arm/plan_panda.py 2>&1 | grep -v "INFO"
```

In a checked run the first plan succeeded with a path of 15 points. Your number may differ, because the planner samples at random. With the 0.1-metre box on the goal, the planner refused: the goal state was invalid. MoveIt prints a lot of INFO lines, so filter them or you will miss the line that matters.

### Step 5: Read a refusal

Change the box to 0.2 metres on each side and run again. This time the box also touches the hand's start position, and the planner reports that the **start state** is in collision, naming the box and the hand link. Two different boxes, two different refusals. The first said the goal cannot be reached. The second said the arm is already in trouble. Reading which one you got tells you what to change.

### Step 6: Know where the lesson stops

You planned a path. You did not run it. Execution needs a controller that the robot or a simulator provides, and a way to confirm the arm followed the path. Nothing here picks up a cup. If your capstone fetch step looks like a grasp, it is a stage-based action that only reports progress, and the capstone says so.

## 4. Worked example: TrailMug

TrailMug is fictional, and so is CupRunner. The numbers are invented.

The founder asks: "Could a small arm on CupRunner lift a returned cup from the shelf?" She cannot answer that with a base-only simulation. She writes down a narrower question she can answer: "Is there a collision-free arm path to a point above the cup, and does the planner refuse when something is in the way?"

An agent writes the planning script. On first run MoveIt exits with `Unable to configure planning scene monitor`. The agent suggests a longer timeout. She reads the message and the setup instead and asks herself what the monitor needs. It needs the arm's state. Nothing is publishing one. She adds the timestamped joint state and the transform, and the script runs.

She adds the box and sees the planner refuse the goal. She records both results, with the box size, in `docs/arm-evidence.md`. Her conclusion is careful: "A planner can find a collision-free path for a model arm in an empty scene, and refuses when the goal is blocked. Nothing was lifted, and no real arm, cup or shelf was tested."

## 5. Working with AI agents on this

**What the PDM decides.** What the arm must reach, what it must avoid, how long a plan may take, and what counts as enough evidence. Also whether this lesson's evidence is a claim about the product or about the tools.

**What you delegate, and the exact brief.** The planning script, scene setup and tests. MoveIt is an area where agents confuse versions, so name the version and demand doubts. Adapt this:

```text
Write a Python script for ROS 2 Lyrical using moveit_py (package ros-lyrical-moveit-py,
MoveIt 2.15.x). Do not use Humble or Jazzy examples without checking they exist in Lyrical.
Plan the "panda_arm" planning group, planning only, with the example config from
moveit_resources_panda_moveit_config. Start from the named state "ready" and plan to
a pose in the panda_link0 frame, in metres, link panda_hand.
Then add a box collision object at the goal and plan again; print whether each plan succeeded.
Rules: type hints, shut MoveItPy down in finally, no execution, filter nothing silently.
After the code, list every API call you were unsure exists in this version.
```

**How you verify.** Do not trust a sample because it looks like the docs. Check each import and each call against the installed package: `python3 -c "import moveit.planning"` and the source. Run it, read the first plan, then break it on purpose with a box and read the refusal. Check the frame of every pose. Check that the script does not claim to move anything. Re-run it twice and note that the path can differ.

**Which disciplines are involved.** Mechanical and electrical engineers know the real arm: reach, payload, joint limits and gripper. Safety decides speeds and what the arm may touch near people. Operations asks who updates the scene when the world changes. Security asks who may send a motion command.

**Where this sits on the ladder.** You **delegate** a bounded script, and you read each refusal. When one agent writes the planner and another the scene, you are **orchestrating**, and the frame names and units must be in both briefs.

**Disclose.** "AI use: first draft of the planning script by an agent; I checked each call against the installed version and ran the blocked case." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Copying docs for the wrong release.** MoveIt's docs follow Rolling. Check against what is installed.
- **Forgetting `moveit_py`.** It is a separate package.
- **No joint state.** The planning scene monitor fails with an unhelpful message.
- **A pose in the wrong frame.** Name the frame and the link on every goal.
- **Treating a plan as a motion.** Nothing moved. Controllers do that.
- **Treating one plan as the plan.** Sampling planners vary. Test more than once.
- **Reading only the last line.** MoveIt prints many INFO lines. Find the one that says why it refused.
- **Calling it a grasp.** Planning is not grasping.

## 7. Practice: plan, block, and explain

**Deliverable:** these files in your repository.

1. `src/cuprunner_arm/plan_panda.py`, running in the container.
2. `docs/arm-evidence.md`: the commands, the output of the first plan, the output with a 0.1 metre box, the output with a 0.2 metre box, and a paragraph on what each refusal means.
3. `docs/arm-limits.md`: five lines on what this does not show, including that nothing was executed and that the arm is a model.
4. A small test that checks a pure helper, for example a function that builds the `CollisionObject` from a size and a position, with units in the names.
5. `docs/agent-review.md`: the brief, two calls you checked against the installed version, and one fault you found.

Add one change of your own: a second goal pose, or a second box, and record the result.

**Check:** a reviewer can see three results, tell which frame each pose uses, and read what the plan does not prove.

## 8. Checklist

- [ ] I can explain planning group, pose goal, planning scene and trajectory in my own words.
- [ ] `import moveit.planning` works, and I know `moveit_py` is a separate package.
- [ ] I published a timestamped joint state and a transform so the planner could start.
- [ ] I have the output of a successful plan and of a refused one.
- [ ] Every pose names its frame and its link.
- [ ] I wrote that nothing was executed and the arm is a model.
- [ ] I checked each agent call against the installed version.
- [ ] My AI-use line is in the README.

## 9. Further learning

The MoveIt getting-started page introduces the pieces, and the concepts page explains planning, kinematics and the planning scene in the project's own words. The page on the motion planning Python API shows the `moveit_py` calls used here; read it against the version you have installed. The planning scene page covers collision objects in depth. The Setup Assistant page shows how to make a MoveIt configuration for your own robot. The Task Constructor pick-and-place tutorial is the next step, for a robot with a gripper. The tf2 introduction explains the frames behind every pose. Next, in [Test and log robot software](/library/tracks/robot-software/06-test-and-log-robot-software), you build the evidence habit that ties the track together.
