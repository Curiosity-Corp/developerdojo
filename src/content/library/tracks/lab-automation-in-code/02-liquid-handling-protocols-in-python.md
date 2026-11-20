---
title: "Liquid-handling protocols in Python"
description: "Write a protocol for the Opentrons Python Protocol API, pick the right apiLevel for a Flex or an OT-2, use transfer, distribute and consolidate, then check it in the simulator and read the run log."
section: "Lab automation in code"
order: 2
track: "lab-automation-in-code"
level: "core"
duration: "3 hours"
outcomes:
  - "Write a protocol with metadata, requirements, labware, a pipette and liquid-handling commands"
  - "Choose robotType and apiLevel, and say why a Flex and an OT-2 differ"
  - "Use transfer, distribute and consolidate, and say what each one does with tips"
  - "Simulate a protocol, read the run log and tell the real steps from the summary lines"
  - "Turn a simulator run into an automatic test in git"
resources:
  - "opentrons/python-protocol-api-documentation"
  - "opentrons/python-api-tutorial"
  - "opentrons/python-api-complex-commands"
  - "opentrons/python-api-executing-and-simulating"
  - "opentrons/ot-2-importing-protocols"
prerequisites:
  - "tracks/lab-automation-in-code/01-biosafety-basics-before-you-automate"
  - "disclose-ai-use"
updated: 2026-11-19
---

**Supports:** this track, and the Developer path (tests and a pipeline for anything that drives hardware). **Time:** about three hours. **Simulation only:** nothing in this lesson runs on a robot.

## 1. Why this matters

A liquid-handling robot does what its protocol says, every time, without asking. That is why a protocol must be checked before it runs. A wrong volume or well is not a typing mistake. It is a ruined plate, or worse.

Opentrons publishes an open Python interface for its robots, the **Python Protocol API**, and a free simulator. A protocol is a Python file, so you can keep it in git, review it, test it in a pipeline and have an agent draft it. The simulator runs your protocol on a computer, with no robot, and prints each step the robot would take. You read that log before anything else.

By the end you will have a protocol that mixes three dyes in a plate, a log you can read, and a test that fails when the protocol breaks. In lesson 6 a program writes one such protocol per round.

Remember lesson 1. A clean simulation means the commands are valid. It does not mean the protocol is safe.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the protocol must do, which robot and API level it targets, and what counts as a correct run | Drafting the protocol code and its test, from a written brief | The simulator log, line by line, against the brief; that the API level and labware names exist in the current docs | The lab's supervisor (real runs), a biosafety officer, security (who may change a protocol) |

## 2. Key ideas

### A protocol is a Python file with a fixed shape

Every protocol has three parts.

1. **`metadata`**: a dictionary of names and notes, such as `protocolName` and `author`.
2. **`requirements`**: a dictionary with the robot type and the API level.
3. **`run`**: a function that receives a `ProtocolContext`, usually called `protocol`. Everything the robot does happens inside it.

### robotType and apiLevel

The **API level** is the version of the Protocol API your file is written for. Opentrons states two rules in its docs. Declare the level in one place only: in `requirements` (from version 2.15 on) or in `metadata`. If you put it in neither, or in both, the protocol will not simulate or run. And a robot can only run a protocol whose level its software supports. A lower level runs on more software versions.

The **robot type** is `"Flex"` or `"OT-2"`. For the Flex you must say so in `requirements`. For the OT-2 it is optional.

The ceilings change with each software release. The docs list these ranges for robot software 10.0.0:

| Robot | API levels |
|---|---|
| Flex | 2.15 to 2.30 |
| OT-2 | 2.0 to 2.28 |

Check the current versioning page before you pick a level. Do not copy a number from this lesson or from an agent.

There is one practical catch. The `opentrons` package on PyPI, version 10.1.0 when this was written, simulated a Flex protocol at level 2.30. It refused an OT-2 protocol, with an error saying the protocol was designed for an OT-2 robot. An older release, 9.0.0, simulated the OT-2 file. If you target an OT-2, check which package version supports it.

### Labware, pipettes and the deck

- **Labware** is anything that holds liquid or tips: a tip rack, a reservoir, a well plate. You load it with `protocol.load_labware(name, slot)`. The name is an exact string from the Opentrons labware library, such as `nest_96_wellplate_200ul_flat`. A typo is an error.
- **Slots** are named differently on the two robots. The Flex uses `A1` to `D3`. The OT-2 uses numbers `1` to `11`.
- **A pipette** is loaded with `protocol.load_instrument(name, mount, tip_racks=[...])`. The name must match the pipette, such as `flex_1channel_1000` on a Flex or `p300_single_gen2` on an OT-2.
- **A trash bin.** The Flex example below loads one with `protocol.load_trash_bin("A3")`, so the pipette has somewhere to drop tips.

