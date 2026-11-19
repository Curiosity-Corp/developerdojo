---
title: "Robot software"
description: "Write software for robots without owning one. Build ROS 2 programs, simulate a robot in Gazebo, map a room and navigate with Nav2, plan an arm motion with MoveIt 2, and test and log all of it in git."
group: "robotics"
order: 1
icon: "bot"
level: "core"
skills: [robot-software, robotics-manufacturing, ai-agents, git-gitlab, ci-cd]
outcomes:
  - "Build ROS 2 nodes, topics, services and actions in Python and run them from a launch file"
  - "Simulate a robot in a virtual room with Gazebo and read its camera in your own code"
  - "Map a room with SLAM, then send a Nav2 robot to a goal and read the result"
  - "Plan an arm motion with MoveIt 2 and see it refuse a path that hits a box"
  - "Test robot code, record every run, and show the evidence in your own git repository"
---

## In short

This track teaches you to write software for robots. You do it in simulation, on an ordinary laptop, with free tools. You will build small robot programs in ROS 2. You will run a virtual café in Gazebo. You will make a robot map a room and drive across it. You will plan an arm motion that avoids a box. You will test your code and keep a recording of every run. All of it lives in your own git repository.

An AI agent can write much of this code fast. It often suggests commands from older versions that no longer work. So you check each answer against the tools you installed. On the agent ladder, you delegate the code. You keep the decisions about what is safe and what counts as done.

### Key words

- **ROS 2:** An open-source toolkit and message system for building robot software.
- **Gazebo:** An open-source simulator that models a robot, its sensors and its world.
- **Nav2:** The ROS 2 software that plans routes and drives a mobile robot.
- **MoveIt 2:** The ROS 2 software that plans arm motions and avoids collisions.
- **Coordinate frame:** A named origin and set of axes used to say where things are.
- **Agent ladder:** Four rungs of skill with AI agents: use, delegate, orchestrate and govern. Each rung needs different skills.

A robot is a computer that moves. Most of the work is not the motion. It is the software around it: messages between programs, a model of the world, tests that run without a robot, and logs that show what happened. This is the layer that a Product Development Manager must be able to read, direct and check.

You do not need a robot to learn it. The robot in this track is a **simulated** one, in a virtual room, running on your laptop. That is how real teams also work first, because a simulated robot is cheap, safe and can be reset in a second.

## Who this track is for

This track is for you if you want to build or direct robot software. You may be a developer who has never touched a robot, an engineer from another field, or a product person who must judge robot work. You should be able to write a short Python program and use a command line. Lesson 1 refreshes both.

It is not a course in electronics, motor control or building hardware. DeveloperDojo does not offer robots, labs or hardware, and nothing here needs them.

## What you will be able to do

By the end of the track you will be able to:

- Set up a repeatable robot software environment in a container, from a file in git.
- Write ROS 2 nodes in Python, define your own message and action, and start them from a launch file.
- Describe a world in a text file, run it in Gazebo, and read the simulated camera and sensors in your own code.
- Build a map of a room with SLAM, save it, and send the robot to a goal with Nav2.
- Plan an arm motion with MoveIt 2, add an obstacle, and read why a plan fails.
- Write tests for robot code at three levels, and record runs so another person can replay them.
- Run a mission end to end, show the evidence, and say honestly what the simulation does not prove.

## How the seven lessons build

1. **[Linux and Python for robots](/library/tracks/robot-software/01-linux-and-python-for-robots).** You build a container with ROS 2, learn the shell and Python habits you need, and write your first tested function in the right units.
2. **[ROS 2 nodes, topics, services and actions](/library/tracks/robot-software/02-ros-2-nodes-topics-services-and-actions).** You write a node, a custom action and a launch file, and learn to inspect a running system from the command line.
3. **[Simulate a robot in Gazebo](/library/tracks/robot-software/03-simulate-a-robot-in-gazebo).** You describe a café room, add a camera to a simulated robot, and write a node that finds an orange cup in the picture.
4. **[Mapping and navigation with Nav2](/library/tracks/robot-software/04-mapping-and-navigation-with-nav2).** The robot maps the room with SLAM. You save the map and send the robot to goals from a Python script.
5. **[Manipulation with MoveIt 2](/library/tracks/robot-software/05-manipulation-with-moveit-2).** You plan arm motions for a model arm, add an obstacle and read the planner's refusal.
6. **[Test and log robot software](/library/tracks/robot-software/06-test-and-log-robot-software).** You build a small test pyramid, record a run with rosbag, and sketch a pipeline that runs the tests.
7. **[Capstone: map a room and fetch an object](/library/tracks/robot-software/07-capstone-map-a-room-and-fetch-an-object).** You put it all together, show evidence in git, and get your work reviewed.

