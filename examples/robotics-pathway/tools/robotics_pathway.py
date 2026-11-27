"""Robotics pathway (Developer Dojo): from an open robot model to a checked pose and joint solution, in simulation.

    python -I tools/robotics_pathway.py <pathway folder> <output folder>

Standard library only. The robot is the UR5 arm as its open ROS 2 description publishes it
(inputs/ur5-default-kinematics.yaml, BSD-3-Clause, served unchanged). The methods are the product-of-exponentials
forward kinematics, the space and body Jacobians and the Newton-Raphson inverse kinematics of the textbook
"Modern Robotics: Mechanics, Planning, and Control" (Cambridge University Press, 2017), as its MIT-licensed code
library implements them. The script first reproduces what is published:

- the worked examples printed in the docstrings of that code library (modern_robotics/core.py), for the matrix
  exponentials and logarithms, the adjoint, the inverse transform, forward kinematics in both frames, both Jacobians
  and both inverse kinematics solvers;
- the UR5 Denavit-Hartenberg table Universal Robots publishes for the same arm: every d and a in it is a number of
  the description file, and forward kinematics by that table agrees with forward kinematics by the file's joint chain
  at every configuration the script uses.

If any differs, it exits with an error and writes nothing. Then it writes:

- inspection.json: what the description file holds, its units and conventions, and how it maps to the DH table (ROB-001);
- poses.json and poses.csv: the end-effector pose of each configuration in scenario/configurations.csv by three methods,
  and the Jacobian determinant there (ROB-002);
- ik.json: joint solutions for the target poses in scenario/targets.csv, each checked by forward kinematics (ROB-003);
- randori/cards.json: the Randori cards recomputed;
- manifest.json and summary.md.

Everything here is simulation: no real robot moved, and nothing here is a safety assessment of any cell.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
import math
import shutil
import sys
from pathlib import Path

MODEL = "inputs/ur5-default-kinematics.yaml"
LICENSE = "inputs/ur-description-LICENSE.txt"
CONFIGURATIONS = "scenario/configurations.csv"
TARGETS = "scenario/targets.csv"
# The joint origins in the order the URDF chains them: shoulder_pan, shoulder_lift, elbow, wrist_1, wrist_2, wrist_3.
LINKS = ["shoulder", "upper_arm", "forearm", "wrist_1", "wrist_2", "wrist_3"]
JOINTS = ["shoulder_pan", "shoulder_lift", "elbow", "wrist_1", "wrist_2", "wrist_3"]
ORIGIN_KEYS = ["x", "y", "z", "roll", "pitch", "yaw"]
# Universal Robots, "DH parameters for calculations of kinematics and dynamics", the UR5 table (read 2026-11-27):
# a [m], d [m] and alpha [rad] for joints 1 to 6.
UR5_DH = {
    "a": [0.0, -0.425, -0.39225, 0.0, 0.0, 0.0],
    "d": [0.089159, 0.0, 0.0, 0.10915, 0.09465, 0.0823],
    "alpha": [math.pi / 2, 0.0, 0.0, math.pi / 2, -math.pi / 2, 0.0],
}
# The library's NearZero threshold and its inverse kinematics iteration limit.
NEAR_ZERO = 1e-6
MAX_ITERATIONS = 20
# Tolerances this pathway asks of a joint solution: 0.001 rad of orientation and 0.1 mm of position error.
EOMG, EV = 1e-3, 1e-4
# Three methods of forward kinematics must agree to within this, in metres and in rotation-matrix entries.
AGREEMENT = 1e-9


class ReferenceMismatch(Exception):
    """A published value did not reproduce."""


def fixed(value: float, decimals: int) -> str:
    """A value at a fixed number of decimals, never '-0.000'."""
    text = f"{value:.{decimals}f}"
    return text[1:] if text.startswith("-") and float(text) == 0 else text


def decimals_of(text: str) -> int:
    return len(text.split(".")[1]) if "." in text else 0


# ---------------------------------------------------------------- linear algebra on lists

Matrix = list[list[float]]


def identity(n: int) -> Matrix:
    return [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)]


def matmul(a: Matrix, b: Matrix) -> Matrix:
    return [[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]


def matvec(a: Matrix, v: list[float]) -> list[float]:
    return [sum(a[i][k] * v[k] for k in range(len(v))) for i in range(len(a))]


def transpose(a: Matrix) -> Matrix:
    return [list(row) for row in zip(*a)]


def add(a: Matrix, b: Matrix, scale: float = 1.0) -> Matrix:
    return [[a[i][j] + scale * b[i][j] for j in range(len(a[0]))] for i in range(len(a))]


def scaled(a: Matrix, s: float) -> Matrix:
    return [[s * x for x in row] for row in a]


def norm(v: list[float]) -> float:
    return math.sqrt(sum(x * x for x in v))


def solve(a: Matrix, b: Matrix) -> Matrix:
    """Solves a x = b by Gaussian elimination with partial pivoting; refuses a singular a."""
    n = len(a)
    m = [list(a[i]) + list(b[i]) for i in range(n)]
    for col in range(n):
        pivot = max(range(col, n), key=lambda r: abs(m[r][col]))
        if abs(m[pivot][col]) < 1e-14:
            raise ArithmeticError("the matrix is singular, so no unique step exists")
        m[col], m[pivot] = m[pivot], m[col]
        for r in range(n):
            if r != col:
                f = m[r][col] / m[col][col]
                m[r] = [m[r][k] - f * m[col][k] for k in range(len(m[r]))]
    return [[m[i][n + j] / m[i][i] for j in range(len(b[0]))] for i in range(n)]


def pinv(j: Matrix) -> Matrix:
    """Pseudoinverse of a 6 x n Jacobian of full column rank (n <= 6): (J^T J)^-1 J^T."""
    jt = transpose(j)
    return solve(matmul(jt, j), jt)


def det(a: Matrix) -> float:
    n = len(a)
    m = [list(row) for row in a]
    result = 1.0
    for col in range(n):
        pivot = max(range(col, n), key=lambda r: abs(m[r][col]))
        if m[pivot][col] == 0.0:
            return 0.0
        if pivot != col:
            m[col], m[pivot] = m[pivot], m[col]
            result = -result
        result *= m[col][col]
        for r in range(col + 1, n):
            f = m[r][col] / m[col][col]
            m[r] = [m[r][k] - f * m[col][k] for k in range(n)]
    return result


# ---------------------------------------------------------------- rigid-body motions (Modern Robotics, chapters 3 to 6)

def skew(w: list[float]) -> Matrix:
    return [[0.0, -w[2], w[1]], [w[2], 0.0, -w[0]], [-w[1], w[0], 0.0]]


def unskew(m: Matrix) -> list[float]:
    return [m[2][1], m[0][2], m[1][0]]


def rp_to_trans(r: Matrix, p: list[float]) -> Matrix:
    return [r[0] + [p[0]], r[1] + [p[1]], r[2] + [p[2]], [0.0, 0.0, 0.0, 1.0]]


def trans_to_rp(t: Matrix) -> tuple[Matrix, list[float]]:
    return [row[:3] for row in t[:3]], [t[0][3], t[1][3], t[2][3]]


def trans_inv(t: Matrix) -> Matrix:
    r, p = trans_to_rp(t)
    rt = transpose(r)
    return rp_to_trans(rt, [-x for x in matvec(rt, p)])


def vec_to_se3(v: list[float]) -> Matrix:
    w = skew(v[:3])
    return [w[0] + [v[3]], w[1] + [v[4]], w[2] + [v[5]], [0.0, 0.0, 0.0, 0.0]]


def se3_to_vec(m: Matrix) -> list[float]:
    return [m[2][1], m[0][2], m[1][0], m[0][3], m[1][3], m[2][3]]


def adjoint(t: Matrix) -> Matrix:
    r, p = trans_to_rp(t)
    pr = matmul(skew(p), r)
    top = [r[i] + [0.0, 0.0, 0.0] for i in range(3)]
    bottom = [pr[i] + r[i] for i in range(3)]
    return top + bottom


def exp3(so3: Matrix) -> Matrix:
    w = unskew(so3)
    theta = norm(w)
    if theta < NEAR_ZERO:
        return identity(3)
    k = scaled(so3, 1.0 / theta)
    return add(add(identity(3), k, math.sin(theta)), matmul(k, k), 1.0 - math.cos(theta))


def log3(r: Matrix) -> Matrix:
    c = (r[0][0] + r[1][1] + r[2][2] - 1.0) / 2.0
    if c >= 1.0:
        return [[0.0] * 3 for _ in range(3)]
    if c <= -1.0:
        if abs(1.0 + r[2][2]) >= NEAR_ZERO:
            w = [x / math.sqrt(2.0 * (1.0 + r[2][2])) for x in (r[0][2], r[1][2], 1.0 + r[2][2])]
        elif abs(1.0 + r[1][1]) >= NEAR_ZERO:
            w = [x / math.sqrt(2.0 * (1.0 + r[1][1])) for x in (r[0][1], 1.0 + r[1][1], r[2][1])]
        else:
            w = [x / math.sqrt(2.0 * (1.0 + r[0][0])) for x in (1.0 + r[0][0], r[1][0], r[2][0])]
        return skew([math.pi * x for x in w])
    theta = math.acos(c)
    return scaled(add(r, transpose(r), -1.0), theta / 2.0 / math.sin(theta))


def exp6(se3: Matrix) -> Matrix:
    so3 = [row[:3] for row in se3[:3]]
    v = [se3[0][3], se3[1][3], se3[2][3]]
    theta = norm(unskew(so3))
    if theta < NEAR_ZERO:
        return rp_to_trans(identity(3), v)
    k = scaled(so3, 1.0 / theta)
    g = add(add(scaled(identity(3), theta), k, 1.0 - math.cos(theta)), matmul(k, k), theta - math.sin(theta))
    return rp_to_trans(exp3(so3), [x / theta for x in matvec(g, v)])


def log6(t: Matrix) -> Matrix:
    r, p = trans_to_rp(t)
    w = log3(r)
    if all(x == 0.0 for row in w for x in row):
        return [[0.0, 0.0, 0.0, p[0]], [0.0, 0.0, 0.0, p[1]], [0.0, 0.0, 0.0, p[2]], [0.0, 0.0, 0.0, 0.0]]
    theta = math.acos(max(-1.0, min(1.0, (r[0][0] + r[1][1] + r[2][2] - 1.0) / 2.0)))
    g = add(add(identity(3), w, -0.5), matmul(w, w), (1.0 / theta - 1.0 / math.tan(theta / 2.0) / 2.0) / theta)
    v = matvec(g, p)
    return [w[0] + [v[0]], w[1] + [v[1]], w[2] + [v[2]], [0.0, 0.0, 0.0, 0.0]]


def fk_space(m: Matrix, screws: list[list[float]], thetas: list[float]) -> Matrix:
    t = identity(4)
    for s, theta in zip(screws, thetas):
        t = matmul(t, exp6(vec_to_se3([x * theta for x in s])))
    return matmul(t, m)


def fk_body(m: Matrix, screws: list[list[float]], thetas: list[float]) -> Matrix:
    t = m
    for s, theta in zip(screws, thetas):
        t = matmul(t, exp6(vec_to_se3([x * theta for x in s])))
    return t


def jacobian_space(screws: list[list[float]], thetas: list[float]) -> Matrix:
    columns = [list(screws[0])]
    t = identity(4)
    for i in range(1, len(screws)):
        t = matmul(t, exp6(vec_to_se3([x * thetas[i - 1] for x in screws[i - 1]])))
        columns.append(matvec(adjoint(t), screws[i]))
    return transpose(columns)


def jacobian_body(screws: list[list[float]], thetas: list[float]) -> Matrix:
    n = len(screws)
    columns: list[list[float]] = [[] for _ in range(n)]
    columns[n - 1] = list(screws[n - 1])
    t = identity(4)
    for i in range(n - 2, -1, -1):
        t = matmul(t, exp6(vec_to_se3([-x * thetas[i + 1] for x in screws[i + 1]])))
        columns[i] = matvec(adjoint(t), screws[i])
    return transpose(columns)


def ik(screws: list[list[float]], m: Matrix, target: Matrix, guess: list[float], eomg: float, ev: float, frame: str) -> dict[str, object]:
    """Newton-Raphson inverse kinematics as the library's IKinSpace and IKinBody: at most MAX_ITERATIONS steps."""
    thetas = list(guess)

    def twist(th: list[float]) -> list[float]:
        if frame == "space":
            tsb = fk_space(m, screws, th)
            return matvec(adjoint(tsb), se3_to_vec(log6(matmul(trans_inv(tsb), target))))
        return se3_to_vec(log6(matmul(trans_inv(fk_body(m, screws, th)), target)))

    v = twist(thetas)
    iterations = 0
    while (norm(v[:3]) > eomg or norm(v[3:]) > ev) and iterations < MAX_ITERATIONS:
        j = jacobian_space(screws, thetas) if frame == "space" else jacobian_body(screws, thetas)
        step = matvec(pinv(j), v)
        thetas = [a + b for a, b in zip(thetas, step)]
        iterations += 1
        v = twist(thetas)
    return {"thetas": thetas, "success": not (norm(v[:3]) > eomg or norm(v[3:]) > ev), "iterations": iterations,
            "orientationError": norm(v[:3]), "positionError": norm(v[3:])}