Wells are addressed like a spreadsheet: `plate["A1"]` is one well, `plate.columns()[0]` is column 1 from A to H, and `plate.rows()[0]` is row A.

### Three liquid-handling commands

The API has simple commands, such as `aspirate` and `dispense`. It also has three **complex commands** that wrap many of them. These are the ones you will use most.

| Command | What it does | Typical use |
|---|---|---|
| `transfer` | Moves a volume from one place to another, one source to one destination, or in lists | One dye into one well |
| `distribute` | Takes liquid from one source and dispenses it to many destinations | Water into a whole column |
| `consolidate` | Takes liquid from many sources and dispenses it to one destination | Pooling wells into one |

Two settings matter. **`new_tip`** says when to change tips: `"once"`, `"always"` or `"never"`. For different liquids, use `"always"`, or one dye carries into the next. **`mix_after=(3, 40)`** mixes three times with 40 microlitres in the destination well after dispensing.

If the total is more than one tip can hold, these commands split the job into several trips. `distribute` also keeps a small **disposal volume** in the tip and blows it out afterwards. The log in the worked example shows it.

A `volume` may be a single number or a list, one per destination. That is how a program can give each well its own recipe. You use that in lesson 6.

### Simulate: what it shows and what it does not

You run the simulator on your own computer:

```bash
opentrons_simulate protocol.py
```

You can also run it as a module with `python -m opentrons.simulate protocol.py`, which is useful inside a test. Both print a **run log**: one line per action, indented to show what belongs to what. A protocol that works exits with code 0. A failing one prints an error and exits with a non-zero code.

The simulator tells you that the file loads, the API level is accepted, names exist, slots do not clash and every command is valid. The log shows which tip, source, destination and volume each step uses.

The simulator does not tell you that the liquid behaves as you hope, that the volumes suit your assay, that a person can safely load and clear the machine, or that the real robot has the labware, calibration and software the protocol expects.

The Opentrons App also **analyses** a protocol when you import it. The OT-2 docs say it turns the file into robot commands and warns you about errors. Treat that as a second check. You do not need the app for this track.

### Set up one environment for the whole track

Make a virtual environment and install the packages for the whole track in one command. Later lessons add Ax and BoTorch. If you install them in a second step, the installer may change the version of `numpy` and break the Opentrons simulator. The error looks like `cannot import name 'trapz' from 'numpy'`. One command lets the installer find versions that work together.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install opentrons ax-platform matplotlib pytest
```

The code in this track was tested with `opentrons` 10.1.0, `ax-platform` 1.3.1, BoTorch 0.18.1 and Python 3.12. Ax asks for Python 3.11 or newer. With newer versions, expect small changes.

## 3. Step by step

1. **Pick the robot and the level.** Write them in `requirements`. Check the versioning page for the current range.
2. **Write the metadata.** Add "Simulation only" until a supervisor approves a real run.
3. **Load the labware** with exact names from the labware library, each in its own slot.
4. **Load the pipette** and give it the tip rack.
5. **Write the steps** with `transfer`, `distribute` and `consolidate`. Set `new_tip` on purpose.
6. **Simulate.** If it fails, read the last line of the error first.
7. **Read the log.** Check each volume, well and tip against what you meant. Count the tips.
8. **Save the log and write a test** that simulates every protocol in the folder.
9. **Commit** the protocol, the log and the test together.

## 4. Worked example: three dyes in one plate

Here is a Flex protocol for the colour-mixing lab. It fills column 1 with water, adds three dyes to well A2 one at a time, and pools three wells into another. It uses made-up dye names and no real liquids. It is simulation only.

```python
from opentrons import protocol_api

metadata = {
    "protocolName": "Three dyes, one plate",
    "author": "A. Learner",
    "description": "Water, three dyes and a pooled well. Simulation only.",
}

requirements = {"robotType": "Flex", "apiLevel": "2.30"}


