---
title: "Linux and Python for robots"
description: "Build a repeatable robot software environment in a container, learn the shell and Python habits that robot code needs, and write your first tested function in the units robots use."
section: "Robot software"
order: 1
track: "robot-software"
level: "foundation"
duration: "3 hours"
outcomes:
  - "Build and run a ROS 2 container from a Dockerfile in git, and prove it works with a two-program test"
  - "Use the shell to find files, read logs and run programs, and say which directory you are working in"
  - "Write a small Python function with type hints and a pytest test in the units robots use"
  - "Explain why a robot library stores metres, radians and seconds, and convert at the edge"
  - "Keep a clean git repository for robot code, with build output left out"
resources:
  - "ros/installation"
  - "ros/setting-up-your-environment"
  - "docker/ros-official-image"
  - "docker/get-started"
  - "mit-ocw/missing-semester"
  - "python/the-python-tutorial"
  - "ros/rep-103-standard-units-and-coordinate-conventions"
prerequisites:
  - "disclose-ai-use"
  - "tracks/git-and-gitlab/01-git-mental-model"
updated: 2026-11-19
---

**Supports:** the Robot software track, and every later lesson that runs code. In the Developer program it supports the repository habits of weeks 1 to 4. **Time:** about three hours, plus the time your machine needs to download a large image.

## 1. Why this matters

Robot software breaks in ways that ordinary software does not. It depends on many programs that must start in the right order, on exact versions of many packages, and on numbers whose meaning is easy to lose. A turn of "90" may be 90 degrees or 90 radians. A distance of "2" may be metres or feet. A robot does not complain. It moves.

Two habits remove most of this pain. First, **build the environment from a file**, so that you, a reviewer and a pipeline all run the same tools. Second, **fix the units and write them into tests**, so that a wrong number fails on a laptop and not on a robot.

For a Product Development Manager (PDM) this is a control skill. You will not type every command. You must be able to tell whether the environment an agent built is the one you asked for, and whether the numbers in a program mean what the mission says.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which software versions the team builds on, the units, and what "works on my machine" must mean | Writing the Dockerfile, the `.gitignore`, and the first test | The image builds from nothing, the smoke test passes, and no secret or build output is in git | Security (what the image pulls in), operations (who maintains the image), safety (units that match the hardware later) |

## 2. Key ideas

### ROS 2 and the distribution

**ROS 2** is an open-source toolkit and message system for building robot software. It is not an operating system. It is a set of libraries and tools that let many small programs talk to each other. ROS 2 comes in named releases called **distributions**. This track uses **Lyrical Luth**, which the ROS release page marks as a long-term-support release, supported until May 2031. Always check the official install page for the version to use today.

New releases have a cost. Agents were trained on older material, so an agent may suggest a command from an older distribution. In this track that is a real risk, and every lesson says how to check.

### Why a container

ROS 2 binary packages are built for a specific Ubuntu version. A container lets you run that Ubuntu on almost any Linux laptop, without changing your own system. The ROS project publishes an official `ros` image on Docker Hub, and the `ros:lyrical` image is the starting point here. It already includes ROS 2 base packages and the build tools. You add the simulator and the navigation and arm-planning packages on top.

A container is not a virtual machine with a screen. It shares your computer's kernel. You work in a terminal inside it. This track runs everything without a graphics window.

### The shell, in six commands

The shell is where you run ROS 2. You need only a few commands to start:

| Command | What it does |
|---|---|
| `pwd` | Shows which directory you are in |
| `ls -la` | Lists files, including hidden ones |
| `cd folder` | Moves into a folder |
| `cat file` | Prints a file |
| `grep -rn "word" .` | Finds text in files under the current folder |
| `source file` | Runs a script in the current shell, so it can set variables |

`source` matters most. ROS 2 sets its paths with `source /opt/ros/lyrical/setup.bash`. A new terminal does not remember it. If a command says `ros2: command not found`, you probably did not source it.

### Python habits for robot code

Most robot code in this track is Python, which is the easiest way to learn ROS 2 and enough for nodes that are not time-critical. Three habits help:

