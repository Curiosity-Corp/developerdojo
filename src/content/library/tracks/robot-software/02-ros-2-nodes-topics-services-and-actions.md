---
title: "ROS 2 nodes, topics, services and actions"
description: "Write your first ROS 2 programs in Python: a node that publishes, an action server with feedback and cancel, a launch file, and the command-line tools that show you what is running."
section: "Robot software"
order: 2
track: "robot-software"
level: "core"
duration: "4 hours"
outcomes:
  - "Say when to use a topic, a service or an action, and give a robot example of each"
  - "Write a Python node that publishes a message on a timer and takes a parameter"
  - "Define your own action and write an action server that reports feedback and honours cancel"
  - "Start several nodes from one launch file and inspect them with the ros2 command line"
  - "Review an agent's ROS 2 code for the usual errors: wrong interface, wrong release, no shutdown handling"
resources:
  - "ros/interfaces-topics-services-actions"
  - "ros/writing-a-simple-publisher-and-subscriber-python"
  - "ros/writing-a-simple-service-and-client-python"
  - "ros/learning-about-actions"
  - "ros/writing-an-action-server-and-client-python"
  - "ros/creating-a-launch-file"
prerequisites:
  - "tracks/robot-software/01-linux-and-python-for-robots"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot software track, and the Developer program's habit of splitting work into parts with clear contracts between them. **Time:** about four hours.

## 1. Why this matters

A robot is not one program. It is many small programs that must cooperate: one reads a sensor, one plans a path, one drives the wheels, one watches for problems. They run at different speeds, and they may crash independently. **ROS 2** is the toolkit and message system that lets them find each other and exchange data.

The shape of those exchanges is a design decision. Send the wrong kind of message and you get a robot that stutters, or one that keeps driving after you told it to stop. Choosing between a topic, a service and an action is not a coding detail. It decides what the robot can do when something goes wrong.

For a Product Development Manager (PDM) this lesson is about contracts. The message and action definitions are the contract between teams, and between you and an agent. If you can read them, you can review the system.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What each part promises: which data, how often, what happens on cancel or failure | Writing the nodes, the interface files and the launch file from your written contract | The interface matches your contract, cancel works, a bad goal is rejected, and the node stops cleanly | Safety (what must stop the robot), operations (what to log), mechanical and electrical engineers (rates the hardware can meet) |

## 2. Key ideas

### Nodes

A **node** is one program with one job, such as "count returned cups" or "drive to a pose". Nodes have names. They find each other without you wiring addresses, using a discovery system built into ROS 2.

### Topics: a stream

A **topic** is a named channel with one message type. A node **publishes** to it and others **subscribe**. Use a topic for data that flows all the time and where you only want the latest value: a camera image, the robot's position, a battery level. The publisher does not know who listens and does not wait for an answer.

### Services: a question and an answer

A **service** is a request and a reply. Use it for something quick and complete, such as "reset the counter" or "what is the current map name?". The caller waits. Do not use a service for anything that takes a long time, because the caller is stuck until it ends.

### Actions: a long job with feedback

An **action** is for a task that takes time and may fail or be stopped, such as "fetch this cup" or "drive to this pose". It has three parts: a **goal** (what to do), **feedback** (progress while it runs) and a **result** (the final outcome). The client can **cancel** a goal. Nav2 and MoveIt 2, which you use later, both work through actions.

| If you need... | Use | Robot example |
|---|---|---|
| Latest value, all the time | Topic | Camera image, battery level |
| A quick question and answer | Service | Set a mode, read a setting |
| A long task with progress and cancel | Action | Drive to a pose, fetch an object |

### Interfaces

The type of a message, service or action is called an **interface**. It lives in a short text file with the extension `.msg`, `.srv` or `.action`. ROS 2 generates code from it. A custom interface must be built in an `ament_cmake` package, even when your nodes are in Python.

### Parameters and launch files