# ---------------------------------------------------------------- the published worked examples

def parse_matrix(rows: list[str]) -> Matrix:
    return [[float(x) for x in row.split()] for row in rows]


T_EXAMPLE = [[1, 0, 0, 0], [0, 0, -1, 0], [0, 1, 0, 3], [0, 0, 0, 1]]
M_EXAMPLE = [[-1, 0, 0, 0], [0, 1, 0, 6], [0, 0, -1, 2], [0, 0, 0, 1]]
B_EXAMPLE = [[0, 0, -1, 2, 0, 0], [0, 0, 0, 0, 1, 0], [0, 0, 1, 0, 0, 0.1]]
S_EXAMPLE = [[0, 0, 1, 4, 0, 0], [0, 0, 0, 0, 1, 0], [0, 0, -1, -6, 0, -0.1]]
J_SCREWS = [[0, 0, 1, 0, 0.2, 0.2], [1, 0, 0, 2, 0, 3], [0, 1, 0, 0, 2, 1], [1, 0, 0, 0.2, 0.3, 0.4]]
J_THETAS = [0.2, 1.1, 0.1, 1.2]
FK_THETAS = [math.pi / 2, 3, math.pi]
IK_TARGET = [[0, 1, 0, -5], [1, 0, 0, 4], [0, 0, -1, 1.6858], [0, 0, 0, 1]]

