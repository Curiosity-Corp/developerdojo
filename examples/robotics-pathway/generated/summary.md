# Robotics pathway results

Computed by `tools/robotics_pathway.py` on the open UR5 description, in simulation only. No real robot moved, and
nothing here is a safety assessment of any robot cell.

- Worked examples: 188 of 188 values printed in the Modern Robotics code library reproduced (12 functions).
- The description against Universal Robots' DH table: 6 of 6 lengths equal.
- Forward kinematics: three methods agree within 2.9e-10 at 5 configurations.
- Joint solutions: pick from near solved in 2 steps; pick from elbow-other-way solved in 3 steps; place from near solved in 3 steps; beyond-reach from near no solution.
- 3 of 4 solves found a solution; each one checked again by the joint chain.
- Randori cards: A 807.64 mm; B 0.29 mm; C 189.30 mm; D det 0.000000.
