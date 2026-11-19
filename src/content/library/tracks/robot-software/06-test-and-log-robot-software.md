---
title: "Test and log robot software"
description: "Build a small test pyramid for robot code, from pure-function tests to a launch test of a real node, record a run with rosbag, and sketch a pipeline that runs the tests on every push."
section: "Robot software"
order: 6
track: "robot-software"
level: "core"
duration: "3 hours"
outcomes:
  - "Explain the robot test pyramid and say which layer catches which kind of fault"
  - "Write a pytest unit test and a launch_pytest test that starts a real ROS 2 node"
  - "Run the tests with colcon and read the result summary"
  - "Record a run with rosbag2, inspect it and play it back, and say why the file stays out of git"
  - "Write a pipeline sketch that runs the tests, and say what it does not yet cover"
resources:
  - "ros/writing-basic-tests-with-python"
  - "ros/writing-basic-integration-tests-with-launch-testing"
  - "ros/recording-and-playing-back-data"
  - "docker/ros-official-image"
  - "gitlab/what-is-ci-cd"
  - "gitlab/create-your-first-ci-cd-pipeline"
prerequisites:
  - "tracks/robot-software/02-ros-2-nodes-topics-services-and-actions"
  - "tracks/ci-cd/01-pipelines-from-first-principles"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** the Robot software track, the CI/CD track, and the Developer program's rule that work is done only when evidence shows it. **Time:** about three hours.

## 1. Why this matters

When a robot misbehaves, you cannot freeze it and look inside. It has moved on. The only things that survive are what you tested before and what you recorded during. A team with no tests argues about what the robot did. A team with tests and recordings looks at them.

Robot software is hard to test for three reasons. It runs many programs at once. It depends on time, and clocks differ. And a full test, with a simulated world, is slow. The answer is not one big test. It is many small fast tests, a few medium ones and one or two slow ones, in a shape called a **test pyramid**.

For a Product Development Manager (PDM) this lesson is about proof. A claim like "the robot fetches the cup" is worth what its recorded evidence is worth. You decide what evidence is enough, and you check that it exists before you believe the claim.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What must be tested before a change merges, and what evidence a release needs | Writing tests, the recording commands and the pipeline file | Tests can fail, the pipeline is green for the right reason, recordings are small and reproducible | Security (what recordings contain), operations (who owns the pipeline), safety (which tests are gates), data and privacy (recordings of people) |

## 2. Key ideas

### The robot test pyramid

| Layer | What it tests | Speed | Example here |
|---|---|---|---|
| Unit | One function, no ROS running | Milliseconds | `normalise_angle`, `find_blob` |
| Integration | One or more real nodes, no simulator | Seconds | The cup counter node publishes the start value |
| System | The whole mission in simulation | Minutes | The capstone mission |

Most of your tests should be unit tests. That is why you keep maths in pure functions. A few integration tests prove that nodes start, connect and publish. One or two system tests prove the story end to end. Each layer up is slower and flakier, so move a check down whenever you can.

### What each layer cannot do

A unit test cannot show that two nodes agree on a topic name. An integration test cannot show that the robot reaches a point in a room. A system test in simulation cannot show that the real floor, real light or real battery behave. State that last limit in every report.

### A test must be able to fail

A test that always passes is worse than none. When you write one, break the code on purpose and watch the test go red. When an agent writes one, do the same. The most common agent fault is a test that checks nothing.

### Logging

A node writes log lines at levels: debug, info, warning, error. Use `self.get_logger().info(...)` and the others in rclpy. Good logs say **what the node decided and why**, with units, and they do not log every cycle. A message that prints ten times a second hides the one that matters.

### Recording with rosbag2

A **rosbag** is a file that records robot messages so you can replay them later. In ROS 2 the tool is `ros2 bag`. A recording holds timestamped messages from the topics you chose. You can inspect it, play it back to a node under test, and compare behaviour across code versions. Storage uses a format called `mcap` here. In Lyrical, `ros2 bag record` needs the topics after a `--topics` flag. The older form that lists topics at the end fails with an "unrecognized arguments" error, so an agent's old command may not run.

A bag keeps what the robot saw. On a real robot that can include camera images of people. Even in simulation, bags grow fast. Keep them out of git. Commit a short written summary and a checksum, and store the file somewhere meant for large data.

## 3. Step by step

### Step 1: Run the unit tests with colcon

`colcon` builds and tests every package in the workspace. Make sure `setup.py` has `extras_require={'test': ['pytest']}`, or `colcon test` finds nothing and still reports success.