# Each example as the docstring prints it: the function, its input and its printed output, row by row.
EXAMPLES: list[tuple[str, object, list[str]]] = [
    ("MatrixExp3", lambda: exp3([[0, -3, 2], [3, 0, -1], [-2, 1, 0]]),
     ["-0.69492056 0.71352099 0.08929286", "-0.19200697 -0.30378504 0.93319235", "0.69297817 0.6313497 0.34810748"]),
    ("MatrixLog3", lambda: log3([[0, 0, 1], [1, 0, 0], [0, 1, 0]]),
     ["0 -1.20919958 1.20919958", "1.20919958 0 -1.20919958", "-1.20919958 1.20919958 0"]),
    ("MatrixExp6", lambda: exp6([[0, 0, 0, 0], [0, 0, -1.57079632, 2.35619449], [0, 1.57079632, 0, 2.35619449], [0, 0, 0, 0]]),
     ["1.0 0.0 0.0 0.0", "0.0 0.0 -1.0 0.0", "0.0 1.0 0.0 3.0", "0 0 0 1"]),
    ("MatrixLog6", lambda: log6(T_EXAMPLE),
     ["0 0 0 0", "0 0 -1.57079633 2.35619449", "0 1.57079633 0 2.35619449", "0 0 0 0"]),
    ("TransInv", lambda: trans_inv(T_EXAMPLE), ["1 0 0 0", "0 0 1 -3", "0 -1 0 0", "0 0 0 1"]),
    ("Adjoint", lambda: adjoint(T_EXAMPLE),
     ["1 0 0 0 0 0", "0 0 -1 0 0 0", "0 1 0 0 0 0", "0 0 3 1 0 0", "3 0 0 0 0 -1", "0 0 0 0 1 0"]),
    ("FKinBody", lambda: fk_body(M_EXAMPLE, B_EXAMPLE, FK_THETAS),
     ["0 1 0 -5", "1 0 0 4", "0 0 -1 1.68584073", "0 0 0 1"]),
    ("FKinSpace", lambda: fk_space(M_EXAMPLE, S_EXAMPLE, FK_THETAS),
     ["0 1 0 -5", "1 0 0 4", "0 0 -1 1.68584073", "0 0 0 1"]),
    ("JacobianBody", lambda: jacobian_body(J_SCREWS, J_THETAS),
     ["-0.04528405 0.99500417 0 1", "0.74359313 0.09304865 0.36235775 0", "-0.66709716 0.03617541 -0.93203909 0",
      "2.32586047 1.66809 0.56410831 0.2", "-1.44321167 2.94561275 1.43306521 0.3", "-2.06639565 1.82881722 -1.58868628 0.4"]),
    ("JacobianSpace", lambda: jacobian_space(J_SCREWS, J_THETAS),
     ["0 0.98006658 -0.09011564 0.95749426", "0 0.19866933 0.4445544 0.28487557", "1 0 0.89120736 -0.04528405",
      "0 1.95218638 -2.21635216 -0.51161537", "0.2 0.43654132 -2.43712573 2.77535713", "0.2 2.96026613 3.23573065 2.22512443"]),
    ("IKinBody", lambda: [ik(B_EXAMPLE, M_EXAMPLE, IK_TARGET, [1.5, 2.5, 3], 0.01, 0.001, "body")["thetas"]],
     ["1.57073819 2.999667 3.14153913"]),
    ("IKinSpace", lambda: [ik(S_EXAMPLE, M_EXAMPLE, IK_TARGET, [1.5, 2.5, 3], 0.01, 0.001, "space")["thetas"]],
     ["1.57073783 2.99966384 3.1415342"]),
]