- **Type hints.** Write `def normalise_angle(angle: float) -> float:`. A reader, a checker and an agent all learn what goes in and out.
- **Small pure functions.** A function that takes numbers and returns numbers can be tested in a millisecond, with no robot and no ROS running. Put the maths there.
- **Tests with pytest.** A test is a function that fails when the code is wrong. You will run hundreds of them in lesson 6. Start with three.

The ROS 2 Python packages use the Python that ships with the system. Install libraries with the system package manager when there is a `python3-` package, and keep the number of extra libraries small. This track needs only NumPy and pytest.

### Units and frames

ROS 2 follows a written convention, **REP 103**, for units and axes. Lengths are in metres, angles in radians, time in seconds. Axes are right-handed. For a robot body, **x points forward, y points left and z points up**. A positive turn is anticlockwise when you look down from above.

A **coordinate frame** is a named origin and set of axes used to say where things are. "The cup is at 2 metres" means nothing until you say 2 metres from which frame. Lesson 3 and lesson 4 use frames all the time. For now, remember the rule: **numbers inside your code are in REP 103 units. Convert at the edge, when a person types or reads a value.**

## 3. Step by step

### Step 1: Make a repository

```bash
mkdir robot-software-practice && cd robot-software-practice
git init
```

Add a `.gitignore` now. ROS builds write three folders that must never be committed:

```gitignore
build/
install/
log/
__pycache__/
.pytest_cache/
*.mcap
*.db3
```

The last two lines keep large recordings out of git. Lesson 6 explains why.

### Step 2: Write the Dockerfile

A Dockerfile is a recipe for the image. This one starts from the official image and adds the packages the whole track uses. The package names were resolved against the `ros:lyrical` image; if one fails to install, the official docs are the authority.

```dockerfile
FROM ros:lyrical

RUN apt-get update && apt-get install -y --no-install-recommends \
    ros-lyrical-ros-gz \
    ros-lyrical-navigation2 \
    ros-lyrical-nav2-bringup \
    ros-lyrical-nav2-minimal-tb3-sim \
    ros-lyrical-slam-toolbox \
    ros-lyrical-xacro \
    ros-lyrical-robot-state-publisher \
    ros-lyrical-moveit \
    ros-lyrical-moveit-py \
    ros-lyrical-moveit-resources-panda-moveit-config \
    ros-lyrical-launch-pytest \
    ros-lyrical-rosbag2-storage-mcap \
    ros-lyrical-tf2-tools \
    ros-lyrical-demo-nodes-py \
    python3-pytest \
    python3-numpy \
    python3-pil \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /work
```

Expect a long first build. The packages add over a thousand dependencies and the image is several gigabytes. Build it once:

```bash
docker build -t robot-software .
```

Podman works the same way. Replace `docker` with `podman` in every command in this track.

### Step 3: Run the container

```bash
docker run -it --rm --network=host -v "$PWD":/work robot-software
```

Each part matters. `--rm` deletes the container when you leave, so your files must live outside it. `-v "$PWD":/work` shares your repository into the container. `--network=host` lets ROS programs find each other. On Linux this is simple. On Docker Desktop for Windows or macOS it behaves differently, and this track was not tested there.

One more point about files. With Docker, programs inside the container run as `root`, so files they create in your repository are owned by root. With rootless Podman they are owned by you. If this bothers you, add `--user "$(id -u):$(id -g)"` and expect some tools to complain about the home folder.

### Step 4: Check the environment

Inside the container:

```bash
printenv ROS_DISTRO
python3 --version
```

You should see `lyrical` and a Python 3 version. The ROS image sets up the environment for you. Sourcing it again does no harm:

```bash
source /opt/ros/lyrical/setup.bash
```

### Step 5: The two-program test

Prove that programs can talk. ROS 2 ships a demo talker and listener. Pick a domain number so you do not hear other people's robots on a shared network. Then start the talker in the background and the listener in the foreground:

```bash
export ROS_DOMAIN_ID=42
ros2 run demo_nodes_py talker > /dev/null 2>&1 &
timeout -s INT 4 ros2 run demo_nodes_py listener
```

You should see lines such as `I heard: [Hello World: 2]`. Stop the talker with `kill %1`. Save what you saw in `docs/smoke-test.txt`. That file is your first piece of evidence.

### Step 6: Write a function and a test

Create the folders and the first module:

```bash
mkdir -p src/cuprunner_tasks/cuprunner_tasks src/cuprunner_tasks/test
touch src/cuprunner_tasks/cuprunner_tasks/__init__.py
```