```bash
colcon build --packages-select cuprunner_interfaces cuprunner_tasks
source install/setup.bash
colcon test --packages-select cuprunner_tasks
colcon test-result --verbose
```

`colcon test-result` prints the summary. In the checked workspace, which had a few more tests than this lesson shows, twelve passed. Read the numbers. Zero tests passed means zero tests ran.

### Step 2: Write an integration test with launch_pytest

This test starts the real `cup_counter` node, reads what it publishes and asserts on it. Add `launch_pytest` to the test dependencies in `package.xml`. `test/test_counter_launch.py`:

```python
"""Integration test: start the real cup_counter node and read what it publishes."""

import time

import launch
import launch_pytest
import launch_ros.actions
import pytest
import rclpy
from launch_pytest.actions import ReadyToTest
from std_msgs.msg import Int32


@launch_pytest.fixture
def counter_launch():
    counter = launch_ros.actions.Node(
        package='cuprunner_tasks',
        executable='cup_counter',
        parameters=[{'start': 5}],
    )
    return launch.LaunchDescription([counter, ReadyToTest()])


@pytest.mark.launch(fixture=counter_launch)
def test_counter_publishes_start_value():
    rclpy.init()
    node = rclpy.create_node('counter_listener')
    received: list[int] = []
    node.create_subscription(Int32, '/cafe/returned_cups', lambda m: received.append(m.data), 10)
    try:
        deadline = time.monotonic() + 10.0
        while not received and time.monotonic() < deadline:
            rclpy.spin_once(node, timeout_sec=0.5)
    finally:
        node.destroy_node()
        rclpy.shutdown()
    assert received, 'no message on /cafe/returned_cups within 10 s'
    assert received[0] >= 5
```

Read the shape. The fixture says what to launch and when it is ready. The test waits with a deadline, not a fixed sleep, so a slow machine does not fail it by luck. In the checked run it passed in about two seconds. Run it with `colcon test` as before. If the plain `launch_testing` unittest style from older tutorials fails to collect, use this `launch_pytest` form.

### Step 3: Prove the test can fail

Change the assertion to `received[0] >= 500` and run again. It must fail. Change it back. Do this for every test an agent writes.

### Step 4: Record a run

Start the counter, then record for a few seconds:

```bash
ros2 run cuprunner_tasks cup_counter &
ros2 bag record -o run1 -s mcap --topics /cafe/returned_cups
```

Stop the recording with Ctrl+C. In the checked run, five seconds gave six messages. Then:

```bash
ros2 bag info run1
```

The summary shows the storage id `mcap`, the ROS distribution `lyrical`, the duration, and a count per topic. To play it back, stop the live node first so only the recording publishes:

```bash
kill %1
ros2 bag play run1
```

Add `run1/` to `.gitignore`. Note the size with `du -sh run1`. For a real mission with a camera, a recording of one run can be many megabytes, so decide what you keep and for how long.

### Step 5: A pipeline sketch

A pipeline runs your tests on every push. This is a **sketch**. It was written from the CI documentation and the container's setup files and was not run on a real runner, so expect to adjust it.

```yaml
unit-and-launch-tests:
  image: ros:lyrical
  script:
    - apt-get update
    - apt-get install -y --no-install-recommends python3-pytest python3-numpy ros-lyrical-launch-pytest
    - . /opt/ros/lyrical/setup.sh
    - colcon build --packages-select cuprunner_interfaces cuprunner_tasks
    - colcon test --packages-select cuprunner_tasks
    - colcon test-result --verbose
```

It covers the unit and integration layers. It does **not** run the simulation. That layer is slow and heavy, so run it by hand, or on a schedule, and keep its evidence in git as text and a short recording. Say so in the README. A green pipeline that does not run the system test must not be described as "the robot works".

## 4. Worked example: TrailMug

TrailMug is fictional, and so is CupRunner. The numbers are invented.

The founder asks an agent for tests for the fetch server. It returns eight tests, all green. She reads them. Five check that a constant equals itself. One checks that the goal is accepted, and never asserts on the result. She changes a line in the server so that an empty `cup_id` is accepted. All eight tests stay green. That is the proof they are worthless.

She rewrites the brief: "One test must fail when an empty `cup_id` is accepted. One must fail when cancel is ignored. Show me each failing first." The next set has a test that sends an empty goal and asserts rejection, and one that cancels midway and asserts the message. She breaks the code in both places and watches both go red.

For the record she keeps a short run recording, as a bag outside git. In `docs/` she commits the `ros2 bag info` text and the checksum. A reviewer who wants the replay asks for the file.

## 5. Working with AI agents on this