def reference_checks() -> list[dict[str, object]]:
    checks = []
    for name, compute, printed in EXAMPLES:
        result = compute()  # type: ignore[operator]
        for i, row in enumerate(printed):
            for j, text in enumerate(row.split()):
                value = result[i][j]
                # A value printed to d decimals reproduces when it rounds to the printed value: within half a unit of
                # the last printed digit, plus 1e-12 for floating point. A whole number printed as 0 or 1 is exact.
                tolerance = 0.5 * 10 ** -decimals_of(text) + 1e-12 if "." in text else 1e-9
                difference = abs(value - float(text))
                ok = difference <= tolerance
                checks.append({"function": name, "row": i + 1, "column": j + 1, "printed": text,
                               "computed": fixed(value, max(8, decimals_of(text))), "pass": ok})
                if not ok:
                    raise ReferenceMismatch(f"{name} row {i + 1} column {j + 1}: printed {text}, computed {value!r}")
    if not ik(B_EXAMPLE, M_EXAMPLE, IK_TARGET, [1.5, 2.5, 3], 0.01, 0.001, "body")["success"]:
        raise ReferenceMismatch("IKinBody: the library prints True (a solution found); this code found none")
    if not ik(S_EXAMPLE, M_EXAMPLE, IK_TARGET, [1.5, 2.5, 3], 0.01, 0.001, "space")["success"]:
        raise ReferenceMismatch("IKinSpace: the library prints True (a solution found); this code found none")
    return checks


# ---------------------------------------------------------------- the UR5 description