`src/cuprunner_tasks/cuprunner_tasks/frames.py`:

```python
"""Small helpers that follow REP 103: metres, radians, seconds, right-handed axes."""

import math


def degrees_to_radians(degrees: float) -> float:
    """Convert degrees to radians. Do this at the edge, then stay in radians."""
    return math.radians(degrees)


def normalise_angle(angle: float) -> float:
    """Wrap an angle in radians into the range [-pi, pi)."""
    return (angle + math.pi) % (2.0 * math.pi) - math.pi


def yaw_to_quaternion(yaw: float) -> tuple[float, float, float, float]:
    """Turn a turn about the z axis (radians) into a quaternion (x, y, z, w)."""
    return (0.0, 0.0, math.sin(yaw / 2.0), math.cos(yaw / 2.0))
```

A **quaternion** is the four-number form ROS uses for a rotation. You need only the z-axis case for a robot that drives on a floor.

`src/cuprunner_tasks/test/test_frames.py`:

```python
import math

import pytest

from cuprunner_tasks.frames import degrees_to_radians, normalise_angle, yaw_to_quaternion


def test_degrees_to_radians() -> None:
    assert degrees_to_radians(180.0) == pytest.approx(math.pi)


def test_normalise_angle_wraps() -> None:
    assert normalise_angle(3.0 * math.pi / 2.0) == pytest.approx(-math.pi / 2.0)
    assert normalise_angle(-3.0 * math.pi / 2.0) == pytest.approx(math.pi / 2.0)


def test_quarter_turn_points_along_y() -> None:
    # REP 103: x forward, y left, z up. A positive quarter turn about z turns x into y.
    x, y, z, w = yaw_to_quaternion(math.pi / 2.0)
    assert (x, y) == (0.0, 0.0)
    assert z == pytest.approx(math.sqrt(0.5))
    assert w == pytest.approx(math.sqrt(0.5))
```

Run it from the package folder:

```bash
cd src/cuprunner_tasks && python3 -m pytest -q
```

Three tests should pass. Then commit.

## 4. Worked example: TrailMug

TrailMug is fictional. It makes reusable cups for cafés. In this track the founder imagines a small robot, which the team calls **CupRunner**, that collects returned cups from a shelf and brings them to the counter. Nothing here is a real product. Every robot in this track is simulated, and every number in the example is invented for teaching.

The team's first week is not about the robot. It is about the repository. The founder asks an agent for a Dockerfile and a turning helper. The agent returns a file that starts from `ros:jazzy`, an older release, because that is what it learned from. It also writes a function `turn(angle)` with no unit in the name or the comment. The founder does three things.

- She reads the first line of the Dockerfile and compares it with the release the team chose. The mismatch is obvious. She changes it to `ros:lyrical` and builds from nothing.
- She renames the function to `degrees_to_radians` and writes a test that says 180 degrees is pi radians. A reviewer can now see the unit.
- She commits the Dockerfile, the `.gitignore`, the test and a smoke-test result, and writes in the README which release and which commands were checked.

The decision to use Lyrical, and the rule that code stores radians, are hers. The Dockerfile and the function body are the agent's. The test is the proof that connects them.

## 5. Working with AI agents on this

**What the PDM decides.** The distribution and version the team builds on, the unit rules, what the environment must contain and what must stay out of git.

**What you delegate, and the exact brief.** The Dockerfile, the `.gitignore` and the first tests are good first tasks for an agent. You use one agent, one step at a time, and read each result. Adapt this brief:

```text
Write a Dockerfile for a ROS 2 development image.
Base image: ros:lyrical (ROS 2 Lyrical Luth, Ubuntu). Do not use any other release.
Install with apt only, from the ros-lyrical-* packages, the following: <your list>.
Rules: one RUN layer for apt, remove /var/lib/apt/lists afterwards,
no secrets, no curl-pipe-to-shell, WORKDIR /work.
Also write .gitignore entries for build/, install/, log/ and recordings.
Output: the two files only. After them, list every package you were unsure
exists in Lyrical, so I can check it. Do not invent package names.
```

The last line matters. An agent that knows an older release will invent a plausible name. Asking it to list its doubts gives you a short list to check.