def run(protocol: protocol_api.ProtocolContext):
    # Labware. Flex deck slots are named A1 to D3.
    tips = protocol.load_labware("opentrons_flex_96_tiprack_200ul", "D1")
    reservoir = protocol.load_labware("nest_12_reservoir_15ml", "D2")
    plate = protocol.load_labware("nest_96_wellplate_200ul_flat", "D3")
    protocol.load_trash_bin("A3")

    # Pipette: single-channel, 5 to 1000 uL, on the left mount.
    pipette = protocol.load_instrument("flex_1channel_1000", "left", tip_racks=[tips])

    column = plate.columns()[0]  # A1 to H1, top to bottom

    # One source, many wells: one tip, one aspirate per refill.
    pipette.distribute(90, reservoir["A1"], column)

    # One dye into one well, a fresh tip for each dye, then mix.
    for dye_well in ("A2", "A3", "A4"):
        pipette.transfer(
            20,
            reservoir[dye_well],
            plate["A2"],
            new_tip="always",
            mix_after=(3, 40),
        )

    # Many sources, one well: pool three wells into one.
    pipette.consolidate(30, [plate["A1"], plate["B1"], plate["C1"]], plate["D2"])
```

Run `opentrons_simulate mix_dyes.py`. It exits with code 0 and prints 66 lines. The first two say that a settings file and belt calibration were not found and defaults load. That is normal on a computer with no robot. Then each command prints a summary line at the left margin, with its steps indented below:

```text
Distributing 90.0 from A1 of NEST 12 Well Reservoir 15 mL on slot D2 to A1 of NEST 96 Well Plate 200 µL Flat on slot D3
	Transferring 90.0 from A1 of NEST 12 Well Reservoir 15 mL on slot D2 to A1 of NEST 96 Well Plate 200 µL Flat on slot D3
		Picking up tip from A1 of Opentrons Flex 96 Tip Rack 200 µL on slot D1
		Aspirating 185.0 uL from A1 of NEST 12 Well Reservoir 15 mL on slot D2 at 716.0 uL/sec
		Dispensing 90.0 uL into A1 of NEST 96 Well Plate 200 µL Flat on slot D3 at 716.0 uL/sec
		Dispensing 90.0 uL into B1 of NEST 96 Well Plate 200 µL Flat on slot D3 at 716.0 uL/sec
		Blowing out into Trash Bin on slot A3 at 716.0 uL/sec
```

Look at the numbers. You asked for 90 microlitres per well. The robot aspirates 185. That is two doses of 90 plus 5 for the disposal volume. Then it dispenses 90 twice and blows out the rest. Eight wells need four such trips. Someone who reads only the protocol would not see this. Someone who reads the log does.

Each dye step shows `Picking up tip` and `Dropping tip`, because `new_tip="always"`. The mixing shows three aspirate and dispense pairs of 40 microlitres. The last block pools: three aspirates of 30 from A1, B1 and C1, then one dispense of 90 into D2.

Now break it on purpose. Change the plate name to `nest_96_wellplate_200ul_flatt`. The simulator stops and prints:

```text
ProtocolCommandFailedError [line 16]: Error 4000 GENERAL_ERROR (ProtocolCommandFailedError): PythonException: FileNotFoundError: Labware "nest_96_wellplate_200ul_flatt" not found with version 1 in namespace "opentrons".
```

Put a second plate in slot D3 and you get:

```text
ProtocolCommandFailedError [line 17]: Error 4000 GENERAL_ERROR (ProtocolCommandFailedError): LocationIsOccupiedError: Labware nest_96_wellplate_200ul_flat is already present at slotName=<DeckSlotName.SLOT_D3: 'D3'>.
```

Each error names the line and the cause. Agents make exactly these mistakes, and the simulator catches them in a second.

Finally, a test. Save it as `tests/test_protocols.py` beside a `protocols/` folder:

```python
import subprocess
import sys
from pathlib import Path

PROTOCOLS = sorted(Path(__file__).parent.parent.glob("protocols/*.py"))


def simulate(protocol: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, "-m", "opentrons.simulate", str(protocol)],
        capture_output=True,
        text=True,
        check=False,
    )


def test_there_is_a_protocol() -> None:
    assert PROTOCOLS, "no protocols found"


def test_every_protocol_simulates() -> None:
    for protocol in PROTOCOLS:
        result = simulate(protocol)
        assert result.returncode == 0, f"{protocol.name} failed:\n{result.stderr}"

```

Run `pytest`. Both tests pass. You can also read `result.stdout` in a test and check a fact that matters, such as the volume in the pooled well. That tests the plan, not only the syntax.

### If you have an OT-2

The same protocol for an OT-2 uses numeric slots, a different tip rack and pipette, and no trash-bin call:

```python
requirements = {"robotType": "OT-2", "apiLevel": "2.28"}