Each lesson has the same shape: why it matters, key ideas, step by step, a worked example with the fictional product **TrailMug** (here a café robot that collects returned cups), how to work with AI agents, common mistakes, a practice exercise that ends in a file in git, and a checklist.

## What you need

Be honest with yourself about the machine. The lessons were checked on Linux, in a container, with no GPU and no screen attached.

- **A computer that can run containers.** Linux is the smoothest. The lessons use Docker or Podman and the official `ros:lyrical` image. The track was not tested on Windows or macOS. Docker Desktop and the Windows Subsystem for Linux exist, but graphics windows and networking behave differently there. Do the work headless, as the lessons do, and expect to debug your own setup.
- **Disk and memory.** The tool image is large. Plan on about 6 GB of disk for it, plus space for builds. Gazebo with a camera is the heaviest part, so close other programs. Eight gigabytes of memory is a reasonable floor; more is better.
- **No GPU needed.** Every lesson runs on the CPU with software rendering, headless. It is slower than on a GPU. A GPU helps the visual parts, such as a larger world or a faster camera. You can finish the track without one.
- **A free cloud option.** If your laptop cannot cope, a free hosted Linux environment with a terminal and Docker support can work. Check that it allows containers and enough disk before you start. Free tiers change, so this track names no service.
- **Free accounts.** A GitLab or GitHub account for your own repository. Nothing else.
- **Software versions.** The lessons use **ROS 2 Lyrical Luth**, a long-term-support release, with **Gazebo Jetty**. If your team still uses an older pair, the ideas carry over, but commands and package names will differ. Lesson 1 says how to check.

All the software in the track is open source and free to use. Each lesson names the licences that matter and what they allow. Some parts are LGPL or Apache 2.0, which differ in what you must do if you ship them. That is a legal question, so ask your own legal adviser before you sell anything built on them.

## Time needed

Plan about three to four hours per lesson, and longer for lessons 3 to 5, because the first build and the first simulation run take real minutes. The capstone takes a day. Set aside about three weeks of part-time work for the whole track.

## What the 2030 Product Development Manager does here

Four jobs stay with you:

- **Decide what the robot must do, and what safe means.** You write the mission, the limits and the acceptance criteria. An agent can write code to a spec, but it cannot tell you which speed, which distance or which failure is acceptable.
- **Decide what counts as evidence.** You say what a run must show before you believe it: a recording, a test result, a number with its units.
- **Check what the simulation cannot show.** A simulator has no worn wheels, no sensor noise from a real floor and no people walking by. You say what is not proven.
- **Own the release.** When someone asks "does it work?", your name is behind the answer.

Agents are a fast workforce for the code. They write nodes, launch files, tests and configuration. They also suggest old commands, mix up versions and write confident code that fails on first run. **Robot code an agent wrote is a draft until you have run it, tested it and read the result.** Lyrical is new, so this risk is higher than usual.

Other disciplines are in the room. Mechanical and electrical engineers care about what the real robot can carry and sense. Safety and legal staff care about people near moving machines. Operations cares about who restarts it at night. Security cares about what the robot's network exposes. See the lessons on [reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output) and [securing agent work](/library/tracks/security-fundamentals/04-securing-agent-work).

## How it maps to the Dojo

- **Git and GitLab.** Every lesson ends with files in your own repository. The [Git and GitLab track](/library/tracks/git-and-gitlab/01-git-mental-model) shows you how to commit and review them. If you are new to git, start there.
- **CI/CD.** Lesson 6 sketches a pipeline that runs your robot tests. The [CI/CD track](/library/tracks/ci-cd/01-pipelines-from-first-principles) explains the ideas behind it.
- **Working with AI agents.** Each lesson names a rung of the agent ladder. The [agent track](/library/tracks/working-with-ai-agents) teaches the skills in depth.
- **Safety, reports and review.** Before you call the capstone done, read [Safety, reports and review](/library/tracks/safety-reports-and-review). Its review habits are the ones a reviewer will use on your work.
- **Robot learning.** The next step, [Robot learning](/library/tracks/robot-learning), adds a learned policy to the kind of system you build here.
- **Developer and Master Developer programs.** The capstone is a Product Package piece. It shows that you can specify, direct, test and explain a robot system.

## Before you begin

Create an empty git repository for the track, named for example `robot-software-practice`. Each lesson saves files in a folder there. Read [Disclose AI use](/library/disclose-ai-use) first: every file you make with an agent's help carries a short note saying so.