**How you verify.** Build the image from nothing, in a clean folder, and read the first line. Run the two-program test and keep the output. Run `apt list --installed 2>/dev/null | grep ros-lyrical | head` and check that the packages you asked for are present. Read every line of the Dockerfile and ask: why is this here? Check the test file: does each assertion state a unit? Run `git status` and make sure `build/`, `install/` and `log/` are not tracked.

**Which disciplines are involved.** Security cares about what the base image and each package pull in; the [Securing the pipeline](/library/tracks/ci-cd/04-securing-the-pipeline) lesson covers supply chain checks. Operations decides who rebuilds the image when a patch lands. Safety and mechanical engineering will later need the units to match the real robot's documentation.

**Where this sits on the ladder.** You **use** an agent: one task, your eyes on every line. The next rung is **delegate**, where you hand over a whole task with acceptance criteria. Later in the track you will do that, and the tests you write here become the acceptance criteria.

**Disclose.** If an agent wrote or changed any file, add a line to the README: "AI use: Dockerfile first draft by an agent; I checked the base image, built it from nothing and wrote the tests." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Committing `build/`, `install/` or `log/`.** They are large, change on every build and hide the real changes. Put them in `.gitignore` before the first commit.
- **Forgetting to `source` ROS 2.** The symptom is `command not found` for `ros2`. Source the setup file again.
- **Mixing releases.** A command from an older release may fail or silently behave differently. Check the release name in every snippet you copy.
- **Units with no name.** `speed = 0.5` is a bug waiting. Put the unit in the name or a comment: `speed_m_per_s`.
- **Degrees inside the code.** Convert at the edge and keep radians inside.
- **Working inside a container and losing the files.** With `--rm`, anything outside the shared folder is gone when you exit.
- **Sharing a network without a domain id.** Your programs may talk to someone else's. Set `ROS_DOMAIN_ID`.
- **Trusting "it built".** A build can pass while a package is missing at run time. Run the smoke test.

## 7. Practice: a repository that rebuilds from nothing

**Deliverable:** a git repository named for example `robot-software-practice`, with at least three commits, that a stranger can clone and use.

1. `Dockerfile` and `.gitignore` as in the steps above.
2. `README.md` with: what the repository is, the release you use (`ROS 2 Lyrical Luth`), the exact build and run commands, your operating system, and your AI-use line.
3. `docs/smoke-test.txt` with the talker and listener output.
4. `src/cuprunner_tasks/cuprunner_tasks/frames.py` and `src/cuprunner_tasks/test/test_frames.py`. Add one more test of your own, for example a negative angle that wraps.
5. `docs/agent-review.md`: the brief you gave an agent, what you changed in its answer, and one thing it got wrong or doubted.

Commit after each step, with messages that say why. Then ask a friend, or a second terminal in a clean folder, to clone the repository and follow your README. If any step fails, fix the README.

**Check:** the pytest run shows all tests passing, and `git status` shows a clean tree with no `build/`, `install/` or `log/`.

## 8. Checklist

- [ ] The image builds from nothing and the first line names `ros:lyrical`.
- [ ] `printenv ROS_DISTRO` shows `lyrical` inside the container.
- [ ] The talker and listener test ran, and its output is in `docs/smoke-test.txt`.
- [ ] `.gitignore` leaves out `build/`, `install/`, `log/` and recordings.
- [ ] Every function that takes or returns a physical quantity says its unit, and a test checks it.
- [ ] All tests pass with `python3 -m pytest`.
- [ ] The README has the exact commands and my AI-use line.
- [ ] I read every line the agent wrote before I committed it.

## 9. Further learning

The official ROS 2 install page compares the ways to install ROS 2 and links to the guide for each platform, so you can move off the container later. Its page on setting up your environment explains sourcing and domain ids. The official ROS image page on Docker Hub lists the tags and says what the image contains. The Docker getting-started guide teaches images and containers from scratch. The MIT "Missing Semester" course is a free set of lectures on the shell, git and the other tools developers use daily. The Python tutorial is the best free reference for the language. REP 103 is the short standard behind the units and axes used in this lesson. Next, in [ROS 2 nodes, topics, services and actions](/library/tracks/robot-software/02-ros-2-nodes-topics-services-and-actions), you write your first nodes.