def read_model(raw: bytes) -> tuple[dict[str, dict[str, float]], str]:
    """Reads the description's two-level mapping strictly: anything else in the file is an error, not a guess."""
    text = raw.decode("utf-8")
    lines = [line for line in text.splitlines() if line.strip()]
    if lines[0] != "kinematics:":
        raise ValueError(f"{MODEL}: expected 'kinematics:' on the first line, found {lines[0]!r}")
    links: dict[str, dict[str, float]] = {}
    current = None
    calibration = None
    for line in lines[1:]:
        if line.startswith("    ") and current is not None:
            key, _, value = line.strip().partition(": ")
            if key not in ORIGIN_KEYS or key in links[current]:
                raise ValueError(f"{MODEL}: unexpected or repeated key {key!r} under {current}")
            links[current][key] = float(value)
        elif line.startswith("  hash: "):
            calibration = line.split(": ", 1)[1]
            current = None
        elif line.startswith("  ") and line.endswith(":") and not line.startswith("   "):
            current = line.strip()[:-1]
            if current not in LINKS or current in links:
                raise ValueError(f"{MODEL}: unexpected or repeated link {current!r}")
            links[current] = {}
        else:
            raise ValueError(f"{MODEL}: cannot read line {line!r}")
    if list(links) != LINKS or any(sorted(links[name]) != sorted(ORIGIN_KEYS) for name in LINKS):
        raise ValueError(f"{MODEL}: expected the links {LINKS}, each with {ORIGIN_KEYS}")
    if calibration is None:
        raise ValueError(f"{MODEL}: no calibration hash line")
    return links, calibration


def rot_x(a: float) -> Matrix:
    return [[1.0, 0.0, 0.0], [0.0, math.cos(a), -math.sin(a)], [0.0, math.sin(a), math.cos(a)]]


def rot_y(a: float) -> Matrix:
    return [[math.cos(a), 0.0, math.sin(a)], [0.0, 1.0, 0.0], [-math.sin(a), 0.0, math.cos(a)]]


def rot_z(a: float) -> Matrix:
    return [[math.cos(a), -math.sin(a), 0.0], [math.sin(a), math.cos(a), 0.0], [0.0, 0.0, 1.0]]


def rpy(roll: float, pitch: float, yaw: float) -> Matrix:
    """URDF's roll-pitch-yaw: fixed axes x, then y, then z, so R = Rz(yaw) Ry(pitch) Rx(roll)."""
    return matmul(rot_z(yaw), matmul(rot_y(pitch), rot_x(roll)))


def to_rpy(r: Matrix) -> list[float]:
    """Roll, pitch, yaw of R = Rz(yaw) Ry(pitch) Rx(roll), the URDF and REP 103 convention."""
    pitch = math.atan2(-r[2][0], math.hypot(r[0][0], r[1][0]))
    if math.hypot(r[0][0], r[1][0]) < 1e-12:
        return [math.atan2(-r[1][2], r[1][1]), pitch, 0.0]
    return [math.atan2(r[2][1], r[2][2]), pitch, math.atan2(r[1][0], r[0][0])]


def fk_chain(links: dict[str, dict[str, float]], thetas: list[float]) -> Matrix:
    """The file's joint chain as the URDF uses it: each joint's origin (translation, then roll-pitch-yaw), then a
    rotation by the joint angle about the joint's z axis. The result is wrist_3_link in base_link_inertia."""
    t = identity(4)
    for name, theta in zip(LINKS, thetas):
        o = links[name]
        origin = rp_to_trans(rpy(o["roll"], o["pitch"], o["yaw"]), [o["x"], o["y"], o["z"]])
        t = matmul(matmul(t, origin), rp_to_trans(rot_z(theta), [0.0, 0.0, 0.0]))
    return t


def fk_dh(dh: dict[str, list[float]], thetas: list[float]) -> Matrix:
    """Standard Denavit-Hartenberg: each joint is Rz(theta) Tz(d) Tx(a) Rx(alpha)."""
    t = identity(4)
    for theta, d, a, alpha in zip(thetas, dh["d"], dh["a"], dh["alpha"]):
        t = matmul(t, matmul(rp_to_trans(rot_z(theta), [0.0, 0.0, d]), rp_to_trans(rot_x(alpha), [a, 0.0, 0.0])))
    return t


def screw_axes(links: dict[str, dict[str, float]]) -> tuple[list[list[float]], Matrix]:
    """Space-frame screw axes and home pose M from the chain at zero: each joint's z axis w through its origin q gives
    S = (w, -w x q)."""
    screws = []
    t = identity(4)
    for name in LINKS:
        o = links[name]
        t = matmul(t, rp_to_trans(rpy(o["roll"], o["pitch"], o["yaw"]), [o["x"], o["y"], o["z"]]))
        w = [t[0][2], t[1][2], t[2][2]]
        q = [t[0][3], t[1][3], t[2][3]]
        v = [-(w[1] * q[2] - w[2] * q[1]), -(w[2] * q[0] - w[0] * q[2]), -(w[0] * q[1] - w[1] * q[0])]
        screws.append(w + v)
    return screws, t


def largest_difference(a: Matrix, b: Matrix) -> float:
    return max(abs(a[i][j] - b[i][j]) for i in range(3) for j in range(4))