A **parameter** is a setting a node reads at start, such as the speed or the start value. You can change it without editing code. A **launch file** starts a set of nodes together, with their parameters. In a launch file, written in Python, you also say which nodes belong to the same system.

### Quality of service

Every topic connection has a **quality of service** (QoS) profile: how many messages to keep, whether to resend lost ones, and whether late joiners get old messages. The defaults are reliable delivery, the last 10 messages kept, and no history for late joiners. When a sensor topic does not connect, mismatched QoS is a common reason. You can read both sides with `ros2 topic info --verbose`.

### Packages and workspaces

Code lives in **packages**. A **workspace** is a folder with a `src/` directory of packages. You build it with `colcon build` and make it visible with `source install/setup.bash`. Python packages use the `ament_python` build type. Interface packages use `ament_cmake`.

## 3. Step by step

All commands run inside the container from lesson 1, in your repository.

### Step 1: The interfaces package

Create `src/cuprunner_interfaces/` with these files.

`action/FetchCup.action`, with three parts separated by `---`:

```text
# Goal: which cup to fetch
string cup_id
---
# Result
bool success
string message
---
# Feedback: where the task is, from 0.0 to 1.0
string stage
float32 progress
```

`CMakeLists.txt`:

```cmake
cmake_minimum_required(VERSION 3.22)
project(cuprunner_interfaces)

find_package(ament_cmake REQUIRED)
find_package(rosidl_default_generators REQUIRED)

rosidl_generate_interfaces(${PROJECT_NAME}
  "action/FetchCup.action"
)

ament_export_dependencies(rosidl_default_runtime)
ament_package()
```

`package.xml` needs three special lines: `rosidl_default_generators` as a build tool dependency, `rosidl_default_runtime` as an exec dependency, and `<member_of_group>rosidl_interface_packages</member_of_group>`. Take the rest of the file from the official action tutorial in the resources below.

### Step 2: The Python package

Create `src/cuprunner_tasks/` as an `ament_python` package. You already have the `frames.py` file there. Add `setup.py`, `setup.cfg`, `package.xml`, a `resource/cuprunner_tasks` marker file (empty) and the entry points. The important parts of `setup.py` are the test extra and the console scripts:

```python
extras_require={'test': ['pytest']},
entry_points={
    'console_scripts': [
        'cup_counter = cuprunner_tasks.cup_counter:main',
        'fetch_server = cuprunner_tasks.fetch_server:main',
    ],
},
```

Without `extras_require`, `colcon test` finds no tests. Without a console script, `ros2 run` cannot find your node. In `package.xml`, list `rclpy`, `std_msgs` and `cuprunner_interfaces` as dependencies, and `python3-pytest` for tests.

### Step 3: A publishing node

`cuprunner_tasks/cup_counter.py` counts up once per second and publishes the total:

```python
"""Publish how many TrailMug cups the robot has collected. A first rclpy node."""

import rclpy
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node
from std_msgs.msg import Int32


class CupCounter(Node):
    """Counts up once per second and publishes the total on /cafe/returned_cups."""

    def __init__(self) -> None:
        super().__init__('cup_counter')
        self.declare_parameter('start', 0)
        self._count = self.get_parameter('start').get_parameter_value().integer_value
        self._publisher = self.create_publisher(Int32, '/cafe/returned_cups', 10)
        self._timer = self.create_timer(1.0, self._tick)

    def _tick(self) -> None:
        self._count += 1
        message = Int32()
        message.data = self._count
        self._publisher.publish(message)
        self.get_logger().info(f'returned cups: {self._count}')


def main(args: list[str] | None = None) -> None:
    rclpy.init(args=args)
    node = CupCounter()
    try:
        rclpy.spin(node)
    except (KeyboardInterrupt, ExternalShutdownException):
        pass
    finally:
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == '__main__':
    main()
```