tips = protocol.load_labware("opentrons_96_tiprack_300ul", 1)
reservoir = protocol.load_labware("nest_12_reservoir_15ml", 2)
plate = protocol.load_labware("nest_96_wellplate_200ul_flat", 3)
pipette = protocol.load_instrument("p300_single_gen2", "left", tip_racks=[tips])
```

Remember the catch above: this file simulated under `opentrons` 9.0.0 and was refused under 10.1.0.

## 5. Working with AI agents on this

**What the PDM decides.** The goal, the robot and API level, and the acceptance test: "the simulator exits with code 0 and the log shows these volumes in these wells".

**What you delegate, and the exact brief.** You may hand an agent the whole file and its test. This is the **delegate** rung: a written brief, acceptance criteria and your review.

```text
Task: write an Opentrons protocol and a pytest test. Simulation only.
Target: robotType Flex, apiLevel 2.30. Check the versioning page first:
https://docs.opentrons.com/python-api/versioning/ and tell me if 2.30 is not valid.

The protocol: water (reservoir A1) into every well of column 1 of a
96-well plate, 90 uL each. Then dyes from reservoir A2, A3, A4, 20 uL each,
into plate well A2, with a new tip for each dye.

Rules:
1. Use only labware and pipette names from the Opentrons docs. List each
   name and where you found it.
2. Declare apiLevel in `requirements` only.
3. Do not invent API methods. If unsure, say so and cite the docs page.
4. Run `opentrons_simulate` and paste the last 20 lines of its output.
5. Add a test that simulates every file in protocols/ and checks exit code 0.
6. Write nothing for real equipment or real liquids.
Output: the protocol file, the test file, the simulator output.
```

**How you verify.** Do not trust the agent's pasted output. Run the simulator yourself and read the log. Check each volume and well against your brief. Count the tips. Look up every labware name and method in the docs. Agents often use calls from an older version or the wrong robot. The simulator catches an invalid call, but not a wrong volume that is still valid.

**Which disciplines are involved.** The lab supervisor decides whether a real run is ever allowed. Security asks who can change a protocol and how you would know.

**Where this sits on the ladder.** This is **delegate**. It becomes **orchestrate** when several agents write protocols for several experiments at once. Then you need one test that all of them must pass. A merge request check that runs the simulator on every changed protocol, and blocks the merge on a failure, is the **govern** rung.

**Disclose.** Add to the README: "The protocol and test were drafted by an AI agent from my brief. I ran the simulator myself and read the whole log." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Copying an API level from memory.** Check the versioning page. The valid range changes.
- **Declaring the level twice, or never.** Use one place.
- **Mixing up Flex and OT-2.** Slot names, tip racks and pipette names differ.
- **Installing packages in two steps.** A later install can change `numpy` and break the simulator. Install all at once.
- **Reusing a tip across dyes.** Set `new_tip="always"` when liquids must not mix.
- **Skipping the log.** Exit code 0 only means the commands were valid. Reading the volumes is your job.

## 7. Practice: a simulated protocol with a test

**Deliverable:** a folder in your git repository, `lab/protocols/`, containing a protocol, its simulator log and a test.

1. Write a protocol for your robot type that loads a tip rack, a 12-well reservoir and a 96-well plate. Use `distribute` for one liquid, `transfer` with `new_tip="always"` for at least two others and `consolidate` once.
2. Simulate it. Save the output with `opentrons_simulate lab/protocols/mix.py > lab/protocols/mix.sim.log`.
3. In `lab/protocols/NOTES.md`, answer in three sentences: how many tips did it use, why did `distribute` aspirate more than the doses add up to, and what would the simulator not show?
4. Add `tests/test_protocols.py` from the lesson and make it pass.
5. Break the protocol twice (a labware typo, a slot clash). Paste each error into the notes.
6. Commit all of it with a message such as `feat: add simulated mixing protocol and test`.

**Check:** ask an agent to write the same protocol from your brief. Simulate it and list every difference between its log and yours.

## 8. Checklist

- [ ] `robotType` and `apiLevel` are in `requirements`, and not in `metadata`.
- [ ] I checked the level against the current versioning page.
- [ ] Every labware and pipette name is exact, and I looked each one up.
- [ ] `new_tip` is set on purpose for each liquid.
- [ ] The simulator exits with code 0 and I read the whole log.
- [ ] The log is saved next to the protocol.
- [ ] A test simulates every protocol in the folder.
- [ ] The protocol says "Simulation only" until a supervisor approves a real run.
- [ ] I recorded my AI use.

## 9. Further learning

Start with the Opentrons Python API tutorial, then read the complex commands page on tip handling and disposal volume. The page on executing and simulating lists the simulator's options. The OT-2 import page shows what the app does with a file. Keep the Python Protocol API documentation open. Next, in [Design an experiment](/library/tracks/lab-automation-in-code/03-design-an-experiment), you decide what the protocol should run, before you write another line of it.