**What the PDM decides.** Which behaviours must have a test, which tests gate a merge, and what evidence a release needs. Those are your rules, and they come from the risk, not from the code.

**What you delegate, and the exact brief.** Writing the tests, the recording commands and the pipeline file. Adapt this:

```text
Write pytest tests for the package cuprunner_tasks (ROS 2 Lyrical, Python).
Behaviour to test, each as its own test:
1. normalise_angle wraps 3*pi/2 to -pi/2.
2. The fetch_cup action server rejects an empty cup_id.
3. The fetch_cup action server stops and reports "cancelled" when cancelled.
Rules: use launch_pytest for any test that starts a node, never time.sleep for
synchronisation (wait with a deadline), no test may depend on another.
For each test, write one line saying which code change would make it fail.
Do not test constants. After the tests, list anything you were unsure about.
```

The "which code change would make it fail" line is the key. It forces the agent to think about the failure, and gives you something to try.

**How you verify.** Run `colcon test-result --verbose` and read the count. Break each behaviour on purpose and see the right test fail. Check that no test has an empty body, no assertion compares a value to itself, and no fixed sleep stands in for waiting. Read the pipeline file for secrets and for steps that quietly skip tests. In a recording, check the topics and the size before you store it.

**Which disciplines are involved.** Security asks what a recording or a log contains and who can read it. Operations owns the pipeline and its runners. Safety decides which tests are gates before anything reaches hardware. Privacy applies the moment a real camera records a person.

**Where this sits on the ladder.** You **delegate** test writing, with your behaviours as the acceptance criteria. A pipeline that runs the tests on every push, and a rule that red blocks the merge, is a first piece of **governing**: it keeps the work safe without you watching each change. The [Build, test and containers](/library/tracks/ci-cd/02-build-test-and-containers) lesson goes further.

**Disclose.** "AI use: first draft of the tests by an agent; I chose the behaviours and made each test fail on purpose." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Tests that cannot fail.** Break the code and see.
- **Zero tests run, reported as success.** Check the count and `extras_require`.
- **Fixed sleeps.** They pass on your machine and fail on a slower one. Wait with a deadline.
- **Everything is a system test.** It is slow and flaky. Push checks down to units.
- **Using an old recording command.** In Lyrical, topics go after `--topics`.
- **Committing a bag.** It is large and can hold private data. Commit a summary and a checksum.
- **Logging every cycle.** It hides the line that matters. Log decisions, not heartbeats.
- **Calling a green pipeline "it works".** Say which layers ran.

## 7. Practice: a test suite with evidence

**Deliverable:** these files in your repository.

1. Unit tests for `frames.py` and `vision.py`, and a `launch_pytest` test for one node. All pass under `colcon test`.
2. `docs/test-evidence.md`: the output of `colcon test-result --verbose`, plus for each test the one-line change that would make it fail, and proof that you tried it for at least two tests.
3. `docs/run-recording.md`: the `ros2 bag record` command you used, the `ros2 bag info` output, the size of the file, and a SHA-256 checksum. The bag itself is in `.gitignore`.
4. `.gitlab-ci.yml` (or the equivalent for your host) with the sketch above, adjusted. If you cannot run it, say so at the top.
5. `docs/agent-review.md`: the brief, a test you rejected and why, and one fault you found by breaking the code.

Add one change of your own: a test that fails when the fetch server ignores cancel.

**Check:** a reviewer can read `docs/test-evidence.md` and see that the suite can fail, what it covers, and what it does not.

## 8. Checklist

- [ ] I can draw the test pyramid and say what each layer cannot show.
- [ ] `colcon test-result --verbose` shows the number of tests I expect.
- [ ] I broke the code on purpose and the right test failed.
- [ ] The launch test waits with a deadline, not a fixed sleep.
- [ ] I recorded a run with `--topics`, read `ros2 bag info`, and played it back.
- [ ] No bag file is in git. A checksum and summary are.
- [ ] The pipeline sketch says which layers it runs and which it does not.
- [ ] My AI-use line is in the README.

## 9. Further learning

The official tutorial on writing basic tests in Python shows pytest in a ROS 2 package, and the tutorial on integration tests with launch testing shows how to start nodes inside a test. The tutorial on recording and playing back data covers `ros2 bag` in depth; check its version against Lyrical's `--topics` form. The ROS Docker image page lists the base you use in the pipeline. The GitLab pages on what CI/CD is and on creating your first pipeline explain the file format used in the sketch. Next, in [Capstone: map a room and fetch an object](/library/tracks/robot-software/07-capstone-map-a-room-and-fetch-an-object), you put all the lessons together.