def pose(t: Matrix) -> dict[str, object]:
    r, p = trans_to_rp(t)
    return {"position_m": [fixed(x, 6) for x in p], "rpy_rad": [fixed(x, 6) for x in to_rpy(r)]}


def read_rows(raw: bytes, columns: list[str], name: str) -> list[dict[str, str]]:
    reader = csv.DictReader(io.StringIO(raw.decode("utf-8")))
    if reader.fieldnames != columns:
        raise ValueError(f"{name}: expected the columns {columns}, found {reader.fieldnames}")
    return list(reader)


# ---------------------------------------------------------------- the build

def build(folder: Path, out: Path) -> None:
    raws = {name: (folder / name).read_bytes() for name in (MODEL, LICENSE, CONFIGURATIONS, TARGETS)}
    checks = reference_checks()
    links, calibration = read_model(raws[MODEL])
    screws, home = screw_axes(links)

    # The file against Universal Robots' DH table: which number of the file is which DH parameter.
    mapping = [
        ("d1", UR5_DH["d"][0], "shoulder", "z", 1.0), ("a2", UR5_DH["a"][1], "forearm", "x", 1.0),
        ("a3", UR5_DH["a"][2], "wrist_1", "x", 1.0), ("d4", UR5_DH["d"][3], "wrist_1", "z", 1.0),
        ("d5", UR5_DH["d"][4], "wrist_2", "y", -1.0), ("d6", UR5_DH["d"][5], "wrist_3", "y", 1.0),
    ]
    dh_map = []
    for name, value, link, key, sign in mapping:
        in_file = sign * links[link][key]
        if in_file != value:
            raise ReferenceMismatch(f"UR5 DH {name}: Universal Robots prints {value}, the file gives {in_file}")
        dh_map.append({"parameter": name, "publishedValue_m": value, "fileEntry": f"{link}.{key}", "sign": "-" if sign < 0 else "+", "equal": True})
    residue = [{"entry": f"{name}.{key}", "value": repr(links[name][key])} for name in LINKS for key in ("x", "y", "z")
               if links[name][key] != 0.0 and abs(links[name][key]) < 1e-9]
    reach = sum(abs(x) for x in UR5_DH["a"]) + sum(abs(x) for x in UR5_DH["d"][3:])

    inspection = {
        "source": "Universal Robots ROS 2 Description, config/ur5/default_kinematics.yaml (BSD-3-Clause), unchanged",
        "calibrationHash": calibration,
        "units": "Lengths in metres and angles in radians, the units REP 103 sets for ROS; the file states no units of its own.",
        "convention": "Each entry is a URDF joint origin: x, y, z translate, then roll, pitch, yaw rotate about the fixed x, y and z axes (R = Rz(yaw) Ry(pitch) Rx(roll)); each joint then turns about its own z axis. Frames are right-handed (REP 103).",
        "joints": [{"joint": joint, "originOf": name, **{key: repr(links[name][key]) for key in ORIGIN_KEYS}} for joint, name in zip(JOINTS, LINKS)],
        "dhTable": {"source": "Universal Robots, DH parameters for calculations of kinematics and dynamics, UR5 (read 2026-11-27)",
                    "a_m": UR5_DH["a"], "d_m": UR5_DH["d"], "alpha": ["pi/2", "0", "0", "pi/2", "-pi/2", "0"], "fileEntries": dh_map},
        "numericalResidue": residue,
        "numericalResidueNote": "Entries such as wrist_2.z are not zero but smaller than a nanometre: residue of converting the DH table into joint origins, not a physical offset.",
        "homePose": pose(home),
        "screwAxes": [{"joint": joint, "w": [fixed(x, 6) for x in s[:3]], "v": [fixed(x, 6) for x in s[3:]]} for joint, s in zip(JOINTS, screws)],
        "reachBound_m": fixed(reach, 5),
        "reachBoundNote": "The sum of |a2|, |a3|, d4, d5 and d6: no tool point can be farther than this from the shoulder joint's origin (triangle inequality). It is a bound, not the arm's working range.",
        "notInTheFile": "The URDF's base_link to base_link_inertia turn of pi about z, the flange and tool0 frames, joint limits, masses and any tool. Poses here are of wrist_3_link in base_link_inertia, which is DH frame 6 in DH frame 0.",
    }

    # ROB-002: poses by three methods.
    configurations = read_rows(raws[CONFIGURATIONS], ["configuration", *[f"theta{i}" for i in range(1, 7)], "note"], CONFIGURATIONS)
    poses = []
    worst = 0.0
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(["configuration", "x_m", "y_m", "z_m", "roll_rad", "pitch_rad", "yaw_rad", "det_Js", "largestDisagreement"])
    for row in configurations:
        thetas = [float(row[f"theta{i}"]) for i in range(1, 7)]
        chain = fk_chain(links, thetas)
        dh = fk_dh(UR5_DH, thetas)
        poe = fk_space(home, screws, thetas)
        disagreement = max(largest_difference(chain, dh), largest_difference(chain, poe))
        if disagreement > AGREEMENT:
            raise ReferenceMismatch(f"configuration {row['configuration']}: the three forward kinematics differ by {disagreement}")
        worst = max(worst, disagreement)
        determinant = det(jacobian_space(screws, thetas))
        entry = {"configuration": row["configuration"], "thetas_rad": row_thetas(row), "note": row["note"], **pose(chain),
                 "detJs": fixed(determinant, 6), "largestDisagreement": f"{disagreement:.1e}"}
        poses.append(entry)
        writer.writerow([row["configuration"], *entry["position_m"], *entry["rpy_rad"], entry["detJs"], entry["largestDisagreement"]])  # type: ignore[misc]
    agreement = {"methods": ["the file's URDF joint chain", "Universal Robots' DH table", "product of exponentials with screw axes from the file"],
                 "tolerance": AGREEMENT, "largestDisagreement": f"{worst:.1e}"}

    # ROB-003: joint solutions for the target poses.
    targets = read_rows(raws[TARGETS], ["target", "x", "y", "z", "roll", "pitch", "yaw", "guess", *[f"guess{i}" for i in range(1, 7)]], TARGETS)
    solutions = []
    for row in targets:
        r = rpy(float(row["roll"]), float(row["pitch"]), float(row["yaw"]))
        target = rp_to_trans(r, [float(row["x"]), float(row["y"]), float(row["z"])])
        guess = [float(row[f"guess{i}"]) for i in range(1, 7)]
        distance = norm([float(row["x"]), float(row["y"]), float(row["z"]) - links["shoulder"]["z"]])
        result = ik(screws, home, target, guess, EOMG, EV, "space")
        entry: dict[str, object] = {"target": row["target"], "guess": row["guess"], "guess_rad": [row[f"guess{i}"] for i in range(1, 7)],
                                    "distanceFromShoulder_m": fixed(distance, 4), "success": result["success"], "iterations": result["iterations"]}
        if result["success"]:
            thetas = [math.remainder(x, 2 * math.pi) for x in result["thetas"]]  # type: ignore[union-attr]
            check = fk_chain(links, thetas)
            r_err = norm(unskew(log3(matmul(transpose(trans_to_rp(check)[0]), r))))
            p_err = norm([a - b for a, b in zip(trans_to_rp(check)[1], trans_to_rp(target)[1])])
            if r_err > EOMG or p_err > EV:
                raise ReferenceMismatch(f"target {row['target']}: the solution misses the target when checked by the joint chain")
            entry.update({"thetas_rad": [fixed(x, 6) for x in thetas], "checkByChain": {"orientationError_mrad": fixed(1000 * r_err, 4), "positionError_mm": fixed(1000 * p_err, 4)},
                          "detJs": fixed(det(jacobian_space(screws, thetas)), 6)})
        else:
            entry.update({"thetas_rad": None, "reason": "No joint solution within the tolerances after " + str(MAX_ITERATIONS) + " steps."
                          + (f" The target is {fixed(distance, 3)} m from the shoulder joint, beyond the {fixed(reach, 3)} m bound that the end of the arm can never pass." if distance > reach else "")})
        solutions.append(entry)

    # Randori: each card changes one assumption.
    base = configurations[2]
    base_thetas = [float(base[f"theta{i}"]) for i in range(1, 7)]
    base_pose = fk_chain(links, base_thetas)
    degrees = [math.degrees(x) for x in base_thetas]
    as_radians = fk_chain(links, degrees)
    rounded = {"a": [0.0, -0.425, -0.392, 0.0, 0.0, 0.0], "d": [0.089, 0.0, 0.0, 0.109, 0.095, 0.082], "alpha": UR5_DH["alpha"]}
    rounded_pose = fk_dh(rounded, base_thetas)
    flipped = {name: dict(origin) for name, origin in links.items()}
    flipped["wrist_2"]["y"] = -flipped["wrist_2"]["y"]
    flipped_pose = fk_chain(flipped, base_thetas)
    singular = configurations[4]
    singular_thetas = [float(singular[f"theta{i}"]) for i in range(1, 7)]

    def moved(a: Matrix, b: Matrix) -> dict[str, str]:
        ra, pa = trans_to_rp(a)
        rb, pb = trans_to_rp(b)
        return {"positionChange_mm": fixed(1000 * norm([x - y for x, y in zip(pa, pb)]), 2),
                "orientationChange_deg": fixed(math.degrees(norm(unskew(log3(matmul(transpose(ra), rb))))), 3)}

    cards = {
        "A": {"title": "The joint angles are given in degrees where the model expects radians", "configuration": base["configuration"],
              "change": "The same six numbers in degrees, read as radians.", "thetasAsTyped": [fixed(x, 4) for x in degrees],
              **moved(base_pose, as_radians)},
        "B": {"title": "The model rounded to the millimetre", "configuration": base["configuration"],
              "change": "d1 0.089, a3 -0.392, d4 0.109, d5 0.095, d6 0.082 instead of the file's values.", **moved(base_pose, rounded_pose)},
        "C": {"title": "The sign of d5 copied from the DH table into the joint origin", "configuration": base["configuration"],
              "change": "wrist_2.y set to +0.09465, the DH table's d5, instead of the file's -0.09465.",
              **moved(base_pose, flipped_pose)},
        "D": {"title": "The wrist turned to its singularity", "configuration": singular["configuration"],
              "change": "theta5 is 0, so the axes of joints 4 and 6 line up.",
              "detJsBefore": fixed(det(jacobian_space(screws, base_thetas)), 6), "detJsAfter": fixed(det(jacobian_space(screws, singular_thetas)), 6),
              "consequence": "With a determinant of zero, the Jacobian has no inverse there: some end-effector motions need unbounded joint speeds, and a Newton step is not defined."},
    }

    if out.exists():
        shutil.rmtree(out)
    (out / "randori").mkdir(parents=True)

    def write_json(name: str, value: object) -> None:
        (out / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    write_json("reference-checks.json", {
        "source": "Modern Robotics code library (Python, modern_robotics/core.py, MIT licence): the worked examples printed in its docstrings; Universal Robots' UR5 DH table",
        "passed": len(checks), "failed": 0, "functions": sorted({check["function"] for check in checks}), "checks": checks,
        "dhTable": {"parameters": len(dh_map), "equal": len(dh_map)}, "forwardKinematics": agreement,
    })
    write_json("inspection.json", inspection)
    write_json("poses.json", {"frame": "wrist_3_link in base_link_inertia (DH frame 6 in DH frame 0); positions in metres, orientation as URDF roll, pitch, yaw in radians",
                              "agreement": agreement, "configurations": poses})
    (out / "poses.csv").write_text(buffer.getvalue(), encoding="utf-8")
    write_json("ik.json", {"method": "Newton-Raphson in the space frame (the library's IKinSpace), at most 20 steps; each solution is checked again by the file's joint chain",
                           "tolerances": {"orientation_rad": EOMG, "position_m": EV}, "solutions": solutions})
    write_json("randori/cards.json", cards)

    solved = [s for s in solutions if s["success"]]
    lines = [
        "# Robotics pathway results",
        "",
        "Computed by `tools/robotics_pathway.py` on the open UR5 description, in simulation only. No real robot moved, and",
        "nothing here is a safety assessment of any robot cell.",
        "",
        f"- Worked examples: {len(checks)} of {len(checks)} values printed in the Modern Robotics code library reproduced ({len({c['function'] for c in checks})} functions).",
        f"- The description against Universal Robots' DH table: {len(dh_map)} of {len(dh_map)} lengths equal.",
        f"- Forward kinematics: three methods agree within {agreement['largestDisagreement']} at {len(poses)} configurations.",
        "- Joint solutions: " + "; ".join(f"{s['target']} from {s['guess']} " + ("solved in " + str(s["iterations"]) + " steps" if s["success"] else "no solution") for s in solutions) + ".",
        f"- {len(solved)} of {len(solutions)} solves found a solution; each one checked again by the joint chain.",
        "- Randori cards: " + "; ".join(f"{key} " + (value.get("positionChange_mm", "") + " mm" if "positionChange_mm" in value else "det " + str(value.get("detJsAfter"))) for key, value in cards.items()) + ".",
        "",
    ]
    (out / "summary.md").write_text("\n".join(lines), encoding="utf-8")

    outputs = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()) + ["manifest.json"]
    write_json("manifest.json", {
        "script": "tools/robotics_pathway.py",
        "python": f"{sys.version_info.major}.{sys.version_info.minor}",
        "inputs": {name: hashlib.sha256(raw).hexdigest() for name, raw in sorted(raws.items())},
        "method": {
            "referenceChecks": "Modern Robotics code library, docstring worked examples of MatrixExp3, MatrixLog3, MatrixExp6, MatrixLog6, TransInv, Adjoint, FKinBody, FKinSpace, JacobianBody, JacobianSpace, IKinBody and IKinSpace; Universal Robots' UR5 DH table",
            "forwardKinematics": "URDF joint chain from the file; standard DH (Rz(theta) Tz(d) Tx(a) Rx(alpha)); product of exponentials T = e^[S1]theta1 ... e^[S6]theta6 M",
            "inverseKinematics": "Newton-Raphson: theta <- theta + pinv(Js(theta)) Vs, with pinv = (J^T J)^-1 J^T; at most 20 steps; tolerances 0.001 rad and 0.1 mm",
            "units": "metres and radians (REP 103)",
        },
        "outputs": sorted(outputs),
    })


def row_thetas(row: dict[str, str]) -> list[str]:
    return [row[f"theta{i}"] for i in range(1, 7)]


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: robotics_pathway.py <pathway folder> <output folder>", file=sys.stderr)
        return 2
    try:
        build(Path(argv[1]), Path(argv[2]))
    except ReferenceMismatch as error:
        print(f"Published reference values did not reproduce; nothing written: {error}", file=sys.stderr)
        return 1
    except (OSError, ValueError, ArithmeticError, KeyError) as error:
        print(f"robotics pathway: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
