# Health pathway results

Computed by `tools/health_pathway.py` with the method CDC publishes for its BMI-for-age growth charts. This is
practice on fictional children, not a clinical assessment of any real child, and not medical advice.

- Worked examples: 24 of 24 values CDC prints reproduced (four examples on the extended
  BMI-for-age data files page and one on the child and teen BMI categories page).
- The 2022 table: 12702 of 12702 printed percentiles and z-score values recomputed within one unit of
  the last printed digit; 12654 match exactly when rounded.
- The 2000 table: 4380 printed percentiles recomputed within 1e-06 kg/m2 (largest difference 2.5e-07);
  L, M and S are the same in both files (438 rows), as CDC states.
- The fictional children: A healthy weight (29.18); B underweight (2.67); C overweight (90.24); D obesity (97.00); E severe obesity (99.84); F unavailable.
- Randori cards: A severe obesity to severe obesity; B overweight to overweight; C overweight to overweight; D obesity to healthy weight.