Read the `main` function closely. It has a shutdown path. When you press Ctrl+C or the system asks the process to stop, `spin` raises an exception. The code catches those two on purpose and cleans up. Agents often leave this out, and then every stop prints a stack trace that hides real errors.

### Step 4: Build and run

```bash
colcon build
source install/setup.bash
ros2 run cuprunner_tasks cup_counter
```

You should see `returned cups: 1`, then 2, once a second. Stop it with Ctrl+C.

### Step 5: Inspect from a second terminal

Start the node in the background and use the tools. Discovery takes a moment, so if a command says the topic is not published yet, wait two seconds and run it again.

```bash
ros2 node list
ros2 topic list -t
ros2 topic echo --once /cafe/returned_cups
ros2 topic info /cafe/returned_cups --verbose
ros2 param get /cup_counter start
```

In a checked run, `ros2 node list` showed `/cup_counter` and `/fetch_server`. The topic list showed `/cafe/returned_cups [std_msgs/msg/Int32]`. `ros2 topic hz` reported an average rate of 1.000. `ros2 param get` returned `Integer value is: 0`. The verbose topic info printed the QoS profile: reliability `RELIABLE`, history `KEEP_LAST (10)`, durability `VOLATILE`.

Do not pipe `ros2` commands into `head`: the tool prints a broken-pipe error when the reader leaves early.

### Step 6: An action server

`cuprunner_tasks/fetch_server.py` accepts `FetchCup` goals, walks through four stages, reports feedback and honours cancel. For now it is a fake: it only reports stages. The real robot arrives in later lessons.

```python
"""An action server that walks through the stages of a cup fetch (no real robot yet)."""

import time

import rclpy
from cuprunner_interfaces.action import FetchCup
from rclpy.action import ActionServer, CancelResponse, GoalResponse
from rclpy.action.server import ServerGoalHandle
from rclpy.executors import ExternalShutdownException
from rclpy.node import Node

STAGES = ('search', 'approach', 'grasp', 'return')


class FetchServer(Node):
    """Accepts FetchCup goals, reports one stage at a time, and honours cancel."""

    def __init__(self) -> None:
        super().__init__('fetch_server')
        self.declare_parameter('stage_seconds', 0.5)
        self._server = ActionServer(
            self, FetchCup, 'fetch_cup',
            execute_callback=self._execute,
            goal_callback=self._on_goal,
            cancel_callback=self._on_cancel,
        )

    def _on_goal(self, goal_request: FetchCup.Goal) -> GoalResponse:
        if not goal_request.cup_id:
            self.get_logger().warning('rejecting a goal with an empty cup_id')
            return GoalResponse.REJECT
        return GoalResponse.ACCEPT

    def _on_cancel(self, goal_handle: ServerGoalHandle) -> CancelResponse:
        self.get_logger().info('cancel requested')
        return CancelResponse.ACCEPT

    def _execute(self, goal_handle: ServerGoalHandle) -> FetchCup.Result:
        stage_seconds = self.get_parameter('stage_seconds').get_parameter_value().double_value
        feedback = FetchCup.Feedback()
        for index, stage in enumerate(STAGES):
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                return FetchCup.Result(success=False, message=f'cancelled during {stage}')
            feedback.stage = stage
            feedback.progress = index / len(STAGES)
            goal_handle.publish_feedback(feedback)
            time.sleep(stage_seconds)
        goal_handle.succeed()
        return FetchCup.Result(success=True, message=f'fetched {goal_handle.request.cup_id}')
```

Add the same `main` function as in the counter, with `FetchServer` in place of `CupCounter`. Note the two guards. The goal callback rejects an empty `cup_id`, so a bad request is refused at once. The execute loop checks for cancel before every stage.

Test it with the command line:

```bash
ros2 run cuprunner_tasks fetch_server &
ros2 action list -t
ros2 action send_goal /fetch_cup cuprunner_interfaces/action/FetchCup "{cup_id: cup-001}" --feedback
ros2 action send_goal /fetch_cup cuprunner_interfaces/action/FetchCup "{cup_id: ''}"
```

The action list shows `/fetch_cup [cuprunner_interfaces/action/FetchCup]`. The first goal prints feedback for `search` (0.0), `approach` (0.25), `grasp` (0.5) and `return` (0.75), then `success: true`, `message: fetched cup-001` and `Goal finished with status: SUCCEEDED`. The empty goal prints `Goal was rejected.`

### Step 7: A launch file

`launch/tasks.launch.py` starts both nodes and exposes the stage time as a launch argument:

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description() -> LaunchDescription:
    stage_seconds = LaunchConfiguration('stage_seconds')
    return LaunchDescription([
        DeclareLaunchArgument('stage_seconds', default_value='0.5',
                              description='Seconds the fake fetch spends in each stage'),
        Node(package='cuprunner_tasks', executable='fetch_server', name='fetch_server',
             parameters=[{'stage_seconds': stage_seconds}], output='screen'),
        Node(package='cuprunner_tasks', executable='cup_counter', name='cup_counter',
             parameters=[{'start': 0}], output='screen'),
    ])
```

Add the launch folder to `data_files` in `setup.py` with `('share/' + package_name + '/launch', glob('launch/*.launch.py'))`, rebuild, then run `ros2 launch cuprunner_tasks tasks.launch.py stage_seconds:=1.0`.

### A note on stopping nodes

Ctrl+C stops all of these cleanly. When a process is stopped with a plain terminate signal, an action server can still print a context error as it exits, because shutdown races with the thread that waits for goals. In a checked run this happened once in three. It is noise at exit, not a fault in your logic, but note it so that you do not chase it.

## 4. Worked example: TrailMug

TrailMug is fictional, and so is the CupRunner robot. Every number is invented.

The founder writes the contract in plain words before she asks an agent for any code. "CupRunner counts returned cups and publishes the total. Anyone may read it; nobody waits for it. That is a topic. Fetching a cup takes a while, can fail, and the café manager must be able to stop it. That is an action, with a cup id as the goal, a stage as feedback, and success and a message as the result. An empty cup id is refused."

She gives the agent that paragraph. The agent returns a node that serves "fetch a cup" as a **service**. It works on the first try, and that is what makes it dangerous. A service gives no progress and no way to cancel. If the robot is halfway across the café and a customer steps in, the manager can only wait. She sends it back: "Use an action. It must report a stage and must stop when cancelled." The second version has the goal callback and the cancel check shown above.

Then she inspects it. `ros2 action list -t` shows the right type. A goal with an empty id is rejected. She sends a good goal, reads four feedback lines, and sees `SUCCEEDED`. She sends another and cancels it midway. The result says `cancelled during approach`. Only then does she commit.

## 5. Working with AI agents on this

**What the PDM decides.** The contract: topic, service or action; the field names; what happens on bad input, cancel and failure. These are your decisions because they decide how the robot behaves when something goes wrong.

**What you delegate, and the exact brief.** The nodes, interface files, launch file and tests. Delegation works best when the contract is in the brief. Adapt this:

```text
Write a ROS 2 Python package for ROS 2 Lyrical Luth. Use rclpy only.
Contract: an action server named fetch_cup of type
cuprunner_interfaces/action/FetchCup. Goal: string cup_id.
Result: bool success, string message. Feedback: string stage, float32 progress.
Behaviour: reject an empty cup_id. Report four stages: search, approach,
grasp, return. Check for cancel before every stage and stop cleanly.
Parameter: stage_seconds (double, default 0.5).
Rules: type hints on every function; catch KeyboardInterrupt and
ExternalShutdownException in main and clean up; no sleeps inside callbacks
except the stage wait; no global state.
Also write a launch file and a pytest test of any pure function you add.
After the code, list every API you were unsure exists in Lyrical.
```

**How you verify.** Do not stop at "it ran". Compare the interface file with your contract, field by field. Run the command-line session in Step 6 and check every line: type, feedback, rejection and success. Cancel a goal and read the result. Stop the node with Ctrl+C and check there is no stack trace. Read the imports: an older release's API may have moved. Run `colcon build` from a clean folder to prove the package builds from your files alone.

**Which disciplines are involved.** Safety decides what must be cancellable. Operations decides what to log and who is told. Electrical and mechanical engineers know the real rates and delays a sensor or motor can meet. Security asks which nodes are reachable from outside the machine: a ROS 2 network trusts every participant by default, so keep your robot network private.

**Where this sits on the ladder.** You **delegate** here. You give the agent a written contract and acceptance criteria and check the result against them. When several agents each write a different node, you are **orchestrating**, and the shared interface files are what keeps them consistent. A rule such as "every interface change needs a reviewed merge request" is **governing**.

**Disclose.** Add to each file or to the merge request: "AI use: first draft of the nodes by an agent; I wrote the contract and verified each behaviour with the ros2 tools." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **A service for a long task.** The caller waits and cannot cancel. Use an action.
- **No shutdown handling.** Every stop prints a stack trace and real errors get lost.
- **Blocking inside a callback.** A long loop in a subscriber callback stops other callbacks. Keep callbacks short.
- **Forgetting the console script.** `ros2 run` says it cannot find the executable.
- **Forgetting `extras_require` for tests.** `colcon test` runs nothing and reports success.
- **Not sourcing after a build.** The new package is invisible until `source install/setup.bash`.
- **Interfaces in a Python package.** Custom messages and actions need an `ament_cmake` package.
- **Trusting a quiet topic.** A mismatch in QoS makes a topic look empty. Read both sides with `--verbose`.

## 7. Practice: a contract, two nodes and a recording of the session

**Deliverable:** a merge request or commits in your own repository containing the code and a transcript.

1. `src/cuprunner_interfaces/` with `FetchCup.action`, built and visible to `ros2 interface show`.
2. `src/cuprunner_tasks/` with `cup_counter`, `fetch_server`, the launch file and the entry points.
3. `docs/contract.md`: half a page, in plain words, that says what each part promises, and what happens on a bad goal and on cancel.
4. `docs/ros2-session.txt`: the output of the inspection commands from Steps 5 and 6, including a cancelled goal.
5. `docs/agent-review.md`: the brief you gave an agent (if you used one), three things you checked, and one thing you changed.

Add one change of your own: a second parameter, such as `cup_prefix`, or a second field in the result. Update the contract, the code and the transcript together.

**Check:** a reviewer can start everything with one `ros2 launch` command and read the contract and the transcript without asking you a question.

## 8. Checklist

- [ ] I can say, for each exchange, why it is a topic, a service or an action.
- [ ] The interface file matches the contract in `docs/contract.md`.
- [ ] A goal with an empty `cup_id` is rejected.
- [ ] Cancelling a goal stops it and the result says so.
- [ ] Ctrl+C stops each node without a stack trace.
- [ ] One launch command starts the nodes, and a launch argument changes a setting.
- [ ] `colcon build` works from a clean checkout.
- [ ] I read every import and every callback an agent wrote.
- [ ] My README has an AI-use line.

## 9. Further learning

The official concepts page on interfaces explains topics, services and actions side by side and is the best short reference. The Python publisher and subscriber tutorial and the Python service and client tutorial are the official first programs in this language. The pages on learning about actions and on writing an action server and client in Python cover exactly the pattern in this lesson, with a Fibonacci example. The launch file tutorial shows the options this lesson only touches. Note that the official docs track the current release pages, so check the release name at the top of each one. Next, in [Simulate a robot in Gazebo](/library/tracks/robot-software/03-simulate-a-robot-in-gazebo), you give these nodes a world to act in.
